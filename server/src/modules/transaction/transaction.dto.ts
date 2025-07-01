import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { TransactionNature } from 'src/schema/transaction.schema';

export class CreateInitialTransactionDto {
  @IsNotEmpty()
  @IsMongoId()
  walletId: Types.ObjectId;

  @IsEnum(TransactionNature, { message: 'Invalid nature' })
  nature: TransactionNature;

  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'amount can not be negative' })
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}
