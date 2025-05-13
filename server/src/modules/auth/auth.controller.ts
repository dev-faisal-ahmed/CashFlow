import {
  LoginWithCredentialsDto,
  loginWithCredentialsSchema,
  RegisterWithCredentialsDto,
} from './auth.dto';

import { ResponseDto } from 'src/common/dto/response.dto';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoggedUser } from 'src/common/types';
import { ZodValidationPipe } from 'src/common/pipes/zod.validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerWithCredentials(@Body() dto: RegisterWithCredentialsDto) {
    const message = await this.authService.registerWithCredentials(dto);
    return new ResponseDto(message);
  }

  @Post('login')
  async loginWithCredentials(
    @Body(new ZodValidationPipe(loginWithCredentialsSchema))
    dto: LoginWithCredentialsDto,
  ) {
    const accessToken = await this.authService.loginWithCredentials(dto);
    return new ResponseDto('Successfully logged in', accessToken);
  }

  @Get('login/google')
  @UseGuards(AuthGuard('google'))
  async loginWithGoogle() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() req: any) {
    const accessToken = await this.authService.loginWithGoogle(
      req.user as LoggedUser,
    );

    return new ResponseDto('Successfully logged in', accessToken);
  }
}
