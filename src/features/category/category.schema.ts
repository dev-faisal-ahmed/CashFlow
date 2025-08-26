import z from "zod";
import { capitalize } from "@/lib/utils";
import { EBudgetInterval, ECategoryType } from "@/server/db/schema";

// Form validation
const budgetSchema = z.object({
  amount: z.number().nonnegative("Budget amount can not be empty"),
  interval: z.enum(Object.values(EBudgetInterval)),
});

const category = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty("Category name can not be empty")
      .transform((value) => capitalize(value)),

    type: z.enum(Object.values(ECategoryType)),
    addBudget: z.boolean(),
    budget: budgetSchema.optional(),
  })
  .superRefine((value, ctx) => {
    if (value.addBudget && !value.budget?.amount)
      ctx.addIssue({ code: "custom", message: "Budget amount is required", path: ["budget.amount"] });
    if (value.addBudget && !value.budget?.interval)
      ctx.addIssue({ code: "custom", message: "Budget interval is required", path: ["budget.interval"] });
  });

export const categorySchema = {
  category,
};

export type TCategoryFormData = z.infer<typeof category>;
