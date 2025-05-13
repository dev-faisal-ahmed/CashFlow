import * as bcrypt from 'bcrypt';

import { appConfig } from 'src/config';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RegisterWithCredentialsDto } from './auth.dto';
import { ConfigType } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { UserProvider } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @Inject(appConfig.KEY) private envConfig: ConfigType<typeof appConfig>,
  ) {}

  async registerWithCredentials(dto: RegisterWithCredentialsDto) {
    const existingUser = await this.userService.findByEmail(dto.email);

    if (!existingUser) throw new BadRequestException('User already exist');

    const password = await this.hashPassword(dto.password);

    const user = await this.userService.createUser({
      ...dto,
      password,
      provider: UserProvider.CREDENTIALS,
    });

    if (!user) throw new BadRequestException('Failed to create user!');

    return 'User Created Successfully';
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, this.envConfig.HASH_SALT);
  }
}
