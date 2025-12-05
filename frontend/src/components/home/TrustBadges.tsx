import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Building2, Trophy, Shield } from 'lucide-react';

/**
 * TrustBadges Component
 * Phase 1 Frontend Redesign - Trust Badges Section
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4
 * - 4.1: Display three trust badges in a horizontal row below the hero section
 * - 4.2: Include badges for: "Professional Organizations", "Competitive Bidding", "Secure Platform"
 * - 4.3: Display each badge with an icon and descriptive text
 * - 4.4: Use consistent icon styling with circular backgrounds
 */

interface TrustBadge {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const badges: TrustBadge[] = [
  {
    icon: <Building2 className="w-6 h-6 text-accent-blue" />,
    title: 'Professional Organizations',
    description: 'Verified and vetted business partners',
  },
  {
    icon: <Trophy className="w-6 h-6 text-accent-purple" />,
    title: 'Competitive Bidding',
    description: 'Get the best value for your projects',
  },
  {
    icon: <Shield className="w-6 h-6 text-accent-blue" />,
    title: 'Secure Platform',
    description: 'Your data and transactions protected',
  },
];

interface BadgeCardProps {
  badge: TrustBadge;
  index: number;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl glass-panel hover:bg-white/5 hover:border-[var(--border-medium)] cursor-default transition-all duration-150"
    >
      {/* Icon with circular background - Requirement 4.4 */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center mb-3 sm:mb-4 ring-1 ring-border-light">
        {badge.icon}
      </div>
      
      {/* Title - Requirement 4.3 */}
      <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-1 sm:mb-2">
        {badge.title}
      </h3>
      
      {/* Description - Requirement 4.3 */}
      <p className="text-xs sm:text-sm text-text-secondary">
        {badge.description}
      </p>
    </motion.div>
  );
};

export const TrustBadges: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' });

  return (
    <section
      ref={sectionRef}
      className="py-10 sm:py-12 md:py-16 relative px-4 sm:px-0"
      aria-label="Platform trust indicators"
    >
      <div className="container-main">
        {/* Horizontal row of badges - Requirement 4.1 - Stack on mobile, row on tablet+ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {badges.map((badge, index) => (
            <BadgeCard key={badge.title} badge={badge} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustBadges;
