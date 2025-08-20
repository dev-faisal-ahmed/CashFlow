"use client";

import { Button } from "@/components/ui/button";
import { AuthEntryCard } from "./auth-entry-card";
import { AuthForm } from "./auth-form";
import { queryKeys } from "@/lib/query.keys";
import { useLoginWithCredentials } from "../auth.hooks";

const mutationKey = queryKeys.auth.login;

export const Login = () => {
  const { isPending, handleLogin } = useLoginWithCredentials(mutationKey);

  return (
    <AuthEntryCard formType="login">
      <AuthForm formId={mutationKey} formType="login" onSubmit={handleLogin} />
      <Button form={mutationKey} type="submit" className="mt-6" isLoading={isPending}>
        {isPending ? " Logging in..." : "Login"}
      </Button>
    </AuthEntryCard>
  );
};
