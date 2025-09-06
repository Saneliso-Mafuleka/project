import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Award, 
  BarChart3, 
  Calendar,
  Target,
  ArrowUp,
  ArrowDown,
  Minus,
  Star,
  BookOpen,
  Clock,
  CheckCircle
} from 'lucide-react';
import { School, TeacherAccount, SchoolPerformanceAnalytics } from '../../types/school';

interface PerformanceMonitoringDashboardProps {
  analytics: SchoolPerformanceAnalytics;
  school: School;
  teachers: TeacherAccount[];
}

export function PerformanceMonitoringDashboard({ analytics, school, teachers }: PerformanceMonitoringDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('current');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Monitoring Dashboard</h2>
          <p className="text-gray-600 mt-1">Comprehensive analytics for {school.name}</p>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {analytics.kpis.map((kpi) => (
          <div key={kpi.id} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${
                kpi.category === 'academic' ? 'bg-blue-100' :
                kpi.category === 'staff' ? 'bg-green-100' :
                kpi.category === 'operational' ? 'bg-purple-100' :
                'bg-orange-100'
              }`}>
                {kpi.category === 'academic' && <Award className="w-5 h-5 text-blue-600" />}
                {kpi.category === 'staff' && <Users className="w-5 h-5 text-green-600" />}
                {kpi.category === 'operational' && <BarChart3 className="w-5 h-5 text-purple-600" />}
                {kpi.category === 'financial' && <Target className="w-5 h-5 text-orange-600" />}
              </div>
              {getTrendIcon(kpi.trend)}
            </div>
            
            <div className="mb-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {kpi.value}{kpi.unit}
                </span>
                <span className="text-sm text-gray-500">
                  / {kpi.target}{kpi.unit}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-700">{kpi.name}</p>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full ${
                  kpi.value >= kpi.target ? 'bg-green-500' : 
                  kpi.value >= kpi.target * 0.8 ? 'bg-blue-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
              />
            </div>
            
            <p className="text-xs text-gray-600">{kpi.description}</p>
          </div>
        ))}
      </div>

      {/* Academic Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Grade-wise Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Grade-wise Performance</h3>
          <div className="space-y-4">
            {analytics.academic.gradeWisePerformance.map((grade) => (
              <div key={grade.grade} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{grade.grade}</h4>
                    <p className="text-sm text-gray-500">{grade.totalStudents} students</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{grade.passRate}%</p>
                    <p className="text-sm text-gray-500">Pass Rate</p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${grade.passRate}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-gray-600">Avg Score: </span>
                    <span className="font-medium text-gray-900">{grade.averageScore}%</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Top: {grade.topSubjects[0]}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                      Challenge: {grade.challengingSubjects[0]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Subject Performance</h3>
          <div className="space-y-4">
            {analytics.academic.subjectWisePerformance.map((subject) => (
              <div key={subject.subject} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{subject.subject}</h4>
                    <p className="text-sm text-gray-500">
                      {subject.teacherCount} teachers • {subject.studentCount} students
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-gray-900">{subject.averageScore}%</span>
                    {getTrendIcon(subject.trend)}
                  </div>
                  <p className="text-sm text-gray-500">{subject.passRate}% pass rate</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Teacher Performance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Teacher Performance Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics.teacher.averagePerformanceScore}%</p>
            <p className="text-sm text-gray-600">Average Performance</p>
          </div>
          
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-3">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics.teacher.professionalDevelopmentStats.averageTrainingHours}</p>
            <p className="text-sm text-gray-600">Avg Training Hours</p>
          </div>
          
          <div className="text-center">
            <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-3">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics.teacher.professionalDevelopmentStats.certificationsEarned}</p>
            <p className="text-sm text-gray-600">Certifications Earned</p>
          </div>
          
          <div className="text-center">
            <div className="p-3 bg-orange-100 rounded-lg w-fit mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics.teacher.professionalDevelopmentStats.workshopsCompleted}</p>
            <p className="text-sm text-gray-600">Workshops Completed</p>
          </div>
        </div>

        {/* Performance Distribution */}
        <div className="mb-8">
          <h4 className="font-semibold text-gray-900 mb-4">Performance Distribution</h4>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(analytics.teacher.performanceDistribution).map(([level, count]) => (
              <div key={level} className="text-center">
                <div className={`p-4 rounded-lg mb-2 ${
                  level === 'excellent' ? 'bg-green-100' :
                  level === 'good' ? 'bg-blue-100' :
                  level === 'satisfactory' ? 'bg-yellow-100' :
                  level === 'needsImprovement' ? 'bg-orange-100' :
                  'bg-red-100'
                }`}>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                <p className="text-sm text-gray-600 capitalize">
                  {level.replace(/([A-Z])/g, ' $1').trim()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Top Performing Teachers</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.teacher.topPerformers.map((teacher, index) => (
              <div key={teacher.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                      index === 1 ? 'bg-gray-100 text-gray-800' : 
                      'bg-orange-100 text-orange-800'}
                  `}>
                    {index + 1}
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">{teacher.name}</h5>
                    <p className="text-sm text-gray-500">{teacher.grade} • {teacher.subject}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{teacher.performanceScore}%</p>
                    <p className="text-sm text-gray-500">Performance Score</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{teacher.yearsExperience} years</p>
                    <p className="text-xs text-gray-500">Experience</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Year-over-Year Trends */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-end mb-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="current">Current Year</option>
            <option value="previous">Previous Year</option>
            <option value="comparison">Year Comparison</option>
          </select>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Year-over-Year Trends</h3>
        <div className="space-y-4">
          {(() => {
            let trends = analytics.academic.yearOverYearTrends;
            if (selectedTimeframe === 'current') {
              const yearNumbers = trends.map(t => parseInt(t.year));
              const currentYear = Math.max(...yearNumbers);
              trends = trends.filter(t => parseInt(t.year) === currentYear);
            } else if (selectedTimeframe === 'previous') {
              const yearNumbers = trends.map(t => parseInt(t.year));
              const currentYear = Math.max(...yearNumbers);
              const previousYear = Math.max(...yearNumbers.filter(y => y !== currentYear));
              trends = trends.filter(t => parseInt(t.year) === previousYear);
            }
            // 'comparison' shows all years
            return trends.map((trend) => (
              <div key={trend.year} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">{trend.year}</h4>
                </div>
                <div className="grid grid-cols-4 gap-8 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{trend.passRate}%</p>
                    <p className="text-xs text-gray-500">Pass Rate</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{trend.averageScore}%</p>
                    <p className="text-xs text-gray-500">Avg Score</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{trend.teacherPerformance}%</p>
                    <p className="text-xs text-gray-500">Teacher Perf</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{trend.studentSatisfaction}/5</p>
                    <p className="text-xs text-gray-500">Satisfaction</p>
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}