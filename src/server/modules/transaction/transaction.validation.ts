import { z } from "zod";
// import { commonValidation } from "@/server/common/validation";
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

  // query
  getRegularTransactions,
};

export type CreateRegularTransactionDto = z.infer<typeof createRegularTransaction>;
export type UpdateRegularTransactionDto = z.infer<typeof updateRegularTransaction>;

export type GetRegularTransactionsArgs = z.infer<typeof getRegularTransactions>;
