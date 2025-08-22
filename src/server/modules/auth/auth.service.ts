import bcrypt from "bcrypt";

import { Types } from "mongoose";
import { AppError } from "@/server/core/app.error";
import { SALT } from "@/lib/config";
import { LoginWithCredentialsDto, LoginWithGoogleDto, SignupDto } from "./auth.validation";
import { EUserProvider } from "../user/user.interface";
import { UserModel } from "../user/user.schema";

// Types
type TLoginResponse = { _id: Types.ObjectId; name: string; email: string; image?: string };
type ComparePassword = { givenPassword: string; hashedPassword: string };

export class AuthService {
  static async signup(dto: SignupDto) {
    const hashedPassword = await this.hashPassword(dto.password);
    return UserModel.create({ ...dto, password: hashedPassword, provider: EUserProvider.credentials });
  }

  static async loginWithCredentials(dto: LoginWithCredentialsDto) {
    const user = await this.findUserForLogin(dto.email);
    if (!user) throw new AppError("User not found", 404);
    if (user.provider !== EUserProvider.credentials) throw new AppError("Invalid provider");

    const isPasswordMatch = await this.comparePassword({ givenPassword: dto.password, hashedPassword: user.password ?? "" });
    if (!isPasswordMatch) throw new AppError("Password did not match!");

    return this.mapLoginResponse(user);
  }

  static async loginWithGoogle(dto: LoginWithGoogleDto) {
    const user = await this.findUserForLogin(dto.email);
    if (user) return this.mapLoginResponse(user);

    const newUser = await UserModel.create({ ...dto, provider: EUserProvider.google });
    return this.mapLoginResponse(newUser);
  }

  // Helper
  static async hashPassword(password: string) {
    return bcrypt.hash(password, SALT);
  }

  static async comparePassword({ givenPassword, hashedPassword }: ComparePassword) {
    return bcrypt.compare(givenPassword, hashedPassword);
  }

  static async findUserForLogin(email: string) {
    return UserModel.findOne({ email }, { _id: 1, email: 1, name: 1, image: 1, password: 1, provider: 1 }).lean();
  }

  static async findUserFormAuthGuard(id: string) {
    return UserModel.findOne({ _id: id }, { _id: 1, email: 1, name: 1 }).lean();
  }

  static mapLoginResponse(user: TLoginResponse) {
    const dto: TLoginResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    };

    return dto;
  }
}
