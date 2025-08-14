import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { AUTH_SECRET } from "./config";

// Types
type TCredentials = { email: string; password: string };

export const { auth, handlers, signIn, signOut } = NextAuth(() => ({
  trustHost: true,

  session: { strategy: "jwt" },
  secret: AUTH_SECRET,

  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/login",
  },

  providers: [
    Credentials({
      async authorize(credentials, request) {
        const { email, password } = credentials as TCredentials;
        return { id: "", email: "", image: "", name: "" };
      },
    }),
  ],
}));
