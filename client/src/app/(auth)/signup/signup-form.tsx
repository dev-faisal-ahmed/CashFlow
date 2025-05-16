"use client";

import Link from "next/link";

import { z } from "zod";
import { FieldForm } from "@/components/shared/form/field.form";
import { PasswordInput } from "@/components/shared/form/password-input";
import { FaArrowRightLong } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@/auth/components/google-login";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";

// Schemas
const singupFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid Email"),
  password: z.string().min(4, "Password is too short"),
  confirmPassword: z.string(),
});

// Main Types
type SignupFormSchema = z.infer<typeof singupFormSchema>;

// Main Component
export const SignupForm = () => {
  const form = useForm<SignupFormSchema>({ resolver: zodResolver(singupFormSchema) });
  const handleSignup = form.handleSubmit((formData) => {
    console.log(formData);
  });

  return (
    <Form {...form}>
      <GoogleLogin />
      <div className="my-6 flex items-center gap-2">
        <div className="bg-input h-[1.5px] w-full" />
        or
        <div className="bg-input h-[1.5px] w-full" />
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSignup}>
        <FieldForm control={form.control} name="name" label="Full Name">
          {({ field }) => <Input {...field} placeholder="@: John Doe" />}
        </FieldForm>
        <FieldForm control={form.control} name="email" label="Email">
          {({ field }) => <Input {...field} placeholder="@: example@mail.com" />}
        </FieldForm>
        <FieldForm control={form.control} name="password" label="Password">
          {({ field }) => <PasswordInput {...field} placeholder="Input password" />}
        </FieldForm>
        <FieldForm control={form.control} name="confirmPassword" label="Confirm Password">
          {({ field }) => <PasswordInput {...field} placeholder="Confirm password" />}
        </FieldForm>
        <Button className="mt-4">
          Sign Up <FaArrowRightLong />
        </Button>
      </form>
      <div className="mt-4 space-y-1 text-center text-sm">
        <p className="text-muted-foreground">Already Have an account?</p>
        <Link href="/login" className="text-primary hover:underline">
          Login
        </Link>
      </div>
    </Form>
  );
};
