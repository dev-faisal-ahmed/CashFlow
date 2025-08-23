import { createMiddleware } from "hono/factory";
import { getToken } from "next-auth/jwt";
import { AppError } from "../core/app.error";
import { AUTH_SECRET } from "@/lib/config";
import { AuthService } from "../modules/auth/auth.service";
import { userTable } from "../db/schema";

export const authGuard = createMiddleware<TEnv>(async (ctx, next) => {
  const req = ctx.req.raw;
  const userInfo = await getToken({ req, secret: AUTH_SECRET });

  if (!userInfo) throw new AppError("You are not authorized", 401);

  const user = await AuthService.findUserFormAuthGuard(userInfo.userId);
  if (!user) throw new AppError("User not found", 404);

  ctx.set("user", user);
  await next();
});

type TEnv = { Variables: { user: TAppUser } };
type TAppUser = Pick<typeof userTable.$inferSelect, "id" | "name" | "email">;
