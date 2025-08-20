import { TLoginFormData } from "./auth.schema";
import { loginWithCredentials } from "./auth.action";
import { SignupDto } from "@/server/modules/auth/auth.validation";
import { authClient } from "@/lib/client";

export const signupApi = async (payload: SignupDto) => {
  const res = await authClient.signup.$post({ json: payload });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

export const loginApi = async (formData: TLoginFormData) => {
  const res = await loginWithCredentials(formData);
  if (!res.success) throw new Error(res.message);
  return res;
};
