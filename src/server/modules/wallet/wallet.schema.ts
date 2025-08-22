import { model, Model, models, Schema } from "mongoose";
import { IWallet } from "./wallet.interface";

export const walletSchema = new Schema<IWallet>(
  {
    name: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    balance: { type: Number, default: 0 },
    isSaving: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Applying indexing
walletSchema.index({ ownerId: 1, isDeleted: 1 });

export const WalletModel: Model<IWallet> = models.wallet ?? model("wallet", walletSchema);
