import { pgTable, varchar, text, uniqueIndex } from "drizzle-orm/pg-core";
import { createdAt, id } from "./shared";

export enum EUserProvider {
  google = "google",
  credentials = "credentials",
}

export const userTable = pgTable(
  "users",
  {
    id,
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 200 }).notNull(),
    provider: varchar("provider", { length: 100 }).notNull().$type<EUserProvider>(),
    password: varchar("password", { length: 64 }),
    image: text("image"),
    createdAt,
  },
  (table) => [{ emailIndex: uniqueIndex("email_idx").on(table.email) }],
);
