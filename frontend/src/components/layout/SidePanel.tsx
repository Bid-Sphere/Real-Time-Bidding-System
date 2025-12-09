import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useChatStore } from '@/store/useChatStore';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

interface SidePanelProps {
  onNavigate?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactElement;
}

export default function SidePanel({ onNavigate }: SidePanelProps) {
  const location = useLocation();
  const totalUnreadCount = useChatStore((state) => state.totalUnreadCount);
  const fetchConversations = useChatStore((state) => state.fetchConversations);
  const user = useAuthStore((state) => state.user);

  // Fetch conversations on mount to get unread count
  useEffect(() => {
    if (user?.id) {
      fetchConversations(user.id);
    }
  }, [user?.id, fetchConversations]);

  const navItems: NavItem[] = [
    {
      id: 'analytics',
      label: 'Analytics',
      path: '/organization-dashboard/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'profile',
      label: 'Profile',
      path: '/organization-dashboard/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'teams',
      label: 'Teams',
      path: '/organization-dashboard/teams',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'projects',
      label: 'Project Discovery',
      path: '/organization-dashboard/projects',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      id: 'chat',
      label: 'Chat',
      path: '/organization-dashboard/chat',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="w-[280px] h-screen bg-background-card/60 backdrop-blur-xl border-r border-white/10 sticky top-0">
      <div className="flex flex-col h-full">
        {/* Navigation Items */}
        <nav className="flex-1 p-4 pt-24 space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={onNavigate}
                className="relative block"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 min-h-[44px]
                    ${
                      active
                        ? 'bg-primary-main/10 text-white border border-primary-main/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  {/* Icon */}
                  <div className={`
                    transition-colors duration-200
                    ${active ? 'text-primary-main' : ''}
                  `}>
                    {item.icon}
                  </div>

                  {/* Label */}
                  <span className={`font-medium transition-colors duration-200 ${active ? 'text-white' : ''}`}>
                    {item.label}
                  </span>

                  {/* Notification badge for Chat */}
                  {item.id === 'chat' && totalUnreadCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full"
                    >
                      {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                    </motion.div>
                  )}
                </motion.div>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-gray-500 text-center">
            © 2024 BidSphere
          </div>
        </div>
      </div>
    </aside>
  );
}
