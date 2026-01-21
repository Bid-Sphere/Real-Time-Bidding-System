// Storage keys constants
export const STORAGE_KEYS = {
  THEME_MODE: 'bidding_platform_theme',
} as const;

// Theme preference storage
export const saveTheme = (mode: 'light' | 'dark'): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error saving theme to localStorage:', error);
    }
  }
};

export const getTheme = (): 'light' | 'dark' | null => {
  try {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
    return theme === 'light' || theme === 'dark' ? theme : null;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error getting theme from localStorage:', error);
    }
    return null;
  }
};
