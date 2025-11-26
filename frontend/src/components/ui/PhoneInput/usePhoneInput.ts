import { useState, useEffect, useMemo, useRef } from 'react';
import type { Country } from './useCountryList';

interface UsePhoneInputProps {
  countryList: Country[];
  value?: string;
  onChange?: (value: string) => void;
}

export const usePhoneInput = ({ countryList, value, onChange }: UsePhoneInputProps) => {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down');
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCountry = useMemo(
    () => countryList.find(c => c.code === selectedCountry) || countryList[0],
    [countryList, selectedCountry]
  );

  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countryList;
    
    const query = searchQuery.toLowerCase();
    return countryList.filter(country => 
      country.name.toLowerCase().includes(query) ||
      country.callingCode.includes(query) ||
      country.code.toLowerCase().includes(query)
    );
  }, [countryList, searchQuery]);

  // Reset highlighted index when filtered countries change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredCountries]);

  // Close dropdown when clicking outside or scrolling outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleScroll = (event: Event) => {
      // Only close if scrolling outside the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true); // Use capture phase to catch all scrolls
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  // Determine dropdown direction and width based on available space
  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 240;

      setDropdownWidth(rect.width);
      
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setDropdownDirection('up');
      } else {
        setDropdownDirection('down');
      }
    } else {
      // Clear search when dropdown closes
      setSearchQuery('');
      setHighlightedIndex(-1);
    }
  }, [isDropdownOpen]);

  // Parse initial value if provided
  useEffect(() => {
    if (value && typeof value === 'string') {
      const match = value.match(/^(\+\d{1,4})\s?(.*)$/);
      if (match) {
        const callingCode = match[1];
        const country = countryList.find(c => c.callingCode === callingCode);
        if (country) {
          setSelectedCountry(country.code);
        }
        setPhoneNumber(match[2]);
      }
    }
  }, [value, countryList]);

  // Return dropdownRef for external use
  const returnDropdownRef = dropdownRef;

  const formatPhoneNumber = (input: string) => {
    // Remove all non-digit characters
    return input.replace(/\D/g, '');
  };

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setIsDropdownOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
    
    const country = countryList.find(c => c.code === countryCode);
    if (!country) return;

    // Update the full value with the new country code
    const fullValue = phoneNumber ? `${country.callingCode} ${phoneNumber}` : '';
    
    // Call onChange with the updated value
    if (onChange) {
      onChange(fullValue);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsDropdownOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredCountries.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredCountries[highlightedIndex]) {
          handleCountrySelect(filteredCountries[highlightedIndex].code);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsDropdownOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
        break;
      case 'Tab':
        setIsDropdownOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
        break;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    
    // Create the full formatted value with country code
    const fullValue = formatted ? `${currentCountry.callingCode} ${formatted}` : '';
    
    // Call onChange with the full value
    if (onChange) {
      onChange(fullValue);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (!isDropdownOpen) setIsDropdownOpen(true);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return {
    selectedCountry,
    phoneNumber,
    isDropdownOpen,
    dropdownDirection,
    dropdownWidth,
    searchQuery,
    highlightedIndex,
    currentCountry,
    filteredCountries,
    dropdownRef: returnDropdownRef,
    handleCountrySelect,
    handleKeyDown,
    handlePhoneChange,
    handleSearchChange,
    toggleDropdown,
  };
};
