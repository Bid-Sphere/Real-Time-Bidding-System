import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * HeroSection Component
 * Phase 1 Frontend Redesign - Hero Section
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.5, 15.3
 * - 3.1: Prominent tagline adapted for bidding platform context
 * - 3.2: Highlighted keyword with subtle glow effect
 * - 3.3: Modern flow visualization showing the bidding process
 * - 3.5: Primary CTA button directing to post project or browse
 * - 15.3: Fade-in and slide-up animations using Framer Motion
 */

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
                {/* Subtle glow effect instead of border - Requirement 3.2 */}
                <span className="absolute inset-0 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 rounded-lg blur-sm" />
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

          {/* Right Column - Illustrated Scene with Floating Labels (Requirement 15.3) */}
          <motion.div
            ref={illustrationRef}
            variants={slideUpVariants}
            initial="hidden"
            animate={isIllustrationInView ? "visible" : "hidden"}
            className="relative flex items-center justify-center mt-8 lg:mt-0 min-h-[400px] sm:min-h-[500px]"
          >
            <div className="relative w-full max-w-lg">
              {/* Central SVG Illustration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative z-10 flex items-center justify-center"
              >
                <img 
                  src="/hero-illustration-custom.svg" 
                  alt="Project Bidding Platform Illustration" 
                  className="w-full h-auto max-w-md opacity-90"
                />
              </motion.div>

              {/* Floating Label Pills */}
              {/* Top Left */}
              <motion.div
                initial={{ opacity: 0, x: -30, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute top-8 left-0 sm:left-4 px-4 py-2 rounded-full bg-gradient-to-r from-accent-blue to-accent-blue-dark text-white text-xs sm:text-sm font-semibold shadow-lg shadow-accent-blue/30 whitespace-nowrap"
              >
                PROJECT POSTING
              </motion.div>

              {/* Top Right */}
              <motion.div
                initial={{ opacity: 0, x: 30, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute top-4 right-0 sm:right-4 px-4 py-2 rounded-full bg-gradient-to-r from-accent-purple to-accent-purple-dark text-white text-xs sm:text-sm font-semibold shadow-lg shadow-accent-purple/30 whitespace-nowrap"
              >
                COMPETITIVE BIDS
              </motion.div>

              {/* Middle Left */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute top-1/2 -translate-y-1/2 left-0 sm:-left-8 px-4 py-2 rounded-full bg-gradient-to-r from-accent-blue/80 to-accent-blue-dark/80 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-accent-blue/20 whitespace-nowrap"
              >
                VERIFIED ORGS
              </motion.div>

              {/* Middle Right */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute top-1/2 -translate-y-1/2 right-0 sm:-right-8 px-4 py-2 rounded-full bg-gradient-to-r from-accent-purple/80 to-accent-purple-dark/80 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-accent-purple/20 whitespace-nowrap"
              >
                BEST MATCH
              </motion.div>

              {/* Bottom Left */}
              <motion.div
                initial={{ opacity: 0, x: -30, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-8 left-4 sm:left-8 px-4 py-2 rounded-full bg-gradient-to-r from-accent-blue/80 to-accent-purple/80 text-white text-xs sm:text-sm font-semibold shadow-lg whitespace-nowrap"
              >
                SECURE PLATFORM
              </motion.div>

              {/* Bottom Right */}
              <motion.div
                initial={{ opacity: 0, x: 30, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="absolute bottom-12 right-4 sm:right-8 px-4 py-2 rounded-full bg-gradient-to-r from-accent-purple/80 to-accent-blue/80 text-white text-xs sm:text-sm font-semibold shadow-lg whitespace-nowrap"
              >
                REAL-TIME UPDATES
              </motion.div>

              {/* Decorative floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-12 w-8 h-8 rounded-lg bg-accent-blue/20 backdrop-blur-sm border border-accent-blue/30 rotate-12"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-24 left-8 w-6 h-6 rounded-full bg-accent-purple/20 backdrop-blur-sm border border-accent-purple/30"
              />
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-32 left-16 w-4 h-4 rounded-full bg-accent-blue/30"
              />

              {/* Background glow */}
              <div className="absolute inset-0 -z-10 bg-gradient-radial from-accent-blue/10 via-accent-purple/5 to-transparent blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
