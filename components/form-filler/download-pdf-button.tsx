"use client";

import { useEffect, useState, useMemo, memo } from "react";
import { Button } from "@/components/ui/button";
import { FormFillerData } from "@/lib/types/form-filler";
import { Download, Loader2 } from "lucide-react";

interface DownloadPDFButtonProps {
  data: FormFillerData;
}

export const DownloadPDFButton = memo(function DownloadPDFButton({ data }: DownloadPDFButtonProps) {
  const [isClient, setIsClient] = useState(false);
  const [DownloadLink, setDownloadLink] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    
    const loadPDFModules = async () => {
      try {
        const { PDFDownloadLink } = await import("@react-pdf/renderer");
        const { PDFDocumentTemplate } = await import("./pdf-document");
        
        const LinkComponent = ({ data }: { data: FormFillerData }) => {
           const document = useMemo(() => <PDFDocumentTemplate data={data} />, [data]);
           
           return (
            <PDFDownloadLink
              document={document}
              fileName={`activity_points_${data.student.usn || "form"}.pdf`}
            >
              {({ blob, url, loading, error }: any) => (
                <Button disabled={loading} size="sm" variant="outline" className="gap-2">
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Download PDF</span>
                  <span className="sr-only">Download</span>
                </Button>
              )}
            </PDFDownloadLink>
          );
        };
        
        setDownloadLink(() => LinkComponent);
      } catch (error) {
        console.error("Error loading PDF modules:", error);
      }
    };

    loadPDFModules();
  }, []);

  if (!isClient || !DownloadLink) {
    return (
      <Button disabled size="sm" variant="outline" className="gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="hidden sm:inline">Preparing...</span>
      </Button>
    );
  }

  return <DownloadLink data={data} />;
});
