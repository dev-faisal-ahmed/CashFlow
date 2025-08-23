import z from "zod";

import { capitalize } from "@/lib/utils";
import { commonValidation } from "@/server/common/validation";
import { EBudgetInterval, ECategoryType } from "@/server/db/schema";

// Json
const budget = z.object({
  amount: z.number("Budget amount is required").positive("Budget amount can not be negative"),
  interval: z.enum(Object.values(EBudgetInterval), "Invalid budget interval"),
});

const createCategory = z.object({
  name: z
    .string("Name is required")
    .trim()
    .nonempty("Name can not be empty")
    .transform((v) => capitalize(v)),

  type: z.enum(Object.values(ECategoryType)),
  budget: z.optional(budget),
});

const updateCategory = z
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
const getCategories = commonValidation.queryWithPagination.and(
  z.object({
    type: z.enum(Object.values(ECategoryType), "Invalid Category Type").optional(),
  }),
);

export const categoryValidation = {
  // Json
  createCategory,
  updateCategory,

  // Query
  getCategories,
};

export type CreateCategoryDto = z.infer<typeof createCategory>;
export type UpdateCategoryDto = z.infer<typeof updateCategory>;

export type GetCategoriesArgs = z.infer<typeof getCategories>;
