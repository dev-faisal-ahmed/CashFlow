import { Hono } from "hono";
import { authGuard } from "@/server/middlewares/auth.guard";
import { jsonValidator, queryValidator } from "@/server/middlewares/validator";
import { walletValidation } from "./wallet.validation";
import { WalletService } from "./wallet.service";
import { ResponseDto } from "@/server/core/response.dto";

export const walletRoute = new Hono()
  // Create Wallet
  .post("/", authGuard, jsonValidator(walletValidation.createWallet), async (ctx) => {
    const dto = ctx.req.valid("json");
    const user = ctx.get("user");
    await WalletService.createWallet({ ...dto, userId: user.id });
    return ctx.json(ResponseDto.success("Wallet created successfully"));
  })

  // Get Wallets
  .get("/", authGuard, queryValidator(walletValidation.getAllWallets), async (ctx) => {
    const query = ctx.req.valid("query");
    const user = ctx.get("user");
    const wallets = await WalletService.getWallets({ query, userId: user.id });
    return ctx.json(ResponseDto.success({ message: "Wallets fetched successfully", data: wallets }));
  })

  // Update Wallet
  .patch("/:id", authGuard, jsonValidator(walletValidation.updateWallet), async (ctx) => {
    const dto = ctx.req.valid("json");
    const user = ctx.get("user");
    const id = ctx.req.param("id");
    await WalletService.updateWallet({ id: Number(id), dto, userId: user.id });
    return ctx.json(ResponseDto.success("Wallet updated successfully"));
  })

  // Delete Wallet
  .delete("/:id", authGuard, async (ctx) => {
    const user = ctx.get("user");
    const id = ctx.req.param("id");
    await WalletService.deleteWallet({ id: Number(id), userId: user.id });
    return ctx.json(ResponseDto.success("Wallet deleted successfully"));
  })

  // Transfer Money
  .post("/transfer", authGuard, jsonValidator(walletValidation.transfer), async (ctx) => {
    const dto = ctx.req.valid("json");
    const user = ctx.get("user");
    await WalletService.walletTransfer({ dto, userId: user.id });
    return ctx.json(ResponseDto.success("Wallet transfer has been successful"));
  });

export type TWalletRoute = typeof walletRoute;
