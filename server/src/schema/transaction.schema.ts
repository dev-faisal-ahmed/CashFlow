import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum TransactionNature {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

@Schema({ collection: 'transactions', discriminatorKey: 'type', timestamps: true })
export class Transaction {
  @Prop({ type: Number, min: 0, required: true })
  amount: number;

  @Prop({ enum: TransactionNature, required: true })
  nature: TransactionNature;

  @Prop({ type: String, required: true })
  walletId: string;

  @Prop({ required: false })
  description?: string;
}

// Discriminators
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
// to do : add more discriminator schemas

export type TransactionDocument = HydratedDocument<Transaction>;
export type TTransaction = Pick<TransactionDocument, '_id' | 'walletId' | 'description'>;
