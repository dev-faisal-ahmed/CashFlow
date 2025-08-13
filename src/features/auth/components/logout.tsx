import { Button } from "@/components/ui/button";
import { removeToken } from "@/lib/server-action";
import { LogOutIcon } from "lucide-react";

export const Logout = () => {
  const handleLogout = async () => {
    await removeToken();
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
