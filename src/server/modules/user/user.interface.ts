import { Schema } from "mongoose";

export interface IUser {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  image?: string;
  provider: EUserProvider;
}

export enum EUserProvider {
  credentials = "credentials",
  google = "google",
}
