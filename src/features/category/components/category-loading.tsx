import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

export const CategoryListSkeleton: FC<{ size: number }> = ({ size }) => {
  return Array.from({ length: size }).map((_, index) => <CategoryCardSkeleton key={index} />);
};

export const CategoryCardSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-4">
        <Skeleton className="size-14 rounded-md" />

        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="ml-auto h-8 w-8 rounded-md" />
      </div>
    </CardHeader>

    <CardContent>
      <div className="dark:bg-background bg-background-gray flex items-center justify-between gap-6 rounded-md p-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-28" />
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-2 w-full rounded-md" />
      </div>
    </CardContent>
  </Card>
);
