import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Loader2, MapPin, Building2, Briefcase, DollarSign, Link as LinkIcon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import MultiSelect from '@/components/ui/MultiSelect';
import PhoneInput from '@/components/ui/PhoneInput';
import { RoleSelector } from './RoleSelector';
import type { UserRole } from '@/types/user';

const baseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['client', 'organization', 'freelancer'], 'Please select a role'),
});

const phoneSchema = z.string()
  .regex(/^\+\d{1,4}\s?\d{6,14}$/, 'Invalid phone number format')
  .optional()
  .or(z.literal(''));

const clientSchema = baseSchema.extend({
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^\+\d{1,4}\s?\d{6,14}$/, 'Invalid phone number format'),
  location: z.string().min(2, 'Location is required').optional(),
  // Client profile fields
  companyName: z.string().optional(),
  clientIndustry: z.string().optional(),
  clientCompanySize: z.string().optional(),
  clientWebsite: z.string().url('Invalid URL').optional().or(z.literal('')),
  billingAddress: z.string().optional(),
  taxId: z.string().optional(),
});

const organizationSchema = baseSchema.extend({
  organizationName: z.string().min(2, 'Organization name is required'),
  orgIndustry: z.string().min(1, 'Industry is required'),
  orgCompanySize: z.string().optional(),
  orgWebsite: z.string().url('Invalid URL').optional().or(z.literal('')),
  phone: phoneSchema,
  location: z.string().min(2, 'Location is required').optional(),
  taxId: z.string().optional(),
  businessRegistrationNumber: z.string().optional(),
  contactPerson: z.string().optional(),
  contactPersonRole: z.string().optional(),
});

const freelancerSchema = baseSchema.extend({
  professionalTitle: z.string().min(2, 'Professional title is required'),
  skills: z.array(z.string()).min(1, 'Add at least one skill'),
  experienceLevel: z.enum(['beginner', 'intermediate', 'expert'], 'Select experience level'),
  hourlyRate: z.string().min(1, 'Hourly rate is required').regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid number'),
  portfolioUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  resumeUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  location: z.string().min(2, 'Location is required').optional(),
});

const signupSchema = z.discriminatedUnion('role', [
  clientSchema.extend({ role: z.literal('client') }),
  organizationSchema.extend({ role: z.literal('organization') }),
  freelancerSchema.extend({ role: z.literal('freelancer') }),
]).and(
  z.object({
    confirmPassword: z.string(),
  })
).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const SKILL_OPTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++',
  'UI/UX Design', 'Graphic Design', 'Content Writing', 'SEO', 'Marketing',
  'Project Management', 'Data Analysis', 'Mobile Development', 'DevOps'
];

const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '200+', label: '200+ employees' },
];

const INDUSTRIES = [
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'other', label: 'Other' },
];

