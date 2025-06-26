import { PromiseResponse } from "@/lib/types";
import { TSigUpForm } from "./auth-types";
import { api } from "@/lib/api";
import { apiUrl } from "@/lib/api-url";

export const register = async (payload: RegisterPayload): PromiseResponse => {
  const { data } = await api.post(apiUrl.auth.register, payload);
  return data;
};

type RegisterPayload = Pick<TSigUpForm, "name" | "email" | "password">;
