import type { OrganizationProfile } from '../types/organization';

/**
 * Calculate organization profile completion percentage based on required fields
 * Required fields: contactPerson, emailVerified, companyName, industry
 * Optional but recommended: website, businessRegistrationNumber, taxId
 */
export const calculateOrganizationProfileCompletion = (profile: Partial<OrganizationProfile>): number => {
  const requiredFields = [
    profile.contactPerson,
    profile.emailVerified ? 'verified' : undefined,
    profile.companyName,
    profile.industry,
  ];

  const optionalFields = [
    profile.website,
    profile.businessRegistrationNumber,
    profile.taxId,
    profile.contactPersonRole,
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
 * Get list of missing required fields for organization profile completion
 */
export const getMissingOrganizationFields = (profile: Partial<OrganizationProfile>): string[] => {
  const missingFields: string[] = [];

  if (!profile.contactPerson?.trim()) {
    missingFields.push('Contact Person');
  }

  if (!profile.companyName?.trim()) {
    missingFields.push('Company Name');
  }

  if (!profile.industry?.trim()) {
    missingFields.push('Industry');
  }

  if (!profile.emailVerified) {
    missingFields.push('Email Verification');
  }

  // Add recommended fields
  if (!profile.website?.trim()) {
    missingFields.push('Website (Recommended)');
  }

  if (!profile.contactPersonRole?.trim()) {
    missingFields.push('Contact Person Role (Recommended)');
  }

  return missingFields;
};

/**
 * Check if organization profile is complete (100%)
 */
export const isOrganizationProfileComplete = (profile: Partial<OrganizationProfile>): boolean => {
  return calculateOrganizationProfileCompletion(profile) === 100;
};

/**
 * Get profile completion status with details
 */
export const getOrganizationProfileStatus = (profile: Partial<OrganizationProfile>) => {
  const completionPercentage = calculateOrganizationProfileCompletion(profile);
  const missingFields = getMissingOrganizationFields(profile);
  const isComplete = completionPercentage === 100;

  return {
    completionPercentage,
    missingFields,
    isComplete,
    requiredFieldsCount: 4, // contactPerson, emailVerified, companyName, industry
    completedFieldsCount: 4 - missingFields.filter(field => !field.includes('Recommended')).length,
  };
};

/**
 * Get profile completion level
 */
export const getOrganizationProfileLevel = (profile: Partial<OrganizationProfile>): 'basic' | 'intermediate' | 'complete' => {
  const percentage = calculateOrganizationProfileCompletion(profile);
  
  if (percentage === 100) return 'complete';
  if (percentage >= 50) return 'intermediate';
  return 'basic';
};

/**
 * Get next steps for profile completion
 */
export const getOrganizationNextSteps = (profile: Partial<OrganizationProfile>): string[] => {
  const missingFields = getMissingOrganizationFields(profile);
  const nextSteps: string[] = [];

  if (missingFields.includes('Email Verification')) {
    nextSteps.push('Verify your email address');
  }
  
  if (missingFields.includes('Contact Person')) {
    nextSteps.push('Add contact person name');
  }
  
  if (missingFields.includes('Company Name')) {
    nextSteps.push('Add your company name');
  }
  
  if (missingFields.includes('Industry')) {
    nextSteps.push('Select your industry');
  }
  
  if (missingFields.includes('Contact Person Role (Recommended)')) {
    nextSteps.push('Add contact person role (recommended)');
  }
  
  if (!profile.businessRegistrationNumber && missingFields.length <= 1) {
    nextSteps.push('Add business registration number (optional but recommended)');
  }
  
  if (!profile.website && missingFields.length <= 1) {
    nextSteps.push('Add your website (optional but recommended)');
  }

  return nextSteps;
};