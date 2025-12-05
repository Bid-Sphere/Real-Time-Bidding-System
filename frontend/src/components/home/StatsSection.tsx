import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Building2, TrendingUp, FileText } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';

/**
 * StatsSection Component
 * Phase 1 Frontend Redesign - Platform Statistics Section
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4
 * - 8.1: Display key statistics (Total Projects, Active Organizations, Success Rate, Total Bids)
 * - 8.2: Use large, bold numbers for statistic values
 * - 8.3: Include descriptive labels below each statistic
 * - 8.4: Animate statistics counting up when the section enters viewport
 */

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
  icon: React.ReactNode;
  isInView: boolean;
  delay?: number;
}

const StatItem: React.FC<StatItemProps> = ({ 
  value, 
  suffix = '', 
  label, 
  icon,
  isInView,
  delay = 0,
}) => {
  const { formattedValue } = useCountUp({
    end: value,
    duration: 2000,
    shouldStart: isInView,
    decimals: 0,
    easing: 'easeOut',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
    >
      <div className="flex flex-col items-center text-center p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-bg-card/50 border border-border-light hover:border-border-medium hover:-translate-y-1 transition-all duration-150 hover:shadow-card-hover">
        {/* Icon */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center mb-3 sm:mb-4 ring-1 ring-border-light group-hover:ring-accent-blue/30 transition-all duration-250">
          <span className="text-accent-blue">{icon}</span>
        </div>
        
        {/* Large bold number - Requirement 8.2 */}
        <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-1 sm:mb-2 tracking-tight">
          {formattedValue}
          {suffix && <span className="text-accent-blue">{suffix}</span>}
        </div>
        
        {/* Descriptive label - Requirement 8.3 */}
        <p className="text-text-secondary text-xs sm:text-sm md:text-base font-medium">
          {label}
        </p>
      </div>
    </motion.div>
  );
};

// Statistics data - Requirement 8.1
const statsData: Omit<StatItemProps, 'isInView' | 'delay'>[] = [
  {
    value: 2500,
    suffix: '+',
    label: 'Total Projects',
    icon: <Briefcase className="w-7 h-7" />,
  },
  {
    value: 850,
    suffix: '+',
    label: 'Active Organizations',
    icon: <Building2 className="w-7 h-7" />,
  },
  {
    value: 98,
    suffix: '%',
    label: 'Success Rate',
    icon: <TrendingUp className="w-7 h-7" />,
  },
  {
    value: 15000,
    suffix: '+',
    label: 'Total Bids',
    icon: <FileText className="w-7 h-7" />,
  },
];

export const StatsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  // Trigger animation when section enters viewport - Requirement 8.4
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="py-12 sm:py-16 md:py-20 lg:py-28 relative px-4 sm:px-0"
      aria-labelledby="stats-heading"
    >
      {/* Background gradient decoration - scaled for mobile */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[450px] md:w-[600px] h-[300px] sm:h-[450px] md:h-[600px] bg-gradient-to-r from-accent-blue/5 to-accent-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="container-main relative z-10">
        {/* Section Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <motion.h2
            id="stats-heading"
            variants={headerVariants}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-3 sm:mb-4"
          >
            Platform{' '}
            <span className="text-gradient-primary">Statistics</span>
          </motion.h2>
          <motion.p
            variants={headerVariants}
            className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto px-4 sm:px-0"
          >
            Join thousands of clients and organizations who trust our platform 
            for their project needs.
          </motion.p>
        </motion.div>

        {/* Statistics Grid - Requirement 8.1 - 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {statsData.map((stat, index) => (
            <StatItem
              key={stat.label}
              {...stat}
              isInView={isInView}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
