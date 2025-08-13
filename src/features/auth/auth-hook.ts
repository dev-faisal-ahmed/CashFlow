import { QK } from "@/lib/query-keys";
import { TAuthForm, TLoginForm, TSigUpForm } from "./auth-type";
import { useMutation } from "@tanstack/react-query";
import { login, signup } from "./auth-api";
import { useRouter, useSearchParams } from "next/navigation";
import { apiUrl } from "@/lib/api-url";
import { API_URL } from "@/lib/config";

export const useSignup = () => {
  const { mutate, isPending } = useMutation({ mutationFn: signup });
  const router = useRouter();

  const handleSignup = (formData: TAuthForm, onReset: () => void) => {
    const { name, email, password } = formData as TSigUpForm;

    mutate(
      { name, email, password },
      {
        onSuccess: () => {
          router.push("/dashboard");
          onReset();
        },
      },
    );
  };

  return { handleSignup, isPending };
};

const loginKey = `${QK.AUTH}_LOGIN`;
export const useLogin = () => {
  const { mutate, isPending } = useMutation({ mutationKey: [loginKey], mutationFn: login });
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callback") || "/";

  const handleLogin = (formData: TAuthForm, onReset: () => void) => {
    const { email, password } = formData as TLoginForm;

    mutate(
      { email, password },
      {
        onSuccess: () => {
          onReset();
          router.push(callbackUrl);
        },
      },
    );
  };

  return { handleLogin, isPending };
};

export const useGoogleLogin = () => {
  const handleGoogleLogin = () => {
    const callbackUrl = encodeURIComponent(window.location.origin + "/auth/callback");
    window.location.href = `${API_URL}${apiUrl.auth.loginWithGoogle}?callbackUrl=${callbackUrl}`;
  };

  return { handleGoogleLogin };
};
