import { capitalize } from "@/lib/utils";
import { z } from "zod";

export const walletFormSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Wallet name can not be empty")
    .transform((value) => capitalize(value)),

  icon: z.string().trim().nonempty("Please select an icon"),
  initialBalance: z.number().nonnegative("Initial balance can not be empty"),
  isSaving: z.boolean(),
});
