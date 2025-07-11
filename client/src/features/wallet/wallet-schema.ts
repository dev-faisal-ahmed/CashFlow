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

export const walletTransferFormSchema = z.object({
  amount: z.number().nonnegative("Amount can not be empty"),
  description: z.string().optional(),
  sourceWalletId: z.string().nonempty("Source wallet can not be empty"),
  destinationWalletId: z.string().nonempty("Destination wallet can not be empty"),
});
