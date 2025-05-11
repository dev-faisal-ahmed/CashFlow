import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginWithGoogleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  image: string;
}
