import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('AUTH_SECRET'),
        signOptions: { expiresIn: '7d' },
        global: true,
      }),
    }),
  ],
  exports: [JwtModule],
})
export class JwtSharedModule {}
