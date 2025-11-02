"use client";

import { queryKeys } from "@/lib/query.keys";
import { useQuery } from "@tanstack/react-query";
import { getExpenseDayByDayApi } from "../analytics.api";
import { AlertErrorMessage } from "@/components/shared";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Area, AreaChart } from "recharts";
import { useMemo } from "react";

export const ExpenseDayByDay = () => {
  const {
    data: expenses,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: [queryKeys.analytics.expenseDayByDay],
    queryFn: getExpenseDayByDayApi,
    select: (res) =>
      Object.keys(res.data ?? {}).map((key) => ({
        day: key,
        amount: res.data[key] || 0,
      })),
  });

  const hasData = useMemo(() => expenses && expenses.length > 0, [expenses]);

  if (isLoading) return <Skeleton className="h-72 w-full rounded-xl" />;
  if (isError) return <AlertErrorMessage title="Error fetching data" message={error?.message || "Something went wrong"} />;

  if (!hasData)
    return (
      <Card className="flex h-72 items-center justify-center">
        <p className="text-muted-foreground text-sm">No expense data available for this month</p>
      </Card>
    );

  return (
    <Card className="border-border/60 border shadow-sm">
      <CardHeader className="pb-1">
        <CardTitle className="text-foreground text-lg font-semibold tracking-tight">
          Monthly <span className="text-destructive">Expenses</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={expenses}>
              <defs>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--destructive)" stopOpacity={0.45} />
                  <stop offset="70%" stopColor="var(--destructive)" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="var(--background)" stopOpacity={0.15} />
                </linearGradient>
              </defs>

              {/*<CartesianGrid strokeDasharray="3 3" stroke={gridColor} />*/}
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
              <YAxis width={40} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />

              {/* Tooltip */}
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                  color: "var(--foreground)",
                }}
                labelStyle={{ fontWeight: "600" }}
                formatter={(value: number) => [`৳${value}`, "Amount"]}
              />

              {/* Legend */}
              <Legend verticalAlign="top" height={30} formatter={(value) => (value === "amount" ? "Amount" : value)} />

              <Area
                type="monotone"
                dataKey="amount"
                stroke="var(--destructive)"
                name="Amount"
                fill="url(#expenseGradient)"
                fillOpacity={1}
                isAnimationActive={true}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
