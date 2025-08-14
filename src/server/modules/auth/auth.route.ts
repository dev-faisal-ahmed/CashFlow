import { jsonValidator } from "@/server/middlewares/validator";
import { Hono } from "hono";
import { authValidation } from "./auth.validation";
import { AuthService } from "./auth.service";
import { ApiResponse } from "@/server/core/dto";

const authService = new AuthService();

export const authRoute = new Hono().post("/login", jsonValidator(authValidation.loginWithCredentials), async (ctx) => {
  const dto = ctx.req.valid("json");
  const user = authService.loginWithCredentials(dto);
  ctx.json(ApiResponse.success({ message: "Login successful", data: user }));
});

export type TAuthRoute = typeof authRoute;
