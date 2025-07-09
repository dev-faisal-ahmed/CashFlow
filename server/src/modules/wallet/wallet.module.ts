import { forwardRef, Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from '@/schema/wallet.schema';
import { WalletController } from './wallet.controller';
import { TransactionModule } from '../transaction/transaction.module';
import { AuthModule } from '../auth/auth.module';
import { WalletHelper } from './wallet.helper';

@Module({
  imports: [MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]), AuthModule, forwardRef(() => TransactionModule)],
  providers: [WalletService, WalletHelper],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}
