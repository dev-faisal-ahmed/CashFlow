import { model, Model, models, Schema } from "mongoose";
import { IWallet } from "./wallet.interface";

export const walletSchema = new Schema<IWallet>(
  {
    name: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    isSaving: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const WalletModel: Model<IWallet> = models.wallet ?? model("wallet", walletSchema);
