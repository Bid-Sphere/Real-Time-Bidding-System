import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '@/components/layout/Layout';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import type { LoginFormData } from '@/utils/validation';
import { Sparkles, TrendingUp, Users, Award } from 'lucide-react';

/**
 * LoginPage Component - Phase 1 Frontend Redesign
 * Requirements: 11.6, 11.7
 * 
 * Features:
 * - Integrates LoginForm with page layout
 * - Connects to auth store for submission handling
 * - Handles redirect after successful login (11.6)
 * - Displays generic error messages for security (11.7)
 */

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const pageTransition = {
  duration: 0.4,
  ease: 'easeInOut' as const,
};

const panelVariants = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },
};

const brandVariants = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated, user } = useAuth();
  const [error, setError] = useState<string | undefined>();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardPath = user.role === 'organization' 
        ? '/organization-dashboard' 
        : '/client-dashboard';
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  /**
   * Handle form submission
   * Requirement 11.6: Authenticate and redirect to appropriate dashboard
   * Requirement 11.7: Display generic error message without exposing security details
   */
  const handleSubmit = async (data: LoginFormData) => {
    setError(undefined);
    
    try {
      const user = await login(data);
      toast.success('Login successful!');
      
      // Redirect to appropriate dashboard based on user role
      const dashboardPath = user.role === 'organization' 
        ? '/organization-dashboard' 
        : '/client-dashboard';
      
      navigate(dashboardPath);
    } catch (err) {
      // Requirement 11.7: Generic error message for security
      // Don't reveal whether email or password was incorrect
      setError('Invalid email or password');
      console.error('Login error:', err);
    }
  };

  /**
   * Handle Google Sign In
   * Requirement 11.3: Sign in with Google button
   */
  const handleGoogleSignIn = async () => {
    setError(undefined);
    
    try {
      // TODO: Implement Google OAuth when backend is connected
      toast.error('Google Sign In is not yet available');
    } catch (err) {
      setError('Unable to sign in with Google. Please try again.');
      console.error('Google sign in error:', err);
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
        className="min-h-screen flex -mt-24 sm:-mt-28"
      >
        {/* Left Panel - Branding */}
        <motion.div
          variants={brandVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ ...pageTransition, delay: 0.1 }}
          className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[var(--accent-blue)] via-[var(--accent-purple)] to-purple-900 pt-24 sm:pt-28"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center px-16 py-12 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="h-10 w-10" />
                <h1 className="text-4xl font-bold">BidSphere</h1>
              </div>

              <h2 className="text-5xl font-bold mb-6 leading-tight">
                Welcome Back to Your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
                  Bidding Hub
                </span>
              </h2>

              <p className="text-xl text-purple-100 mb-12 leading-relaxed">
                Continue your journey in the world's most dynamic bidding platform.
                Connect with opportunities and grow your business.
              </p>

              {/* Feature highlights */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Real-time Bidding</h3>
                    <p className="text-purple-200 text-sm">Compete and win projects instantly</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Global Network</h3>
                    <p className="text-purple-200 text-sm">Connect with clients worldwide</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Secure Payments</h3>
                    <p className="text-purple-200 text-sm">Protected transactions guaranteed</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel - Login Form */}
        <motion.div
          variants={panelVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ ...pageTransition, delay: 0.2 }}
          className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 bg-[var(--bg-primary)] pt-24 sm:pt-28"
        >
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              {/* Mobile logo */}
              <div className="lg:hidden flex items-center justify-center gap-2 mb-6 sm:mb-8">
                <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-[var(--accent-blue)]" />
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">BidSphere</h1>
              </div>

              <LoginForm
                onSubmit={handleSubmit}
                onGoogleSignIn={handleGoogleSignIn}
                isLoading={isLoading}
                error={error}
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
