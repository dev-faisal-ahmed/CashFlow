import z from "zod";

import { ETransactionType } from "@/server/db/schema";
import { commonValidation } from "@/server/common/validation";

const createRegularTransaction = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  note: z.string().trim().optional(),
  date: z.coerce.date().default(() => new Date()),
  categoryId: z.number("Category id is required"),
  walletId: z.number("Wallet id is required"),
  type: z.enum([ETransactionType.income, ETransactionType.expense], "Invalid transaction type"),
});

const updateRegularTransaction = z.object({
  categoryId: z.number().optional(),
  note: z.string().trim().optional(),
  date: z.coerce.date().optional(),
});

const createPeerTransaction = z.object({
  amount: z.number().positive("Amount must be positive"),
  walletId: z.number("Wallet Id is required"),
  contactId: z.number("Contact Id is required"),
  type: z.enum([ETransactionType.lend, ETransactionType.borrow], "Invalid transaction type"),
  note: z.string().trim().optional(),
  date: z.coerce.date().default(() => new Date()),
});

// Query
const getRegularTransactions = commonValidation.pagination.and(
  z.object({
    type: z.enum([ETransactionType.income, ETransactionType.expense], "Invalid transaction type").optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }),
);

export const transactionValidation = {
  // Json
  createRegularTransaction,
  updateRegularTransaction,
  createPeerTransaction,

  // query
  getRegularTransactions,
};

export type CreateRegularTransactionDto = z.infer<typeof createRegularTransaction>;
export type UpdateRegularTransactionDto = z.infer<typeof updateRegularTransaction>;
export type CreatePeerTransactionDto = z.infer<typeof createPeerTransaction>;

export type GetRegularTransactionsArgs = z.infer<typeof getRegularTransactions>;
