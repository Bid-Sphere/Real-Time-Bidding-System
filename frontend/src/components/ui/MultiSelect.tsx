import React, { useState } from 'react';
import { X } from 'lucide-react';

export interface MultiSelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxSelections?: number;
  disabled?: boolean;
  required?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  error,
  helperText,
  options,
  value,
  onChange,
  placeholder = 'Type to add...',
  maxSelections,
  disabled = false,
  required = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredOptions = options.filter(
    (option) =>
      !value.includes(option) &&
      option.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleAddTag = (tag: string) => {
    if (!value.includes(tag) && (!maxSelections || value.length < maxSelections)) {
      onChange([...value, tag]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        handleAddTag(filteredOptions[0]);
      } else if (!options.includes(inputValue.trim())) {
        handleAddTag(inputValue.trim());
      }
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-[var(--color-text-primary)]">
          {label}
          {required && <span className="text-[var(--color-error-main)] ml-1">*</span>}
        </label>
      )}

      <div className="relative w-full">
        <div
          className={`
            w-full min-h-[42px] px-3 py-2 rounded-lg border-2 transition-all duration-200
            bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]
            ${error
              ? 'border-[var(--color-error-main)] focus-within:border-[var(--color-error-main)] focus-within:ring-2 focus-within:ring-[var(--color-error-main)]/20'
              : 'border-[var(--color-border)] focus-within:border-[var(--color-primary-main)] focus-within:ring-2 focus-within:ring-[var(--color-primary-main)]/20'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed bg-[var(--color-bg-secondary)]' : 'hover:border-[var(--color-primary-light)]'}
          `}
        >
          <div className="flex flex-wrap gap-2">
            {value.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded-md bg-primary-main/10 text-primary-main"
              >
                {tag}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:bg-primary-main/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={handleKeyDown}
              placeholder={value.length === 0 ? placeholder : ''}
              disabled={disabled || (maxSelections ? value.length >= maxSelections : false)}
              className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-base placeholder:text-gray-500 dark:placeholder:text-gray-600"
            />
          </div>
        </div>
        
        {showSuggestions && filteredOptions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-xl max-h-48 overflow-y-auto z-50">
            {filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleAddTag(option)}
                className="w-full px-4 py-2.5 text-left hover:bg-primary-main/10 transition-colors text-sm border-b border-gray-200 dark:border-gray-700 last:border-b-0 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <span role="alert" className="text-sm text-[var(--color-error-main)] flex items-center gap-1">
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
        <span className="text-sm text-[var(--color-text-secondary)]">{helperText}</span>
      )}
    </div>
  );
};

export default MultiSelect;
