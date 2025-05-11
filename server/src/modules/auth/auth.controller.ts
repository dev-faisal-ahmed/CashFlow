import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserWithCredentialsDto } from './dto/register.dto';
import { ResponseDto } from 'src/common/dto/response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/credentials')
  async registerWithCredentials(@Body() dto: RegisterUserWithCredentialsDto) {
    const messages = await this.authService.registerWithCredentials(dto);
    return new ResponseDto(messages);
  }
}
