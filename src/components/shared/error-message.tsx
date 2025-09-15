import { cn } from "@/lib/utils";
import { FC } from "react";
import { MdError } from "react-icons/md";
import { TerminalIcon } from "lucide-react";

type ErrorMessageProps = {
  message: string;
  className?: string;
};

export const ErrorMessage: FC<ErrorMessageProps> = ({ message, className }) => (
  <div className={cn("my-6 flex w-full items-center justify-center gap-2 text-center text-sm font-semibold", className)}>
    <MdError className="size-4 text-white" />
    {message}
  </div>
);

type AlertErrorMessageProps = ErrorMessageProps & {
  title: string;
};

export const AlertErrorMessage: FC<AlertErrorMessageProps> = ({ message, title, className }) => (
  <div className={cn("bg-card p-4", className)}>
    <TerminalIcon className="size-4" />
    <div className="flex flex-col">
      <h2 className="font-semibold">{title}</h2>
      <p>{message}</p>
    </div>
  </div>
);
