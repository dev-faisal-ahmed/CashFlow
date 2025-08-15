"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export const GoogleLogin = () => {
  const handleGoogleLogin = async () => {
    signIn("google");
  };

  return (
    <Button onClick={handleGoogleLogin} className="w-full cursor-pointer font-semibold" variant="outline">
      <FcGoogle /> Login With Google
    </Button>
  );
};
