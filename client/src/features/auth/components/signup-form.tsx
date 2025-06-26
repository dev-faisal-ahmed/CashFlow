"use client";

import { useForm } from "react-hook-form";
import { AuthEntryCard } from "./auth-entry-card";
import { AuthFormFields } from "./auth-form-fields";
import { TSigUpForm } from "../auth-types";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../auth-schema";
import { Button } from "@/components/ui/button";

export const SignupForm = () => {
  const form = useForm<TSigUpForm>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    resolver: zodResolver(signupSchema),
  });

  return (
    <AuthEntryCard formType="signup">
      <Form {...form}>
        <form className="flex flex-col gap-4">
          <AuthFormFields formType="signup" />
          <Button className="mt-6">Signup</Button>
        </form>
      </Form>
    </AuthEntryCard>
  );
};
