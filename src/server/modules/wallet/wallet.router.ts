import { authGuard } from "@/server/middlewares/auth.guard";
import { jsonValidator } from "@/server/middlewares/validator";
import { Hono } from "hono";
import { walletValidation } from "./wallet.validation";
import { WalletService } from "./wallet.service";
import { ResponseDto } from "@/server/core/response.dto";

const walletService = new WalletService();

export const walletRouter = new Hono()
  // Create Wallet
  .post("/", authGuard, jsonValidator(walletValidation.createWallet), async (ctx) => {
    const dto = ctx.req.valid("json");
    const user = ctx.get("user");
    await walletService.createWalletWithInitialTransaction(dto, user._id);
    return ctx.json(ResponseDto.success("Wallet created successfully"));
  });

export type TWalletRoute = typeof walletRouter;
