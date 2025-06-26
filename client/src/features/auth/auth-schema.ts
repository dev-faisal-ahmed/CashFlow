import { capitalize } from "@/lib/utils";
import { z } from "zod";

const baseAuthSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email" }),
  password: z.string().min(4, { message: "Password is too small" }),
});

export const signupSchema = baseAuthSchema
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

export const loginSchema = baseAuthSchema;
