import React, { useState, useEffect } from 'react';
import { X, Shield, Save } from 'lucide-react';
import { Role, CreateRoleData, UpdateRoleData, Permission } from '../../types/auth';
import { roleService } from '../../lib/roleService';

interface RoleModalProps {
  role: Role | null;
  mode: 'create' | 'edit';
  onClose: () => void;
  onSuccess: () => void;
}

const roleColors = [
  '#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d',
  '#16a34a', '#059669', '#0891b2', '#0284c7', '#2563eb',
  '#4f46e5', '#7c3aed', '#9333ea', '#c026d3', '#db2777'
];

export function RoleModal({ role, mode, onClose, onSuccess }: RoleModalProps) {
  const [formData, setFormData] = useState({
    displayName: '',
    description: '',
    color: '#2563eb',
    permissionIds: [] as string[]
  });
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPermissions();
    
    if (role && mode === 'edit') {
      setFormData({
        displayName: role.displayName,
        description: role.description,
        color: role.color,
        permissionIds: role.permissions.map(p => p.id)
      });
    }
  }, [role, mode]);

  const loadPermissions = async () => {
    try {
      const permissionsData = await roleService.getPermissions();
      setPermissions(permissionsData);
    } catch (error) {
      console.error('Failed to load permissions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'create') {
        const createData: CreateRoleData = {
          name: formData.displayName.toLowerCase().replace(/\s+/g, '_'),
          displayName: formData.displayName,
          description: formData.description,
          color: formData.color,
          permissionIds: formData.permissionIds
        };
        await roleService.createRole(createData);
      } else {
        const updateData: UpdateRoleData = {
          displayName: formData.displayName,
          description: formData.description,
          color: formData.color,
          permissionIds: formData.permissionIds
        };
        await roleService.updateRole(role!.id, updateData);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter(id => id !== permissionId)
        : [...prev.permissionIds, permissionId]
    }));
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'create' ? 'Create Role' : 'Edit Role'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role Name
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Content Manager"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Describe what this role can do..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {roleColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`
                    w-8 h-8 rounded-full border-2 transition-all
                    ${formData.color === color 
                      ? 'border-gray-400 scale-110' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Permissions
            </label>
            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
                <div key={resource} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 capitalize">
                    {resource} Permissions
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {resourcePermissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-start gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissionIds.includes(permission.id)}
                          onChange={() => handlePermissionToggle(permission.id)}
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {permission.displayName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {permission.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? 'Saving...' : (mode === 'create' ? 'Create Role' : 'Update Role')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}