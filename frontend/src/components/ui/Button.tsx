import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Button Component - Phase 1 Frontend Redesign
 * Requirements: 1.5, 1.6 - Consistent border-radius and subtle glow effects
 * 
 * Variants:
 * - primary: Gradient blue/purple background with glow
 * - secondary: Solid purple background
 * - ghost: Transparent with hover background
 * - outline: Border only with transparent background
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode; // Legacy support
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      icon, // Legacy support
      leftIcon,
      rightIcon,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    // Support both 'icon' (legacy) and 'leftIcon' props
    const resolvedLeftIcon = leftIcon || icon;
    // Base styles with dark theme
    const baseStyles = `
      inline-flex items-center justify-center gap-2 
      font-medium 
      transition-all duration-[var(--transition-fast)]
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]
      disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
      text-center
    `.trim().replace(/\s+/g, ' ');

    // Variant styles with dark theme (Requirements 1.5, 1.6, 15.1, 15.5)
    // All hover transitions are under 300ms for responsiveness
    const variantStyles = {
      primary: `
        bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)]
        text-white
        hover:from-[var(--accent-blue-dark)] hover:to-[var(--accent-purple-dark)]
        hover:shadow-[var(--shadow-glow)]
        hover:brightness-110
        active:brightness-95
        focus-visible:ring-[var(--accent-blue)]
        rounded-full
      `.trim().replace(/\s+/g, ' '),
      secondary: `
        bg-[var(--accent-purple)]
        text-white
        hover:bg-[var(--accent-purple-dark)]
        hover:shadow-[var(--shadow-glow-purple)]
        hover:brightness-110
        active:brightness-95
        focus-visible:ring-[var(--accent-purple)]
        rounded-full
      `.trim().replace(/\s+/g, ' '),
      ghost: `
        bg-transparent
        text-[var(--text-secondary)]
        hover:bg-[var(--border-light)]
        hover:text-[var(--text-primary)]
        active:bg-[var(--border-medium)]
        focus-visible:ring-[var(--accent-blue)]
        rounded-[var(--radius-lg)]
      `.trim().replace(/\s+/g, ' '),
      outline: `
        bg-transparent
        border border-[var(--border-medium)]
        text-[var(--text-primary)]
        hover:bg-[var(--border-light)]
        hover:border-[var(--accent-blue)]
        hover:text-[var(--accent-blue)]
        active:bg-[var(--border-medium)]
        focus-visible:ring-[var(--accent-blue)]
        rounded-full
      `.trim().replace(/\s+/g, ' '),
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-4 py-1.5 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-3.5 text-lg',
    };

    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';

    // Combine all styles
    const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;

    // Animation variants for Framer Motion
    const buttonVariants = {
      rest: { scale: 1 },
      hover: { scale: 1.02 },
      tap: { scale: 0.98 },
    };

    const MotionButton = motion.button;
    
    return (
      <MotionButton
        ref={ref}
        className={combinedStyles}
        disabled={disabled || loading}
        variants={buttonVariants}
        initial="rest"
        whileHover={!disabled && !loading ? "hover" : "rest"}
        whileTap={!disabled && !loading ? "tap" : "rest"}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        type={props.type || 'button'}
        onClick={props.onClick}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        aria-label={props['aria-label']}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        role={props.onClick && !props.type ? 'button' : undefined}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            <span>Loading...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            {resolvedLeftIcon && <span className="flex items-center justify-center" aria-hidden="true">{resolvedLeftIcon}</span>}
            <span className="flex items-center justify-center">{children}</span>
            {rightIcon && <span className="flex items-center justify-center" aria-hidden="true">{rightIcon}</span>}
          </div>
        )}
      </MotionButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;
