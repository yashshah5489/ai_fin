import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  AlertCircle, 
  TrendingUp, 
  ShieldAlert, 
  BarChart3, 
  Percent,
  FileText,
  PieChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FileUploader from "@/components/shared/FileUploader";
import { getUserDocuments, uploadDocument, analyzeRiskDocument } from "@/lib/api";
import { Document } from "@shared/schema";
import DocumentAnalysisCard from "@/components/shared/DocumentAnalysisCard";

export default function RiskAnalysis() {
  const [showUploader, setShowUploader] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Normally we would get the userId from auth context
        const userId = 1;
        const docs = await getUserDocuments(userId, "risk");
        setDocuments(docs);
        
        if (docs.length > 0) {
          setSelectedDocument(docs[0]);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load risk analysis documents",
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
      formData.append("category", "risk");
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
      const result = await analyzeRiskDocument(selectedDocument.id, 1);
      
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
          description: "Your risk analysis is ready to view",
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

  // Sample risk metrics for UI display
  const riskMetrics = [
    { name: "Portfolio Volatility", value: "High", score: 75, color: "red" },
    { name: "Diversification", value: "Moderate", score: 60, color: "yellow" },
    { name: "Liquidity Risk", value: "Low", score: 30, color: "green" },
    { name: "Credit Risk", value: "Moderate", score: 55, color: "yellow" },
    { name: "Market Risk", value: "High", score: 80, color: "red" }
  ];

  return (
    <DashboardLayout
      title="Risk Analysis"
      description="Analyze and manage the risk factors in your financial portfolio"
    >
      <Tabs defaultValue="document-analysis">
        <TabsList className="mb-6">
          <TabsTrigger value="document-analysis">Document Analysis</TabsTrigger>
          <TabsTrigger value="portfolio-risk">Portfolio Risk</TabsTrigger>
          <TabsTrigger value="scenarios">Stress Testing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="document-analysis">
          <div className="flex justify-end mb-4">
            <Button 
              className="bg-primary text-white" 
              onClick={() => setShowUploader(!showUploader)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Portfolio Document
            </Button>
          </div>
          
          {showUploader && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Upload Portfolio Document</h3>
                <FileUploader 
                  onFileSelected={handleFileUpload}
                  acceptedFileTypes=".pdf"
                  maxSize={10}
                  label="Upload your investment portfolio or risk assessment documents"
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
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
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
                        <div className="mr-3 p-2 bg-red-100 rounded-md">
                          <ShieldAlert className="h-5 w-5 text-red-600" />
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
                    analysisType="risk"
                  />
                ) : (
                  <div className="text-center py-16">
                    <ShieldAlert className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Select a document to view risk analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="portfolio-risk">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-600">68</div>
                          <div className="text-sm text-gray-500">Risk Score</div>
                        </div>
                      </div>
                      <svg className="w-32 h-32" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#eee"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="3"
                          strokeDasharray="68, 100"
                        />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-3 rounded-md">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">High Risk Alert</h3>
                        <p className="text-xs text-gray-600 mt-1">
                          Your portfolio has a higher risk level than recommended for your profile.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Risk Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {riskMetrics.map((metric, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{metric.name}</span>
                          <Badge className={`bg-${metric.color}-100 text-${metric.color}-800`}>
                            {metric.value}
                          </Badge>
                        </div>
                        <Progress 
                          value={metric.score} 
                          className="h-2" 
                          indicator={`bg-${metric.color}-600`} 
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Risk Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md mb-6">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">Portfolio risk visualization would appear here</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="border rounded-md p-4">
                      <h3 className="text-sm font-medium mb-2">Volatility</h3>
                      <div className="flex items-center">
                        <Percent className="h-5 w-5 text-red-600 mr-2" />
                        <span className="text-xl font-bold">18.5%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Higher than benchmark (15.2%)
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="text-sm font-medium mb-2">Beta</h3>
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-orange-600 mr-2" />
                        <span className="text-xl font-bold">1.24</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        24% more volatile than the market
                      </p>
                    </div>
                  </div>
                  
                  <h3 className="text-md font-medium mb-3">Risk Mitigation Recommendations</h3>
                  <ul className="list-disc pl-5 text-sm space-y-2 text-gray-700">
                    <li>Increase allocation to defensive assets to reduce overall volatility</li>
                    <li>Consider adding uncorrelated assets like gold or Treasury bonds</li>
                    <li>Reduce overexposure to technology sector (currently 42% of portfolio)</li>
                    <li>Review high-yield bonds that may be vulnerable to interest rate changes</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="scenarios">
          <Card>
            <CardHeader>
              <CardTitle>Stress Testing & Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">About Stress Testing</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Stress testing shows how your portfolio would perform under different market scenarios, 
                      such as market crashes, interest rate spikes, or economic recessions.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-md font-medium mb-4">Historical Scenarios</h3>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium">2008 Financial Crisis</h4>
                        <Badge className="bg-red-100 text-red-800">-28.5%</Badge>
                      </div>
                      <Progress value={28.5} className="h-2 bg-gray-200" indicator="bg-red-600" />
                      <p className="text-xs text-gray-500 mt-2">
                        Your portfolio would lose approximately $35,200
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium">2020 COVID Crash</h4>
                        <Badge className="bg-red-100 text-red-800">-18.3%</Badge>
                      </div>
                      <Progress value={18.3} className="h-2 bg-gray-200" indicator="bg-red-600" />
                      <p className="text-xs text-gray-500 mt-2">
                        Your portfolio would lose approximately $22,600
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium">2018 Rate Hike</h4>
                        <Badge className="bg-red-100 text-red-800">-9.2%</Badge>
                      </div>
                      <Progress value={9.2} className="h-2 bg-gray-200" indicator="bg-red-600" />
                      <p className="text-xs text-gray-500 mt-2">
                        Your portfolio would lose approximately $11,400
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-4">Hypothetical Scenarios</h3>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium">Severe Market Crash</h4>
                        <Badge className="bg-red-100 text-red-800">-35.0%</Badge>
                      </div>
                      <Progress value={35} className="h-2 bg-gray-200" indicator="bg-red-600" />
                      <p className="text-xs text-gray-500 mt-2">
                        Your portfolio would lose approximately $43,200
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium">Tech Sector Collapse</h4>
                        <Badge className="bg-red-100 text-red-800">-42.1%</Badge>
                      </div>
                      <Progress value={42.1} className="h-2 bg-gray-200" indicator="bg-red-600" />
                      <p className="text-xs text-gray-500 mt-2">
                        Your portfolio would lose approximately $52,000
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium">Rapid Interest Rate Rise</h4>
                        <Badge className="bg-red-100 text-red-800">-15.7%</Badge>
                      </div>
                      <Progress value={15.7} className="h-2 bg-gray-200" indicator="bg-red-600" />
                      <p className="text-xs text-gray-500 mt-2">
                        Your portfolio would lose approximately $19,400
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <Button className="bg-primary">
                  <PieChart className="h-4 w-4 mr-2" />
                  Create Custom Scenario
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
