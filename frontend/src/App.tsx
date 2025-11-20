import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const ClientDashboard = lazy(() => import('@/pages/ClientDashboard'));
const VendorDashboard = lazy(() => import('@/pages/VendorDashboard'));
const FreelancerDashboard = lazy(() => import('@/pages/FreelancerDashboard'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const pageTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1] as const,
};

// Loading component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
    </div>
  );
}

// Animated routes wrapper
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <HomePage />
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <LoginPage />
            </motion.div>
          }
        />
        <Route
          path="/signup"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <SignupPage />
            </motion.div>
          }
        />

        {/* Protected routes */}
        <Route
          path="/client-dashboard"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ProtectedRoute role="client">
                <ClientDashboard />
              </ProtectedRoute>
            </motion.div>
          }
        />
        <Route
          path="/vendor-dashboard"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ProtectedRoute role="vendor">
                <VendorDashboard />
              </ProtectedRoute>
            </motion.div>
          }
        />
        <Route
          path="/freelancer-dashboard"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ProtectedRoute role="freelancer">
                <FreelancerDashboard />
              </ProtectedRoute>
            </motion.div>
          }
        />

        {/* Catch-all route */}
        <Route
          path="*"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <NotFoundPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <AnimatedRoutes />
      </Suspense>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--color-bg-elevated)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.5rem',
            padding: '1rem',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-success-main)',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-error-main)',
              secondary: '#fff',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
