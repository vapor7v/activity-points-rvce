"use client";

import { useState, useEffect } from "react";
import { FormFillerData } from "@/lib/types/form-filler";

interface PDFPreviewProps {
  data: FormFillerData;
}

export function PDFPreview({ data }: PDFPreviewProps) {
  const [Component, setComponent] = useState<React.ReactNode>(null);

  useEffect(() => {

    const loadPDFViewer = async () => {
      const { PDFViewer } = await import("@react-pdf/renderer");
      const { PDFDocumentTemplate } = await import("./pdf-document");

      setComponent(
        <PDFViewer
          style={{ width: "100%", height: "100%", border: "none" }}
          showToolbar={true}
        >
          <PDFDocumentTemplate data={data} />
        </PDFViewer>
      );
    };

    loadPDFViewer();
  }, [data]);

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading PDF viewer...
      </div>
    );
  }

  return <>{Component}</>;
}
