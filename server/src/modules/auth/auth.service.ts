import * as bcrypt from 'bcrypt';

import { ChangePasswordDto, LoginWithCredentialsDto, LoginWithGoogleDto, RegisterWithCredentialsDto } from './auth.dto';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { appConfig } from '@/config';
import { UserProvider } from '@/schema/user.schema';
import { ResponseDto } from '@/common/dto/response.dto';
import { Types } from 'mongoose';
import { TLoggedUser } from '@/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @Inject(appConfig.KEY) private envConfig: ConfigType<typeof appConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async registerWithCredentials(dto: RegisterWithCredentialsDto) {
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) throw new BadRequestException('User already exist');

    const password = await this.hashPassword(dto.password);
    const user = await this.userService.createUser({
      ...dto,
      password,
      provider: UserProvider.CREDENTIALS,
    });

    if (!user) throw new BadRequestException('Failed to create user!');

    return new ResponseDto('User created successfully');
  }

  async loginWithGoogle(dto: LoginWithGoogleDto) {
    const isUserExist = await this.userService.findByEmail(dto.email);
    if (isUserExist) return this.generateToken(isUserExist);

    // creating new user
    const user = await this.userService.createUser({ ...dto, provider: UserProvider.GOOGLE });
    if (!user) throw new BadRequestException('Failed create user');

    return this.generateToken(user);
  }

  async loginWithCredentials(dto: LoginWithCredentialsDto) {
    const isUserExist = await this.userService.findByEmail(dto.email);
    if (!isUserExist) throw new NotFoundException('User not found');

    const isPasswordMatch = await this.comparePassword(dto.password, isUserExist.password);

    if (!isPasswordMatch) throw new BadRequestException('Password did not match');

    return new ResponseDto('Successfully logged in', this.generateToken(isUserExist));
  }

  async changePassword(dto: ChangePasswordDto, userId: Types.ObjectId, password: string) {
    const isPasswordMatched = await this.comparePassword(dto.oldPassword, password);
    if (!isPasswordMatched) throw new BadRequestException('Password does not match');

    const hashedPassword = await this.hashPassword(dto.newPassword);
    await this.userService.updateUserById(userId, { password: hashedPassword });

    return new ResponseDto('Password changed successfully');
  }

  // helper methods
  private async hashPassword(password: string) {
    return bcrypt.hash(password, this.envConfig.HASH_SALT);
  }

  private async comparePassword(givenPassword: string, encryptedPassword: string) {
    return bcrypt.compare(givenPassword, encryptedPassword);
  }

  private generateToken(payload: TLoggedUser) {
    const { _id, name, email, image, provider } = payload;
    return this.jwtService.sign({ _id, name, email, image, provider });
  }
}
