import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, DollarSign, Clock, Tag, AlignLeft } from 'lucide-react';

/**
 * PostProjectPreview Component
 * Phase 1 Frontend Redesign - Post Your Project Preview Section
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 * - 6.1: Display a "Post Your Project" section with an interactive preview
 * - 6.2: Show form field labels (Project Title, Category, Budget Range, Timeline, Description)
 * - 6.3: Display sample/placeholder values in the preview fields
 * - 6.4: Include a CTA button to start posting a project (redirects to signup if not authenticated)
 * - 6.5: Use dark-themed form inputs with light borders
 */

interface PreviewFieldProps {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  isTextarea?: boolean;
}

const PreviewField: React.FC<PreviewFieldProps> = ({ icon, label, placeholder, isTextarea = false }) => (
  <div className="flex flex-col gap-1.5 sm:gap-2">
    <label className="text-xs sm:text-sm font-medium text-text-primary flex items-center gap-1.5 sm:gap-2">
      {icon}
      {label}
    </label>
    {isTextarea ? (
      <div className="w-full px-3 sm:px-4 py-2.5 sm:py-3 min-h-[80px] sm:min-h-[100px] text-sm sm:text-base text-text-muted bg-bg-input border border-border-light rounded-lg sm:rounded-xl cursor-default">
        {placeholder}
      </div>
    ) : (
      <div className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-text-muted bg-bg-input border border-border-light rounded-lg sm:rounded-xl cursor-default truncate">
        {placeholder}
      </div>
    )}
  </div>
);

export const PostProjectPreview: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  
  const isContentInView = useInView(contentRef, { once: true, margin: '-50px' });
  const isFormInView = useInView(formRef, { once: true, margin: '-50px' });

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
      id="post-project"
      className="py-12 sm:py-16 md:py-20 lg:py-28 relative px-4 sm:px-0"
      aria-labelledby="post-project-heading"
    >
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            ref={contentRef}
            variants={containerVariants}
            initial="hidden"
            animate={isContentInView ? "visible" : "hidden"}
          >
            {/* Heading - Requirement 6.1 */}
            <motion.h2
              id="post-project-heading"
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4 sm:mb-6 text-center lg:text-left"
            >
              Post Your{' '}
              <span className="text-gradient-primary">Project</span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-text-secondary mb-6 sm:mb-8 leading-relaxed text-center lg:text-left"
            >
              Getting started is easy. Simply describe your project and let professional 
              organizations compete to deliver the best value. Our streamlined process 
              ensures you find the perfect match for your needs.
            </motion.p>

            {/* CTA Button - Requirement 6.4, 15.1, 15.5 */}
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
              <Link
                to="/signup"
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-primary hover:brightness-110 text-white rounded-full font-semibold transition-all duration-150 hover:scale-105 hover:-translate-y-0.5 shadow-glow-sm hover:shadow-glow-md active:scale-100 text-sm sm:text-base"
              >
                Start Posting
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-150 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Interactive Preview Form (Requirements 6.2, 6.3, 6.5) */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isFormInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative"
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 rounded-3xl blur-2xl" />
            
            {/* Form Preview Container */}
            <div className="relative glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 mt-8 lg:mt-0">
              {/* Form Header */}
              <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-border-light">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center ring-1 ring-border-light">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-accent-blue" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-text-primary">New Project</h3>
                  <p className="text-xs sm:text-sm text-text-muted">Fill in the details below</p>
                </div>
              </div>

              {/* Preview Fields - Requirements 6.2, 6.3, 6.5 */}
              <PreviewField
                icon={<FileText className="w-4 h-4 text-accent-blue" />}
                label="Project Title"
                placeholder="e.g., Website Redesign for E-commerce Platform"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <PreviewField
                  icon={<Tag className="w-4 h-4 text-accent-purple" />}
                  label="Category"
                  placeholder="Web Development"
                />
                <PreviewField
                  icon={<DollarSign className="w-4 h-4 text-accent-blue" />}
                  label="Budget Range"
                  placeholder="$5,000 - $10,000"
                />
              </div>

              <PreviewField
                icon={<Clock className="w-4 h-4 text-accent-purple" />}
                label="Timeline"
                placeholder="4-6 weeks"
              />

              <PreviewField
                icon={<AlignLeft className="w-4 h-4 text-accent-blue" />}
                label="Description"
                placeholder="Describe your project requirements, goals, and any specific features you need..."
                isTextarea
              />

              {/* Preview CTA - Requirement 15.1, 15.5 */}
              <div className="pt-3 sm:pt-4">
                <Link
                  to="/signup"
                  className="group w-full inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-primary hover:brightness-110 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-150 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-100 text-sm sm:text-base"
                >
                  Post Project
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-150 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PostProjectPreview;
