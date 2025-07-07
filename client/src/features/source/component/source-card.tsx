import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TSource } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TargetIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { FC } from "react";

// -------- Main -------- \\
type SourceCardProps = Pick<TSource, "_id" | "name" | "type" | "budget"> & { income: number; expense: number };
export const SourceCard: FC<SourceCardProps> = ({ name, type, income, expense, budget }) => (
  <Card>
    <SourceCardHeader name={name} type={type} income={income} expense={expense} budget={budget} />
    <CardContent></CardContent>
  </Card>
);

// -------- Header -------- \\
type SourceCardHeaderProps = Pick<SourceCardProps, "name" | "type" | "income" | "expense" | "budget">;

const headerConfig = {
  INCOME: { icon: TrendingUpIcon, iconClassName: "bg-emerald-500", text: "Income Source", textClassName: "bg-black/90" },
  EXPENSE: { icon: TrendingDownIcon, iconClassName: "bg-destructive", text: "Expense Category", textClassName: "bg-destructive/90" },
};

const SourceCardHeader: FC<SourceCardHeaderProps> = ({ name, type, income, expense, budget }) => {
  const config = headerConfig[type];
  const isIncome = type === "INCOME";
  const amount = isIncome ? income : expense;

  return (
    <CardHeader>
      <div className="flex items-center gap-4">
        <div className={cn("rounded-md p-2 text-white", config.iconClassName)}>
          <config.icon className="size-6" />
        </div>

        <div className="space-y-2">
          <CardTitle>{name}</CardTitle>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-medium">
              {config.text}
            </Badge>

            <Badge variant="outline" className="flex items-center gap-2 font-medium">
              <TargetIcon className="size-3" /> $ {amount.toLocaleString("en-US")} / {budget?.interval ?? "Monthly"}
            </Badge>
          </div>
        </div>
      </div>
    </CardHeader>
  );
};

// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { TBudgetInterval, TSource } from "@/lib/types";
// import {
//   AlertTriangleIcon,
//   CheckCircleIcon,
//   ClockIcon,
//   DollarSignIcon,
//   TargetIcon,
//   TrendingDown,
//   TrendingDownIcon,
//   TrendingUpIcon,
// } from "lucide-react";
// import { FC } from "react";

// export const SourceCard: FC<SourceCardProps> = (props) => {
//   const { name, type, budget, income, expense } = props;

//   console.log(type);

//   // Helper function to format currency
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   // Helper function to get interval display text
//   const getIntervalText = (interval: TBudgetInterval) => {
//     const intervalMap = {
//       WEEKLY: "week",
//       MONTHLY: "month",
//       YEARLY: "year",
//     };
//     return intervalMap[interval];
//   };

//   // Calculate monthly equivalents for comparison
//   const getMonthlyEquivalent = (amount: number, interval: TBudgetInterval) => {
//     const multipliers = {
//       WEEKLY: 4.33, // Average weeks per month
//       MONTHLY: 1,
//       YEARLY: 1 / 12,
//     };
//     return amount * multipliers[interval];
//   };

//   // Calculate budget usage percentage
//   const getBudgetUsage = () => {
//     if (!budget) return null;

//     const monthlyBudget = getMonthlyEquivalent(budget.amount, budget.interval);
//     const monthlyExpense = expense; // Assuming expense is already monthly

//     return {
//       percentage: Math.min((monthlyExpense / monthlyBudget) * 100, 100),
//       monthlyBudget,
//       monthlyExpense,
//       isOverBudget: monthlyExpense > monthlyBudget,
//     };
//   };

//   const budgetUsage = getBudgetUsage();

//   // Get status color and icon based on budget usage
//   const getStatusInfo = () => {
//     if (!budgetUsage) return { color: "text-slate-500", icon: ClockIcon, bgColor: "bg-slate-100" };

//     if (budgetUsage.isOverBudget) {
//       return { color: "text-red-500", icon: AlertTriangleIcon, bgColor: "bg-red-50" };
//     } else if (budgetUsage.percentage > 80) {
//       return { color: "text-orange-500", icon: AlertTriangleIcon, bgColor: "bg-orange-50" };
//     } else {
//       return { color: "text-green-500", icon: CheckCircleIcon, bgColor: "bg-green-50" };
//     }
//   };

//   const statusInfo = getStatusInfo();
//   const StatusIcon = statusInfo.icon;

//   return (
//     <Card className="relative overflow-hidden border-slate-200 bg-gradient-to-br from-white to-slate-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
//       {/* Background Pattern */}
//       <div
//         className={`absolute inset-0 ${
//           type === "INCOME"
//             ? "bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20"
//             : "bg-gradient-to-br from-red-50/50 to-rose-50/50 dark:from-red-950/20 dark:to-rose-950/20"
//         }`}
//       />

