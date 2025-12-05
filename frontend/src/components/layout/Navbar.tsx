/**
 * Floating Navbar Component
 * Phase 1 Frontend Redesign
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 14.2
 * 
 * Features:
 * - Pill-shaped navbar with semi-transparent background and backdrop blur
 * - Horizontal centering with viewport edge spacing
 * - Logo on left, nav links center, auth CTAs right
 * - Fixed positioning with scroll behavior
 * - Authenticated state with user menu and dashboard link
 * - Mobile responsive with hamburger menu
 */

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

// Navigation items (Requirement 2.4)
const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '#about' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll behavior (Requirement 2.6)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change - this is a valid pattern for syncing UI state with navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    const dashboardMap: Record<string, string> = {
      client: '/client-dashboard',
      organization: '/organization-dashboard',
      freelancer: '/freelancer-dashboard',
    };
    return dashboardMap[user.role] || '/';
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      // Handle anchor links
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(href);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  const isActiveLink = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname === href || location.hash === href;
  };

  return (
    <>
      {/* Floating Navbar Container (Requirements 2.1, 2.2) */}
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50
          flex justify-center
          px-4 sm:px-6 lg:px-8
          pt-4 sm:pt-5
          transition-all duration-300
        `}
      >
        {/* Pill-shaped navbar (Requirement 2.1) */}
        <div
          className={`
            w-full max-w-6xl
            px-4 sm:px-6 py-3
            rounded-full
            border border-[var(--border-light)]
            transition-all duration-300
            ${scrolled 
              ? 'bg-[var(--bg-navbar)] backdrop-blur-xl shadow-lg border-[var(--border-medium)]' 
              : 'bg-[var(--bg-navbar)] backdrop-blur-md'
            }
          `}
        >
          <div className="flex items-center justify-between">
            {/* Logo - Left side (Requirement 2.3, 15.1, 15.5) */}
            <Link
              to="/"
              className="flex items-center gap-2 group flex-shrink-0"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-[var(--shadow-glow)] group-hover:scale-105 transition-all duration-150">
                <Sparkles className="w-5 h-5 text-white transition-transform duration-150 group-hover:rotate-12" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight">
                Bid<span className="text-[var(--accent-blue)]">Sphere</span>
              </span>
            </Link>

            {/* Center Navigation Links - Desktop (Requirement 2.4, 15.1, 15.5) */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                item.href.startsWith('#') ? (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className={`
                      px-4 py-2 text-sm font-medium rounded-full
                      transition-all duration-150
                      ${isActiveLink(item.href)
                        ? 'text-[var(--text-primary)] bg-white/10'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 hover:scale-105'
                      }
                    `}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`
                      px-4 py-2 text-sm font-medium rounded-full
                      transition-all duration-150
                      ${isActiveLink(item.href)
                        ? 'text-[var(--text-primary)] bg-white/10'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 hover:scale-105'
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>

            {/* Right side - Auth CTAs or User Menu (Requirements 2.5, 2.7) */}
            <div className="flex items-center gap-3">
              {/* Desktop Auth/User Section */}
              <div className="hidden md:flex items-center gap-3">
                {!isAuthenticated ? (
                  /* Auth CTAs (Requirement 2.5, 15.1, 15.5) */
                  <>
                    <Link
                      to="/login"
                      className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-105 transition-all duration-150"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] rounded-full hover:shadow-[var(--shadow-glow)] hover:brightness-110 hover:scale-105 active:scale-100 transition-all duration-150"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  /* Authenticated User Menu (Requirement 2.7) */
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-[var(--border-light)] transition-all duration-200"
                      aria-expanded={userMenuOpen}
                      aria-haspopup="true"
                    >
                      {/* User Avatar */}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center text-white text-sm font-medium overflow-hidden">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{user?.fullName?.charAt(0).toUpperCase() || 'U'}</span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-[var(--text-secondary)] max-w-[100px] truncate">
                        {user?.fullName?.split(' ')[0] || 'User'}
                      </span>
                      <ChevronDown 
                        className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} 
                      />
                    </button>

                    {/* User Dropdown Menu */}
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-xl overflow-hidden"
                        >
                          {/* User Info Header */}
                          <div className="px-4 py-3 border-b border-[var(--border-light)] bg-white/5">
                            <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                              {user?.fullName}
                            </p>
                            <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                              {user?.email}
                            </p>
                          </div>
                          
                          {/* Menu Items */}
                          <div className="p-2">
                            <Link
                              to={getDashboardPath()}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 rounded-lg transition-colors duration-200"
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              Dashboard
                            </Link>
                            <Link
                              to="/profile"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 rounded-lg transition-colors duration-200"
                            >
                              <User className="w-4 h-4" />
                              Profile
                            </Link>
                            <div className="h-px bg-[var(--border-light)] my-1" />
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                            >
                              <LogOut className="w-4 h-4" />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button (Requirement 14.2) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 rounded-lg transition-colors duration-200"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer (Requirement 14.2) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[280px] bg-[var(--bg-secondary)] border-l border-[var(--border-light)] md:hidden overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--border-light)]">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold text-[var(--text-primary)]">
                    Bid<span className="text-[var(--accent-blue)]">Sphere</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-4">
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    item.href.startsWith('#') ? (
                      <button
                        key={item.label}
                        onClick={() => handleNavClick(item.href)}
                        className="w-full text-left px-4 py-3 text-base font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 rounded-lg transition-colors duration-200"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`
                          block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200
                          ${isActiveLink(item.href)
                            ? 'text-[var(--text-primary)] bg-white/10'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                          }
                        `}
                      >
                        {item.label}
                      </Link>
                    )
                  ))}
                </nav>

                <div className="h-px bg-[var(--border-light)] my-4" />

                {/* Mobile Auth Section */}
                {!isAuthenticated ? (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center text-base font-medium text-[var(--text-primary)] border border-[var(--border-medium)] rounded-xl hover:bg-white/5 transition-colors duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center text-base font-medium text-white bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] rounded-xl hover:shadow-[var(--shadow-glow)] transition-all duration-300"
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center text-white text-lg font-medium overflow-hidden">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{user?.fullName?.charAt(0).toUpperCase() || 'U'}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                          {user?.fullName}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    {/* User Actions */}
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 rounded-lg transition-colors duration-200"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 rounded-lg transition-colors duration-200"
                    >
                      <User className="w-5 h-5" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
