import { TLoggedUser } from '@/types';
import { UserService } from '@/modules/user/user.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
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
