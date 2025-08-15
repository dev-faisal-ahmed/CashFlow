"use client";

import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { logout } from "../auth.action";
import { useRouter } from "next/navigation";

export const Logout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

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
