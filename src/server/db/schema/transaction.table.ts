import { pgTable, uuid, integer, numeric, text, timestamp } from "drizzle-orm/pg-core";
import { walletTable } from "./wallet.table";
import { categoryTable } from "./category.table";
import { contactTable } from "./contact.table";
import { createdAt } from "./shared";
import { userTable } from "./user.table";
import { relations } from "drizzle-orm";

export type TTransaction = typeof transactionTable.$inferSelect;

export enum ETransactionType {
  initial = "initial",
  income = "income",
  expense = "expense",
  transfer = "transfer",
  // giving money to contact
  borrow = "borrow",
  // taking money form contact
  lend = "lend",
}

export const transactionTable = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: integer("user_id")
    .references(() => userTable.id, { onDelete: "cascade" })
    .notNull(),

  walletId: integer("wallet_id")
    .notNull()
    .references(() => walletTable.id, { onDelete: "cascade" }),

  relatedWalletId: integer("related_wallet_id").references(() => walletTable.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").references(() => categoryTable.id, { onDelete: "set null" }),
  contactId: integer("contact_id").references(() => contactTable.id, { onDelete: "set null" }),
  amount: numeric("amount", { precision: 8, scale: 2 }).notNull(),
  type: text("type").notNull().$type<ETransactionType>(),
  note: text("note"),
  date: timestamp("date").defaultNow().notNull(),
  createdAt,
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const transactionTableRelation = relations(transactionTable, ({ one }) => ({
  wallet: one(walletTable, {
    fields: [transactionTable.walletId],
    references: [walletTable.id],
  }),

  relatedWallet: one(walletTable, {
    fields: [transactionTable.relatedWalletId],
    references: [walletTable.id],
  }),

  category: one(categoryTable, {
    fields: [transactionTable.categoryId],
    references: [categoryTable.id],
  }),

  contact: one(contactTable, {
    fields: [transactionTable.contactId],
    references: [contactTable.id],
  }),
}));
