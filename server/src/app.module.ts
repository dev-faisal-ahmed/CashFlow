import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig, googleConfig, mongoConfig } from './config';
import { JwtModule } from '@nestjs/jwt';
import { WalletModule } from './modules/wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongoConfig, appConfig, googleConfig],
    }),

    ConfigModule.forFeature(appConfig),
    MongooseModule.forRootAsync({ useFactory: mongoConfig }),
    JwtModule,

    // Core Modules
    AuthModule,
    WalletModule,
  ],
})
export class AppModule {}
