import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from '../../schema/wallet.schema';
import { WalletController } from './wallet.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }])],
  providers: [WalletService],
  exports: [MongooseModule],
  controllers: [WalletController],
})
export class WalletModule {}
