export interface School {
  id: string;
  name: string;
  registrationNumber: string;
  type: 'public' | 'private' | 'charter' | 'international';
  level: 'primary' | 'secondary' | 'combined';
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
    fax?: string;
  };
  principal: {
    name: string;
    email: string;
    phone: string;
    qualifications: string[];
  };
  establishment: {
    foundedYear: number;
    accreditation: string[];
    curriculum: string[];
  };
  capacity: {
    totalStudents: number;
    totalTeachers: number;
    classrooms: number;
    grades: string[];
  };
  facilities: string[];
  status: 'active' | 'inactive' | 'pending_approval';
  registeredAt: string;
  updatedAt: string;
  documents: SchoolDocument[];
}

export interface SchoolDocument {
  id: string;
  type: 'registration_certificate' | 'accreditation' | 'license' | 'other';
  name: string;
  url: string;
  uploadedAt: string;
  expiryDate?: string;
}

export interface TeacherAccount {
  id: string;
  schoolId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    idNumber: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      province: string;
      postalCode: string;
    };
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
  };
  professional: {
    employeeNumber: string;
    qualifications: Qualification[];
    specializations: string[];
    experience: number; // years
    certifications: Certification[];
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  assignments: GradeAssignment[];
  performance: TeacherPerformance;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  startDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Qualification {
  id: string;
  degree: string;
  institution: string;
  year: number;
  field: string;
  grade?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingBody: string;
  issueDate: string;
  expiryDate?: string;
  certificateNumber: string;
}

export interface GradeAssignment {
  id: string;
  teacherId: string;
  grade: string;
  subject: string;
  classSection?: string;
  isMainTeacher: boolean;
  assignedAt: string;
  academicYear: string;
  status: 'active' | 'completed' | 'transferred';
}

export interface TeacherPerformance {
  id: string;
  teacherId: string;
  academicYear: string;
  metrics: {
    workRate: WorkRateMetrics;
    studentPerformance: StudentPerformanceMetrics;
    professionalDevelopment: ProfessionalDevelopmentMetrics;
    collaboration: CollaborationMetrics;
  };
  evaluations: PerformanceEvaluation[];
  overallScore: number;
  lastUpdated: string;
}

export interface WorkRateMetrics {
  lessonPlanCompletion: number; // percentage
  assignmentGradingSpeed: number; // average days
  attendanceRate: number; // percentage
  punctualityScore: number; // percentage
  extraCurricularParticipation: number; // hours per month
}

export interface StudentPerformanceMetrics {
  averageClassGrade: number;
  passRate: number; // percentage
  improvementRate: number; // percentage
  parentSatisfactionScore: number; // 1-5 scale
}

export interface ProfessionalDevelopmentMetrics {
  trainingHoursCompleted: number;
  certificationsEarned: number;
  workshopsAttended: number;
  peerObservations: number;
}

export interface CollaborationMetrics {
  teamProjectParticipation: number;
  mentorshipActivities: number;
  schoolEventParticipation: number;
  parentCommunicationFrequency: number;
}

export interface PerformanceEvaluation {
  id: string;
  evaluatorId: string;
  evaluatorName: string;
  evaluationType: 'quarterly' | 'annual' | 'probationary' | 'special';
  date: string;
  scores: {
    teaching: number;
    planning: number;
    classroom_management: number;
    professional_development: number;
    collaboration: number;
  };
  comments: string;
  recommendations: string[];
  actionItems: ActionItem[];
  overallRating: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' | 'unsatisfactory';
}

export interface ActionItem {
  id: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
}

export interface SchoolPerformanceAnalytics {
  schoolId: string;
  academicYear: string;
  overview: {
    totalStudents: number;
    totalTeachers: number;
    averageClassSize: number;
    teacherRetentionRate: number;
  };
  academic: {
    overallPassRate: number;
    gradeWisePerformance: GradePerformance[];
    subjectWisePerformance: SubjectPerformance[];
    yearOverYearTrends: YearTrend[];
  };
  teacher: {
    averagePerformanceScore: number;
    topPerformers: TeacherSummary[];
    performanceDistribution: PerformanceDistribution;
    professionalDevelopmentStats: ProfessionalDevelopmentStats;
  };
  kpis: SchoolKPI[];
  lastUpdated: string;
}

export interface GradePerformance {
  grade: string;
  totalStudents: number;
  passRate: number;
  averageScore: number;
  topSubjects: string[];
  challengingSubjects: string[];
}

export interface SubjectPerformance {
  subject: string;
  averageScore: number;
  passRate: number;
  teacherCount: number;
  studentCount: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface YearTrend {
  year: string;
  passRate: number;
  averageScore: number;
  teacherPerformance: number;
  studentSatisfaction: number;
}

export interface TeacherSummary {
  id: string;
  name: string;
  grade: string;
  subject: string;
  performanceScore: number;
  yearsExperience: number;
}

export interface PerformanceDistribution {
  excellent: number;
  good: number;
  satisfactory: number;
  needsImprovement: number;
  unsatisfactory: number;
}

export interface ProfessionalDevelopmentStats {
  averageTrainingHours: number;
  certificationsEarned: number;
  workshopsCompleted: number;
  mentorshipPrograms: number;
}

export interface SchoolKPI {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: 'academic' | 'operational' | 'financial' | 'staff';
  description: string;
}