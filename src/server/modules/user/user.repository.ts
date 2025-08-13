import { UserModel } from "./user.schema";
import { CreateUserDto } from "./user.validation";

export class UserRepository {
  async createUser(dto: CreateUserDto) {
    const user = await UserModel.create(dto);
    return user;
  }
}
