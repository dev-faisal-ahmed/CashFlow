import { Types } from "mongoose";
import { TransactionRepository } from "./transaction.repository";
import { CreateRegularTransactionDto } from "./transaction.validation";

// Types
type CreateRegularTransaction = { dto: CreateRegularTransactionDto; userId: Types.ObjectId };

export class TransactionService {
  private transactionRepository: TransactionRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  async createRegularTransaction({ dto, userId }: CreateRegularTransaction) {
    return this.transactionRepository.createRegularTransaction({
      ...dto,
      ownerId: userId,
      sourceId: new Types.ObjectId(dto.sourceId),
      walletId: new Types.ObjectId(dto.walletId),
    });
  }
}
