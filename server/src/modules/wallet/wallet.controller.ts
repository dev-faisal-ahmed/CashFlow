import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { CreateWalletDto } from './wallet.dto';
import { User } from 'src/common/decorators/user.decorator';

@Controller('/wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  async createWallet(@Body() dto: CreateWalletDto, @User('_id') userId: string) {
    return this.walletService.createWallet(dto, userId);
  }
}
