import { z } from "zod";
import { addWalletFormSchema } from "./wallet-schema";

export type TAddWalletForm = z.infer<typeof addWalletFormSchema>;
