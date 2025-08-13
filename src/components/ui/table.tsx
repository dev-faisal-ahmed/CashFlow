"use client";

import { FC, ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Table: FC<ComponentProps<"table">> = ({ className, ...props }) => (
  <div data-slot="table-container" className="relative w-full overflow-x-auto">
    <table data-slot="table" className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
);

export const TableHeader: FC<ComponentProps<"thead">> = ({ className, ...props }) => (
  <thead data-slot="table-header" className={cn("[&_tr]:border-b", className)} {...props} />
);

export const TableBody: FC<ComponentProps<"tbody">> = ({ className, ...props }) => (
  <tbody data-slot="table-body" className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);

export const TableFooter: FC<ComponentProps<"tfoot">> = ({ className, ...props }) => (
  <tfoot data-slot="table-footer" className={cn("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", className)} {...props} />
);

export const TableRow: FC<ComponentProps<"tr">> = ({ className, ...props }) => (
  <tr
    data-slot="table-row"
    className={cn("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", className)}
    {...props}
  />
);

export const TableHead: FC<ComponentProps<"th">> = ({ className, ...props }) => (
  <th
    data-slot="table-head"
    className={cn(
      "text-foreground h-table-header p-4 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
);

export const TableCell: FC<ComponentProps<"td">> = ({ className, ...props }) => (
  <td
    data-slot="table-cell"
    className={cn("p-4 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className)}
    {...props}
  />
);

export const TableCaption: FC<ComponentProps<"caption">> = ({ className, ...props }) => (
  <caption data-slot="table-caption" className={cn("text-muted-foreground mt-4 text-sm", className)} {...props} />
);
