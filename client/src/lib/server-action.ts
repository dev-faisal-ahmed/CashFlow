"use server";

import { cookies } from "next/headers";

const cookiesKey = { token: "token" };

export const storeToken = async (token: string) => {
  const cookie = await cookies();
  cookie.set(cookiesKey.token, token);
};

export const getToken = async () => {
  const cookie = await cookies();
  return cookie.get(cookiesKey.token)?.value;
};
