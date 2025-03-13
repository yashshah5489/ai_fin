import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, MoreHorizontal, Building, Landmark, Globe, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Investment {
  id: number;
  name: string;
  type: string;
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  allocation: string;
  return: string;
  returnPositive: boolean;
  riskLevel: string;
  riskColor: string;
}

interface InvestmentOverviewProps {
  investments: Investment[];
  onImportData: () => void;
}

export default function InvestmentOverview({ investments, onImportData }: InvestmentOverviewProps) {
  function getIconForType(type: string) {
    switch (type) {
      case "Equities":
        return <Building className="text-blue-600 text-sm" />;
      case "Fixed Income":
        return <Landmark className="text-green-600 text-sm" />;
      case "Foreign Equities":
        return <Globe className="text-purple-600 text-sm" />;
      case "Real Estate":
        return <Home className="text-yellow-600 text-sm" />;
      default:
        return <Building className="text-blue-600 text-sm" />;
    }
  }

  return (
    <Card className="mt-8 bg-white shadow rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Investment Overview</h2>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="inline-flex items-center px-3 py-1 border-transparent text-sm font-medium rounded-md text-primary bg-blue-100 hover:bg-blue-200"
              onClick={onImportData}
            >
              <FileUp className="h-4 w-4 mr-2" />
              Import Data
            </Button>
            <Button 
              variant="outline" 
              className="inline-flex items-center px-3 py-1 border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <MoreHorizontal className="h-4 w-4 mr-2" />
              More Options
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {investments.map((investment) => (
                <tr key={investment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full ${investment.iconBg} flex items-center justify-center`}>
                        {getIconForType(investment.type)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{investment.name}</div>
                        <div className="text-xs text-gray-500">{investment.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{investment.value}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{investment.allocation}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${investment.returnPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {investment.return}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={`bg-${investment.riskColor}-100 text-${investment.riskColor}-800`}>
                      {investment.riskLevel}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {investments.length} of {investments.length} investments
          </div>
          <div>
            <Button
              variant="ghost"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-white hover:bg-blue-50"
            >
              View All Investments
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
