import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum TransactionType {
  INITIAL = 'INITIAL',
  REGULAR = 'REGULAR',
  TRANSFER = 'TRANSFER',
  BORROW_LEND = 'BORROW_LEND',
}

export enum TransactionNature {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

// Base Schema
@Schema({ collection: 'transactions', discriminatorKey: 'type', timestamps: true })
export class Transaction {
  @Prop({ type: Number, min: 0, required: true })
  amount: number;

  type: TransactionType;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({ type: Date, default: new Date(), required: false })
  date: Date;
}

// Initial Transaction Schema
@Schema()
export class InitialTransaction extends Transaction {
  @Prop({ type: Types.ObjectId, ref: 'Wallet', required: true })
  walletId: Types.ObjectId;

  @Prop({ enum: TransactionNature, required: true })
  nature: TransactionNature;
}

// Regular Transaction Schema
@Schema()
export class RegularTransaction extends Transaction {
  @Prop({ type: Types.ObjectId, ref: 'Source', required: true })
  sourceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Wallet', required: true })
  walletId: Types.ObjectId;

  @Prop({ enum: TransactionNature, required: true })
  nature: TransactionNature;
}

// Transfer Transaction Schema
@Schema()
export class TransferTransaction extends Transaction {
  @Prop({ type: Types.ObjectId, ref: 'Wallet', required: true })
  sourceWalletId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Wallet', required: true })
  destinationWalletId: Types.ObjectId;
}

// Borrow Lend Transaction Schema
@Schema()
export class BorrowLendTransaction extends Transaction {
  @Prop({ type: Types.ObjectId, ref: 'Wallet', required: true })
  walletId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Contact', required: true })
  contactId: Types.ObjectId;

  @Prop({ enum: TransactionNature, required: true })
  nature: TransactionNature;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
export const InitialTransactionSchema = SchemaFactory.createForClass(InitialTransaction);
export const RegularTransactionSchema = SchemaFactory.createForClass(RegularTransaction);
export const TransferTransactionSchema = SchemaFactory.createForClass(TransferTransaction);
export const BorrowLendTransactionSchema = SchemaFactory.createForClass(BorrowLendTransaction);

export type InitialTransactionDocument = HydratedDocument<InitialTransaction>;
export type RegularTransactionDocument = HydratedDocument<RegularTransaction>;
export type TransferTransactionDocument = HydratedDocument<TransferTransaction>;
export type BorrowLendTransactionDocument = HydratedDocument<BorrowLendTransaction>;

export type TransactionDocument =
  | InitialTransactionDocument
  | RegularTransactionDocument
  | TransferTransactionDocument
  | BorrowLendTransactionDocument;

export type TTransaction = Pick<TransactionDocument, '_id' | 'amount' | 'type' | 'date' | 'description'>;
export type TInitialTransaction = Pick<InitialTransactionDocument, '_id' | 'amount' | 'type' | 'nature' | 'date' | 'description'>;
export type TRegularTransaction = Pick<RegularTransactionDocument, '_id' | 'amount' | 'type' | 'nature' | 'date' | 'description'>;
export type TTransferTransaction = Pick<TransferTransactionDocument, '_id' | 'amount' | 'type' | 'date' | 'description'>;
export type TBorrowLendTransaction = Pick<BorrowLendTransactionDocument, '_id' | 'amount' | 'type' | 'nature' | 'date' | 'description'>;
