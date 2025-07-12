"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { ComponentProps, FC } from "react";
import { cn } from "@/lib/utils";

type ScrollAreaProps = ComponentProps<typeof ScrollAreaPrimitive.Root> & { disableScrollbar?: boolean; fixedLayout?: boolean };
export const ScrollArea: FC<ScrollAreaProps> = ({ className, children, disableScrollbar, fixedLayout, ...props }) => (
  <ScrollAreaPrimitive.Root data-slot="scroll-area" className={cn("relative", className)} {...props}>
    <ScrollAreaPrimitive.Viewport
      data-slot="scroll-area-viewport"
      className={cn(
        "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
        fixedLayout && "[&>div]:w-full [&>div]:table-fixed",
      )}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>

    {disableScrollbar && <ScrollBar />}
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
);

export const ScrollBar: FC<ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>> = ({
  className,
  orientation = "vertical",
  ...props
}) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    data-slot="scroll-area-scrollbar"
    orientation={orientation}
    className={cn(
      "flex touch-none p-px transition-colors select-none",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb data-slot="scroll-area-thumb" className="bg-border relative flex-1 rounded-full" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
);
