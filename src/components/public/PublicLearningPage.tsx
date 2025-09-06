import React, { useState, useEffect } from 'react';
import { BookOpen, Play, FileText, Award, Clock, Users, Search, Filter, ExternalLink } from 'lucide-react';
import { LearningMaterial } from '../../types/learningMaterials';
import { learningMaterialsService } from '../../lib/learningMaterialsService';
import { MaterialViewer } from '../common/MaterialViewer';
import { ConnectionIndicator } from '../common/ConnectionIndicator';

export function PublicLearningPage() {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(0);
  const [viewingMaterial, setViewingMaterial] = useState<LearningMaterial | null>(null);

  useEffect(() => {
    loadPublicMaterials();
  }, [searchQuery, selectedType, selectedGrade]);

  const loadPublicMaterials = async () => {
    setLoading(true);
    try {
      const publicMaterials = await learningMaterialsService.getMaterials({
        isPublic: true,
        search: searchQuery || undefined,
        type: selectedType || undefined,
        gradeLevel: selectedGrade || undefined
      });
      setMaterials(publicMaterials);
    } catch (error) {
      console.error('Failed to load public materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return BookOpen;
      case 'video': return Play;
      case 'assignment': return FileText;
      case 'quiz': return Award;
      default: return FileText;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <ConnectionIndicator />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Free Learning Resources</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access high-quality educational content to start your learning journey. 
              No registration required!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={0}>All Grades</option>
              {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="lesson">Lessons</option>
              <option value="video">Videos</option>
              <option value="assignment">Assignments</option>
              <option value="quiz">Quizzes</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              {materials.length} resources available
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        {materials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => {
              const TypeIcon = getTypeIcon(material.type);
              return (
                <div key={material.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2 rounded-lg ${getTypeColor(material.type)}`}>
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        Grade {material.gradeLevel}
                      </span>
                      {material.externalUrl && (
                        <ExternalLink className="w-4 h-4 text-gray-400" />
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
                      <span className="capitalize">{material.difficulty}</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {material.subject}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setViewingMaterial(material)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Start Learning
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Materials Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Want Access to More Content?</h2>
          <p className="text-blue-100 mb-6">
            Register for our math program to access personalized learning paths, 
            assignments, and direct teacher support.
          </p>
          <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
            Apply for Registration
          </button>
        </div>
      </div>

      {/* Material Viewer */}
      {viewingMaterial && (
        <MaterialViewer
          material={viewingMaterial}
          onClose={() => setViewingMaterial(null)}
        />
      )}
    </div>
  );
}