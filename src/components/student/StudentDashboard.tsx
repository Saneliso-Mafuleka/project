import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, TrendingUp, Calendar, AlertCircle, CheckCircle, Award, Play, ExternalLink, Search, Bookmark, Download } from 'lucide-react';
import { mockCourses, mockAssignments, mockSchedule } from '../../lib/studentData';
import { LearningMaterial } from '../../types/learningMaterials';
import { learningMaterialsService } from '../../lib/learningMaterialsService';
import { MaterialViewer } from '../common/MaterialViewer';

const lessons = [
  { id: '1', name: 'Mathematics', url: '/lessons/lesson1.html', progress: 78 },
  { id: '2', name: 'English Literature', url: '/lessons/lesson2.html', progress: 85 },
  { id: '3', name: 'Science', url: '/lessons/lesson3.html', progress: 72 },
  { id: '4', name: 'History', url: '/lessons/lesson4.html', progress: 90 },
];

export function StudentDashboard() {
  const [availableMaterials, setAvailableMaterials] = useState<LearningMaterial[]>([]);
  const [viewingMaterial, setViewingMaterial] = useState<LearningMaterial | null>(null);
  const [materialsLoading, setMaterialsLoading] = useState(true);
  const [materialSearch, setMaterialSearch] = useState('');
  const [selectedMaterialType, setSelectedMaterialType] = useState('');
  const [openLesson, setOpenLesson] = useState<{ name: string; url: string } | null>(null);

  const todaySchedule = mockSchedule.filter(item => item.day === 'Monday').slice(0, 3);
  const upcomingAssignments = mockAssignments.filter(a => a.status === 'pending').slice(0, 3);
  const overallProgress = Math.round(mockCourses.reduce((acc, course) => acc + course.progress, 0) / mockCourses.length);
  const bookmarkedMaterials = availableMaterials.filter(m => m.bookmarked);

  useEffect(() => {
    loadAvailableMaterials();
  }, [materialSearch, selectedMaterialType]);

  const loadAvailableMaterials = async () => {
    setMaterialsLoading(true);
    try {
      const materials = await learningMaterialsService.getMaterials({
        search: materialSearch || undefined,
        type: selectedMaterialType || undefined,
        gradeLevel: 10 // Emma is in Grade 10
      });
      // Show both public materials and published materials
      const accessibleMaterials = materials.filter(m => m.isPublic || m.isPublished);
      setAvailableMaterials(accessibleMaterials);
    } catch (error) {
      console.error('Failed to load learning materials:', error);
    } finally {
      setMaterialsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return BookOpen;
      case 'video': return Play;
      case 'assignment': return AlertCircle;
      case 'quiz': return Award;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'bg-blue-100 text-blue-600';
      case 'video': return 'bg-red-100 text-red-600';
      case 'assignment': return 'bg-green-100 text-green-600';
      case 'quiz': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <>
      <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, Emma!</h2>
            <p className="text-blue-100 text-lg">Ready to continue your learning journey?</p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{overallProgress}%</div>
              <p className="text-sm text-blue-200">Overall Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{mockCourses.length}</p>
              <p className="text-sm text-gray-600">Active Courses</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{upcomingAssignments.length}</p>
              <p className="text-sm text-gray-600">Pending Tasks</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{overallProgress}%</p>
              <p className="text-sm text-gray-600">Avg. Progress</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{todaySchedule.length}</p>
              <p className="text-sm text-gray-600">Classes Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Courses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lessons Section */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Lessons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lessons.slice(0, 2).map((lesson, idx) => {
                // For the second card, use Lesson2.html title and file
                let lessonTitle = lesson.name;
                let lessonUrl = lesson.url;
                if (idx === 1) {
                  lessonTitle = 'Maths Farm: Pattern Detectives';
                  lessonUrl = '/lessons/Lesson2.html';
                }
                return (
                  <div key={lesson.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-900">{lessonTitle}</h4>
                    <div className="mb-2">
                      <span className="text-xs text-gray-500">Progress</span>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="h-2 rounded-full transition-all duration-300 bg-blue-500"
                          style={{ width: `${lesson.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-900">{lesson.progress}%</span>
                    </div>
                    <button
                      onClick={() => setOpenLesson({ name: lessonTitle, url: lessonUrl })}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Open
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Achievements</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Completed Mathematics Assignment</p>
                  <p className="text-xs text-gray-500">Score: 92/100 • Yesterday</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Perfect Attendance This Week</p>
                  <p className="text-xs text-gray-500">5 days • This week</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Improved Science Grade</p>
                  <p className="text-xs text-gray-500">From B+ to A- • Last week</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Materials Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Available Learning Materials</h3>
              <p className="text-gray-600">Explore additional learning resources to enhance your studies</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <select
                value={selectedMaterialType}
                onChange={(e) => setSelectedMaterialType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">All Types</option>
                <option value="lesson">Lessons</option>
                <option value="video">Videos</option>
                <option value="quiz">Quizzes</option>
              </select>
            </div>
          </div>

          {materialsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : availableMaterials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableMaterials.slice(0, 6).map((material) => {
                const TypeIcon = getTypeIcon(material.type);
                return (
                  <div key={material.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(material.type)}`}>
                        <TypeIcon className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-2">
                        {material.externalUrl && (
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                        )}
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {material.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">{material.title}</h4>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{material.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{material.estimatedDuration}min</span>
                      </div>
                      <span className="capitalize">{material.type}</span>
                    </div>
                    
                    <button
                      onClick={() => setViewingMaterial(material)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Play className="w-3 h-3" />
                      Start Learning
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Materials Found</h4>
              <p className="text-gray-600">Try adjusting your search or check back later for new content.</p>
            </div>
          )}

          {availableMaterials.length > 6 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => window.location.href = '/public-learning'}
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                View All Learning Materials ({availableMaterials.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
          {/* Quick Learning Stats */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Completed</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {availableMaterials.filter(m => m.completionStatus === 'completed').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">In Progress</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {availableMaterials.filter(m => m.completionStatus === 'in_progress').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-gray-700">Bookmarked</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {bookmarkedMaterials.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Downloaded</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {availableMaterials.filter(m => m.downloadable).length}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Learning Stats */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Completed</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {availableMaterials.filter(m => m.completionStatus === 'completed').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">In Progress</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {availableMaterials.filter(m => m.completionStatus === 'in_progress').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-gray-700">Bookmarked</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {bookmarkedMaterials.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Downloaded</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {availableMaterials.filter(m => m.downloadable).length}
                </span>
              </div>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              {todaySchedule.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 min-w-[60px]">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.courseName}</p>
                    <p className="text-xs text-gray-500">{item.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Assignments */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Assignments</h3>
            <div className="space-y-3">
              {upcomingAssignments.map((assignment) => (
                <div key={assignment.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{assignment.title}</h4>
                    {assignment.status === 'overdue' && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{assignment.courseName}</p>
                  <p className="text-xs text-gray-600">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lessons Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Lessons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-gray-900">{lesson.name}</h4>
              <div className="mb-2">
                <span className="text-xs text-gray-500">Progress</span>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="h-2 rounded-full transition-all duration-300 bg-blue-500"
                    style={{ width: `${lesson.progress}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-900">{lesson.progress}%</span>
              </div>
              <button
                onClick={() => setOpenLesson({ name: lesson.name, url: lesson.url })}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Open
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Lesson Popup */}
      {openLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-3xl relative">
            <button
              onClick={() => setOpenLesson(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-2">{openLesson.name}</h3>
            <iframe
              src={openLesson.url}
              title={openLesson.name}
              width="100%"
              height="500"
              className="rounded border"
            ></iframe>
          </div>
        </div>
      )}

      {/* Material Viewer Modal */}
      {/* Lesson Popup (iframe) */}
      {openLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-3xl relative">
            <button
              onClick={() => setOpenLesson(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-2">{openLesson.name}</h3>
            <iframe
              src={openLesson.url}
              title={openLesson.name}
              width="100%"
              height="500"
              className="rounded border"
            ></iframe>
          </div>
        </div>
      )}
      {/* Fallback for other material types */}
      {viewingMaterial && viewingMaterial.type !== 'lesson' && (
        <MaterialViewer
          material={viewingMaterial}
          onClose={() => setViewingMaterial(null)}
        />
      )}
    </>
  );
}