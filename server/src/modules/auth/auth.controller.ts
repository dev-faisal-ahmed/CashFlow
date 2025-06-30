import { Response } from 'express';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ChangePasswordDto, LoginWithCredentialsDto, RegisterWithCredentialsDto } from './auth.dto';
import { LoggedUser } from 'src/common/types';
import { User } from 'src/common/decorators/user.decorator';
import { UserType } from 'src/schema/user.schema';
import { Public } from 'src/common/decorators/public.decorator';

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
  async loginWithGoogle() {}

  @Get('google/redirect')
  @Public()
  @UseGuards(PassportAuthGuard('google'))
  async googleRedirect(@Req() req: any, @Res() res: Response) {
    const callbackUrl = req.query.callbackUrl || 'http://localhost:3000';
    const token = await this.authService.loginWithGoogle(req.user as LoggedUser);

    res.cookie('token', token, { httpOnly: true });
    res.redirect(`${callbackUrl}`);
  }

  @Patch('change-password')
  async forgetPassword(@Body() dto: ChangePasswordDto, @User() user: UserType) {
    return this.authService.changePassword(dto, user);
  }
}
