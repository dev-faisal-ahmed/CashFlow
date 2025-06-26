"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "../auth-hook";

export const GoogleLogin = () => {
  const { handleGoogleLogin } = useGoogleLogin();

  return (
    <Button onClick={handleGoogleLogin} className="w-full cursor-pointer font-semibold" variant="outline">
      <FcGoogle /> Login With Google
    </Button>
  );
};
