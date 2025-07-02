import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CreateWalletDto } from './wallet.dto';
import { User } from '@/common/decorators/user.decorator';
import { WalletService } from './wallet.service';
import { TQueryParams } from '@/types';
import { AuthGuard } from '../auth/guard/auth.guard';

@Controller('/wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createWallet(@Body() dto: CreateWalletDto, @User('_id') userId: string) {
    return this.walletService.createWallet(dto, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getWallets(@Query() query: TQueryParams, @User('_id') userId: string) {
    return this.walletService.getWallets(query, userId);
  }
}
