"use client";

import { cn } from "@/lib/utils";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TablePagination, TablePaginationProps } from "./table-pagination";

// type
type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: TablePaginationProps;
  className?: string;
};

export const DataTable = <TData, TValue>({ columns, data, pagination, className }: DataTableProps<TData, TValue>) => {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <ScrollArea disableScrollbar>
      <div className={cn("w-full overflow-hidden rounded-md border", className)}>
        <Table>
          <TableHeader className="sticky top-0 bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="py-4 font-semibold" key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow className="border-b even:bg-gray-100" key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {pagination && pagination.totalPages > 1 && <TablePagination {...pagination} />}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
