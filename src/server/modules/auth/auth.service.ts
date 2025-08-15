import bcrypt from "bcrypt";

import { Types } from "mongoose";
import { AppError } from "@/server/core/app.error";
import { LoginWithCredentialsDto, LoginWithGoogleDto, SignupDto } from "./auth.validation";
import { EUserProvider } from "../user/user.interface";
import { UserService } from "../user/user.service";

// Types
type TLoginResponse = { _id: Types.ObjectId; name: string; email: string; image?: string };

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async signup(dto: SignupDto) {
    return this.userService.createUser({ ...dto, provider: EUserProvider.credentials });
  }

  async loginWithCredentials(dto: LoginWithCredentialsDto) {
    const user = await this.userService.findUserForLogin(dto.email);
    if (!user) throw new AppError("User not found", 404);
    if (user.provider !== EUserProvider.credentials) throw new AppError("Invalid provider");

    const isPasswordMatch = await this.comparePassword(dto.password, user.password ?? "");
    if (!isPasswordMatch) throw new AppError("Password did not match!");

    return this.mapLoginResponse(user);
  }

  async loginWithGoogle(dot: LoginWithGoogleDto) {
    const user = await this.userService.findUserForLogin(dot.email);
    if (user) return this.mapLoginResponse(user);

    const newUser = await this.userService.createUser({ ...dot, provider: EUserProvider.google });
    return this.mapLoginResponse(newUser);
  }

  // Helper
  async comparePassword(givenPassword: string, hashedPassword: string) {
    return bcrypt.compare(givenPassword, hashedPassword);
  }

  async mapLoginResponse(user: TLoginResponse) {
    const dto: TLoginResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    };

    return dto;
  }
}
