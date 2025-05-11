import { ResponseDto } from 'src/common/dto/response.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginWithGoogleDto } from './dto/login.dto';

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
    return new ResponseDto('Successfully logged In', user);
  }
}
