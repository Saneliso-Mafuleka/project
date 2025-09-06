import { User, LoginCredentials, AuthState } from '../types/auth';
import { allMockUsers } from './mockData';

class AuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    // Check for existing session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string; user?: User }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = allMockUsers.find(u => u.username === credentials.username);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Simple password validation (in real app, this would be hashed)
    const validPasswords: Record<string, string> = {
      'student': 'student123',
      'teacher': 'teacher123',
      'principal': 'principal123',
      'admin': 'admin123',
    };

    if (validPasswords[credentials.username] !== credentials.password) {
      return { success: false, error: 'Invalid password' };
    }

    if (user.status === 'inactive') {
      return { success: false, error: 'Account is inactive' };
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.notifyListeners();

    return { success: true, user };
  }

  async logout(): Promise<void> {
    console.log('🔍 DEBUG: Logout initiated');
    
    try {
      // Clear stored user data
      console.log('🔍 DEBUG: Clearing localStorage');
      localStorage.removeItem('currentUser');
      
      // Clear any other auth-related storage
      const authKeys = ['token', 'refreshToken', 'sessionId'];
      authKeys.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      // Clear cookies if any
      this.clearAuthCookies();
      
      // Update state
      console.log('🔍 DEBUG: Updating auth state');
      this.currentUser = null;
      this.notifyListeners();
      
      console.log('🔍 DEBUG: Logout completed successfully');
    } catch (error) {
      console.error('🚨 ERROR: Logout failed', error);
      // Force clear even if error occurs
      localStorage.clear();
      sessionStorage.clear();
      this.currentUser = null;
      this.notifyListeners();
    }
  }

  private clearAuthCookies(): void {
    // Clear authentication cookies
    const cookiesToClear = ['authToken', 'sessionId', 'refreshToken'];
    
    cookiesToClear.forEach(cookieName => {
      // Clear for current path
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      
      // Clear for current domain
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    });
  }


  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  hasPermission(permission: string): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.role.permissions.some(p => p.name === permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    if (!this.currentUser) return false;
    return permissions.some(permission => this.hasPermission(permission));
  }

  subscribe(listener: (user: User | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentUser));
  }
}

export const authService = new AuthService();