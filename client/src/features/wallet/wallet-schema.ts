import { capitalize } from "@/lib/utils";
import { z } from "zod";

export const addWalletFormSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Wallet name can not be empty")
    .transform((value) => capitalize(value)),

  initialBalance: z.number().nonnegative("Initial balance can not be empty").optional(),
  isSaving: z.boolean(),
});

export const updateWalletFormSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Wallet name can not be empty")
    .transform((value) => capitalize(value)),

  isSaving: z.boolean(),
});
