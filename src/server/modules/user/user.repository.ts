import { UserModel } from "./user.schema";
import { CreateUserDto } from "./user.validation";

export class UserRepository {
  async finUserForLogin(email: string) {
    return UserModel.findOne({ email }, { _id: 1, email: 1, name: 1, image: 1, password: 1, provider: 1 }).exec();
  }

  async createUser(dto: CreateUserDto) {
    const user = await UserModel.create(dto);
    return user;
  }
}
