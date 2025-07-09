import {
  BorrowLendTransactionSchema,
  InitialTransactionSchema,
  RegularTransactionSchema,
  Transaction,
  TransactionSchema,
  TransactionType,
  TransferTransactionSchema,
} from '@/schema/transaction.schema';

import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { WalletModule } from '../wallet/wallet.module';
import { AuthModule } from '../auth/auth.module';

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

    AuthModule,
    forwardRef(() => WalletModule),
  ],

  providers: [TransactionService],
  exports: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
