"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

import { AppLogo } from "../shared/app-logo";
import { useNavItems } from "./main-layout-hook";
import { CommonAvatar } from "../shared/common-avatar";
import { SettingsIcon } from "lucide-react";

import Link from "next/link";

export const AppSidebar = () => (
  <Sidebar variant="inset">
    <AppSidebarHeader />

    <SidebarContent className="mt-2">
      <SidebarGroup>
        <AppSidebarNavItems />
      </SidebarGroup>
    </SidebarContent>

    <AppSidebarFooter />
  </Sidebar>
);

const AppSidebarHeader = () => (
  <SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
        <AppLogo className="text-primary" />
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>
);

const AppSidebarNavItems = () => {
  const { navItems } = useNavItems();

  return (
    <SidebarGroupContent>
      <SidebarMenu>
        {navItems.map(({ url, isActive, icon: Icon, title }) => (
          <SidebarMenuItem key={url}>
            <SidebarMenuButton asChild isActive={isActive} size="lg">
              <Link className="text-muted-foreground" href={url}>
                <Icon />
                <span>{title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  );
};

const AppSidebarFooter = () => (
  <SidebarFooter>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="" asChild>
          <div className="flex h-16 items-center justify-center rounded-none border-t py-4 hover:bg-transparent">
            <CommonAvatar name="Faisal" fallbackClassName="bg-primary text-white" size="SM" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">John Doe</span>
              <span className="text-muted-foreground truncate text-xs">john@example.com</span>
            </div>
            <SettingsIcon className="size-4" />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarFooter>
);
