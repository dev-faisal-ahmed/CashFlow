import { Types } from "mongoose";

export interface IWallet {
  _id: Types.ObjectId;
  name: string;
  ownerId: Types.ObjectId;
  isSaving?: boolean;
  isDeleted?: boolean;
}
