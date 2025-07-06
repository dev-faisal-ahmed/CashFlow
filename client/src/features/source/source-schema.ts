import { capitalize } from "@/lib/utils";
import { z } from "zod";

const budgetSchema = z.object({
  amount: z.number().nonnegative("Budget can not be empty"),
  interval: z.string().nonempty("Interval is required"),
});

export const sourceSchema = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty("Source name can not be empty")
      .transform((value) => capitalize(value)),

    type: z.string().nonempty("Type is required"),
    addBudget: z.boolean(),
    budget: budgetSchema.optional(),
  })
  .superRefine((value, ctx) => {
    if (value.addBudget && !value.budget?.amount) ctx.addIssue({ code: "custom", message: "Amount is required", path: ["budget.amount"] });
    if (value.addBudget && !value.budget?.interval) ctx.addIssue({ code: "custom", message: "Interval is required", path: ["budget.interval"] });
  });
