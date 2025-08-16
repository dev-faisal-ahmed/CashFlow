import { EBudgetInterval, ESourceType } from "@/server/modules/source/source.interface";

export type TSource = { _id: string; name: string; budget?: TBudget; type: ESourceType };
export type TBudget = { amount: number; interval: EBudgetInterval };
