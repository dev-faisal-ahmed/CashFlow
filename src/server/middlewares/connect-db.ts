import { MONGO_URI } from "@/lib/config";
import { createMiddleware } from "hono/factory";
import mongoose from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedDB = (global as any).mongoose;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!cachedDB) cachedDB = (global as any).mongoose = { conn: null, promise: null };

export const connectToDB = createMiddleware(async (_, next) => {
  if (!MONGO_URI) throw new Error("No db uri found!");
  if (cachedDB.conn) return await next();

  if (!cachedDB.promise)
    cachedDB.promise = mongoose.connect(MONGO_URI, {
      dbName: "cash-flow",
      bufferCommands: false,
    });

  cachedDB.conn = await cachedDB.promise;
  await next();
});
