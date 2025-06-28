import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { FC, PropsWithChildren } from "react";
import { GoogleLogin } from "./google-login";

type AuthEntryCardProps = PropsWithChildren<{ formType: "signup" | "login" }>;

const FORM_CONFIG = {
  signup: {
    title: "Create Account",
    description: "Enter your details to create an account",
    question: "Already have an account?",
    alterNative: "login",
    alternativeLink: "/login",
  },

  login: {
    title: "Login",
    description: "Enter your credentials to login",
    question: "Don't have any account?",
    alterNative: "signup",
    alternativeLink: "/signup",
  },
};

export const AuthEntryCard: FC<AuthEntryCardProps> = ({ children, formType }) => {
  const config = FORM_CONFIG[formType];

  return (
    <section className="flex flex-col gap-6">
      <div className="space-y-1 text-center">
        <h2 className="text-lg font-semibold">{config.title}</h2>
        <p className="text-muted-foreground text-sm">{config.description}</p>
      </div>

      {/* login with google */}
      <GoogleLogin />

      {/* or separator */}
      <section className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-gray-500">Or continue with Email</span>
        </div>
      </section>

      {/* form content */}
      {children}

      {/* redirect to other page */}
      <div className="text-muted-foreground -mt-2 text-center text-sm">
        {config.question}
        <Link className="text-primary ml-1 hover:underline" href={config.alternativeLink}>
          {config.alterNative}
        </Link>
      </div>
    </section>
  );
};
