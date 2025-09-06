import { MathStudent, RegistrationRequest } from '../types/mathSchool';
import { registeredStudents, pendingRequests } from './mathSchoolData';
import { storageService } from './storageService';

class MathSchoolService {
  private students: MathStudent[] = [...registeredStudents];
  private requests: RegistrationRequest[] = [...pendingRequests];
  private listeners: (() => void)[] = [];
  private initialized = false;

  constructor() {
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    if (this.initialized) return;
    
    try {
      const backup = storageService.getRegistrationDataBackup();
      if (backup && backup.students.length > 0) {
        this.students = backup.students;
        this.requests = backup.requests;
        console.log('Loaded data from storage backup');
      }
    } catch (error) {
      console.warn('Failed to initialize from storage:', error);
    }
    
    this.initialized = true;
  }

  private saveToStorage(): void {
    try {
      storageService.backupRegistrationData(this.students, this.requests);
    } catch (error) {
      console.warn('Failed to save to storage:', error);
    }
  }

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

  // Get all registered students
  async getRegisteredStudents(sortBy: 'name' | 'grade' | 'date' = 'name'): Promise<MathStudent[]> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    
    const approvedStudents = this.students.filter(s => s.registrationStatus === 'approved');
    
    return approvedStudents.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.fullName.localeCompare(b.fullName);
        case 'grade':
          return a.gradeLevel - b.gradeLevel;
        case 'date':
          return new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime();
        default:
          return 0;
      }
    });
  }

  // Get pending registration requests
  async getPendingRequests(): Promise<RegistrationRequest[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.requests].sort((a, b) => {
      // Sort by priority (high, medium, low) then by date
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
    });
  }

  // Accept a registration request
  async acceptRegistration(requestId: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API processing
    
    const requestIndex = this.requests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) {
      return { success: false, message: 'Registration request not found' };
    }

    const request = this.requests[requestIndex];
    
    // Update student status and add to registered students
    const updatedStudent: MathStudent = {
      ...request.student,
      registrationStatus: 'approved',
      enrollmentDate: new Date().toISOString().split('T')[0]
    };

    this.students.push(updatedStudent);
    this.requests.splice(requestIndex, 1);

    // Save to storage
    this.saveToStorage();

    // Notify listeners of data change
    this.notifyListeners();

    return { 
      success: true, 
      message: `${request.student.fullName} has been successfully enrolled in ${request.requestedClass}` 
    };
  }

  // Reject a registration request
  async rejectRegistration(requestId: string, reason?: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const requestIndex = this.requests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) {
      return { success: false, message: 'Registration request not found' };
    }

    const request = this.requests[requestIndex];
    
    // Update student status to rejected
    const rejectedStudent: MathStudent = {
      ...request.student,
      registrationStatus: 'rejected',
      notes: reason ? `Rejection reason: ${reason}` : 'Registration rejected'
    };

    this.students.push(rejectedStudent);
    this.requests.splice(requestIndex, 1);

    // Save to storage
    this.saveToStorage();

    // Notify listeners of data change
    this.notifyListeners();

    return { 
      success: true, 
      message: `Registration request for ${request.student.fullName} has been rejected` 
    };
  }

  // Get students by grade level
  async getStudentsByGrade(gradeLevel: number): Promise<MathStudent[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.students.filter(s => s.gradeLevel === gradeLevel && s.registrationStatus === 'approved');
  }

  // Search students
  async searchStudents(query: string): Promise<MathStudent[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lowercaseQuery = query.toLowerCase();
    
    return this.students.filter(s => 
      s.registrationStatus === 'approved' && (
        s.fullName.toLowerCase().includes(lowercaseQuery) ||
        s.studentId.toLowerCase().includes(lowercaseQuery) ||
        s.mathLevel.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  // Get current statistics
  async getStatistics(): Promise<{
    totalStudents: number;
    pendingRequests: number;
    gradeLevels: number;
    averageTestScore: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const approvedStudents = this.students.filter(s => s.registrationStatus === 'approved');
    const uniqueGrades = new Set(approvedStudents.map(s => s.gradeLevel));
    const avgScore = approvedStudents.reduce((acc, s) => acc + (s.placementTestScore || 0), 0) / approvedStudents.length;
    
    return {
      totalStudents: approvedStudents.length,
      pendingRequests: this.requests.length,
      gradeLevels: uniqueGrades.size,
      averageTestScore: Math.round(avgScore)
    };
  }
}

export const mathSchoolService = new MathSchoolService();