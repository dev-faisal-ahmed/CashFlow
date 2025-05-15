import * as bcrypt from 'bcrypt';

import { ChangePasswordDto, LoginWithCredentialsDto, LoginWithGoogleDto, loginWithGoogleSchema, RegisterWithCredentialsDto } from './auth.dto';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { appConfig } from 'src/config';
import { ConfigType } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { UserDocument, UserProvider } from 'src/schemas/user.schema';
import { LoggedUser } from 'src/common/types';
import { ResponseDto } from 'src/common/dto/response.dto';
import { JwtService } from '@nestjs/jwt';

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
    const result = loginWithGoogleSchema.safeParse(dto);

    if (!result.success) throw new BadRequestException('Invalid user data');
    const validatedUser = result.data;

    const isUserExist = await this.userService.findByEmail(validatedUser.email);
    // when user already exist
    if (isUserExist) return this.generateToken(isUserExist);

    // creating new user
    const user = await this.userService.createUser({
      ...validatedUser,
      provider: UserProvider.GOOGLE,
    });

    if (!user) throw new BadRequestException('Failed create user');

    return new ResponseDto('Successfully logged in', this.generateToken(user));
  }

  async loginWithCredentials(dto: LoginWithCredentialsDto) {
    const isUserExist = await this.userService.findByEmail(dto.email);
    if (!isUserExist) throw new NotFoundException('User not found');

    const isPasswordMatch = await this.comparePassword(dto.password, isUserExist.password);

    if (!isPasswordMatch) throw new BadRequestException('Password did not match');

    return new ResponseDto('Successfully logged in', this.generateToken(isUserExist));
  }

  async changePassword(dto: ChangePasswordDto, user: UserDocument) {
    const isPasswordMatched = await this.comparePassword(dto.oldPassword, user.password);
  }

  // helper methods
  private async hashPassword(password: string) {
    return bcrypt.hash(password, this.envConfig.HASH_SALT);
  }

  private async comparePassword(givenPassword: string, encryptedPassword: string) {
    return bcrypt.compare(givenPassword, encryptedPassword);
  }

  private generateToken(payload: LoggedUser) {
    const { _id, name, email, image, provider } = payload;
    return this.jwtService.sign({ _id, name, email, image, provider });
  }
}
