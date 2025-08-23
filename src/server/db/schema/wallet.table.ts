import { pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { varchar, boolean, integer } from "drizzle-orm/pg-core";
import { userTable } from "./user.table";
import { id, isDeleted, createdAt } from "./shared";

export const walletTable = pgTable(
  "wallets",
  {
    id,
    name: varchar("name", { length: 100 }).notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => userTable.id),
    isSaving: boolean("is_saving").default(false),
    isDeleted,
    createdAt,
  },
  (table) => [{ nameAndUserIndex: uniqueIndex("name_and_user_idx").on(table.name, table.userId) }],
);
