import React, { useState } from 'react';
import { useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { Sidebar } from './layout/Sidebar';
import { Overview } from './dashboard/Overview';
import { UserManagement } from './users/UserManagement';
import { RoleManagement } from './roles/RoleManagement';
import { StudentRegistrationManagement } from './admin/StudentRegistrationManagement';
import { SystemSettings } from './admin/SystemSettings';
import { ReportsOverview } from './reports/ReportsOverview';
import { SchoolManagement } from './school/SchoolManagement';
import { useAuth } from '../hooks/useAuth';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { hasPermission, user, logout } = useAuth();

  // Handle hash-based navigation for quick actions
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['users', 'roles', 'reports', 'student-registrations', 'school-management'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      try {
        await logout();
      } catch (error) {
        console.error('Sign out failed:', error);
        await logout(); // Force logout even if error occurs
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Overview />;
      case 'users':
        return hasPermission('users.read') ? <UserManagement /> : <AccessDenied />;
      case 'roles':
        return hasPermission('roles.read') ? <RoleManagement /> : <AccessDenied />;
      case 'student-registrations':
        return hasPermission('students.manage') ? <StudentRegistrationManagement /> : <AccessDenied />;
      case 'school-management':
        return hasPermission('school.manage') ? <SchoolManagement /> : <AccessDenied />;
      case 'reports':
        return hasPermission('reports.read') ? <ReportsOverview /> : <AccessDenied />;
      case 'settings':
        return hasPermission('dashboard.admin') ? <SystemSettings /> : <AccessDenied />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Header Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 h-16">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">
              {user?.role?.name === 'principal' ? 'School Management System' : 'Admin Panel'}
            </h1>
            <span className="text-sm text-gray-500">
              Welcome, {user?.firstName} {user?.lastName}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src={user?.avatar || `https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop`}
                alt={user?.firstName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.role?.displayName}</p>
              </div>
            </div>
            
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />
      <main className={`flex-1 overflow-y-auto pt-16 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">You don't have permission to access this section.</p>
      </div>
    </div>
  );
}


function SettingsPlaceholder() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">System Settings</h3>
        <p className="text-gray-600">System configuration options will be available here.</p>
      </div>
    </div>
  );
}