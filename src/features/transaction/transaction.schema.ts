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

// filter forms
const regularTransactionFilterForm = z
  .object({
    type: z.enum([ETransactionType.income, ETransactionType.expense]).optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  })
  .superRefine((val, ctx) => {
    const { startDate, endDate } = val;
    if (startDate && endDate && startDate > endDate) {
      ctx.addIssue({ code: "custom", message: "Start date can not be greater than end date", path: ["endDate"] });
    }
  });

const peerTransactionFilterForm = z
  .object({
    type: z.enum([ETransactionType.borrow, ETransactionType.lend]).optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  })
  .superRefine((val, ctx) => {
    const { startDate, endDate } = val;
    if (startDate && endDate && startDate > endDate) {
      ctx.addIssue({ code: "custom", message: "Start date can not be greater than end date", path: ["endDate"] });
    }
  });

const transferTransactionFilterForm = z
  .object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  })
  .superRefine((val, ctx) => {
    const { startDate, endDate } = val;
    if (startDate && endDate && startDate > endDate) {
      ctx.addIssue({ code: "custom", message: "Start date can not be greater than end date", path: ["endDate"] });
    }
  });

export const transactionSchema = {
  regularTransaction,
  peerTransaction,
  updatePeerTransaction,
  transferTransaction,
  // Filter Forms
  regularTransactionFilterForm,
  peerTransactionFilterForm,
  transferTransactionFilterForm,
};

export type TRegularTransactionFormData = z.infer<typeof regularTransaction>;
export type TPeerTransactionFormData = z.infer<typeof peerTransaction>;
export type TTransferTransactionFormData = z.infer<typeof transferTransaction>;

// Filter Form
export type TRegularTransactionFilterFormData = z.infer<typeof regularTransactionFilterForm>;
export type TPeerTransactionFilterFormData = z.infer<typeof peerTransactionFilterForm>;
export type TTransferTransactionFilterFormData = z.infer<typeof transferTransactionFilterForm>;
