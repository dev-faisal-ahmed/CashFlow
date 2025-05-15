import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserType } from 'src/schemas/user.schema';

export const User = createParamDecorator((field: keyof UserType, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user: UserType = req.user;

  return field ? user[field] : user;
});
