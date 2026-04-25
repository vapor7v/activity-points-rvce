"use client";

import { Document } from "@react-pdf/renderer";
import { FormFillerData } from "@/lib/types/form-filler";
import { CertificatePage } from "./pdf/certificate-page";
import { IndexPages } from "./pdf/index-page";
import { EvaluationPages } from "./pdf/evaluation-page";
import { ActivityPages } from "./pdf/activity-page";
import { PreamblePage } from "./pdf/preamble-page";
import { chunkArray } from "./pdf/utils";
import { EVALUATION_ROWS_PER_PAGE } from "./pdf/styles";

interface PDFDocumentProps {
  data: FormFillerData;
}

export const PDFDocumentTemplate = ({ data }: PDFDocumentProps) => {
  const { student, activities, evaluations, signatories } = data;
  
  // Calculate offsets for page numbering
  // 1 (Certificate) + Index Pages + Evaluation Pages
  const FIRST_PAGE_ROWS = 6;
  const CONTINUATION_PAGE_ROWS = 10;
  const indexPageCount = activities.length <= 0 ? 1 :
    1 + Math.max(0, Math.ceil((activities.length - FIRST_PAGE_ROWS) / CONTINUATION_PAGE_ROWS));
  const evaluationPages = chunkArray(evaluations, EVALUATION_ROWS_PER_PAGE);
  
  const startPageOffset = 1 + indexPageCount + evaluationPages.length;

  // Compute the relative page number where each activity's detail page lands
  // Page numbering starts from 1 for the activity section
  const activityPageNumbers: number[] = [];
  let cumulativePage = 1; // first activity starts at page 1
  for (const activity of activities) {
    activityPageNumbers.push(cumulativePage);
    const photoPages = (activity.photos || []).length;
    const certPages = (activity.certificateImages || []).length
      || (activity.certificateImage ? 1 : 0);
    cumulativePage += 1 + photoPages + certPages; // 1 detail + photos + certs
  }

  return (
    <Document>
      <CertificatePage data={data} />
      
      <IndexPages activities={activities} student={student} activityPageNumbers={activityPageNumbers} />
      
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
