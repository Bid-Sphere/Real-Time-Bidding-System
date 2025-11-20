import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      fullWidth = false,
      className = '',
      id,
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const inputId = id || `input-${React.useId()}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // Base input styles
    const baseInputStyles = 'w-full px-4 py-2.5 text-base rounded-lg border-2 transition-all duration-200 bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)]';

    // Border and focus styles
    const borderStyles = error
      ? 'border-[var(--color-error-main)] focus:border-[var(--color-error-main)] focus:ring-2 focus:ring-[var(--color-error-main)]/20'
      : 'border-[var(--color-border)] focus:border-[var(--color-primary-main)] focus:ring-2 focus:ring-[var(--color-primary-main)]/20';

    // Disabled styles
    const disabledStyles = disabled
      ? 'opacity-50 cursor-not-allowed bg-[var(--color-bg-secondary)]'
      : 'hover:border-[var(--color-primary-light)]';

    // Icon padding
    const iconPaddingStyles = icon ? 'pl-11' : '';

    // Combine input styles
    const inputStyles = `${baseInputStyles} ${borderStyles} ${disabledStyles} ${iconPaddingStyles} ${className}`;

    // Container width
    const containerWidth = fullWidth ? 'w-full' : '';

    return (
      <div className={`flex flex-col gap-1.5 ${containerWidth}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-text-primary)]"
          >
            {label}
            {required && <span className="text-[var(--color-error-main)] ml-1">*</span>}
          </label>
        )}

        {/* Input wrapper with icon */}
        <div className="relative">
          {/* Icon */}
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none">
              {icon}
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
        </div>

        {/* Error message */}
        {error && (
          <span
            id={errorId}
            role="alert"
            className="text-sm text-[var(--color-error-main)] flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
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
            className="text-sm text-[var(--color-text-secondary)]"
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
