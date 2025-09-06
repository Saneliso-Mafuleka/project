import React from 'react';
import { User, UserCheck, Bell, Settings, LogOut } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import { useAuth } from '../../hooks/useAuth';

export function StudentHeader() {
  const { student, userMode, switchMode } = useStudent();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    console.log('🔍 DEBUG: Student dashboard sign-out initiated');
    
    if (confirm('Are you sure you want to sign out?')) {
      try {
        console.log('🔍 DEBUG: User confirmed sign-out');
        await logout();
        
      } catch (error) {
        console.error('🚨 ERROR: Sign-out failed', error);
        // Force logout even if error occurs
        await logout();
      }
    } else {
      console.log('🔍 DEBUG: User cancelled sign-out');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {userMode === 'student' ? 'Student Dashboard' : 'Parent Dashboard'}
              </h1>
              <p className="text-xs text-gray-500">
                {userMode === 'student' ? `Welcome, ${student.name}` : `Monitoring ${student.name}`}
              </p>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Mode Switch */}
            <button
              onClick={switchMode}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${userMode === 'student' 
                  ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
                }
              `}
            >
              {userMode === 'student' ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  Switch to Parent View
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  Switch to Student View
                </>
              )}
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* Sign Out */}
            <button 
              onClick={handleSignOut}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <img
                src={student.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
                alt={student.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {userMode === 'student' ? student.name : student.parentName}
                </p>
                <p className="text-xs text-gray-500">
                  {userMode === 'student' ? `${student.grade} • ${student.class}` : 'Parent Account'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}