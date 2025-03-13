import { useEffect, useState } from "react";
import PDFViewer from "./PDFViewer";
import { Button } from "@/components/ui/button";
import AnalysisResults from "./AnalysisResults";
import { Document } from "@shared/schema";
import { TrendingUp, FileText } from "lucide-react";

interface DocumentAnalysisCardProps {
  document: Document;
  onAnalyze: () => Promise<void>;
  isAnalyzing: boolean;
  analysisType: "investment" | "forecast" | "risk";
}

export default function DocumentAnalysisCard({
  document,
  onAnalyze,
  isAnalyzing,
  analysisType,
}: DocumentAnalysisCardProps) {
  const [showPdf, setShowPdf] = useState(true);

  const getButtonColorClass = () => {
    switch (analysisType) {
      case "investment":
        return "bg-blue-600 hover:bg-blue-700";
      case "forecast":
        return "bg-green-600 hover:bg-green-700";
      case "risk":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-primary hover:bg-blue-700";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium">{document.title}</h3>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowPdf(!showPdf)}
          >
            {showPdf ? "Show Analysis" : "Show Document"}
          </Button>
          <Button
            className={getButtonColorClass()}
            onClick={onAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>Analyzing...</>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Analyze Document
              </>
            )}
          </Button>
        </div>
      </div>

      {showPdf ? (
        <PDFViewer document={document} />
      ) : document.analysis ? (
        <AnalysisResults
          summary={document.analysis.summary}
          insights={document.analysis.insights}
          recommendations={document.analysis.recommendations}
          type={analysisType}
        />
      ) : (
        <div className="bg-gray-50 rounded-lg py-12 text-center">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No analysis available</h3>
          <p className="text-gray-500 mb-4">
            Click the "Analyze Document" button to generate AI-powered insights
          </p>
          <Button 
            className={getButtonColorClass()}
            onClick={onAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Now"}
          </Button>
        </div>
      )}
    </div>
  );
}
