import React from 'react';

/**
 * Input Component - Phase 1 Frontend Redesign
 * Requirements: 1.5, 1.6 - Dark backgrounds, light borders, error states
 * 
 * Features:
 * - Dark themed input with semi-transparent background
 * - Light border that highlights on focus
 * - Error state with red border and message
 * - Support for icons and helper text
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode; // Legacy support
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon, // Legacy support
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      id,
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    // Support both 'icon' (legacy) and 'leftIcon' props
    const resolvedLeftIcon = leftIcon || icon;
    // Generate a unique ID if not provided
    const generatedId = React.useId();
    const inputId = id || `input-${generatedId}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // Base input styles with dark theme - Enhanced for Requirement 15.4
    const baseInputStyles = `
      w-full px-4 py-3 
      text-base text-[var(--text-primary)]
      bg-[var(--bg-input)]
      border border-[var(--border-light)]
      rounded-[var(--radius-lg)]
      placeholder:text-[var(--text-muted)]
      transition-all duration-150
      focus:outline-none
      input-focus-animate
    `.trim().replace(/\s+/g, ' ');

    // Border and focus styles - Enhanced visual feedback (Requirement 15.4)
    const borderStyles = error
      ? `
        border-[var(--color-error)]
        focus:border-[var(--color-error)]
        focus:shadow-[0_0_0_3px_rgba(239,68,68,0.25)]
        focus:ring-2 focus:ring-[var(--color-error)]/20
      `.trim().replace(/\s+/g, ' ')
      : `
        focus:border-[var(--accent-blue)]
        focus:shadow-[var(--shadow-input-focus)]
        focus:ring-2 focus:ring-[var(--accent-blue)]/20
        hover:border-[var(--border-medium)]
        hover:bg-[var(--bg-input)]/80
      `.trim().replace(/\s+/g, ' ');

    // Disabled styles
    const disabledStyles = disabled
      ? 'opacity-50 cursor-not-allowed bg-[var(--bg-secondary)]'
      : '';

    // Icon padding
    const leftPaddingStyles = resolvedLeftIcon ? 'pl-11' : '';
    const rightPaddingStyles = rightIcon ? 'pr-11' : '';

    // Combine input styles - Added peer class for icon color transition (Requirement 15.4)
    const inputStyles = `peer ${baseInputStyles} ${borderStyles} ${disabledStyles} ${leftPaddingStyles} ${rightPaddingStyles} ${className}`;

    // Container width
    const containerWidth = fullWidth ? 'w-full' : '';

    return (
      <div className={`flex flex-col gap-2 ${containerWidth}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--text-primary)]"
          >
            {label}
            {required && <span className="text-[var(--color-error)] ml-1">*</span>}
          </label>
        )}

        {/* Input wrapper with icons */}
        <div className="relative">
          {/* Left Icon - Enhanced with focus transition (Requirement 15.4) */}
          {resolvedLeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none transition-colors duration-150 peer-focus:text-[var(--accent-blue)]">
              {resolvedLeftIcon}
            </div>
          )}

          {/* Input field */}
          <input
            ref={ref}
            id={inputId}
            className={inputStyles}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            aria-required={required}
            {...props}
          />

          {/* Right Icon - Enhanced with focus transition (Requirement 15.4) */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none transition-colors duration-150 peer-focus:text-[var(--accent-blue)]">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error message - Enhanced with animation (Requirement 15.4) */}
        {error && (
          <span
            id={errorId}
            role="alert"
            className="text-sm text-[var(--color-error)] flex items-center gap-1.5 animate-fade-in"
          >
            <svg
              className="w-4 h-4 flex-shrink-0 animate-[shake_0.4s_ease-in-out]"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </span>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <span
            id={helperId}
            className="text-sm text-[var(--text-muted)]"
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
