import { capitalize } from "@/lib/utils";
import { z } from "zod";

const addWallet = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Wallet name can not be empty")
    .transform((value) => capitalize(value)),

  initialBalance: z.number().nonnegative("Initial balance can not be empty").optional(),
  isSaving: z.boolean(),
});

const updateWallet = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Wallet name can not be empty")
    .transform((value) => capitalize(value)),

  isSaving: z.boolean(),
});

const walletTransfer = z.object({
  amount: z.number().nonnegative("Amount can not be empty"),
  description: z.string().optional(),
  sourceWalletId: z.string().nonempty("Source wallet can not be empty"),
  destinationWalletId: z.string().nonempty("Destination wallet can not be empty"),
});

export const walletSchema = { addWallet, updateWallet, walletTransfer };

export type TAddWalletFormData = z.infer<typeof addWallet>;
export type TUpdateWalletFormData = z.infer<typeof updateWallet>;
export type TWalletTransferFormData = z.infer<typeof walletTransfer>;
