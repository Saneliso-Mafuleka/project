// Storage Service for managing user preferences and data persistence
class StorageService {
  private readonly STORAGE_KEYS = {
    USER_PREFERENCES: 'math_school_user_preferences',
    TEACHER_FILTERS: 'math_school_teacher_filters',
    REGISTRATION_DATA: 'math_school_registration_data',
    PENDING_REQUESTS: 'math_school_pending_requests',
    REGISTERED_STUDENTS: 'math_school_registered_students'
  };

  // User Preferences Management
  saveUserPreferences(userId: string, preferences: any): void {
    try {
      const allPreferences = this.getUserPreferences();
      allPreferences[userId] = {
        ...allPreferences[userId],
        ...preferences,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(allPreferences));
    } catch (error) {
      console.warn('Failed to save user preferences:', error);
    }
  }

  getUserPreferences(userId?: string): any {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.USER_PREFERENCES);
      const allPreferences = stored ? JSON.parse(stored) : {};
      return userId ? (allPreferences[userId] || {}) : allPreferences;
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
      return userId ? {} : {};
    }
  }

  // Teacher Filter Preferences
  saveTeacherFilters(filters: any): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.TEACHER_FILTERS, JSON.stringify({
        ...filters,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.warn('Failed to save teacher filters:', error);
    }
  }

  getTeacherFilters(): any {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.TEACHER_FILTERS);
      return stored ? JSON.parse(stored) : {
        searchQuery: '',
        selectedGrade: 'all',
        sortBy: 'name',
        showFilters: false
      };
    } catch (error) {
      console.warn('Failed to load teacher filters:', error);
      return {
        searchQuery: '',
        selectedGrade: 'all',
        sortBy: 'name',
        showFilters: false
      };
    }
  }

  // Data Backup and Recovery
  backupRegistrationData(students: any[], requests: any[]): void {
    try {
      const backup = {
        students,
        requests,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(this.STORAGE_KEYS.REGISTRATION_DATA, JSON.stringify(backup));
    } catch (error) {
      console.warn('Failed to backup registration data:', error);
    }
  }

  getRegistrationDataBackup(): { students: any[], requests: any[] } | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.REGISTRATION_DATA);
      if (stored) {
        const backup = JSON.parse(stored);
        return {
          students: backup.students || [],
          requests: backup.requests || []
        };
      }
    } catch (error) {
      console.warn('Failed to load registration data backup:', error);
    }
    return null;
  }

  // Connection Status Management
  setOfflineMode(isOffline: boolean): void {
    try {
      localStorage.setItem('math_school_offline_mode', JSON.stringify({
        isOffline,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.warn('Failed to save offline mode status:', error);
    }
  }

  getOfflineMode(): boolean {
    try {
      const stored = localStorage.getItem('math_school_offline_mode');
      if (stored) {
        const data = JSON.parse(stored);
        return data.isOffline || false;
      }
    } catch (error) {
      console.warn('Failed to load offline mode status:', error);
    }
    return false;
  }

  // Clear all stored data
  clearAllData(): void {
    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      localStorage.removeItem('math_school_offline_mode');
    } catch (error) {
      console.warn('Failed to clear stored data:', error);
    }
  }

  // Get storage usage info
  getStorageInfo(): { used: number, available: number, percentage: number } {
    try {
      let used = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }
      
      // Estimate available storage (5MB typical limit)
      const available = 5 * 1024 * 1024; // 5MB in bytes
      const percentage = (used / available) * 100;
      
      return { used, available, percentage };
    } catch (error) {
      console.warn('Failed to get storage info:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}

export const storageService = new StorageService();