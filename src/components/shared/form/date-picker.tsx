"use client";

import { FC } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePopupState } from "@/lib/hooks";

type DatePickerProps = {
  value?: Date;
  onChange: (value: Date) => void;
};

export const DatePicker: FC<DatePickerProps> = ({ value, onChange }) => {
  const { open, onOpenChange } = usePopupState();

  const handleSelect = (date: Date) => {
    onChange(date);
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className="data-[empty=true]:text-muted-foreground h-input justify-start text-left font-normal"
        >
          <CalendarIcon />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" onOpenAutoFocus={(e) => e.preventDefault()} onCloseAutoFocus={(e) => e.preventDefault()}>
        <Calendar mode="single" selected={value} onSelect={handleSelect} required />
      </PopoverContent>
    </Popover>
  );
};
