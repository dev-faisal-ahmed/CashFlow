import { Request, Response } from 'express';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ChangePasswordDto, LoginWithCredentialsDto, RegisterWithCredentialsDto } from './auth.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UserType } from 'src/schema/user.schema';
import { Public } from 'src/common/decorators/public.decorator';
import { TLoggedUser } from 'src/common/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  async registerWithCredentials(@Body() dto: RegisterWithCredentialsDto) {
    return this.authService.registerWithCredentials(dto);
  }

  @Post('login')
  @Public()
  async loginWithCredentials(@Body() dto: LoginWithCredentialsDto) {
    return this.authService.loginWithCredentials(dto);
  }

  @Get('login/google')
  @Public()
  @UseGuards(PassportAuthGuard('google'))
  loginWithGoogle() {}

  @Get('google/redirect')
  @Public()
  @UseGuards(PassportAuthGuard('google'))
  async googleRedirect(@Req() req: Request, @Res() res: Response) {
    const callbackUrl = (req.query.callbackUrl || 'http://localhost:3000') as string;
    const token = await this.authService.loginWithGoogle(req.user as TLoggedUser);

    res.cookie('token', token, { httpOnly: true });
    res.redirect(`${callbackUrl}`);
  }

  @Patch('change-password')
  async changePassword(@Body() dto: ChangePasswordDto, @User() user: UserType) {
    return this.authService.changePassword(dto, user);
  }
}
