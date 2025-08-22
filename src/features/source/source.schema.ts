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

// API response validation

const sourceListData = z.array(
  z.object({
    _id: z.string(),
    name: z.string(),
    type: z.enum(Object.values(ESourceType)),
    budget: z.object({ amount: z.number(), interval: z.enum(Object.values(EBudgetInterval)) }).optional(),
    income: z.number().catch(0),
    expense: z.number().catch(0),
  }),
);

const sourceListWihBasicData = z.array(
  z.object({
    _id: z.string(),
    name: z.string(),
  }),
);

export const sourceSchema = {
  // Form validation
  source,

  // API response validation
  sourceListData,
  sourceListWihBasicData,
};

export type TSourceFormData = z.infer<typeof source>;
