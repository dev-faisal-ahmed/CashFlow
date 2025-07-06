import { capitalize } from "@/lib/utils";
import { z } from "zod";

const budgetSchema = z.object({
  amount: z.number().nonnegative("Budget can not be empty"),
  interval: z.string(),
});

export const sourceSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Source name can not be empty")
    .transform((value) => capitalize(value)),

  addBudget: z.boolean(),
  budget: budgetSchema.optional(),
}).superRefine((value, ctx)=>{
  if(value.addBudget && !value.budget?.amount)
    ctx.addIssue({code: "custom", message: "Amount is required", path: ["budget.amount"]})
  
});
