import z from "zod";
import { EUserProvider } from "./user.interface";

const createUser = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.email("Invalid email"),
  password: z.string().nonempty("Password can not be empty").optional(),
  image: z.string().nonempty("Image can not be empty").optional(),
  provider: z.enum(Object.values(EUserProvider), "Invalid provider"),
});

export const userValidation = { createUser };

export type CreateUserDto = z.infer<typeof createUser>;
