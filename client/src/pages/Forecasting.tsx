import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Upload, Calendar, DollarSign, ArrowRight, PieChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FileUploader from "@/components/shared/FileUploader";
import { getUserDocuments, uploadDocument, analyzeForecastDocument } from "@/lib/api";
import { Document } from "@shared/schema";
import DocumentAnalysisCard from "@/components/shared/DocumentAnalysisCard";

export default function Forecasting() {
  const [showUploader, setShowUploader] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [forecastYears, setForecastYears] = useState([5]);
  const [growthRate, setGrowthRate] = useState([7]);
  const [inflationRate, setInflationRate] = useState([3]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Normally we would get the userId from auth context
        const userId = 1;
        const docs = await getUserDocuments(userId, "forecast");
        setDocuments(docs);
        
        if (docs.length > 0) {
          setSelectedDocument(docs[0]);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load forecast documents",
          variant: "destructive",
        });
      }
    };
    
    fetchDocuments();
  }, [toast]);

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", "1"); // Normally from auth context
      formData.append("category", "forecast");
      formData.append("title", file.name);
      
      const uploadedDoc = await uploadDocument(formData);
      setDocuments((prev) => [...prev, uploadedDoc]);
      setSelectedDocument(uploadedDoc);
      setShowUploader(false);
      
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    }
  };

  const analyzeDocument = async () => {
    if (!selectedDocument) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeForecastDocument(selectedDocument.id, 1);
      
      // Update the document with analysis
      if (result.success) {
        setDocuments(docs => 
          docs.map(doc => 
            doc.id === selectedDocument.id 
              ? { ...doc, analysis: result.analysis }
              : doc
          )
        );
        
        setSelectedDocument(prev => 
          prev ? { ...prev, analysis: result.analysis } : prev
        );
        
        toast({
          title: "Analysis Complete",
          description: "Your financial forecast has been analyzed",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze document",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <DashboardLayout
      title="Financial Forecasting"
      description="Project your financial future and plan for long-term goals"
    >
      <Tabs defaultValue="document-analysis">
        <TabsList className="mb-6">
          <TabsTrigger value="document-analysis">Document Analysis</TabsTrigger>
          <TabsTrigger value="retirement">Retirement Planning</TabsTrigger>
          <TabsTrigger value="goal-planning">Goal Planning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="document-analysis">
          <div className="flex justify-end mb-4">
            <Button 
              className="bg-primary text-white" 
              onClick={() => setShowUploader(!showUploader)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Financial Document
            </Button>
          </div>
          
          {showUploader && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Upload Financial Document</h3>
                <FileUploader 
                  onFileSelected={handleFileUpload}
                  acceptedFileTypes=".pdf"
                  maxSize={10}
                  label="Upload your financial statements or projections"
                />
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Your Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">No documents uploaded yet</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowUploader(true)}
                      className="mt-2"
                    >
                      Upload Your First Document
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div 
                        key={doc.id}
                        className={`p-3 rounded-md cursor-pointer flex items-center ${
                          selectedDocument?.id === doc.id 
                            ? "bg-blue-50 border border-blue-200" 
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedDocument(doc)}
                      >
                        <div className="mr-3 p-2 bg-purple-100 rounded-md">
                          <Calendar className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(doc.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                {selectedDocument ? (
                  <DocumentAnalysisCard
                    document={selectedDocument}
                    onAnalyze={analyzeDocument}
                    isAnalyzing={isAnalyzing}
                    analysisType="forecast"
                  />
                ) : (
                  <div className="text-center py-16">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Select a document to view forecast analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="retirement">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Retirement Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Current Age</label>
                    <Select defaultValue="35">
                      <SelectTrigger>
                        <SelectValue placeholder="Select your age" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(50)].map((_, i) => (
                          <SelectItem key={i} value={(i + 20).toString()}>
                            {i + 20}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Retirement Age</label>
                    <Select defaultValue="65">
                      <SelectTrigger>
                        <SelectValue placeholder="Select retirement age" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(30)].map((_, i) => (
                          <SelectItem key={i} value={(i + 50).toString()}>
                            {i + 50}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Current Savings: ${(100000).toLocaleString()}
                    </label>
                    <Slider
                      defaultValue={[100000]}
                      max={1000000}
                      step={10000}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Monthly Contribution: ${1500}
                    </label>
                    <Slider
                      defaultValue={[1500]}
                      max={5000}
                      step={100}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Expected Annual Return: {growthRate[0]}%
                    </label>
                    <Slider
                      value={growthRate}
                      onValueChange={setGrowthRate}
                      max={12}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Inflation Rate: {inflationRate[0]}%
                    </label>
                    <Slider
                      value={inflationRate}
                      onValueChange={setInflationRate}
                      max={8}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>
                  
                  <Button className="w-full bg-primary">
                    Calculate Retirement
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Retirement Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md mb-6">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Retirement growth projection chart would appear here</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-gray-900">Retirement Age</h3>
                    <p className="text-xl font-bold text-blue-600">65</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-gray-900">Projected Savings</h3>
                    <p className="text-xl font-bold text-green-600">$1.8M</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-gray-900">Monthly Income</h3>
                    <p className="text-xl font-bold text-purple-600">$7,200</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="goal-planning">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-md mr-3">
                          <DollarSign className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Down Payment</h3>
                          <p className="text-xs text-gray-500">Home purchase by 2026</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">$60,000</p>
                        <p className="text-xs text-gray-500">$15,000 saved</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">25% complete</span>
                      <span className="text-xs text-gray-500">$1,250/month needed</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-md mr-3">
                          <Calendar className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Vacation Fund</h3>
                          <p className="text-xs text-gray-500">European trip in 2024</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">$8,000</p>
                        <p className="text-xs text-gray-500">$6,000 saved</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">75% complete</span>
                      <span className="text-xs text-gray-500">$400/month needed</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button variant="outline">
                      <PieChart className="h-4 w-4 mr-2" />
                      Add New Financial Goal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Goal Forecasting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-md mb-6">
                  <h3 className="text-sm font-medium mb-2">Scenario Analysis</h3>
                  <p className="text-sm text-gray-600">
                    Adjust your savings rate and time horizon to see how it affects your ability to reach your financial goals.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Forecast Years: {forecastYears[0]} years
                    </label>
                    <Slider
                      value={forecastYears}
                      onValueChange={setForecastYears}
                      max={30}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Savings Rate</label>
                    <Select defaultValue="15">
                      <SelectTrigger>
                        <SelectValue placeholder="Select savings rate" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(20)].map((_, i) => (
                          <SelectItem key={i} value={(i + 5).toString()}>
                            {i + 5}%
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full bg-primary">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Run Forecast
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 h-48 flex items-center justify-center bg-gray-50 rounded-md">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Goal achievement forecasting chart would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
