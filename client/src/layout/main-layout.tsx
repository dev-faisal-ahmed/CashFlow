import { FC, PropsWithChildren } from "react";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";
import { ScrollArea } from "../components/ui/scroll-area";

export const MainLayout: FC<PropsWithChildren> = ({ children }) => (
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset className="flex h-[calc(100dvh-16px)] flex-col">
      <AppTopbar />
      <ScrollArea>
        <section className="m-4">{children}</section>
      </ScrollArea>
    </SidebarInset>
  </SidebarProvider>
);
