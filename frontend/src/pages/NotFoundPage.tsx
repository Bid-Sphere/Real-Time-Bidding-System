import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Layout from '@/components/layout/Layout';

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-main/5 via-info-main/5 to-primary-main/5 dark:from-primary-main/10 dark:via-info-main/10 dark:to-primary-main/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl"
        >
          {/* 404 Number */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-main to-info-main leading-none">
              404
            </h1>
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
            className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-main/20 to-info-main/20 text-primary-main"
          >
            <Search className="w-10 h-10" />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Page Not Found
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto"
          >
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/">
              <Button variant="primary" size="lg" icon={<Home className="w-5 h-5" />}>
                Go Home
              </Button>
            </Link>
            <button onClick={() => window.history.back()}>
              <Button variant="outline" size="lg" icon={<ArrowLeft className="w-5 h-5" />}>
                Go Back
              </Button>
            </button>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Here are some helpful links instead:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                to="/"
                className="text-primary-main hover:text-primary-dark dark:hover:text-primary-light transition-colors"
              >
                Home
              </Link>
              <Link
                to="/login"
                className="text-primary-main hover:text-primary-dark dark:hover:text-primary-light transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-primary-main hover:text-primary-dark dark:hover:text-primary-light transition-colors"
              >
                Sign Up
              </Link>
              <a
                href="#categories"
                className="text-primary-main hover:text-primary-dark dark:hover:text-primary-light transition-colors"
              >
                Categories
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}
