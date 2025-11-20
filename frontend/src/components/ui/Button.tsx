import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
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
      icon,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    // Variant styles
    const variantStyles = {
      primary: 'bg-[var(--color-primary-main)] text-white hover:bg-[var(--color-primary-dark)] focus:ring-[var(--color-primary-main)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-primary)] active:scale-95',
      secondary: 'bg-[var(--color-secondary-main)] text-white hover:bg-[var(--color-secondary-dark)] focus:ring-[var(--color-secondary-main)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] active:scale-95',
      outline: 'border-2 border-[var(--color-primary-main)] text-[var(--color-primary-main)] hover:bg-[var(--color-primary-main)] hover:text-white focus:ring-[var(--color-primary-main)] active:scale-95',
      text: 'text-[var(--color-primary-main)] hover:bg-[var(--color-primary-main)]/10 focus:ring-[var(--color-primary-main)] active:scale-95',
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
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
        transition={{ duration: 0.2, ease: 'easeInOut' }}
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
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && <span className="inline-flex items-center" aria-hidden="true">{icon}</span>}
            <span>{children}</span>
          </>
        )}
      </MotionButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;
