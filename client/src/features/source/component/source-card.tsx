import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { TSource } from "@/lib/types";
import { cn } from "@/lib/utils";
import { FC } from "react";

// -------- Main -------- \\
type SourceCardProps = Pick<TSource, "_id" | "name" | "type" | "budget"> & { income: number; expense: number };
export const SourceCard: FC<SourceCardProps> = ({ name, type, income, expense, budget }) => (
  <Card>
    <SourceCardHeader name={name} type={type} />
    <CardContent>
      <SourceCardIncomeExpense type={type} income={income} expense={expense} budget={budget} />
      <Budget budget={budget} expense={expense} />
    </CardContent>
  </Card>
);

// -------- Header -------- \\
type SourceCardHeaderProps = Pick<SourceCardProps, "name" | "type">;

const headerConfig = {
  INCOME: { icon: TrendingUpIcon, iconClassName: "bg-emerald-500", text: "Income Source", textClassName: "bg-black/90" },
  EXPENSE: { icon: TrendingDownIcon, iconClassName: "bg-destructive", text: "Expense Category", textClassName: "bg-destructive/90" },
};

const SourceCardHeader: FC<SourceCardHeaderProps> = ({ name, type }) => {
  const config = headerConfig[type];

  return (
    <CardHeader>
      <div className="flex items-center gap-4">
        <div className={cn("rounded-md p-2 text-white", config.iconClassName)}>
          <config.icon className="size-6" />
        </div>

        <div className="space-y-2">
          <CardTitle>{name}</CardTitle>

          <Badge variant="outline" className="font-medium">
            {config.text}
          </Badge>
        </div>
      </div>
    </CardHeader>
  );
};

// -------- Income Expense -------- \\
type SourceCardIncomeExpenseProps = Pick<SourceCardProps, "type" | "income" | "expense" | "budget">;
const SourceCardIncomeExpense: FC<SourceCardIncomeExpenseProps> = ({ type, income, expense, budget }) => {
  const amount = type === "INCOME" ? income : expense;
  const interval = budget?.interval ?? "MONTHLY";

  const period = interval === "YEARLY" ? "Yearly" : interval === "WEEKLY" ? "Weekly" : "Monthly";
  const description = type === "INCOME" ? `${period} Income` : `${period} Expense`;

  return (
    <div
      data-type={type}
      className="dark:bg-background data-[type=EXPENSE]:bg-destructive/5 flex items-center justify-between gap-6 rounded-md p-4 data-[type=INCOME]:bg-emerald-50"
    >
      <p className="text-sm font-semibold">{description}</p>
      <h3 className="text-2xl font-semibold">$ {amount}</h3>
    </div>
  );
};

// -------- Budget -------- \\
type BudgetProps = Pick<SourceCardProps, "budget" | "expense">;
const Budget: FC<BudgetProps> = ({ budget, expense }) => {
  if (!budget?.amount) return null;

  const amount = budget.amount;
  const usage = expense / amount;

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Usage</h3>
        <h3 className="text-sm font-semibold">
          {expense} / {amount}
        </h3>
      </div>
      <Progress className="h-2" value={usage} />
    </div>
  );
};
