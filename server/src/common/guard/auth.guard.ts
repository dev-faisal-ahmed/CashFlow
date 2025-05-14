import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { appConfig } from 'src/config';
import { Request } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { LoggedUser } from '../types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(appConfig.KEY) private envConfig: ConfigType<typeof appConfig>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const req = context.switchToHttp().getRequest<Request>();
      const authHeader = req.headers.authorization;

      if (!authHeader) throw new UnauthorizedException('Authorization Header Missing');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, token] = authHeader.split(' ');
      if (!token) throw new UnauthorizedException('No token provided');

      const decoded: LoggedUser = this.jwtService.verify(token);
      const user = await this.userService.findByEmail(decoded?.email);
      if (!user) throw new UnauthorizedException('You are not authorized');

      req.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
