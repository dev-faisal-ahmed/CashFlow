import { Model, Schema, model, models } from "mongoose";
import { EUserProvider, IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: String,
    image: String,
    provider: { type: String, enum: Object.values(EUserProvider), required: true },
  },
  { timestamps: true },
);

export const UserModel: Model<IUser> = (models.user as Model<IUser>) ?? model<IUser>("user", userSchema);
