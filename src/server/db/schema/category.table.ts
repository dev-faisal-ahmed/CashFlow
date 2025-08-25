import { pgTable, text, varchar, integer, uniqueIndex, jsonb } from "drizzle-orm/pg-core";
import { userTable } from "./user.table";
import { id, isDeleted, createdAt } from "./shared";

export enum ECategoryType {
  income = "income",
  expense = "expense",
}

export type TBudget = {
  amount: number;
  interval: EBudgetInterval;
};

export enum EBudgetInterval {
  weekly = "weekly",
  monthly = "monthly",
  yearly = "yearly",
}

export const categoryTable = pgTable(
  "categories",
  {
    id,
    userId: integer("user_id")
      .references(() => userTable.id, { onDelete: "cascade" })
      .notNull(),

    name: varchar("name", { length: 100 }).notNull(),
    type: text("type").notNull().$type<ECategoryType>(),
    budget: jsonb("budget").$type<TBudget>(),
    isDeleted,
    createdAt,
  },
  (table) => [{ nameAndUserIndex: uniqueIndex("name_and_user_idx").on(table.name, table.userId) }],
);
