"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { LoggedUser } from "./types";

const cookiesKey = { token: "token" };
const maxAge = 7 * 24 * 60 * 60;

export const storeToken = async (token: string) => {
  const cookie = await cookies();
  cookie.set({ name: cookiesKey.token, value: token, maxAge });
};

export const getToken = async () => {
  const cookie = await cookies();
  return cookie.get(cookiesKey.token)?.value;
};

export const getLoggedUser = async () => {
  const token = await getToken();
  if (!token) return null;

  const user = jwtDecode(token);
  return user as LoggedUser;
};

export const removeToken = async () => {
  const cookie = await cookies();
  cookie.delete(cookiesKey.token);
};
