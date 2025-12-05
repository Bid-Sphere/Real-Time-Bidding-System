/**
 * Design System Theme Configuration
 * Phase 1 Frontend Redesign - Dark Theme Design Tokens
 * 
 * This file contains all design tokens for the Client-Organization Bidding Platform.
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6
 */

export const theme = {
  colors: {
    // Backgrounds (Requirement 1.1)
    bgPrimary: '#0a0a0f',
    bgSecondary: '#12121a',
    bgCard: '#1a1a2e',
    bgNavbar: 'rgba(18, 18, 26, 0.8)',
    bgInput: '#0d0d14',
    
    // Text (Requirement 1.2)
    textPrimary: '#ffffff',
    textSecondary: '#a0a0b0',
    textMuted: '#6b6b7b',
    
    // Accents (Requirement 1.3)
    accentBlue: '#3b82f6',
    accentPurple: '#8b5cf6',
    accentBlueDark: '#2563eb',
    accentPurpleDark: '#7c3aed',
    accentGradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    
    // Borders
    borderLight: 'rgba(255, 255, 255, 0.1)',
    borderMedium: 'rgba(255, 255, 255, 0.2)',
    borderFocus: '#3b82f6',
    
    // States
    error: '#ef4444',
    errorLight: '#fca5a5',
    success: '#22c55e',
    successLight: '#86efac',
    warning: '#f59e0b',
    warningLight: '#fcd34d',
  },
  
  spacing: {
    navbarHeight: '64px',
    navbarMargin: '20px',
    sectionPadding: '80px',
    sectionPaddingMobile: '48px',
    containerMaxWidth: '1280px',
    containerPadding: '24px',
  },
  
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  
  shadows: {
    glow: '0 0 40px rgba(59, 130, 246, 0.15)',
    glowPurple: '0 0 40px rgba(139, 92, 246, 0.15)',
    card: '0 4px 24px rgba(0, 0, 0, 0.3)',
    cardHover: '0 8px 32px rgba(0, 0, 0, 0.4)',
    elevated: '0 8px 32px rgba(0, 0, 0, 0.5)',
    input: '0 2px 8px rgba(0, 0, 0, 0.2)',
    inputFocus: '0 0 0 3px rgba(59, 130, 246, 0.25)',
  },
  
  transitions: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '350ms ease',
  },
  
  typography: {
    fontFamily: {
      sans: "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      heading: "'Space Grotesk', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.025em',
    },
  },
} as const;

// Type exports for TypeScript support
export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
export type ThemeSpacing = typeof theme.spacing;
export type ThemeBorderRadius = typeof theme.borderRadius;
export type ThemeShadows = typeof theme.shadows;
export type ThemeTransitions = typeof theme.transitions;
export type ThemeTypography = typeof theme.typography;

// CSS variable mapping for Tailwind integration
export const cssVariables = {
  // Background colors
  '--bg-primary': theme.colors.bgPrimary,
  '--bg-secondary': theme.colors.bgSecondary,
  '--bg-card': theme.colors.bgCard,
  '--bg-navbar': theme.colors.bgNavbar,
  '--bg-input': theme.colors.bgInput,
  
  // Text colors
  '--text-primary': theme.colors.textPrimary,
  '--text-secondary': theme.colors.textSecondary,
  '--text-muted': theme.colors.textMuted,
  
  // Accent colors
  '--accent-blue': theme.colors.accentBlue,
  '--accent-purple': theme.colors.accentPurple,
  '--accent-blue-dark': theme.colors.accentBlueDark,
  '--accent-purple-dark': theme.colors.accentPurpleDark,
  
  // Border colors
  '--border-light': theme.colors.borderLight,
  '--border-medium': theme.colors.borderMedium,
  '--border-focus': theme.colors.borderFocus,
  
  // State colors
  '--color-error': theme.colors.error,
  '--color-error-light': theme.colors.errorLight,
  '--color-success': theme.colors.success,
  '--color-success-light': theme.colors.successLight,
  '--color-warning': theme.colors.warning,
  '--color-warning-light': theme.colors.warningLight,
  
  // Shadows
  '--shadow-glow': theme.shadows.glow,
  '--shadow-glow-purple': theme.shadows.glowPurple,
  '--shadow-card': theme.shadows.card,
  '--shadow-card-hover': theme.shadows.cardHover,
  '--shadow-elevated': theme.shadows.elevated,
  '--shadow-input': theme.shadows.input,
  '--shadow-input-focus': theme.shadows.inputFocus,
  
  // Border radius
  '--radius-sm': theme.borderRadius.sm,
  '--radius-md': theme.borderRadius.md,
  '--radius-lg': theme.borderRadius.lg,
  '--radius-xl': theme.borderRadius.xl,
  '--radius-full': theme.borderRadius.full,
  
  // Transitions
  '--transition-fast': theme.transitions.fast,
  '--transition-normal': theme.transitions.normal,
  '--transition-slow': theme.transitions.slow,
} as const;

export default theme;
