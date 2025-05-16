"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export const GoogleLogin = () => {
  return (
    <Button className="w-full cursor-pointer font-semibold" variant="outline">
      <FcGoogle /> Login With Google
    </Button>
  );
};
