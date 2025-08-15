import z from "zod";
import { capitalize } from "@/lib/utils";

const createWallet = z.object({
  name: z
    .string("Name is required")
    .trim()
    .nonempty("Name can not be empty")
    .transform((v) => capitalize(v)),

  initialBalance: z.number().positive("Balance can not be negative").optional(),
  isSaving: z.boolean().optional(),
});

export const walletValidation = { createWallet };

export type CreateWalletDto = z.infer<typeof createWallet>;
