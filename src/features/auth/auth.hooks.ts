import { signIn } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginApi, signupApi } from "./auth.api";
import { TAuthFormData } from "./components/auth-form";
import { TLoginFormData, TSignupFormData } from "./auth.schema";
import { getAuth, logout } from "./auth.action";
import { queryKeys } from "@/lib/query.keys";

export const useSignup = (mutationKey: string) => {
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

  return { isPending, handleSignup };
};

export const useLoginWithCredentials = (mutationKey: string) => {
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

  return { isPending, handleLogin };
};

const gcTime = 12 * 60 * 60 * 1000;
export const useAuth = () => {
  return useQuery({ queryKey: [queryKeys.auth.session], queryFn: getAuth, staleTime: Infinity, gcTime });
};

export const useGoogleLogin = () => {
  const handleGoogleLogin = async () => {
    signIn("google");
  };

  return { handleGoogleLogin };
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await logout();
    queryClient.invalidateQueries({ queryKey: [queryKeys.auth.session] });
    router.push("/login");
  };

  return { handleLogout };
};
