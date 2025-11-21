import { useMemo } from 'react';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import countries from 'i18n-iso-countries';

export interface Country {
  code: string;
  callingCode: string;
  name: string;
  flag: string;
}

// Country code to flag emoji mapping
export const getCountryFlag = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Get country name from ISO code
export const getCountryName = (countryCode: string): string => {
  return countries.getName(countryCode, 'en') || countryCode;
};

export const useCountryList = (): Country[] => {
  return useMemo(() => {
    const countries = getCountries()
      .map(country => {
        try {
          const callingCode = getCountryCallingCode(country);
          return {
            code: country as string,
            callingCode: `+${callingCode}`,
            name: getCountryName(country),
            flag: getCountryFlag(country),
          };
        } catch {
          return null;
        }
      })
      .filter((c): c is Country => c !== null);
    
    return countries.sort((a, b) => parseInt(a.callingCode.slice(1)) - parseInt(b.callingCode.slice(1)));
  }, []);
};
