import type { ClientProfile } from '../types/client';

/**
 * Calculate client profile completion percentage based on required fields
 * Required fields: firstName, lastName, emailVerified
 * Optional but recommended: companyName, industry, website, billingAddress
 */
export const calculateClientProfileCompletion = (profile: Partial<ClientProfile>): number => {
  const requiredFields = [
    profile.firstName,
    profile.lastName,
    profile.emailVerified ? 'verified' : undefined,
  ];

  const optionalFields = [
    profile.industry,
    profile.companyName,
    profile.website,
    profile.billingAddress,
  ];

  const requiredCount = requiredFields.filter(
    (field) => field !== undefined && field !== null && field !== ''
  ).length;

  const optionalCount = optionalFields.filter(
    (field) => field !== undefined && field !== null && field !== ''
  ).length;

  // Required fields are worth 70%, optional fields are worth 30%
  const requiredPercentage = (requiredCount / requiredFields.length) * 70;
  const optionalPercentage = (optionalCount / optionalFields.length) * 30;

  const percentage = Math.round(requiredPercentage + optionalPercentage);
  return percentage;
};

/**
 * Get list of missing required fields for client profile completion
 */
export const getMissingClientFields = (profile: Partial<ClientProfile>): string[] => {
  const missingFields: string[] = [];

  if (!profile.firstName?.trim()) {
    missingFields.push('First Name');
  }

  if (!profile.lastName?.trim()) {
    missingFields.push('Last Name');
  }

  if (!profile.emailVerified) {
    missingFields.push('Email Verification');
  }

  // Add recommended fields
  if (!profile.industry?.trim()) {
    missingFields.push('Industry (Recommended)');
  }

  return missingFields;
};

/**
 * Check if client profile is complete (100%)
 */
export const isClientProfileComplete = (profile: Partial<ClientProfile>): boolean => {
  return calculateClientProfileCompletion(profile) === 100;
};

/**
 * Get profile completion status with details
 */
export const getClientProfileStatus = (profile: Partial<ClientProfile>) => {
  const completionPercentage = calculateClientProfileCompletion(profile);
  const missingFields = getMissingClientFields(profile);
  const isComplete = completionPercentage === 100;

  return {
    completionPercentage,
    missingFields,
    isComplete,
    requiredFieldsCount: 3, // firstName, lastName, emailVerified
    completedFieldsCount: 3 - missingFields.filter(field => !field.includes('Recommended')).length,
  };
};

/**
 * Get profile completion level
 */
export const getClientProfileLevel = (profile: Partial<ClientProfile>): 'basic' | 'intermediate' | 'complete' => {
  const percentage = calculateClientProfileCompletion(profile);
  
  if (percentage === 100) return 'complete';
  if (percentage >= 50) return 'intermediate';
  return 'basic';
};

/**
 * Get next steps for profile completion
 */
export const getNextSteps = (profile: Partial<ClientProfile>): string[] => {
  const missingFields = getMissingClientFields(profile);
  const nextSteps: string[] = [];

  if (missingFields.includes('Email Verification')) {
    nextSteps.push('Verify your email address');
  }
  
  if (missingFields.includes('First Name')) {
    nextSteps.push('Add your first name');
  }
  
  if (missingFields.includes('Last Name')) {
    nextSteps.push('Add your last name');
  }
  
  if (missingFields.includes('Industry (Recommended)')) {
    nextSteps.push('Select your industry (recommended)');
  }
  
  if (!profile.billingAddress && missingFields.length <= 1) {
    nextSteps.push('Add your billing address (optional but recommended)');
  }
  
  if (!profile.website && missingFields.length <= 1) {
    nextSteps.push('Add your website (optional but recommended)');
  }

  return nextSteps;
};