//       <CardHeader className="relative pb-3">
//         <div className="flex items-start justify-between">
//           <div className="flex items-center space-x-3">
//             <div
//               className={`rounded-xl p-4 shadow-lg ${
//                 type === "INCOME"
//                   ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
//                   : "bg-gradient-to-br from-red-500 to-rose-600 text-white"
//               }`}
//             >
//               {type === "INCOME" ? <TrendingUpIcon className="size-2" /> : <TrendingDownIcon className="size-2" />}
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{name}</h3>
//               <div className="mt-1 flex items-center space-x-2">
//                 <Badge variant={type === "INCOME" ? "default" : "destructive"} className="text-xs">
//                   {type === "INCOME" ? "Income Source" : "Expense Category"}
//                 </Badge>
//                 {budget && (
//                   <Badge variant="outline" className="text-xs">
//                     <TargetIcon className="mr-1 h-3 w-3" />
//                     {formatCurrency(budget.amount)}/{getIntervalText(budget.interval)}
//                   </Badge>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* to do add action menu */}
//           {/* <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                 <MoreVertical className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               {onViewDetails && <DropdownMenuItem onClick={onViewDetails}>View Details</DropdownMenuItem>}
//               {onEdit && <DropdownMenuItem onClick={onEdit}>Edit Source</DropdownMenuItem>}
//               {onDelete && (
//                 <DropdownMenuItem onClick={onDelete} className="text-red-600">
//                   Delete Source
//                 </DropdownMenuItem>
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu> */}
//         </div>
//       </CardHeader>

//       <CardContent className="relative space-y-4">
//         {/* Income & Expense Display */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="rounded-xl border border-slate-200/50 bg-white/60 p-4 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/60">
//             <div className="mb-2 flex items-center space-x-2">
//               <TrendingUpIcon className="h-4 w-4 text-green-500" />
//               <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Monthly Income</span>
//             </div>
//             <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(income)}</p>
//           </div>

//           <div className="rounded-xl border border-slate-200/50 bg-white/60 p-4 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/60">
//             <div className="mb-2 flex items-center space-x-2">
//               <TrendingDown className="h-4 w-4 text-red-500" />
//               <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Monthly Expense</span>
//             </div>
//             <p className="text-xl font-bold text-red-600 dark:text-red-400">{formatCurrency(expense)}</p>
//           </div>
//         </div>

//         {/* Budget Usage Section */}
//         {budget && budgetUsage && (
//           <div
//             className={`rounded-xl border border-slate-200/50 p-4 backdrop-blur-sm dark:border-slate-700/50 ${statusInfo.bgColor} dark:bg-slate-800/60`}
//           >
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
//                   <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Budget Usage</span>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{budgetUsage.percentage.toFixed(1)}%</p>
//                   <p className="text-xs text-slate-500 dark:text-slate-400">
//                     {formatCurrency(budgetUsage.monthlyExpense)} of {formatCurrency(budgetUsage.monthlyBudget)}
//                   </p>
//                 </div>
//               </div>

//               <Progress
//                 value={budgetUsage.percentage}
//                 className="h-2"
//                 // Custom progress bar color based on usage
//               />

//               <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
//                 <span>
//                   Budget: {formatCurrency(budget.amount)}/{getIntervalText(budget.interval)}
//                 </span>
//                 {budgetUsage.isOverBudget && (
//                   <span className="font-medium text-red-500">
//                     Over by {formatCurrency(budgetUsage.monthlyExpense - budgetUsage.monthlyBudget)}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Net Flow Indicator */}
//         <div className="rounded-xl border border-slate-200/50 bg-white/60 p-4 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/60">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <DollarSignIcon className="h-4 w-4 text-slate-500" />
//               <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Net Flow</span>
//             </div>
//             <div className="text-right">
//               <p
//                 className={`text-lg font-bold ${
//                   income - expense >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
//                 }`}
//               >
//                 {income - expense >= 0 ? "+" : ""}
//                 {formatCurrency(income - expense)}
//               </p>
//               <p className="text-xs text-slate-500 dark:text-slate-400">{income - expense >= 0 ? "Surplus" : "Deficit"}</p>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         {/* <div className="flex space-x-2 pt-2">
//           <Button
//             onClick={onViewDetails}
//             className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:from-blue-600 hover:to-blue-700"
//             size="sm"
//           >
//             <Calendar className="mr-2 h-4 w-4" />
//             View Details
//           </Button>
//           {budget && (
//             <Button
//               onClick={onEdit}
//               variant="outline"
//               className="flex-1 border-slate-300 bg-transparent hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
//               size="sm"
//             >
//               <PiggyBank className="mr-2 h-4 w-4" />
//               Adjust Budget
//             </Button>
//           )}
//         </div> */}
//       </CardContent>
//     </Card>
//   );
// };
