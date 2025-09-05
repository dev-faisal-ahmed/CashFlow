import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

// Tailwind Class Merger
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

// String Utility
export const capitalize = (value: string) => {
  return value
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

// Error Handling
export const errorMessageGen = (error: unknown, defaultMessage: string = "Something went wrong") => {
  let message = defaultMessage;
  if (error instanceof AxiosError) message = error.response?.data?.message;
  else if (error instanceof Error) message = error.message;
  return message;
};

export const errorToast = (error: unknown) => {
  toast.error(errorMessageGen(error) || "Something Went wrong");
};
