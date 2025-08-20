"use client";

import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { useLogout } from "../auth.hooks";

export const Logout = () => {
  const { handleLogout } = useLogout();

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="text-destructive hover:text-destructive/80 w-full cursor-pointer justify-start px-4 py-2"
    >
      <LogOutIcon /> Logout
    </Button>
  );
};
