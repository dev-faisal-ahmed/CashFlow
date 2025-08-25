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
    await TransactionService.createRegularTransaction({ dto, userId: user.id });
    return ctx.json(ResponseDto.success("Regular transaction created successfully"));
  })

  // Get Regular Transactions
  .get("/regular", authGuard, queryValidator(transactionValidation.getRegularTransactions), async (ctx) => {
    const query = ctx.req.valid("query");
    const user = ctx.get("user");
    const { transactions, meta } = await TransactionService.getRegularTransactions({ query, userId: user.id });
    return ctx.json(ResponseDto.success({ message: "Transactions fetched successfully", meta, data: transactions }));
  })

  // Update Regular Transaction
  .patch("/regular/:id", authGuard, jsonValidator(transactionValidation.updateRegularTransaction), async (ctx) => {
    const id = ctx.req.param("id");
    const dto = ctx.req.valid("json");
    const user = ctx.get("user");
    await TransactionService.updateRegularTransaction({ id, userId: user.id, dto });
    return ctx.json(ResponseDto.success("Regular transaction updated successfully"));
  });

export type TTransactionRoute = typeof transactionRoute;
