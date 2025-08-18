"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { FC, ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const TooltipProvider: FC<ComponentProps<typeof TooltipPrimitive.Provider>> = ({ delayDuration = 0, ...props }) => (
  <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />
);

export const Tooltip: FC<ComponentProps<typeof TooltipPrimitive.Root>> = ({ ...props }) => (
  <TooltipProvider>
    <TooltipPrimitive.Root data-slot="tooltip" {...props} />
  </TooltipProvider>
);

export const TooltipTrigger: FC<ComponentProps<typeof TooltipPrimitive.Trigger>> = ({ ...props }) => (
  <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
);

export const TooltipContent: FC<ComponentProps<typeof TooltipPrimitive.Content>> = ({ className, sideOffset = 0, children, ...props }) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      data-slot="tooltip-content"
      sideOffset={sideOffset}
      className={cn(
        "text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md bg-black px-3 py-1.5 text-xs text-balance",
        className,
      )}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-black fill-black" />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
);
