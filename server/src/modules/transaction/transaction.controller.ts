import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { User } from '@/common/decorators/user.decorator';
import { CreateTransferTransactionDto } from './transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('transfer')
  @UseGuards(AuthGuard)
  createTransfer(@Body() dto: CreateTransferTransactionDto, @User('_id') userId: string) {
    console.log(dto, userId);
    return this.transactionService.createTransferTransaction(dto, userId);
  }
}
