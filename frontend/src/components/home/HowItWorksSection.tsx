import { motion } from 'framer-motion';
import { StepCard } from './StepCard';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { FileText, Users, Trophy } from 'lucide-react';

const steps = [
  {
    stepNumber: 1,
    title: 'Post Project',
    description: 'Create a detailed project listing with your requirements, budget, and timeline.',
    icon: <FileText className="w-full h-full" />,
  },
  {
    stepNumber: 2,
    title: 'Receive Bids',
    description: 'Get competitive proposals from qualified organizations and freelancers within hours.',
    icon: <Users className="w-full h-full" />,
  },
  {
    stepNumber: 3,
    title: 'Award Winner',
    description: 'Review bids, compare profiles, and select the best candidate for your project.',
    icon: <Trophy className="w-full h-full" />,
  },
];

export const HowItWorksSection = () => {
  // Use the new scroll animation hook for the section header
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '-100px',
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.8, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: 'spring' as const,
        damping: 15,
        stiffness: 80,
      },
    },
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Using useScrollAnimation hook for header animation */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-600 ease-out ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get started in three simple steps and connect with the right talent for your project.
          </p>
        </div>

        {/* Using Framer Motion for staggered card animations */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-100px', amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16"
        >
          {steps.map((step) => (
            <motion.div
              key={step.stepNumber}
              variants={itemVariants}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <StepCard
                stepNumber={step.stepNumber}
                title={step.title}
                description={step.description}
                icon={step.icon}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Connecting line decoration (hidden on mobile) */}
        <div className="hidden md:block relative -mt-64 mb-64">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-main/30 to-transparent" />
        </div>
      </div>
    </section>
  );
};
