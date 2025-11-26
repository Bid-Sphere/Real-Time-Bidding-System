import React from 'react';
import { Phone } from 'lucide-react';
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import { useCountryList } from './useCountryList';
import { usePhoneInput } from './usePhoneInput';
import { CountryDropdown } from './CountryDropdown';

// Register English locale
countries.registerLocale(en);

export interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'value'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      className = '',
      id,
      required = false,
      disabled = false,
      onChange,
      value,
      ...props
    },
    ref
  ) => {
    const inputId = id || `phone-input-${React.useId()}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const countryList = useCountryList();
    
    const {
      selectedCountry,
      phoneNumber,
      isDropdownOpen,
      dropdownDirection,
      dropdownWidth,
      searchQuery,
      highlightedIndex,
      currentCountry,
      filteredCountries,
      dropdownRef,
      handleCountrySelect,
      handleKeyDown,
      handlePhoneChange,
      handleSearchChange,
      toggleDropdown,
    } = usePhoneInput({ countryList, value, onChange });

    const baseInputStyles = 'w-full px-4 py-2.5 pl-11 text-base rounded-lg border-2 transition-all duration-200 bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] placeholder:text-gray-500 dark:placeholder:text-gray-600';

    const borderStyles = error
      ? 'border-[var(--color-error-main)] focus:border-[var(--color-error-main)] focus:ring-2 focus:ring-[var(--color-error-main)]/20'
      : 'border-[var(--color-border)] focus:border-[var(--color-primary-main)] focus:ring-2 focus:ring-[var(--color-primary-main)]/20';

    const disabledStyles = disabled
      ? 'opacity-50 cursor-not-allowed bg-[var(--color-bg-secondary)]'
      : 'hover:border-[var(--color-primary-light)]';

    const inputStyles = `${baseInputStyles} ${borderStyles} ${disabledStyles} ${className}`;
    const containerWidth = fullWidth ? 'w-full' : '';

    return (
      <div className={`flex flex-col gap-1.5 ${containerWidth}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-text-primary)]"
          >
            {label}
            {required && <span className="text-[var(--color-error-main)] ml-1">*</span>}
          </label>
        )}

        <div className="relative flex gap-2 items-stretch" style={{ zIndex: isDropdownOpen ? 1000 : 'auto' }}>
          {/* Country Code Dropdown */}
          <CountryDropdown
            ref={dropdownRef}
            currentCountry={currentCountry}
            filteredCountries={filteredCountries}
            selectedCountry={selectedCountry}
            searchQuery={searchQuery}
            isOpen={isDropdownOpen}
            highlightedIndex={highlightedIndex}
            dropdownDirection={dropdownDirection}
            dropdownWidth={dropdownWidth}
            disabled={disabled}
            error={error}
            onSearchChange={handleSearchChange}
            onToggle={toggleDropdown}
            onSelect={handleCountrySelect}
            onKeyDown={handleKeyDown}
          />

          {/* Phone Number Input */}
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none">
              <Phone className="h-5 w-5" />
            </div>

            <input
              ref={ref}
              id={inputId}
              type="tel"
              className={inputStyles}
              disabled={disabled}
              required={required}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? errorId : helperText ? helperId : undefined}
              aria-required={required}
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="1234567890"
              {...props}
            />
          </div>
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

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
