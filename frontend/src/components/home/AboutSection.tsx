import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Handshake, Target, Users, Zap } from 'lucide-react';

/**
 * AboutSection Component
 * Phase 1 Frontend Redesign - About Us Section
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4
 * - 5.1: Display an "About Us" section with a heading and descriptive paragraph
 * - 5.2: Include an illustration representing the platform's mission
 * - 5.3: Explain how the platform connects clients with organizations through competitive bidding
 * - 5.4: Maintain the dark theme aesthetic with proper text contrast
 */

interface MissionPointProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const MissionPoint: React.FC<MissionPointProps> = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    className="flex items-start gap-3 sm:gap-4"
  >
    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center ring-1 ring-border-light">
      {icon}
    </div>
    <div>
      <h4 className="text-text-primary font-semibold mb-1 text-sm sm:text-base">{title}</h4>
      <p className="text-text-secondary text-xs sm:text-sm">{description}</p>
    </div>
  </motion.div>
);

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const illustrationRef = useRef<HTMLDivElement>(null);
  
  const isContentInView = useInView(contentRef, { once: true, margin: '-50px' });
  const isIllustrationInView = useInView(illustrationRef, { once: true, margin: '-50px' });

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
      id="about"
      className="py-12 sm:py-16 md:py-20 lg:py-28 relative px-4 sm:px-0"
      aria-labelledby="about-heading"
    >
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Column - Illustration (Requirement 5.2) */}
          <motion.div
            ref={illustrationRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isIllustrationInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative order-2 lg:order-1 mt-8 lg:mt-0"
          >
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto aspect-square">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 rounded-3xl blur-2xl" />
              
              {/* Main illustration container */}
              <div className="relative h-full rounded-3xl glass-card overflow-hidden p-8 flex flex-col items-center justify-center">
                {/* Central icon representing connection */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-blue/30 to-accent-purple/30 flex items-center justify-center animate-pulse-glow">
                    <Handshake className="w-12 h-12 text-accent-blue" />
                  </div>
                  
                  {/* Orbiting elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center ring-1 ring-accent-blue/30">
                    <Users className="w-4 h-4 text-accent-blue" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center ring-1 ring-accent-purple/30">
                    <Target className="w-4 h-4 text-accent-purple" />
                  </div>
                </div>
                
                {/* Connection lines visualization */}
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-bg-secondary flex items-center justify-center ring-1 ring-border-light">
                      <span className="text-xs font-medium text-text-secondary">Client</span>
                    </div>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-accent-blue to-accent-purple" />
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-bg-secondary flex items-center justify-center ring-1 ring-border-light">
                      <span className="text-xs font-medium text-text-secondary">Org</span>
                    </div>
                  </div>
                </div>
                
                <p className="mt-6 text-text-muted text-sm text-center">
                  Connecting projects with the right organizations
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Content (Requirements 5.1, 5.3, 5.4) */}
          <motion.div
            ref={contentRef}
            variants={containerVariants}
            initial="hidden"
            animate={isContentInView ? "visible" : "hidden"}
            className="order-1 lg:order-2"
          >
            {/* Heading - Requirement 5.1 */}
            <motion.h2
              id="about-heading"
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4 sm:mb-6 text-center lg:text-left"
            >
              About{' '}
              <span className="text-gradient-primary">Us</span>
            </motion.h2>

            {/* Descriptive paragraph - Requirements 5.1, 5.3 */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-text-secondary mb-6 sm:mb-8 leading-relaxed text-center lg:text-left"
            >
              We're building the future of project collaboration by connecting clients with 
              professional organizations through a transparent, competitive bidding process. 
              Our platform empowers businesses to find the perfect match for their projects 
              while giving organizations the opportunity to showcase their expertise and win work.
            </motion.p>

            {/* Mission points - Requirement 5.3 */}
            <motion.div
              variants={itemVariants}
              className="space-y-6"
            >
              <MissionPoint
                icon={<Target className="w-5 h-5 text-accent-blue" />}
                title="Our Mission"
                description="To democratize project sourcing by creating a fair, transparent marketplace where quality and value determine success."
                delay={0.3}
              />
              <MissionPoint
                icon={<Users className="w-5 h-5 text-accent-purple" />}
                title="For Everyone"
                description="Whether you're a client seeking expertise or an organization looking for opportunities, our platform serves your needs."
                delay={0.4}
              />
              <MissionPoint
                icon={<Zap className="w-5 h-5 text-accent-blue" />}
                title="Competitive Edge"
                description="Our bidding system ensures you get the best value while maintaining high quality standards across all projects."
                delay={0.5}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
