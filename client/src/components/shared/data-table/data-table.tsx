"use client";

import { cn } from "@/lib/utils";
import { ColumnDef, flexRender, getCoreRowModel, Row, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "../error-message";
import { TablePagination, TablePaginationProps } from "./table-pagination";

// type
type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  className?: string;
  pagination?: TablePaginationProps;
};

export const DataTable = <TData, TValue>({ columns, data, isLoading, className, pagination }: DataTableProps<TData, TValue>) => {
  const tableData = isLoading ? (Array(10).fill({}) as TData[]) : data || [];
  const tableColumns = isLoading ? columns.map((column) => ({ ...column, cell: () => <Skeleton className="h-4" /> })) : columns;

  const table = useReactTable({ data: tableData, columns: tableColumns, getCoreRowModel: getCoreRowModel() });

  return (
    <ScrollArea disableScrollbar fixedLayout>
      <div className={cn("w-full overflow-hidden rounded-md border", className)}>
        <Table>
          <TableHeader className="dark:bg-card border-b bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="py-2 font-semibold" key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            <DataTableBody tableRows={table.getRowModel().rows} tableColumns={tableColumns} />
          </TableBody>
        </Table>
        {pagination && <TablePagination {...pagination} />}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

type DataTableBodyProps<TData, TValue> = {
  tableRows: Row<TData>[];
  tableColumns: ColumnDef<TData, TValue>[];
};

const DataTableBody = <TData, TValue>({ tableRows, tableColumns }: DataTableBodyProps<TData, TValue>) => {
  if (!tableRows.length)
    return (
      <TableRow>
        <TableCell colSpan={tableColumns.length} className="text-center">
          <ErrorMessage message="No results Found" />
        </TableCell>
      </TableRow>
    );

  return tableRows.map((row) => (
    <TableRow className="even:dark:bg-card/50 border-b even:bg-gray-100/50" key={row.id} data-state={row.getIsSelected() && "selected"}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  ));
};
