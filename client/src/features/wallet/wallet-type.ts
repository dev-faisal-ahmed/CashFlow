import { z } from "zod";
import { addWalletFormSchema, updateWalletFormSchema } from "./wallet-schema";

export type TAddWalletForm = z.infer<typeof addWalletFormSchema>;
export type TUpdateWalletForm = z.infer<typeof updateWalletFormSchema>;
export type TWalletForm = TAddWalletForm | TUpdateWalletForm;
