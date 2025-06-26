"use client";

import * as LabelPrimitive from "@radix-ui/react-label";

import { ComponentProps, FC } from "react";
import { cn } from "@/lib/utils";

type LabelProps = ComponentProps<typeof LabelPrimitive.Root>;

export const Label: FC<LabelProps> = ({ className, ...props }) => (
  <LabelPrimitive.Root
    data-slot="label"
    className={cn(
      "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className,
    )}
    {...props}
  />
);
