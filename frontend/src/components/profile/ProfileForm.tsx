import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, Building2, User, FileText, Briefcase } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { OrganizationProfile } from '@/types/organization';

interface ProfileFormProps {
  profile: OrganizationProfile;
  onSave: (data: Partial<OrganizationProfile>) => Promise<void>;
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
  'Other',
];

const COMPANY_SIZES = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees',
];

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<OrganizationProfile>>({
    companyName: profile.companyName || '',
    industry: profile.industry || '',
    companySize: profile.companySize || '',
    website: profile.website || '',
    taxId: profile.taxId || '',
    businessRegistrationNumber: profile.businessRegistrationNumber || '',
    contactPerson: profile.contactPerson || '',
    contactPersonRole: profile.contactPersonRole || '',
    location: profile.location || '',
    certifications: profile.certifications || [],
    portfolioLinks: profile.portfolioLinks || [],
    serviceOfferings: profile.serviceOfferings || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({
      companyName: profile.companyName || '',
      industry: profile.industry || '',
      companySize: profile.companySize || '',
      website: profile.website || '',
      taxId: profile.taxId || '',
      businessRegistrationNumber: profile.businessRegistrationNumber || '',
      contactPerson: profile.contactPerson || '',
      contactPersonRole: profile.contactPersonRole || '',
      location: profile.location || '',
      certifications: profile.certifications || [],
      portfolioLinks: profile.portfolioLinks || [],
      serviceOfferings: profile.serviceOfferings || [],
    });
  }, [profile]);

  const handleChange = (field: keyof OrganizationProfile, value: any) => {
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

    if (!formData.companyName?.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }

    if (!formData.taxId?.trim()) {
      newErrors.taxId = 'Tax ID is required';
    }

    if (!formData.businessRegistrationNumber?.trim()) {
      newErrors.businessRegistrationNumber = 'Business registration number is required';
    }

    if (!formData.contactPerson?.trim()) {
      newErrors.contactPerson = 'Contact person name is required';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
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
    field: 'certifications' | 'portfolioLinks' | 'serviceOfferings',
    value: string
  ) => {
    const items = value.split(',').map((item) => item.trim()).filter(Boolean);
    handleChange(field, items);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Company Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Company Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Company Name"
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

          <div>
            <Input
              label="Location"
              type="text"
              value={formData.location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('location', e.target.value)}
              placeholder="City, Country"
            />
          </div>
        </div>

        {/* Logo and Cover Image Upload Placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Company Logo
            </label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Click to upload logo</p>
              <p className="text-xs text-gray-600 mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cover Image
            </label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Click to upload cover</p>
              <p className="text-xs text-gray-600 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Details Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Contact Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Contact Person"
              required
              type="text"
              value={formData.contactPerson}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('contactPerson', e.target.value)}
              placeholder="Full name"
              error={errors.contactPerson}
            />
          </div>

          <div>
            <Input
              label="Contact Person Role"
              type="text"
              value={formData.contactPersonRole}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('contactPersonRole', e.target.value)}
              placeholder="e.g., CEO, Project Manager"
            />
          </div>
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
          <h3 className="text-lg font-semibold text-white">Business Registration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Tax ID"
              required
              type="text"
              value={formData.taxId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('taxId', e.target.value)}
              placeholder="Enter tax ID"
              error={errors.taxId}
            />
          </div>

          <div>
            <Input
              label="Business Registration Number"
              required
              type="text"
              value={formData.businessRegistrationNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('businessRegistrationNumber', e.target.value)}
              placeholder="Enter registration number"
              error={errors.businessRegistrationNumber}
            />
          </div>
        </div>
      </motion.div>

      {/* Additional Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Additional Information</h3>
        </div>

        <div className="space-y-6">
          <div>
            <Input
              label="Certifications"
              type="text"
              value={formData.certifications?.join(', ')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleArrayFieldChange('certifications', e.target.value)}
              placeholder="ISO 9001, PMP, etc. (comma-separated)"
              helperText="Separate multiple certifications with commas"
            />
          </div>

          <div>
            <Input
              label="Portfolio Links"
              type="text"
              value={formData.portfolioLinks?.join(', ')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleArrayFieldChange('portfolioLinks', e.target.value)}
              placeholder="https://portfolio1.com, https://portfolio2.com (comma-separated)"
              helperText="Separate multiple links with commas"
            />
          </div>

          <div>
            <Input
              label="Service Offerings"
              type="text"
              value={formData.serviceOfferings?.join(', ')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleArrayFieldChange('serviceOfferings', e.target.value)}
              placeholder="Web Development, Mobile Apps, etc. (comma-separated)"
              helperText="Separate multiple services with commas"
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
