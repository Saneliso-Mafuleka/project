import React from 'react';
import { StudentProvider } from '../../context/StudentContext';
import { StudentHeader } from './StudentHeader';
import { StudentDashboard } from './StudentDashboard';
import { ParentDashboard } from './ParentDashboard';
import { useStudent } from '../../context/StudentContext';

function StudentAppContent() {
  const { userMode } = useStudent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <StudentHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userMode === 'student' ? <StudentDashboard /> : <ParentDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>© 2025 LearnHub - Student & Parent Portal</p>
            <p className="mt-1 text-xs text-gray-500">
              Empowering education through technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function StudentApp() {
  return (
    <StudentProvider>
      <StudentAppContent />
    </StudentProvider>
  );
}