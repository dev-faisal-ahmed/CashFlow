import { timestamp, serial, boolean } from "drizzle-orm/pg-core";

export const id = serial("id").primaryKey();
export const createdAt = timestamp("created_at").defaultNow();
export const isDeleted = boolean("is_deleted").default(false);
