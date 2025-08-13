import { z } from "zod";
import { addWalletFormSchema, updateWalletFormSchema, walletTransferFormSchema } from "./wallet-schema";

export type TAddWalletForm = z.infer<typeof addWalletFormSchema>;
export type TUpdateWalletForm = z.infer<typeof updateWalletFormSchema>;
export type TWalletForm = TAddWalletForm | TUpdateWalletForm;
export type TWalletTransferForm = z.infer<typeof walletTransferFormSchema>;
