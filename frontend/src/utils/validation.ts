import { z } from 'zod';

// ============================================
// Validation Constants
// ============================================
export const VALIDATION_CONSTANTS = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;

// ============================================
// Standalone Validation Functions
// ============================================

/**
 * Validates an email address using a regex pattern.
 * Returns null if valid, or an error message if invalid.
 */
export const validateEmailFormat = (email: string): string | null => {
  if (!email || typeof email !== 'string') {
    return 'Email is required';
  }
  
  const trimmedEmail = email.trim();
  
  if (trimmedEmail.length === 0) {
    return 'Email is required';
  }
  
  // RFC 5322 compliant email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(trimmedEmail)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

/**
 * Validates a password for minimum length and complexity requirements.
 * Returns null if valid, or an error message if invalid.
 * 
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const validatePassword = (password: string): string | null => {
  if (!password || typeof password !== 'string') {
    return 'Password is required';
  }
  
  if (password.length < VALIDATION_CONSTANTS.PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${VALIDATION_CONSTANTS.PASSWORD_MIN_LENGTH} characters`;
  }
  
  if (password.length > VALIDATION_CONSTANTS.PASSWORD_MAX_LENGTH) {
    return `Password must not exceed ${VALIDATION_CONSTANTS.PASSWORD_MAX_LENGTH} characters`;
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  return null;
};

/**
 * Validates that password and confirmation match.
 * Returns null if they match, or an error message if they don't.
 */
export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword || typeof confirmPassword !== 'string') {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return "Passwords don't match";
  }
  
  return null;
};

/**
 * Validates that a required field is not empty.
 * Returns null if valid, or an error message if empty.
 */
export const validateRequired = (
  value: string | undefined | null,
  fieldName: string = 'This field'
): string | null => {
  if (value === undefined || value === null) {
    return `${fieldName} is required`;
  }
  
  if (typeof value !== 'string') {
    return `${fieldName} is required`;
  }
  
  if (value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  
  return null;
};

/**
 * Validates a role selection.
 * Returns null if valid, or an error message if not selected.
 */
export const validateRole = (
  role: string | undefined | null
): string | null => {
  const validRoles = ['client', 'organization'];
  
  if (!role || typeof role !== 'string') {
    return 'Please select a role';
  }
  
  if (!validRoles.includes(role)) {
    return 'Please select a valid role';
  }
  
  return null;
};

// ============================================
// Validation Result Types
// ============================================

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export interface LoginValidationErrors {
  email?: string;
  password?: string;
}

export interface SignupValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

// ============================================
// Form Validation Functions
// ============================================

/**
 * Validates login form data.
 * Returns an object with field-specific errors.
 */
export const validateLoginForm = (data: {
  email: string;
  password: string;
}): LoginValidationErrors => {
  const errors: LoginValidationErrors = {};
  
  const emailError = validateEmailFormat(data.email);
  if (emailError) {
    errors.email = emailError;
  }
  
  // For login, we only check if password is provided (not complexity)
  const requiredError = validateRequired(data.password, 'Password');
  if (requiredError) {
    errors.password = requiredError;
  }
  
  return errors;
};

/**
 * Validates signup form data.
 * Returns an object with field-specific errors.
 */
export const validateSignupForm = (data: {
  name?: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: string;
}): SignupValidationErrors => {
  const errors: SignupValidationErrors = {};
  
  // Validate name if provided
  if (data.name !== undefined) {
    const nameError = validateRequired(data.name, 'Name');
    if (nameError) {
      errors.name = nameError;
    } else if (data.name.length < VALIDATION_CONSTANTS.NAME_MIN_LENGTH) {
      errors.name = `Name must be at least ${VALIDATION_CONSTANTS.NAME_MIN_LENGTH} characters`;
    } else if (data.name.length > VALIDATION_CONSTANTS.NAME_MAX_LENGTH) {
      errors.name = `Name must not exceed ${VALIDATION_CONSTANTS.NAME_MAX_LENGTH} characters`;
    }
  }
  
  // Validate email
  const emailError = validateEmailFormat(data.email);
  if (emailError) {
    errors.email = emailError;
  }
  
  // Validate password with complexity requirements
  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.password = passwordError;
  }
  
  // Validate password confirmation
  const confirmError = validatePasswordConfirmation(data.password, data.confirmPassword);
  if (confirmError) {
    errors.confirmPassword = confirmError;
  }
  
  // Validate role
  const roleError = validateRole(data.role);
  if (roleError) {
    errors.role = roleError;
  }
  
  return errors;
};

// ============================================
// Zod Schemas (for form libraries)
// ============================================

// Login form validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Signup form validation schema
export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(VALIDATION_CONSTANTS.NAME_MIN_LENGTH, `Name must be at least ${VALIDATION_CONSTANTS.NAME_MIN_LENGTH} characters`)
      .max(VALIDATION_CONSTANTS.NAME_MAX_LENGTH, `Name must not exceed ${VALIDATION_CONSTANTS.NAME_MAX_LENGTH} characters`),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(VALIDATION_CONSTANTS.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION_CONSTANTS.PASSWORD_MIN_LENGTH} characters`)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
    role: z.enum(['client', 'organization'], {
      message: 'Please select a role',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;


// Contact form types and validation
export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

export interface ContactFormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  message?: string;
}

// Email validation function
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Contact form validation function
export const validateContactForm = (data: ContactFormData): ContactFormErrors => {
  const errors: ContactFormErrors = {};

  if (!data.fullName.trim()) {
    errors.fullName = 'Full name is required';
  }

  if (!data.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.message.trim()) {
    errors.message = 'Message is required';
  }

  // Phone is optional, but if provided, validate format
  if (data.phone.trim() && !/^[\d\s\-+()]+$/.test(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  return errors;
};
