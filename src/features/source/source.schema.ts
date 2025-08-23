import z from "zod";
import { capitalize } from "@/lib/utils";
import { EBudgetInterval, ESourceType } from "@/server/modules/source/source.interface";

// Form validation
const budgetSchema = z.object({
  amount: z.number().nonnegative("Budget can not be empty"),
  interval: z.enum(Object.values(EBudgetInterval)),
});

const source = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty("Source name can not be empty")
      .transform((value) => capitalize(value)),

    type: z.enum(Object.values(ESourceType)),
    addBudget: z.boolean(),
    budget: budgetSchema.optional(),
  })
  .superRefine((value, ctx) => {
    if (value.addBudget && !value.budget?.amount) ctx.addIssue({ code: "custom", message: "Amount is required", path: ["budget.amount"] });
    if (value.addBudget && !value.budget?.interval)
      ctx.addIssue({ code: "custom", message: "Interval is required", path: ["budget.interval"] });
  });

export const sourceSchema = {
  source,
};

export type TSourceFormData = z.infer<typeof source>;
