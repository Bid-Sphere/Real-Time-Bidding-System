import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import type { UserRole } from '@/types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole;
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If role is specified, verify user has correct role
  if (role && user?.role !== role) {
    // Redirect to appropriate dashboard based on user's actual role
    const dashboardMap: Record<UserRole, string> = {
      client: '/client-dashboard',
      organization: '/organization-dashboard',
      freelancer: '/freelancer-dashboard',
    };

    const redirectPath = user?.role ? dashboardMap[user.role] : '/';
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and has correct role
  return <>{children}</>;
}
