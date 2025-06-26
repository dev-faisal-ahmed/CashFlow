"use client";

import { AuthEntryCard } from "./auth-entry-card";
import { AuthFormFields } from "./auth-form-fields";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useLogin } from "../auth-hook";

export const LoginForm = () => {
  const { form, handleLogin, isPending } = useLogin();

  return (
    <AuthEntryCard formType="login">
      <Form {...form}>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <AuthFormFields formType="login" />

          <Button className="mt-6" isLoading={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
    </AuthEntryCard>
  );
};
