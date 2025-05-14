import {
  LoginWithCredentialsDto,
  loginWithCredentialsSchema,
  RegisterWithCredentialsDto,
} from './auth.dto';

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod.validation.pipe';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoggedUser } from 'src/common/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerWithCredentials(@Body() dto: RegisterWithCredentialsDto) {
    return this.authService.registerWithCredentials(dto);
  }

  @Post('login')
  async loginWithCredentials(
    @Body(new ZodValidationPipe(loginWithCredentialsSchema))
    dto: LoginWithCredentialsDto,
  ) {
    return this.authService.loginWithCredentials(dto);
  }

  @Get('login/google')
  @UseGuards(AuthGuard('google'))
  async loginWithGoogle() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() req: any) {
    return await this.authService.loginWithGoogle(req.user as LoggedUser);
  }
}
