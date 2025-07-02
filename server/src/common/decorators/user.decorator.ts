import { TUser } from '@/schema/user.schema';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((field: keyof TUser, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user: TUser = req.user;

  return field ? user[field] : user;
});
