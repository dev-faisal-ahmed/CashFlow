import { Types } from "mongoose";
import { SourceModel } from "./source.schema";
import { CreateSourceDto, GetSourcesArgs } from "./source.validation";
import { PaginationHelper } from "@/server/helpers/pagination.helper";
import { QueryHelper } from "@/server/helpers/query.helper";
import { AppError } from "@/server/core/app.error";
import { EBudgetInterval, ESourceType, ISource } from "./source.interface";
import { ETransactionNature, ETransactionType } from "../transaction/transaction.interface";

// Types
type CreateSource = { dto: CreateSourceDto; ownerId: Types.ObjectId };
type GetSources = { query: GetSourcesArgs; ownerId: Types.ObjectId };
type UpdateSource = { id: string; dto: Partial<ISource> };
type IsOwner = { sourceId: string; userId: Types.ObjectId };

export class SourceRepository {
  async createSource({ dto, ownerId }: CreateSource) {
    return SourceModel.create({ ...dto, ownerId });
  }

  async getSources({ query, ownerId }: GetSources) {
    const { search, type, page } = query;
    const requestedFields = query.fields;
    const paginationHelper = new PaginationHelper(page, query.limit, query.getAll);
    const now = new Date();

    const dbQuery = {
      isDeleted: false,
      ownerId,
      ...(search && { name: { $regex: search, $options: "i" } }),
      ...(type && { type: { $in: [type, ESourceType.both] } }),
    };

    const { getAll, skip, limit } = paginationHelper.getPaginationInfo();
    const fields = QueryHelper.selectFields(requestedFields, ["_id", "name", "type", "ownerId", "budget", "income", "expense"]);

    const sources = await SourceModel.aggregate([
      { $match: dbQuery },
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
    ]);

    const total = await SourceModel.countDocuments(dbQuery);
    const meta = paginationHelper.getMeta(total);

    return { sources, meta };
  }

  async updateSource({ id, dto }: UpdateSource) {
    return SourceModel.updateOne({ _id: id }, dto);
  }

  // helper
  async isOwner({ sourceId, userId }: IsOwner) {
    const source = await SourceModel.findOne({ _id: sourceId }, { ownerId: 1 }).lean();
    if (!source) throw new AppError("Source not found!", 404);
    return source.ownerId.equals(userId);
  }
}
