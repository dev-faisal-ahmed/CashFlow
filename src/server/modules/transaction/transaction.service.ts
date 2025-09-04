import {
  CreatePeerTransactionDto,
  CreateRegularTransactionDto,
  GetPeerTransactionsArgs,
  GetRegularTransactionsArgs,
  UpdatePeerTransactionDto,
  UpdateRegularTransactionDto,
} from "./transaction.validation";

import { db } from "@/server/db";
import { WithUserId } from "@/server/types";
import { AppError } from "@/server/core/app.error";
import { PaginationHelper } from "@/server/helpers/pagination.helper";
import { contactTable, ETransactionType, transactionTable, walletTable } from "@/server/db/schema";
import { and, eq, inArray, gte, lte, count, or, ilike } from "drizzle-orm";

// Types
type CreateRegularTransaction = WithUserId<{ dto: CreateRegularTransactionDto }>;
type CreatePeerTransaction = WithUserId<{ dto: CreatePeerTransactionDto }>;
type GetRegularTransactions = WithUserId<{ query: GetRegularTransactionsArgs }>;
type GetPeerTransactions = WithUserId<{ query: GetPeerTransactionsArgs }>;
type UpdateRegularTransaction = WithUserId<{ id: string; dto: UpdateRegularTransactionDto }>;
type UpdatePeerTransaction = WithUserId<{ id: string; dto: UpdatePeerTransactionDto }>;
type DeleteRegularTransaction = WithUserId<{ id: string }>;
type DeletePeerTransaction = WithUserId<{ id: string }>;

export class TransactionService {
  static async createRegularTransaction({ dto, userId }: CreateRegularTransaction) {
    const wallet = await db.query.walletTable.findFirst({
      where: (w, { eq, and }) => and(eq(w.userId, userId), eq(w.id, dto.walletId)),
      columns: { id: true, income: true, expense: true },
    });

    if (!wallet) throw new AppError("Wallet not found", 404);
    const balance = Number(wallet.income) - Number(wallet.expense);
    if (dto.type === ETransactionType.expense && balance < dto.amount) throw new AppError("Insufficient balance", 400);

    return db.transaction(async (tx) => {
      const [transaction] = await tx
        .insert(transactionTable)
        .values({ ...dto, amount: dto.amount.toFixed(2), userId })
        .returning();

      const [updatedWallet] = await tx
        .update(walletTable)
        .set({
          ...(dto.type === ETransactionType.expense
            ? { expense: String(Number(wallet.expense) + dto.amount) }
            : { income: String(Number(wallet.income) + dto.amount) }),
        })
        .where(and(eq(walletTable.id, dto.walletId), eq(walletTable.userId, userId)))
        .returning();

      if (!updatedWallet.id) throw new AppError("Failed to update wallet balance", 500);

      return transaction;
    });
  }

  static async getRegularTransactions({ query, userId }: GetRegularTransactions) {
    const { page, type, startDate, endDate } = query;
    const paginationHelper = new PaginationHelper(page, query.limit, query.getAll);
    const { skip, limit } = paginationHelper.getPaginationInfo();

    const dbQuery = and(
      eq(transactionTable.userId, userId),
      ...(type ? [eq(transactionTable.type, type)] : [inArray(transactionTable.type, [ETransactionType.income, ETransactionType.expense])]),
      ...(startDate ? [gte(transactionTable.date, startDate)] : []),
      ...(endDate ? [lte(transactionTable.date, endDate)] : []),
    );

    const transactions = await db.query.transactionTable.findMany({
      where: dbQuery,
      columns: {
        id: true,
        amount: true,
        type: true,
        date: true,
        note: true,
      },
      with: {
        category: { columns: { id: true, name: true } },
        wallet: { columns: { id: true, name: true } },
      },
      orderBy: (t, { desc }) => [desc(t.date)],
      limit,
      offset: skip,
    });

    const [{ count: total }] = await db.select({ count: count() }).from(transactionTable).where(dbQuery);

    const meta = paginationHelper.getMeta(total);
    return { transactions, meta };
  }

