import type { ClientProfile } from '../types/client';

/**
 * Calculate client profile completion percentage based on required fields
 * Required fields: fullName, companyName, industry, contactPersonRole, phoneNumber, country, emailVerified, phoneVerified
 */
export const calculateClientProfileCompletion = (profile: Partial<ClientProfile>): number => {
  const requiredFields = [
    profile.fullName,
    profile.companyName,
    profile.industry,
    profile.contactPersonRole,
    profile.phoneNumber,
    profile.country,
    profile.emailVerified ? 'verified' : undefined,
    profile.phoneVerified ? 'verified' : undefined,
  ];

  const filledCount = requiredFields.filter(
    (field) => field !== undefined && field !== null && field !== ''
  ).length;

  const percentage = Math.round((filledCount / requiredFields.length) * 100);
  return percentage;
};

/**
 * Get list of missing required fields for client profile completion
 */
export const getMissingClientFields = (profile: Partial<ClientProfile>): string[] => {
  const missingFields: string[] = [];

  if (!profile.fullName?.trim()) {
    missingFields.push('Full Name');
  }
  if (!profile.companyName?.trim()) {
    missingFields.push('Company/Organization Name');
  }
  if (!profile.industry?.trim()) {
    missingFields.push('Industry');
  }
  if (!profile.contactPersonRole?.trim()) {
    missingFields.push('Your Role/Position');
  }
  if (!profile.phoneNumber?.trim()) {
    missingFields.push('Phone Number');
  }
  if (!profile.country?.trim()) {
    missingFields.push('Country');
  }
  if (!profile.emailVerified) {
    missingFields.push('Email Verification');
  }
  if (!profile.phoneVerified) {
    missingFields.push('Phone Verification');
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
    requiredFieldsCount: 8,
    completedFieldsCount: 8 - missingFields.length,
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
  if (missingFields.includes('Phone Verification')) {
    nextSteps.push('Verify your phone number');
  }
  if (missingFields.length > 2) {
    nextSteps.push('Complete your basic information');
  }
  if (!profile.businessAddress && missingFields.length <= 2) {
    nextSteps.push('Add your business address (optional but recommended)');
  }
  if (!profile.website && missingFields.length <= 2) {
    nextSteps.push('Add your company website (optional but recommended)');
  }

  return nextSteps;
};