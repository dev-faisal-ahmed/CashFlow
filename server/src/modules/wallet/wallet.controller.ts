import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
    return this.walletService.create(dto, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getWallets(@Query() query: TQueryParams, @User('_id') userId: string) {
    return this.walletService.getAll(query, userId);
  }

  @Patch(':walletId')
  @UseGuards(AuthGuard)
  async updateWallet(@Body() dto: UpdateWalletDto, @Param('walletId', ParseObjectIdPipe) walletId: string, @User('_id') userId: string) {
    return this.walletService.updateOne(dto, walletId, userId);
  }

  @Delete(':walletId')
  @UseGuards(AuthGuard)
  async deleteWallet(@Param('walletId', ParseObjectIdPipe) walletId: string, @User('_id') userId: string) {
    return this.walletService.deleteOne(walletId, userId);
  }

  // @Get('/info-for-transfer')
  // async getWalletInfoForTransaction(@Query() query: TQueryParams) {
  //   return this.walletService.walletInfoForTransfer(query.formWalletId, query.toWalletId);
  // }
}
