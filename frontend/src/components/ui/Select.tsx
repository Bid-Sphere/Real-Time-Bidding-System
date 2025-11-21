import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  fullWidth?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      fullWidth = false,
      className = '',
      id,
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${React.useId()}`;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    const baseSelectStyles = 'w-full px-4 py-2.5 text-base rounded-lg border-2 transition-all duration-200 bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] appearance-none cursor-pointer';

    const borderStyles = error
      ? 'border-[var(--color-error-main)] focus:border-[var(--color-error-main)] focus:ring-2 focus:ring-[var(--color-error-main)]/20'
      : 'border-[var(--color-border)] focus:border-[var(--color-primary-main)] focus:ring-2 focus:ring-[var(--color-primary-main)]/20';

    const disabledStyles = disabled
      ? 'opacity-50 cursor-not-allowed bg-[var(--color-bg-secondary)]'
      : 'hover:border-[var(--color-primary-light)]';

    const selectStyles = `${baseSelectStyles} ${borderStyles} ${disabledStyles} ${className}`;
    const containerWidth = fullWidth ? 'w-full' : '';

    return (
      <div className={`flex flex-col gap-1.5 ${containerWidth}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-[var(--color-text-primary)]"
          >
            {label}
            {required && <span className="text-[var(--color-error-main)] ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={selectStyles}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            aria-required={required}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem',
            }}
            {...props}
          >
            <option value="" className="text-gray-500 dark:text-gray-600">Select an option</option>
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]">
                {option.label}
              </option>
            ))}
          </select>
        </div>

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

        {helperText && !error && (
          <span id={helperId} className="text-sm text-[var(--color-text-secondary)]">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
