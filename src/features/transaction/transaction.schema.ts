import z from "zod";

import { ETransactionType } from "@/server/db/schema";

const regularTransaction = z.object({
  amount: z.number().positive("Amount can not be negative"),
  note: z.string().optional(),
  date: z.date("Date is required"),
  categoryId: z.number("Category is required"),
  walletId: z.number("Wallet is required"),
  type: z.enum([ETransactionType.income, ETransactionType.expense], "Invalid transaction type"),
});

const peerTransaction = z.object({
  amount: z.number().positive("Amount can not be negative"),
  walletId: z.number("WalletId is required"),
  contactId: z.number("ContactId is required"),
  type: z.enum([ETransactionType.borrow, ETransactionType.lend], "Invalid type"),
  date: z.date("Date is required"),
  note: z.string().trim().optional(),
});

const updatePeerTransaction = z.object({
  note: z.string().trim().optional(),
  date: z.date().optional(),
  contactId: z.number().optional(),
});

const transferTransaction = z.object({
  amount: z.number().positive("Amount can not be negative"),
  fee: z.number().nonnegative("Fee can not be negative").optional(),
  description: z.string().optional(),
  destinationWalletId: z.number("Destination wallet is required"),
});

export const transactionSchema = {
  regularTransaction,
  peerTransaction,
  updatePeerTransaction,
  transferTransaction,
};

export type TRegularTransactionFormData = z.infer<typeof regularTransaction>;
export type TPeerTransactionFormData = z.infer<typeof peerTransaction>;
export type TTransferTransactionFormData = z.infer<typeof transferTransaction>;
