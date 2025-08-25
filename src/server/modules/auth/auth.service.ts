import bcrypt from "bcrypt";

import { AppError } from "@/server/core/app.error";
import { SALT } from "@/lib/config";
import { LoginWithCredentialsDto, LoginWithGoogleDto, SignupWithCredentialsDto } from "./auth.validation";
import { db } from "@/server/db";
import { EUserProvider, userTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

// Types
type TLoginResponse = Pick<typeof userTable.$inferSelect, "id" | "name" | "email" | "image">;
type ComparePassword = { givenPassword: string; hashedPassword: string };

export class AuthService {
  static async signup(dto: SignupWithCredentialsDto) {
    const hashedPassword = await this.hashPassword(dto.password);
    return db.insert(userTable).values({ ...dto, password: hashedPassword, provider: EUserProvider.credentials });
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

    const [newUser] = await db
      .insert(userTable)
      .values({ ...dto, provider: EUserProvider.google })
      .returning({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
        image: userTable.image,
      });

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
    const user = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
      columns: {
        id: true,
        name: true,
        email: true,
        image: true,
        password: true,
        provider: true,
      },
    });

    return user;
  }

  static async findUserFormAuthGuard(id: number) {
    const user = await db.query.userTable.findFirst({
      where: eq(userTable.id, id),
      columns: { id: true, name: true, email: true },
    });

    return user;
  }

  static mapLoginResponse(user: TLoginResponse) {
    const dto: TLoginResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    };

    return dto;
  }
}
