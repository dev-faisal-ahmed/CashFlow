import { TopbarContent } from "@/layout/index";
import { Header } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, TrendingUp, TrendingDown, Clock, ArrowRightLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data - replace with actual data from your API
const financialOverview = {
  totalBalance: 12540.75,
  income: 3250.0,
  expenses: 1890.5,
  savingsRate: 0.42,
};

const recentTransactions = [
  { id: 1, description: "Grocery Store", amount: -125.75, category: "Food", date: "2025-09-06" },
  { id: 2, description: "Freelance Payment", amount: 1200.0, category: "Income", date: "2025-09-05" },
  { id: 3, description: "Electric Bill", amount: -85.2, category: "Utilities", date: "2025-09-04" },
  { id: 4, description: "Restaurant", amount: -45.3, category: "Dining", date: "2025-09-03" },
];

const Page = () => {
  return (
    <div className="flex h-full flex-col">
      <TopbarContent position="left">
        <Header title="Dashboard" />
      </TopbarContent>

      <div className="flex-1 space-y-6 overflow-auto md:p-6">
        {/* Financial Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-primary border-l-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <Wallet className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${financialOverview.totalBalance.toFixed(2)}</div>
              <p className="text-muted-foreground text-xs">+12.5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+${financialOverview.income.toFixed(2)}</div>
              <p className="text-muted-foreground text-xs">+8.2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">-${Math.abs(financialOverview.expenses).toFixed(2)}</div>
              <p className="text-muted-foreground text-xs">+3.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
              <div className="bg-primary/20 flex h-4 w-4 items-center justify-center rounded-full">
                <span className="text-xs">%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(financialOverview.savingsRate * 100).toFixed(1)}%</div>
              <p className="text-muted-foreground text-xs">+2.3% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Recent Transactions */}
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ArrowRightLeft className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="hover:bg-muted/50 flex items-center justify-between rounded-lg p-3 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 rounded-full p-2">
                        <Wallet className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {transaction.category}
                          </Badge>
                          <span className="text-muted-foreground text-xs">{new Date(transaction.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`font-medium ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {transaction.amount >= 0 ? "+" : ""}
                      {transaction.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Transaction</span>
                </Button>
                <Button variant="outline" className="w-full justify-start space-x-2">
                  <ArrowRightLeft className="h-4 w-4" />
                  <span>Transfer Money</span>
                </Button>
                <Button variant="outline" className="w-full justify-start space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Schedule Payment</span>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Upcoming Bills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Netflix</p>
                      <p className="text-muted-foreground text-xs">Due in 3 days</p>
                    </div>
                    <span className="text-sm font-medium">$14.99</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Electricity</p>
                      <p className="text-muted-foreground text-xs">Due in 5 days</p>
                    </div>
                    <span className="text-sm font-medium">$78.50</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
