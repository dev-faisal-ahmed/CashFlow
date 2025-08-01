import { CreateUserDto, UpdateUserDto } from './user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '@/schema/user.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).lean();
  }

  async create(payload: CreateUserDto) {
    const user = await this.userModel.create(payload);
    return user;
  }

  async updateById(userId: Types.ObjectId, payload: UpdateUserDto) {
    const user = await this.userModel.updateOne({ _id: userId }, { $set: payload });
    return user;
  }
}
