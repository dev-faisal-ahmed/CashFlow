import { FC, PropsWithChildren } from "react";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";
import { ScrollArea } from "../components/ui/scroll-area";

export const MainLayout: FC<PropsWithChildren> = ({ children }) => (
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset className="h-[calc(100dvh-2rem)]">
      <AppTopbar />
      <ScrollArea fixedLayout className="grow">
        <section className="p-4">{children}</section>
      </ScrollArea>
    </SidebarInset>
  </SidebarProvider>
);
