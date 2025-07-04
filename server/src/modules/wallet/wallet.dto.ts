import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Transform, Type } from 'class-transformer';
import { capitalize } from '@/utils';
import { WalletAccessPermission } from '@/schema/wallet.schema';

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
class WalletMemberDto {
  @IsMongoId({ message: 'Invalid userId' })
  userId: string;

  @IsArray()
  @ArrayUnique()
  @IsEnum(WalletAccessPermission, { each: true, message: 'Invalid permission' })
  permissions: WalletAccessPermission[];
}

export class UpdateWalletDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => capitalize(value as string))
  name?: string;

  @IsOptional()
  @IsBoolean()
  isSaving?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WalletMemberDto)
  @ArrayUnique((m: WalletMemberDto) => m.userId, { message: 'Can not add same member twice' })
  members?: WalletMemberDto[];
}
