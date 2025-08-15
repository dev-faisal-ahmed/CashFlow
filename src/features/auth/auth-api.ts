import { authClient } from "@/lib/client";
import { SignupDto } from "@/server/modules/auth/auth.validation";

export const signup = async (payload: SignupDto) => {
  const res = await authClient.signup.$post({ json: payload });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};
