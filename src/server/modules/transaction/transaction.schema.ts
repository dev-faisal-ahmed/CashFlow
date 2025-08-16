import {
  ETransactionNature,
  ETransactionType,
  IInitialTransaction,
  IPeerTransferTransaction,
  IRegularTransaction,
  IBaseTransaction,
  ITransferTransaction,
} from "./transaction.interface";

import { Model, Schema, model, models } from "mongoose";

// Base Transaction Schema
const transactionSchema = new Schema<IBaseTransaction>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, enum: Object.values(ETransactionType), required: true },
    description: { type: String, trim: true },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true, discriminatorKey: "type" },
);

// Initial Transaction Schema
const initialTransactionSchema = new Schema<IInitialTransaction>({
  walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
  nature: { type: String, enum: Object.values(ETransactionNature), required: true },
});

// Regular Transaction Schema
const regularTransactionSchema = new Schema<IRegularTransaction>({
  sourceId: { type: Schema.Types.ObjectId, ref: "Source", required: true },
  walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
  nature: { type: String, enum: Object.values(ETransactionNature), required: true },
});

// Transfer Transaction Schema
const transferTransactionSchema = new Schema<ITransferTransaction>({
  sourceWalletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
  destinationWalletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
});

// Peer Transfer Transaction Schema
const peerTransferTransactionSchema = new Schema<IPeerTransferTransaction>({
  walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
  contactId: { type: Schema.Types.ObjectId, ref: "Contact", required: true },
  nature: { type: String, enum: Object.values(ETransactionNature), required: true },
});

// applying indexing
transactionSchema.index({ ownerId: 1, date: -1 });

// Create the base model
export const TransactionModel: Model<IBaseTransaction> = models.transaction ?? model("transaction", transactionSchema);

// Create discriminator models
export const InitialTransaction: Model<IInitialTransaction> =
  TransactionModel.discriminators?.[ETransactionType.initial] ||
  TransactionModel.discriminator(ETransactionType.initial, initialTransactionSchema);

export const RegularTransaction: Model<IRegularTransaction> =
  TransactionModel.discriminators?.[ETransactionType.regular] ||
  TransactionModel.discriminator(ETransactionType.regular, regularTransactionSchema);

export const TransferTransaction: Model<ITransferTransaction> =
  TransactionModel.discriminators?.[ETransactionType.transfer] ||
  TransactionModel.discriminator(ETransactionType.transfer, transferTransactionSchema);

export const PeerTransferTransaction: Model<IPeerTransferTransaction> =
  TransactionModel.discriminators?.[ETransactionType.peerTransfer] ||
  TransactionModel.discriminator(ETransactionType.peerTransfer, peerTransferTransactionSchema);
