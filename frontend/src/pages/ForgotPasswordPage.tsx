import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft, CheckCircle, KeyRound } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

/**
 * ForgotPasswordPage Component - Phase 1 Frontend Redesign
 * Requirements: 13.1, 13.2, 13.3, 13.4
 * 
 * Features:
 * - Email input field for password reset request (13.1)
 * - Confirmation message on submission (13.2)
 * - Dark theme aesthetic (13.3)
 * - Link to return to login page (13.4)
 */

// Validation schema for email
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Animation variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const pageTransition = {
  duration: 0.4,
  ease: 'easeInOut' as const,
};

const cardVariants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};


export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  /**
   * Handle form submission
   * Requirement 13.2: Display confirmation message on valid email submission
   * Note: For security, we show the same message regardless of whether the email exists
   */
  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call - in production this would call the backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Store the email for display in confirmation
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 bg-[var(--bg-primary)]"
      >
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ ...pageTransition, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {isSubmitted ? (
            // Success confirmation view - Requirement 13.2
            <Card variant="bordered" padding="lg" className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center"
              >
                <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--color-success)]" />
              </motion.div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2 sm:mb-3">
                Check Your Email
              </h2>
              
              <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-2">
                We've sent password reset instructions to:
              </p>
              
              <p className="text-sm sm:text-base text-[var(--accent-blue)] font-medium mb-4 sm:mb-6 break-all">
                {submittedEmail}
              </p>
              
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mb-6 sm:mb-8">
                If you don't see the email, check your spam folder. The link will expire in 24 hours.
              </p>
              
              {/* Return to login link - Requirement 13.4 */}
              <Link to="/login">
                <Button variant="primary" size="lg" fullWidth>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </Card>
          ) : (
            // Email input form view - Requirement 13.1
            <Card variant="bordered" padding="lg">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Header with icon */}
                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-[var(--accent-blue)]/20 to-[var(--accent-purple)]/20 flex items-center justify-center">
                    <KeyRound className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--accent-blue)]" />
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2">
                    Forgot Password?
                  </h2>
                  
                  <p className="text-sm sm:text-base text-[var(--text-secondary)]">
                    No worries! Enter your email and we'll send you reset instructions.
                  </p>
                </div>

                {/* Email Field - Requirement 13.1 */}
                <Input
                  {...register('email')}
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  error={errors.email?.message}
                  leftIcon={<Mail className="h-5 w-5" />}
                  disabled={isLoading}
                  fullWidth
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isLoading}
                  leftIcon={isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : undefined}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                {/* Return to login link - Requirement 13.4 */}
                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors duration-[var(--transition-fast)]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Link>
                </div>
              </form>
            </Card>
          )}
        </motion.div>
      </motion.div>
    </Layout>
  );
}
