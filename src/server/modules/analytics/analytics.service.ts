import { db } from "@/server/db";
import { ETransactionType } from "@/server/db/schema";
import { endOfDay, startOfMonth } from "date-fns";

export class AnalyticsService {
  static async getFinancialOverview(userId: number) {
    const today = new Date();
    const firstDay = startOfMonth(today);
    const todayEnd = endOfDay(today);

    // fetching wallets and transactions
    const [wallets, transactions] = await Promise.all([
      db.query.walletTable.findMany({
        where: (c, { eq }) => eq(c.userId, userId),
        columns: { id: true, income: true, expense: true },
      }),

      db.query.transactionTable.findMany({
        where: (c, { eq, lte, and, gte }) => and(eq(c.userId, userId), lte(c.date, todayEnd), gte(c.date, firstDay)),
      }),
    ]);

    // calculating total income and expense
    const { income: totalIncome, expense: totalExpense } = wallets.reduce(
      (acc: { income: number; expense: number }, wallet) => {
        acc.income += Number(wallet.income);
        acc.expense += Number(wallet.expense);

        return acc;
      },
      { income: 0, expense: 0 },
    );

    // calculating monthly income, expense, borrow, lend
    const { income, expense, borrow, lend } = transactions.reduce(
      (acc: { income: number; expense: number; borrow: number; lend: number }, transaction) => {
        const type = transaction.type;
        if (type === ETransactionType.income) acc.income += Number(transaction.amount);
        else if (type === ETransactionType.expense) acc.expense += Number(transaction.amount);
        else if (type === ETransactionType.borrow) acc.borrow += Number(transaction.amount);
        else if (type === ETransactionType.lend) acc.lend += Number(transaction.amount);
        return acc;
      },
      { income: 0, expense: 0, borrow: 0, lend: 0 },
    );

    return { balance: totalIncome - totalExpense, income, expense, borrow, lend };
  }

  static async getMonthlyExpenseDayByDay(userId: number) {
    const now = new Date();
    const startDate = startOfMonth(now);
    const endDate = endOfDay(now);

    const transactions = await db.query.transactionTable.findMany({
      where: (c, { eq, lte, and, gte }) =>
        and(eq(c.userId, userId), eq(c.type, ETransactionType.expense), lte(c.date, endDate), gte(c.date, startDate)),
      columns: { id: true, date: true, amount: true },
      orderBy: (c, { asc }) => [asc(c.date)],
    });

    const expenseByDay = transactions.reduce((acc: { [key: string]: number }, transaction) => {
      const day = transaction.date.getDate();
      acc[day] = (acc[day] || 0) + Number(transaction.amount);
      return acc;
    }, {});

    return expenseByDay;
  }
}
