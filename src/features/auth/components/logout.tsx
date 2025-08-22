"use client";

import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "../auth.action";
import { queryKeys } from "@/lib/query.keys";

export const Logout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await logout();
    queryClient.invalidateQueries({ queryKey: [queryKeys.auth.session] });
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
