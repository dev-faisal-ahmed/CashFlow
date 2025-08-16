import { Hono } from "hono";
import { authGuard } from "@/server/middlewares/auth.guard";
import { jsonValidator, queryValidator } from "@/server/middlewares/validator";
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
  })
  // Get All Wallets
  .get("/", authGuard, queryValidator(walletValidation.getAllWallets), async (ctx) => {
    const query = ctx.req.valid("query");
    const user = ctx.get("user");
    const { wallets, meta } = await walletService.getAllWallets(query, user._id);
    return ctx.json(ResponseDto.success({ message: "Wallets fetched successfully", meta, data: wallets }));
  })
  // Update Wallet
  .patch("/:id", authGuard, jsonValidator(walletValidation.updateWallet), async (ctx) => {
    const dto = ctx.req.valid("json");
    const user = ctx.get("user");
    const id = ctx.req.param("id");
    await walletService.updateWallet(dto, id, user._id);
    return ctx.json(ResponseDto.success("Wallet updated successfully"));
  })
  // Delete Wallet
  .delete("/:id", authGuard, async (ctx) => {
    const user = ctx.get("user");
    const id = ctx.req.param("id");
    await walletService.deleteWallet(id, user._id);
    return ctx.json(ResponseDto.success("Wallet deleted successfully"));
  });

export type TWalletRoute = typeof walletRouter;
