import { pgTable, integer, varchar, uniqueIndex } from "drizzle-orm/pg-core";
import { id, isDeleted, createdAt } from "./shared";
import { userTable } from "./user.table";

export const contactTable = pgTable(
  "contacts",
  {
    id,
    userId: integer("user_id")
      .references(() => userTable.id, { onDelete: "cascade" })
      .notNull(),

    name: varchar("name", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    address: varchar("address", { length: 255 }),
    isDeleted,
    createdAt,
  },
  (table) => [{ userAndPhoneIndex: uniqueIndex("user_and_phone_idx").on(table.userId, table.phone) }],
);
