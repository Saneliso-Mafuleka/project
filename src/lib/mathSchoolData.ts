import { MathStudent, MathClass, RegistrationRequest } from '../types/mathSchool';

// Demo Students Data (10-15 registered students)
export const registeredStudents: MathStudent[] = [
  {
    id: '1',
    studentId: 'MS2024001',
    fullName: 'Emma Johnson',
    gradeLevel: 8,
    enrollmentDate: '2024-08-15',
    registrationStatus: 'approved',
    mathLevel: 'Algebra I',
    previousGrades: [
      { semester: 'Fall 2023', grade: 'A-', percentage: 92 },
      { semester: 'Spring 2024', grade: 'A', percentage: 95 }
    ],
    placementTestScore: 88,
    parentName: 'Sarah Johnson',
    parentEmail: 'sarah.johnson@email.com',
    parentPhone: '+1 (555) 123-4567'
  },
  {
    id: '2',
    studentId: 'MS2024002',
    fullName: 'Michael Chen',
    gradeLevel: 9,
    enrollmentDate: '2024-08-20',
    registrationStatus: 'approved',
    mathLevel: 'Geometry',
    previousGrades: [
      { semester: 'Fall 2023', grade: 'B+', percentage: 87 },
      { semester: 'Spring 2024', grade: 'A-', percentage: 91 }
    ],
    placementTestScore: 85,
    parentName: 'David Chen',
    parentEmail: 'david.chen@email.com',
    parentPhone: '+1 (555) 234-5678'
  },
  {
    id: '3',
    studentId: 'MS2024003',
    fullName: 'Sophia Rodriguez',
    gradeLevel: 10,
    enrollmentDate: '2024-08-18',
    registrationStatus: 'approved',
    mathLevel: 'Algebra II',
    previousGrades: [
      { semester: 'Fall 2023', grade: 'A', percentage: 96 },
      { semester: 'Spring 2024', grade: 'A+', percentage: 98 }
    ],
    placementTestScore: 94,
    parentName: 'Maria Rodriguez',
    parentEmail: 'maria.rodriguez@email.com',
    parentPhone: '+1 (555) 345-6789'
  },
  {
    id: '4',
    studentId: 'MS2024004',
    fullName: 'James Wilson',
    gradeLevel: 7,
    enrollmentDate: '2024-08-22',
    registrationStatus: 'approved',
    mathLevel: 'Pre-Algebra',
    previousGrades: [
      { semester: 'Fall 2023', grade: 'B', percentage: 83 },
      { semester: 'Spring 2024', grade: 'B+', percentage: 86 }
    ],
    placementTestScore: 78,
    parentName: 'Robert Wilson',
    parentEmail: 'robert.wilson@email.com',
    parentPhone: '+1 (555) 456-7890'
  },
  {
    id: '5',
    studentId: 'MS2024005',
    fullName: 'Olivia Thompson',
    gradeLevel: 11,
    enrollmentDate: '2024-08-25',
    registrationStatus: 'approved',
    mathLevel: 'Pre-Calculus',
    previousGrades: [
      { semester: 'Fall 2023', grade: 'A-', percentage: 90 },
      { semester: 'Spring 2024', grade: 'A', percentage: 93 }
    ],
    placementTestScore: 91,
    parentName: 'Jennifer Thompson',
    parentEmail: 'jennifer.thompson@email.com',
    parentPhone: '+1 (555) 567-8901'
  },
  {
    id: '6',
    studentId: 'MS2024006',
    fullName: 'Ethan Davis',
    gradeLevel: 6,
    enrollmentDate: '2024-08-28',
    registrationStatus: 'approved',
    mathLevel: 'Math 6',
    previousGrades: [
      { semester: 'Fall 2023', grade: 'B+', percentage: 88 },
      { semester: 'Spring 2024', grade: 'A-', percentage: 90 }
    ],
    placementTestScore: 82,
    parentName: 'Mark Davis',
    parentEmail: 'mark.davis@email.com',
    parentPhone: '+1 (555) 678-9012'
  },
  {
    id: '7',
    studentId: 'MS2024007',
    fullName: 'Ava Martinez',
    gradeLevel: 12,
    enrollmentDate: '2024-08-30',
    registrationStatus: 'approved',
    mathLevel: 'AP Calculus AB',
    previousGrades: [
      { semester: 'Fall 2023', grade: 'A', percentage: 95 },
      { semester: 'Spring 2024', grade: 'A+', percentage: 97 }
    ],
    placementTestScore: 96,
    parentName: 'Carlos Martinez',
    parentEmail: 'carlos.martinez@email.com',
    parentPhone: '+1 (555) 789-0123'
  },
  {
    id: '8',
    studentId: 'MS2024008',
    fullName: 'Noah Anderson',
    gradeLevel: 8,
    enrollmentDate: '2024-09-02',
    registrationStatus: 'approved',
    mathLevel: 'Algebra I',
    previousGrades: [
      { semester: 'Fall 2023', grade: 'C+', percentage: 78 },
      { semester: 'Spring 2024', grade: 'B-', percentage: 81 }
    ],
    placementTestScore: 75,
    parentName: 'Lisa Anderson',
    parentEmail: 'lisa.anderson@email.com',
    parentPhone: '+1 (555) 890-1234'
  },
  {
    id: '9',
    studentId: 'MS2024009',
    fullName: 'Isabella Garcia',
    gradeLevel: 9,
    enrollmentDate: '2024-09-05',
    registrationStatus: 'approved',
    mathLevel: 'Geometry',
    previousGrades: [
      { semester: 'Fall 2023', grade: 'A-', percentage: 92 },
      { semester: 'Spring 2024', grade: 'A', percentage: 94 }
    ],
    placementTestScore: 89,
    parentName: 'Miguel Garcia',
    parentEmail: 'miguel.garcia@email.com',
    parentPhone: '+1 (555) 901-2345'
  },
  {
    id: '10',
    studentId: 'MS2024010',
    fullName: 'Liam Brown',
    gradeLevel: 10,
    enrollmentDate: '2024-09-08',
    registrationStatus: 'approved',
    mathLevel: 'Algebra II',
    previousGrades: [
      { semester: 'Fall 2023', grade: 'B', percentage: 84 },
      { semester: 'Spring 2024', grade: 'B+', percentage: 87 }
    ],
    placementTestScore: 83,
    parentName: 'Amanda Brown',
    parentEmail: 'amanda.brown@email.com',
    parentPhone: '+1 (555) 012-3456'
  },
  {
    id: '11',
    studentId: 'MS2024011',
    fullName: 'Mia Taylor',
    gradeLevel: 7,
    enrollmentDate: '2024-09-10',
    registrationStatus: 'approved',
    mathLevel: 'Pre-Algebra',
    previousGrades: [
      { semester: 'Fall 2023', grade: 'A', percentage: 94 },
      { semester: 'Spring 2024', grade: 'A-', percentage: 91 }
    ],
    placementTestScore: 86,
    parentName: 'Kevin Taylor',
    parentEmail: 'kevin.taylor@email.com',
    parentPhone: '+1 (555) 123-4567'
  },
  {
    id: '12',
    studentId: 'MS2024012',
    fullName: 'Alexander Lee',
    gradeLevel: 11,
    enrollmentDate: '2024-09-12',
    registrationStatus: 'approved',
    mathLevel: 'Pre-Calculus',
    previousGrades: [
      { semester: 'Fall 2023', grade: 'B+', percentage: 88 },
      { semester: 'Spring 2024', grade: 'A-', percentage: 90 }
    ],
    placementTestScore: 87,
    parentName: 'Susan Lee',
    parentEmail: 'susan.lee@email.com',
    parentPhone: '+1 (555) 234-5678'
  },
  {
    id: '13',
    studentId: 'MS2024013',
    fullName: 'Charlotte White',
    gradeLevel: 6,
    enrollmentDate: '2024-09-15',
    registrationStatus: 'approved',
    mathLevel: 'Math 6',
    previousGrades: [
      { semester: 'Fall 2023', grade: 'A-', percentage: 91 },
      { semester: 'Spring 2024', grade: 'A', percentage: 93 }
    ],
    placementTestScore: 85,
    parentName: 'Thomas White',
    parentEmail: 'thomas.white@email.com',
    parentPhone: '+1 (555) 345-6789'
  },
  {
    id: '14',
    studentId: 'MS2024014',
    fullName: 'Benjamin Harris',
    gradeLevel: 12,
    enrollmentDate: '2024-09-18',
    registrationStatus: 'approved',
    mathLevel: 'AP Calculus BC',
    previousGrades: [
      { semester: 'Fall 2023', grade: 'A+', percentage: 98 },
      { semester: 'Spring 2024', grade: 'A+', percentage: 99 }
    ],
    placementTestScore: 97,
    parentName: 'Rachel Harris',
    parentEmail: 'rachel.harris@email.com',
    parentPhone: '+1 (555) 456-7890'
  },
  {
    id: '15',
    studentId: 'MS2024015',
    fullName: 'Amelia Clark',
    gradeLevel: 8,
    enrollmentDate: '2024-09-20',
    registrationStatus: 'approved',
    mathLevel: 'Algebra I',
    previousGrades: [
      { semester: 'Fall 2023', grade: 'B-', percentage: 82 },
      { semester: 'Spring 2024', grade: 'B', percentage: 85 }
    ],
    placementTestScore: 80,
    parentName: 'Daniel Clark',
    parentEmail: 'daniel.clark@email.com',
    parentPhone: '+1 (555) 567-8901'
  }
];

