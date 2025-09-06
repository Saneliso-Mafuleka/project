import { School, TeacherAccount, GradeAssignment, TeacherPerformance, SchoolPerformanceAnalytics } from '../types/school';

// Mock data for demonstration
const mockSchools: School[] = [
  {
    id: 'school_001',
    name: 'Greenwood Primary School',
    registrationNumber: 'GPS2024001',
    type: 'public',
    level: 'primary',
    address: {
      street: '123 Education Avenue',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8001',
      country: 'South Africa'
    },
    contact: {
      phone: '+27 21 123 4567',
      email: 'info@greenwood.edu.za',
      website: 'www.greenwood.edu.za'
    },
    principal: {
      name: 'Dr. Sarah Johnson',
      email: 'principal@greenwood.edu.za',
      phone: '+27 21 123 4568',
      qualifications: ['PhD Education Management', 'MEd Curriculum Studies']
    },
    establishment: {
      foundedYear: 1985,
      accreditation: ['Department of Basic Education', 'SACE'],
      curriculum: ['CAPS', 'IEB']
    },
    capacity: {
      totalStudents: 450,
      totalTeachers: 18,
      classrooms: 15,
      grades: ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7']
    },
    facilities: ['Library', 'Computer Lab', 'Science Lab', 'Sports Field', 'Cafeteria'],
    status: 'active',
    registeredAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    documents: []
  }
];

const mockTeachers: TeacherAccount[] = [
  {
    id: 'teacher_001',
    schoolId: 'school_001',
    personalInfo: {
      firstName: 'Mary',
      lastName: 'Williams',
      idNumber: '8501234567890',
      email: 'mary.williams@greenwood.edu.za',
      phone: '+27 82 123 4567',
      address: {
        street: '45 Oak Street',
        city: 'Cape Town',
        province: 'Western Cape',
        postalCode: '8002'
      },
      dateOfBirth: '1985-03-15',
      gender: 'female'
    },
    professional: {
      employeeNumber: 'EMP001',
      qualifications: [
        {
          id: 'qual_001',
          degree: 'Bachelor of Education',
          institution: 'University of Cape Town',
          year: 2007,
          field: 'Primary Education',
          grade: 'Cum Laude'
        }
      ],
      specializations: ['Mathematics', 'Natural Sciences'],
      experience: 17,
      certifications: [
        {
          id: 'cert_001',
          name: 'SACE Professional Teaching License',
          issuingBody: 'SACE',
          issueDate: '2007-12-01',
          certificateNumber: 'SACE123456'
        }
      ],
      emergencyContact: {
        name: 'John Williams',
        relationship: 'Spouse',
        phone: '+27 82 765 4321'
      }
    },
    assignments: [
      {
        id: 'assign_001',
        teacherId: 'teacher_001',
        grade: 'Grade 4',
        subject: 'Mathematics',
        classSection: 'A',
        isMainTeacher: true,
        assignedAt: '2024-01-15T08:00:00Z',
        academicYear: '2024',
        status: 'active'
      }
    ],
    performance: {
      id: 'perf_001',
      teacherId: 'teacher_001',
      academicYear: '2024',
      metrics: {
        workRate: {
          lessonPlanCompletion: 95,
          assignmentGradingSpeed: 2.5,
          attendanceRate: 98,
          punctualityScore: 96,
          extraCurricularParticipation: 8
        },
        studentPerformance: {
          averageClassGrade: 78,
          passRate: 92,
          improvementRate: 15,
          parentSatisfactionScore: 4.2
        },
        professionalDevelopment: {
          trainingHoursCompleted: 40,
          certificationsEarned: 2,
          workshopsAttended: 6,
          peerObservations: 4
        },
        collaboration: {
          teamProjectParticipation: 5,
          mentorshipActivities: 3,
          schoolEventParticipation: 12,
          parentCommunicationFrequency: 8
        }
      },
      evaluations: [],
      overallScore: 87,
      lastUpdated: '2024-01-15T08:00:00Z'
    },
    status: 'active',
    startDate: '2007-01-15',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  }
];

class SchoolService {
  private schools: School[] = [...mockSchools];
  private teachers: TeacherAccount[] = [...mockTeachers];
  private listeners: (() => void)[] = [];

  // Subscribe to data changes
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  // School Registration Methods
  async registerSchool(schoolData: Omit<School, 'id' | 'registeredAt' | 'updatedAt'>): Promise<School> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newSchool: School = {
      ...schoolData,
      id: `school_${Date.now()}`,
      registeredAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.schools.push(newSchool);
    this.notifyListeners();
    return newSchool;
  }

