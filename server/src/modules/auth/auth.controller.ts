import { ResponseDto } from 'src/common/dto/response.dto';
import { Body, Controller, Post } from '@nestjs/common';
import {
  LoginWithCredentials,
  LoginWithGoogleDto,
  RegisterDto,
} from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerWithCredentials(@Body() dto: RegisterDto) {
    const messages = await this.authService.registerWithCredentials(dto);
    return new ResponseDto(messages);
  }

  @Post('login/google')
  async loginWithGoogle(@Body() dto: LoginWithGoogleDto) {
    const user = await this.authService.loginWithGoogle(dto);
    return new ResponseDto('Successfully logged in!', user);
  }

  @Post('login/credentials')
  async loginWithCredentials(@Body() dto: LoginWithCredentials) {
    const user = await this.authService.loginWithCredentials(dto);
    return new ResponseDto('Successfully logged in!', user);
  }
}
