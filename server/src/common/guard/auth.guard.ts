import * as jwt from 'jsonwebtoken';

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';

import { ConfigType } from '@nestjs/config';
import { appConfig } from 'src/config';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(appConfig.KEY) private envConfig: ConfigType<typeof appConfig>,
  ) {}
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;

    if (!authHeader)
      throw new UnauthorizedException('Authorization Header Missing');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, token] = authHeader.split(' ');
    if (!token) throw new UnauthorizedException('No token provided');

    const decoded = jwt.verify(token, this.envConfig.AUTH_SECRET);
    req['user'] = decoded;

    return true;
  }
}
