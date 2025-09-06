import { User, CreateUserData, UpdateUserData } from '../types/auth';
import { mockUsers, mockRoles } from './mockData';

class UserService {
  private users: User[] = [...mockUsers];

  async getUsers(page = 1, limit = 10, search = '', roleFilter = '', statusFilter = ''): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredUsers = [...this.users];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower)
      );
    }

    // Apply role filter
    if (roleFilter) {
      filteredUsers = filteredUsers.filter(user => user.role.name === roleFilter);
    }

    // Apply status filter
    if (statusFilter) {
      filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
    }

    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      users: paginatedUsers,
      total,
      page,
      totalPages
    };
  }

  async getUserById(id: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.users.find(user => user.id === id) || null;
  }

  async createUser(userData: CreateUserData): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const role = mockRoles.find(r => r.id === userData.roleId);
    if (!role) {
      throw new Error('Invalid role ID');
    }

    const newUser: User = {
      id: (this.users.length + 1).toString(),
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role,
      status: 'active',
      lastLogin: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = this.users[userIndex];
    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date().toISOString()
    };

    if (userData.roleId) {
      const role = mockRoles.find(r => r.id === userData.roleId);
      if (!role) {
        throw new Error('Invalid role ID');
      }
      updatedUser.role = role;
    }

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users.splice(userIndex, 1);
  }
}

export const userService = new UserService();