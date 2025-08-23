import { timestamp, serial } from "drizzle-orm/pg-core";

export const createdAt = timestamp("created_at").defaultNow();
export const id = serial("id").primaryKey();
