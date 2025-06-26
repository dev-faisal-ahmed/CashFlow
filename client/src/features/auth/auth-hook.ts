import { QK } from "@/lib/query-keys";
import { useForm } from "react-hook-form";
import { TLoginForm, TSigUpForm } from "./auth-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, signupSchema } from "./auth-schema";
import { useMutation } from "@tanstack/react-query";
import { login, signup } from "./auth-api";
import { useRouter, useSearchParams } from "next/navigation";
import { apiUrl } from "@/lib/api-url";
import { API_URL } from "@/lib/config";
import { storeToken } from "@/lib/server-action";

const singupKey = `${QK.AUTH}_SIGNUP`;
export const useSignup = () => {
  const form = useForm<TSigUpForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const { mutate, isPending } = useMutation({ mutationKey: [singupKey], mutationFn: signup });
  const router = useRouter();

  const handleSignup = form.handleSubmit((formData) => {
    const { name, email, password } = formData;

    mutate(
      { name, email, password },
      {
        onSuccess: () => {
          form.reset();
          router.push("/login");
        },
      },
    );
  });

  return { form, handleSignup, isPending };
};

const loginKey = `${QK.AUTH}_LOGIN`;
export const useLogin = () => {
  const form = useForm<TLoginForm>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callback") || "/";

  const { mutate, isPending } = useMutation({ mutationKey: [loginKey], mutationFn: login });

  const handleLogin = form.handleSubmit((formData) => {
    mutate(formData, {
      onSuccess: async (res) => {
        form.reset();
        await storeToken(res.data);
        router.push(callbackUrl);
      },
    });
  });

  return { form, handleLogin, isPending };
};

export const useGoogleLogin = () => {
  const handleGoogleLogin = () => {
    const callbackUrl = encodeURIComponent(window.location.origin + "/auth/callback");
    window.location.href = `${API_URL}${apiUrl.auth.loginWithGoogle}?callbackUrl=${callbackUrl}`;
  };

  return { handleGoogleLogin };
};
