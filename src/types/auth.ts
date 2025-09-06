export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: 'active' | 'inactive';
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: Permission[];
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  displayName: string;
  description: string;
  resource: string;
  action: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  password: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roleId?: string;
  status?: 'active' | 'inactive';
}

export interface CreateRoleData {
  name: string;
  displayName: string;
  description: string;
  permissionIds: string[];
  color: string;
}

export interface UpdateRoleData {
  displayName?: string;
  description?: string;
  permissionIds?: string[];
  color?: string;
}