import bcrypt from "bcrypt";

import { Types } from "mongoose";
import { AppError } from "@/server/core/app.error";
import { SALT } from "@/lib/config";
import { LoginWithCredentialsDto, LoginWithGoogleDto, SignupDto } from "./auth.validation";
import { EUserProvider } from "../user/user.interface";
import { UserRepository } from "../user/user.repository";

// Types
type TLoginResponse = { _id: Types.ObjectId; name: string; email: string; image?: string };

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async signup(dto: SignupDto) {
    const hashedPassword = await this.hashPassword(dto.password);
    return this.userRepository.createUser({ ...dto, provider: EUserProvider.credentials, password: hashedPassword });
  }

  async loginWithCredentials(dto: LoginWithCredentialsDto) {
    const user = await this.userRepository.findUserForLogin(dto.email);
    if (!user) throw new AppError("User not found", 404);
    if (user.provider !== EUserProvider.credentials) throw new AppError("Invalid provider");

    const isPasswordMatch = await this.comparePassword(dto.password, user.password ?? "");
    if (!isPasswordMatch) throw new AppError("Password did not match!");

    return this.mapLoginResponse(user);
  }

  async loginWithGoogle(dto: LoginWithGoogleDto) {
    const user = await this.userRepository.findUserForLogin(dto.email);
    if (user) return this.mapLoginResponse(user);

    const newUser = await this.userRepository.createUser({ ...dto, provider: EUserProvider.google });
    return this.mapLoginResponse(newUser);
  }

  // Helper
  async hashPassword(password: string) {
    return bcrypt.hash(password, SALT);
  }

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
