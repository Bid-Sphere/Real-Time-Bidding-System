import React from 'react';
import { motion } from 'framer-motion';

/**
 * Card Component - Phase 1 Frontend Redesign
 * Requirements: 1.5, 1.6 - Consistent border-radius and subtle glow effects
 * 
 * Variants:
 * - default: Standard dark card with subtle shadow
 * - elevated: Higher elevation with stronger shadow
 * - bordered: Visible border with transparent background
 * - glass: Glassmorphism effect with backdrop blur
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean; // Legacy support - use onClick instead
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hoverable = false,
      clickable = false,
      children,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    // Determine if card should be interactive
    const isInteractive = clickable || !!onClick;
    // Base styles with dark theme
    const baseStyles = `
      rounded-[var(--radius-xl)]
      transition-all duration-[var(--transition-fast)]
    `.trim().replace(/\s+/g, ' ');

    // Variant styles (Requirements 1.5, 1.6)
    const variantStyles = {
      default: `
        bg-[var(--bg-card)]
        shadow-[var(--shadow-card)]
      `.trim().replace(/\s+/g, ' '),
      elevated: `
        bg-[var(--bg-card)]
        shadow-[var(--shadow-elevated)]
      `.trim().replace(/\s+/g, ' '),
      bordered: `
        bg-transparent
        border border-[var(--border-light)]
      `.trim().replace(/\s+/g, ' '),
      glass: `
        bg-[var(--bg-navbar)]
        backdrop-blur-xl
        border border-[var(--border-light)]
        shadow-[var(--shadow-card)]
      `.trim().replace(/\s+/g, ' '),
    };

    // Padding styles
    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    // Hoverable styles - Enhanced for Requirement 15.1, 15.5
    // All hover transitions are under 300ms for responsiveness
    const hoverStyles = (hoverable || isInteractive)
      ? `
        cursor-pointer
        hover:shadow-[var(--shadow-card-hover)]
        hover:border-[var(--border-medium)]
        hover:-translate-y-1
      `.trim().replace(/\s+/g, ' ')
      : '';

    // Clickable styles
    const clickableStyles = isInteractive
      ? 'cursor-pointer active:scale-[0.98]'
      : '';

    // Combine all styles
    const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${clickableStyles} ${className}`;

    // Animation variants for Framer Motion
    const cardVariants = {
      rest: {
        scale: 1,
        y: 0,
      },
      hover: hoverable
        ? {
            scale: 1.01,
            y: -2,
          }
        : {
            scale: 1,
            y: 0,
          },
    };

    const MotionDiv = motion.div;
    
    // Extract drag-related props to avoid type conflicts with Framer Motion
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onDrag, onDragStart, onDragEnd, onDragOver, ...restProps } = props;
    void restProps; // Acknowledge unused variable

    // If clickable or has onClick, use motion.div with tap animation
    if (isInteractive) {
      return (
        <MotionDiv
          ref={ref}
          className={combinedStyles}
          onClick={onClick}
          variants={cardVariants}
          initial="rest"
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
            }
          }}
        >
          {children}
        </MotionDiv>
      );
    }

    // Otherwise, use regular motion.div without tap animation
    return (
      <MotionDiv
        ref={ref}
        className={combinedStyles}
        variants={cardVariants}
        initial="rest"
        whileHover={hoverable ? "hover" : "rest"}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        {children}
      </MotionDiv>
    );
  }
);

Card.displayName = 'Card';

export default Card;
