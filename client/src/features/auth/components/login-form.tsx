"use client";

import { useForm } from "react-hook-form";
import { AuthEntryCard } from "./auth-entry-card";
import { AuthFormFields } from "./auth-form-fields";
import { TLoginForm } from "../auth-types";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../auth-schema";
import { Button } from "@/components/ui/button";

export const LoginForm = () => {
  const form = useForm<TLoginForm>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  return (
    <AuthEntryCard formType="login">
      <Form {...form}>
        <form className="flex flex-col gap-4">
          <AuthFormFields formType="login" />
          <Button className="mt-6">Login</Button>
        </form>
      </Form>
    </AuthEntryCard>
  );
};
