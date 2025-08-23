import { capitalize } from "@/lib/utils";
import z from "zod";

const signupWithCredentials = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .nonempty("Name can not be empty")
    .transform((value) => capitalize(value)),

  email: z.email("Invalid Email"),
  password: z.string({ error: "Password is required" }).min(4, "Password is too short"),
});

const loginWithCredentials = z.object({
  email: z.email("Invalid Email"),
  password: z.string({ error: "Password is required" }).nonempty("Password is required"),
});

const loginWithGoogle = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .nonempty("Name can not be empty")
    .transform((value) => capitalize(value)),

  email: z.email("Invalid Email"),
  image: z.string().nonempty("Image can not be empty").optional(),
});

export const authValidation = { signupWithCredentials, loginWithCredentials, loginWithGoogle };

export type SignupWithCredentialsDto = z.infer<typeof signupWithCredentials>;
export type LoginWithCredentialsDto = z.infer<typeof loginWithCredentials>;
export type LoginWithGoogleDto = z.infer<typeof loginWithGoogle>;
