"use client";

import { Document } from "@react-pdf/renderer";
import { FormFillerData } from "@/lib/types/form-filler";
import { CertificatePage } from "./pdf/certificate-page";
import { IndexPages } from "./pdf/index-page";
import { EvaluationPages } from "./pdf/evaluation-page";
import { ActivityPages } from "./pdf/activity-page";
import { PreamblePage } from "./pdf/preamble-page";
import { chunkArray } from "./pdf/utils";
import { INDEX_ROWS_PER_PAGE, EVALUATION_ROWS_PER_PAGE } from "./pdf/styles";

interface PDFDocumentProps {
  data: FormFillerData;
}

export const PDFDocumentTemplate = ({ data }: PDFDocumentProps) => {
  const { student, activities, evaluations, signatories } = data;
  
  // Calculate offsets for page numbering
  // 1 (Certificate) + Index Pages + Evaluation Pages
  const activityPages = chunkArray(activities, INDEX_ROWS_PER_PAGE);
  const evaluationPages = chunkArray(evaluations, EVALUATION_ROWS_PER_PAGE);
  
  const startPageOffset = 1 + activityPages.length + evaluationPages.length;

  return (
    <Document>
      <CertificatePage data={data} />
      
      <IndexPages activities={activities} student={student} />
      
      <EvaluationPages evaluations={evaluations} signatories={signatories} />
      
      <ActivityPages 
        activities={activities} 
        department={student.department} 
        startPageOffset={startPageOffset} 
      />

      <PreamblePage />
    </Document>
  );
};

export default PDFDocumentTemplate;
