import React, { useState, useEffect } from 'react';
import { X, Save, BookOpen, FileText, Award, Play, Clock, Users, Upload, Trash2, Eye, Download } from 'lucide-react';
import { LearningMaterial } from '../../types/learningMaterials';

interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

interface MaterialModalProps {
  material: LearningMaterial | null;
  onClose: () => void;
  onSave: (materialData: Partial<LearningMaterial>) => void;
}

export function MaterialModal({ material, onClose, onSave }: MaterialModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'lesson' as const,
    subject: 'Mathematics',
    gradeLevel: 6,
    difficulty: 'beginner' as const,
    content: '',
    tags: [] as string[],
    estimatedDuration: 30,
    isPublished: false,
    isPublic: false,
    instructions: '',
    maxScore: 100,
    externalUrl: ''
  });

  useEffect(() => {
    if (material) {
      setFormData({
        title: material.title,
        description: material.description,
        type: material.type,
        subject: material.subject,
        gradeLevel: material.gradeLevel,
        difficulty: material.difficulty,
        content: material.content,
        tags: material.tags,
        estimatedDuration: material.estimatedDuration,
        isPublished: material.isPublished,
        isPublic: material.isPublic || false,
        instructions: material.instructions || '',
        maxScore: material.maxScore || 100,
        externalUrl: material.externalUrl || ''
      });
      
      // Load existing attachments as uploaded files
      if (material.attachments) {
        const files: FileUpload[] = material.attachments.map(attachment => ({
          id: attachment.id,
          name: attachment.name,
          size: attachment.size,
          type: attachment.type,
          url: attachment.url,
          uploadedAt: attachment.uploadedAt
        }));
        setUploadedFiles(files);
      }
    }
  }, [material]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert uploaded files to attachments format
      const attachments = uploadedFiles.map(file => ({
        id: file.id,
        name: file.name,
        url: file.url,
        type: file.type as any,
        size: file.size,
        uploadedAt: file.uploadedAt
      }));
      
      await onSave({
        ...formData,
        attachments
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
          continue;
        }

        // Create a data URL for the file (in a real app, you'd upload to a server)
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        const newFile: FileUpload = {
          id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          url: dataUrl,
          uploadedAt: new Date().toISOString()
        };

        setUploadedFiles(prev => [...prev, newFile]);
      }
    } catch (error) {
      console.error('File upload failed:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
      // Clear the input
      event.target.value = '';
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('presentation') || type.includes('powerpoint')) return '📊';
    if (type.includes('spreadsheet') || type.includes('excel')) return '📈';
    return '📎';
  };

  const materialTypes = [
    { value: 'lesson', label: 'Lesson', icon: BookOpen, description: 'Educational content and explanations' },
    { value: 'assignment', label: 'Assignment', icon: FileText, description: 'Tasks for students to complete' },
    { value: 'quiz', label: 'Quiz', icon: Award, description: 'Assessment and testing materials' },
    { value: 'video', label: 'Video', icon: Play, description: 'Video content and tutorials' },
    { value: 'document', label: 'Document', icon: FileText, description: 'Reference materials and handouts' },
    { value: 'pdf', label: 'PDF', icon: FileText, description: 'PDF documents and textbooks' }
  ];

  const showScoreField = formData.type === 'quiz' || formData.type === 'assignment';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {material ? 'Edit Learning Material' : 'Create Learning Material'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter material title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mathematics"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Describe what this material covers..."
              required
            />
          </div>

          {/* Material Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Material Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {materialTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.type === type.value;
                
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value as any })}
                    className={`
                      p-4 border-2 rounded-lg text-left transition-all
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                      <span className="font-medium">{type.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* External URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              External URL (Optional)
            </label>
            <input
              type="url"
              value={formData.externalUrl}
              onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://www.khanacademy.org/math/..."
            />
            <p className="text-xs text-gray-500 mt-1">Link to external content (e.g., Khan Academy, YouTube)</p>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade Level *
              </label>
              <select
                value={formData.gradeLevel}
                onChange={(e) => setFormData({ ...formData, gradeLevel: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="300"
              />
            </div>
          </div>

          {/* Score Field for Quizzes and Assignments */}
          {showScoreField && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Score
              </label>
              <input
                type="number"
                value={formData.maxScore}
                onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="1000"
              />
            </div>
          )}

          {/* Instructions for Assignments */}
          {formData.type === 'assignment' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Provide detailed instructions for students..."
              />
            </div>
          )}

          {/* Content */}
          {!formData.externalUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={8}
                placeholder="Enter the main content here. You can use markdown formatting..."
                required={!formData.externalUrl}
              />
              <p className="text-xs text-gray-500 mt-1">Supports markdown formatting</p>
            </div>
          )}

          {/* File Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              File Attachments
            </label>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.zip"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {uploading ? 'Uploading...' : 'Click to upload files'}
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, PPT, images, videos, and more (max 10MB each)
                </p>
              </label>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Uploaded Files ({uploadedFiles.length})</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getFileIcon(file.type)}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => window.open(file.url, '_blank')}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Preview file"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = file.url;
                            link.download = file.name;
                            link.click();
                          }}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Download file"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(file.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => setFormData({ 
                ...formData, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="algebra, equations, basics (separate with commas)"
            />
          </div>

          {/* Publishing Options */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Publish immediately</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Make publicly accessible</span>
            </label>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {formData.isPublic 
              ? 'Available to all users, even without login' 
              : 'Only available to enrolled students'
            }
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
            >
              {loading || uploading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {loading ? 'Saving...' : uploading ? 'Uploading...' : (material ? 'Update Material' : 'Create Material')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}