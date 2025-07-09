import {
  BorrowLendTransactionSchema,
  InitialTransactionSchema,
  RegularTransactionSchema,
  Transaction,
  TransactionSchema,
  TransactionType,
  TransferTransactionSchema,
} from '@/schema/transaction.schema';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Transaction.name,
        useFactory: () => {
          const schema = TransactionSchema;
          schema.discriminator(TransactionType.INITIAL, InitialTransactionSchema);
          schema.discriminator(TransactionType.REGULAR, RegularTransactionSchema);
          schema.discriminator(TransactionType.TRANSFER, TransferTransactionSchema);
          schema.discriminator(TransactionType.BORROW_LEND, BorrowLendTransactionSchema);

          return schema;
        },
      },
    ]),
  ],

  providers: [TransactionService],
  exports: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