  static async updateRegularTransaction({ id, userId, dto }: UpdateRegularTransaction) {
    const transaction = await db.query.transactionTable.findFirst({
      where: (t, { eq }) => and(eq(t.userId, userId), eq(t.id, id)),
    });

    if (!transaction) throw new AppError("Transaction not found", 404);

    return db.transaction(async (tx) => {
      const [updatedTransaction] = await tx
        .update(transactionTable)
        .set({ ...dto })
        .where(and(eq(transactionTable.id, id), eq(transactionTable.userId, userId)))
        .returning();

      if (!updatedTransaction.id) throw new AppError("Failed to update transaction", 500);

      return updatedTransaction;
    });
  }

  static async deleteRegularTransaction({ id, userId }: DeleteRegularTransaction) {
    const transaction = await db.query.transactionTable.findFirst({
      where: (w, { eq }) => eq(w.id, id),
      columns: { id: true, type: true, amount: true },
      with: { wallet: { columns: { id: true, income: true, expense: true } } },
    });

    if (!transaction) throw new AppError("Transaction not found", 404);

    return db.transaction(async (tx) => {
      const [deletedTransaction, [wallet]] = await Promise.all([
        tx.delete(transactionTable).where(eq(transactionTable.id, id)),

        tx
          .update(walletTable)
          .set({
            ...(transaction.type === ETransactionType.expense && {
              expense: String(Number(transaction.wallet.expense) - Number(transaction.amount)),
            }),

            ...(transaction.type === ETransactionType.income && {
              income: String(Number(transaction.wallet.income) - Number(transaction.amount)),
            }),
          })
          .where(and(eq(walletTable.id, transaction.wallet.id), eq(walletTable.userId, userId)))
          .returning(),
      ]);

      if (!deletedTransaction.rowCount) throw new AppError("Failed to delete transaction", 500);
      if (!wallet.id) throw new AppError("Failed to update wallet balance", 500);

      return deletedTransaction;
    });
  }

  static async createPeerTransaction({ dto, userId }: CreatePeerTransaction) {
    const [wallet, contact] = await Promise.all([
      db.query.walletTable.findFirst({
        where: (w, { eq }) => eq(w.id, dto.walletId),
        columns: { id: true, income: true, expense: true },
      }),

      db.query.contactTable.findFirst({
        where: (c, { and, eq }) => and(eq(c.userId, userId), eq(c.id, dto.contactId)),
        columns: { id: true, amountOwedByMe: true, amountOwedToMe: true },
      }),
    ]);

    if (!wallet) throw new AppError("Wallet not found", 404);
    if (!contact) throw new AppError("Contact not found", 404);

    const balance = Number(wallet.income) - Number(wallet.expense);
    if (dto.type === ETransactionType.lend && balance < dto.amount) throw new AppError("Insufficient balance", 400);

    return db.transaction(async (tx) => {
      const [[transaction], [updatedWallet], [updatedContact]] = await Promise.all([
        tx
          .insert(transactionTable)
          .values({ ...dto, amount: dto.amount.toFixed(2), userId })
          .returning(),
        tx
          .update(walletTable)
          .set({
            ...(dto.type === ETransactionType.lend
              ? { expense: String(Number(wallet.expense) + dto.amount) }
              : { income: String(Number(wallet.income) + dto.amount) }),
          })
          .where(eq(walletTable.id, dto.walletId))
          .returning(),

        tx
          .update(contactTable)
          .set({
            ...(dto.type === ETransactionType.borrow ? { amountOwedToMe: String(Number(contact.amountOwedToMe) + dto.amount) } : {}),
            ...(dto.type === ETransactionType.lend ? { amountOwedByMe: String(Number(contact.amountOwedByMe) + dto.amount) } : {}),
          })
          .where(eq(contactTable.id, dto.contactId))
          .returning(),
      ]);

      if (!transaction.id) throw new AppError("Failed to create transaction", 500);
      if (!updatedContact.id) throw new AppError("Failed to update contact balance", 500);
      if (!updatedWallet.id) throw new AppError("Failed to update wallet balance", 500);

      return transaction;
    });
  }

