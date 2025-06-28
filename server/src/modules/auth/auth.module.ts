import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthService } from './auth.service';
import { JwtSharedModule } from 'src/shared/jwt/jwt.module';

@Module({
  imports: [UserModule, JwtSharedModule],
  providers: [AuthService, GoogleStrategy, ConfigModule],
  controllers: [AuthController],
})
export class AuthModule {}
