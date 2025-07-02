import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { JwtSharedModule } from '@/shared/jwt/jwt.module';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule, JwtSharedModule],
  providers: [AuthService, GoogleStrategy, ConfigModule],
  exports: [UserModule, JwtSharedModule],
  controllers: [AuthController],
})
export class AuthModule {}
