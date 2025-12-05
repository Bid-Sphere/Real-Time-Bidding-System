// Storage keys for localStorage
export const STORAGE_KEYS = {
  AUTH_USER: 'bidding_platform_user',
  THEME_MODE: 'bidding_platform_theme',
  MOCK_USERS: 'bidding_platform_mock_users',
} as const;

// Route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  CLIENT_DASHBOARD: '/client-dashboard',
  ORGANIZATION_DASHBOARD: '/organization-dashboard',
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 600,
} as const;

// Animation easing functions
export const ANIMATION_EASING = {
  EASE_IN_OUT: 'easeInOut',
  EASE_OUT: 'easeOut',
  EASE_IN: 'easeIn',
} as const;

// Breakpoints (in pixels)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// User roles
export const USER_ROLES = {
  CLIENT: 'client',
  ORGANIZATION: 'organization',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
