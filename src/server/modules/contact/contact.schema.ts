import { model, Model, models, Schema } from "mongoose";
import { IContact } from "./contact.interface";

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const ContactModel: Model<IContact> = models.contact ?? model("contact", contactSchema);
