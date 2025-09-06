import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FC } from "react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
};

export const SearchInput: FC<SearchInputProps> = ({ value, onChange, className, placeholder = "Search..." }) => {
  return (
    <div className={cn("relative", className)}>
      <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
      <Input type="search" placeholder={placeholder} className="px-8" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};
