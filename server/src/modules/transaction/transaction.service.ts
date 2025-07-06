import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Transaction, TransactionDocument, TransactionType } from '@/schema/transaction.schema';
import { CreateInitialTransactionDto } from './transaction.dto';

@Injectable()
export class TransactionService {
  constructor(@InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>) {}

  // helpers
  async createInitialTransaction(dto: CreateInitialTransactionDto, session: ClientSession) {
    const [result] = await this.transactionModel.create([{ ...dto, type: TransactionType.INITIAL }], { session });
    return result;
  }
}
