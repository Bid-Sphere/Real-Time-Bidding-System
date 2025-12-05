import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { SignupForm } from '@/components/auth/SignupForm';
import { Sparkles, Zap, Shield, Globe } from 'lucide-react';

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

export default function SignupPage() {
  return (
    <Layout>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        className="min-h-[calc(100vh-4rem)] flex"
      >
        {/* Left Panel - Branding */}
        <motion.div
          variants={brandVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ ...pageTransition, delay: 0.1 }}
          className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-32 left-32 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-32 right-32 w-96 h-96 bg-pink-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.75s' }}></div>
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
                Start Your Journey
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-yellow-200">
                  Join Thousands of Professionals
                </span>
              </h2>

              <p className="text-xl text-purple-100 mb-12 leading-relaxed">
                Create your account and unlock access to unlimited opportunities.
                Whether you're a client or freelancer, we've got you covered.
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
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Lightning Fast Setup</h3>
                    <p className="text-purple-200 text-sm">Get started in under 2 minutes</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Enterprise Security</h3>
                    <p className="text-purple-200 text-sm">Your data is safe with us</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Global Reach</h3>
                    <p className="text-purple-200 text-sm">Access opportunities worldwide</p>
                  </div>
                </motion.div>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-12 pt-8 border-t border-white/20"
              >
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-3xl font-bold mb-1">10K+</div>
                    <div className="text-purple-200 text-sm">Active Users</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1">5K+</div>
                    <div className="text-purple-200 text-sm">Projects</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1">98%</div>
                    <div className="text-purple-200 text-sm">Satisfaction</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel - Signup Form */}
        <motion.div
          variants={panelVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ ...pageTransition, delay: 0.2 }}
          className="w-full lg:w-1/2 flex items-start justify-center px-6 py-12 bg-white dark:bg-gray-900 overflow-y-auto"
        >
          <div className="w-full max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="mb-8"
            >
              {/* Mobile logo */}
              <div className="lg:hidden flex items-center gap-2 mb-6">
                <Sparkles className="h-8 w-8 text-primary-main" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">BidSphere</h1>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Join our platform and start bidding on projects
              </p>
            </motion.div>

            <SignupForm />
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
