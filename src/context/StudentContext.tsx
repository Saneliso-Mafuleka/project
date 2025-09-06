import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserMode, Student } from '../types/student';
import { mockStudent } from '../lib/studentData';

interface StudentContextType {
  student: Student;
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  switchMode: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [student] = useState<Student>(mockStudent);
  const [userMode, setUserMode] = useState<UserMode>('student');

  const switchMode = () => {
    setUserMode(prev => prev === 'student' ? 'parent' : 'student');
  };

  const value: StudentContextType = {
    student,
    userMode,
    setUserMode,
    switchMode
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}