import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();
  const isDark = mode === 'dark';
  
  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
      aria-pressed={isDark}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          scale: isDark ? 0 : 1,
          opacity: isDark ? 0 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
        className="absolute"
      >
        <Sun className="w-5 h-5 text-yellow-500" />
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 0 : -180,
          scale: isDark ? 1 : 0,
          opacity: isDark ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
        className="absolute"
      >
        <Moon className="w-5 h-5 text-blue-400" />
      </motion.div>
    </motion.button>
  );
};
