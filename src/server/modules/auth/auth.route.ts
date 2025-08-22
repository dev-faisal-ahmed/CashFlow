import { Hono } from "hono";
import { jsonValidator } from "@/server/middlewares/validator";
import { authValidation } from "./auth.validation";
import { AuthService } from "./auth.service";
import { ResponseDto } from "@/server/core/response.dto";

export const authRoute = new Hono()
  // Signup
  .post("/signup", jsonValidator(authValidation.signup), async (ctx) => {
    const dto = ctx.req.valid("json");
    console.log({ dto });
    await AuthService.signup(dto);
    return ctx.json(ResponseDto.success("You have been successfully registered"));
  })

  // Login
  .post("/login", jsonValidator(authValidation.loginWithCredentials), async (ctx) => {
    const dto = ctx.req.valid("json");
    const user = await AuthService.loginWithCredentials(dto);
    return ctx.json(ResponseDto.success({ message: "Login successful", data: user }));
  })

  // Google Login
  .post("/login/google", jsonValidator(authValidation.loginWithGoogle), async (ctx) => {
    const dto = ctx.req.valid("json");
    const user = await AuthService.loginWithGoogle(dto);
    return ctx.json(ResponseDto.success({ message: "Login successful", data: user }));
  });

export type TAuthRoute = typeof authRoute;
