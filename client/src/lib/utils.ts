import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { TQuery } from "./types";

// ----------- Tailwind Class Merger ----------- \\
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

// ----------- String Utility ----------- \\
export const capitalize = (value: string) => {
  return value
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

// ----------- Error Handling ----------- \\
export const errorMessageGen = (error: unknown, defaultMessage: string = "Something went wrong") => {
  let message = defaultMessage;
  if (error instanceof AxiosError) message = error.response?.data?.message;
  else if (error instanceof Error) message = error.message;
  return message;
};

export const errorToast = (error: unknown) => {
  toast.error(errorMessageGen(error) || "Something Went wrong");
};

// --------- Api --------- \\
export const buildQueryString = (obj: TQuery) => {
  const refinedObj = removeNilProperties(obj);
  const searchParams = new URLSearchParams(refinedObj).toString();
  return searchParams ? `?${searchParams}` : "";
};

export const removeNilProperties = (obj: TQuery) => {
  return Object.keys(obj).reduce((acc: TQuery, key) => {
    const value = obj[key];
    if (value !== null && value !== undefined) acc[key] = value;
    return acc;
  }, {});
};
