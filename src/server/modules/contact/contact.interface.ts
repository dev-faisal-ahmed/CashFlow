import { Types } from "mongoose";

export interface IContact {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  phone: string;
  given: number;
  taken: number;
  address?: string;
  isDeleted: boolean;
}
