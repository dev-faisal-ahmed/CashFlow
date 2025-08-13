"use client";

import { Button } from "@/components/ui/button";
import { AuthEntryCard } from "./auth-entry-card";
import { useLogin } from "../auth-hook";
import { AuthForm } from "./auth-form";

const FORM_ID = "LOGIN";
export const Login = () => {
  const { handleLogin, isPending } = useLogin();

  return (
    <AuthEntryCard formType="login">
      <AuthForm formId={FORM_ID} formType="login" onSubmit={handleLogin} />
      <Button form={FORM_ID} type="submit" className="mt-6" isLoading={isPending}>
        {isPending ? " Logging in..." : "Login"}
      </Button>
    </AuthEntryCard>
  );
};
