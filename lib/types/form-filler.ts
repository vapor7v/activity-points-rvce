export interface StudentInfo {
  name: string;
  usn: string;
  department: string;
  period: string; // e.g., "2022-2026"
  totalPoints: number;
}

export interface Activity {
  id: string;
  slNo: number;
  semester: string;
  name: string;
  aicteMapping: string; // Maps to AICTE activity category
  startDate: string;
  endDate: string;
  duration: number; // in days
  place: string;
  detailedReportPageNo: string;
  certificateAttached: boolean;
  hoursSpent: number;
  pointsEarned: number;
  description: string;
  photos: string[]; // URLs or base64 strings
  outcomes: string;
  signatureOfCounsellor: string;
  certificateImage?: string; // Base64 string for certificate
}

export interface EvaluationEntry {
  slNo: number;
  nameOfStudent: string;
  usn: string;
  typeOfWork: string;
  duration: string;
  hoursSpent: number;
  certificateAvailable: boolean;
  pointsEarned: number;
}

export interface Signatory {
  name: string;
  designation: string;
}

export interface FormFillerData {
  student: StudentInfo;
  activities: Activity[];
  evaluations: EvaluationEntry[];
  signatories: {
    evaluator1: Signatory;
    evaluator2: Signatory;
    counsellor: Signatory;
  };
}

// AICTE Activity Categories for dropdown
export const AICTE_CATEGORIES = [
  "NSS/NCC",
  "Sports & Games",
  "Cultural Activities",
  "Technical Activities",
  "Professional Self Initiatives",
  "Entrepreneurship & Innovation",
  "Leadership & Management",
] as const;

export const DEPARTMENTS = [
  "Artificial Intelligence & Machine Learning",
  "Aerospace Engineering",
  "Computer Science & Engineering",
  "Computer Science & Engineering - Data Science",
  "Computer Science & Engineering - Cybersecurity",
  "Information Science & Engineering",
  "Industrial Engineering and Management",
  "Electronics & Communication Engineering",
  "Electrical & Electronics Engineering",
  "Electronics & Telecommunication Engineering",
  "Electronics & Instrumentation Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biotechnology",
] as const;

export const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;
