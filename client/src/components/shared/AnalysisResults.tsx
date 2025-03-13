import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface AnalysisResultsProps {
  summary: string;
  insights: string[];
  recommendations: string[];
  type: "investment" | "forecast" | "risk";
}

export default function AnalysisResults({
  summary,
  insights,
  recommendations,
  type,
}: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<string>("summary");
  
  const getBadgeForType = () => {
    switch (type) {
      case "investment":
        return (
          <Badge className="bg-blue-100 text-blue-800 mb-3">
            <TrendingUp className="h-3 w-3 mr-1" />
            Investment Analysis
          </Badge>
        );
      case "forecast":
        return (
          <Badge className="bg-green-100 text-green-800 mb-3">
            <TrendingUp className="h-3 w-3 mr-1" />
            Financial Forecast
          </Badge>
        );
      case "risk":
        return (
          <Badge className="bg-red-100 text-red-800 mb-3">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Risk Assessment
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      {getBadgeForType()}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 bg-white">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <div className="flex items-start mb-4">
            <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-700">{summary}</p>
          </div>
        </TabsContent>
        
        <TabsContent value="insights">
          <ul className="space-y-3">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">{insight}</p>
              </li>
            ))}
          </ul>
        </TabsContent>
        
        <TabsContent value="recommendations">
          <ul className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">{recommendation}</p>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-4">
        <Button variant="outline" className="text-primary">
          Generate Detailed Report
        </Button>
      </div>
    </div>
  );
}
