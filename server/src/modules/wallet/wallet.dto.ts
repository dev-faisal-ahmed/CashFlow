import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { capitalize } from '@/utils';

// Create Wallet
export class CreateWalletDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @Transform(({ value }) => capitalize(value as string))
  name: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  initialBalance?: number;

  @IsOptional()
  @IsBoolean()
  isSaving?: boolean;
}

// Update Wallet
export class UpdateWalletDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => capitalize(value as string))
  name?: string;

  @IsOptional()
  @IsBoolean()
  isSaving?: boolean;
}
