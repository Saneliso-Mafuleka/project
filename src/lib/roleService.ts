import { Role, CreateRoleData, UpdateRoleData } from '../types/auth';
import { mockRoles, mockPermissions } from './mockData';

class RoleService {
  private roles: Role[] = [...mockRoles];

  async getRoles(): Promise<Role[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.roles];
  }

  async getRoleById(id: string): Promise<Role | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.roles.find(role => role.id === id) || null;
  }

  async createRole(roleData: CreateRoleData): Promise<Role> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const permissions = mockPermissions.filter(p => 
      roleData.permissionIds.includes(p.id)
    );

    const newRole: Role = {
      id: (this.roles.length + 1).toString(),
      name: roleData.name.toLowerCase().replace(/\s+/g, '_'),
      displayName: roleData.displayName,
      description: roleData.description,
      permissions,
      color: roleData.color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.roles.push(newRole);
    return newRole;
  }

  async updateRole(id: string, roleData: UpdateRoleData): Promise<Role> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const roleIndex = this.roles.findIndex(role => role.id === id);
    if (roleIndex === -1) {
      throw new Error('Role not found');
    }

    const role = this.roles[roleIndex];
    const updatedRole: Role = {
      ...role,
      ...roleData,
      updatedAt: new Date().toISOString()
    };

    if (roleData.permissionIds) {
      updatedRole.permissions = mockPermissions.filter(p => 
        roleData.permissionIds!.includes(p.id)
      );
    }

    this.roles[roleIndex] = updatedRole;
    return updatedRole;
  }

  async deleteRole(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const roleIndex = this.roles.findIndex(role => role.id === id);
    if (roleIndex === -1) {
      throw new Error('Role not found');
    }

    // Check if role is in use
    const isInUse = this.roles[roleIndex].name === 'admin'; // Prevent deleting admin role
    if (isInUse) {
      throw new Error('Cannot delete role that is currently in use');
    }

    this.roles.splice(roleIndex, 1);
  }

  async getPermissions() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockPermissions];
  }
}

export const roleService = new RoleService();