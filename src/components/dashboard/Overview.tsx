import React from 'react';
import { Users, Shield, Activity, TrendingUp, BarChart3, Calendar, Award, CheckCircle, MessageCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { mockUsers, mockRoles } from '../../lib/mockData';

export function Overview() {
  const { user } = useAuth();

  // Enhanced statistics with more metrics
  const stats = [
    {
      label: 'Total Users',
      value: mockUsers.length,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up'
    },
    {
      label: 'Active Roles',
      value: mockRoles.length,
      icon: Shield,
      color: 'bg-green-500',
      change: '+5%',
      trend: 'up'
    },
    {
      label: 'Active Users',
      value: mockUsers.filter(u => u.status === 'active').length,
      icon: Activity,
      color: 'bg-purple-500',
      change: '+8%',
      trend: 'up'
    },
    {
      label: 'System Health',
      value: '98%',
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+2%',
      trend: 'up'
    }
  ];

  const recentUsers = mockUsers.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName}!</h2>
            <p className="text-blue-100 text-lg">Here's what's happening with your system today</p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">98%</div>
              <p className="text-sm text-blue-200">System Health</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Analytics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">156</p>
            <p className="text-sm text-gray-600">Total Actions This Month</p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-3">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">24</p>
            <p className="text-sm text-gray-600">Days Since Last Issue</p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-3">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">94%</p>
            <p className="text-sm text-gray-600">User Satisfaction</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <img
                  src={user.avatar || `https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop`}
                  alt={user.firstName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="text-right">
                  <span 
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: `${user.role.color}20`,
                      color: user.role.color 
                    }}
                  >
                    {user.role.displayName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Roles</h3>
          <div className="space-y-4">
            {mockRoles.map((role) => (
              <div key={role.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: role.color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{role.displayName}</p>
                    <p className="text-xs text-gray-500">{role.permissions.length} permissions</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {mockUsers.filter(u => u.role.id === role.id).length} users
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">New user account created</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Role permissions updated</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
            <MessageCircle className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">System maintenance completed</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
        <p className="text-blue-100 mb-4">Manage your system efficiently with these shortcuts</p>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => window.location.hash = '#users'}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
          >
            Add New User
          </button>
          <button 
            onClick={() => window.location.hash = '#roles'}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
          >
            Create Role
          </button>
          <button 
            onClick={() => window.location.hash = '#reports'}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
          >
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
}