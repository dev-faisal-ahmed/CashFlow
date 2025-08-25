import { Hono } from "hono";
import { logger } from "hono/logger";
import { authRoute } from "./modules/auth/auth.route";
import { ResponseDto } from "./core/response.dto";
import { handleGlobalError } from "./core/global.error.handler";
import { walletRoute } from "./modules/wallet/wallet.route";
import { contactRoute } from "./modules/contact/contact.route";
import { transactionRoute } from "./modules/transaction/transaction.route";
import { categoryRoute } from "./modules/category/category.route";

const app = new Hono().basePath("/api/v1");

app.use("*", logger());

app.get("/", (ctx) => {
  return ctx.json(ResponseDto.success("Server is running"));
});

// routes
app.route("/auth", authRoute);
app.route("/wallets", walletRoute);
app.route("/categories", categoryRoute);
app.route("/contacts", contactRoute);
app.route("/transactions", transactionRoute);

// Error Handler

app.onError(handleGlobalError);

export { app };
