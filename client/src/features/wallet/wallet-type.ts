import { z } from "zod";
import { walletFormSchema } from "./wallet-schema";

export type TWalletForm = z.infer<typeof walletFormSchema>;
