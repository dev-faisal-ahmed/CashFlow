"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { LoggedUser } from "./types";

const cookiesKey = { token: "token" };

export const storeToken = async (token: string) => {
  const cookie = await cookies();
  cookie.set(cookiesKey.token, token);
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
