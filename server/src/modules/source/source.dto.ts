import { Transform, Type } from 'class-transformer';
import { BudgetInterval, SourceType } from '@/schema/source.schema';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateIf, ValidateNested } from 'class-validator';

class BudgetDto {
  @IsNumber()
  @IsNotEmpty({ message: "Amount is required" })
  @IsPositive({ message: "Amount must be a positive number" })
  amount: number;

  @IsEnum(BudgetInterval, { message: "Invalid interval" })
  interval: BudgetInterval;
}

// Create Source
export class CreateSourceDto {
  @IsString()
  @IsNotEmpty({ message: "Source name is required" })
  name: string;

  @IsEnum(SourceType, { message: "Invalid source type" })
  type: SourceType;

  @Transform(addBudgetIfExpense)
  @ValidateIf((object) => object.type === SourceType.EXPENSE)
  @ValidateNested()
  @Type(() => BudgetDto)
  budget?: BudgetDto;
}

// functions
type AddBudgetIfExpenseArgs = { value: BudgetDto; obj: CreateSourceDto };
function addBudgetIfExpense({ value, obj }: AddBudgetIfExpenseArgs) {
  if (obj.type === SourceType.INCOME) return undefined;
  return value;
}
