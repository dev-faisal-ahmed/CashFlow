"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { AuthEntryCard } from "./auth-entry-card";
import { AuthForm, TAuthFormData } from "./auth-form";
import { queryKeys } from "@/lib/query.keys";
import { TLoginFormData } from "../auth-schema";
import { loginWithCredentials } from "../auth.action";

const FORM_ID = queryKeys.auth.login;
export const Login = () => {
  const router = useRouter();
  const { mutate, isPending } = useMutation({ mutationKey: [FORM_ID], mutationFn: loginHandler });

  const handleLogin = (formData: TAuthFormData, reset: () => void) => {
    const loginFormData = formData as TLoginFormData;

    mutate(loginFormData, {
      onSuccess: () => {
        reset();
        router.push("/");
      },
    });
  };

  return (
    <AuthEntryCard formType="login">
      <AuthForm formId={FORM_ID} formType="login" onSubmit={handleLogin} />
      <Button form={FORM_ID} type="submit" className="mt-6" isLoading={isPending}>
        {isPending ? " Logging in..." : "Login"}
      </Button>
    </AuthEntryCard>
  );
};

const loginHandler = async (formData: TLoginFormData) => {
  const res = await loginWithCredentials(formData);
  if (!res.success) throw new Error(res.message);
  return res;
};