// Pending Registration Requests (3-5 requests)
export const pendingRequests: RegistrationRequest[] = [
  {
    id: 'req001',
    requestDate: '2025-01-15',
    requestedClass: 'Algebra I',
    priority: 'high',
    reason: 'Student shows exceptional aptitude in mathematics and is ready for advanced coursework.',
    student: {
      id: 'pending1',
      studentId: 'MS2024016',
      fullName: 'Lucas Miller',
      gradeLevel: 7,
      enrollmentDate: '',
      registrationStatus: 'pending',
      mathLevel: 'Pre-Algebra',
      previousGrades: [
        { semester: 'Fall 2023', grade: 'A+', percentage: 97 },
        { semester: 'Spring 2024', grade: 'A+', percentage: 98 }
      ],
      placementTestScore: 92,
      parentName: 'Jennifer Miller',
      parentEmail: 'jennifer.miller@email.com',
      parentPhone: '+1 (555) 678-9012',
      notes: 'Gifted student seeking acceleration in mathematics'
    }
  },
  {
    id: 'req002',
    requestDate: '2025-01-14',
    requestedClass: 'Geometry',
    priority: 'medium',
    reason: 'Transfer student from another district with strong math background.',
    student: {
      id: 'pending2',
      studentId: 'MS2024017',
      fullName: 'Grace Wilson',
      gradeLevel: 9,
      enrollmentDate: '',
      registrationStatus: 'pending',
      mathLevel: 'Algebra I',
      previousGrades: [
        { semester: 'Fall 2023', grade: 'A-', percentage: 90 },
        { semester: 'Spring 2024', grade: 'A', percentage: 93 }
      ],
      placementTestScore: 88,
      parentName: 'Michael Wilson',
      parentEmail: 'michael.wilson@email.com',
      parentPhone: '+1 (555) 789-0123',
      notes: 'Transfer student from Lincoln High School'
    }
  },
  {
    id: 'req003',
    requestDate: '2025-01-13',
    requestedClass: 'Pre-Calculus',
    priority: 'high',
    reason: 'Student completed Algebra II with honors and is ready for advanced mathematics.',
    student: {
      id: 'pending3',
      studentId: 'MS2024018',
      fullName: 'Mason Rodriguez',
      gradeLevel: 10,
      enrollmentDate: '',
      registrationStatus: 'pending',
      mathLevel: 'Algebra II',
      previousGrades: [
        { semester: 'Fall 2023', grade: 'A', percentage: 95 },
        { semester: 'Spring 2024', grade: 'A+', percentage: 97 }
      ],
      placementTestScore: 94,
      parentName: 'Elena Rodriguez',
      parentEmail: 'elena.rodriguez@email.com',
      parentPhone: '+1 (555) 890-1234',
      notes: 'Honors student with strong analytical skills'
    }
  },
  {
    id: 'req004',
    requestDate: '2025-01-12',
    requestedClass: 'Math 6',
    priority: 'medium',
    reason: 'New student enrollment for upcoming semester.',
    student: {
      id: 'pending4',
      studentId: 'MS2024019',
      fullName: 'Harper Thompson',
      gradeLevel: 6,
      enrollmentDate: '',
      registrationStatus: 'pending',
      mathLevel: 'Math 5',
      previousGrades: [
        { semester: 'Fall 2023', grade: 'B+', percentage: 87 },
        { semester: 'Spring 2024', grade: 'A-', percentage: 90 }
      ],
      placementTestScore: 84,
      parentName: 'Sarah Thompson',
      parentEmail: 'sarah.thompson@email.com',
      parentPhone: '+1 (555) 901-2345',
      notes: 'New student moving from elementary school'
    }
  },
  {
    id: 'req005',
    requestDate: '2025-01-11',
    requestedClass: 'AP Calculus AB',
    priority: 'low',
    reason: 'Student requesting to skip Pre-Calculus based on summer coursework.',
    student: {
      id: 'pending5',
      studentId: 'MS2024020',
      fullName: 'Evelyn Davis',
      gradeLevel: 11,
      enrollmentDate: '',
      registrationStatus: 'pending',
      mathLevel: 'Algebra II',
      previousGrades: [
        { semester: 'Fall 2023', grade: 'B+', percentage: 88 },
        { semester: 'Spring 2024', grade: 'A-', percentage: 91 }
      ],
      placementTestScore: 86,
      parentName: 'James Davis',
      parentEmail: 'james.davis@email.com',
      parentPhone: '+1 (555) 012-3456',
      notes: 'Completed summer Pre-Calculus course at community college'
    }
  }
];

