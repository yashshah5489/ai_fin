import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, LineChart, PieChart } from "lucide-react";

interface ReportsPanelProps {
  reportType: string;
  timeframe: string;
  date?: Date;
}

export default function ReportsPanel({ reportType, timeframe, date }: ReportsPanelProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [reportType, timeframe, date]);

  const getReportTitle = () => {
    const reportName = reportType
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    const period = timeframe.charAt(0).toUpperCase() + timeframe.slice(1);
    
    return `${reportName} - ${period} Report`;
  };

  const getReportContent = () => {
    if (loading) {
      return (
        <div className="py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Generating report...</p>
        </div>
      );
    }

    switch (reportType) {
      case 'financial-summary':
        return <FinancialSummaryReport />;
      case 'investment-performance':
        return <InvestmentPerformanceReport />;
      case 'expense-analysis':
        return <ExpenseAnalysisReport />;
      default:
        return (
          <div className="py-12 text-center">
            <p className="text-gray-500">Select report options to generate a report</p>
          </div>
        );
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">{getReportTitle()}</h2>
      {getReportContent()}
    </div>
  );
}

function FinancialSummaryReport() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-1">Net Worth</h3>
              <p className="text-3xl font-bold text-primary">$124,500</p>
              <p className="text-sm text-green-600">+8.2% from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-1">Total Income</h3>
              <p className="text-3xl font-bold text-green-600">$8,250</p>
              <p className="text-sm text-green-600">+2.4% from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-1">Total Expenses</h3>
              <p className="text-3xl font-bold text-red-600">$3,842</p>
              <p className="text-sm text-red-600">+5.1% from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income vs. Expenses</CardTitle>
          </CardHeader>
          <CardContent className="h-72 flex items-center justify-center">
            <div className="text-center">
              <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Income vs. Expenses bar chart would appear here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Net Worth Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-72 flex items-center justify-center">
            <div className="text-center">
              <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Net Worth trend line chart would appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="md:w-1/2 h-64 flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Asset allocation pie chart would appear here</p>
                </div>
              </div>
              
              <div className="md:w-1/2 space-y-3 mt-6 md:mt-0">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Stocks</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Bonds</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Real Estate</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Cash</span>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-500 rounded-full mr-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Other</span>
                      <span className="text-sm font-medium">5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InvestmentPerformanceReport() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-1">Total Return</h3>
              <p className="text-3xl font-bold text-green-600">+12.4%</p>
              <p className="text-sm text-green-600">+3.2% from benchmark</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-1">Annualized Return</h3>
              <p className="text-3xl font-bold text-green-600">+8.7%</p>
              <p className="text-sm text-green-600">Last 3 years</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-1">Dividend Yield</h3>
              <p className="text-3xl font-bold text-primary">2.3%</p>
              <p className="text-sm text-green-600">$2,850 annually</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-72 flex items-center justify-center">
          <div className="text-center">
            <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Portfolio performance chart would appear here</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                <div>
                  <h4 className="font-medium">Tesla Inc.</h4>
                  <p className="text-sm text-gray-500">TSLA</p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-bold">+24.6%</p>
                  <p className="text-sm text-gray-500">$5,240</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                <div>
                  <h4 className="font-medium">Apple Inc.</h4>
                  <p className="text-sm text-gray-500">AAPL</p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-bold">+18.2%</p>
                  <p className="text-sm text-gray-500">$7,850</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                <div>
                  <h4 className="font-medium">Microsoft Corp.</h4>
                  <p className="text-sm text-gray-500">MSFT</p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-bold">+15.7%</p>
                  <p className="text-sm text-gray-500">$6,420</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Underperformers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-md">
                <div>
                  <h4 className="font-medium">Zoom Video</h4>
                  <p className="text-sm text-gray-500">ZM</p>
                </div>
                <div className="text-right">
                  <p className="text-red-600 font-bold">-12.8%</p>
                  <p className="text-sm text-gray-500">$1,850</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-md">
                <div>
                  <h4 className="font-medium">Netflix Inc.</h4>
                  <p className="text-sm text-gray-500">NFLX</p>
                </div>
                <div className="text-right">
                  <p className="text-red-600 font-bold">-8.4%</p>
                  <p className="text-sm text-gray-500">$2,240</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-md">
                <div>
                  <h4 className="font-medium">Intel Corp.</h4>
                  <p className="text-sm text-gray-500">INTC</p>
                </div>
                <div className="text-right">
                  <p className="text-red-600 font-bold">-5.2%</p>
                  <p className="text-sm text-gray-500">$1,680</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ExpenseAnalysisReport() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-1">Total Expenses</h3>
              <p className="text-3xl font-bold text-primary">$3,842</p>
              <p className="text-sm text-red-600">+5.1% from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-1">Largest Category</h3>
              <p className="text-3xl font-bold text-primary">Housing</p>
              <p className="text-sm text-gray-600">$1,450 (37.7%)</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-1">Highest Growth</h3>
              <p className="text-3xl font-bold text-red-600">Food</p>
              <p className="text-sm text-red-600">+12.4% from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-72 flex items-center justify-center">
            <div className="text-center">
              <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Expense breakdown pie chart would appear here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-72 flex items-center justify-center">
            <div className="text-center">
              <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Monthly expense trend chart would appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Expense Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-1/2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Housing</span>
                </div>
              </div>
              <div className="w-1/2">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{width: "38%"}}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">$1,450</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-1/2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Food</span>
                </div>
              </div>
              <div className="w-1/2">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{width: "24%"}}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">$920</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-1/2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Transportation</span>
                </div>
              </div>
              <div className="w-1/2">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{width: "16%"}}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">$615</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-1/2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Entertainment</span>
                </div>
              </div>
              <div className="w-1/2">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{width: "12%"}}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">$460</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-1/2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Utilities</span>
                </div>
              </div>
              <div className="w-1/2">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-red-500 h-2.5 rounded-full" style={{width: "10%"}}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">$397</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
