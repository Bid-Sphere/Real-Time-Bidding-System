import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Building2, User, FileText, Briefcase } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

// Client Profile interface based on auth service Client model
interface ClientProfile {
  id?: number;
  userId?: number;
  companyName?: string; // Optional for individual clients
  industry?: string;
  website?: string;
  billingAddress?: string;
  taxId?: string;
  // Additional fields from User model
  firstName?: string;
  lastName?: string;
  email?: string;
}

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

export const ClientProfileForm: React.FC<ClientProfileFormProps> = ({
  profile,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<ClientProfile>>({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    companyName: profile.companyName || '',
    industry: profile.industry || '',
    website: profile.website || '',
    billingAddress: profile.billingAddress || '',
    taxId: profile.taxId || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      companyName: profile.companyName || '',
      industry: profile.industry || '',
      website: profile.website || '',
      billingAddress: profile.billingAddress || '',
      taxId: profile.taxId || '',
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

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full">
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
              label="First Name"
              required
              type="text"
              value={formData.firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('firstName', e.target.value)}
              placeholder="Enter first name"
              error={errors.firstName}
            />
          </div>

          <div>
            <Input
              label="Last Name"
              required
              type="text"
              value={formData.lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('lastName', e.target.value)}
              placeholder="Enter last name"
              error={errors.lastName}
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
              label="Company Name"
              type="text"
              value={formData.companyName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('companyName', e.target.value)}
              placeholder="Enter company name (optional for individuals)"
              helperText="Leave blank if you're an individual client"
            />
          </div>

          <div>
            <Select
              label="Industry"
              value={formData.industry}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('industry', e.target.value)}
              options={INDUSTRIES.map((industry) => ({ value: industry, label: industry }))}
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
        </div>
      </motion.div>

      {/* Billing Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Billing Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Billing Address"
              type="text"
              value={formData.billingAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('billingAddress', e.target.value)}
              placeholder="Enter complete billing address"
            />
          </div>

          <div>
            <Input
              label="Tax ID"
              type="text"
              value={formData.taxId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('taxId', e.target.value)}
              placeholder="Enter tax ID (optional)"
              helperText="Required for business clients"
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

        <div className="text-center py-8">
          <p className="text-gray-400">
            Additional profile features like document uploads and portfolio links will be available in future updates.
          </p>
        </div>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-center pt-4">
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