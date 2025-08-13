import { Hono } from "hono";
import { logger } from "hono/logger";
import { connectToDB } from "./middlewares/connect-db";

const app = new Hono();

app.use("*", logger());
app.use("*", connectToDB);

export { app };
