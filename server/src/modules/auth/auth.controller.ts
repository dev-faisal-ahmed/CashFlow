import { ChangePasswordDto, LoginWithCredentialsDto, loginWithCredentialsSchema, RegisterWithCredentialsDto } from './auth.dto';
import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod.validation.pipe';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { UserType } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';
import { LoggedUser } from 'src/common/types';
import { Response } from 'express';

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
  @UseGuards(PassportAuthGuard('google'))
  async loginWithGoogle() {}

  @Get('google/redirect')
  @UseGuards(PassportAuthGuard('google'))
  async googleRedirect(@Req() req: any, @Res() res: Response) {
    const callbackUrl = req.query.callbackUrl || 'http://localhost:3000';
    const token = await this.authService.loginWithGoogle(req.user as LoggedUser);
    res.redirect(`${callbackUrl}?token=${token}`);
  }

  @Patch('change-password')
  @UseGuards(AuthGuard)
  async forgetPassword(@Body() dto: ChangePasswordDto, @User() user: UserType) {
    return this.authService.changePassword(dto, user);
  }
}
