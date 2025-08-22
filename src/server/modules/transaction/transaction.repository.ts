import { ClientSession } from "mongoose";
import { ETransactionNature, IInitialTransaction, IRegularTransaction, ITransferTransaction } from "./transaction.interface";
import { InitialTransactionModel, RegularTransactionModel, TransferTransactionModel } from "./transaction.schema";

// Types
type CreateInitialTransaction = {
  dto: Pick<IInitialTransaction, "ownerId" | "amount" | "walletId" | "description">;
  session: ClientSession;
};

type CreateTransferTransaction = Pick<
  ITransferTransaction,
  "ownerId" | "amount" | "sourceWalletId" | "destinationWalletId" | "description"
>;

type CreateRegularTransaction = Pick<
  IRegularTransaction,
  "amount" | "date" | "description" | "nature" | "sourceId" | "ownerId" | "walletId"
>;

export class TransactionRepository {
  async createInitialTransaction({ dto, session }: CreateInitialTransaction) {
    return InitialTransactionModel.create([{ ...dto, nature: ETransactionNature.income }], { session });
  }

  async createTransferTransaction(dto: CreateTransferTransaction) {
    return TransferTransactionModel.create({ ...dto });
  }

  async createRegularTransaction(dto: CreateRegularTransaction) {
    return RegularTransactionModel.create({ ...dto });
  }
}
