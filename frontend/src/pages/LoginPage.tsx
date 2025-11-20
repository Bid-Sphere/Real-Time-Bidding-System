import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { LoginForm } from '@/components/auth/LoginForm';
import Card from '@/components/ui/Card';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const pageTransition = {
  duration: 0.3,
  ease: 'easeInOut' as const,
};

export default function LoginPage() {
  return (
    <Layout simpleFooter>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Log in to your account to continue
            </p>
          </motion.div>

          <Card variant="elevated" padding="lg">
            <LoginForm />
          </Card>
        </div>
      </motion.div>
    </Layout>
  );
}
