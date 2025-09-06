import React, { useState } from 'react';
import { X, Save, Building, MapPin, Phone, Mail, User, Calendar, Award } from 'lucide-react';
import { School } from '../../types/school';
import { schoolService } from '../../lib/schoolService';

interface SchoolRegistrationModalProps {
  school?: School | null;
  onClose: () => void;
  onSuccess: (school: School) => void;
}

export function SchoolRegistrationModal({ school, onClose, onSuccess }: SchoolRegistrationModalProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: school?.name || '',
    registrationNumber: school?.registrationNumber || '',
    type: school?.type || 'public' as const,
    level: school?.level || 'primary' as const,
    address: {
      street: school?.address?.street || '',
      city: school?.address?.city || '',
      province: school?.address?.province || 'Western Cape',
      postalCode: school?.address?.postalCode || '',
      country: school?.address?.country || 'South Africa'
    },
    contact: {
      phone: school?.contact?.phone || '',
      email: school?.contact?.email || '',
      website: school?.contact?.website || '',
      fax: school?.contact?.fax || ''
    },
    principal: {
      name: school?.principal?.name || '',
      email: school?.principal?.email || '',
      phone: school?.principal?.phone || '',
      qualifications: school?.principal?.qualifications || []
    },
    establishment: {
      foundedYear: school?.establishment?.foundedYear || new Date().getFullYear(),
      accreditation: school?.establishment?.accreditation || [],
      curriculum: school?.establishment?.curriculum || []
    },
    capacity: {
      totalStudents: school?.capacity?.totalStudents || 0,
      totalTeachers: school?.capacity?.totalTeachers || 0,
      classrooms: school?.capacity?.classrooms || 0,
      grades: school?.capacity?.grades || []
    },
    facilities: school?.facilities || [],
    status: school?.status || 'pending_approval' as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const validation = schoolService.validateSchoolRegistration(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        setLoading(false);
        return;
      }

      let result: School;
      if (school) {
        result = await schoolService.updateSchool(school.id, formData);
      } else {
        result = await schoolService.registerSchool({
          ...formData,
          documents: []
        });
      }

      onSuccess(result);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'An error occurred']);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Basic Information', icon: Building },
    { id: 2, title: 'Contact & Address', icon: MapPin },
    { id: 3, title: 'Principal Details', icon: User },
    { id: 4, title: 'School Details', icon: Award }
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter school name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Registration Number *
        </label>
        <input
          type="text"
          value={formData.registrationNumber}
          onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., GPS2024001"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Format: 2-3 letters followed by 4-7 digits</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="public">Public School</option>
            <option value="private">Private School</option>
            <option value="charter">Charter School</option>
            <option value="international">International School</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School Level *
          </label>
          <select
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="primary">Primary School</option>
            <option value="secondary">Secondary School</option>
            <option value="combined">Combined School</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Street Address *
        </label>
        <input
          type="text"
          value={formData.address.street}
          onChange={(e) => setFormData({ 
            ...formData, 
            address: { ...formData.address, street: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter street address"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={formData.address.city}
            onChange={(e) => setFormData({ 
              ...formData, 
              address: { ...formData.address, city: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter city"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Province *
          </label>
          <select
            value={formData.address.province}
            onChange={(e) => setFormData({ 
              ...formData, 
              address: { ...formData.address, province: e.target.value }
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
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Postal Code *
        </label>
        <input
          type="text"
          value={formData.address.postalCode}
          onChange={(e) => setFormData({ 
            ...formData, 
            address: { ...formData.address, postalCode: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter postal code"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.contact.phone}
            onChange={(e) => setFormData({ 
              ...formData, 
              contact: { ...formData.contact, phone: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+27 21 123 4567"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.contact.email}
            onChange={(e) => setFormData({ 
              ...formData, 
              contact: { ...formData.contact, email: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="info@school.edu.za"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Website (Optional)
        </label>
        <input
          type="url"
          value={formData.contact.website}
          onChange={(e) => setFormData({ 
            ...formData, 
            contact: { ...formData.contact, website: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="www.school.edu.za"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Principal Name *
        </label>
        <input
          type="text"
          value={formData.principal.name}
          onChange={(e) => setFormData({ 
            ...formData, 
            principal: { ...formData.principal, name: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Dr. Sarah Johnson"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Principal Email *
          </label>
          <input
            type="email"
            value={formData.principal.email}
            onChange={(e) => setFormData({ 
              ...formData, 
              principal: { ...formData.principal, email: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="principal@school.edu.za"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Principal Phone *
          </label>
          <input
            type="tel"
            value={formData.principal.phone}
            onChange={(e) => setFormData({ 
              ...formData, 
              principal: { ...formData.principal, phone: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+27 21 123 4568"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Principal Qualifications
        </label>
        <textarea
          value={formData.principal.qualifications.join(', ')}
          onChange={(e) => setFormData({ 
            ...formData, 
            principal: { 
              ...formData.principal, 
              qualifications: e.target.value.split(',').map(q => q.trim()).filter(q => q)
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="PhD Education Management, MEd Curriculum Studies"
        />
        <p className="text-xs text-gray-500 mt-1">Separate multiple qualifications with commas</p>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Founded Year
        </label>
        <input
          type="number"
          value={formData.establishment.foundedYear}
          onChange={(e) => setFormData({ 
            ...formData, 
            establishment: { ...formData.establishment, foundedYear: parseInt(e.target.value) }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min="1800"
          max={new Date().getFullYear()}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Students
          </label>
          <input
            type="number"
            value={formData.capacity.totalStudents}
            onChange={(e) => setFormData({ 
              ...formData, 
              capacity: { ...formData.capacity, totalStudents: parseInt(e.target.value) || 0 }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Teachers
          </label>
          <input
            type="number"
            value={formData.capacity.totalTeachers}
            onChange={(e) => setFormData({ 
              ...formData, 
              capacity: { ...formData.capacity, totalTeachers: parseInt(e.target.value) || 0 }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Classrooms
          </label>
          <input
            type="number"
            value={formData.capacity.classrooms}
            onChange={(e) => setFormData({ 
              ...formData, 
              capacity: { ...formData.capacity, classrooms: parseInt(e.target.value) || 0 }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Grades Offered
        </label>
        <textarea
          value={formData.capacity.grades.join(', ')}
          onChange={(e) => setFormData({ 
            ...formData, 
            capacity: { 
              ...formData.capacity, 
              grades: e.target.value.split(',').map(g => g.trim()).filter(g => g)
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={2}
          placeholder="Grade R, Grade 1, Grade 2, Grade 3"
        />
        <p className="text-xs text-gray-500 mt-1">Separate grades with commas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School Facilities
        </label>
        <textarea
          value={formData.facilities.join(', ')}
          onChange={(e) => setFormData({ 
            ...formData, 
            facilities: e.target.value.split(',').map(f => f.trim()).filter(f => f)
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Library, Computer Lab, Science Lab, Sports Field"
        />
        <p className="text-xs text-gray-500 mt-1">Separate facilities with commas</p>
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
              {school ? 'Update School Information' : 'Register New School'}
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
            {currentStep === 4 && renderStep4()}
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
                  {loading ? 'Saving...' : (school ? 'Update School' : 'Register School')}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}