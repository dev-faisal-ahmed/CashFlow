import z from "zod";

import { capitalize } from "@/lib/utils";
import { EBudgetInterval, ESourceType } from "./source.interface";
import { commonValidation } from "@/server/common/validation";

// Json
const budget = z.object({
  amount: z.number("Budget amount is required").positive("Budget amount can not be negative"),
  interval: z.enum(Object.values(EBudgetInterval), "Invalid budget interval"),
});

const createSource = z.object({
  name: z
    .string("Name is required")
    .trim()
    .nonempty("Name can not be empty")
    .transform((v) => capitalize(v)),

  type: z.enum(Object.values(ESourceType)),
  budget: z.optional(budget),
});

const updateSource = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty()
      .transform((v) => capitalize(v))
      .optional(),

    addBudget: z.boolean().optional(),
    budget: z.optional(budget),
  })
  .superRefine((value, ctx) => {
    if (value.addBudget && !value.budget)
      ctx.addIssue({
        code: "custom",
        message: "Budget is required",
      });
  });

// Query
const getSources = commonValidation.queryWithPagination.and(
  z.object({
    type: z.enum(Object.values(ESourceType), "Invalid Source Type").optional(),
  }),
);

export const sourceValidation = {
  // Json
  createSource,
  updateSource,

  // Query
  getSources,
};

export type CreateSourceDto = z.infer<typeof createSource>;
export type UpdateSourceDto = z.infer<typeof updateSource>;

export type GetSourcesArgs = z.infer<typeof getSources>;
