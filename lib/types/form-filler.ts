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
  certificateImages: string[];
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

export const AICTE_CATEGORIES = [
  "Helping local schools to achieve good result and enhance their enrolment in Higher technical/vocational education",
  "Preparing an actionable business proposal for enhancing the village income",
  "Developing Sustainable Water management system",
  "Tourism approaches through innovative approaches",
  "Promotion of appropriate technologies",
  "Reduction in energy consumption",
  "To skill rural population",
  "Facilitating 100% digitized money transactions",
  "Setting of the information imparting club for women leading to contributing in social and economic issues",
  "Developing and managing efficient garbage disposable system",
  "To assist the marketing of rural produce",
  "Food preservation/packaging",
  "Automation of local activities",
  "Spreading public awareness under rural outreach program",
  "Contribution to any national level initiative of Government of India. For eg. Digital India, Skill India, Swachh Bharat Internship etc",
] as const;

