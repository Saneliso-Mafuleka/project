import { useState, useEffect } from 'react';
import { User } from '../types/auth';
import { authService } from '../lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.subscribe(setUser);
    return unsubscribe;
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.login({ username, password });
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (permission: string) => {
    return authService.hasPermission(permission);
  };

  const hasAnyPermission = (permissions: string[]) => {
    return authService.hasAnyPermission(permissions);
  };

  return {
    user,
    isAuthenticated: authService.isAuthenticated(),
    isLoading,
    login,
    logout,
    hasPermission,
    hasAnyPermission
  };
}