"use client";

import { Button } from "@/components/ui/button";
import { AuthEntryCard } from "./auth-entry-card";
import { AuthForm } from "./auth-form";
import { queryKeys } from "@/lib/query.keys";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { signupApi } from "../auth.api";
import { TAuthFormData, TSignupFormData } from "../auth.schema";

const mutationKey = queryKeys.auth.signup;

export const Signup = () => {
  const router = useRouter();
  const { mutate, isPending } = useMutation({ mutationKey: [mutationKey], mutationFn: signupApi });

  const handleSignup = (formData: TAuthFormData, reset: () => void) => {
    const { name, email, password } = formData as TSignupFormData;
    const payload = { name, email, password };

    mutate(payload, {
      onSuccess: () => {
        reset();
        router.push("/login");
      },
    });
  };

  return (
    <AuthEntryCard formType="signup">
      <AuthForm formId={mutationKey} formType="signup" onSubmit={handleSignup} />
      <Button form={mutationKey} type="submit" className="mt-6" isLoading={isPending}>
        {isPending ? " Signing up..." : "Signup"}
      </Button>
    </AuthEntryCard>
  );
};
