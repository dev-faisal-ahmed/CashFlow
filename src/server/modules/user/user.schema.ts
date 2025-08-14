import { Model, Schema, model, models } from "mongoose";
import { EUserProvider, TUser } from "./user.interface";

const userSchema = new Schema<TUser>(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: String,
    image: String,
    provider: { type: String, enum: Object.values(EUserProvider), required: true },
  },
  { timestamps: true },
);

export const UserModel: Model<TUser> = (models.user as Model<TUser>) ?? model<TUser>("user", userSchema);
