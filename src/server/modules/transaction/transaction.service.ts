import { Types } from "mongoose";
import { CreateRegularTransactionDto } from "./transaction.validation";
import { InitialTransactionModel } from "./transaction.schema";
import { ETransactionNature } from "./transaction.interface";

// Types
type CreateRegularTransaction = { dto: CreateRegularTransactionDto; userId: Types.ObjectId };

export class TransactionService {
  static async createRegularTransaction({ dto, userId }: CreateRegularTransaction) {
    return InitialTransactionModel.create({ ...dto, nature: ETransactionNature.income, ownerId: userId });
  }
}
