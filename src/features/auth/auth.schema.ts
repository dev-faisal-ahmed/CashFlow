import z from "zod";
import { capitalize } from "@/lib/utils";

const baseAuthSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email" }),
  password: z.string().min(4, { message: "Password is too small" }),
});

const signup = baseAuthSchema
  .extend({
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required" })
      .transform((name) => capitalize(name)),

    confirmPassword: z.string(),
  })
  .superRefine((value, ctx) => {
    if (value.password !== value.confirmPassword) {
      ctx.addIssue({ code: "custom", message: "Password does not match", path: ["confirmPassword"] });
    }
  });

const login = baseAuthSchema;

export const authSchema = { signup, login };

export type TSignupFormData = z.infer<typeof signup>;
export type TLoginFormData = z.infer<typeof login>;
export type TAuthFormData = TSignupFormData | TLoginFormData;
