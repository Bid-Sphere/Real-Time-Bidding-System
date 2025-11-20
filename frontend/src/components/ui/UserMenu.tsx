import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  if (!user) return null;

  // Get initials for avatar
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-main text-sm font-semibold text-white">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        {/* Name */}
        <span className="hidden text-sm font-medium text-gray-900 dark:text-white sm:block">
          {user.name}
        </span>

        {/* Dropdown icon */}
        <ChevronDown
          className={`h-4 w-4 text-gray-600 transition-transform dark:text-gray-400 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            {/* User info */}
            <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {user.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
              <p className="mt-1 inline-block rounded-full bg-primary-main/10 px-2 py-0.5 text-xs font-medium text-primary-main capitalize">
                {user.role}
              </p>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate(`/${user.role}-dashboard`);
                }}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <User className="h-4 w-4" />
                Dashboard
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-error-main transition-colors hover:bg-error-main/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
