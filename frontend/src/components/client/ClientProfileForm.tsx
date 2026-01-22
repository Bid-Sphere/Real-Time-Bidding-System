import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Building2, User, FileText, Briefcase, Upload, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { ClientProfile, Attachment } from '../../types/client';

interface ClientProfileFormProps {
  profile: ClientProfile;
  onSave: (data: Partial<ClientProfile>) => Promise<void>;
  isLoading?: boolean;
}

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Construction',
  'Marketing',
  'Consulting',
  'Real Estate',
  'Entertainment',
  'Non-profit',
  'Government',
  'Other',
];

const COMPANY_SIZES = [
  'Startup (1-10 employees)',
  'Small (11-50 employees)',
  'Medium (51-200 employees)',
  'Large (201-500 employees)',
  'Enterprise (500+ employees)',
];

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Australia',
  'India',
  'Singapore',
  'Other',
];

const BUDGET_RANGES = [
  'Under $1,000',
  '$1,000 - $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000+',
];

const PROJECT_FREQUENCIES = [
  'One-time project',
  'Occasional (few times a year)',
  'Regular (monthly)',
  'Frequent (weekly)',
];

export const ClientProfileForm: React.FC<ClientProfileFormProps> = ({
  profile,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<ClientProfile>>({
    fullName: profile.fullName || '',
    companyName: profile.companyName || '',
    industry: profile.industry || '',
    companySize: profile.companySize || '',
    website: profile.website || '',
    taxId: profile.taxId || '',
    businessRegistrationNumber: profile.businessRegistrationNumber || '',
    contactPersonRole: profile.contactPersonRole || '',
    phoneNumber: profile.phoneNumber || '',
    businessAddress: profile.businessAddress || '',
    country: profile.country || '',
    timeZone: profile.timeZone || '',
    companyDescription: profile.companyDescription || '',
    projectDescription: profile.projectDescription || '',
    projectDocuments: profile.projectDocuments || [],
    yearsInBusiness: profile.yearsInBusiness || undefined,
    annualRevenue: profile.annualRevenue || '',
    linkedInProfile: profile.linkedInProfile || '',
    preferredCategories: profile.preferredCategories || [],
    typicalBudgetRange: profile.typicalBudgetRange || '',
    projectFrequency: profile.projectFrequency || '',
    communicationMethod: profile.communicationMethod || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({
      fullName: profile.fullName || '',
      companyName: profile.companyName || '',
      industry: profile.industry || '',
      companySize: profile.companySize || '',
      website: profile.website || '',
      taxId: profile.taxId || '',
      businessRegistrationNumber: profile.businessRegistrationNumber || '',
      contactPersonRole: profile.contactPersonRole || '',
      phoneNumber: profile.phoneNumber || '',
      businessAddress: profile.businessAddress || '',
      country: profile.country || '',
      timeZone: profile.timeZone || '',
      companyDescription: profile.companyDescription || '',
      projectDescription: profile.projectDescription || '',
      projectDocuments: profile.projectDocuments || [],
      yearsInBusiness: profile.yearsInBusiness || undefined,
      annualRevenue: profile.annualRevenue || '',
      linkedInProfile: profile.linkedInProfile || '',
      preferredCategories: profile.preferredCategories || [],
      typicalBudgetRange: profile.typicalBudgetRange || '',
      projectFrequency: profile.projectFrequency || '',
      communicationMethod: profile.communicationMethod || '',
    });
  }, [profile]);

  const handleChange = (field: keyof ClientProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.companyName?.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }

    if (!formData.contactPersonRole?.trim()) {
      newErrors.contactPersonRole = 'Your role/position is required';
    }

    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
    }

    if (formData.linkedInProfile && !isValidUrl(formData.linkedInProfile)) {
      newErrors.linkedInProfile = 'Please enter a valid LinkedIn URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleArrayFieldChange = (
    field: 'preferredCategories',
    value: string
  ) => {
    const items = value.split(',').map((item) => item.trim()).filter(Boolean);
    handleChange(field, items);
  };

  const handleProjectDocumentsUpload = (files: File[]) => {
    const validFiles = files.filter(file => {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/rtf'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a supported format. Please upload PDF, Word, or text documents.`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      // Convert files to Attachment objects
      const newDocuments: Attachment[] = validFiles.map(file => ({
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        filename: file.name,
        url: URL.createObjectURL(file), // Temporary URL for preview
        size: file.size,
        mimeType: file.type
      }));

      setFormData(prev => ({
        ...prev,
        projectDocuments: [...(prev.projectDocuments || []), ...newDocuments]
      }));
    }
  };

  const removeProjectDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projectDocuments: prev.projectDocuments?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Personal Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Full Name"
              required
              type="text"
              value={formData.fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              error={errors.fullName}
            />
          </div>

          <div>
            <Input
              label="Your Role/Position"
              required
              type="text"
              value={formData.contactPersonRole}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('contactPersonRole', e.target.value)}
              placeholder="e.g., CEO, Project Manager, Founder"
              error={errors.contactPersonRole}
            />
          </div>

          <div>
            <Input
              label="Phone Number"
              required
              type="tel"
              value={formData.phoneNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('phoneNumber', e.target.value)}
              placeholder="+1 (555) 123-4567"
              error={errors.phoneNumber}
            />
          </div>

          <div>
            <Select
              label="Country"
              required
              value={formData.country}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('country', e.target.value)}
              error={errors.country}
              options={COUNTRIES.map((country) => ({ value: country, label: country }))}
            />
          </div>
        </div>
      </motion.div>

      {/* Company Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Company Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Company/Organization Name"
              required
              type="text"
              value={formData.companyName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('companyName', e.target.value)}
              placeholder="Enter company name"
              error={errors.companyName}
            />
          </div>

          <div>
            <Select
              label="Industry"
              required
              value={formData.industry}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('industry', e.target.value)}
              error={errors.industry}
              options={INDUSTRIES.map((industry) => ({ value: industry, label: industry }))}
            />
          </div>

          <div>
            <Select
              label="Company Size"
              value={formData.companySize}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('companySize', e.target.value)}
              options={COMPANY_SIZES.map((size) => ({ value: size, label: size }))}
            />
          </div>

          <div>
            <Input
              label="Website"
              type="url"
              value={formData.website}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('website', e.target.value)}
              placeholder="https://example.com"
              error={errors.website}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Business Address"
              type="text"
              value={formData.businessAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('businessAddress', e.target.value)}
              placeholder="Street, City, State, ZIP"
            />
          </div>

          <div>
            <Input
              label="Years in Business"
              type="number"
              value={formData.yearsInBusiness || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('yearsInBusiness', parseInt(e.target.value) || undefined)}
              placeholder="e.g., 5"
              min="0"
            />
          </div>

          <div>
            <Input
              label="Annual Revenue"
              type="text"
              value={formData.annualRevenue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('annualRevenue', e.target.value)}
              placeholder="e.g., $1M - $5M"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Company Description
          </label>
          <textarea
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            value={formData.companyDescription}
            onChange={(e) => handleChange('companyDescription', e.target.value)}
            placeholder="Brief description of your company and what you do..."
          />
        </div>

        {/* Project Description Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Typical Project Description
          </label>
          <textarea
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={6}
            value={formData.projectDescription || ''}
            onChange={(e) => handleChange('projectDescription', e.target.value)}
            placeholder="Describe the types of projects you typically need help with, your requirements, and what you're looking for in service providers..."
          />
          <p className="text-xs text-gray-500 mt-1">
            This helps service providers understand your needs and provide better proposals
          </p>
        </div>

        {/* Project Documents Upload Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Description Documents
          </label>
          <div 
            className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => document.getElementById('project-docs-upload')?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('border-blue-500');
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-blue-500');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-blue-500');
              const files = Array.from(e.dataTransfer.files);
              handleProjectDocumentsUpload(files);
            }}
          >
            <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-sm text-gray-400">
              Drop project documents here or click to upload
            </p>
            <p className="text-xs text-gray-600 mt-1">
              PDFs, Word docs, project specs, requirements (max 10MB each)
            </p>
            <input
              id="project-docs-upload"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.rtf"
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                handleProjectDocumentsUpload(files);
              }}
            />
          </div>
          
          {/* Display uploaded project documents */}
          {formData.projectDocuments && formData.projectDocuments.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-medium text-gray-300">Uploaded Documents:</p>
              {formData.projectDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-white">{doc.filename}</p>
                      <p className="text-xs text-gray-400">
                        {(doc.size / 1024 / 1024).toFixed(2)} MB • {doc.mimeType}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProjectDocument(index)}
                    className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-2">
            Upload documents that describe your typical project requirements, specifications, or examples of past projects. This helps service providers understand your needs better.
          </p>
        </div>
      </motion.div>

      {/* Business Registration Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Business Registration (Optional)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Tax ID"
              type="text"
              value={formData.taxId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('taxId', e.target.value)}
              placeholder="Enter tax ID"
            />
          </div>

          <div>
            <Input
              label="Business Registration Number"
              type="text"
              value={formData.businessRegistrationNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('businessRegistrationNumber', e.target.value)}
              placeholder="Enter registration number"
            />
          </div>
        </div>
      </motion.div>

      {/* Project Preferences Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Project Preferences</h3>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Select
                label="Typical Budget Range"
                value={formData.typicalBudgetRange}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('typicalBudgetRange', e.target.value)}
                options={BUDGET_RANGES.map((range) => ({ value: range, label: range }))}
              />
            </div>

            <div>
              <Select
                label="Project Frequency"
                value={formData.projectFrequency}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('projectFrequency', e.target.value)}
                options={PROJECT_FREQUENCIES.map((freq) => ({ value: freq, label: freq }))}
              />
            </div>
          </div>

          <div>
            <Input
              label="Preferred Categories"
              type="text"
              value={formData.preferredCategories?.join(', ')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleArrayFieldChange('preferredCategories', e.target.value)}
              placeholder="Web Development, Mobile Apps, Design, etc. (comma-separated)"
              helperText="Separate multiple categories with commas"
            />
          </div>

          <div>
            <Input
              label="Preferred Communication Method"
              type="text"
              value={formData.communicationMethod}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('communicationMethod', e.target.value)}
              placeholder="e.g., Email, Slack, Video calls"
            />
          </div>

          <div>
            <Input
              label="LinkedIn Profile"
              type="url"
              value={formData.linkedInProfile}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('linkedInProfile', e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              error={errors.linkedInProfile}
            />
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSaving || isLoading}
          className="min-w-[150px]"
        >
          {isSaving || isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </form>
  );
};