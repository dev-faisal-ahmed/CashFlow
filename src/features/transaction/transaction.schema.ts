import z from "zod";

import { ETransactionType } from "@/server/db/schema";

const regularTransaction = z.object({
  amount: z.number().positive("Amount can not be negative"),
  description: z.string().optional(),
  date: z.date("Date is required"),
  categoryId: z.number("Category is required"),
  walletId: z.number("Wallet is required"),
  type: z.enum([ETransactionType.income, ETransactionType.expense], "Invalid transaction type"),
});

export const transactionSchema = {
  regularTransaction,
};

export type TRegularTransactionFormData = z.infer<typeof regularTransaction>;
