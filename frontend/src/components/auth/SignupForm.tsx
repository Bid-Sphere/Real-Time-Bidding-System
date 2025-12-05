import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { RoleSelector } from './RoleSelector';
import type { UserRole } from '@/types/user';

// Google Icon SVG Component
const GoogleIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['client', 'organization'], 'Please select a role'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});



export const SignupForm = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const signupData = {
        fullName: data.email.split('@')[0], // Use email prefix as temporary name
        email: data.email,
        password: data.password,
        role: data.role,
      };

      await signup(signupData);
      toast.success('Account created successfully! Please login to continue.');
      navigate('/login');
    } catch (error) {
      toast.error('Signup failed. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-black border border-[var(--border-light)] rounded-[var(--radius-xl)] p-6 sm:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        {/* Form Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2">
            Create Your Account
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            Join our platform and start bidding on projects
          </p>
        </div>

        <RoleSelector selectedRole={selectedRole} onSelectRole={handleRoleSelect} />
        {errors.role && (
          <p className="text-sm text-error-main">{errors.role.message as string}</p>
        )}

        {/* Basic Information - Always visible */}
        <div className="space-y-4">
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

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border-light)]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-black text-[var(--text-muted)]">
              or continue with
            </span>
          </div>
        </div>

        {/* Google Sign Up Button */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          fullWidth
          disabled={isSubmitting}
          icon={<GoogleIcon />}
          onClick={() => {
            toast('Google Sign Up coming soon!', { icon: '🚀' });
          }}
        >
          Sign up with Google
        </Button>

        <p className="text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[var(--accent-blue)] hover:text-[var(--accent-blue-light)] transition-colors"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};
