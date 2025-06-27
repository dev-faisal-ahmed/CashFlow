import { cn } from "@/lib/utils";
import { ComponentProps, FC } from "react";

export const Skeleton: FC<ComponentProps<"div">> = ({ className, ...props }) => (
  <div data-slot="skeleton" className={cn("bg-accent animate-pulse rounded-md", className)} {...props} />
);
