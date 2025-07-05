"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { FC, ComponentProps } from "react";
import { buttonVariants } from "@/components/ui/button";

export const AlertDialog: FC<ComponentProps<typeof AlertDialogPrimitive.Root>> = ({ ...props }) => (
  <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
);

export const AlertDialogTrigger: FC<ComponentProps<typeof AlertDialogPrimitive.Trigger>> = ({ ...props }) => (
  <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
);

export const AlertDialogPortal: FC<ComponentProps<typeof AlertDialogPrimitive.Portal>> = ({ ...props }) => (
  <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
);

export const AlertDialogOverlay: FC<ComponentProps<typeof AlertDialogPrimitive.Overlay>> = ({ className, ...props }) => (
  <AlertDialogPrimitive.Overlay
    data-slot="alert-dialog-overlay"
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
      className,
    )}
    {...props}
  />
);

export const AlertDialogContent: FC<ComponentProps<typeof AlertDialogPrimitive.Content>> = ({ className, ...props }) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      data-slot="alert-dialog-content"
      className={cn(
        "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
);

export const AlertDialogHeader: FC<ComponentProps<"div">> = ({ className, ...props }) => (
  <div data-slot="alert-dialog-header" className={cn("flex flex-col gap-2 text-center sm:text-left", className)} {...props} />
);

export const AlertDialogFooter: FC<ComponentProps<"div">> = ({ className, ...props }) => (
  <div data-slot="alert-dialog-footer" className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
);

export const AlertDialogTitle: FC<ComponentProps<typeof AlertDialogPrimitive.Title>> = ({ className, ...props }) => (
  <AlertDialogPrimitive.Title data-slot="alert-dialog-title" className={cn("text-lg font-semibold", className)} {...props} />
);

export const AlertDialogDescription: FC<ComponentProps<typeof AlertDialogPrimitive.Description>> = ({ className, ...props }) => (
  <AlertDialogPrimitive.Description
    data-slot="alert-dialog-description"
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
);

export const AlertDialogAction: FC<ComponentProps<typeof AlertDialogPrimitive.Action>> = ({ className, ...props }) => (
  <AlertDialogPrimitive.Action className={cn(buttonVariants(), className)} {...props} />
);

export const AlertDialogCancel: FC<ComponentProps<typeof AlertDialogPrimitive.Cancel>> = ({ className, ...props }) => (
  <AlertDialogPrimitive.Cancel className={cn(buttonVariants({ variant: "outline" }), className)} {...props} />
);
