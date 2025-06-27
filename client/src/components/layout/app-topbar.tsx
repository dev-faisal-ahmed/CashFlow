"use client";

import { useAuthStore } from "@/stores/auth-store";
import { SidebarTrigger } from "../ui/sidebar";
import { ThemeSwitcher } from "./theme-switcher";

export const AppTopbar = () => {
  const userName = useAuthStore((s) => s.user?.name);

  return (
    <header className="flex h-16 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-1 items-center gap-2">
        <h2 className="text-lg font-semibold">Hi, {userName}</h2>
      </div>
      <div className="ml-auto">
        <ThemeSwitcher />
      </div>
    </header>
  );
};
