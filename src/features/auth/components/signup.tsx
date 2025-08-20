"use client";

import { Button } from "@/components/ui/button";
import { AuthEntryCard } from "./auth-entry-card";
import { AuthForm } from "./auth-form";
import { queryKeys } from "@/lib/query.keys";
import { useSignup } from "../auth.hooks";

const queryKey = queryKeys.auth.signup;

export const Signup = () => {
  const { isPending, handleSignup } = useSignup(queryKey);

  return (
    <AuthEntryCard formType="signup">
      <AuthForm formId={queryKey} formType="signup" onSubmit={handleSignup} />
      <Button form={queryKey} type="submit" className="mt-6" isLoading={isPending}>
        {isPending ? " Signing up..." : "Signup"}
      </Button>
    </AuthEntryCard>
  );
};
