"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ComponentProps, FC } from "react";

export const Collapsible: FC<ComponentProps<typeof CollapsiblePrimitive.Root>> = ({ ...props }) => (
  <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
);

export const CollapsibleTrigger: FC<ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>> = ({ ...props }) => (
  <CollapsiblePrimitive.CollapsibleTrigger data-slot="collapsible-trigger" {...props} />
);

export const CollapsibleContent: FC<ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>> = ({ ...props }) => (
  <CollapsiblePrimitive.CollapsibleContent data-slot="collapsible-content" {...props} />
);