// Math Classes
export const mathClasses: MathClass[] = [
  {
    id: 'class1',
    name: 'Math 6',
    gradeLevel: 6,
    teacher: 'Ms. Johnson',
    capacity: 25,
    students: registeredStudents.filter(s => s.mathLevel === 'Math 6')
  },
  {
    id: 'class2',
    name: 'Pre-Algebra',
    gradeLevel: 7,
    teacher: 'Mr. Smith',
    capacity: 25,
    students: registeredStudents.filter(s => s.mathLevel === 'Pre-Algebra')
  },
  {
    id: 'class3',
    name: 'Algebra I',
    gradeLevel: 8,
    teacher: 'Mrs. Davis',
    capacity: 25,
    students: registeredStudents.filter(s => s.mathLevel === 'Algebra I')
  },
  {
    id: 'class4',
    name: 'Geometry',
    gradeLevel: 9,
    teacher: 'Mr. Wilson',
    capacity: 25,
    students: registeredStudents.filter(s => s.mathLevel === 'Geometry')
  },
  {
    id: 'class5',
    name: 'Algebra II',
    gradeLevel: 10,
    teacher: 'Ms. Brown',
    capacity: 25,
    students: registeredStudents.filter(s => s.mathLevel === 'Algebra II')
  },
  {
    id: 'class6',
    name: 'Pre-Calculus',
    gradeLevel: 11,
    teacher: 'Dr. Martinez',
    capacity: 20,
    students: registeredStudents.filter(s => s.mathLevel === 'Pre-Calculus')
  },
  {
    id: 'class7',
    name: 'AP Calculus AB',
    gradeLevel: 12,
    teacher: 'Mr. Anderson',
    capacity: 20,
    students: registeredStudents.filter(s => s.mathLevel === 'AP Calculus AB')
  },
  {
    id: 'class8',
    name: 'AP Calculus BC',
    gradeLevel: 12,
    teacher: 'Dr. Thompson',
    capacity: 15,
    students: registeredStudents.filter(s => s.mathLevel === 'AP Calculus BC')
  }
];