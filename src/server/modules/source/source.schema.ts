import { Model, Schema, model, models } from "mongoose";
import { EBudgetInterval, ESourceType, IBudget, ISource } from "./source.interface";

const BudgetSchema = new Schema<IBudget>(
  {
    amount: { type: Number, required: true },
    interval: { type: String, enum: Object.values(EBudgetInterval), required: true },
  },
  { _id: false },
);

const SourceSchema = new Schema<ISource>(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: Object.values(ESourceType), required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    budget: { type: BudgetSchema, required: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Index for better query performance
SourceSchema.index({ ownerId: 1, isDeleted: 1 });

export const SourceModel: Model<ISource> = models.source ?? model("source", SourceSchema);
