import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

import { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_SECRET } from "./config";
import { DefaultSession, AuthError } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { authClient } from "./client";

// Types
type TCredentials = { email: string; password: string };

declare module "next-auth" {
  interface User {
    userId: number;
  }

  interface Session extends DefaultSession {
    user: {
      userId: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId: number;
  }
}

class AuthCredentialError extends AuthError {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

const errorPath = "/login";

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
    Google({ clientId: AUTH_GOOGLE_ID, clientSecret: AUTH_GOOGLE_SECRET }),

    Credentials({
      async authorize(credentials) {
        try {
          const { email, password } = credentials as TCredentials;
          const loginResponse = await authClient.login.$post({ json: { email, password } });
          const responseData = await loginResponse.json();

          if (!responseData.success) throw new Error(responseData.message);
          const userInfo = responseData.data;

          return { id: userInfo.id.toString(), userId: userInfo.id, name: userInfo.name, email: userInfo.email, image: userInfo.image };
        } catch (error) {
          throw new AuthCredentialError(error instanceof Error ? error.message : "Invalid credentials");
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ account, user, profile }) {
      if (account?.provider === "google" && profile) {
        try {
          const res = await authClient.login.google.$post({
            json: {
              name: profile.name as string,
              email: profile.email as string,
              ...(profile.picture && { image: profile.picture as string }),
            },
          });

          const resData = await res.json();
          if (!resData.success) throw new Error(resData.message);

          const userInfo = resData.data;

          user.id = userInfo.id.toString();
          user.userId = userInfo.id;
          user.name = userInfo.name;
          user.email = userInfo.email;
          user.image = userInfo.image;

          return true;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Something went wrong";
          return `${errorPath}/error?=${message}`;
        }
      }
      return true;
    },

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
