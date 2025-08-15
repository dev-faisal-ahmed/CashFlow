import { Model, Schema, model, models } from "mongoose";
import { EUserProvider, IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: String,
    image: String,
    provider: { type: String, enum: Object.values(EUserProvider), required: true },
  },
  { timestamps: true },
);

export const UserModel: Model<IUser> = models.user ?? model("user", userSchema);
