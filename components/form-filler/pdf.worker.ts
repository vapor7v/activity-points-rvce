import { expose } from "comlink";
import { createElement } from "react";
import { pdf } from "@react-pdf/renderer";
import { PDFDocumentTemplate } from "./pdf-document";
import { FormFillerData } from "@/lib/types/form-filler";

const renderPDF = async (data: FormFillerData): Promise<string> => {
  try {
    const blob = await pdf(createElement(PDFDocumentTemplate, { data }) as any).toBlob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Worker error rendering PDF:", error);
    throw error;
  }
};

expose({ renderPDF });

export type WorkerType = {
  renderPDF: typeof renderPDF;
};
