import * as schema from "./schema";

import { DATABASE_URL } from "@/lib/config";
import { drizzle } from "drizzle-orm/neon-http";

export const db = drizzle({
  connection: DATABASE_URL!,
  casing: "camelCase",
  schema: { ...schema },
});
