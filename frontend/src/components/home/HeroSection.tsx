import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, FileText, Users, Trophy, Briefcase, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * HeroSection Component
 * Phase 1 Frontend Redesign - Hero Section
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 15.3
 * - 3.1: Prominent tagline adapted for bidding platform context
 * - 3.2: Highlighted keyword with bordered box effect
 * - 3.3: Illustrative graphic representing bidding/project concept
 * - 3.4: Floating service labels around illustration
 * - 3.5: Primary CTA button directing to post project or browse
 * - 15.3: Fade-in and slide-up animations using Framer Motion
 */

interface FloatingLabelProps {
  icon: React.ReactNode;
  text: string;
  position: string;
  delay: number;
}

const FloatingLabel: React.FC<FloatingLabelProps> = ({ icon, text, position, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.05, y: -2 }}
    className={`absolute ${position} hidden sm:flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full glass-panel text-xs sm:text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border-medium hover:bg-white/10 cursor-default transition-all duration-150`}
  >
    {icon}
    <span className="whitespace-nowrap">{text}</span>
  </motion.div>
);

export const HeroSection: React.FC = () => {
  // Refs for scroll-triggered animations (Requirement 15.3)
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const illustrationRef = useRef<HTMLDivElement>(null);
  
  // Use Framer Motion's useInView for scroll-triggered animations
  const isTextInView = useInView(textRef, { once: true, margin: '-100px' });
  const isIllustrationInView = useInView(illustrationRef, { once: true, margin: '-100px' });

  // Animation variants for staggered children (Requirement 15.3)
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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  // Slide-up animation variant for scroll trigger
  const slideUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' as const },
    },
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-0"
    >
      {/* Background gradient elements - scaled for mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-accent-blue/10 rounded-full blur-3xl animate-float" />
        <div 
          className="absolute bottom-1/4 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-accent-purple/10 rounded-full blur-3xl animate-float" 
          style={{ animationDelay: '2s' }} 
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[450px] md:w-[600px] h-[300px] sm:h-[450px] md:h-[600px] bg-gradient-radial from-accent-blue/5 to-transparent rounded-full" 
        />
      </div>

      <div className="container-main relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content with scroll-triggered fade-in/slide-up (Requirement 15.3) */}
          <motion.div
            ref={textRef}
            variants={containerVariants}
            initial="hidden"
            animate={isTextInView ? "visible" : "hidden"}
            className="text-center lg:text-left"
          >
            {/* Tagline - Requirement 3.1, 3.2 */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6"
            >
              Your project is what{' '}
              <span className="relative inline-block">
                <span className="relative z-10 px-3 py-1 text-gradient-primary">
                  organizations
                </span>
                {/* Bordered box effect - Requirement 3.2 */}
                <span className="absolute inset-0 border-2 border-accent-blue/50 rounded-lg" />
              </span>{' '}
              compete for
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-text-secondary mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Post your project and receive competitive bids from verified professional organizations. 
              Find the perfect match for your business needs.
            </motion.p>

            {/* CTA Buttons - Requirement 3.5, 15.1, 15.5 */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-primary hover:brightness-110 text-white rounded-xl font-semibold transition-all duration-150 hover:scale-105 hover:-translate-y-0.5 shadow-glow-sm hover:shadow-glow-md active:scale-100 text-sm sm:text-base"
              >
                Post a Project
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-150 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 glass-panel hover:bg-white/10 hover:border-[var(--border-medium)] text-text-primary rounded-xl font-semibold transition-all duration-150 hover:scale-105 hover:-translate-y-0.5 active:scale-100 text-sm sm:text-base"
              >
                Browse Projects
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Illustration with Floating Labels and scroll-triggered animation (Requirement 15.3) */}
          <motion.div
            ref={illustrationRef}
            variants={slideUpVariants}
            initial="hidden"
            animate={isIllustrationInView ? "visible" : "hidden"}
            className="relative flex items-center justify-center mt-8 lg:mt-0"
          >
            {/* Illustrative Graphic - Requirement 3.3 */}
            <div className="relative w-full max-w-xs sm:max-w-md lg:max-w-lg aspect-square">
              {/* Central illustration placeholder */}
              <div className="absolute inset-8 rounded-3xl glass-card flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Abstract bidding visualization */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent-blue/30 to-accent-purple/30 animate-pulse-glow" />
                  </div>
                  <div className="relative z-10 text-center p-6">
                    <Briefcase className="w-16 h-16 mx-auto mb-4 text-accent-blue" />
                    <p className="text-text-secondary text-sm">Your Project</p>
                    <div className="mt-4 flex justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent-blue animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-accent-purple animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-accent-blue animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Service Labels - Requirement 3.4 - Hidden on mobile for cleaner layout */}
              <FloatingLabel
                icon={<FileText className="w-3 h-3 sm:w-4 sm:h-4 text-accent-blue" />}
                text="Project Posting"
                position="top-0 left-0 sm:-translate-x-2 md:-translate-x-4"
                delay={0.5}
              />
              <FloatingLabel
                icon={<TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-accent-purple" />}
                text="Competitive Bids"
                position="top-0 right-0 sm:translate-x-2 md:translate-x-4"
                delay={0.6}
              />
              <FloatingLabel
                icon={<Users className="w-3 h-3 sm:w-4 sm:h-4 text-accent-blue" />}
                text="Organization Profiles"
                position="bottom-1/4 sm:-left-4 md:-left-8"
                delay={0.7}
              />
              <FloatingLabel
                icon={<Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-accent-purple" />}
                text="Best Match"
                position="bottom-1/4 sm:-right-4 md:-right-8"
                delay={0.8}
              />
              <FloatingLabel
                icon={<Shield className="w-3 h-3 sm:w-4 sm:h-4 text-accent-blue" />}
                text="Secure Platform"
                position="bottom-0 left-1/2 -translate-x-1/2 sm:translate-y-2 md:translate-y-4"
                delay={0.9}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
