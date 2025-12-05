import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CategoryCard } from './CategoryCard';
import { useAuth } from '@/hooks/useAuth';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Code, HardHat, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = [
  {
    id: 'it',
    title: 'IT Projects',
    description: 'Software development, web design, mobile apps, and technical consulting services.',
    icon: <Code className="w-full h-full" />,
    projectCount: 1247,
  },
  {
    id: 'construction',
    title: 'Construction Projects',
    description: 'Building construction, renovation, infrastructure, and engineering projects.',
    icon: <HardHat className="w-full h-full" />,
    projectCount: 892,
  },
  {
    id: 'procurement',
    title: 'Procurement Projects',
    description: 'Supply chain management, equipment sourcing, and material procurement services.',
    icon: <Package className="w-full h-full" />,
    projectCount: 634,
  },
];

export const CategorySection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Use the new scroll animation hook for the section header
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '-100px',
    triggerOnce: true,
  });

  const handleCategoryClick = (categoryId: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign up to explore projects', {
        duration: 3000,
        icon: '🔒',
      });
      setTimeout(() => navigate('/signup'), 500);
    } else {
      // Future: Navigate to filtered project view
      toast.success(`Exploring ${categoryId} projects...`, {
        duration: 2000,
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -60, y: 20 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring' as const,
        damping: 20,
        stiffness: 100,
      },
    },
  };

  return (
    <section id="categories" className="py-20 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Using useScrollAnimation hook for header animation */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ease-out ${headerInView ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-95'
            }`}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Explore Project Categories
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Browse through our diverse range of project categories and find the perfect match for your expertise.
          </p>
        </div>

        {/* Using Framer Motion for staggered card animations */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <CategoryCard
                title={category.title}
                description={category.description}
                icon={category.icon}
                projectCount={category.projectCount}
                onClick={() => handleCategoryClick(category.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
