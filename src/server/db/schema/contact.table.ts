import { pgTable, integer, varchar } from "drizzle-orm/pg-core";
import { createdAt, id } from "./shared";
import { userTable } from "./user.table";

export const contactTable = pgTable("contacts", {
  id,
  userId: integer("user_id").references(() => userTable.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  createdAt,
});
