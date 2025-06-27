import { FC, PropsWithChildren } from "react";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./app-sidebar";

export const MainLayout: FC<PropsWithChildren> = ({ children }) => (
  <SidebarProvider>
    <AppSidebar />
    {children}
  </SidebarProvider>
);
