import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Shield, Users } from 'lucide-react';
import { Role } from '../../types/auth';
import { roleService } from '../../lib/roleService';
import { mockUsers } from '../../lib/mockData';
import { useAuth } from '../../hooks/useAuth';
import { RoleModal } from './RoleModal';

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const { hasPermission } = useAuth();
  const canCreate = hasPermission('roles.create');
  const canUpdate = hasPermission('roles.update');
  const canDelete = hasPermission('roles.delete');

  // Check if we should auto-open the create role modal
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#roles' && canCreate) {
      // Small delay to ensure component is mounted
      setTimeout(() => {
        handleCreateRole();
        // Clear the hash
        window.location.hash = '';
      }, 100);
    }
  }, [canCreate]);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const rolesData = await roleService.getRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Failed to load roles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleCreateRole = () => {
    setSelectedRole(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteRole = async (role: Role) => {
    if (!canDelete) return;
    
    if (confirm(`Are you sure you want to delete the ${role.displayName} role?`)) {
      try {
        await roleService.deleteRole(role.id);
        loadRoles();
      } catch (error) {
        console.error('Failed to delete role:', error);
        alert(error instanceof Error ? error.message : 'Failed to delete role');
      }
    }
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    loadRoles();
  };

  const getUserCountForRole = (roleId: string) => {
    return mockUsers.filter(user => user.role.id === roleId).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Role Management</h2>
            <p className="text-purple-100 text-lg">Manage roles and their permissions</p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{roles.length}</div>
              <p className="text-sm text-purple-200">Active Roles</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Role Directory</h3>
          <p className="text-gray-600 mt-1">Configure roles and permission assignments</p>
        </div>
        {canCreate && (
          <button
            onClick={handleCreateRole}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Role
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${role.color}20` }}
                >
                  <Shield 
                    className="w-6 h-6"
                    style={{ color: role.color }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{role.displayName}</h3>
                  <p className="text-sm text-gray-500">{role.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {canUpdate && (
                  <button
                    onClick={() => handleEditRole(role)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                {canDelete && role.name !== 'admin' && (
                  <button
                    onClick={() => handleDeleteRole(role)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">{role.description}</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Permissions</span>
                <span className="text-sm text-gray-500">{role.permissions.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Users</span>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{getUserCountForRole(role.id)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map((permission) => (
                    <span
                      key={permission.id}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {permission.displayName}
                    </span>
                  ))}
                  {role.permissions.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      +{role.permissions.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Role Modal */}
      {isModalOpen && (
        <RoleModal
          role={selectedRole}
          mode={modalMode}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}