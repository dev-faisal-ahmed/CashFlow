import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { RegisterUserWithCredentialsDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { HASH_SALT } from 'src/config';
import { Model } from 'mongoose';

import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async registerWithCredentials(dto: RegisterUserWithCredentialsDto) {
    const isUserExist = await this.userModel.findOne({ email: dto.email });
    if (isUserExist) throw new ConflictException('Email already exist');

    const hashedPassword = await bcrypt.hash(dto.password, Number(HASH_SALT));

    const user = await this.userModel.create({
      ...dto,
      password: hashedPassword,
    });

    if (!user) throw new InternalServerErrorException('Failed to create user');

    return 'User created successfully';
  }
}
