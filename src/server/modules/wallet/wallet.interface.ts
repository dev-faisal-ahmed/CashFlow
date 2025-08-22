import { Types } from "mongoose";

export interface IWallet {
  _id: Types.ObjectId;
  name: string;
  ownerId: Types.ObjectId;
  balance: number;
  isSaving?: boolean;
  isDeleted?: boolean;
}
