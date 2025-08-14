import { Hono } from "hono";
import { logger } from "hono/logger";
import { connectToDB } from "./middlewares/connect-db";
import { authRoute } from "./modules/auth/auth.route";
import { ResponseDto } from "./core/response.dto";
import { errorHandler } from "./core/error.handler";

const app = new Hono().basePath("/api/v1");

app.use("*", logger());
app.use("*", connectToDB);

app.get("/", (ctx) => {
  return ctx.json(ResponseDto.success("Server is running"));
});

// routes
app.route("/auth", authRoute);

// Error Handler
app.onError(errorHandler);

export { app };
