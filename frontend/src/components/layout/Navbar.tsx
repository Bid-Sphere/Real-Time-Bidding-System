import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Button from '@/components/ui/Button';

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    const dashboardMap = {
      client: '/client-dashboard',
      organization: '/organization-dashboard',
      freelancer: '/freelancer-dashboard',
    };
    return dashboardMap[user.role];
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${transparent
          ? 'bg-transparent'
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm'
        }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white"
            aria-label="Bidding System - Home"
          >
            <span className="text-primary-main">Bidding</span>
            <span>System</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-6" aria-label="Primary navigation">
              <Link
                to="/"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-light transition-colors"
                aria-current={window.location.pathname === '/' ? 'page' : undefined}
              >
                Home
              </Link>
              <button
                onClick={() => scrollToSection('categories')}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-light transition-colors"
                aria-label="Scroll to categories section"
              >
                Categories
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-light transition-colors"
                aria-label="Scroll to how it works section"
              >
                How It Works
              </button>
            </nav>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="text" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to={getDashboardPath()}>
                  <Button variant="text" size="sm">
                    Dashboard
                  </Button>
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-main flex items-center justify-center text-white">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name}
                    </span>
                  </button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.email}
                          </p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300 p-2"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-light transition-colors"
              >
                Home
              </Link>
              <button
                onClick={() => scrollToSection('categories')}
                className="block w-full text-left py-2 text-gray-700 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-light transition-colors"
              >
                Categories
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="block w-full text-left py-2 text-gray-700 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-light transition-colors"
              >
                How It Works
              </button>

              {!isAuthenticated ? (
                <div className="pt-4 space-y-2 border-t border-gray-200 dark:border-gray-800">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button variant="text" size="md" fullWidth>
                      Login
                    </Button>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button variant="primary" size="md" fullWidth>
                      Sign Up
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="pt-4 space-y-2 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-3 px-2 py-2">
                    <div className="w-10 h-10 rounded-full bg-primary-main flex items-center justify-center text-white">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button variant="text" size="md" fullWidth>
                      Dashboard
                    </Button>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    <Button variant="outline" size="md" fullWidth>
                      Logout
                    </Button>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
