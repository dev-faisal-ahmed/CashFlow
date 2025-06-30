import { ComponentProps, FC } from "react";
import { cn } from "@/lib/utils";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

type TSearchInputProps = ComponentProps<"input"> & { value: string; onSearchChange: (value: string) => void; containerClassName?: string };

export const SearchInput: FC<TSearchInputProps> = ({ value, onSearchChange, containerClassName, className, ...props }) => (
  <div className={cn("relative", containerClassName)}>
    <Input className={cn("px-10", className)} value={value} onChange={(e) => onSearchChange(e.target.value)} {...props} />
    <SearchIcon className="text-input absolute top-1/2 left-3 size-4 -translate-y-1/2" />

    {value && (
      <button
        className="hover:text-destructive absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
        onClick={() => onSearchChange("")}
      >
        <XIcon className="size-4" />
      </button>
    )}
  </div>
);
