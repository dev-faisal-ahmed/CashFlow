import { Request } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TLoggedUser } from '../types';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
      if (isPublic) return true;

      const req = context.switchToHttp().getRequest<Request>();
      const authHeader = req.headers.authorization;

      if (!authHeader) throw new UnauthorizedException('Authorization Header Missing');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, token] = authHeader.split(' ');
      if (!token) throw new UnauthorizedException('No token provided');

      const decoded: TLoggedUser = this.jwtService.verify(token);
      const user = await this.userService.findByEmail(decoded?.email);
      if (!user) throw new UnauthorizedException('You are not authorized');

      req.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
