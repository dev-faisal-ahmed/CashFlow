import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, googleConfig, mongoConfig } from './config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtSharedModule } from './shared/jwt/jwt.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { SourceModule } from './modules/source/source.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [mongoConfig, appConfig, googleConfig] }),
    MongooseModule.forRootAsync({ useFactory: mongoConfig }),
    JwtSharedModule,
    UserModule,

    // routes
    AuthModule,
    WalletModule,
    SourceModule,
    TransactionModule,
  ],
})
export class AppModule {}
