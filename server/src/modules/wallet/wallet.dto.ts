import { Transform } from 'class-transformer';
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { capitalize } from 'src/utils';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @Transform(({ value }) => capitalize(value as string))
  name: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsMongoId()
  ownerId: string;

  @IsOptional()
  @IsBoolean()
  isSaving?: boolean;
}
