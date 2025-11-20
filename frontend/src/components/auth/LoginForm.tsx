import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data);
      toast.success('Login successful!');
      
      // Redirect based on role
      const role = user?.role || 'client';
      navigate(`/${role}-dashboard`);
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isSubmitting}
          icon={isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : undefined}
        >
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </Button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-primary-main hover:text-primary-dark transition-colors"
          >
            Sign up
          </Link>
        </p>
      </form>
    </motion.div>
  );
};
