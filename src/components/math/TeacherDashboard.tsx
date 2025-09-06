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
  Home,
  FileText,
  BarChart3,
  Settings,
  Bell,
  MessageCircle,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Play
} from 'lucide-react';
import { MathStudent, RegistrationRequest } from '../../types/mathSchool';
import { mathSchoolService } from '../../lib/mathSchoolService';
import { storageService } from '../../lib/storageService';
import { ConnectionIndicator } from '../common/ConnectionIndicator';
import { useConnectionStatus } from '../../hooks/useConnectionStatus';
import { useAuth } from '../../hooks/useAuth';
import { LearningMaterial } from '../../types/learningMaterials';
import { learningMaterialsService } from '../../lib/learningMaterialsService';
import { MaterialModal } from './MaterialModal';

export function TeacherDashboard() {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
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
  const { isOnline } = useConnectionStatus();
  
  // Learning Materials state
  const [learningMaterials, setLearningMaterials] = useState<LearningMaterial[]>([]);
  const [materialFilters, setMaterialFilters] = useState({
    gradeLevel: 0,
    type: '',
    search: ''
  });
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<LearningMaterial | null>(null);
  const [viewingMaterial, setViewingMaterial] = useState<LearningMaterial | null>(null);
  
  // Analytics data for teacher dashboard
  const [analyticsData, setAnalyticsData] = useState({
    weeklyApprovals: 12,
    monthlyApprovals: 45,
    averageProcessingTime: '2.3 hours',
    topGradeRequests: 'Grade 8'
  });

  // Load saved filter preferences on component mount
  useEffect(() => {
    const savedFilters = storageService.getTeacherFilters();
    setSearchQuery(savedFilters.searchQuery);
    setSortBy(savedFilters.sortBy);
    setSelectedGrade(savedFilters.selectedGrade);
    setShowFilters(savedFilters.showFilters);
  }, []);

  // Save filter preferences when they change
  useEffect(() => {
    const filters = {
      searchQuery,
      sortBy,
      selectedGrade,
      showFilters
    };
    storageService.saveTeacherFilters(filters);
  }, [searchQuery, sortBy, selectedGrade, showFilters]);

  useEffect(() => {
    loadData();
    
    // Subscribe to data changes
    const unsubscribe = mathSchoolService.subscribe(() => {
      loadData();
    });
    
    return unsubscribe;
  }, [sortBy]);

  // Load learning materials
  useEffect(() => {
    loadLearningMaterials();
    
    const unsubscribe = learningMaterialsService.subscribe(() => {
      loadLearningMaterials();
    });
    
    return unsubscribe;
  }, [materialFilters]);

  const loadLearningMaterials = async () => {
    try {
      const materials = await learningMaterialsService.getMaterials({
        gradeLevel: materialFilters.gradeLevel || undefined,
        type: materialFilters.type || undefined,
        search: materialFilters.search || undefined
      });
      setLearningMaterials(materials);
    } catch (error) {
      console.error('Failed to load learning materials:', error);
    }
  };

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
    if (reason === null) return; // User cancelled
    
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
  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      try {
        await logout();
      } catch (error) {
        console.error('Sign out failed:', error);
        await logout();
      }
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'registrations', label: 'Registration Requests', icon: Users },
    { id: 'students', label: 'My Students', icon: GraduationCap },
    { id: 'materials', label: 'Learning Materials', icon: BookOpen },
    { id: 'classes', label: 'Class Management', icon: BookOpen },
    { id: 'grades', label: 'Grades & Assessment', icon: Award },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderDashboardOverview = () => (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalStudents}</p>
              <p className="text-sm text-gray-600">Total Students</p>
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

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setActiveSection('registrations')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Review Registrations</p>
              <p className="text-sm text-gray-500">{statistics.pendingRequests} pending</p>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveSection('students')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <GraduationCap className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Manage Students</p>
              <p className="text-sm text-gray-500">{statistics.totalStudents} students</p>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveSection('materials')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BookOpen className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Create Materials</p>
              <p className="text-sm text-gray-500">{learningMaterials.length} materials</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Approved registration for Emma Johnson</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Award className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Updated grades for Algebra I class</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
            <MessageCircle className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">New message from parent</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRegistrationRequests = () => (
    <div className="space-y-6">
      {/* Pending Registration Requests */}
      {pendingRequests.length > 0 ? (
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
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">No pending registration requests at this time.</p>
        </div>
      )}
    </div>
  );

  const renderStudentManagement = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Student Management</h2>
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

            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Add Student
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Student</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Grade</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Math Level</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Test Score</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Contact</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
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
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderLearningMaterials = () => (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Learning Materials</h2>
          <p className="text-gray-600">Create and manage educational content for your students</p>
        </div>
        <button
          onClick={() => {
            setEditingMaterial(null);
            setShowMaterialModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Material
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search materials..."
              value={materialFilters.search}
              onChange={(e) => setMaterialFilters({...materialFilters, search: e.target.value})}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={materialFilters.gradeLevel}
            onChange={(e) => setMaterialFilters({...materialFilters, gradeLevel: parseInt(e.target.value)})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={0}>All Grades</option>
            {[6, 7, 8, 9, 10, 11, 12].map(grade => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </select>

          <select
            value={materialFilters.type}
            onChange={(e) => setMaterialFilters({...materialFilters, type: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="lesson">Lessons</option>
            <option value="assignment">Assignments</option>
            <option value="quiz">Quizzes</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            {learningMaterials.length} materials
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningMaterials.map((material) => (
          <div key={material.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  material.type === 'lesson' ? 'bg-blue-100' :
                  material.type === 'assignment' ? 'bg-green-100' :
                  material.type === 'quiz' ? 'bg-purple-100' :
                  material.type === 'video' ? 'bg-red-100' :
                  'bg-gray-100'
                }`}>
                  {material.type === 'lesson' && <BookOpen className="w-5 h-5 text-blue-600" />}
                  {material.type === 'assignment' && <FileText className="w-5 h-5 text-green-600" />}
                  {material.type === 'quiz' && <Award className="w-5 h-5 text-purple-600" />}
                  {material.type === 'video' && <Play className="w-5 h-5 text-red-600" />}
                  {!['lesson', 'assignment', 'quiz', 'video'].includes(material.type) && <FileText className="w-5 h-5 text-gray-600" />}
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(material.gradeLevel)}`}>
                    Grade {material.gradeLevel}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingMaterial(material);
                    setShowMaterialModal(true);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteMaterial(material.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {material.attachments && material.attachments.length > 0 && (
                  <div className="mt-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {material.attachments.length} file{material.attachments.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{material.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{material.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{material.estimatedDuration}min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{material.assignedTo.length} assigned</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                material.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {material.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleAssignMaterial(material)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Users className="w-4 h-4" />
                Assign
              </button>
              <button
                onClick={() => handleViewMaterial(material)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {learningMaterials.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Learning Materials</h3>
          <p className="text-gray-600 mb-6">Create your first learning material to get started</p>
          <button
            onClick={() => {
              setEditingMaterial(null);
              setShowMaterialModal(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create Material
          </button>
        </div>
      )}

      {/* Material Modal */}
      {showMaterialModal && (
        <MaterialModal
          material={editingMaterial}
          onClose={() => setShowMaterialModal(false)}
          onSave={handleSaveMaterial}
        />
      )}

      {/* Material Viewer */}
      {viewingMaterial && (
        <MaterialViewer
          material={viewingMaterial}
          onClose={() => setViewingMaterial(null)}
        />
      )}
    </div>
  );

  const handleDeleteMaterial = async (materialId: string) => {
    if (confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      try {
        await learningMaterialsService.deleteMaterial(materialId);
        setNotification({ message: 'Material deleted successfully', type: 'success' });
      } catch (error) {
        setNotification({ message: 'Failed to delete material', type: 'error' });
      }
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleSaveMaterial = async (materialData: any) => {
    try {
      if (editingMaterial) {
        await learningMaterialsService.updateMaterial(editingMaterial.id, materialData);
        setNotification({ message: 'Material updated successfully', type: 'success' });
      } else {
        await learningMaterialsService.createMaterial({
          ...materialData,
          createdBy: 'teacher',
          assignedTo: [],
          attachments: materialData.attachments || []
        });
        setNotification({ message: 'Material created successfully', type: 'success' });
      }
      setShowMaterialModal(false);
    } catch (error) {
      setNotification({ message: 'Failed to save material', type: 'error' });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAssignMaterial = (material: LearningMaterial) => {
    // TODO: Implement assignment modal
    alert(`Assign "${material.title}" to students - Feature coming soon!`);
  };

  const handleViewMaterial = (material: LearningMaterial) => {
    // TODO: Implement material viewer
    alert(`View "${material.title}" - Feature coming soon!`);
  };

  const renderPlaceholder = (title: string, description: string, icon: React.ElementType) => {
    const Icon = icon;
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Coming Soon
        </button>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboardOverview();
      case 'registrations':
        return renderRegistrationRequests();
      case 'students':
        return renderStudentManagement();
      case 'materials':
        return renderLearningMaterials();
      case 'classes':
        return renderPlaceholder('Class Management', 'Manage your math classes, schedules, and curriculum', BookOpen);
      case 'grades':
        return renderPlaceholder('Grades & Assessment', 'Grade assignments, track progress, and generate reports', Award);
      case 'reports':
        return renderPlaceholder('Reports & Analytics', 'View detailed reports and analytics for your classes', BarChart3);
      case 'messages':
        return renderPlaceholder('Messages', 'Communicate with students and parents', MessageCircle);
      case 'settings':
        return renderPlaceholder('Settings', 'Manage your preferences and account settings', Settings);
      default:
        return renderDashboardOverview();
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
    <div className="flex h-screen bg-gray-50">
      <ConnectionIndicator />
      
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Teacher Portal</h1>
              <p className="text-xs text-gray-500">Math Department</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.label}</span>
                  {item.id === 'registrations' && statistics.pendingRequests > 0 && (
                    <span className="ml-auto bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                      {statistics.pendingRequests}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                  </h1>
                  <p className="text-blue-100 text-lg">
                    {activeSection === 'dashboard' && 'Welcome to your teaching dashboard'}
                    {activeSection === 'registrations' && 'Review and process student registration requests'}
                    {activeSection === 'students' && 'Manage your enrolled students'}
                    {activeSection === 'materials' && 'Create and manage learning materials'}
                    {activeSection === 'classes' && 'Organize your math classes and curriculum'}
                    {activeSection === 'grades' && 'Track student progress and assessments'}
                    {activeSection === 'reports' && 'View analytics and generate reports'}
                    {activeSection === 'messages' && 'Communicate with students and parents'}
                    {activeSection === 'settings' && 'Customize your preferences'}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                    {React.createElement(menuItems.find(item => item.id === activeSection)?.icon || BookOpen, {
                      className: "w-8 h-8 mb-2 text-blue-200 mx-auto"
                    })}
                    <p className="text-sm text-blue-200">Math Focus</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification */}
          {notification && (
            <div className={`mb-6 p-4 rounded-lg border ${
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

          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
}