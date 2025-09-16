"use client";

import { queryKeys } from "@/lib/query.keys";
import { useQuery } from "@tanstack/react-query";
import { getExpenseDayByDayApi } from "../analytics.api";
import { AlertErrorMessage } from "@/components/shared";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ExpenseDayByDay = () => {
  const { data, isLoading, error, isError } = useQuery({ queryKey: [queryKeys.analytics.expenseDayByDay], queryFn: getExpenseDayByDayApi });

  if (isLoading) return <Skeleton className="h-input" />;
  if (isError) return <AlertErrorMessage title="Error While fetching data" message={error?.message || "Something went wrong"} />;
  if (!data) return <AlertErrorMessage title="Error While fetching data" message="No data found" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        
      </CardContent>
    </Card>
  );
};

{
  /* <Card className="border-0 bg-white/80 shadow-2xl shadow-slate-200/50 backdrop-blur-sm dark:bg-slate-800/80 dark:shadow-slate-900/50">
  <CardHeader className="pb-6">
    <CardTitle className="text-xl">Weekly Spending Trend</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={spendingTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={(value) => `$${value}`} />
          <Tooltip
            formatter={(value) => [`$${value}`, "Spent"]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="url(#weeklyGradient)"
            strokeWidth={4}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, fill: "#1d4ed8", strokeWidth: 2 }}
          />
          <defs>
            <linearGradient id="weeklyGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>; */
}
