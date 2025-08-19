import { ClientSession } from "mongoose";
import { ETransactionNature, ETransactionType, IInitialTransaction, ITransferTransaction } from "./transaction.interface";
import { InitialTransaction, TransferTransaction } from "./transaction.schema";

// Types

type CreateInitialTransaction = {
  dto: Pick<IInitialTransaction, "ownerId" | "amount" | "walletId" | "description">;
  session: ClientSession;
};

type CreateTransferTransaction = Pick<
  ITransferTransaction,
  "ownerId" | "amount" | "sourceWalletId" | "destinationWalletId" | "description"
>;

export class TransactionRepository {
  async createInitialTransaction({ dto, session }: CreateInitialTransaction) {
    return InitialTransaction.create([{ ...dto, type: ETransactionType.initial, nature: ETransactionNature.income }], { session });
  }

  async createTransferTransaction(dto: CreateTransferTransaction) {
    return TransferTransaction.create(dto);
  }
}
