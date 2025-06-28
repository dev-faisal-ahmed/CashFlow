import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig, googleConfig, mongoConfig } from './config';
import { WalletModule } from './modules/wallet/wallet.module';
import { AuthGuard } from './common/guard/auth.guard';
import { UserModule } from './modules/user/user.module';
import { JwtSharedModule } from './shared/jwt/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [mongoConfig, appConfig, googleConfig] }),
    MongooseModule.forRootAsync({ useFactory: mongoConfig }),
    JwtSharedModule,
    UserModule,

    // routes
    AuthModule,
    WalletModule,
  ],
  providers: [{ provide: 'APP_GUARD', useClass: AuthGuard }],
})
export class AppModule {}
