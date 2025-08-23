import { z } from "zod";
import { ETransactionNature } from "./transaction.interface";
import { commonValidation } from "@/server/common/validation";

const createRegularTransaction = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  description: z.string().trim().optional(),
  date: z.coerce.date().default(() => new Date()),
  sourceId: z.string("Source id is required"),
  walletId: z.string("Wallet id is required"),
  nature: z.enum(Object.values(ETransactionNature) as [string, ...string[]], "Invalid transaction nature"),
});

const updateRegularTransaction = z.object({
  sourceId: z.string().optional(),
  description: z.string().trim().optional(),
  date: z.coerce.date().optional(),
});

// Query
const getTransactions = commonValidation.queryWithPagination.and(
  z.object({
    nature: z.enum(Object.values(ETransactionNature), "Invalid transaction nature").optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }),
);

export const transactionValidation = {
  createRegularTransaction,
  updateRegularTransaction,

  getTransactions,
};

export type CreateRegularTransactionDto = z.infer<typeof createRegularTransaction>;
export type UpdateRegularTransactionDto = z.infer<typeof updateRegularTransaction>;

export type GetTransactionsArgs = z.infer<typeof getTransactions>;
