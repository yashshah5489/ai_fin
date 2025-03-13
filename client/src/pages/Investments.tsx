import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, PieChart, BarChart, Globe, TrendingUp, Building } from "lucide-react";
import FileUploader from "@/components/shared/FileUploader";
import { useToast } from "@/hooks/use-toast";
import { getUserDocuments, uploadDocument, analyzeInvestmentDocument } from "@/lib/api";
import PDFViewer from "@/components/shared/PDFViewer";
import { Document } from "@shared/schema";

export default function Investments() {
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
        const docs = await getUserDocuments(userId, "investment");
        setDocuments(docs);
        
        if (docs.length > 0) {
          setSelectedDocument(docs[0]);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load investment documents",
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
      formData.append("category", "investment");
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
      const result = await analyzeInvestmentDocument(selectedDocument.id, 1);
      
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
          description: "Your investment document has been analyzed",
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
      title="Investments" 
      description="Manage and analyze your investment portfolio"
    >
      <div className="flex justify-end mb-4">
        <Button 
          className="bg-primary text-white" 
          onClick={() => setShowUploader(!showUploader)}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Investment Document
        </Button>
      </div>
      
      {showUploader && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Upload Investment Document</h3>
            <FileUploader 
              onFileSelected={handleFileUpload}
              acceptedFileTypes=".pdf"
              maxSize={10}
              label="Upload your investment statement or portfolio details"
            />
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document List */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Investment Documents</h3>
            
            {documents.length === 0 ? (
              <div className="text-center py-8">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No documents uploaded yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowUploader(true)}
                >
                  Upload Your First Document
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
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
                    <div className="mr-3 p-2 bg-blue-100 rounded-md">
                      <Building className="h-5 w-5 text-blue-600" />
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
        
        {/* Document Viewer and Analysis */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            {selectedDocument ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">{selectedDocument.title}</h3>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={analyzeDocument}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>Analyzing...</>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Analyze
                      </>
                    )}
                  </Button>
                </div>
                
                <PDFViewer document={selectedDocument} />
                
                {selectedDocument.analysis && (
                  <div className="mt-6">
                    <h4 className="text-md font-medium mb-2">AI Analysis</h4>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium mb-2">{selectedDocument.analysis.summary}</p>
                      
                      <h5 className="text-sm font-medium mt-4 mb-2">Key Insights:</h5>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {selectedDocument.analysis.insights.map((insight, i) => (
                          <li key={i} className="text-gray-700">{insight}</li>
                        ))}
                      </ul>
                      
                      <h5 className="text-sm font-medium mt-4 mb-2">Recommendations:</h5>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {selectedDocument.analysis.recommendations.map((rec, i) => (
                          <li key={i} className="text-gray-700">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Select a document to view</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Investment Charts */}
      <div className="mt-6">
        <Tabs defaultValue="allocation">
          <TabsList className="mb-4">
            <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="sectors">Sectors</TabsTrigger>
            <TabsTrigger value="geographic">Geographic</TabsTrigger>
          </TabsList>
          
          <TabsContent value="allocation">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Asset Allocation</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                  <div className="text-center">
                    <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Asset allocation visualization would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Performance History</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Performance chart would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sectors">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Sector Breakdown</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                  <div className="text-center">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Sector breakdown chart would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="geographic">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Geographic Distribution</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                  <div className="text-center">
                    <Globe className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Geographic distribution chart would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
