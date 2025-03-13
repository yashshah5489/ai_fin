import { 
  BarChart3, 
  Wallet, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown, 
  DollarSign 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatItemProps {
  title: string;
  value: string;
  change: {
    value: string;
    positive: boolean;
  };
  icon: React.ReactNode;
  bgColor: string;
}

function StatItem({ title, value, change, icon, bgColor }: StatItemProps) {
  return (
    <Card className="bg-white overflow-hidden shadow">
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${bgColor}`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-center">
                <div className="text-lg font-semibold text-gray-900">{value}</div>
                <div className={`ml-2 flex items-center text-sm ${change.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {change.positive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  <span>{change.value}</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface QuickStatsProps {
  stats: {
    totalBalance: string;
    balanceChange: string;
    balanceChangePositive: boolean;
    investments: string;
    investmentsChange: string;
    investmentsChangePositive: boolean;
    expenses: string;
    expensesChange: string;
    expensesChangePositive: boolean;
    growth: string;
    growthChange: string;
    growthChangePositive: boolean;
  };
}

export default function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatItem
        title="Total Balance"
        value={stats.totalBalance}
        change={{ value: stats.balanceChange, positive: stats.balanceChangePositive }}
        icon={<DollarSign className="h-5 w-5 text-white" />}
        bgColor="bg-blue-600"
      />
      
      <StatItem
        title="Total Investments"
        value={stats.investments}
        change={{ value: stats.investmentsChange, positive: stats.investmentsChangePositive }}
        icon={<BarChart3 className="h-5 w-5 text-white" />}
        bgColor="bg-green-600"
      />
      
      <StatItem
        title="Monthly Expenses"
        value={stats.expenses}
        change={{ value: stats.expensesChange, positive: false }}
        icon={<Wallet className="h-5 w-5 text-white" />}
        bgColor="bg-orange-500"
      />
      
      <StatItem
        title="Portfolio Growth"
        value={stats.growth}
        change={{ value: stats.growthChange, positive: stats.growthChangePositive }}
        icon={<TrendingUp className="h-5 w-5 text-white" />}
        bgColor="bg-purple-600"
      />
    </div>
  );
}
