import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateWalletDto } from './wallet.dto';
import { User } from 'src/common/decorators/user.decorator';
import { WalletService } from './wallet.service';
import { TQueryParams } from 'src/common/types';

@Controller('/wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async createWallet(@Body() dto: CreateWalletDto, @User('_id') userId: string) {
    return this.walletService.createWallet(dto, userId);
  }

  @Get()
  async getWallets(@Query() query: TQueryParams, @User('_id') userId: string) {
    return this.walletService.getWallets(query, userId);
  }
}
