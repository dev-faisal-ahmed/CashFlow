import { Type } from 'class-transformer';
import { BudgetInterval } from '@/schema/source.schema';
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';

class BudgetDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  budget: number;

  @IsEnum(BudgetInterval)
  interval: BudgetInterval;
}

// Create Source
export class CreateSourceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  userId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BudgetDto)
  budget?: BudgetDto;
}
