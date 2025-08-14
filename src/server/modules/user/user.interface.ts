import { Types } from "mongoose";

export type TUser = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  image?: string;
  provider: EUserProvider;
};

export enum EUserProvider {
  credentials = "credentials",
  google = "google",
}
