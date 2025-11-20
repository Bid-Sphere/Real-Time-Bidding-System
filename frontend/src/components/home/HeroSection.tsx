import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section 
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-main/10 via-info-main/10 to-primary-main/5 dark:from-primary-main/20 dark:via-info-main/20 dark:to-primary-main/10"
      aria-label="Hero section"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary-main/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-info-main/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm" role="banner">
            <Sparkles className="w-4 h-4 text-primary-main" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Welcome to the Future of Bidding
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Connect with the Right
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-main to-info-main">
              Talent for Your Projects
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Post your IT, Construction, or Procurement projects and receive competitive bids from qualified vendors and freelancers worldwide.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/signup')}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const categorySection = document.getElementById('categories');
                categorySection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Categories
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400"
            role="list"
            aria-label="Platform benefits"
          >
            <div className="flex items-center gap-2" role="listitem">
              <div className="w-2 h-2 bg-success-main rounded-full" aria-hidden="true" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2" role="listitem">
              <div className="w-2 h-2 bg-success-main rounded-full" aria-hidden="true" />
              <span>Free to Post Projects</span>
            </div>
            <div className="flex items-center gap-2" role="listitem">
              <div className="w-2 h-2 bg-success-main rounded-full" aria-hidden="true" />
              <span>Secure Platform</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
