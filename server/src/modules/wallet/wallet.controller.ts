import { Body, Controller, Post } from '@nestjs/common';
import { CreateWalletDto } from './wallet.dto';
import { User } from 'src/common/decorators/user.decorator';
import { WalletService } from './wallet.service';

@Controller('/wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('/')
  async createWallet(@Body() dto: CreateWalletDto, @User('_id') userId: string) {
    return this.walletService.createWallet(dto, userId);
  }
}
