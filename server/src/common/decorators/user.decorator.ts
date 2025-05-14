import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LoggedUser } from '../types';

export const User = createParamDecorator((field: keyof LoggedUser, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user: LoggedUser = req.user;

  return field ? user[field] : user;
});
