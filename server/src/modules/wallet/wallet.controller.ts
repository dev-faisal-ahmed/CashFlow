import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateWalletDto, UpdateWalletDto } from './wallet.dto';
import { User } from '@/common/decorators/user.decorator';
import { WalletService } from './wallet.service';
import { TQueryParams } from '@/types';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

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

  @Patch(':walletId')
  @UseGuards(AuthGuard)
  async updateWallet(@Body() dto: UpdateWalletDto, @Param('walletId', ParseObjectIdPipe) walletId: string, @User('_id') userId: string) {
    return this.walletService.updateWallet(dto, walletId, userId);
  }
}
