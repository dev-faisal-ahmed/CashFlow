import { z } from "zod";
import { ETransactionNature } from "./transaction.interface";

// Base transaction schema
const baseTransaction = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  description: z.string().trim().optional(),
  date: z.coerce.date().default(() => new Date()),
});

// Regular transaction schema
export const createRegularTransaction = baseTransaction.and(
  z.object({
    sourceId: z.string("Source id is required"),
    walletId: z.string("Wallet id is required"),
    nature: z.enum(Object.values(ETransactionNature), "Invalid transaction nature"),
  }),
);

export const transactionValidation = {
  createRegularTransaction,
};

export type CreateRegularTransactionDto = z.infer<typeof createRegularTransaction>;