  static async getPeerTransactions({ query, userId }: GetPeerTransactions) {
    const { page, type, startDate, endDate, search } = query;
    const paginationHelper = new PaginationHelper(page, query.limit, query.getAll);
    const { skip, limit } = paginationHelper.getPaginationInfo();

    const dbQuery = and(
      eq(transactionTable.userId, userId),
      ...(search ? [or(ilike(transactionTable.note, `%${search}%`), ilike(contactTable.name, `%${search}%`))] : []),
      ...(type ? [eq(transactionTable.type, type)] : [inArray(transactionTable.type, [ETransactionType.borrow, ETransactionType.lend])]),
      ...(startDate ? [gte(transactionTable.date, startDate)] : []),
      ...(endDate ? [lte(transactionTable.date, endDate)] : []),
    );

    const transactions = await db.query.transactionTable.findMany({
      where: dbQuery,
      columns: {
        id: true,
        amount: true,
        type: true,
        date: true,
        note: true,
        walletId: true,
      },
      with: {
        contact: { columns: { id: true, name: true } },
      },
      orderBy: (t, { desc }) => [desc(t.date)],
      limit,
      offset: skip,
    });

    const [{ count: total }] = await db.select({ count: count() }).from(transactionTable).where(dbQuery);
    const meta = paginationHelper.getMeta(total);
    return { transactions, meta };
  }

  static async updatePeerTransaction({ id, userId, dto }: UpdatePeerTransaction) {
    const transaction = await db.query.transactionTable.findFirst({
      where: (t, { eq }) => and(eq(t.userId, userId), eq(t.id, id)),
    });

    if (!transaction) throw new AppError("Transaction not found", 404);

    return db
      .update(transactionTable)
      .set(dto)
      .where(and(eq(transactionTable.id, id), eq(transactionTable.userId, userId)))
      .returning();
  }

  static async deletePeerTransaction({ id, userId }: DeletePeerTransaction) {
    const transaction = await db.query.transactionTable.findFirst({
      where: (w, { eq }) => eq(w.id, id),
      columns: { id: true, type: true, amount: true, contactId: true, walletId: true },
      with: {
        wallet: { columns: { id: true, income: true, expense: true } },
        contact: { columns: { id: true, amountOwedByMe: true, amountOwedToMe: true } },
      },
    });

    if (!transaction) throw new AppError("Transaction not found", 404);
    if (!transaction.contact) throw new AppError("Contact not found", 404);

    const contact = transaction.contact;

    return db.transaction(async (tx) => {
      const [deletedTransaction, [wallet], [contactInfo]] = await Promise.all([
        tx.delete(transactionTable).where(eq(transactionTable.id, id)),

        tx
          .update(walletTable)
          .set({
            ...(transaction.type === ETransactionType.lend && {
              expense: String(Number(transaction.wallet.expense) - Number(transaction.amount)),
            }),

            ...(transaction.type === ETransactionType.borrow && {
              income: String(Number(transaction.wallet.income) - Number(transaction.amount)),
            }),
          })
          .where(and(eq(walletTable.id, transaction.wallet.id), eq(walletTable.userId, userId)))
          .returning(),

        tx
          .update(contactTable)
          .set({
            ...(transaction.type === ETransactionType.lend && {
              amountOwedByMe: String(Number(contact.amountOwedByMe) - Number(transaction.amount)),
            }),

            ...(transaction.type === ETransactionType.borrow && {
              amountOwedToMe: String(Number(contact.amountOwedToMe) - Number(transaction.amount)),
            }),
          })
          .where(and(eq(contactTable.id, contact.id), eq(contactTable.userId, userId)))
          .returning(),
      ]);

      if (!deletedTransaction.rowCount) throw new AppError("Failed to delete transaction", 500);
      if (!wallet.id) throw new AppError("Failed to update wallet balance", 500);
      if (!contactInfo.id) throw new AppError("Failed to update contact balance", 500);

      return deletedTransaction;
    });
  }
}
