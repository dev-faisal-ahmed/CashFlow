"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { XIcon } from "lucide-react";
import { FC, ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Dialog: FC<ComponentProps<typeof DialogPrimitive.Root>> = ({ ...props }) => (
  <DialogPrimitive.Root data-slot="dialog" {...props} />
);

export const DialogTrigger: FC<ComponentProps<typeof DialogPrimitive.Trigger>> = ({ ...props }) => (
  <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
);

export const DialogPortal: FC<ComponentProps<typeof DialogPrimitive.Portal>> = ({ ...props }) => (
  <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
);

export const DialogClose: FC<ComponentProps<typeof DialogPrimitive.Close>> = ({ ...props }) => (
  <DialogPrimitive.Close data-slot="dialog-close" {...props} />
);

export const DialogOverlay: FC<ComponentProps<typeof DialogPrimitive.Overlay>> = ({ className, ...props }) => (
  <DialogPrimitive.Overlay
    data-slot="dialog-overlay"
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
      className,
    )}
    {...props}
  />
);

type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
};

export const DialogContent: FC<DialogContentProps> = ({ className, children, showCloseButton = true, ...props }) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      data-slot="dialog-content"
      className={cn(
        "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close
          data-slot="dialog-close"
          className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        >
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
);

export const DialogHeader: FC<ComponentProps<"div">> = ({ className, ...props }) => (
  <div data-slot="dialog-header" className={cn("flex flex-col gap-2 text-center sm:text-left", className)} {...props} />
);

export const DialogFooter: FC<ComponentProps<"div">> = ({ className, ...props }) => (
  <div data-slot="dialog-footer" className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
);

export const DialogTitle: FC<ComponentProps<typeof DialogPrimitive.Title>> = ({ className, ...props }) => (
  <DialogPrimitive.Title data-slot="dialog-title" className={cn("text-lg leading-none font-semibold", className)} {...props} />
);

export const DialogDescription: FC<ComponentProps<typeof DialogPrimitive.Description>> = ({ className, ...props }) => (
  <DialogPrimitive.Description data-slot="dialog-description" className={cn("text-muted-foreground text-sm", className)} {...props} />
);
