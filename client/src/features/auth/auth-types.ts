import { z } from "zod";
import { loginSchema, signupSchema } from "./auth-schema";

export type TSigUpForm = z.infer<typeof signupSchema>;
export type TLoginForm = z.infer<typeof loginSchema>;
export type TAuthForm = TSigUpForm | TLoginForm;
