import { startSession, Types } from "mongoose";
import { CreateRegularTransactionDto, GetTransactionsArgs } from "./transaction.validation";
import { RegularTransactionModel, TransactionModel } from "./transaction.schema";
import { ETransactionNature, ETransactionType } from "./transaction.interface";
import { WalletModel } from "../wallet/wallet.schema";
import { AppError } from "@/server/core/app.error";
import { PaginationHelper } from "@/server/helpers/pagination.helper";
import { QueryHelper } from "@/server/helpers/query.helper";
import { WithUserId } from "@/server/types";

// Types
type CreateRegularTransaction = { dto: CreateRegularTransactionDto; userId: Types.ObjectId };
type GetTransactions = WithUserId<{ query: GetTransactionsArgs }>;

export class TransactionService {
  static async createRegularTransaction({ dto, userId }: CreateRegularTransaction) {
    const wallet = await WalletModel.findOne({ _id: dto.walletId }, { balance: 1 }).lean();
    if (!wallet) throw new AppError("Wallet not found", 404);
    if (dto.nature === ETransactionNature.expense && wallet.balance < dto.amount) throw new AppError("Insufficient balance", 400);

    const session = await startSession();
    session.startTransaction();

    try {
      const [transaction] = await RegularTransactionModel.create(
        [
          {
            ownerId: userId,
            amount: dto.amount,
            walletId: dto.walletId,
            sourceId: dto.sourceId,
            date: dto.date,
            description: dto.description,
            nature: ETransactionNature.income,
          },
        ],
        { session },
      );

      if (!transaction) throw new AppError("Failed to create initial transaction", 500);

      const walletUpdateResult = await WalletModel.updateOne(
        { _id: dto.walletId },
        { $inc: { balance: dto.nature === ETransactionNature.income ? dto.amount : -dto.amount } },
        { session },
      );

      if (!walletUpdateResult.matchedCount) throw new AppError("Failed to update wallet balance", 500);

      await session.commitTransaction();
      return transaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  static async getRegularTransactions({ query, userId }: GetTransactions) {
    const { page, nature, startDate, endDate } = query;
    const paginationHelper = new PaginationHelper(page, query.limit, query.getAll);

    const dbQuery = {
      type: ETransactionType.regular,
      ownerId: userId,
      ...(nature && { nature }),
      ...((startDate || endDate) && {
        date: {
          ...(startDate && { $gte: startDate }),
          ...(endDate && { $lte: endDate }),
        },
      }),
    };

    const { getAll, skip, limit } = paginationHelper.getPaginationInfo();
    const fields = QueryHelper.selectFields(query.fields, [
      "_id",
      "ownerId",
      "amount",
      "description",
      "date",
      "wallet.name",
      "source.name",
    ]);

    const [result] = await TransactionModel.aggregate([
      { $match: dbQuery },
      {
        $facet: {
          transactions: [
            ...(!getAll ? [{ $skip: skip }, { $limit: limit }] : []),
            { $lookup: { from: "wallets", localField: "walletId", foreignField: "_id", as: "wallet" } },
            { $lookup: { from: "sources", localField: "sourceId", foreignField: "_id", as: "source" } },
            { $unwind: "$wallet" },
            { $unwind: "$source" },
            ...(fields ? [{ $project: fields }] : []),
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const transactions = result.transactions;
    const total = result.total[0]?.count ?? 0;
    const meta = paginationHelper.getMeta(total);

    return { transactions, meta };
  }
}
