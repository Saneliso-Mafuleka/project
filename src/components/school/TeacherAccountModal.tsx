import React, { useState } from 'react';
import { X, Save, User, Mail, Phone, MapPin, Award, Plus, Trash2 } from 'lucide-react';
import { TeacherAccount, Qualification, Certification } from '../../types/school';
import { schoolService } from '../../lib/schoolService';

interface TeacherAccountModalProps {
  teacher?: TeacherAccount | null;
  schoolId: string;
  onClose: () => void;
  onSuccess: (teacher: TeacherAccount) => void;
}

export function TeacherAccountModal({ teacher, schoolId, onClose, onSuccess }: TeacherAccountModalProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: teacher?.personalInfo?.firstName || '',
      lastName: teacher?.personalInfo?.lastName || '',
      idNumber: teacher?.personalInfo?.idNumber || '',
      email: teacher?.personalInfo?.email || '',
      phone: teacher?.personalInfo?.phone || '',
      address: {
        street: teacher?.personalInfo?.address?.street || '',
        city: teacher?.personalInfo?.address?.city || '',
        province: teacher?.personalInfo?.address?.province || 'Western Cape',
        postalCode: teacher?.personalInfo?.address?.postalCode || ''
      },
      dateOfBirth: teacher?.personalInfo?.dateOfBirth || '',
      gender: teacher?.personalInfo?.gender || 'female' as const
    },
    professional: {
      employeeNumber: teacher?.professional?.employeeNumber || '',
      qualifications: teacher?.professional?.qualifications || [] as Qualification[],
      specializations: teacher?.professional?.specializations || [],
      experience: teacher?.professional?.experience || 0,
      certifications: teacher?.professional?.certifications || [] as Certification[],
      emergencyContact: {
        name: teacher?.professional?.emergencyContact?.name || '',
        relationship: teacher?.professional?.emergencyContact?.relationship || '',
        phone: teacher?.professional?.emergencyContact?.phone || ''
      }
    },
    assignments: teacher?.assignments || [],
    status: teacher?.status || 'active' as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const teacherData = {
        schoolId,
        ...formData,
        performance: teacher?.performance || {
          id: `perf_${Date.now()}`,
          teacherId: teacher?.id || '',
          academicYear: new Date().getFullYear().toString(),
          metrics: {
            workRate: {
              lessonPlanCompletion: 0,
              assignmentGradingSpeed: 0,
              attendanceRate: 0,
              punctualityScore: 0,
              extraCurricularParticipation: 0
            },
            studentPerformance: {
              averageClassGrade: 0,
              passRate: 0,
              improvementRate: 0,
              parentSatisfactionScore: 0
            },
            professionalDevelopment: {
              trainingHoursCompleted: 0,
              certificationsEarned: 0,
              workshopsAttended: 0,
              peerObservations: 0
            },
            collaboration: {
              teamProjectParticipation: 0,
              mentorshipActivities: 0,
              schoolEventParticipation: 0,
              parentCommunicationFrequency: 0
            }
          },
          evaluations: [],
          overallScore: 0,
          lastUpdated: new Date().toISOString()
        },
        startDate: teacher?.startDate || new Date().toISOString()
      };

      const validation = schoolService.validateTeacherAccount(teacherData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        setLoading(false);
        return;
      }

      let result: TeacherAccount;
      if (teacher) {
        result = await schoolService.updateTeacher(teacher.id, teacherData);
      } else {
        result = await schoolService.createTeacherAccount(teacherData);
      }

      onSuccess(result);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'An error occurred']);
    } finally {
      setLoading(false);
    }
  };

  const addQualification = () => {
    const newQualification: Qualification = {
      id: `qual_${Date.now()}`,
      degree: '',
      institution: '',
      year: new Date().getFullYear(),
      field: '',
      grade: ''
    };
    setFormData({
      ...formData,
      professional: {
        ...formData.professional,
        qualifications: [...formData.professional.qualifications, newQualification]
      }
    });
  };

  const removeQualification = (index: number) => {
    const qualifications = [...formData.professional.qualifications];
    qualifications.splice(index, 1);
    setFormData({
      ...formData,
      professional: {
        ...formData.professional,
        qualifications
      }
    });
  };

  const updateQualification = (index: number, field: keyof Qualification, value: any) => {
    const qualifications = [...formData.professional.qualifications];
    qualifications[index] = { ...qualifications[index], [field]: value };
    setFormData({
      ...formData,
      professional: {
        ...formData.professional,
        qualifications
      }
    });
  };

  const steps = [
    { id: 1, title: 'Personal Information', icon: User },
    { id: 2, title: 'Contact & Address', icon: MapPin },
    { id: 3, title: 'Professional Details', icon: Award }
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.personalInfo.firstName}
            onChange={(e) => setFormData({
              ...formData,
              personalInfo: { ...formData.personalInfo, firstName: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.personalInfo.lastName}
            onChange={(e) => setFormData({
              ...formData,
              personalInfo: { ...formData.personalInfo, lastName: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ID Number *
        </label>
        <input
          type="text"
          value={formData.personalInfo.idNumber}
          onChange={(e) => setFormData({
            ...formData,
            personalInfo: { ...formData.personalInfo, idNumber: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="13-digit ID number"
          maxLength={13}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            value={formData.personalInfo.dateOfBirth}
            onChange={(e) => setFormData({
              ...formData,
              personalInfo: { ...formData.personalInfo, dateOfBirth: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            value={formData.personalInfo.gender}
            onChange={(e) => setFormData({
              ...formData,
              personalInfo: { ...formData.personalInfo, gender: e.target.value as any }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Employee Number
        </label>
        <input
          type="text"
          value={formData.professional.employeeNumber}
          onChange={(e) => setFormData({
            ...formData,
            professional: { ...formData.professional, employeeNumber: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="EMP001"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) => setFormData({
              ...formData,
              personalInfo: { ...formData.personalInfo, email: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.personalInfo.phone}
            onChange={(e) => setFormData({
              ...formData,
              personalInfo: { ...formData.personalInfo, phone: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Street Address *
        </label>
        <input
          type="text"
          value={formData.personalInfo.address.street}
          onChange={(e) => setFormData({
            ...formData,
            personalInfo: {
              ...formData.personalInfo,
              address: { ...formData.personalInfo.address, street: e.target.value }
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={formData.personalInfo.address.city}
            onChange={(e) => setFormData({
              ...formData,
              personalInfo: {
                ...formData.personalInfo,
                address: { ...formData.personalInfo.address, city: e.target.value }
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Province *
          </label>
          <select
            value={formData.personalInfo.address.province}
            onChange={(e) => setFormData({
              ...formData,
              personalInfo: {
                ...formData.personalInfo,
                address: { ...formData.personalInfo.address, province: e.target.value }
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Western Cape">Western Cape</option>
            <option value="Eastern Cape">Eastern Cape</option>
            <option value="Northern Cape">Northern Cape</option>
            <option value="Free State">Free State</option>
            <option value="KwaZulu-Natal">KwaZulu-Natal</option>
            <option value="North West">North West</option>
            <option value="Gauteng">Gauteng</option>
            <option value="Mpumalanga">Mpumalanga</option>
            <option value="Limpopo">Limpopo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postal Code *
          </label>
          <input
            type="text"
            value={formData.personalInfo.address.postalCode}
            onChange={(e) => setFormData({
              ...formData,
              personalInfo: {
                ...formData.personalInfo,
                address: { ...formData.personalInfo.address, postalCode: e.target.value }
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h4>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Name *
            </label>
            <input
              type="text"
              value={formData.professional.emergencyContact.name}
              onChange={(e) => setFormData({
                ...formData,
                professional: {
                  ...formData.professional,
                  emergencyContact: { ...formData.professional.emergencyContact, name: e.target.value }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship *
            </label>
            <input
              type="text"
              value={formData.professional.emergencyContact.relationship}
              onChange={(e) => setFormData({
                ...formData,
                professional: {
                  ...formData.professional,
                  emergencyContact: { ...formData.professional.emergencyContact, relationship: e.target.value }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Spouse, Parent, Sibling"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone *
            </label>
            <input
              type="tel"
              value={formData.professional.emergencyContact.phone}
              onChange={(e) => setFormData({
                ...formData,
                professional: {
                  ...formData.professional,
                  emergencyContact: { ...formData.professional.emergencyContact, phone: e.target.value }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience
          </label>
          <input
            type="number"
            value={formData.professional.experience}
            onChange={(e) => setFormData({
              ...formData,
              professional: { ...formData.professional, experience: parseInt(e.target.value) || 0 }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            max="50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Specializations
        </label>
        <textarea
          value={formData.professional.specializations.join(', ')}
          onChange={(e) => setFormData({
            ...formData,
            professional: {
              ...formData.professional,
              specializations: e.target.value.split(',').map(s => s.trim()).filter(s => s)
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={2}
          placeholder="Mathematics, Natural Sciences, English"
        />
        <p className="text-xs text-gray-500 mt-1">Separate specializations with commas</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">Qualifications *</h4>
          <button
            type="button"
            onClick={addQualification}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Qualification
          </button>
        </div>

        <div className="space-y-4">
          {formData.professional.qualifications.map((qualification, index) => (
            <div key={qualification.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-gray-900">Qualification {index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeQualification(index)}
                  className="p-1 text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree/Qualification
                  </label>
                  <input
                    type="text"
                    value={qualification.degree}
                    onChange={(e) => updateQualification(index, 'degree', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bachelor of Education"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={qualification.institution}
                    onChange={(e) => updateQualification(index, 'institution', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="University of Cape Town"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year Completed
                  </label>
                  <input
                    type="number"
                    value={qualification.year}
                    onChange={(e) => updateQualification(index, 'year', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1950"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={qualification.field}
                    onChange={(e) => updateQualification(index, 'field', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Primary Education"
                  />
                </div>
              </div>
            </div>
          ))}

          {formData.professional.qualifications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Award className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No qualifications added yet</p>
              <p className="text-sm">Click "Add Qualification" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {teacher ? 'Update Teacher Account' : 'Create Teacher Account'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mt-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                    ${isActive ? 'border-blue-600 bg-blue-600 text-white' : 
                      isCompleted ? 'border-green-600 bg-green-600 text-white' : 
                      'border-gray-300 bg-white text-gray-400'}
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step Content */}
          <div className="mb-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h4>
              <ul className="text-sm text-red-600 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {loading ? 'Saving...' : (teacher ? 'Update Teacher' : 'Create Teacher')}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}