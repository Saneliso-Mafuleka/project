import React from 'react';
import { 
  Users, 
  Shield, 
  BarChart3, 
  Settings, 
  LogOut,
  User,
  Home,
  Building,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ activeTab, onTabChange, isCollapsed, onToggleCollapse }: SidebarProps) {
  const { user, logout, hasPermission } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      permission: null
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      permission: 'users.read',
      roles: ['admin']
    },
    {
      id: 'roles',
      label: 'Role Management',
      icon: Shield,
      permission: 'roles.read',
      roles: ['admin']
    },
    {
      id: 'student-registrations',
      label: 'Student Registrations',
      icon: User,
      permission: 'students.manage',
      roles: ['admin', 'principal']
    },
    {
      id: 'school-management',
      label: 'School Management',
      icon: Building,
      permission: 'school.manage',
      roles: ['principal']
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      permission: 'reports.read',
      roles: ['admin', 'principal', 'teacher']
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      permission: 'dashboard.admin',
      roles: ['admin']
    }
  ];

  const visibleItems = menuItems.filter(item => {
    // Check role-based access first
    if (item.roles && !item.roles.includes(user?.role?.name || '')) {
      return false;
    }
    // Then check permission
    return !item.permission || hasPermission(item.permission);
  }
  );

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col h-full fixed left-0 top-16 bottom-0 z-20 transition-all duration-300 ease-in-out`}>
      {/* Toggle Button */}
      <div className="absolute -right-3 top-4 z-30">
        <button
          onClick={onToggleCollapse}
          className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
        >
          {isCollapsed ? (
            <Menu className="w-3 h-3 text-gray-600" />
          ) : (
            <X className="w-3 h-3 text-gray-600" />
          )}
        </button>
      </div>

      <div className={`${isCollapsed ? 'p-3' : 'p-6'} border-b border-gray-200 transition-all duration-300`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="transition-opacity duration-300">
              <h1 className="text-lg font-bold text-gray-900">
                {user?.role?.name === 'principal' ? 'School Panel' : 'Admin Panel'}
              </h1>
              <p className="text-xs text-gray-500">
                {user?.role?.name === 'principal' ? 'School Management' : 'System Management'}
              </p>
            </div>
          )}
        </div>
      </div>

      <nav className={`flex-1 ${isCollapsed ? 'p-2' : 'p-4'} transition-all duration-300`}>
        {!isCollapsed && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Navigation
            </p>
          </div>
        )}
        <ul className="space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`
                    w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3'} py-2 rounded-lg text-left transition-all duration-200 group relative
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  </div>
                  {!isCollapsed && isActive && (
                    <ChevronRight className="w-4 h-4 text-blue-500" />
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-t border-gray-200 transition-all duration-300`}>
        <button
          onClick={logout}
          title={isCollapsed ? "Sign Out" : undefined}
          disabled={false}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors group mt-4 relative`}
        >
          <LogOut className="w-5 h-5 group-hover:text-red-600" />
          {!isCollapsed && <span className="font-medium">Sign Out</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Sign Out
            </div>
          )}
        </button>
      </div>
    </div>
  );
}