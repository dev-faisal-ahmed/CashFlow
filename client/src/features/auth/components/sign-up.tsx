"use client";

import { Button } from "@/components/ui/button";
import { AuthEntryCard } from "./auth-entry-card";
import { useSignup } from "../auth-hook";
import { AuthForm } from "./auth-form";

const FORM_ID = "SIGNUP";
export const Signup = () => {
  const { handleSignup, isPending } = useSignup();

  return (
    <AuthEntryCard formType="signup">
      <AuthForm formId={FORM_ID} formType="signup" onSubmit={handleSignup} />
      <Button form={FORM_ID} type="submit" className="mt-6" isLoading={isPending}>
        {isPending ? " Signing up..." : "Signup"}
      </Button>
    </AuthEntryCard>
  );
};
