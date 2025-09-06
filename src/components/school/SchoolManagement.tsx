import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Plus, 
  Users, 
  BarChart3, 
  Settings, 
  Edit, 
  Eye,
  UserPlus,
  Award,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
  GraduationCap
} from 'lucide-react';
import { School, TeacherAccount, SchoolPerformanceAnalytics } from '../../types/school';
import { schoolService } from '../../lib/schoolService';
import { SchoolRegistrationModal } from './SchoolRegistrationModal';
import { TeacherAccountModal } from './TeacherAccountModal';
import { PerformanceMonitoringDashboard } from './PerformanceMonitoringDashboard';

export function SchoolManagement() {
  const [activeSection, setActiveSection] = useState('overview');
  const [schools, setSchools] = useState<School[]>([]);
  const [teachers, setTeachers] = useState<TeacherAccount[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [analytics, setAnalytics] = useState<SchoolPerformanceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<TeacherAccount | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const schoolsData = await schoolService.getSchools();
      setSchools(schoolsData);
      
      if (schoolsData.length > 0) {
        const firstSchool = schoolsData[0];
        setSelectedSchool(firstSchool);
        
        const [teachersData, analyticsData] = await Promise.all([
          schoolService.getTeachers(firstSchool.id),
          schoolService.getSchoolPerformanceAnalytics(firstSchool.id, '2024')
        ]);
        
        setTeachers(teachersData);
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolSuccess = (school: School) => {
    setShowSchoolModal(false);
    setEditingSchool(null);
    loadData();
  };

  const handleTeacherSuccess = (teacher: TeacherAccount) => {
    setShowTeacherModal(false);
    setEditingTeacher(null);
    loadData();
  };

  const menuItems = [
    { id: 'overview', label: 'School Overview', icon: Building },
    { id: 'teachers', label: 'Teacher Management', icon: Users },
    { id: 'performance', label: 'Performance Monitoring', icon: BarChart3 },
    { id: 'settings', label: 'School Settings', icon: Settings }
  ];

  const renderOverview = () => {
    if (!selectedSchool) {
      return (
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No School Registered</h3>
          <p className="text-gray-600 mb-6">Register your school to get started with the management system</p>
          <button
            onClick={() => setShowSchoolModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Register School
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* School Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedSchool.name}</h2>
                <p className="text-blue-100">Registration: {selectedSchool.registrationNumber}</p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span className="bg-white/20 px-2 py-1 rounded-full">
                    {selectedSchool.type.charAt(0).toUpperCase() + selectedSchool.type.slice(1)} School
                  </span>
                  <span className="bg-white/20 px-2 py-1 rounded-full">
                    {selectedSchool.level.charAt(0).toUpperCase() + selectedSchool.level.slice(1)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingSchool(selectedSchool);
                  setShowSchoolModal(true);
                }}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-900">
                    {selectedSchool.address.street}, {selectedSchool.address.city}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedSchool.address.province}, {selectedSchool.address.postalCode}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-medium text-gray-900">{selectedSchool.contact.phone}</p>
                  <p className="text-sm text-gray-600">{selectedSchool.contact.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Principal</p>
                  <p className="font-medium text-gray-900">{selectedSchool.principal.name}</p>
                  <p className="text-sm text-gray-600">{selectedSchool.principal.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{selectedSchool.capacity.totalStudents}</p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <UserPlus className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{selectedSchool.capacity.totalTeachers}</p>
                <p className="text-sm text-gray-600">Total Teachers</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Building className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{selectedSchool.capacity.classrooms}</p>
                <p className="text-sm text-gray-600">Classrooms</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{selectedSchool.capacity.grades.length}</p>
                <p className="text-sm text-gray-600">Grade Levels</p>
              </div>
            </div>
          </div>
        </div>

        {/* School Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">School Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Founded</p>
                <p className="text-gray-900">{selectedSchool.establishment.foundedYear}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Accreditation</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedSchool.establishment.accreditation.map((acc, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {acc}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Curriculum</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedSchool.establishment.curriculum.map((curr, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {curr}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Facilities</h3>
            <div className="grid grid-cols-2 gap-2">
              {selectedSchool.facilities.map((facility, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{facility}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTeacherManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Teacher Management</h2>
          <p className="text-gray-600">Manage teacher accounts and assignments</p>
        </div>
        <button
          onClick={() => setShowTeacherModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Teacher
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Teacher</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Subjects</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Experience</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Performance</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">
                        {teacher.personalInfo.firstName} {teacher.personalInfo.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{teacher.personalInfo.email}</p>
                      <p className="text-xs text-gray-400">ID: {teacher.professional.employeeNumber}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {teacher.professional.specializations.slice(0, 2).map((spec, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {spec}
                        </span>
                      ))}
                      {teacher.professional.specializations.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{teacher.professional.specializations.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900">{teacher.professional.experience} years</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${teacher.performance.overallScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {teacher.performance.overallScore}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`
                      inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${teacher.status === 'active' ? 'bg-green-100 text-green-800' : 
                        teacher.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}
                    `}>
                      {teacher.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingTeacher(teacher);
                          setShowTeacherModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {teachers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Teachers Added</h3>
            <button
              onClick={() => setShowTeacherModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Teacher
            </button>
          </div>
        )}
      </div>
    </div>
  );

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Management System</h1>
          <p className="text-gray-600 mt-1">Comprehensive school administration and monitoring</p>
        </div>
        
        {!selectedSchool && (
          <button
            onClick={() => setShowSchoolModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Register School
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${isActive 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'teachers' && renderTeacherManagement()}
        {activeSection === 'performance' && analytics && selectedSchool && (
          <PerformanceMonitoringDashboard 
            analytics={analytics} 
            school={selectedSchool}
            teachers={teachers}
          />
        )}
        {activeSection === 'settings' && (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">School Settings</h3>
            <p className="text-gray-600">Advanced school configuration options coming soon</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showSchoolModal && (
        <SchoolRegistrationModal
          school={editingSchool}
          onClose={() => {
            setShowSchoolModal(false);
            setEditingSchool(null);
          }}
          onSuccess={handleSchoolSuccess}
        />
      )}

      {showTeacherModal && selectedSchool && (
        <TeacherAccountModal
          teacher={editingTeacher}
          schoolId={selectedSchool.id}
          onClose={() => {
            setShowTeacherModal(false);
            setEditingTeacher(null);
          }}
          onSuccess={handleTeacherSuccess}
        />
      )}
    </div>
  );
}