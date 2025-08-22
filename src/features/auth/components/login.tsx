"use client";

import { Button } from "@/components/ui/button";
import { AuthEntryCard } from "./auth-entry-card";
import { AuthForm } from "./auth-form";
import { queryKeys } from "@/lib/query.keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginApi } from "../auth.api";
import { TAuthFormData, TLoginFormData } from "../auth.schema";

const mutationKey = queryKeys.auth.login;

export const Login = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useMutation({ mutationKey: [mutationKey], mutationFn: loginApi });

  const handleLogin = (formData: TAuthFormData, reset: () => void) => {
    const loginFormData = formData as TLoginFormData;

    mutate(loginFormData, {
      onSuccess: () => {
        reset();
        queryClient.invalidateQueries({ queryKey: [queryKeys.auth.session] });
        router.push("/");
      },
    });
  };

  return (
    <AuthEntryCard formType="login">
      <AuthForm formId={mutationKey} formType="login" onSubmit={handleLogin} />
      <Button form={mutationKey} type="submit" className="mt-6" isLoading={isPending}>
        {isPending ? " Logging in..." : "Login"}
      </Button>
    </AuthEntryCard>
  );
};
