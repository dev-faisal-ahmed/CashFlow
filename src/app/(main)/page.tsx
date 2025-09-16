import { TopbarContent } from "@/layout/index";
import { Header } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, Clock, ArrowRightLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FinancialOverview } from "@/analytics/components";

const recentTransactions = [
  { id: 1, description: "Grocery Store", amount: -125.75, category: "Food", date: "2025-09-06" },
  { id: 2, description: "Freelance Payment", amount: 1200.0, category: "Income", date: "2025-09-05" },
  { id: 3, description: "Electric Bill", amount: -85.2, category: "Utilities", date: "2025-09-04" },
  { id: 4, description: "Restaurant", amount: -45.3, category: "Dining", date: "2025-09-03" },
];

const Page = () => {
  return (
    <>
      <TopbarContent position="left">
        <Header title="Dashboard" />
      </TopbarContent>

      <section className="flex flex-col gap-4">
        <FinancialOverview />

        <div className="">
          {/* Financial Overview Cards */}

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
      </section>
    </>
  );
};

export default Page;
