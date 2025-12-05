import type { User } from '@/types/user';

// Storage keys constants
export const STORAGE_KEYS = {
  AUTH_USER: 'bidding_platform_user',
  THEME_MODE: 'bidding_platform_theme',
  MOCK_USERS: 'bidding_platform_mock_users',
} as const;

// User data storage
export const saveUser = (user: User): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error saving user to localStorage:', error);
    }
    // In production, silently fail or use a logging service
  }
};

export const getUser = (): User | null => {
  try {
    const userJson = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error getting user from localStorage:', error);
    }
    return null;
  }
};

export const removeUser = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error removing user from localStorage:', error);
    }
  }
};

// Mock users storage (for authentication)
// NOTE: This is for development only. Replace with real API calls in production.
export const saveMockUser = (user: User, password: string): void => {
  try {
    const users = getMockUsers();
    users.push({ ...user, password });
    localStorage.setItem(STORAGE_KEYS.MOCK_USERS, JSON.stringify(users));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error saving mock user to localStorage:', error);
    }
  }
};

export const getMockUsers = (): Array<User & { password: string }> => {
  try {
    const usersJson = localStorage.getItem(STORAGE_KEYS.MOCK_USERS);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error getting mock users from localStorage:', error);
    }
    return [];
  }
};

export const findMockUser = (email: string, password: string): User | null => {
  try {
    const users = getMockUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error finding mock user:', error);
    }
    return null;
  }
};

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
