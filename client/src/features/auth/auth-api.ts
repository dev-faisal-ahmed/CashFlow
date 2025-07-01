import { TPromiseResponse } from "@/lib/types";
import { TLoginForm, TSigUpForm } from "./auth-types";
import { api } from "@/lib/api";
import { apiUrl } from "@/lib/api-url";

export const signup = async (payload: TSignupPayload): TPromiseResponse => {
  const { data } = await api.post(apiUrl.auth.register, payload);
  return data;
};

export const login = async (payload: TLoginPayload): TPromiseResponse<string> => {
  const { data } = await api.post(apiUrl.auth.login, payload);
  return data;
};

export const googleLogin = async (): TPromiseResponse<string> => {
  const { data } = await api.get(apiUrl.auth.loginWithGoogle);
  return data;
};

type TSignupPayload = Pick<TSigUpForm, "name" | "email" | "password">;
type TLoginPayload = TLoginForm;