export const SignupForm = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const customResolver = async (data: any, context: any, options: any) => {
    console.log('=== FORM VALIDATION ===');
    console.log('Data being validated:', data);
    console.log('Phone value specifically:', data.phone);
    console.log('Phone value type:', typeof data.phone);
    console.log('Phone value length:', data.phone?.length);
    
    const result = await zodResolver(signupSchema)(data, context, options);
    
    console.log('Validation result:', result);
    console.log('Validation errors:', result.errors);
    
    return result;
  };

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<any>({
    resolver: customResolver,
    mode: 'onBlur', // Validate on blur initially
    reValidateMode: 'onChange', // Re-validate on change after first validation
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = async (data: any) => {
    console.log('=== SIGNUP FORM SUBMITTED ===');
    console.log('Form data received:', data);
    console.log('Form errors:', errors);
    
    setIsSubmitting(true);
    try {
      const signupData: any = {
        fullName: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        phone: data.phone,
        location: data.location,
      };

      console.log('Base signup data:', signupData);

      // Build role-specific profile objects
      if (data.role === 'client') {
        signupData.clientProfile = {
          companyName: data.companyName || undefined,
          industry: data.clientIndustry || undefined,
          companySize: data.clientCompanySize || undefined,
          website: data.clientWebsite || undefined,
          billingAddress: data.billingAddress || undefined,
          taxId: data.taxId || undefined,
        };
        console.log('Client profile added:', signupData.clientProfile);
      } else if (data.role === 'organization') {
        signupData.organizationProfile = {
          companyName: data.organizationName,
          industry: data.orgIndustry,
          companySize: data.orgCompanySize || undefined,
          website: data.orgWebsite || undefined,
          taxId: data.taxId || undefined,
          businessRegistrationNumber: data.businessRegistrationNumber || undefined,
          contactPerson: data.contactPerson || undefined,
          contactPersonRole: data.contactPersonRole || undefined,
        };
        console.log('Organization profile added:', signupData.organizationProfile);
      } else if (data.role === 'freelancer') {
        signupData.freelancerProfile = {
          professionalTitle: data.professionalTitle,
          skills: data.skills,
          experienceLevel: data.experienceLevel,
          hourlyRate: parseFloat(data.hourlyRate),
          portfolioUrl: data.portfolioUrl || undefined,
          bio: data.bio || undefined,
          resumeUrl: data.resumeUrl || undefined,
        };
        console.log('Freelancer profile added:', signupData.freelancerProfile);
      }

      console.log('Final signup data being sent:', signupData);
      console.log('Calling signup API...');
      
      await signup(signupData);
      
      console.log('Signup successful!');
      toast.success('Account created successfully! Please login to continue.');

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('=== SIGNUP ERROR ===');
      console.error('Error details:', error);
      toast.error('Signup failed. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <RoleSelector selectedRole={selectedRole} onSelectRole={handleRoleSelect} />
        {errors.role && (
          <p className="text-sm text-error-main">{errors.role.message as string}</p>
        )}

        {/* Basic Information - Only show after role selection */}
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Input
                  {...register('name')}
                  type="text"
                  label="Full Name"
                  placeholder="Enter your name"
                  error={errors.name?.message as string}
                  icon={<User className="h-5 w-5" />}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <Input
                  {...register('email')}
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  error={errors.email?.message as string}
                  icon={<Mail className="h-5 w-5" />}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <Input
                  {...register('password')}
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  error={errors.password?.message as string}
                  icon={<Lock className="h-5 w-5" />}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <Input
                  {...register('confirmPassword')}
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  error={errors.confirmPassword?.message as string}
                  icon={<Lock className="h-5 w-5" />}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Role-specific fields */}
        <AnimatePresence mode="wait">
          {selectedRole && (
            <motion.div
              key={selectedRole}
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-6"
            >
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <motion.h3
                  key={`heading-${selectedRole}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                >
                  {selectedRole === 'client' && 'Contact Information'}
                  {selectedRole === 'organization' && 'Organization Details'}
                  {selectedRole === 'freelancer' && 'Professional Information'}
                </motion.h3>

                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  style={{ overflow: 'visible' }}
                >
                {/* Client Fields */}
                {selectedRole === 'client' && (
                  <>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Controller
                        name="phone"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <PhoneInput
                            label="Phone Number"
                            error={errors.phone?.message as string}
                            disabled={isSubmitting}
                            required
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                          />
                        )}
                      />
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Input
                        {...register('location')}
                        type="text"
                        label="Location"
                        placeholder="City, Country"
                        error={errors.location?.message as string}
                        icon={<MapPin className="h-5 w-5" />}
                        disabled={isSubmitting}
                      />
                    </motion.div>
                    <motion.div
                      className="sm:col-span-2"
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Input
                        {...register('companyName')}
                        type="text"
                        label="Company Name (Optional)"
                        placeholder="Your company name"
                        error={errors.companyName?.message as string}
                        icon={<Building2 className="h-5 w-5" />}
                        disabled={isSubmitting}
                      />
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Select
                        {...register('clientIndustry')}
                        label="Industry (Optional)"
                        options={INDUSTRIES}
                        error={errors.clientIndustry?.message as string}
                        disabled={isSubmitting}
                      />
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Select
                        {...register('clientCompanySize')}
                        label="Company Size (Optional)"
                        options={COMPANY_SIZES}
                        error={errors.clientCompanySize?.message as string}
                        disabled={isSubmitting}
                      />
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Input
                        {...register('clientWebsite')}
                        type="url"
                        label="Website (Optional)"
                        placeholder="https://example.com"
                        error={errors.clientWebsite?.message as string}
                        icon={<LinkIcon className="h-5 w-5" />}
                        disabled={isSubmitting}
                      />
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Input
                        {...register('billingAddress')}
                        type="text"
                        label="Billing Address (Optional)"
                        placeholder="Street, City, State, ZIP"
                        error={errors.billingAddress?.message as string}
                        icon={<MapPin className="h-5 w-5" />}
                        disabled={isSubmitting}
                      />
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Input
                        {...register('taxId')}
                        type="text"
                        label="Tax ID (Optional)"
                        placeholder="Tax identification number"
                        error={errors.taxId?.message as string}
                        disabled={isSubmitting}
                      />
                    </motion.div>
                  </>
                )}

                {/* Organization Fields */}
                {selectedRole === 'organization' && (
                  <>
                    <motion.div
                      className="sm:col-span-2"
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Input
                        {...register('organizationName')}
                        type="text"
                        label="Organization Name"
                        placeholder="Enter organization name"
                        error={errors.organizationName?.message as string}
                        icon={<Building2 className="h-5 w-5" />}
                        disabled={isSubmitting}
                        required
                      />
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Select
                        {...register('orgIndustry')}
                        label="Industry"
                        options={INDUSTRIES}
                        error={errors.orgIndustry?.message as string}
                        disabled={isSubmitting}
                        required
                      />
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Select
                        {...register('orgCompanySize')}
                        label="Company Size"
                        options={COMPANY_SIZES}
                        error={errors.orgCompanySize?.message as string}
                        disabled={isSubmitting}
                      />
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Input
                        {...register('orgWebsite')}
                        type="url"
                        label="Website"
                        placeholder="https://example.com"
                        error={errors.orgWebsite?.message as string}
                        icon={<LinkIcon className="h-5 w-5" />}
                        disabled={isSubmitting}
                      />
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Controller
                        name="phone"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <PhoneInput
                            label="Phone Number"
                            error={errors.phone?.message as string}
                            disabled={isSubmitting}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                          />
                        )}
                      />
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Input
                        {...register('location')}
                        type="text"
                        label="Location"
                        placeholder="City, Country"
                        error={errors.location?.message as string}
                        icon={<MapPin className="h-5 w-5" />}
                        disabled={isSubmitting}
                      />
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Input
                        {...register('taxId')}
                        type="text"
                        label="Tax ID (Optional)"
                        placeholder="Tax identification number"
                        error={errors.taxId?.message as string}
                        disabled={isSubmitting}
                      />
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Input
                        {...register('businessRegistrationNumber')}
                        type="text"
                        label="Business Registration Number (Optional)"
                        placeholder="Registration number"
                        error={errors.businessRegistrationNumber?.message as string}
                        disabled={isSubmitting}
                      />
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Input
                        {...register('contactPerson')}
                        type="text"
                        label="Contact Person (Optional)"
                        placeholder="Primary contact name"
                        error={errors.contactPerson?.message as string}
                        icon={<User className="h-5 w-5" />}
                        disabled={isSubmitting}
                      />
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Input
                        {...register('contactPersonRole')}
                        type="text"
                        label="Contact Person Role (Optional)"
                        placeholder="e.g., CEO, Manager"
                        error={errors.contactPersonRole?.message as string}
                        disabled={isSubmitting}
                      />
                    </motion.div>
                  </>
                )}

                {/* Freelancer Fields */}
                {selectedRole === 'freelancer' && (
                  <>
                    <motion.div
                      className="sm:col-span-2"
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Input
                        {...register('professionalTitle')}
                        type="text"
                        label="Professional Title"
                        placeholder="e.g., Full Stack Developer, UI/UX Designer"
                        error={errors.professionalTitle?.message as string}
                        icon={<Briefcase className="h-5 w-5" />}
                        disabled={isSubmitting}
                        required
                      />
                    </motion.div>
                    <motion.div
                      className="sm:col-span-2"
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Controller
                        name="skills"
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => (
                          <MultiSelect
                            label="Skills"
                            options={SKILL_OPTIONS}
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Add your skills (3-5 recommended)"
                            error={errors.skills?.message as string}
                            disabled={isSubmitting}
                            required
                          />
                        )}
                      />
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Select
                        {...register('experienceLevel')}
                        label="Experience Level"
                        options={[
                          { value: 'beginner', label: 'Beginner (0-2 years)' },
                          { value: 'intermediate', label: 'Intermediate (2-5 years)' },
                          { value: 'expert', label: 'Expert (5+ years)' },
                        ]}
                        error={errors.experienceLevel?.message as string}
                        disabled={isSubmitting}
                        required
                      />
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Input
                        {...register('hourlyRate')}
                        type="number"
                        label="Hourly Rate (USD)"
                        placeholder="50"
                        error={errors.hourlyRate?.message as string}
                        icon={<DollarSign className="h-5 w-5" />}
                        disabled={isSubmitting}
                        required
                      />
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Input
                        {...register('portfolioUrl')}
                        type="url"
                        label="Portfolio URL (Optional)"
                        placeholder="https://portfolio.com"
                        error={errors.portfolioUrl?.message as string}
                        icon={<LinkIcon className="h-5 w-5" />}
                        disabled={isSubmitting}
                      />
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Input
                        {...register('resumeUrl')}
                        type="url"
                        label="Resume URL (Optional)"
                        placeholder="https://resume.com/yourname"
                        error={errors.resumeUrl?.message as string}
                        icon={<LinkIcon className="h-5 w-5" />}
                        disabled={isSubmitting}
                      />
                    </motion.div>
                    <motion.div
                      className="sm:col-span-2"
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio (Optional)
                      </label>
                      <textarea
                        {...register('bio')}
                        rows={3}
                        placeholder="Tell us about yourself and your experience..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-colors resize-none"
                        disabled={isSubmitting}
                      />
                      {errors.bio && (
                        <p className="mt-1 text-sm text-error-main">{errors.bio.message as string}</p>
                      )}
                    </motion.div>
                    <motion.div
                      className="sm:col-span-2"
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Input
                        {...register('location')}
                        type="text"
                        label="Location"
                        placeholder="City, Country"
                        error={errors.location?.message as string}
                        icon={<MapPin className="h-5 w-5" />}
                        disabled={isSubmitting}
                      />
                    </motion.div>
                  </>
                )}
                </motion.div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isSubmitting || !selectedRole}
          icon={isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : undefined}
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </Button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-primary-main hover:text-primary-dark transition-colors"
          >
            Log in
          </Link>
        </p>
      </form>
    </motion.div>
  );
};
