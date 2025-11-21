import React, { useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Country } from './useCountryList';

interface CountryDropdownProps {
  currentCountry: Country;
  filteredCountries: Country[];
  selectedCountry: string;
  searchQuery: string;
  isOpen: boolean;
  highlightedIndex: number;
  dropdownDirection: 'up' | 'down';
  dropdownWidth: number;
  disabled: boolean;
  error?: string;
  onSearchChange: (value: string) => void;
  onToggle: () => void;
  onSelect: (countryCode: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const CountryDropdown = React.forwardRef<HTMLDivElement, CountryDropdownProps>(({
  currentCountry,
  filteredCountries,
  selectedCountry,
  searchQuery,
  isOpen,
  highlightedIndex,
  dropdownDirection,
  dropdownWidth,
  disabled,
  error,
  onSearchChange,
  onToggle,
  onSelect,
  onKeyDown,
}, ref) => {
  const highlightedItemRef = useRef<HTMLButtonElement>(null);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && highlightedItemRef.current) {
      highlightedItemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [highlightedIndex]);

  return (
    <div className="relative w-32 overflow-visible" ref={ref}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-lg">
          {currentCountry.flag}
        </div>
        <input
          type="text"
          value={searchQuery || currentCountry.callingCode}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => !disabled && onToggle()}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder="+1"
          className={`w-full h-full pl-10 pr-8 py-2.5 text-base rounded-lg border-2 transition-all duration-200 bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] placeholder:text-gray-500 dark:placeholder:text-gray-600 ${
            disabled
              ? 'opacity-50 cursor-not-allowed bg-[var(--color-bg-secondary)]'
              : 'hover:border-[var(--color-primary-light)] cursor-text'
          } ${
            error
              ? 'border-[var(--color-error-main)] focus:border-[var(--color-error-main)] focus:ring-2 focus:ring-[var(--color-error-main)]/20'
              : 'border-[var(--color-border)] focus:border-[var(--color-primary-main)] focus:ring-2 focus:ring-[var(--color-primary-main)]/20'
          }`}
        />
        <button
          type="button"
          onClick={() => !disabled && onToggle()}
          disabled={disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Custom Dropdown Menu */}
      {isOpen && filteredCountries.length > 0 && (
        <div 
          className="absolute z-[9999] bg-white dark:bg-slate-800 border-2 border-[var(--color-border)] rounded-lg shadow-2xl overflow-y-auto left-0"
          style={{
            width: `${Math.max(dropdownWidth || 280, 280)}px`,
            maxHeight: '240px',
            top: dropdownDirection === 'up' ? undefined : 'calc(100% + 4px)',
            bottom: dropdownDirection === 'up' ? 'calc(100% + 4px)' : undefined,
            pointerEvents: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {filteredCountries.map((country, index) => (
            <button
              key={country.code}
              ref={index === highlightedIndex ? highlightedItemRef : null}
              type="button"
              onClick={() => onSelect(country.code)}
              className={`w-full px-3 py-2 text-left text-sm transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${
                index === highlightedIndex 
                  ? 'bg-primary-main/20 text-primary-main font-medium' 
                  : selectedCountry === country.code 
                  ? 'bg-primary-main/10 text-primary-main font-medium' 
                  : 'text-[var(--color-text-primary)] hover:bg-primary-main/10'
              }`}
            >
              {country.flag} {country.callingCode} {country.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

CountryDropdown.displayName = 'CountryDropdown';
