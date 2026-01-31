import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

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
      id: 'auctions',
      label: 'Live Auctions',
      path: '/organization-dashboard/auctions',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
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
