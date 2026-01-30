import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useDashboardStore } from '@/store/useDashboardStore';

export default function OrganizationDashboard() {
  const location = useLocation();
  const setActiveSection = useDashboardStore((state) => state.setActiveSection);

  // Update active section based on current route
  useEffect(() => {
    const path = location.pathname;
    
    if (path.includes('/analytics')) {
      setActiveSection('analytics');
    } else if (path.includes('/profile')) {
      setActiveSection('profile');
    } else if (path.includes('/projects')) {
      setActiveSection('projects');
    } else if (path.includes('/chat')) {
      setActiveSection('chat');
    }
  }, [location.pathname, setActiveSection]);

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
