import * as bcrypt from 'bcrypt';

import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserProvider } from 'src/schemas/user.schema';
import { LoginWithCredentials, LoginWithGoogleDto, RegisterDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly config: ConfigService,
  ) {}

  async registerWithCredentials(dto: RegisterDto) {
    const isUserExist = await this.userModel.findOne({ email: dto.email });
    if (isUserExist) throw new ConflictException('Email already exist');

    const hashedPassword = await bcrypt.hash(
      dto.password,
      Number(this.config.get('HASH_SALT')),
    );

    const user = await this.userModel.create({
      ...dto,
      password: hashedPassword,
      provider: UserProvider.CREDENTIALS,
    });

    if (!user) throw new InternalServerErrorException('Failed to create user');

    return 'User created successfully';
  }

  async loginWithGoogle(dto: LoginWithGoogleDto) {
    const projection = { _id: 1, email: 1, image: 1, name: 1 };

    const isUserExist = await this.userModel.findOne(
      { email: dto.email },
      projection,
    );

    if (isUserExist) return isUserExist;

    const user = await this.userModel.create({
      ...dto,
      provider: UserProvider.GOOGLE,
    });

    if (!user) throw new InternalServerErrorException('Failed to create user');
    const { _id, name, image, email } = user;

    return { _id, name, image, email };
  }

  async loginWithCredentials(dto: LoginWithCredentials) {
    const projection = { _id: 1, email: 1, image: 1, name: 1, password: 1 };

    const isUserExist = await this.userModel.findOne(
      { email: dto.email, provider: UserProvider.CREDENTIALS },
      projection,
    );

    if (!isUserExist) throw new NotFoundException('User not found!');

    const isPasswordMatch = await bcrypt.compare(
      dto.password,
      isUserExist.password,
    );

    if (!isPasswordMatch)
      throw new ConflictException('Password does not match!');

    return {
      _id: isUserExist._id,
      name: isUserExist.name,
      email: isUserExist.email,
      image: isUserExist.image,
    };
  }
}
