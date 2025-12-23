import { useState } from 'react';
import { X, Upload, Calendar, DollarSign, MapPin, Clock, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import MultiSelect from '@/components/ui/MultiSelect';
import type { CreateProjectData, ProjectCategory, BiddingType, ProjectVisibility } from '../../types/project';

interface PostProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProjectData) => void;
}

interface AttachedUrl {
  id: string;
  url: string;
  title: string;
}

const skillOptions = [
  'React', 'Node.js', 'Python', 'Java', 'JavaScript', 'TypeScript',
  'Construction Management', 'Civil Engineering', 'Architecture',
  'Supply Chain', 'Logistics', 'Procurement', 'Quality Control'
];

export default function PostProjectModal({ isOpen, onClose, onSubmit }: PostProjectModalProps) {
  const [formData, setFormData] = useState<Partial<CreateProjectData>>({
    title: '',
    category: 'IT',
    description: '',
    requiredSkills: [],
    location: '',
    deadline: new Date(),
    isStrictDeadline: false,
    biddingType: 'standard_bidding',
    budget: 0,
    biddingDuration: 7,
    visibility: 'both',
    attachments: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title || formData.title.length < 5) {
        newErrors.title = 'Title must be at least 5 characters';
      }
      if (!formData.category) {
        newErrors.category = 'Category is required';
      }
      if (!formData.description || formData.description.length < 50) {
        newErrors.description = 'Description must be at least 50 characters';
      }
    }

    if (step === 2) {
      if (!formData.requiredSkills || formData.requiredSkills.length === 0) {
        newErrors.requiredSkills = 'At least one skill is required';
      }
      if (!formData.deadline) {
        newErrors.deadline = 'Deadline is required';
      }
    }

    if (step === 3) {
      if (!formData.budget || formData.budget <= 0) {
        newErrors.budget = 'Budget must be greater than 0';
      }
      if (!formData.biddingDuration || formData.biddingDuration <= 0) {
        newErrors.biddingDuration = 'Bidding duration must be greater than 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      onSubmit(formData as CreateProjectData);
      onClose();
    }
  };

  const updateFormData = (field: keyof CreateProjectData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (files: File[]) => {
    const validFiles = files.filter(file => {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a supported format.`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...validFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Post New Project
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-[var(--text-secondary)]" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                Basic Information
              </h3>
              
              <Input
                label="Project Title"
                placeholder="Enter project title"
                value={formData.title || ''}
                onChange={(e) => updateFormData('title', e.target.value)}
                error={errors.title}
                required
                maxLength={100}
              />

              <Select
                label="Category"
                options={[
                  { value: 'IT', label: 'IT' },
                  { value: 'Construction', label: 'Construction' },
                  { value: 'Supply', label: 'Supply' }
                ]}
                value={formData.category || 'IT'}
                onChange={(e) => updateFormData('category', e.target.value as ProjectCategory)}
                error={errors.category}
                required
              />

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-[var(--border-light)] rounded-lg bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue)]/20 transition-all"
                  rows={6}
                  placeholder="Describe your project in detail (minimum 50 characters)"
                  value={formData.description || ''}
                  onChange={(e) => updateFormData('description', e.target.value)}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-red-500">{errors.description}</span>
                  <span className="text-sm text-[var(--text-muted)]">
                    {(formData.description || '').length}/50 min
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Attachments
                </label>
                <div 
                  className="border-2 border-dashed border-[var(--border-light)] rounded-lg p-6 text-center hover:border-[var(--accent-blue)] transition-colors cursor-pointer"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('border-[var(--accent-blue)]');
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-[var(--accent-blue)]');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-[var(--accent-blue)]');
                    const files = Array.from(e.dataTransfer.files);
                    handleFileUpload(files);
                  }}
                >
                  <Upload className="h-8 w-8 text-[var(--text-muted)] mx-auto mb-2" />
                  <p className="text-sm text-[var(--text-secondary)]">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    PDFs, images, specs (max 10MB each)
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      handleFileUpload(files);
                    }}
                  />
                </div>
                
                {/* Display uploaded files */}
                {formData.attachments && formData.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-[var(--bg-secondary)] rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[var(--text-muted)]" />
                          <span className="text-sm text-[var(--text-primary)]">{file.name}</span>
                          <span className="text-xs text-[var(--text-muted)]">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1 hover:bg-[var(--bg-input)] rounded text-[var(--text-muted)] hover:text-red-400 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                Project Requirements
              </h3>

              <MultiSelect
                label="Required Skills/Qualifications"
                options={skillOptions}
                value={formData.requiredSkills || []}
                onChange={(skills) => updateFormData('requiredSkills', skills)}
                error={errors.requiredSkills}
                placeholder="Select required skills"
              />

              <Input
                label="Location"
                placeholder="Enter project location (if applicable)"
                value={formData.location || ''}
                onChange={(e) => updateFormData('location', e.target.value)}
                leftIcon={<MapPin className="h-4 w-4" />}
              />

              <Input
                label="Timeline/Deadline"
                type="date"
                value={formData.deadline ? formData.deadline.toISOString().split('T')[0] : ''}
                onChange={(e) => updateFormData('deadline', new Date(e.target.value))}
                error={errors.deadline}
                leftIcon={<Calendar className="h-4 w-4" />}
                required
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="strictDeadline"
                  checked={formData.isStrictDeadline || false}
                  onChange={(e) => updateFormData('isStrictDeadline', e.target.checked)}
                  className="w-4 h-4 text-[var(--accent-blue)] bg-[var(--bg-input)] border-[var(--border-light)] rounded focus:ring-[var(--accent-blue)]"
                />
                <label htmlFor="strictDeadline" className="text-sm text-[var(--text-primary)]">
                  Strict Deadline (non-negotiable timeline)
                </label>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                Bidding Configuration
              </h3>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                  Bidding Type <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-[var(--border-light)] rounded-lg cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors">
                    <input
                      type="radio"
                      name="biddingType"
                      value="live_auction"
                      checked={formData.biddingType === 'live_auction'}
                      onChange={(e) => updateFormData('biddingType', e.target.value as BiddingType)}
                      className="w-4 h-4 text-[var(--accent-blue)]"
                    />
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">⚡ Live Auction</div>
                      <div className="text-sm text-[var(--text-secondary)]">
                        Real-time competitive bidding
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-[var(--border-light)] rounded-lg cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors">
                    <input
                      type="radio"
                      name="biddingType"
                      value="standard_bidding"
                      checked={formData.biddingType === 'standard_bidding'}
                      onChange={(e) => updateFormData('biddingType', e.target.value as BiddingType)}
                      className="w-4 h-4 text-[var(--accent-blue)]"
                    />
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">📋 Standard Bidding</div>
                      <div className="text-sm text-[var(--text-secondary)]">
                        Submit bids within timeframe
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <Input
                label="Starting Bid/Budget"
                type="number"
                placeholder="Enter budget amount"
                value={formData.budget || ''}
                onChange={(e) => updateFormData('budget', parseFloat(e.target.value) || 0)}
                error={errors.budget}
                leftIcon={<DollarSign className="h-4 w-4" />}
                required
              />

              <Input
                label={`Bidding Duration (${formData.biddingType === 'live_auction' ? 'hours' : 'days'})`}
                type="number"
                placeholder={`Enter duration in ${formData.biddingType === 'live_auction' ? 'hours' : 'days'}`}
                value={formData.biddingDuration || ''}
                onChange={(e) => updateFormData('biddingDuration', parseInt(e.target.value) || 0)}
                error={errors.biddingDuration}
                leftIcon={<Clock className="h-4 w-4" />}
                required
              />

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                  Visibility <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'organizations_only', label: '🏢 Organizations Only', desc: 'Only organizations can bid' },
                    { value: 'freelancers_only', label: '👤 Open to Freelancers', desc: 'Only freelancers can bid' },
                    { value: 'both', label: '🌐 Both Organizations and Freelancers', desc: 'Open to everyone' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 p-3 border border-[var(--border-light)] rounded-lg cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors">
                      <input
                        type="radio"
                        name="visibility"
                        value={option.value}
                        checked={formData.visibility === option.value}
                        onChange={(e) => updateFormData('visibility', e.target.value as ProjectVisibility)}
                        className="w-4 h-4 text-[var(--accent-blue)]"
                      />
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">{option.label}</div>
                        <div className="text-sm text-[var(--text-secondary)]">
                          {option.desc}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border-light)]">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {currentStep < 3 ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  Post Project
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}