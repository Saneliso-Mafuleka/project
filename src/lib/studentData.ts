import { Student, Course, Assignment, Grade, AttendanceRecord, Schedule, Announcement } from '../types/student';

export const mockStudent: Student = {
  id: '1',
  name: 'Emma Johnson',
  grade: 'Grade 10',
  class: '10A',
  studentId: 'STU2024001',
  avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  parentName: 'Sarah Johnson',
  parentEmail: 'sarah.johnson@email.com',
  parentPhone: '+1 (555) 123-4567'
};

export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Mathematics',
    teacher: 'Mr. Anderson',
    color: '#3B82F6',
    progress: 78,
    nextClass: 'Today, 10:00 AM',
    assignments: [],
    grades: []
  },
  {
    id: '2',
    name: 'English Literature',
    teacher: 'Ms. Davis',
    color: '#10B981',
    progress: 85,
    nextClass: 'Tomorrow, 9:00 AM',
    assignments: [],
    grades: []
  },
  {
    id: '3',
    name: 'Science',
    teacher: 'Dr. Wilson',
    color: '#8B5CF6',
    progress: 72,
    nextClass: 'Today, 2:00 PM',
    assignments: [],
    grades: []
  },
  {
    id: '4',
    name: 'History',
    teacher: 'Mr. Thompson',
    color: '#F59E0B',
    progress: 90,
    nextClass: 'Wednesday, 11:00 AM',
    assignments: [],
    grades: []
  }
];

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Algebra Problem Set 5',
    courseId: '1',
    courseName: 'Mathematics',
    dueDate: '2025-01-20',
    status: 'pending',
    description: 'Complete problems 1-20 from chapter 5'
  },
  {
    id: '2',
    title: 'Essay: Romeo and Juliet Analysis',
    courseId: '2',
    courseName: 'English Literature',
    dueDate: '2025-01-22',
    status: 'submitted',
    grade: 88,
    maxGrade: 100
  },
  {
    id: '3',
    title: 'Chemistry Lab Report',
    courseId: '3',
    courseName: 'Science',
    dueDate: '2025-01-18',
    status: 'overdue',
    description: 'Lab experiment on chemical reactions'
  },
  {
    id: '4',
    title: 'World War II Timeline',
    courseId: '4',
    courseName: 'History',
    dueDate: '2025-01-25',
    status: 'pending',
    description: 'Create a detailed timeline of major WWII events'
  }
];

export const mockGrades: Grade[] = [
  {
    id: '1',
    courseId: '1',
    courseName: 'Mathematics',
    assignmentName: 'Midterm Exam',
    grade: 92,
    maxGrade: 100,
    date: '2025-01-10',
    feedback: 'Excellent work on complex problems!'
  },
  {
    id: '2',
    courseId: '2',
    courseName: 'English Literature',
    assignmentName: 'Poetry Analysis',
    grade: 85,
    maxGrade: 100,
    date: '2025-01-08',
    feedback: 'Good analysis, could use more examples'
  },
  {
    id: '3',
    courseId: '3',
    courseName: 'Science',
    assignmentName: 'Physics Quiz',
    grade: 78,
    maxGrade: 100,
    date: '2025-01-12',
    feedback: 'Review motion equations'
  },
  {
    id: '4',
    courseId: '4',
    courseName: 'History',
    assignmentName: 'Ancient Civilizations Test',
    grade: 95,
    maxGrade: 100,
    date: '2025-01-05',
    feedback: 'Outstanding knowledge of the subject!'
  }
];

export const mockAttendance: AttendanceRecord[] = [
  { id: '1', date: '2025-01-15', status: 'present', courseName: 'Mathematics' },
  { id: '2', date: '2025-01-15', status: 'present', courseName: 'English Literature' },
  { id: '3', date: '2025-01-15', status: 'late', courseName: 'Science', notes: '5 minutes late' },
  { id: '4', date: '2025-01-14', status: 'present', courseName: 'Mathematics' },
  { id: '5', date: '2025-01-14', status: 'absent', courseName: 'History', notes: 'Sick leave' },
  { id: '6', date: '2025-01-13', status: 'present', courseName: 'English Literature' },
  { id: '7', date: '2025-01-13', status: 'present', courseName: 'Science' },
  { id: '8', date: '2025-01-12', status: 'present', courseName: 'Mathematics' },
];

export const mockSchedule: Schedule[] = [
  { id: '1', courseId: '1', courseName: 'Mathematics', teacher: 'Mr. Anderson', time: '9:00 AM', room: 'Room 101', day: 'Monday' },
  { id: '2', courseId: '2', courseName: 'English Literature', teacher: 'Ms. Davis', time: '10:30 AM', room: 'Room 205', day: 'Monday' },
  { id: '3', courseId: '3', courseName: 'Science', teacher: 'Dr. Wilson', time: '1:00 PM', room: 'Lab 1', day: 'Monday' },
  { id: '4', courseId: '1', courseName: 'Mathematics', teacher: 'Mr. Anderson', time: '9:00 AM', room: 'Room 101', day: 'Tuesday' },
  { id: '5', courseId: '4', courseName: 'History', teacher: 'Mr. Thompson', time: '11:00 AM', room: 'Room 302', day: 'Tuesday' },
  { id: '6', courseId: '2', courseName: 'English Literature', teacher: 'Ms. Davis', time: '2:00 PM', room: 'Room 205', day: 'Tuesday' },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Parent-Teacher Conference',
    content: 'Parent-teacher conferences will be held next week. Please schedule your appointment.',
    date: '2025-01-15',
    priority: 'high',
    from: 'School Administration',
    type: 'event'
  },
  {
    id: '2',
    title: 'New Assignment Posted',
    content: 'A new mathematics assignment has been posted. Due date: January 20th.',
    date: '2025-01-14',
    priority: 'medium',
    from: 'Mr. Anderson',
    type: 'assignment'
  },
  {
    id: '3',
    title: 'Grade Updated',
    content: 'Your English Literature essay grade has been updated.',
    date: '2025-01-13',
    priority: 'low',
    from: 'Ms. Davis',
    type: 'grade'
  }
];