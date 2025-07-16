import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

type TablePaginationProps<TData> = { table: Table<TData> };

export const TablePagination = <TData,>({ table }: TablePaginationProps<TData>) => {
  const totalPages = table.getPageCount();
  const page = table.getState().pagination.pageIndex;

  console.log(page);

  return (
    <div className="dark:bg-card flex h-16 items-center justify-between gap-4 border-t bg-gray-100 px-4">
      <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} variant="outline">
        <ArrowLeftIcon /> Previous
      </Button>

      <div className="flex items-center gap-2 font-semibold">
        {Array.from({ length: totalPages }).map((_, index) => {
          if (index === 0 || index === totalPages - 1 || (index >= page - 1 && index <= page + 1)) {
            return (
              <Button
                key={index}
                variant="outline"
                size="icon"
                onClick={() => table.setPageIndex(index)}
                className={cn(
                  "bg-transparent font-bold",
                  index === page && "bg-primary/10 dark:bg-primary border-primary/10 text-primary hover:text-primary dark:text-white",
                )}
              >
                {index + 1}
              </Button>
            );
          } else if (index === 1 || index === totalPages - 2) {
            return <span key={index}> ... </span>;
          }
          return null;
        })}
      </div>
      <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} variant="outline">
        Next <ArrowRightIcon />
      </Button>
    </div>
  );
};
