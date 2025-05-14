import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig, googleConfig, mongoConfig } from './config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongoConfig, appConfig, googleConfig],
    }),
    ConfigModule.forFeature(appConfig),
    MongooseModule.forRootAsync({ useFactory: mongoConfig }),
    JwtModule,
    AuthModule,
  ],
})
export class AppModule {}
