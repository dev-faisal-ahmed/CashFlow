import { capitalize } from "@/lib/utils";
import { z } from "zod";

const budgetSchema = z.object({
  budget: z.number().nonnegative("Budget can not be empty"),
  interval: z.string(),
});

export const sourceSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Source name can not be empty")
    .transform((value) => capitalize(value)),

  addBudget: z.boolean().optional(),
  budget: budgetSchema.optional(),
});
