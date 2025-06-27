import { LoggedUser } from "@/lib/types";
import { create } from "zustand";

type AuthState = { user: LoggedUser | null };
type AuthAction = { update: (user: LoggedUser) => void; logout: () => void };

type AuthStore = AuthState & AuthAction;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  update: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
