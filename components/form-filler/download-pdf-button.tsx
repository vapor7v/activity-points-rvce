"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormFillerData } from "@/lib/types/form-filler";
import { Download, Loader2 } from "lucide-react";
import { wrap } from "comlink";
import { type WorkerType } from "./pdf.worker";

interface DownloadPDFButtonProps {
  data: FormFillerData;
}

export function DownloadPDFButton({ data }: DownloadPDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    let worker: Worker | null = null;
    try {
      setIsGenerating(true);
      
      worker = new Worker(new URL("./pdf.worker.ts", import.meta.url));
      const service = wrap<WorkerType>(worker);
      
      const url = await service.renderPDF(data);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `activity_points_${data.student.usn || "form"}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
      worker?.terminate();
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
