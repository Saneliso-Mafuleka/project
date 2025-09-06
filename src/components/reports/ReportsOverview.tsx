import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  PieChart,
  Activity,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';
import { mathSchoolService } from '../../lib/mathSchoolService';
import { useConnectionStatus } from '../../hooks/useConnectionStatus';

interface ReportData {
  totalStudents: number;
  pendingRequests: number;
  approvalRate: number;
  averageTestScore: number;
  gradeDistribution: { grade: number; count: number }[];
  monthlyRegistrations: { month: string; count: number }[];
  topPerformers: { name: string; score: number; grade: number }[];
  recentActivity: { action: string; student: string; date: string; type: 'approved' | 'rejected' }[];
}

export function ReportsOverview() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('30');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const { isOnline } = useConnectionStatus();

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      // Simulate API call for report data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const stats = await mathSchoolService.getStatistics();
      const students = await mathSchoolService.getRegisteredStudents();
      
      // Generate mock report data based on actual data
      const mockReportData: ReportData = {
        totalStudents: stats.totalStudents,
        pendingRequests: stats.pendingRequests,
        approvalRate: 87.5,
        averageTestScore: stats.averageTestScore,
        gradeDistribution: [
          { grade: 6, count: 2 },
          { grade: 7, count: 2 },
          { grade: 8, count: 3 },
          { grade: 9, count: 2 },
          { grade: 10, count: 2 },
          { grade: 11, count: 2 },
          { grade: 12, count: 2 }
        ],
        monthlyRegistrations: [
          { month: 'Aug', count: 8 },
          { month: 'Sep', count: 5 },
          { month: 'Oct', count: 2 },
          { month: 'Nov', count: 0 },
          { month: 'Dec', count: 0 },
          { month: 'Jan', count: stats.pendingRequests }
        ],
        topPerformers: students
          .filter(s => s.placementTestScore && s.placementTestScore >= 90)
          .sort((a, b) => (b.placementTestScore || 0) - (a.placementTestScore || 0))
          .slice(0, 5)
          .map(s => ({
            name: s.fullName,
            score: s.placementTestScore || 0,
            grade: s.gradeLevel
          })),
        recentActivity: [
          { action: 'Registration Approved', student: 'Emma Johnson', date: '2025-01-15', type: 'approved' },
          { action: 'Registration Approved', student: 'Michael Chen', date: '2025-01-14', type: 'approved' },
          { action: 'Registration Rejected', student: 'Test Student', date: '2025-01-13', type: 'rejected' },
          { action: 'Registration Approved', student: 'Sophia Rodriguez', date: '2025-01-12', type: 'approved' },
          { action: 'Registration Approved', student: 'James Wilson', date: '2025-01-11', type: 'approved' }
        ]
      };
      
      setReportData(mockReportData);
    } catch (error) {
      console.error('Failed to load report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadReportData();
    setRefreshing(false);
  };

  const exportReport = () => {
    if (!reportData) return;
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `math-school-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Report Data</h3>
        <p className="text-gray-600">Unable to load report data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Reports & Analytics</h2>
            <p className="text-purple-100 text-lg">Comprehensive insights into student registrations and performance</p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{reportData.approvalRate}%</div>
              <p className="text-sm text-purple-200">Approval Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h3>
          <p className="text-gray-600 mt-1">Detailed performance metrics and trends</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing || !isOnline}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={exportReport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{reportData.totalStudents}</p>
              <p className="text-sm text-gray-600">Total Students</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{reportData.approvalRate}%</p>
              <p className="text-sm text-gray-600">Approval Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{reportData.averageTestScore}</p>
              <p className="text-sm text-gray-600">Avg Test Score</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{reportData.pendingRequests}</p>
              <p className="text-sm text-gray-600">Pending Requests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Grade Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Student Distribution by Grade</h3>
          <div className="space-y-4">
            {reportData.gradeDistribution.map((item) => (
              <div key={item.grade} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Grade {item.grade}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(item.count / Math.max(...reportData.gradeDistribution.map(g => g.count))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Registrations */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Registration Trend</h3>
          <div className="space-y-4">
            {reportData.monthlyRegistrations.map((item) => (
              <div key={item.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.month} 2024</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(item.count / Math.max(...reportData.monthlyRegistrations.map(m => m.count))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performers */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performers</h3>
          <div className="space-y-4">
            {reportData.topPerformers.map((performer, index) => (
              <div key={performer.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                      index === 1 ? 'bg-gray-100 text-gray-800' : 
                      index === 2 ? 'bg-orange-100 text-orange-800' : 
                      'bg-blue-100 text-blue-800'}
                  `}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{performer.name}</p>
                    <p className="text-sm text-gray-500">Grade {performer.grade}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{performer.score}%</p>
                  <p className="text-xs text-gray-500">Test Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {reportData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`
                  p-2 rounded-lg
                  ${activity.type === 'approved' ? 'bg-green-100' : 'bg-red-100'}
                `}>
                  {activity.type === 'approved' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Activity className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.student}</p>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(activity.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}