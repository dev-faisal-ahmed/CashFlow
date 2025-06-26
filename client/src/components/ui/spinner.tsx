import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const Spinner = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("border-muted size-5 animate-spin rounded-full border-2 border-dashed", className)} {...props} />
));

Spinner.displayName = "Spinner";
