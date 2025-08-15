"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import { TLoginFormData } from "./auth-schema";

export const loginWithCredentials = async (payload: TLoginFormData) => {
  try {
    await signIn("credentials", { ...payload, redirect: false });
    return { success: true, message: "You have been successfully logged in" };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Something went wrong" };
  }
};

export const logout = async () => {
  await signOut();
};

export const getAuth = async () => await auth();
