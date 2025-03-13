import { Document } from "@shared/schema";

export interface ProcessedPDFContent {
  text: string;
  pageCount: number;
  title?: string;
  author?: string;
  creationDate?: string;
}

// Convert base64 to raw binary data
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return bytes.buffer;
}

// Extract text content from PDF using PDF.js
export async function extractPDFContent(base64Content: string): Promise<ProcessedPDFContent> {
  try {
    // This would normally use PDF.js to extract text
    // For demo purposes, we'll simulate the extraction
    return {
      text: "This is the extracted text content from the PDF document. It would normally contain the actual text extracted from all pages of the PDF file.",
      pageCount: 5,
      title: "Financial Document",
      author: "Financial Institution",
      creationDate: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error extracting PDF content:", error);
    throw new Error("Failed to extract content from PDF");
  }
}

// Get the data URL for displaying a PDF from a document
export function getPDFDataUrl(document: Document): string {
  if (document.fileType !== "pdf") {
    throw new Error("Document is not a PDF");
  }
  
  return `data:application/pdf;base64,${document.fileContent}`;
}

// Helper to create a file download for a PDF document
export function downloadPDF(document: Document): void {
  if (document.fileType !== "pdf") {
    throw new Error("Document is not a PDF");
  }
  
  const linkSource = `data:application/pdf;base64,${document.fileContent}`;
  const downloadLink = document.createElement("a");
  
  downloadLink.href = linkSource;
  downloadLink.download = document.title;
  downloadLink.click();
}
