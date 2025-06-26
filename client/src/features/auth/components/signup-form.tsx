"use client";

import { AuthEntryCard } from "./auth-entry-card";
import { AuthFormFields } from "./auth-form-fields";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useSignup } from "../auth-hook";

export const SignupForm = () => {
  const { form, handleSignup, isPending } = useSignup();

  return (
    <AuthEntryCard formType="signup">
      <Form {...form}>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <AuthFormFields formType="signup" />
          <Button className="mt-6" isLoading={isPending}>
            {isPending ? " Singing up..." : "Singup"}
          </Button>
        </form>
      </Form>
    </AuthEntryCard>
  );
};
