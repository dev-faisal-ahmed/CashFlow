import { cn } from "@/lib/utils";
import { FC, PropsWithChildren } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-react";
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";

type ActionMenuProps = PropsWithChildren<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerClassName?: string;
  contentClassName?: string;
  side?: DropdownMenuContentProps["side"];
  align?: DropdownMenuContentProps["align"];
}>;

export const ActionMenu: FC<ActionMenuProps> = ({
  open,
  onOpenChange,
  children,
  triggerClassName,
  contentClassName,
  side = "bottom",
  align = "end",
}) => (
  <DropdownMenu open={open} onOpenChange={onOpenChange} modal>
    <DropdownMenuTrigger asChild>
      <button className={cn("hover:bg-background cursor-pointer rounded-md p-2", triggerClassName)} onClick={() => onOpenChange(true)}>
        <EllipsisVerticalIcon className="size-4" />
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent className={cn("w-48 p-2", contentClassName)} side={side} align={align}>
      {children}
    </DropdownMenuContent>
  </DropdownMenu>
);
