import { FC } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { ErrorMessage } from "../error-message";
import { cn } from "@/lib/utils";

type CommonSelectProps = {
  options: TOption[];
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  triggerClassName?: string;
};

type TOption = { label: string; value: string };

export const CommonSelect: FC<CommonSelectProps> = ({
  options,
  value,
  onChange,
  isLoading = false,
  placeholder = "Select any",
  disabled = false,
  triggerClassName,
}) => (
  <Select value={value} onValueChange={onChange} disabled={disabled}>
    <SelectTrigger className={cn("w-full", triggerClassName)}>
      {value ? <SelectValue /> : <span className="text-muted-foreground">{placeholder}</span>}
    </SelectTrigger>
    <SelectContent>
      <SelectionOptionsContent options={options} isLoading={isLoading} />
    </SelectContent>
  </Select>
);

type SelectionOptionsContentProps = { options: TOption[]; isLoading?: boolean };
const SelectionOptionsContent: FC<SelectionOptionsContentProps> = ({ options, isLoading }) => {
  if (isLoading)
    return (
      <div className="my-1 flex justify-center">
        <Spinner />
      </div>
    );

  if (!options.length) return <ErrorMessage className="my-2" message="No options are available" />;

  return (
    <>
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </>
  );
};
