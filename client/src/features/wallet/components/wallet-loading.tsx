import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

export const WalletListSkeleton: FC<{ size: number }> = ({ size }) => {
  return Array.from({ length: size }).map((_, index) => <WalletCardSkeleton key={index} />);
};

export const WalletCardSkeleton = () => (
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
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-28" />
        </div>

        <Skeleton className="size-5 rounded-full" />
      </div>
    </CardContent>
  </Card>
);
