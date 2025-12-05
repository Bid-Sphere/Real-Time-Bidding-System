import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  FileText, 
  Users, 
  Building2, 
  Search, 
  Send, 
  Award,
  DollarSign,
  BadgeCheck,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

/**
 * HowItWorksSection Component
 * Phase 1 Frontend Redesign - How It Works Section
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6
 * - 7.1: Display a "How It Works" section with three columns/cards
 * - 7.2: Include a "For Clients" card explaining: post project, receive bids, select organization
 * - 7.3: Include a "For Organizations" card explaining: browse projects, submit bids, win work
 * - 7.4: Include a "Platform Benefits" card explaining: competitive pricing, verified orgs, secure process
 * - 7.5: Use consistent card styling with dark backgrounds and subtle borders
 * - 7.6: Include bullet points with arrow/chevron icons for each step
 */

interface Step {
  icon: React.ReactNode;
  text: string;
}

interface HowItWorksCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  steps: Step[];
  index: number;
  accentColor: 'blue' | 'purple' | 'gradient';
}

const HowItWorksCard: React.FC<HowItWorksCardProps> = ({ 
  title, 
  description, 
  icon, 
  steps, 
  index,
  accentColor 
}) => {
  const accentStyles = {
    blue: 'from-accent-blue/20 to-accent-blue/10 ring-accent-blue/30',
    purple: 'from-accent-purple/20 to-accent-purple/10 ring-accent-purple/30',
    gradient: 'from-accent-blue/20 to-accent-purple/20 ring-border-light',
  };

  const iconColors = {
    blue: 'text-accent-blue',
    purple: 'text-accent-purple',
    gradient: 'text-accent-blue',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative h-full"
    >
      {/* Card with dark background and subtle border - Requirement 7.5, 15.1 */}
      <div className="h-full rounded-xl sm:rounded-2xl bg-bg-card border border-border-light p-4 sm:p-6 lg:p-8 hover:border-border-medium hover:-translate-y-1 transition-all duration-150 hover:shadow-card-hover">
        {/* Card Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Icon with circular background */}
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${accentStyles[accentColor]} flex items-center justify-center ring-1 ${accentStyles[accentColor].split(' ').pop()}`}>
            <span className={iconColors[accentColor]}>{icon}</span>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-text-primary">{title}</h3>
            <p className="text-xs sm:text-sm text-text-muted">{description}</p>
          </div>
        </div>

        {/* Steps with bullet points and chevron icons - Requirement 7.6 */}
        <ul className="space-y-3 sm:space-y-4">
          {steps.map((step, stepIndex) => (
            <li 
              key={stepIndex}
              className="flex items-start gap-2 sm:gap-3 group"
            >
              {/* Chevron icon - Requirement 7.6 */}
              <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 flex items-center justify-center mt-0.5 group-hover:from-accent-blue/20 group-hover:to-accent-purple/20 transition-all duration-200">
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-accent-blue" />
              </div>
              <div className="flex items-start gap-2 sm:gap-3 flex-1">
                {/* Step icon */}
                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-bg-secondary flex items-center justify-center ring-1 ring-border-light">
                  {step.icon}
                </div>
                {/* Step text */}
                <span className="text-text-secondary text-xs sm:text-sm leading-relaxed pt-0.5 sm:pt-1">
                  {step.text}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};


// Card data for the three columns - Requirements 7.2, 7.3, 7.4
const cardsData: Omit<HowItWorksCardProps, 'index'>[] = [
  {
    // Requirement 7.2: "For Clients" card
    title: 'For Clients',
    description: 'Find the perfect organization',
    icon: <Users className="w-6 h-6" />,
    accentColor: 'blue',
    steps: [
      {
        icon: <FileText className="w-4 h-4 text-accent-blue" />,
        text: 'Post your project with detailed requirements, budget, and timeline',
      },
      {
        icon: <Users className="w-4 h-4 text-accent-purple" />,
        text: 'Receive competitive bids from qualified organizations',
      },
      {
        icon: <Building2 className="w-4 h-4 text-accent-blue" />,
        text: 'Select the best organization based on proposals and reviews',
      },
    ],
  },
  {
    // Requirement 7.3: "For Organizations" card
    title: 'For Organizations',
    description: 'Win projects and grow',
    icon: <Building2 className="w-6 h-6" />,
    accentColor: 'purple',
    steps: [
      {
        icon: <Search className="w-4 h-4 text-accent-purple" />,
        text: 'Browse available projects that match your expertise',
      },
      {
        icon: <Send className="w-4 h-4 text-accent-blue" />,
        text: 'Submit compelling bids with your best proposals',
      },
      {
        icon: <Award className="w-4 h-4 text-accent-purple" />,
        text: 'Win work and build lasting client relationships',
      },
    ],
  },
  {
    // Requirement 7.4: "Platform Benefits" card
    title: 'Platform Benefits',
    description: 'Why choose our platform',
    icon: <Award className="w-6 h-6" />,
    accentColor: 'gradient',
    steps: [
      {
        icon: <DollarSign className="w-4 h-4 text-accent-blue" />,
        text: 'Competitive pricing through transparent bidding process',
      },
      {
        icon: <BadgeCheck className="w-4 h-4 text-accent-purple" />,
        text: 'Verified organizations with proven track records',
      },
      {
        icon: <ShieldCheck className="w-4 h-4 text-accent-blue" />,
        text: 'Secure process with protected transactions and data',
      },
    ],
  },
];

export const HowItWorksSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
      id="how-it-works"
      className="py-12 sm:py-16 md:py-20 lg:py-28 relative px-4 sm:px-0"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container-main">
        {/* Section Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <motion.h2
            id="how-it-works-heading"
            variants={headerVariants}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-3 sm:mb-4"
          >
            How It{' '}
            <span className="text-gradient-primary">Works</span>
          </motion.h2>
          <motion.p
            variants={headerVariants}
            className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto px-4 sm:px-0"
          >
            Get started in minutes. Our platform makes it easy for clients and organizations 
            to connect and collaborate on projects.
          </motion.p>
        </motion.div>

        {/* Three-column card layout - Requirement 7.1 - Stack on mobile, 2 cols on tablet, 3 on desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {cardsData.map((card, index) => (
            <HowItWorksCard
              key={card.title}
              {...card}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
