import { DATABASE_URL } from "@/lib/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/server/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
