import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from 'src/schema/transaction.schema';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Transaction.name,
        useFactory: () => {
          const schema = TransactionSchema;
          // to do : add discriminator schemas
          return schema;
        },
      },
    ]),
  ],
  controllers: [],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
