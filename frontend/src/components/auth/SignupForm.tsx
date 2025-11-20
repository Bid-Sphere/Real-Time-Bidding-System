import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { RoleSelector } from './RoleSelector';
import type { UserRole } from '@/types/user';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    role: z.enum(['client', 'vendor', 'freelancer'], 'Please select a role'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

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
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      toast.success('Account created successfully!');
      
      // Redirect based on role
      navigate(`/${data.role}-dashboard`);
    } catch (error) {
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
          <p className="text-sm text-error-main">{errors.role.message}</p>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Input
              {...register('name')}
              type="text"
              label="Full Name"
              placeholder="Enter your name"
              error={errors.name?.message}
              icon={<User className="h-5 w-5" />}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Input
              {...register('email')}
              type="email"
              label="Email"
              placeholder="Enter your email"
              error={errors.email?.message}
              icon={<Mail className="h-5 w-5" />}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Input
              {...register('password')}
              type="password"
              label="Password"
              placeholder="Enter your password"
              error={errors.password?.message}
              icon={<Lock className="h-5 w-5" />}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Input
              {...register('confirmPassword')}
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              icon={<Lock className="h-5 w-5" />}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isSubmitting}
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
