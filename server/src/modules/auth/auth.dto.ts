import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { capitalize } from '@/utils';

export class RegisterWithCredentialsDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @Transform(({ value }) => capitalize(value as string))
  name: string;

  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class LoginWithGoogleDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @Transform(({ value }) => capitalize(value as string))
  name: string;

  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsOptional()
  @IsString()
  image?: string;
}

export class LoginWithCredentialsDto {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  oldPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  newPassword: string;
}
