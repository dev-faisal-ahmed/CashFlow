import { Types } from "mongoose";

export interface IContact {
  _id: Types.ObjectId;
  name: string;
  phone: string;
  userId: Types.ObjectId;
  address?: string;
  isDeleted: boolean;
}
