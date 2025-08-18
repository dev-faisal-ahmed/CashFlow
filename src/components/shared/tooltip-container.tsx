"use client";

import { FC, PropsWithChildren } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type TooltipContainerProps = PropsWithChildren<{ label: string }>;

export const TooltipContainer: FC<TooltipContainerProps> = ({ label, children }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
