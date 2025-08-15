import { Types } from "mongoose";

export enum ETransactionType {
  initial = "initial",
  regular = "regular",
  transfer = "transfer",
  peerTransfer = "peer-transfer",
}

export enum ETransactionNature {
  income = "income",
  expense = "expense",
}

// Base Transaction Interface
export interface IBaseTransaction {
  _id?: Types.ObjectId;
  ownerId: Types.ObjectId;
  amount: number;
  type: ETransactionType;
  description?: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Initial Transaction Interface
export interface IInitialTransaction extends IBaseTransaction {
  type: ETransactionType.initial;
  walletId: Types.ObjectId;
  nature: ETransactionNature;
}

// Regular Transaction Interface
export interface IRegularTransaction extends IBaseTransaction {
  type: ETransactionType.regular;
  sourceId: Types.ObjectId;
  walletId: Types.ObjectId;
  nature: ETransactionNature;
}

// Transfer Transaction Interface
export interface ITransferTransaction extends IBaseTransaction {
  type: ETransactionType.transfer;
  sourceWalletId: Types.ObjectId;
  destinationWalletId: Types.ObjectId;
}

// Borrow/Lend Transaction Interface
export interface IPeerTransferTransaction extends IBaseTransaction {
  type: ETransactionType.peerTransfer;
  walletId: Types.ObjectId;
  contactId: Types.ObjectId;
  nature: ETransactionNature;
}

// Union type for all transaction types
export type TAnyTransaction = IInitialTransaction | IRegularTransaction | ITransferTransaction | IPeerTransferTransaction;
