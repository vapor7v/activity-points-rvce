export interface StudentInfo {
  name: string;
  usn: string;
  department: string;
  period: string;
  totalPoints: number;
}

export interface Activity {
  id: string;
  slNo: number;
  semester: string;
  name: string;
  aicteMapping: string;
  startDate: string;
  endDate: string;
  duration: number;
  place: string;
  detailedReportPageNo: string;
  certificateAttached: boolean;
  hoursSpent: number;
  pointsEarned: number;
  description: string;
  photos: string[];
  outcomes: string;
  signatureOfCounsellor: string;
  certificateImage?: string;
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
