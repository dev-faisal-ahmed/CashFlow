import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CreateTransferTransactionDto } from './transaction.dto';
import { User } from '@/common/decorators/user.decorator';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/transfer')
  @UseGuards(AuthGuard)
  async createTransfer(@Body() dto: CreateTransferTransactionDto, @User('_id') userId: string) {
    return this.transactionService.createTransferTransaction(dto, userId);
  }
}
