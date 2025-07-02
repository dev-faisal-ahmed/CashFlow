import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from '@/schema/wallet.schema';
import { WalletController } from './wallet.controller';
import { TransactionModule } from '../transaction/transaction.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]), TransactionModule, AuthModule],
  providers: [WalletService],
  exports: [MongooseModule],
  controllers: [WalletController],
})
export class WalletModule {}
