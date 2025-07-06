import { cn } from "@/lib/utils";
import { FC } from "react";
import { MdError } from "react-icons/md";

export const ErrorMessage: FC<{ message: string; className?: string }> = ({ message, className }) => (
  <div className={cn("my-6 flex w-full items-center justify-center gap-2 text-center text-sm font-semibold", className)}>
    <MdError className="text-white size-4" />
    {message}
  </div>
);
