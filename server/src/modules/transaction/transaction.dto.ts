import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';
import { TransactionNature } from '@/schema/transaction.schema';
import { Types } from 'mongoose';

export class CreateInitialTransactionDto {
  @IsNotEmpty()
  @IsMongoId()
  walletId: Types.ObjectId;

  @IsEnum(TransactionNature, { message: 'Invalid nature' })
  nature: TransactionNature;

  @IsNumber()
  @IsPositive({ message: 'amount can not be negative' })
  amount: number;

  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Description can not be empty' })
  description?: string;
}

export class CreateTransferTransactionDto {
  @IsNumber()
  @IsPositive({ message: 'amount can not be negative' })
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsMongoId()
  sourceWalletId: Types.ObjectId;

  @IsMongoId()
  destinationWalletId: Types.ObjectId;
}
