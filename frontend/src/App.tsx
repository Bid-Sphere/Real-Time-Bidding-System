import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ClientDashboard = lazy(() => import('@/pages/ClientDashboard'));
const OrganizationDashboard = lazy(() => import('@/pages/OrganizationDashboard'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Organization Dashboard sections
const AnalyticsHome = lazy(() => import('@/pages/dashboard/AnalyticsHome'));
const ProfileSection = lazy(() => import('@/pages/dashboard/ProfileSection'));
const TeamsSection = lazy(() => import('@/pages/dashboard/TeamsSection'));
const ProjectDiscoverySection = lazy(() => import('@/pages/dashboard/ProjectDiscoverySection'));
const ChatSection = lazy(() => import('@/pages/dashboard/ChatSection'));

// Client Dashboard sections
const ClientAnalytics = lazy(() => import('@/components/client/ClientAnalytics'));
const ClientProfile = lazy(() => import('@/components/client/ClientProfile'));
const ClientProjects = lazy(() => import('@/components/client/ClientProjects'));
const ClientBids = lazy(() => import('@/components/client/ClientBids'));
const ClientChat = lazy(() => import('@/components/client/ClientChat'));

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
    <div className="min-h-screen flex items-center justify-center bg-background-deep">
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
        <Route
          path="/forgot-password"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ForgotPasswordPage />
            </motion.div>
          }
        />

        {/* Client Dashboard with nested routes */}
        <Route
          path="/client-dashboard"
          element={
            <ProtectedRoute role="client">
              <ClientDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="analytics" replace />} />
          <Route path="analytics" element={<ClientAnalytics />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route path="projects" element={<ClientProjects />} />
          <Route path="bids" element={<ClientBids />} />
          <Route path="chat" element={<ClientChat />} />
          <Route path="chat/:conversationId" element={<ClientChat />} />
        </Route>
        
        {/* Organization Dashboard with nested routes */}
        <Route
          path="/organization-dashboard"
          element={
            <ProtectedRoute role="organization">
              <OrganizationDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="analytics" replace />} />
          <Route path="analytics" element={<AnalyticsHome />} />
          <Route path="profile" element={<ProfileSection />} />
          <Route path="teams" element={<TeamsSection />} />
          <Route path="projects" element={<ProjectDiscoverySection />} />
          <Route path="chat" element={<ChatSection />} />
          <Route path="chat/:conversationId" element={<ChatSection />} />
        </Route>

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



// ... imports

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <AnimatedRoutes />
        </Suspense>
        <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          className: 'toast-notification',
          style: {
            background: 'rgba(17, 24, 39, 0.95)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0.75rem',
            padding: '1rem 1.5rem',
            fontSize: '0.95rem',
            fontWeight: '500',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            maxWidth: '500px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
            style: {
              border: '1px solid rgba(16, 185, 129, 0.3)',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              border: '1px solid rgba(239, 68, 68, 0.3)',
            },
          },
        }}
        containerStyle={{
          top: 80,
          zIndex: 9999,
        }}
      />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
