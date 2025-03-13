import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ReportsPanel from "@/components/reports/ReportsPanel";
import { 
  Download, 
  Calendar as CalendarIcon, 
  ChevronDown, 
  FileText,
  Share2
} from "lucide-react";
import { format } from "date-fns";

export default function Reports() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reportType, setReportType] = useState("financial-summary");
  const [timeframe, setTimeframe] = useState("monthly");

  return (
    <DashboardLayout 
      title="Reports" 
      description="Generate and view detailed financial reports"
    >
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial-summary">Financial Summary</SelectItem>
                  <SelectItem value="investment-performance">Investment Performance</SelectItem>
                  <SelectItem value="expense-analysis">Expense Analysis</SelectItem>
                  <SelectItem value="income-statement">Income Statement</SelectItem>
                  <SelectItem value="tax-summary">Tax Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border border-gray-300"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button variant="outline" className="mr-2">
              <ChevronDown className="mr-2 h-4 w-4" />
              More Options
            </Button>
            <Button className="bg-primary text-white">
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="report">
        <TabsList className="mb-6">
          <TabsTrigger value="report">Report</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="report">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Financial Summary Report</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" className="text-primary border-primary">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button className="bg-primary text-white">
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ReportsPanel reportType={reportType} timeframe={timeframe} date={date} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Empty state */}
                <div className="py-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No saved reports</h3>
                  <p className="text-gray-500 mb-4">
                    Generate a report and save it to access it here
                  </p>
                  <Button className="bg-primary text-white">
                    Generate New Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Empty state */}
                <div className="py-12 text-center">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No scheduled reports</h3>
                  <p className="text-gray-500 mb-4">
                    Schedule reports to be automatically generated and sent to you
                  </p>
                  <Button className="bg-primary text-white">
                    Schedule a Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
