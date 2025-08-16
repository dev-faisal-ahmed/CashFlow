import { Hono } from "hono";
import { logger } from "hono/logger";
import { connectToDB } from "./middlewares/connect-db";
import { authRoute } from "./modules/auth/auth.route";
import { ResponseDto } from "./core/response.dto";
import { handleGlobalError } from "./core/global.error.handler";
import { walletRoute } from "./modules/wallet/wallet.route";
import { sourceRoute } from "./modules/source/source.router";

const app = new Hono().basePath("/api/v1");

app.use("*", logger());
app.use("*", connectToDB);

app.get("/", (ctx) => {
  return ctx.json(ResponseDto.success("Server is running"));
});

// routes
app.route("/auth", authRoute);
app.route("/wallets", walletRoute);
app.route("/sources", sourceRoute);

// Error Handler

app.onError(handleGlobalError);

export { app };
