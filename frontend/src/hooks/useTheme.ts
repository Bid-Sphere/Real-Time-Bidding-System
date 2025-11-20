import { useThemeStore } from '@/store/themeStore';

export const useTheme = () => {
  const mode = useThemeStore((state) => state.mode);
  const systemPreference = useThemeStore((state) => state.systemPreference);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const detectSystemPreference = useThemeStore((state) => state.detectSystemPreference);
  
  return {
    mode,
    systemPreference,
    toggleTheme,
    setTheme,
    detectSystemPreference,
  };
};
