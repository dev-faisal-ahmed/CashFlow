import { pgTable, uuid, integer, numeric, text, timestamp } from "drizzle-orm/pg-core";
import { walletTable } from "./wallet.table";
import { categoryTable } from "./category.table";
import { contactTable } from "./contact.table";
import { createdAt } from "./shared";
import { userTable } from "./user.table";

export enum ETransactionType {
  initial = "initial",
  income = "income",
  expense = "expense",
  transfer = "transfer",
  borrow = "borrow",
  lend = "lend",
}

export const transactionTable = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: integer("user_id")
    .references(() => userTable.id, { onDelete: "cascade" })
    .notNull(),

  // Main wallet
  walletId: integer("wallet_id")
    .notNull()
    .references(() => walletTable.id, { onDelete: "cascade" }),

  // Related wallet for transfers
  relatedWalletId: integer("related_wallet_id").references(() => walletTable.id, { onDelete: "cascade" }),

  // Category for regular income/expense
  categoryId: integer("category_id").references(() => categoryTable.id, { onDelete: "set null" }),

  // Contact for borrow/lend
  contactId: integer("contact_id").references(() => contactTable.id, { onDelete: "set null" }),

  // Transaction amount
  amount: numeric("amount", { precision: 8, scale: 2 }).notNull(),

  // Type: initial, income, expense, transfer, borrow, lend
  type: text("type").notNull().$type<ETransactionType>(),

  // Optional description
  note: text("note"),

  // Transaction date
  date: timestamp("date").defaultNow().notNull(),

  // Timestamps
  createdAt,
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
