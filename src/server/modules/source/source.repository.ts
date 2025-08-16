import { Types } from "mongoose";
import { CreateSourceDto, GetSourcesArgs } from "./source.validation";
import { SourceModel } from "./source.schema";
import { PaginationHelper } from "@/server/helpers/pagination.helper";
import { QueryHelper } from "@/server/helpers/query.helper";

export class SourceRepository {
  async createSource(dto: CreateSourceDto, ownerId: Types.ObjectId) {
    return SourceModel.create({ ...dto, ownerId });
  }

  async getSources(query: GetSourcesArgs, ownerId: Types.ObjectId) {
    const { search, type, page } = query;
    const requestedFields = query.fields;
    const paginationHelper = new PaginationHelper(page, query.limit, query.getAll);
    const now = new Date();

    const dbQuery = {
      isDeleted: false,
      ownerId,
      ...(search && { name: { $regex: search, $options: "i" } }),
      ...(type && { type }),
    };

    const { getAll, skip, limit } = paginationHelper.getPaginationInfo();
    const fields = QueryHelper.selectFields(query.fields, ["_id", "name", "ownerId", "isSaving", "balance"]);

    const sources = await SourceModel.aggregate([
      { $match: dbQuery },

      // adding this stage when user needs income or expense
      ...(requestedFields?.includes("income") || requestedFields?.includes("expense")
        ? [
            { $addFields: { now: now, interval: { $ifNull: ["$budget.interval", "monthly"] } } },

            {
              $addFields: {
                startDate: {
                  $switch: {
                    branches: [
                      {
                        case: { $eq: ["$interval", "weekly"] },
                        then: { $dateTrunc: { date: "$now", unit: "week", binSize: 1 } },
                      },
                      {
                        case: { $eq: ["$interval", "monthly"] },
                        then: { $dateTrunc: { date: "$now", unit: "month", binSize: 1 } },
                      },
                      {
                        case: { $eq: ["$interval", "yearly"] },
                        then: { $dateTrunc: { date: "$now", unit: "year", binSize: 1 } },
                      },
                      {
                        case: { $eq: ["$interval", "yearly"] },
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
                          { $eq: ["$type", "regular"] },
                          { $eq: ["$sourceId", "$$sourceId"] },
                          { $gte: ["$date", "$startDate"] },
                          { $lte: ["$date", "$now"] },
                          { $in: ["$nature", ["income", "expense"]] },
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
                            in: { $cond: [{ $eq: ["$$tx.nature", "income"] }, "$$tx.amount", 0] },
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
                            in: { $cond: [{ $eq: ["$$tx.nature", "expense"] }, "$$tx.amount", 0] },
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
      ...(!getAll ? [{ $skip: skip }, { $limit: limit }] : []),
    ]);

    const total = await SourceModel.countDocuments(dbQuery);
    const meta = paginationHelper.getMeta(total);

    return { sources, meta };
  }
}
