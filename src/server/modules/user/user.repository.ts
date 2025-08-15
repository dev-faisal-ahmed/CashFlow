import { UserModel } from "./user.schema";
import { CreateUserDto } from "./user.validation";

export class UserRepository {
  async findUserForLogin(email: string) {
    return UserModel.findOne({ email }, { _id: 1, email: 1, name: 1, image: 1, password: 1, provider: 1 }).lean();
  }

  async findUserFormAuthGuard(id: string) {
    return UserModel.findOne({ _id: id }, { _id: 1, email: 1, name: 1 }).lean();
  }

  async createUser(dto: CreateUserDto) {
    const user = await UserModel.create(dto);
    return user;
  }
}
