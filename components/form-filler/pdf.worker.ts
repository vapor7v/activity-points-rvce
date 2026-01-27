import { expose } from "comlink";
import { createElement } from "react";
import { pdf } from "@react-pdf/renderer";
import { PDFDocumentTemplate } from "./pdf-document";
import { FormFillerData } from "@/lib/types/form-filler";
import { PDFDocument } from "pdf-lib";

const renderPDF = async (data: FormFillerData): Promise<string> => {
  try {
    const coverPdfBytes = await fetch("/cover.pdf").then((res) => res.arrayBuffer());

    const generatedPdfBlob = await pdf(createElement(PDFDocumentTemplate, { data }) as any).toBlob();
    const generatedPdfBytes = await generatedPdfBlob.arrayBuffer();

    const coverDoc = await PDFDocument.load(coverPdfBytes);
    const generatedDoc = await PDFDocument.load(generatedPdfBytes);

    const mergedDoc = await PDFDocument.create();

    const startPages = await mergedDoc.copyPages(coverDoc, [0, 1]);
    startPages.forEach((page) => mergedDoc.addPage(page));

    const generatedPages = await mergedDoc.copyPages(generatedDoc, generatedDoc.getPageIndices());
    generatedPages.forEach((page) => mergedDoc.addPage(page));


    if (coverDoc.getPageCount() >= 4) {
      const endPages = await mergedDoc.copyPages(coverDoc, [2, 3]);
      endPages.forEach((page) => mergedDoc.addPage(page));
    }

    const mergedPdfBytes = await mergedDoc.save();
    const blob = new Blob([mergedPdfBytes as any], { type: "application/pdf" });
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
