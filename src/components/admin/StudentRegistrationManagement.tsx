import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter,
  GraduationCap,
  Award,
  AlertCircle,
  User,
  Calendar,
  BookOpen,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import { MathStudent, RegistrationRequest } from '../../types/mathSchool';
import { mathSchoolService } from '../../lib/mathSchoolService';
import { useConnectionStatus } from '../../hooks/useConnectionStatus';

export function StudentRegistrationManagement() {
  const [registeredStudents, setRegisteredStudents] = useState<MathStudent[]>([]);
  const [pendingRequests, setPendingRequests] = useState<RegistrationRequest[]>([]);
  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    pendingRequests: 0,
    gradeLevels: 0,
    averageTestScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'grade' | 'date'>('name');
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { isOnline } = useConnectionStatus();

  useEffect(() => {
    loadData();
    
    const unsubscribe = mathSchoolService.subscribe(() => {
      loadData();
    });
    
    return unsubscribe;
  }, [sortBy]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [students, requests, stats] = await Promise.all([
        mathSchoolService.getRegisteredStudents(sortBy),
        mathSchoolService.getPendingRequests(),
        mathSchoolService.getStatistics()
      ]);
      setRegisteredStudents(students);
      setPendingRequests(requests);
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load data:', error);
      setNotification({ message: 'Failed to load data. Please refresh the page.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAcceptRequest = async (requestId: string) => {
    if (!isOnline) {
      setNotification({ 
        message: 'Cannot process requests while offline. Please check your connection.', 
        type: 'error' 
      });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    setProcessingRequest(requestId);
    try {
      const result = await mathSchoolService.acceptRegistration(requestId);
      if (result.success) {
        setNotification({ message: result.message, type: 'success' });
      } else {
        setNotification({ message: result.message, type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'Failed to process request', type: 'error' });
    } finally {
      setProcessingRequest(null);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (!isOnline) {
      setNotification({ 
        message: 'Cannot process requests while offline. Please check your connection.', 
        type: 'error' 
      });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    const reason = prompt('Please provide a reason for rejection (optional):');
    if (reason === null) return;
    
    setProcessingRequest(requestId);
    try {
      const result = await mathSchoolService.rejectRegistration(requestId, reason);
      if (result.success) {
        setNotification({ message: result.message, type: 'success' });
      } else {
        setNotification({ message: result.message, type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'Failed to process request', type: 'error' });
    } finally {
      setProcessingRequest(null);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const filteredStudents = registeredStudents.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.mathLevel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || student.gradeLevel === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const getGradeColor = (grade: number) => {
    const colors = {
      6: 'bg-purple-100 text-purple-800',
      7: 'bg-blue-100 text-blue-800',
      8: 'bg-green-100 text-green-800',
      9: 'bg-yellow-100 text-yellow-800',
      10: 'bg-orange-100 text-orange-800',
      11: 'bg-red-100 text-red-800',
      12: 'bg-indigo-100 text-indigo-800'
    };
    return colors[grade as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Student Registration Management</h2>
            <p className="text-indigo-100 text-lg">Manage student registrations and enrollment requests</p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{statistics.pendingRequests}</div>
              <p className="text-sm text-indigo-200">Pending Requests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Registration Dashboard</h3>
          <p className="text-gray-600 mt-1">Process requests and manage student enrollment</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-lg border ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalStudents}</p>
              <p className="text-sm text-gray-600">Registered Students</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statistics.pendingRequests}</p>
              <p className="text-sm text-gray-600">Pending Requests</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statistics.gradeLevels}</p>
              <p className="text-sm text-gray-600">Grade Levels</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statistics.averageTestScore}</p>
              <p className="text-sm text-gray-600">Avg Test Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Registration Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-orange-50 border-b border-orange-200 p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">Pending Registration Requests</h2>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                {pendingRequests.length} pending
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {pendingRequests.map((request) => (
              <div key={request.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.student.fullName}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(request.student.gradeLevel)}`}>
                        Grade {request.student.gradeLevel}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                        {request.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>Student ID: {request.student.studentId}</div>
                      <div>Requested Class: {request.requestedClass}</div>
                      <div>Current Level: {request.student.mathLevel}</div>
                      <div>Placement Score: {request.student.placementTestScore}%</div>
                    </div>
                    {request.reason && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700"><strong>Reason:</strong> {request.reason}</p>
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Requested on {new Date(request.requestDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      disabled={processingRequest === request.id || !isOnline}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {processingRequest === request.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      disabled={processingRequest === request.id || !isOnline}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registered Students */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Registered Students</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Grades</option>
                {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'grade' | 'date')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="grade">Sort by Grade</option>
                <option value="date">Sort by Date</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Student</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Grade</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Math Level</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Test Score</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Enrollment Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.fullName}</p>
                        <p className="text-sm text-gray-500">{student.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(student.gradeLevel)}`}>
                      Grade {student.gradeLevel}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900">{student.mathLevel}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{student.placementTestScore}%</span>
                      {student.placementTestScore && student.placementTestScore >= 90 && (
                        <Award className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {new Date(student.enrollmentDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-600">
                      <div>{student.parentName}</div>
                      <div className="text-xs text-gray-500">{student.parentEmail}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}