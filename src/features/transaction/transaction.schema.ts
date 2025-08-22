import z from "zod";
import { ETransactionNature } from "@/server/modules/transaction/transaction.interface";

const regularTransaction = z.object({
  amount: z.number().positive("Amount can not be negative"),
  description: z.string().optional(),
  date: z.date("Date is required"),
  sourceId: z.string().nonempty("Source id can not be empty"),
  walletId: z.string().nonempty("Wallet id can not be empty"),
  nature: z.enum(Object.values(ETransactionNature), "Invalid transaction nature"),
});

export const transactionSchema = {
  regularTransaction,
};

export type TRegularTransactionFormData = z.infer<typeof regularTransaction>;
