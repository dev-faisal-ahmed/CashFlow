import { startSession, Types } from "mongoose";
import { CreateRegularTransactionDto } from "./transaction.validation";
import { InitialTransactionModel } from "./transaction.schema";
import { ETransactionNature } from "./transaction.interface";
import { WalletModel } from "../wallet/wallet.schema";
import { AppError } from "@/server/core/app.error";

// Types
type CreateRegularTransaction = { dto: CreateRegularTransactionDto; userId: Types.ObjectId };

export class TransactionService {
  static async createRegularTransaction({ dto, userId }: CreateRegularTransaction) {
    const wallet = await WalletModel.findOne({ _id: dto.walletId }, { balance: 1 }).lean();
    if (!wallet) throw new AppError("Wallet not found", 404);
    if (dto.nature === ETransactionNature.expense && wallet.balance < dto.amount) throw new AppError("Insufficient balance", 400);

    const session = await startSession();
    session.startTransaction();

    try {
      const [transaction] = await InitialTransactionModel.create(
        [
          {
            ownerId: userId,
            amount: dto.amount,
            walletId: dto.walletId,
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
}
