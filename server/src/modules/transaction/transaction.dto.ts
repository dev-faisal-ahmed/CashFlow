import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateInitialTransactionDto {
  @IsNotEmpty()
  @IsMongoId()
  walletId: Types.ObjectId;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}
