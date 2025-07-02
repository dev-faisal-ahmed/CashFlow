import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto, LoginWithCredentialsDto, RegisterWithCredentialsDto } from './auth.dto';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthGuard } from './guard/auth.guard';
import { User } from '@/common/decorators/user.decorator';
import { Types } from 'mongoose';
import { TLoggedUser } from '@/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerWithCredentials(@Body() dto: RegisterWithCredentialsDto) {
    return this.authService.registerWithCredentials(dto);
  }

  @Post('login')
  async loginWithCredentials(@Body() dto: LoginWithCredentialsDto) {
    return this.authService.loginWithCredentials(dto);
  }

  @Get('login/google')
  @UseGuards(PassportAuthGuard('google'))
  loginWithGoogle() {}

  @Get('google/redirect')
  @UseGuards(PassportAuthGuard('google'))
  async googleRedirect(@Req() req: Request, @Res() res: Response) {
    const callbackUrl = (req.query.callbackUrl || 'http://localhost:3000') as string;
    const token = await this.authService.loginWithGoogle(req.user as TLoggedUser);

    res.cookie('token', token, { httpOnly: true });
    res.redirect(`${callbackUrl}`);
  }

  @Patch('change-password')
  @UseGuards(AuthGuard)
  async changePassword(@Body() dto: ChangePasswordDto, @User('_id') id: Types.ObjectId, @User('password') password: string) {
    return this.authService.changePassword(dto, id, password);
  }
}
