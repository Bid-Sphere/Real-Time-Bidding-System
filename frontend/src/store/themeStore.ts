import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

interface ThemeStore {
  mode: ThemeMode;
  systemPreference: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  detectSystemPreference: () => void;
}

const THEME_STORAGE_KEY = 'bidding_platform_theme';

// Detect system preference
const getSystemPreference = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Get stored theme or system preference
const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  
  return getSystemPreference();
};

// Apply theme to document
const applyTheme = (mode: ThemeMode) => {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(mode);
};

export const useThemeStore = create<ThemeStore>((set, get) => {
  const initialMode = getInitialTheme();
  const systemPreference = getSystemPreference();
  
  // Apply initial theme
  applyTheme(initialMode);
  
  // Listen for system preference changes
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newPreference = e.matches ? 'dark' : 'light';
      set({ systemPreference: newPreference });
      
      // If user hasn't set a preference, follow system
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (!stored) {
        get().setTheme(newPreference);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
  }
  
  return {
    mode: initialMode,
    systemPreference,
    
    toggleTheme: () => {
      const currentMode = get().mode;
      const newMode = currentMode === 'light' ? 'dark' : 'light';
      get().setTheme(newMode);
    },
    
    setTheme: (mode: ThemeMode) => {
      set({ mode });
      localStorage.setItem(THEME_STORAGE_KEY, mode);
      applyTheme(mode);
    },
    
    detectSystemPreference: () => {
      const preference = getSystemPreference();
      set({ systemPreference: preference });
    },
  };
});
