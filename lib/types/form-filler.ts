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
  dateAndDuration: string;
  place: string;
  detailedReportPageNo: string;
  certificateAttached: boolean;
  pointsEarned: number;
  description: string;
  photos: string[]; // URLs or base64 strings
  outcomes: string;
  signatureOfCounsellor: string;
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

export interface FormFillerData {
  student: StudentInfo;
  activities: Activity[];
  evaluations: EvaluationEntry[];
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
  "Computer Science & Engineering",
  "Information Science & Engineering",
  "Electronics & Communication Engineering",
  "Electrical & Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biotechnology",
  "Artificial Intelligence & Machine Learning",
] as const;

export const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;
