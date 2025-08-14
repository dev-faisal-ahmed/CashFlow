import { Hono } from "hono";
import { logger } from "hono/logger";
import { connectToDB } from "./middlewares/connect-db";
import { authRoute } from "./modules/auth/auth.route";

const app = new Hono().basePath("/api/v1");

app.use("*", logger());
app.use("*", connectToDB);

// routes
app.route("/auth", authRoute);

export { app };
