import { User, Role, Permission } from '../types/auth';

export const mockPermissions: Permission[] = [
  {
    id: '1',
    name: 'users.read',
    displayName: 'View Users',
    description: 'Can view user accounts and their details',
    resource: 'users',
    action: 'read'
  },
  {
    id: '2',
    name: 'users.create',
    displayName: 'Create Users',
    description: 'Can create new user accounts',
    resource: 'users',
    action: 'create'
  },
  {
    id: '3',
    name: 'users.update',
    displayName: 'Update Users',
    description: 'Can modify existing user accounts',
    resource: 'users',
    action: 'update'
  },
  {
    id: '4',
    name: 'users.delete',
    displayName: 'Delete Users',
    description: 'Can delete user accounts',
    resource: 'users',
    action: 'delete'
  },
  {
    id: '5',
    name: 'roles.read',
    displayName: 'View Roles',
    description: 'Can view roles and permissions',
    resource: 'roles',
    action: 'read'
  },
  {
    id: '6',
    name: 'roles.create',
    displayName: 'Create Roles',
    description: 'Can create new roles',
    resource: 'roles',
    action: 'create'
  },
  {
    id: '7',
    name: 'roles.update',
    displayName: 'Update Roles',
    description: 'Can modify existing roles',
    resource: 'roles',
    action: 'update'
  },
  {
    id: '8',
    name: 'roles.delete',
    displayName: 'Delete Roles',
    description: 'Can delete roles',
    resource: 'roles',
    action: 'delete'
  },
  {
    id: '9',
    name: 'dashboard.admin',
    displayName: 'Admin Dashboard',
    description: 'Can access admin dashboard',
    resource: 'dashboard',
    action: 'admin'
  },
  {
    id: '10',
    name: 'reports.read',
    displayName: 'View Reports',
    description: 'Can view system reports',
    resource: 'reports',
    action: 'read'
  },
  {
    id: '11',
    name: 'students.read',
    displayName: 'View Students',
    description: 'Can view student records and performance',
    resource: 'students',
    action: 'read'
  },
  {
    id: '12',
    name: 'students.manage',
    displayName: 'Manage Students',
    description: 'Can manage student registrations and records',
    resource: 'students',
    action: 'manage'
  },
  {
    id: '13',
    name: 'classes.manage',
    displayName: 'Manage Classes',
    description: 'Can manage class schedules and assignments',
    resource: 'classes',
    action: 'manage'
  },
  {
    id: '14',
    name: 'school.overview',
    displayName: 'School Overview',
    description: 'Can view school-wide statistics and reports',
    resource: 'school',
    action: 'overview'
  },
  {
    id: '15',
    name: 'school.manage',
    displayName: 'School Management',
    description: 'Can manage school registration and settings',
    resource: 'school',
    action: 'manage'
  }
];

export const mockRoles: Role[] = [
  {
    id: '1',
    name: 'student',
    displayName: 'Student',
    description: 'Student access to learning materials and assignments',
    permissions: [
      mockPermissions.find(p => p.name === 'students.read')!
    ].filter(Boolean),
    color: '#2563eb',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'teacher',
    displayName: 'Teacher',
    description: 'Teacher access to manage classes and student records',
    permissions: [
      mockPermissions.find(p => p.name === 'students.read')!,
      mockPermissions.find(p => p.name === 'students.manage')!,
      mockPermissions.find(p => p.name === 'classes.manage')!,
      mockPermissions.find(p => p.name === 'reports.read')!
    ].filter(Boolean),
    color: '#059669',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'principal',
    displayName: 'Principal',
    description: 'Principal access to school oversight and management',
    permissions: [
      mockPermissions.find(p => p.name === 'students.read')!,
      mockPermissions.find(p => p.name === 'students.manage')!,
      mockPermissions.find(p => p.name === 'classes.manage')!,
      mockPermissions.find(p => p.name === 'school.overview')!,
      mockPermissions.find(p => p.name === 'school.manage')!,
      mockPermissions.find(p => p.name === 'reports.read')!,
      mockPermissions.find(p => p.name === 'users.read')!
    ].filter(Boolean),
    color: '#7c3aed',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'admin',
    displayName: 'Admin',
    description: 'Full system access with all permissions',
    permissions: mockPermissions,
    color: '#dc2626',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'student',
    email: 'student@demo.com',
    firstName: 'Emma',
    lastName: 'Johnson',
    role: mockRoles[0], // student role
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    username: 'teacher',
    email: 'teacher@demo.com',
    firstName: 'Sarah',
    lastName: 'Mathematics',
    role: mockRoles[1], // teacher role
    status: 'active',
    lastLogin: '2024-01-14T15:45:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-14T15:45:00Z',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    username: 'principal',
    email: 'principal@demo.com',
    firstName: 'John',
    lastName: 'Anderson',
    role: mockRoles[2], // principal role
    status: 'active',
    lastLogin: '2024-01-13T09:15:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '4',
    username: 'admin',
    email: 'admin@demo.com',
    firstName: 'Michael',
    lastName: 'Wilson',
    role: mockRoles[3], // admin role
    status: 'active',
    lastLogin: '2024-01-16T08:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-16T08:00:00Z',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

export const allMockUsers = [...mockUsers];

export const demoCredentials = [
  {
    username: 'student',
    password: 'student123',
    role: 'Student',
    description: 'Student access to learning materials, assignments, and progress tracking',
    color: '#2563eb'
  },
  {
    username: 'teacher',
    password: 'teacher123',
    role: 'Teacher',
    description: 'Teacher access to manage classes, student records, and registrations',
    color: '#059669'
  },
  {
    username: 'principal',
    password: 'principal123',
    role: 'Principal',
    description: 'Principal access to school oversight, reports, and management functions',
    color: '#7c3aed'
  },
  {
    username: 'admin',
    password: 'admin123',
    role: 'Admin',
    description: 'Full system access - can manage users, roles, and all system features',
    color: '#dc2626'
  }
];