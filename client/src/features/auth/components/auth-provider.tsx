"use client";

import { TLoggedUser } from "@/lib/types";
import { useAuthStore } from "@/stores/auth-store";
import { FC, useEffect } from "react";

type AuthProviderProps = { user: TLoggedUser | null };
export const AuthProvider: FC<AuthProviderProps> = ({ user }) => {
  const updateUser = useAuthStore((s) => s.update);

  useEffect(() => {
    if (user) updateUser(user);
  }, [user, updateUser]);

  return null;
};
