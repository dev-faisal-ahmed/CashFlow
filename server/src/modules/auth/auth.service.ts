import * as bcrypt from 'bcrypt';

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { CommonConfigService } from 'src/common/config/config.service';
import { RegisterUserWithCredentialsDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly env: CommonConfigService,
  ) {}

  async registerWithCredentials(dto: RegisterUserWithCredentialsDto) {
    console.log(dto);
    const isUserExist = await this.userModel.findOne({ email: dto.email });
    if (isUserExist) throw new ConflictException('Email already exist');

    const hashedPassword = await bcrypt.hash(
      dto.password,
      this.env.getHashSalt(),
    );

    const user = await this.userModel.create({
      ...dto,
      password: hashedPassword,
    });

    if (!user) throw new InternalServerErrorException('Failed to create user');

    return 'User created successfully';
  }
}
