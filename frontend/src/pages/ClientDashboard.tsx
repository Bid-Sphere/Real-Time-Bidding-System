import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useDashboardStore, type DashboardSection } from '@/store/useDashboardStore';

export default function ClientDashboard() {
  const location = useLocation();
  const setActiveSection = useDashboardStore((state) => state.setActiveSection);

  // Update active section based on current route
  useEffect(() => {
    const path = location.pathname;
    
    if (path.includes('/analytics')) {
      setActiveSection('analytics' as DashboardSection);
    } else if (path.includes('/profile')) {
      setActiveSection('profile' as DashboardSection);
    } else if (path.includes('/projects')) {
      setActiveSection('projects' as DashboardSection);
    } else if (path.includes('/bids')) {
      setActiveSection('bids' as DashboardSection);
    } else if (path.includes('/chat')) {
      setActiveSection('chat' as DashboardSection);
    } else {
      setActiveSection('dashboard' as DashboardSection);
    }
  }, [location.pathname, setActiveSection]);

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}