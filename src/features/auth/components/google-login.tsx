"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useLoginWithGoogle } from "../auth.hooks";

export const GoogleLogin = () => {
  const { handleGoogleLogin } = useLoginWithGoogle();

  return (
    <Button onClick={handleGoogleLogin} className="w-full cursor-pointer font-semibold" variant="outline">
      <FcGoogle /> Login With Google
    </Button>
  );
};
