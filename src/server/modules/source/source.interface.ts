import { Types } from "mongoose";

export interface ISource {
  _id: Types.ObjectId;
  name: string;
  type: ESourceType;
  ownerId: Types.ObjectId;
  budget?: IBudget;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum EBudgetInterval {
  weekly = "weekly",
  monthly = "monthly",
  yearly = "yearly",
}

export enum ESourceType {
  income = "income",
  expense = "expense",
  both = "both",
}

export interface IBudget {
  amount: number;
  interval: EBudgetInterval;
}
