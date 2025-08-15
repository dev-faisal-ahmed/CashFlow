"use client";

import { Button } from "@/components/ui/button";
import { AuthEntryCard } from "./auth-entry-card";
import { AuthForm, TAuthFormData } from "./auth-form";
import { queryKeys } from "@/lib/query.keys";
import { useMutation } from "@tanstack/react-query";
import { signup } from "../auth-api";
import { TSignupFormData } from "../auth-schema";
import { useRouter } from "next/navigation";

const FORM_ID = queryKeys.auth.singup;

export const Signup = () => {
  const router = useRouter();
  const { mutate, isPending } = useMutation({ mutationKey: [FORM_ID], mutationFn: signup });

  const handleSignup = (formData: TAuthFormData, reset: () => void) => {
    const payload = formData as TSignupFormData;
    mutate(payload, {
      onSuccess: () => {
        reset();
        router.push("/login");
      },
    });
  };

  return (
    <AuthEntryCard formType="signup">
      <AuthForm formId={FORM_ID} formType="signup" onSubmit={handleSignup} />
      <Button form={FORM_ID} type="submit" className="mt-6" isLoading={isPending}>
        {isPending ? " Signing up..." : "Signup"}
      </Button>
    </AuthEntryCard>
  );
};
