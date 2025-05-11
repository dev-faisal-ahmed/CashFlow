import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserWithCredentialsDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