  async updateSchool(id: string, updates: Partial<School>): Promise<School> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const index = this.schools.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('School not found');
    }

    this.schools[index] = {
      ...this.schools[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.notifyListeners();
    return this.schools[index];
  }

  async getSchool(id: string): Promise<School | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.schools.find(s => s.id === id) || null;
  }

  async getSchools(): Promise<School[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...this.schools];
  }

  // Teacher Account Management Methods
  async createTeacherAccount(teacherData: Omit<TeacherAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeacherAccount> {
    await new Promise(resolve => setTimeout(resolve, 1200));

    const newTeacher: TeacherAccount = {
      ...teacherData,
      id: `teacher_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.teachers.push(newTeacher);
    this.notifyListeners();
    return newTeacher;
  }

  async updateTeacher(id: string, updates: Partial<TeacherAccount>): Promise<TeacherAccount> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const index = this.teachers.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Teacher not found');
    }

    this.teachers[index] = {
      ...this.teachers[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.notifyListeners();
    return this.teachers[index];
  }

  async getTeachers(schoolId: string): Promise<TeacherAccount[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.teachers.filter(t => t.schoolId === schoolId);
  }

  async getTeacher(id: string): Promise<TeacherAccount | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.teachers.find(t => t.id === id) || null;
  }

  // Grade Assignment Methods
  async assignTeacherToGrade(assignment: Omit<GradeAssignment, 'id' | 'assignedAt'>): Promise<GradeAssignment> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const newAssignment: GradeAssignment = {
      ...assignment,
      id: `assign_${Date.now()}`,
      assignedAt: new Date().toISOString()
    };

    const teacherIndex = this.teachers.findIndex(t => t.id === assignment.teacherId);
    if (teacherIndex !== -1) {
      this.teachers[teacherIndex].assignments.push(newAssignment);
      this.teachers[teacherIndex].updatedAt = new Date().toISOString();
    }

    this.notifyListeners();
    return newAssignment;
  }

  async updateGradeAssignment(assignmentId: string, updates: Partial<GradeAssignment>): Promise<GradeAssignment> {
    await new Promise(resolve => setTimeout(resolve, 500));

    for (const teacher of this.teachers) {
      const assignmentIndex = teacher.assignments.findIndex(a => a.id === assignmentId);
      if (assignmentIndex !== -1) {
        teacher.assignments[assignmentIndex] = {
          ...teacher.assignments[assignmentIndex],
          ...updates
        };
        teacher.updatedAt = new Date().toISOString();
        this.notifyListeners();
        return teacher.assignments[assignmentIndex];
      }
    }

    throw new Error('Assignment not found');
  }

  async removeGradeAssignment(assignmentId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));

    for (const teacher of this.teachers) {
      const assignmentIndex = teacher.assignments.findIndex(a => a.id === assignmentId);
      if (assignmentIndex !== -1) {
        teacher.assignments.splice(assignmentIndex, 1);
        teacher.updatedAt = new Date().toISOString();
        this.notifyListeners();
        return;
      }
    }

    throw new Error('Assignment not found');
  }

  // Performance Analytics Methods
  async getSchoolPerformanceAnalytics(schoolId: string, academicYear: string): Promise<SchoolPerformanceAnalytics> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock analytics data
    const analytics: SchoolPerformanceAnalytics = {
      schoolId,
      academicYear,
      overview: {
        totalStudents: 450,
        totalTeachers: 18,
        averageClassSize: 25,
        teacherRetentionRate: 94
      },
      academic: {
        overallPassRate: 87,
        gradeWisePerformance: [
          { grade: 'Grade 1', totalStudents: 65, passRate: 95, averageScore: 82, topSubjects: ['Mathematics', 'English'], challengingSubjects: ['Life Skills'] },
          { grade: 'Grade 2', totalStudents: 68, passRate: 92, averageScore: 79, topSubjects: ['English', 'Afrikaans'], challengingSubjects: ['Mathematics'] },
          { grade: 'Grade 3', totalStudents: 62, passRate: 89, averageScore: 77, topSubjects: ['Life Skills', 'English'], challengingSubjects: ['Mathematics'] },
          { grade: 'Grade 4', totalStudents: 58, passRate: 85, averageScore: 75, topSubjects: ['English', 'Social Sciences'], challengingSubjects: ['Mathematics', 'Natural Sciences'] },
          { grade: 'Grade 5', totalStudents: 55, passRate: 83, averageScore: 73, topSubjects: ['English', 'Life Skills'], challengingSubjects: ['Mathematics', 'Natural Sciences'] },
          { grade: 'Grade 6', totalStudents: 52, passRate: 81, averageScore: 71, topSubjects: ['Social Sciences', 'English'], challengingSubjects: ['Mathematics', 'Natural Sciences'] },
          { grade: 'Grade 7', totalStudents: 48, passRate: 78, averageScore: 69, topSubjects: ['English', 'Life Orientation'], challengingSubjects: ['Mathematics', 'Natural Sciences'] }
        ],
        subjectWisePerformance: [
          { subject: 'Mathematics', averageScore: 68, passRate: 75, teacherCount: 4, studentCount: 450, trend: 'improving' },
          { subject: 'English', averageScore: 82, passRate: 91, teacherCount: 5, studentCount: 450, trend: 'stable' },
          { subject: 'Afrikaans', averageScore: 76, passRate: 85, teacherCount: 3, studentCount: 450, trend: 'improving' },
          { subject: 'Natural Sciences', averageScore: 71, passRate: 80, teacherCount: 3, studentCount: 308, trend: 'declining' },
          { subject: 'Social Sciences', averageScore: 79, passRate: 88, teacherCount: 2, studentCount: 308, trend: 'stable' },
          { subject: 'Life Skills', averageScore: 85, passRate: 95, teacherCount: 4, studentCount: 195, trend: 'improving' }
        ],
        yearOverYearTrends: [
          { year: '2020', passRate: 82, averageScore: 72, teacherPerformance: 78, studentSatisfaction: 3.8 },
          { year: '2021', passRate: 84, averageScore: 74, teacherPerformance: 81, studentSatisfaction: 4.0 },
          { year: '2022', passRate: 85, averageScore: 75, teacherPerformance: 83, studentSatisfaction: 4.1 },
          { year: '2023', passRate: 86, averageScore: 76, teacherPerformance: 85, studentSatisfaction: 4.2 },
          { year: '2024', passRate: 87, averageScore: 77, teacherPerformance: 87, studentSatisfaction: 4.3 }
        ]
      },
      teacher: {
        averagePerformanceScore: 85,
        topPerformers: [
          { id: 'teacher_001', name: 'Mary Williams', grade: 'Grade 4', subject: 'Mathematics', performanceScore: 95, yearsExperience: 17 },
          { id: 'teacher_002', name: 'John Smith', grade: 'Grade 6', subject: 'English', performanceScore: 92, yearsExperience: 12 },
          { id: 'teacher_003', name: 'Sarah Brown', grade: 'Grade 2', subject: 'Life Skills', performanceScore: 90, yearsExperience: 8 }
        ],
        performanceDistribution: {
          excellent: 6,
          good: 8,
          satisfactory: 3,
          needsImprovement: 1,
          unsatisfactory: 0
        },
        professionalDevelopmentStats: {
          averageTrainingHours: 35,
          certificationsEarned: 24,
          workshopsCompleted: 108,
          mentorshipPrograms: 6
        }
      },
      kpis: [
        { id: 'kpi_001', name: 'Student Pass Rate', value: 87, target: 85, unit: '%', trend: 'up', category: 'academic', description: 'Percentage of students passing all subjects' },
        { id: 'kpi_002', name: 'Teacher Retention', value: 94, target: 90, unit: '%', trend: 'up', category: 'staff', description: 'Percentage of teachers retained year-over-year' },
        { id: 'kpi_003', name: 'Average Class Size', value: 25, target: 30, unit: 'students', trend: 'stable', category: 'operational', description: 'Average number of students per class' },
        { id: 'kpi_004', name: 'Parent Satisfaction', value: 4.3, target: 4.0, unit: '/5', trend: 'up', category: 'academic', description: 'Average parent satisfaction rating' }
      ],
      lastUpdated: new Date().toISOString()
    };

    return analytics;
  }

  async updateTeacherPerformance(teacherId: string, performance: Partial<TeacherPerformance>): Promise<TeacherPerformance> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const teacherIndex = this.teachers.findIndex(t => t.id === teacherId);
    if (teacherIndex === -1) {
      throw new Error('Teacher not found');
    }

    this.teachers[teacherIndex].performance = {
      ...this.teachers[teacherIndex].performance,
      ...performance,
      lastUpdated: new Date().toISOString()
    };

    this.teachers[teacherIndex].updatedAt = new Date().toISOString();
    this.notifyListeners();
    return this.teachers[teacherIndex].performance;
  }

  // Validation Methods
  validateSchoolRegistration(schoolData: Partial<School>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!schoolData.name || schoolData.name.trim().length < 3) {
      errors.push('School name must be at least 3 characters long');
    }

    if (!schoolData.registrationNumber || !/^[A-Z]{2,3}\d{4,7}$/.test(schoolData.registrationNumber)) {
      errors.push('Registration number must follow format: 2-3 letters followed by 4-7 digits');
    }

    if (!schoolData.contact?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schoolData.contact.email)) {
      errors.push('Valid email address is required');
    }

    if (!schoolData.contact?.phone || !/^\+?[\d\s\-\(\)]{10,15}$/.test(schoolData.contact.phone)) {
      errors.push('Valid phone number is required');
    }

    if (!schoolData.address?.street || !schoolData.address?.city || !schoolData.address?.province) {
      errors.push('Complete address is required');
    }

    if (!schoolData.principal?.name || !schoolData.principal?.email) {
      errors.push('Principal information is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateTeacherAccount(teacherData: Partial<TeacherAccount>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!teacherData.personalInfo?.firstName || !teacherData.personalInfo?.lastName) {
      errors.push('First name and last name are required');
    }

    if (!teacherData.personalInfo?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacherData.personalInfo.email)) {
      errors.push('Valid email address is required');
    }

    if (!teacherData.personalInfo?.idNumber || !/^\d{13}$/.test(teacherData.personalInfo.idNumber)) {
      errors.push('Valid 13-digit ID number is required');
    }

    if (!teacherData.professional?.qualifications || teacherData.professional.qualifications.length === 0) {
      errors.push('At least one qualification is required');
    }

    if (!teacherData.professional?.emergencyContact?.name || !teacherData.professional?.emergencyContact?.phone) {
      errors.push('Emergency contact information is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const schoolService = new SchoolService();