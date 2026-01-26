"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormFillerData } from "@/lib/types/form-filler";
import { Download, Loader2 } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { PDFDocumentTemplate } from "./pdf-document";

interface DownloadPDFButtonProps {
  data: FormFillerData;
}

export function DownloadPDFButton({ data }: DownloadPDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      
      const blob = await pdf(<PDFDocumentTemplate data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `activity_points_${data.student.usn || "form"}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={handleDownload}
      disabled={isGenerating} 
      size="sm" 
      variant="outline" 
      className="gap-2"
    >
      {isGenerating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      <span className="hidden sm:inline">{isGenerating ? "Generating..." : "Download PDF"}</span>
      <span className="sr-only">Download</span>
    </Button>
  );
}
