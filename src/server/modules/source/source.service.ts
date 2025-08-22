import { AppError } from "@/server/core/app.error";
import { CreateSourceDto, GetSourcesArgs, UpdateSourceDto } from "./source.validation";
import { WithUserId } from "@/server/types";
import { SourceModel } from "./source.schema";
import { PaginationHelper } from "@/server/helpers/pagination.helper";
import { EBudgetInterval, ESourceType } from "./source.interface";
import { QueryHelper } from "@/server/helpers/query.helper";
import { ETransactionNature, ETransactionType } from "../transaction/transaction.interface";
import { Types } from "mongoose";

// Types
type GetSource = WithUserId<{ query: GetSourcesArgs }>;
type CreateSource = WithUserId<{ dto: CreateSourceDto }>;
type UpdateSource = WithUserId<{ id: string; dto: UpdateSourceDto }>;
type DeleteSource = WithUserId<{ id: string }>;
type IsOwner = { id: string; userId: Types.ObjectId };

export class SourceService {
  static async createSource({ dto, userId }: CreateSource) {
    return SourceModel.create({ ...dto, ownerId: userId });
  }

  static async getSources({ query, userId }: GetSource) {
    const { search, type, page } = query;
    const requestedFields = query.fields;
    const paginationHelper = new PaginationHelper(page, query.limit, query.getAll);
    const now = new Date();

    const dbQuery = {
      isDeleted: false,
      ownerId: userId,
      ...(search && { name: { $regex: search, $options: "i" } }),
      ...(type && { type: { $in: [type, ESourceType.both] } }),
    };

    const { getAll, skip, limit } = paginationHelper.getPaginationInfo();
    const fields = QueryHelper.selectFields(requestedFields, ["_id", "name", "type", "ownerId", "budget", "income", "expense"]);

    const [result] = await SourceModel.aggregate([
      { $match: dbQuery },

      {
        $facet: {
          sources: [
            ...(!getAll ? [{ $skip: skip }, { $limit: limit }] : []),

            // adding this stage when user needs income or expense
            ...(requestedFields?.includes("income") || requestedFields?.includes("expense")
              ? [
                  { $addFields: { now: now, interval: { $ifNull: ["$budget.interval", EBudgetInterval.monthly] } } },

                  {
                    $addFields: {
                      startDate: {
                        $switch: {
                          branches: [
                            {
                              case: { $eq: ["$interval", EBudgetInterval.weekly] },
                              then: { $dateTrunc: { date: "$now", unit: "week", binSize: 1 } },
                            },
                            {
                              case: { $eq: ["$interval", EBudgetInterval.monthly] },
                              then: { $dateTrunc: { date: "$now", unit: "month", binSize: 1 } },
                            },
                            {
                              case: { $eq: ["$interval", EBudgetInterval.yearly] },
                              then: { $dateTrunc: { date: "$now", unit: "year", binSize: 1 } },
                            },
                            {
                              case: { $eq: ["$interval", EBudgetInterval.yearly] },
                              then: { $dateTrunc: { date: "$now", unit: "year", binSize: 1 } },
                            },
                          ],

                          default: { $dateTrunc: { date: "$now", unit: "month", binSize: 1 } },
                        },
                      },
                    },
                  },

                  {
                    $lookup: {
                      from: "transactions",
                      let: { sourceId: "$_id" },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $and: [
                                { $eq: ["$type", ETransactionType.regular] },
                                { $eq: ["$sourceId", "$$sourceId"] },
                                { $gte: ["$date", "$startDate"] },
                                { $lte: ["$date", "$now"] },
                                { $in: ["$nature", [ETransactionNature.income, ETransactionNature.expense]] },
                              ],
                            },
                          },
                        },
                        { $project: { amount: 1, nature: 1 } },
                      ],
                      as: "transactions",
                    },
                  },

                  // adding stage when user asks for income
                  ...(requestedFields.includes("income")
                    ? [
                        {
                          $addFields: {
                            income: {
                              $sum: {
                                $map: {
                                  input: "$transactions",
                                  as: "tx",
                                  in: { $cond: [{ $eq: ["$$tx.nature", ETransactionNature.income] }, "$$tx.amount", 0] },
                                },
                              },
                            },
                          },
                        },
                      ]
                    : []),

                  // adding stage when user asks for expense
                  ...(requestedFields.includes("expense")
                    ? [
                        {
                          $addFields: {
                            expense: {
                              $sum: {
                                $map: {
                                  input: "$transactions",
                                  as: "tx",
                                  in: { $cond: [{ $eq: ["$$tx.nature", ETransactionNature.expense] }, "$$tx.amount", 0] },
                                },
                              },
                            },
                          },
                        },
                      ]
                    : []),

                  { $project: { transactions: 0 } },
                ]
              : []),

            ...(fields ? [{ $project: fields }] : []),
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const sources = result.sources;
    const total = result.total[0].count;
    const meta = paginationHelper.getMeta(total);

    return { sources, meta };
  }

  static async updateSource({ dto, id, userId }: UpdateSource) {
    const isOwner = await this.isOwner({ id, userId });
    if (!isOwner) throw new AppError("You are not authorized to update this source", 401);

    const { addBudget, budget, ...rest } = dto;
    return SourceModel.updateOne({ _id: id }, { $set: { ...rest, ...(addBudget && { budget }) } });
  }

  static async deleteSource({ id, userId }: DeleteSource) {
    const isOwner = await this.isOwner({ id, userId });
    if (!isOwner) throw new AppError("You are not authorized to delete this source", 401);

    return SourceModel.updateOne({ _id: id }, { $set: { isDeleted: true } });
  }

  static async isOwner({ id, userId }: IsOwner) {
    const source = await SourceModel.findOne({ _id: id }, { ownerId: 1 }).lean();
    if (!source) throw new AppError("Source not found!", 404);
    return source.ownerId.equals(userId);
  }
}
