import { db } from "@/server/db";
import { WithUserId } from "@/server/types";
import { CreateRegularTransactionDto, GetRegularTransactionsArgs, UpdateRegularTransactionDto } from "./transaction.validation";
import { AppError } from "@/server/core/app.error";
import { PaginationHelper } from "@/server/helpers/pagination.helper";
import { ETransactionType, transactionTable, walletTable } from "@/server/db/schema";
import { and, eq, inArray, gte, lte, count } from "drizzle-orm";

// Types
type CreateRegularTransaction = WithUserId<{ dto: CreateRegularTransactionDto }>;
type GetTransactions = WithUserId<{ query: GetRegularTransactionsArgs }>;
type UpdateRegularTransaction = WithUserId<{ id: string; dto: UpdateRegularTransactionDto }>;
type DeleteRegularTransaction = WithUserId<{ id: string }>;

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

      await tx
        .update(walletTable)
        .set({
          ...(dto.type === ETransactionType.expense
            ? { expense: String(Number(wallet.expense) + dto.amount) }
            : { income: String(Number(wallet.income) + dto.amount) }),
        })
        .where(and(eq(walletTable.id, dto.walletId), eq(walletTable.userId, userId)));

      return transaction;
    });
  }

  static async getRegularTransactions({ query, userId }: GetTransactions) {
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
      where: (w, { eq }) => and(eq(w.userId, userId), eq(w.id, id)),
      columns: { id: true, type: true, amount: true },
      with: { wallet: { columns: { id: true, income: true, expense: true } } },
    });

    if (!transaction) throw new AppError("Transaction not found", 404);

    console.log(transaction);

    return db.transaction(async (tx) => {
      const deletedTransaction = await tx
        .delete(transactionTable)
        .where(and(eq(transactionTable.id, id), eq(transactionTable.userId, userId)));

      console.log(deletedTransaction);

      if (!deletedTransaction.rowCount) throw new AppError("Failed to delete transaction", 500);

      const [wallet] = await tx
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
        .returning();

      if (!wallet.id) throw new AppError("Failed to update wallet balance", 500);

      return wallet;
    });
  }
}
