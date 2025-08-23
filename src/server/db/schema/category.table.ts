import { pgTable, serial, text, varchar, integer, uniqueIndex, json } from "drizzle-orm/pg-core";
import { userTable } from "./user.table";

export const categoryTable = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => userTable.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    type: text("type").notNull().$type<ECategoryType>(),
    budget: json("budget").$type<TBudget>(),
  },
  (table) => [{ nameAndUserIndex: uniqueIndex("name_and_user_idx").on(table.name, table.userId) }],
);

export enum ECategoryType {
  income = "income",
  expense = "expense",
}

export type TBudget = {
  amount: number;
  interval: EInterval;
};

export enum EInterval {
  daily = "daily",
  weekly = "weekly",
  monthly = "monthly",
  yearly = "yearly",
}
