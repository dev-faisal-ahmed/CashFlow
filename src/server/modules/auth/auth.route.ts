import { jsonValidator } from "@/server/middlewares/validator";
import { Hono } from "hono";
import { authValidation } from "./auth.validation";
import { AuthService } from "./auth.service";
import { ResponseDto } from "@/server/core/response.dto";

const authService = new AuthService();

export const authRoute = new Hono()
  // Signup
  .post("/signup", jsonValidator(authValidation.signup), async (ctx) => {
    const dto = ctx.req.valid("json");
    console.log({ dto });
    await authService.signup(dto);
    return ctx.json(ResponseDto.success("You have been successfully registered"));
  })

  // Login
  .post("/login", jsonValidator(authValidation.loginWithCredentials), async (ctx) => {
    const dto = ctx.req.valid("json");
    const user = await authService.loginWithCredentials(dto);
    return ctx.json(ResponseDto.success({ message: "Login successful", data: user }));
  });

export type TAuthRoute = typeof authRoute;
