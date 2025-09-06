import React from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/auth/LoginForm';
import { AdminPanel } from './components/AdminPanel';
import { StudentApp } from './components/student/StudentApp';
import { TeacherDashboard } from './components/math/TeacherDashboard';
import { ConnectionIndicator } from './components/common/ConnectionIndicator';

import { PublicLearningPage } from './components/public/PublicLearningPage';

function App() {
  const { isAuthenticated, user } = useAuth();
  
  // Check if user wants to access public learning content
  const isPublicLearningRoute = window.location.pathname === '/public-learning' || 
                                window.location.hash === '#public-learning';
  
  if (isPublicLearningRoute && !isAuthenticated) {
    return <PublicLearningPage />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <ConnectionIndicator />
        <LoginForm onSuccess={() => {}} />
      </>
    );
  }

  // Check if this is a teacher
  if (user?.role?.name === 'teacher') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <ConnectionIndicator />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TeacherDashboard />
        </div>
      </div>
    );
  }

  // Route based on user role or default to student app
  if (user?.role?.name === 'admin') {
    return (
      <>
        <ConnectionIndicator />
        <AdminPanel />
      </>
    );
  }

  if (user?.role?.name === 'principal') {
    return (
      <>
        <ConnectionIndicator />
        <AdminPanel />
      </>
    );
  }

  return (
    <>
      <ConnectionIndicator />
      <StudentApp />
    </>
  );
}

export default App;