import { UserRepository } from "../modules/user/user.repository";
import { IUser } from "../modules/user/user.interface";
import { createMiddleware } from "hono/factory";
import { getToken } from "next-auth/jwt";
import { AppError } from "../core/app.error";
import { AUTH_SECRET } from "@/lib/config";

const userRepository = new UserRepository();

export const authGuard = createMiddleware<TEnv>(async (ctx, next) => {
  const req = ctx.req.raw;
  const userInfo = await getToken({ req, secret: AUTH_SECRET });

  if (!userInfo) throw new AppError("You are not authorized", 401);

  const user = await userRepository.findUserFormAuthGuard(userInfo.userId);
  if (!user) throw new AppError("User not found", 404);

  ctx.set("user", user);
  await next();
});

type TEnv = { Variables: { user: TAppUser } };
type TAppUser = Pick<IUser, "_id" | "name" | "email">;
