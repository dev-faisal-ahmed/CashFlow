import { ClientSession } from "mongoose";
import { ETransactionNature, ETransactionType, IInitialTransaction, ITransferTransaction } from "./transaction.interface";
import { InitialTransaction, TransferTransaction } from "./transaction.schema";

export class TransactionRepository {
  async createInitialTransaction(dto: CreateInitialTransactionDto, session: ClientSession) {
    return InitialTransaction.create([{ ...dto, type: ETransactionType.initial, nature: ETransactionNature.income }], { session });
  }

  async createTransferTransaction(dto: CreateTransferTransactionDto) {
    return TransferTransaction.create(dto);
  }
}

type CreateInitialTransactionDto = Pick<IInitialTransaction, "ownerId" | "amount" | "walletId" | "description">;

type CreateTransferTransactionDto = Pick<
  ITransferTransaction,
  "ownerId" | "amount" | "sourceWalletId" | "destinationWalletId" | "description"
>;
