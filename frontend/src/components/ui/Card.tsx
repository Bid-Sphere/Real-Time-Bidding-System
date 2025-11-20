import React from 'react';
import { motion } from 'framer-motion';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'filled';
  hoverable?: boolean;
  clickable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'elevated',
      hoverable = false,
      clickable = false,
      padding = 'md',
      children,
      className = '',
      onClick,
    },
    ref
  ) => {
    // Base styles
    const baseStyles = 'rounded-xl transition-shadow duration-150 bg-[var(--color-bg-elevated)]';

    // Variant styles
    const variantStyles = {
      elevated: 'shadow-[var(--shadow-md)]',
      outlined: 'border-2 border-[var(--color-border)]',
      filled: 'bg-[var(--color-bg-secondary)]',
    };

    // Padding styles
    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    // Hoverable styles - only shadow, scale and translate handled by Framer Motion
    const hoverStyles = hoverable
      ? 'hover:shadow-[var(--shadow-xl)]'
      : '';

    // Clickable styles
    const clickableStyles = clickable || onClick
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
            scale: 1.02,
            y: -4,
          }
        : {
            scale: 1,
            y: 0,
          },
    };

    const MotionDiv = motion.div;
    
    // If clickable or has onClick, use motion.div with tap animation
    if (clickable || onClick) {
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
          role={onClick ? 'button' : undefined}
          tabIndex={onClick ? 0 : undefined}
          aria-label={className?.includes('category') ? 'Project category card' : undefined}
          onKeyDown={
            onClick
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick(e as any);
                  }
                }
              : undefined
          }
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
        whileHover="hover"
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        {children}
      </MotionDiv>
    );
  }
);

Card.displayName = 'Card';

export default Card;
