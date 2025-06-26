"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { ComponentProps, FC } from "react";
import { cn } from "@/lib/utils";

export const Avatar: FC<ComponentProps<typeof AvatarPrimitive.Root>> = ({ className, ...props }) => (
  <AvatarPrimitive.Root
    data-slot="avatar"
    className={cn("relative flex size-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
);

export const AvatarImage: FC<ComponentProps<typeof AvatarPrimitive.Image>> = ({ className, ...props }) => (
  <AvatarPrimitive.Image data-slot="avatar-image" className={cn("aspect-square size-full", className)} {...props} />
);

export const AvatarFallback: FC<ComponentProps<typeof AvatarPrimitive.Fallback>> = ({ className, ...props }) => (
  <AvatarPrimitive.Fallback
    data-slot="avatar-fallback"
    className={cn("bg-background text-foreground flex size-full items-center justify-center rounded-full", className)}
    {...props}
  />
);
