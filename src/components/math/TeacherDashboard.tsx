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
import { MaterialViewer } from '../common/MaterialViewer';

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

  // Class Management State
  type MathClass = {
    id: string;
    name: string;
    schedule: string;
    curriculum: string;
  };
  const [classes, setClasses] = useState<MathClass[]>([]);
  const [newClass, setNewClass] = useState<Partial<MathClass>>({ name: '', schedule: '', curriculum: '' });
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  // Class Management Handlers
  const handleClassInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewClass({ ...newClass, [e.target.name]: e.target.value });
  };

  const addOrEditClass = () => {
    if (!newClass.name || !newClass.schedule || !newClass.curriculum) return;
    if (editingClassId) {
      setClasses(classes.map(cls => cls.id === editingClassId ? { ...cls, ...newClass, id: editingClassId } as MathClass : cls));
      setEditingClassId(null);
    } else {
      setClasses([...classes, { ...newClass, id: Date.now().toString() } as MathClass]);
    }
    setNewClass({ name: '', schedule: '', curriculum: '' });
  };

  const editClass = (cls: MathClass) => {
    setNewClass(cls);
    setEditingClassId(cls.id);
  };

  const deleteClass = (id: string) => {
    setClasses(classes.filter(cls => cls.id !== id));
    if (editingClassId === id) {
      setEditingClassId(null);
      setNewClass({ name: '', schedule: '', curriculum: '' });
    }
  };

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

  // Student Management State
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<MathStudent | null>(null);
  const [viewingStudent, setViewingStudent] = useState<MathStudent | null>(null);
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);
  const [studentForm, setStudentForm] = useState<Partial<MathStudent>>({ fullName: '', studentId: '', gradeLevel: 6, mathLevel: '', placementTestScore: 0 });

  const openAddStudent = () => {
    setEditingStudent(null);
    setStudentForm({ fullName: '', studentId: '', gradeLevel: 6, mathLevel: '', placementTestScore: 0 });
    setShowStudentModal(true);
  };
  const openEditStudent = (student: MathStudent) => {
    setEditingStudent(student);
    setStudentForm(student);
    setShowStudentModal(true);
  };
  const openViewStudent = (student: MathStudent) => {
    setViewingStudent(student);
  };
  const openDeleteStudent = (id: string) => {
    setDeleteStudentId(id);
  };
  const closeStudentModal = () => {
    setShowStudentModal(false);
    setEditingStudent(null);
    setStudentForm({ fullName: '', studentId: '', gradeLevel: 6, mathLevel: '', placementTestScore: 0 });
  };
  const closeViewStudent = () => setViewingStudent(null);
  const closeDeleteStudent = () => setDeleteStudentId(null);

  const handleStudentFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };
  const saveStudent = () => {
    if (!studentForm.fullName || !studentForm.studentId || !studentForm.mathLevel) return;
    if (editingStudent) {
      setRegisteredStudents(registeredStudents.map(s => s.id === editingStudent.id ? { ...editingStudent, ...studentForm } as MathStudent : s));
    } else {
      setRegisteredStudents([...registeredStudents, { ...studentForm, id: Date.now().toString() } as MathStudent]);
    }
    closeStudentModal();
  };
  const confirmDeleteStudent = () => {
    setRegisteredStudents(registeredStudents.filter(s => s.id !== deleteStudentId));
    closeDeleteStudent();
  };

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
            <button onClick={openAddStudent} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
                      <button onClick={() => openViewStudent(student)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEditStudent(student)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => openDeleteStudent(student.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

      {/* Add/Edit Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{editingStudent ? 'Edit Student' : 'Add Student'}</h3>
            <div className="space-y-4">
              <input name="fullName" value={studentForm.fullName || ''} onChange={handleStudentFormChange} placeholder="Full Name" className="w-full border p-2 rounded" />
              <input name="studentId" value={studentForm.studentId || ''} onChange={handleStudentFormChange} placeholder="Student ID" className="w-full border p-2 rounded" />
              <select name="gradeLevel" value={studentForm.gradeLevel || 6} onChange={handleStudentFormChange} className="w-full border p-2 rounded">
                {[6,7,8,9,10,11,12].map(g => <option key={g} value={g}>Grade {g}</option>)}
              </select>
              <input name="mathLevel" value={studentForm.mathLevel || ''} onChange={handleStudentFormChange} placeholder="Math Level" className="w-full border p-2 rounded" />
              <input name="placementTestScore" type="number" value={studentForm.placementTestScore || 0} onChange={handleStudentFormChange} placeholder="Placement Test Score (%)" className="w-full border p-2 rounded" />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={closeStudentModal} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              <button onClick={saveStudent} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{editingStudent ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      {/* View Student Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Student Details</h3>
            <div className="space-y-2">
              <div><strong>Name:</strong> {viewingStudent.fullName}</div>
              <div><strong>Student ID:</strong> {viewingStudent.studentId}</div>
              <div><strong>Grade:</strong> {viewingStudent.gradeLevel}</div>
              <div><strong>Math Level:</strong> {viewingStudent.mathLevel}</div>
              <div><strong>Placement Test Score:</strong> {viewingStudent.placementTestScore}%</div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={closeViewStudent} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Student Confirmation */}
      {deleteStudentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Delete Student</h3>
            <p>Are you sure you want to delete this student?</p>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={closeDeleteStudent} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              <button onClick={confirmDeleteStudent} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
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
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><BookOpen className="inline w-6 h-6" /> Class Management</h2>
            <p className="mb-6 text-gray-600">Manage your math classes, schedules, and curriculum</p>
            <div className="mb-6 bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">{editingClassId ? 'Edit Class' : 'Add New Class'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  name="name"
                  value={newClass.name || ''}
                  onChange={handleClassInputChange}
                  placeholder="Class Name"
                  className="border p-2 rounded"
                />
                <input
                  name="schedule"
                  value={newClass.schedule || ''}
                  onChange={handleClassInputChange}
                  placeholder="Schedule (e.g. Mon 10:00-11:00)"
                  className="border p-2 rounded"
                />
                <input
                  name="curriculum"
                  value={newClass.curriculum || ''}
                  onChange={handleClassInputChange}
                  placeholder="Curriculum/Topics"
                  className="border p-2 rounded"
                />
              </div>
              <button
                onClick={addOrEditClass}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editingClassId ? 'Update Class' : 'Add Class'}
              </button>
              {editingClassId && (
                <button
                  onClick={() => { setEditingClassId(null); setNewClass({ name: '', schedule: '', curriculum: '' }); }}
                  className="ml-2 mt-3 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Your Classes</h3>
              {classes.length === 0 ? (
                <p className="text-gray-500">No classes added yet.</p>
              ) : (
                <table className="w-full text-left border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2">Name</th>
                      <th className="p-2">Schedule</th>
                      <th className="p-2">Curriculum</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map(cls => (
                      <tr key={cls.id} className="border-t">
                        <td className="p-2">{cls.name}</td>
                        <td className="p-2">{cls.schedule}</td>
                        <td className="p-2">{cls.curriculum}</td>
                        <td className="p-2 flex gap-2">
                          <button onClick={() => editClass(cls)} className="px-2 py-1 bg-yellow-200 rounded hover:bg-yellow-300">Edit</button>
                          <button onClick={() => deleteClass(cls.id)} className="px-2 py-1 bg-red-200 rounded hover:bg-red-300">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      case 'grades':
        // Move all hooks to the top of the component to avoid conditional hook calls
        return renderGradesAssessment();
// --- Add at the top level of TeacherDashboard, after other useState hooks ---
  // Grades & Assessment State (moved to top level)
  type GradeEntry = { id: string; student: string; assignment: string; grade: number; };
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [newGrade, setNewGrade] = useState<Partial<GradeEntry>>({ student: '', assignment: '', grade: undefined });
  const [editingGradeId, setEditingGradeId] = useState<string | null>(null);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [viewStudent, setViewStudent] = useState<string | null>(null);
  const [filterStudent, setFilterStudent] = useState('all');

  // Grades & Assessment Handlers (move above renderGradesAssessment)
  const handleGradeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewGrade({ ...newGrade, [e.target.name]: e.target.value });
  };
  const openAddGrade = () => {
    setEditingGradeId(null);
    setNewGrade({ student: '', assignment: '', grade: undefined });
    setShowGradeModal(true);
  };
  const openEditGrade = (g: GradeEntry) => {
    setEditingGradeId(g.id);
    setNewGrade(g);
    setShowGradeModal(true);
  };
  const closeGradeModal = () => {
    setShowGradeModal(false);
    setEditingGradeId(null);
    setNewGrade({ student: '', assignment: '', grade: undefined });
  };
  const saveGrade = () => {
    if (!newGrade.student || !newGrade.assignment || newGrade.grade === undefined) return;
    if (editingGradeId) {
      setGrades(grades.map(g => g.id === editingGradeId ? { ...g, ...newGrade, id: editingGradeId, grade: Number(newGrade.grade) } as GradeEntry : g));
    } else {
      setGrades([...grades, { ...newGrade, id: Date.now().toString(), grade: Number(newGrade.grade) } as GradeEntry]);
    }
    closeGradeModal();
  };
  const deleteGrade = (id: string) => {
    setGrades(grades.filter(g => g.id !== id));
    if (editingGradeId === id) closeGradeModal();
  };
  // CSV Report
  const downloadCSV = () => {
    const csv = [
      ['Student', 'Assignment', 'Grade'],
      ...grades.map(g => [g.student, g.assignment, g.grade])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grades_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  // Progress tracking
  const studentAverages: { [student: string]: number } = {};
  grades.forEach(g => {
    if (!studentAverages[g.student]) studentAverages[g.student] = 0;
    studentAverages[g.student] += g.grade;
  });
  Object.keys(studentAverages).forEach(s => {
    const count = grades.filter(g => g.student === s).length;
    studentAverages[s] = count ? (studentAverages[s] / count) : 0;
  });
  // Assignment stats
  const assignmentStats: { [assignment: string]: { count: number; avg: number } } = {};
  grades.forEach(g => {
    if (!assignmentStats[g.assignment]) assignmentStats[g.assignment] = { count: 0, avg: 0 };
    assignmentStats[g.assignment].count++;
    assignmentStats[g.assignment].avg += g.grade;
  });
  Object.keys(assignmentStats).forEach(a => {
    assignmentStats[a].avg = assignmentStats[a].count ? (assignmentStats[a].avg / assignmentStats[a].count) : 0;
  });
  // Filtered grades
  const gradesToShow = filterStudent === 'all' ? grades : grades.filter(g => g.student === filterStudent);
  const studentsList = Array.from(new Set(grades.map(g => g.student)));

  // Render function for Grades & Assessment
  function renderGradesAssessment() {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Award className="inline w-6 h-6" /> Grades & Assessment</h2>
        <p className="mb-6 text-gray-600">Grade assignments, track progress, and generate reports</p>
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <button onClick={openAddGrade} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Grade</button>
          <select value={filterStudent} onChange={e => setFilterStudent(e.target.value)} className="border p-2 rounded">
            <option value="all">All Students</option>
            {studentsList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {/* Grades Table */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="font-semibold mb-2">Grades Table</h3>
          {gradesToShow.length === 0 ? (
            <p className="text-gray-500">No grades recorded yet.</p>
          ) : (
            <table className="w-full text-left border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Student</th>
                  <th className="p-2">Assignment</th>
                  <th className="p-2">Grade (%)</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gradesToShow.map(g => (
                  <tr key={g.id} className="border-t">
                    <td className="p-2 cursor-pointer text-blue-700 underline" onClick={() => setViewStudent(g.student)}>{g.student}</td>
                    <td className="p-2">{g.assignment}</td>
                    <td className="p-2">{g.grade}</td>
                    <td className="p-2 flex gap-2">
                      <button onClick={() => openEditGrade(g)} className="px-2 py-1 bg-yellow-200 rounded hover:bg-yellow-300">Edit</button>
                      <button onClick={() => deleteGrade(g.id)} className="px-2 py-1 bg-red-200 rounded hover:bg-red-300">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Assignment Stats */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="font-semibold mb-2">Assignment Statistics</h3>
          {Object.keys(assignmentStats).length === 0 ? (
            <p className="text-gray-500">No assignment data yet.</p>
          ) : (
            <table className="w-full text-left border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Assignment</th>
                  <th className="p-2"># Graded</th>
                  <th className="p-2">Average (%)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(assignmentStats).map(([assignment, stat]) => (
                  <tr key={assignment} className="border-t">
                    <td className="p-2">{assignment}</td>
                    <td className="p-2">{stat.count}</td>
                    <td className="p-2">{stat.avg.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Progress Tracking */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="font-semibold mb-2">Progress Tracking</h3>
          {Object.keys(studentAverages).length === 0 ? (
            <p className="text-gray-500">No progress data yet.</p>
          ) : (
            <table className="w-full text-left border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Student</th>
                  <th className="p-2">Average Grade (%)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(studentAverages).map(([student, avg]) => (
                  <tr key={student} className="border-t">
                    <td className="p-2 cursor-pointer text-blue-700 underline" onClick={() => setViewStudent(student)}>{student}</td>
                    <td className="p-2">{avg.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Download Report */}
        <button
          onClick={downloadCSV}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download Grades Report (CSV)
        </button>

        {/* Add/Edit Grade Modal */}
        {showGradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">{editingGradeId ? 'Edit Grade' : 'Add Grade'}</h3>
              <div className="space-y-4">
                <input name="student" value={newGrade.student || ''} onChange={handleGradeInputChange} placeholder="Student Name" className="w-full border p-2 rounded" />
                <input name="assignment" value={newGrade.assignment || ''} onChange={handleGradeInputChange} placeholder="Assignment" className="w-full border p-2 rounded" />
                <input name="grade" type="number" min="0" max="100" value={newGrade.grade === undefined ? '' : newGrade.grade} onChange={handleGradeInputChange} placeholder="Grade (%)" className="w-full border p-2 rounded" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={closeGradeModal} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                <button onClick={saveGrade} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{editingGradeId ? 'Update' : 'Add'}</button>
              </div>
            </div>
          </div>
        )}

        {/* View Student Results Modal */}
        {viewStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">{viewStudent} - Results</h3>
              <div className="space-y-2 mb-4">
                {grades.filter(g => g.student === viewStudent).length === 0 ? (
                  <p className="text-gray-500">No results for this student.</p>
                ) : (
                  <table className="w-full text-left border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2">Assignment</th>
                        <th className="p-2">Grade (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.filter(g => g.student === viewStudent).map(g => (
                        <tr key={g.id} className="border-t">
                          <td className="p-2">{g.assignment}</td>
                          <td className="p-2">{g.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setViewStudent(null)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
      case 'reports':
        return renderReportsAnalytics();
  // Reports & Analytics render function (top-level, after grades logic)
  function renderReportsAnalytics() {
    // Example analytics: total students, total classes, average grade, class performance breakdown
    const totalStudents = registeredStudents.length;
    const totalClasses = classes.length;
    const totalGrades = grades.length;
    const avgGrade = totalGrades > 0 ? (grades.reduce((sum, g) => sum + g.grade, 0) / totalGrades) : 0;

    // Class performance: average grade per class
    const classPerformance: { [className: string]: { count: number; avg: number } } = {};
    grades.forEach(g => {
      // No class grouping possible; all grades are 'Unassigned'
      const className = 'Unassigned';
      if (!classPerformance[className]) classPerformance[className] = { count: 0, avg: 0 };
      classPerformance[className].count++;
      classPerformance[className].avg += g.grade;
    });
    // To group by class, add a 'students' property to MathClass and assign students to classes.
    Object.keys(classPerformance).forEach(cn => {
      classPerformance[cn].avg = classPerformance[cn].count ? (classPerformance[cn].avg / classPerformance[cn].count) : 0;
    });

    // Render simple bar chart for class performance (text-based for demo)
    function renderBarChart(data: { [label: string]: number }, maxBarWidth = 200) {
      const maxVal = Math.max(...Object.values(data), 1);
      return (
        <div className="space-y-2">
          {Object.entries(data).map(([label, value]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-32 truncate">{label}</span>
              <div className="bg-blue-200 h-4 rounded" style={{ width: `${(value / maxVal) * maxBarWidth}px` }} />
              <span className="text-sm text-gray-700">{value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><BarChart3 className="inline w-6 h-6" /> Reports & Analytics</h2>
        <p className="mb-6 text-gray-600">View detailed reports and analytics for your classes.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Summary</h3>
            <ul className="space-y-1">
              <li>Total Students: <span className="font-bold">{totalStudents}</span></li>
              <li>Total Classes: <span className="font-bold">{totalClasses}</span></li>
              <li>Average Grade: <span className="font-bold">{avgGrade.toFixed(2)}%</span></li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Class Performance (Avg Grade)</h3>
            {Object.keys(classPerformance).length === 0 ? (
              <p className="text-gray-500">No class performance data yet.</p>
            ) : (
              renderBarChart(Object.fromEntries(Object.entries(classPerformance).map(([k, v]) => [k, v.avg])))
            )}
          </div>
        </div>
        {/* More analytics can be added here, e.g., student progress, assignment stats, etc. */}
      </div>
    );
  }
      case 'messages':
        return renderPlaceholder('Messages', 'Communicate with students and parents', MessageCircle);
      case 'settings':
        // Settings State
        const [settings, setSettings] = useState({
          displayName: 'Teacher Name',
          email: 'teacher@email.com',
          theme: 'light',
          password: '',
          newPassword: '',
          notifications: {
            email: true,
            sms: false,
            push: true,
          },
        });
        const [showPassword, setShowPassword] = useState(false);
        const [settingsMsg, setSettingsMsg] = useState<string | null>(null);
        const [profilePic, setProfilePic] = useState<string | null>(null);
        const [profilePicFile, setProfilePicFile] = useState<File | null>(null);

        const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
          const { name, value, type } = e.target;
          let checked = false;
          if (type === 'checkbox') {
            checked = (e.target as HTMLInputElement).checked;
          }
          if (name.startsWith('notif_')) {
            setSettings({
              ...settings,
              notifications: {
                ...settings.notifications,
                [name.replace('notif_', '')]: type === 'checkbox' ? checked : value,
              },
            });
          } else {
            setSettings({ ...settings, [name]: value });
          }
        };
        const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
          setSettings({ ...settings, theme: e.target.value });
          localStorage.setItem('theme', e.target.value);
        };
        const handleSaveSettings = () => {
          setSettingsMsg('Preferences saved!');
          setTimeout(() => setSettingsMsg(null), 2000);
        };
        const handleChangePassword = () => {
          if (!settings.password || !settings.newPassword) {
            setSettingsMsg('Please enter both current and new password.');
            return;
          }
          setSettingsMsg('Password changed!');
          setSettings({ ...settings, password: '', newPassword: '' });
          setTimeout(() => setSettingsMsg(null), 2000);
        };
        const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files[0]) {
            setProfilePicFile(e.target.files[0]);
            const reader = new FileReader();
            reader.onload = (ev) => setProfilePic(ev.target?.result as string);
            reader.readAsDataURL(e.target.files[0]);
          }
        };

        return (
          <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Settings className="inline w-6 h-6" /> Settings</h2>
            <p className="mb-6 text-gray-600">Manage your preferences and account settings</p>
            <div className="bg-white p-6 rounded shadow space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Profile</h3>
                <div className="flex items-center gap-6 mb-4">
                  <div>
                    <label htmlFor="profilePicUpload" className="block mb-2 font-medium">Profile Picture</label>
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
                      {profilePic ? (
                        <img src={profilePic} alt="Profile" className="object-cover w-full h-full" />
                      ) : (
                        <User className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                    <input id="profilePicUpload" type="file" accept="image/*" onChange={handleProfilePicChange} className="mt-2" />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="displayName" value={settings.displayName} onChange={handleSettingsChange} placeholder="Display Name" className="border p-2 rounded" />
                    <input name="email" value={settings.email} onChange={handleSettingsChange} placeholder="Email" className="border p-2 rounded" />
                  </div>
                </div>
                <button onClick={handleSaveSettings} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Profile</button>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Theme</h3>
                <select name="theme" value={settings.theme} onChange={handleThemeChange} className="border p-2 rounded">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Notification Preferences</h3>
                <div className="flex flex-col gap-2">
                  <label className="inline-flex items-center">
                    <input type="checkbox" name="notif_email" checked={settings.notifications.email} onChange={handleSettingsChange} className="mr-2" /> Email Notifications
                  </label>
                  <label className="inline-flex items-center">
                    <input type="checkbox" name="notif_sms" checked={settings.notifications.sms} onChange={handleSettingsChange} className="mr-2" /> SMS Notifications
                  </label>
                  <label className="inline-flex items-center">
                    <input type="checkbox" name="notif_push" checked={settings.notifications.push} onChange={handleSettingsChange} className="mr-2" /> Push Notifications
                  </label>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="password" type={showPassword ? 'text' : 'password'} value={settings.password} onChange={handleSettingsChange} placeholder="Current Password" className="border p-2 rounded" />
                  <input name="newPassword" type={showPassword ? 'text' : 'password'} value={settings.newPassword} onChange={handleSettingsChange} placeholder="New Password" className="border p-2 rounded" />
                </div>
                <label className="inline-flex items-center mt-2">
                  <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} className="mr-2" /> Show Passwords
                </label>
                <button onClick={handleChangePassword} className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Change Password</button>
              </div>
              <div>
                <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Sign Out</button>
              </div>
              {settingsMsg && <div className="text-center text-green-600 font-semibold mt-2">{settingsMsg}</div>}
            </div>
          </div>
        );
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