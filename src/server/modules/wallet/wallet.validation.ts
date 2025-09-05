import z from "zod";

import { capitalize } from "@/lib/utils";
import { commonValidation } from "@/server/common/validation";

// json
const createWallet = z.object({
  name: z
    .string("Name is required")
    .trim()
    .nonempty("Name can not be empty")
    .transform((v) => capitalize(v)),

  initialBalance: z.number().positive("Balance can not be negative").optional(),
  isSaving: z.boolean().optional(),
});

const updateWallet = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Name can not be empty")
    .transform((v) => capitalize(v))
    .optional(),

  isSaving: z.boolean().optional(),
});

// query
const getAllWallets = commonValidation.queryWithPagination.and(
  z.object({
    isSaving: z.stringbool().optional(),
  }),
);

export const walletValidation = {
  // json
  createWallet,
  updateWallet,

  // query
  getAllWallets,
};

export type CreateWalletDto = z.infer<typeof createWallet>;
export type UpdateWalletDto = z.infer<typeof updateWallet>;

export type GetAllWalletsArgs = z.infer<typeof getAllWallets>;
