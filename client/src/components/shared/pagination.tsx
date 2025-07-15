"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

export type PaginationProps = { page: number; totalPages: number; onPageChange: (page: number) => void };

export const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (!totalPages) return null;

  const goNext = () => {
    console.log("Clicked");
    onPageChange(page + 1);
  };

  const goPrevious = () => {
    console.log("Clicked");
    onPageChange(page - 1);
  };

  const goTo = (pageNumber: number) => {
    console.log("Clicked");
    onPageChange(pageNumber);
  };

  console.log({ page });

  return (
    <div className="dark:bg-card sticky bottom-0 flex h-16 items-center justify-between gap-4 border-t bg-gray-100 px-4">
      <Button onClick={goPrevious} disabled={page === 1} variant="outline">
        <ArrowLeftIcon /> Previous
      </Button>
      <div className="flex items-center gap-2 font-semibold">
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;

          if (pageNumber === page)
            return (
              <Button key={index} onCanPlay={() => goTo(pageNumber)} variant="outline" size="icon">
                {pageNumber}
              </Button>
            );
          else if (pageNumber === 1 || pageNumber === totalPages || page + 1 === pageNumber || page - 1 === pageNumber)
            return (
              <Button key={index} onClick={() => goTo(pageNumber)} variant="ghost" size="icon">
                {pageNumber}
              </Button>
            );
          else if (pageNumber === 2 || pageNumber === totalPages - 1) return <span key={index}> ... </span>;
          else return null;
        })}
      </div>
      <Button onClick={goNext} disabled={page === totalPages} variant="outline">
        Next <ArrowRightIcon />
      </Button>
    </div>
  );
};
