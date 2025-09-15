"use client";

import { FC } from "react";
import { cn } from "@/lib/utils";
import { queryKeys } from "@/lib/query.keys";
import { useQuery } from "@tanstack/react-query";
import { getFinancialOverviewApi } from "../analytics.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDownIcon, TrendingUpIcon, WalletIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertErrorMessage } from "@/components/shared";

export const FinancialOverview = () => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: [queryKeys.analytics.overview],
    queryFn: getFinancialOverviewApi,
    select: (res) => res.data,
  });

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <AlertErrorMessage title="Error While fetching data" message={error?.message || "Something went wrong"} />;
  if (!data) return <AlertErrorMessage title="Error While fetching data" message="No data found" />;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <FinanceCard
        title="Total Balance"
        containerClassName="border border-l-6 text-white border-primary sm:col-span-2"
        amount={data.balance}
        icon={<WalletIcon className="size-4" />}
      />

      <FinanceCard
        title="Income"
        prefix="+ "
        valueClassName="text-green-500"
        amount={data.income}
        icon={<TrendingUpIcon className="size-4 text-green-500" />}
      />

      <FinanceCard title="Borrow" amount={data.borrow} icon={<TrendingUpIcon className="size-4 text-green-500" />} />
      <FinanceCard title="Lend" amount={data.lend} icon={<TrendingDownIcon className="text-destructive size-4" />} />

      <FinanceCard
        title="Expenses"
        prefix="- "
        valueClassName="text-destructive"
        amount={data.expense}
        icon={<TrendingDownIcon className="text-destructive size-4" />}
      />
    </div>
  );
};

type FinanceCardProps = {
  title: string;
  amount: number;
  prefix?: string;

  icon: React.ReactNode;
  valueClassName?: string;
  changeText?: string;
  containerClassName?: string;
};

const FinanceCard: FC<FinanceCardProps> = ({
  title,
  amount,
  prefix = "",

  icon,
  valueClassName = "",
  changeText,
  containerClassName = "",
}) => (
  <Card className={containerClassName}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className={cn("text-2xl font-bold", valueClassName)}>
        {prefix}
        {amount.toFixed(2)}
      </div>
      {changeText && <p className="text-muted-foreground text-xs">{changeText}</p>}
    </CardContent>
  </Card>
);

const LoadingSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <FinanceCardSkeleton key={index} />
    ))}
  </div>
);

const FinanceCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-4 rounded-full" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-6 w-28" />
      <Skeleton className="mt-2 h-3 w-20" />
    </CardContent>
  </Card>
);
