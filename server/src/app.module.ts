import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig, googleConfig, mongoConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongoConfig, appConfig, googleConfig],
    }),
    ConfigModule.forFeature(appConfig),
    MongooseModule.forRootAsync({ useFactory: mongoConfig }),
    AuthModule,
  ],
})
export class AppModule {}
