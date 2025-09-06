export type UserMode = 'student' | 'parent';

export interface Student {
  id: string;
  name: string;
  grade: string;
  class: string;
  studentId: string;
  avatar?: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
}

export interface Course {
  id: string;
  name: string;
  teacher: string;
  color: string;
  progress: number;
  nextClass?: string;
  assignments: Assignment[];
  grades: Grade[];
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: number;
  maxGrade?: number;
  description?: string;
}

export interface Grade {
  id: string;
  courseId: string;
  courseName: string;
  assignmentName: string;
  grade: number;
  maxGrade: number;
  date: string;
  feedback?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  courseId?: string;
  courseName?: string;
  notes?: string;
}

export interface Schedule {
  id: string;
  courseId: string;
  courseName: string;
  teacher: string;
  time: string;
  room: string;
  day: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  from: string;
  type: 'general' | 'assignment' | 'event' | 'grade';
}