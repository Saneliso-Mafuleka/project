import React from 'react';
import { 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  Award, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageCircle
} from 'lucide-react';
import { mockCourses, mockGrades, mockAttendance, mockAssignments } from '../../lib/studentData';
import { useStudent } from '../../context/StudentContext';

export function ParentDashboard() {
  const { student } = useStudent();
  
  // Calculate stats
  const totalAssignments = mockAssignments.length;
  const completedAssignments = mockAssignments.filter(a => a.status === 'submitted' || a.status === 'graded').length;
  const overallGrade = Math.round(mockGrades.reduce((acc, grade) => acc + (grade.grade / grade.maxGrade * 100), 0) / mockGrades.length);
  const attendanceRate = Math.round((mockAttendance.filter(a => a.status === 'present').length / mockAttendance.length) * 100);
  
  // Recent attendance (last 7 days)
  const recentAttendance = mockAttendance.slice(0, 7);
  
  return (
    <div className="space-y-8">
      {/* Parent Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Hello, {student.parentName}!</h2>
            <p className="text-green-100 text-lg">Here's how {student.name} is doing in school</p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{overallGrade}%</div>
              <p className="text-sm text-green-200">Overall Grade</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{overallGrade}%</p>
              <p className="text-sm text-gray-600">Overall Grade</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{attendanceRate}%</p>
              <p className="text-sm text-gray-600">Attendance Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{completedAssignments}/{totalAssignments}</p>
              <p className="text-sm text-gray-600">Assignments Done</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{mockCourses.length}</p>
              <p className="text-sm text-gray-600">Active Courses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Academic Performance */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Progress */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Course Progress</h3>
            <div className="space-y-4">
              {mockCourses.map((course) => (
                <div key={course.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: course.color }}
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{course.name}</h4>
                        <p className="text-sm text-gray-500">{course.teacher}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{course.progress}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${course.progress}%`,
                        backgroundColor: course.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Grades */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Grades</h3>
            <div className="space-y-4">
              {mockGrades.map((grade) => (
                <div key={grade.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">{grade.assignmentName}</h4>
                    <p className="text-sm text-gray-500">{grade.courseName}</p>
                    <p className="text-xs text-gray-400">{new Date(grade.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {grade.grade}/{grade.maxGrade}
                    </div>
                    <div className={`text-sm font-medium ${
                      (grade.grade / grade.maxGrade) >= 0.9 ? 'text-green-600' :
                      (grade.grade / grade.maxGrade) >= 0.8 ? 'text-blue-600' :
                      (grade.grade / grade.maxGrade) >= 0.7 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {Math.round((grade.grade / grade.maxGrade) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Attendance Overview */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance</h3>
            <div className="space-y-3">
              {recentAttendance.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">{record.courseName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {record.status === 'present' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {record.status === 'absent' && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    {record.status === 'late' && (
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                    )}
                    {record.status === 'excused' && (
                      <Clock className="w-5 h-5 text-blue-500" />
                    )}
                    <span className={`text-xs font-medium capitalize ${
                      record.status === 'present' ? 'text-green-600' :
                      record.status === 'absent' ? 'text-red-600' :
                      record.status === 'late' ? 'text-orange-600' : 'text-blue-600'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment Status */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Status</h3>
            <div className="space-y-3">
              {mockAssignments.slice(0, 4).map((assignment) => (
                <div key={assignment.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{assignment.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      assignment.status === 'submitted' ? 'bg-green-100 text-green-800' :
                      assignment.status === 'graded' ? 'bg-blue-100 text-blue-800' :
                      assignment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {assignment.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{assignment.courseName}</p>
                  <p className="text-xs text-gray-600">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                  {assignment.grade && (
                    <p className="text-xs font-medium text-green-600 mt-1">
                      Grade: {assignment.grade}/{assignment.maxGrade}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => alert('Message Teachers feature - Coming soon! This will open a messaging interface to communicate with your child\'s teachers.')}
                className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Message Teachers</span>
              </button>
              <button 
                onClick={() => alert('Full Schedule View - Coming soon! This will show a detailed weekly schedule with all classes and activities.')}
                className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-900">View Full Schedule</span>
              </button>
              <button 
                onClick={() => alert('All Grades View - Coming soon! This will display a comprehensive grade report with detailed analytics.')}
                className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Award className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">View All Grades</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}