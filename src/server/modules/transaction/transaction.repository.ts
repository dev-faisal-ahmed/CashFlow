import { ClientSession } from "mongoose";
import { ETransactionNature, ETransactionType, IInitialTransaction } from "./transaction.interface";
import { InitialTransaction } from "./transaction.schema";

export class TransactionRepository {
  async createInitialTransaction(dto: CreateInitialTransactionDto, session: ClientSession) {
    return InitialTransaction.create([{ ...dto, type: ETransactionType.initial, nature: ETransactionNature.income }], { session });
  }
}

type CreateInitialTransactionDto = Pick<IInitialTransaction, "ownerId" | "amount" | "walletId" | "description">;
