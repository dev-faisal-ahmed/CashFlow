import bcrypt from "bcrypt";

import { UserRepository } from "./user.repository";
import { CreateUserDto } from "./user.validation";
import { SALT } from "@/lib/config";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(dto: CreateUserDto) {
    let hashedPassword = "";
    if (dto.password) hashedPassword = await this.hashPassword(dto.password);
    return this.userRepository.createUser({ ...dto, ...(dto.password && { password: hashedPassword }) });
  }

  async findUserForLogin(email: string) {
    return this.userRepository.findUserForLogin(email);
  }

  // helper
  async hashPassword(password: string) {
    return bcrypt.hash(password, SALT);
  }
}
