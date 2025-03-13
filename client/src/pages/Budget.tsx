import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Wallet, 
  CreditCard, 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  Trash2,
  BarChart 
} from "lucide-react";

export default function Budget() {
  const [activeTab, setActiveTab] = useState("overview");
  const [budgetName, setBudgetName] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  
  const categories = [
    { 
      name: "Housing", 
      allocated: "$1,500.00", 
      spent: "$1,450.00", 
      remaining: "$50.00",
      percentage: 97 
    },
    { 
      name: "Transportation", 
      allocated: "$400.00", 
      spent: "$325.00", 
      remaining: "$75.00",
      percentage: 81 
    },
    { 
      name: "Food", 
      allocated: "$600.00", 
      spent: "$540.00", 
      remaining: "$60.00",
      percentage: 90 
    },
    { 
      name: "Utilities", 
      allocated: "$250.00", 
      spent: "$230.00", 
      remaining: "$20.00",
      percentage: 92 
    },
    { 
      name: "Entertainment", 
      allocated: "$300.00", 
      spent: "$275.00", 
      remaining: "$25.00",
      percentage: 92 
    },
    { 
      name: "Healthcare", 
      allocated: "$200.00", 
      spent: "$85.00", 
      remaining: "$115.00",
      percentage: 43 
    }
  ];
  
  const transactions = [
    { 
      id: 1,
      description: "Grocery Store",
      category: "Food",
      amount: "$86.45",
      date: "May 23, 2023",
      type: "expense" 
    },
    { 
      id: 2,
      description: "Electric Bill",
      category: "Utilities",
      amount: "$124.33",
      date: "May 21, 2023",
      type: "expense" 
    },
    { 
      id: 3,
      description: "Salary Deposit",
      category: "Income",
      amount: "$3,250.00",
      date: "May 15, 2023",
      type: "income" 
    },
    { 
      id: 4,
      description: "Restaurant",
      category: "Food",
      amount: "$58.20",
      date: "May 14, 2023",
      type: "expense" 
    },
    { 
      id: 5,
      description: "Gas",
      category: "Transportation",
      amount: "$45.00",
      date: "May 12, 2023",
      type: "expense" 
    }
  ];

  const handleAddBudget = () => {
    // Logic to add budget category
    setBudgetName("");
    setBudgetAmount("");
  };

  return (
    <DashboardLayout 
      title="Budget" 
      description="Track and manage your monthly expenses"
    >
      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-md mr-4">
                    <DollarSign className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Budget</p>
                    <h3 className="text-2xl font-bold">$3,250.00</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-md mr-4">
                    <TrendingDown className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <h3 className="text-2xl font-bold">$2,905.00</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-md mr-4">
                    <Wallet className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Remaining</p>
                    <h3 className="text-2xl font-bold">$345.00</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Budget Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map((category, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center">
                            <span className="text-sm font-medium">{category.name}</span>
                            <span className="ml-2 text-xs text-gray-500">
                              {category.spent} of {category.allocated}
                            </span>
                          </div>
                          <span className="text-xs font-medium">
                            {category.percentage}%
                          </span>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 3).map((transaction) => (
                      <div key={transaction.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                        <div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <p className="text-xs text-gray-500">{transaction.date}</p>
                        </div>
                        <span className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}{transaction.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="ghost" className="w-full mt-4 text-primary">
                    View All Transactions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Budget Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="budgetName">Category Name</Label>
                  <Input 
                    id="budgetName" 
                    value={budgetName} 
                    onChange={(e) => setBudgetName(e.target.value)} 
                    placeholder="e.g., Groceries" 
                  />
                </div>
                <div>
                  <Label htmlFor="budgetAmount">Budget Amount</Label>
                  <Input 
                    id="budgetAmount" 
                    value={budgetAmount} 
                    onChange={(e) => setBudgetAmount(e.target.value)} 
                    placeholder="e.g., 500" 
                    type="number" 
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    className="bg-primary w-full"
                    onClick={handleAddBudget}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border">
                <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 font-medium">
                  <div>Category</div>
                  <div>Allocated</div>
                  <div>Spent</div>
                  <div>Remaining</div>
                </div>
                <Separator />
                
                {categories.map((category, index) => (
                  <div key={index}>
                    <div className="grid grid-cols-4 gap-4 p-4 items-center">
                      <div>{category.name}</div>
                      <div>{category.allocated}</div>
                      <div>{category.spent}</div>
                      <div className="flex items-center">
                        <span className="mr-2">{category.remaining}</span>
                        <Progress value={category.percentage} className="w-20 h-2" />
                      </div>
                    </div>
                    {index < categories.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Transactions</CardTitle>
                <Button className="bg-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 font-medium">
                  <div>Description</div>
                  <div>Category</div>
                  <div>Date</div>
                  <div>Amount</div>
                  <div>Actions</div>
                </div>
                <Separator />
                
                {transactions.map((transaction, index) => (
                  <div key={transaction.id}>
                    <div className="grid grid-cols-5 gap-4 p-4 items-center">
                      <div>{transaction.description}</div>
                      <div>
                        <Badge className={transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                          {transaction.category}
                        </Badge>
                      </div>
                      <div>{transaction.date}</div>
                      <div className={transaction.type === 'income' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {transaction.type === 'income' ? '+' : '-'}{transaction.amount}
                      </div>
                      <div>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {index < transactions.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Spending by category chart would appear here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Monthly spending trend chart would appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
