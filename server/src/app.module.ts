import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.modules';
import { ConfigModule } from '@nestjs/config';
import { appConfig, mongoConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [mongoConfig] }),
    ConfigModule.forFeature(appConfig),
    MongooseModule.forRootAsync({ useFactory: mongoConfig }),
    AuthModule,
  ],
})
export class AppModule {}
