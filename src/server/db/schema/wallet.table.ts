import { pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { varchar, boolean, integer, numeric } from "drizzle-orm/pg-core";
import { userTable } from "./user.table";
import { id, isDeleted, createdAt } from "./shared";

export type TWallet = typeof walletTable.$inferSelect;

export const walletTable = pgTable(
  "wallets",
  {
    id,
    name: varchar("name", { length: 100 }).notNull(),
    userId: integer("user_id")
      .references(() => userTable.id)
      .notNull(),

    isSaving: boolean("is_saving").default(false),
    income: numeric("income", { precision: 8, scale: 2 }).notNull().default("0"),
    expense: numeric("expense", { precision: 8, scale: 2 }).notNull().default("0"),
    isDeleted,
    createdAt,
  },
  (table) => [{ nameAndUserIndex: uniqueIndex("name_and_user_idx").on(table.name, table.userId) }],
);
