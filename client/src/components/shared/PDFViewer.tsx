import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from "lucide-react";
import { getPDFDataUrl } from "@/lib/pdf-utils";
import { Document } from "@shared/schema";

interface PDFViewerProps {
  document: Document;
  onDownload?: () => void;
}

export default function PDFViewer({ document, onDownload }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    try {
      if (document.fileType !== "pdf") {
        throw new Error("Document is not a PDF");
      }
      
      // Reset state when a new document is loaded
      setCurrentPage(1);
      setScale(1);
      
      // In a real implementation, we would use PDF.js to get the total page count
      // For now, we'll just set a placeholder value
      setTotalPages(5);
      setLoading(false);
    } catch (err) {
      setError("Failed to load PDF document");
      setLoading(false);
    }
  }, [document]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
  };

  if (loading) {
    return (
      <Card className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">Loading PDF document...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-96 flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-gray-100 p-2 rounded-t-lg flex items-center justify-between mb-1">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm mx-2">{Math.round(scale * 100)}%</span>
          <Button variant="ghost" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card className="w-full h-96 flex items-center justify-center overflow-hidden">
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'center', transition: 'transform 0.2s' }}>
          <iframe
            src={`${getPDFDataUrl(document)}#page=${currentPage}`}
            className="w-full h-96 border-0"
            title={document.title}
          />
        </div>
      </Card>
    </div>
  );
}
