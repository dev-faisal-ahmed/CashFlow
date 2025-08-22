import { Hono } from "hono";
import { authGuard } from "@/server/middlewares/auth.guard";
import { jsonValidator } from "@/server/middlewares/validator";
import { transactionValidation } from "./transaction.validation";
import { TransactionService } from "./transaction.service";
import { ResponseDto } from "@/server/core/response.dto";

const transactionService = new TransactionService();

export const transactionRoute = new Hono()
  // Create Regular Transaction
  .post("/regular", authGuard, jsonValidator(transactionValidation.createRegularTransaction), async (ctx) => {
    const dto = ctx.req.valid("json");
    const user = ctx.get("user");
    await transactionService.createRegularTransaction({ dto, userId: user._id });
    return ctx.json(ResponseDto.success("Regular transaction created successfully"));
  });

export type TTransactionRoute = typeof transactionRoute;
