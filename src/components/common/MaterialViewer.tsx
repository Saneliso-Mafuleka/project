import React from 'react';
import { X, ExternalLink, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { LearningMaterial } from '../../types/learningMaterials';
import { useConnectionStatus } from '../../hooks/useConnectionStatus';

interface MaterialViewerProps {
  material: LearningMaterial;
  onClose: () => void;
}

export function MaterialViewer({ material, onClose }: MaterialViewerProps) {
  const { isOnline } = useConnectionStatus();

  const renderContent = () => {
    // If material has external URL
    if (material.externalUrl) {
      if (!isOnline) {
        return (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <WifiOff className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Internet Connection Required</h3>
            <p className="text-gray-600 mb-4">
              This content requires an internet connection to view. Please check your connection and try again.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900">External Content</p>
                  <p className="text-sm text-blue-700 mt-1">
                    This material links to external content that cannot be cached for offline viewing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="h-full">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">External Content</span>
              <a
                href={material.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Open in new tab
              </a>
            </div>
          </div>
          <iframe
            src={material.externalUrl}
            className="w-full h-96 border border-gray-300 rounded-lg"
            title={material.title}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      );
    }

    // Render internal markdown content
    return (
      <div className="prose max-w-none">
        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {material.content}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{material.title}</h2>
              <p className="text-gray-600 mt-1">{material.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span>Subject: {material.subject}</span>
                <span>Grade: {material.gradeLevel}</span>
                <span>Duration: {material.estimatedDuration} min</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  material.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  material.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {material.difficulty}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {material.instructions && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Instructions</h3>
              <p className="text-sm text-blue-800">{material.instructions}</p>
            </div>
          )}

          {renderContent()}

          {/* Tags */}
          {material.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {material.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Progress and Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {progress?.timeSpent && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{progress.timeSpent + timeSpent} min spent</span>
                  </div>
                )}
                {progress?.lastAccessed && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>Last viewed {new Date(progress.lastAccessed).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              {progress?.status !== 'completed' && (
                <button
                  onClick={handleMarkComplete}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Award className="w-4 h-4" />
                  Mark Complete
                </button>
              )}
            </div>
          </div>

          {/* Progress and Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {progress?.timeSpent && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{progress.timeSpent + timeSpent} min spent</span>
                  </div>
                )}
                {progress?.lastAccessed && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>Last viewed {new Date(progress.lastAccessed).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              {progress?.status !== 'completed' && (
                <button
                  onClick={handleMarkComplete}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Award className="w-4 h-4" />
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}