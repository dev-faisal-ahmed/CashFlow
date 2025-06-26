import { PromiseResponse } from "@/lib/types";
import { TLoginForm, TSigUpForm } from "./auth-types";
import { api } from "@/lib/api";
import { apiUrl } from "@/lib/api-url";

export const signup = async (payload: SignupPayload): PromiseResponse => {
  const { data } = await api.post(apiUrl.auth.register, payload);
  return data;
};

export const login = async (payload: LoginPayload): PromiseResponse<string> => {
  const { data } = await api.post(apiUrl.auth.login, payload);
  return data;
};

type SignupPayload = Pick<TSigUpForm, "name" | "email" | "password">;
type LoginPayload = TLoginForm;
