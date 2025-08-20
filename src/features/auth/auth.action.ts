"use server";

import { auth, signIn, signOut } from "@/lib/auth";

// Types
export type LoginWithCredentialsDto = { email: string; password: string };

export const loginWithCredentials = async (payload: LoginWithCredentialsDto) => {
  try {
    await signIn("credentials", { ...payload, redirect: false });
    return { success: true, message: "You have been successfully logged in" };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Something went wrong" };
  }
};

export const logout = async () => {
  return signOut();
};

export const getAuth = async () => auth();
