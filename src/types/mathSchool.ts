export interface MathStudent {
  id: string;
  studentId: string;
  fullName: string;
  gradeLevel: number;
  enrollmentDate: string;
  registrationStatus: 'pending' | 'approved' | 'rejected';
  mathLevel: string;
  previousGrades: {
    semester: string;
    grade: string;
    percentage: number;
  }[];
  placementTestScore?: number;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  notes?: string;
}

export interface MathClass {
  id: string;
  name: string;
  gradeLevel: number;
  teacher: string;
  students: MathStudent[];
  capacity: number;
}

export interface RegistrationRequest {
  id: string;
  student: MathStudent;
  requestDate: string;
  requestedClass: string;
  priority: 'high' | 'medium' | 'low';
  reason?: string;
}