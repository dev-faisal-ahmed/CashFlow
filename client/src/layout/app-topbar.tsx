"use client";

import { FC, PropsWithChildren, useEffect } from "react";
import { SidebarTrigger } from "../components/ui/sidebar";
import { ThemeSwitcher } from "./theme-switcher";
import { useLayoutStore } from "@/stores/layout-store";

export const AppTopbar = () => {
  const leftContent = useLayoutStore((s) => s.leftContent);
  const rightContent = useLayoutStore((s) => s.rightContent);

  return (
    <header className="flex h-16 items-center gap-4 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="border-l pl-4">{leftContent}</div>
      <div className="ml-auto flex items-center gap-4">
        {rightContent}
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export const TopbarContent: FC<PropsWithChildren<{ position: "left" | "right" }>> = ({ children, position }) => {
  const updateContent = useLayoutStore((s) => (position === "left" ? s.updateLeftContent : s.updateRightContent));

  useEffect(() => {
    updateContent(children);
  }, [children, updateContent]);

  return null;
};
