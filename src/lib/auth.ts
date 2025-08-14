import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { AUTH_SECRET } from "./config";
import { authClient } from "./client";
import { DefaultSession, AuthError } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// Types
type TCredentials = { email: string; password: string };

declare module "next-auth" {
  interface User {
    userId: string;
  }

  interface Session extends DefaultSession {
    user: {
      userId: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId: string;
  }
}

class AuthCredentialError extends AuthError {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

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
      async authorize(credentials) {
        try {
          const { email, password } = credentials as TCredentials;
          const loginResponse = await authClient.login.$post({ json: { email, password } });
          const responseData = await loginResponse.json();

          console.log({ responseData });

          if (!responseData.success) throw new Error(responseData.message);

          const userInfo = responseData.data;
          return { id: userInfo._id, userId: userInfo._id, name: userInfo.name, email: userInfo.email, image: userInfo.image };
        } catch (error) {
          throw new AuthCredentialError(error instanceof Error ? error.message : "Invalid credentials");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ user, token }) {
      if (user) token.userId = user.userId;
      return token;
    },

    async session({ session, token }) {
      if (token?.userId) session.user.userId = token.userId;
      return session;
    },
  },
}));
