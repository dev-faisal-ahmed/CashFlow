"use client";

import Link from "next/link";

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
} from "../components/ui/sidebar";

import { EllipsisVerticalIcon, LockIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { AppLogo } from "../components/shared/app-logo";
import { useNavItems } from "./main-layout-hook";
import { CommonAvatar } from "../components/shared/common-avatar";
import { useSession } from "next-auth/react";
import { Logout } from "@/features/auth/components";
import { usePopupState } from "@/lib/hooks";
import { Button } from "../components/ui/button";

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
        <AppLogo />
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
            <SidebarMenuButton asChild isActive={isActive}>
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

const AppSidebarFooter = () => {
  const session = useSession();
  if (!session.data?.user) return null;

  const user = session.data.user;

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex h-16 items-center justify-center gap-2 rounded-none border-t py-4 hover:bg-transparent">
            <CommonAvatar name={user.name ?? ""} fallbackClassName="bg-primary text-white" size="SM" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">{user.email}</span>
            </div>
            <ActionMenu />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

const ActionMenu = () => {
  const { open, onOpenChange } = usePopupState();

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange} modal>
      <DropdownMenuTrigger asChild>
        <button className="hover:bg-background cursor-pointer rounded-md p-2" onClick={() => onOpenChange(true)}>
          <EllipsisVerticalIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 p-2">
        <Button variant="ghost" className="w-full cursor-pointer justify-start px-4 py-2">
          <LockIcon /> Change Password
        </Button>
        <Logout />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
