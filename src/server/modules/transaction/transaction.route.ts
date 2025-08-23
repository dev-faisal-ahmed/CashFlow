import { Hono } from "hono";
import { authGuard } from "@/server/middlewares/auth.guard";
import { jsonValidator, queryValidator } from "@/server/middlewares/validator";
import { transactionValidation } from "./transaction.validation";
import { TransactionService } from "./transaction.service";
import { ResponseDto } from "@/server/core/response.dto";

export const transactionRoute = new Hono()
  // Create Regular Transaction
  .post("/regular", authGuard, jsonValidator(transactionValidation.createRegularTransaction), async (ctx) => {
    const dto = ctx.req.valid("json");
    const user = ctx.get("user");
    console.log(dto);
    await TransactionService.createRegularTransaction({ dto, userId: user._id });
    return ctx.json(ResponseDto.success("Regular transaction created successfully"));
  })

  // Get Regular Transactions
  .get("/regular", authGuard, queryValidator(transactionValidation.getTransactions), async (ctx) => {
    const query = ctx.req.valid("query");
    const user = ctx.get("user");
    const { transactions, meta } = await TransactionService.getRegularTransactions({ query, userId: user._id });
    return ctx.json(ResponseDto.success({ message: "Transactions fetched successfully", meta, data: transactions }));
  });

export type TTransactionRoute = typeof transactionRoute;
