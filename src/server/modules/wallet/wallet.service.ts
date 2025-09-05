import { db } from "@/server/db";
import { WithUserId } from "@/server/types";
import { and, eq, ilike } from "drizzle-orm";
import { GetAllWalletsArgs, UpdateWalletDto } from "./wallet.validation";
import { ETransactionType, transactionTable, walletTable } from "@/server/db/schema";
import { AppError } from "@/server/core/app.error";

// types
type CreateWallet = typeof walletTable.$inferInsert & { initialBalance?: number };
type GetWallets = WithUserId<{ query: GetAllWalletsArgs }>;
type UpdateWallet = WithUserId<{ id: number; dto: UpdateWalletDto }>;
type DeleteWallet = WithUserId<{ id: number }>;

export class WalletService {
  static async createWallet({ initialBalance, ...dto }: CreateWallet) {
    return db.transaction(async (tx) => {
      // Wallet Creation
      const [wallet] = await tx
        .insert(walletTable)
        .values({ ...dto, ...(initialBalance && { income: initialBalance.toFixed(2) }) })
        .returning({ id: walletTable.id });
      if (!wallet) throw new AppError("Failed to create wallet", 500);

      // Transaction creation if initial balance is provided
      let transaction;
      if (initialBalance) {
        const [tr] = await tx
          .insert(transactionTable)
          .values({
            amount: initialBalance.toFixed(2),
            type: ETransactionType.initial,
            userId: dto.userId,
            walletId: wallet.id,
            date: new Date(),
          })
          .returning({ id: transactionTable.id });

        if (!tr) throw new AppError("Failed to create initial transaction", 500);
        transaction = tr;
      }

      return { wallet, transaction };
    });
  }

  static async getWallets({ query, userId }: GetWallets) {
    const { search, isSaving } = query;

    const dbQuery = and(
      eq(walletTable.isDeleted, false),
      eq(walletTable.userId, userId),
      ...(isSaving !== undefined ? [eq(walletTable.isSaving, isSaving)] : []),
      ...(search ? [ilike(walletTable.name, `%${search}%`)] : []),
    );

    const wallets = await db.query.walletTable.findMany({
      where: dbQuery,
      columns: { id: true, name: true, isSaving: true, income: true, expense: true },
      orderBy: (walletTable, { asc }) => [asc(walletTable.name)],
    });

    return wallets;
  }

  static async updateWallet({ id, userId, dto }: UpdateWallet) {
    const [wallet] = await db
      .update(walletTable)
      .set(dto)
      .where(and(eq(walletTable.id, id), eq(walletTable.userId, userId)))
      .returning();

    if (!wallet) throw new AppError("Failed to update wallet", 403);
    return wallet;
  }

  static async deleteWallet({ id, userId }: DeleteWallet) {
    const [wallet] = await db
      .update(walletTable)
      .set({ isDeleted: true })
      .where(and(eq(walletTable.id, id), eq(walletTable.userId, userId)))
      .returning();

    if (!wallet) throw new AppError("Failed to update wallet", 403);
    return wallet;
  }
}
