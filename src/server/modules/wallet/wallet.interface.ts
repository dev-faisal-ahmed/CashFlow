import { Types } from "mongoose";

export interface IWallet {
  _id: Types.ObjectId;
  name: string;
  ownerId: Types.ObjectId;
  income: number;
  expense: number;
  balance: number;
  isSaving?: boolean;
  isDeleted?: boolean;
}
