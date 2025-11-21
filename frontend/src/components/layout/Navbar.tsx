import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { ThemeToggle } from '../ui/ThemeToggle';

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    return dashboardMap[user.role as keyof typeof dashboardMap] || '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background-deep/80 backdrop-blur-md border-b border-border-glass shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-main to-secondary-main rounded-xl flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-all duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-text-primary font-heading tracking-tight text-2xl">Bid <span className="text-primary-main">Sphere</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-1 bg-bg-glass-subtle rounded-full px-2 py-1 backdrop-blur-sm transition-all border border-border-glass">
              <Link to="/" className="px-4 py-2 text-sm font-medium text-text-primary rounded-full hover:bg-bg-glass-subtle transition-all">Home</Link>
              <button className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary rounded-full hover:bg-bg-glass-subtle transition-all">Categories</button>
            </nav>

            <div className="flex items-center gap-4">
              <ThemeToggle />

              {!isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link to="/login">
                    <button className="text-text-primary hover:text-primary-light font-medium transition-colors px-2">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="relative overflow-hidden bg-primary-main hover:bg-primary-dark text-white px-6 py-2.5 rounded-full font-medium transition-all hover:shadow-glow-md group">
                      <span className="relative z-10">Sign Up</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary-main opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-3 p-1 pr-4 rounded-full hover:bg-bg-glass-subtle transition-all group ${scrolled ? 'border border-border-glass' : 'border-0'}`}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-main to-secondary-main flex items-center justify-center text-white shadow-inner">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                    <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">{user?.name?.split(' ')[0]}</span>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 glass-card rounded-xl overflow-hidden shadow-xl border border-border-glass"
                      >
                        <div className="px-4 py-4 border-b border-border-glass bg-bg-glass-subtle">
                          <p className="text-sm font-medium text-white">{user?.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            to={getDashboardPath()}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User size={16} /> Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                          >
                            <LogOut size={16} /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-text-primary p-2 hover:bg-bg-glass-subtle rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background-deep/95 backdrop-blur-xl border-t border-border-glass"
          >
            <div className="px-4 py-6 space-y-4">
              <Link to="/" className="block text-lg font-medium text-text-primary" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <button className="block text-lg font-medium text-text-secondary hover:text-text-primary transition-colors">Categories</button>

              <div className="h-px bg-border-glass my-4" />

              {!isAuthenticated ? (
                <div className="flex flex-col gap-4">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center py-3 text-text-primary border border-border-glass rounded-xl hover:bg-bg-glass-subtle transition-colors">Login</Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="text-center py-3 bg-primary-main text-white rounded-xl font-medium shadow-glow-sm">Sign Up</Link>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-6 bg-white/5 p-4 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-primary-main flex items-center justify-center text-white text-lg">
                      {user?.avatar ? <img src={user.avatar} alt="" className="rounded-full" /> : <User size={24} />}
                    </div>
                    <div>
                      <p className="text-white font-medium text-lg">{user?.name}</p>
                      <p className="text-sm text-gray-400">{user?.email}</p>
                    </div>
                  </div>
                  <Link to={getDashboardPath()} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-gray-300 hover:text-white text-lg">Dashboard</Link>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block py-3 text-red-400 w-full text-left text-lg">Logout</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
