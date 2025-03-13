import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QuickStats from "@/components/dashboard/QuickStats";
import AIAdvisor from "@/components/dashboard/AIAdvisor";
import RecentNews from "@/components/dashboard/RecentNews";
import InvestmentOverview from "@/components/dashboard/InvestmentOverview";
import { useToast } from "@/hooks/use-toast";
import { getUserFinancialData } from "@/lib/api";
import { Document, Building, Landmark, Globe, Home } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBalance: "$24,765.00",
    balanceChange: "3.2%",
    balanceChangePositive: true,
    investments: "$12,875.00",
    investmentsChange: "5.4%",
    investmentsChangePositive: true,
    expenses: "$3,450.00",
    expensesChange: "2.1%",
    expensesChangePositive: false,
    growth: "8.7%",
    growthChange: "1.3%",
    growthChangePositive: true,
  });
  
  const [investments, setInvestments] = useState([
    {
      id: 1,
      name: "S&P 500 ETF",
      type: "Equities",
      icon: <Building />,
      iconBg: "bg-blue-100",
      value: "$5,240.00",
      allocation: "40.7%",
      return: "+12.4%",
      returnPositive: true,
      riskLevel: "Medium",
      riskColor: "green",
    },
    {
      id: 2,
      name: "Treasury Bonds",
      type: "Fixed Income",
      icon: <Landmark />,
      iconBg: "bg-green-100",
      value: "$3,120.00",
      allocation: "24.2%",
      return: "-0.8%",
      returnPositive: false,
      riskLevel: "Low",
      riskColor: "blue",
    },
    {
      id: 3,
      name: "International ETF",
      type: "Foreign Equities",
      icon: <Globe />,
      iconBg: "bg-purple-100",
      value: "$2,650.00",
      allocation: "20.6%",
      return: "+9.2%",
      returnPositive: true,
      riskLevel: "Medium-High",
      riskColor: "yellow",
    },
    {
      id: 4,
      name: "REIT Fund",
      type: "Real Estate",
      icon: <Home />,
      iconBg: "bg-yellow-100",
      value: "$1,865.00",
      allocation: "14.5%",
      return: "+4.5%",
      returnPositive: true,
      riskLevel: "Medium",
      riskColor: "orange",
    },
  ]);
  
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real app, we would fetch real data from an API
    const fetchFinancialData = async () => {
      try {
        // Normally we would get the userId from auth context
        const userId = 1;
        const data = await getUserFinancialData(userId);
        
        // Process and update the state
        // This is just a placeholder since we're using mock data
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load financial data",
          variant: "destructive",
        });
      }
    };
    
    fetchFinancialData();
  }, [toast]);
  
  const handleImportData = () => {
    toast({
      title: "Import Data",
      description: "This feature would allow importing financial data from external sources",
    });
  };

  return (
    <DashboardLayout 
      title="Dashboard" 
      description="Welcome back! Here's an overview of your financial status."
    >
      {/* Quick Stats */}
      <QuickStats stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Advisor */}
        <div className="col-span-1 lg:col-span-2">
          <AIAdvisor userId={1} />
        </div>
        
        {/* Recent News */}
        <div className="col-span-1">
          <RecentNews limit={4} />
        </div>
      </div>
      
      {/* Investment Overview */}
      <InvestmentOverview investments={investments} onImportData={handleImportData} />
    </DashboardLayout>
  );
}
