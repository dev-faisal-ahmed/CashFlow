import z from "zod";
import { capitalize } from "@/lib/utils";

// Form Validation
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
  amount: z.number().positive("Amount can not be negative"),
  description: z.string().optional(),
  sourceWalletId: z.string().nonempty("Source wallet can not be empty"),
  destinationWalletId: z.string().nonempty("Destination wallet can not be empty"),
});

// Api Response Validation
const walletListData = z.array(
  z.object({
    _id: z.string(),
    name: z.string(),
    isSaving: z.boolean().optional().default(false),
    balance: z.number(),
  }),
);

const walletListDataForTransfer = z.array(
  z.object({
    _id: z.string(),
    name: z.string(),
    balance: z.number(),
  }),
);

export const walletSchema = {
  // Form Validation
  addWallet,
  updateWallet,
  walletTransfer,

  // Api Response Validation
  walletListData,
  walletListDataForTransfer,
};

export type TAddWalletFormData = z.infer<typeof addWallet>;
export type TUpdateWalletFormData = z.infer<typeof updateWallet>;
export type TWalletTransferFormData = z.infer<typeof walletTransfer>;

export type TWalletFormData = TAddWalletFormData | TUpdateWalletFormData;
