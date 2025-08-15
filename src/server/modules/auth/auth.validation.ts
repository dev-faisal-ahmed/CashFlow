import { capitalize } from "@/lib/utils";
import z from "zod";

const loginWithCredentials = z.object({
  email: z.email("Invalid Email"),
  password: z.string({ error: "Password is required" }).nonempty("Password is required"),
});

const signup = z.object({
  name: z
    .string()
    .nonempty("Name can not be empty")
    .transform((value) => capitalize(value)),

  email: z.email("Invalid Email"),
  password: z.string({ error: "Password is required" }).min(4, "Password is too short"),
});

export const authValidation = { loginWithCredentials, signup };

export type LoginWithCredentialsDto = z.infer<typeof loginWithCredentials>;
export type SignupDto = z.infer<typeof signup>;
