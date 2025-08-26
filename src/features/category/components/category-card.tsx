"use client";

import { FC } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartNoAxesCombinedIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { usePopupState } from "@/lib/hooks";
import { ActionMenu } from "@/components/shared";
import { EBudgetInterval, ECategoryType, TCategory } from "@/server/db/schema";
import { UpdateCategory } from "./update-category";
import { DeleteCategory } from "./delete-category";

// Main
type CategoryCardProps = Pick<TCategory, "id" | "name" | "type" | "budget"> & {
  income: number;
  expense: number;
};

export const CategoryCard: FC<CategoryCardProps> = ({ id, name, type, income, expense, budget }) => (
  <Card>
    <CategoryCardHeader id={id} name={name} type={type} budget={budget} />
    <CardContent>
      <CategoryCardIncomeExpense type={type} income={income} expense={expense} budget={budget} />
      <Budget budget={budget} expense={expense} />
    </CardContent>
  </Card>
);

// Header
type CategoryCardHeaderProps = Pick<CategoryCardProps, "id" | "name" | "type" | "budget">;

const headerConfig = {
  [ECategoryType.income]: {
    icon: TrendingUpIcon,
    iconClassName: "bg-emerald-500",
    text: "Income Source",
    textClassName: "bg-black/90",
  },

  [ECategoryType.expense]: {
    icon: TrendingDownIcon,
    iconClassName: "bg-destructive",
    text: "Expense Category",
    textClassName: "bg-destructive/90",
  },

  [ECategoryType.both]: {
    icon: ChartNoAxesCombinedIcon,
    iconClassName: "bg-orange-500",
    text: "Income/Expense",
    textClassName: "bg-orange-500/90",
  },
};

const CategoryCardHeader: FC<CategoryCardHeaderProps> = ({ id, name, type, budget }) => {
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
        <CategoryCardActionMenu id={id} name={name} type={type} budget={budget} />
      </div>
    </CardHeader>
  );
};

// Income Expense
type CategoryCardIncomeExpenseProps = Pick<CategoryCardProps, "type" | "income" | "expense" | "budget">;

const CategoryCardIncomeExpense: FC<CategoryCardIncomeExpenseProps> = ({ type, income, expense, budget }) => {
  const amount = type === ECategoryType.income ? income : expense;
  const interval = budget?.interval ?? EBudgetInterval.monthly;

  const period = interval === EBudgetInterval.yearly ? "Yearly" : interval === EBudgetInterval.weekly ? "Weekly" : "Monthly";
  const description = type === ECategoryType.income ? `${period} Income` : `${period} Expense`;

  return (
    <div
      data-type={type}
      className="dark:bg-background data-[type=expense]:bg-destructive/5 flex items-center justify-between gap-6 rounded-md p-4 data-[type=income]:bg-emerald-50"
    >
      <p className="text-sm font-semibold">{description}</p>
      <h3 className="text-2xl font-semibold">$ {amount}</h3>
    </div>
  );
};

// Budget
type BudgetProps = Pick<CategoryCardProps, "budget" | "expense">;
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

type CategoryCardActionMenuProps = Pick<CategoryCardProps, "id" | "name" | "type" | "budget">;
const CategoryCardActionMenu: FC<CategoryCardActionMenuProps> = ({ id, name, type, budget }) => {
  const { open, onOpenChange } = usePopupState();

  return (
    <ActionMenu open={open} onOpenChange={onOpenChange} triggerClassName="ml-auto">
      <UpdateCategory id={id} name={name} type={type} budget={budget ?? undefined} onSuccess={() => onOpenChange(false)} />
      <DeleteCategory id={id} />
    </ActionMenu>
  );
};
