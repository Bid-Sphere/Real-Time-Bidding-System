import type { OrganizationProfile } from '@/types/organization';

/**
 * Calculate profile completion percentage based on required fields
 * Required fields: companyName, businessRegistrationNumber, taxId, industry, contactPerson, emailVerified
 */
export const calculateProfileCompletion = (profile: Partial<OrganizationProfile>): number => {
  const requiredFields = [
    profile.companyName,
    profile.businessRegistrationNumber,
    profile.taxId,
    profile.industry,
    profile.contactPerson,
    profile.emailVerified ? 'verified' : undefined,
  ];

  const filledCount = requiredFields.filter(
    (field) => field !== undefined && field !== null && field !== ''
  ).length;

  const percentage = Math.round((filledCount / requiredFields.length) * 100);
  return percentage;
};

/**
 * Get list of missing required fields for profile completion
 */
export const getMissingFields = (profile: Partial<OrganizationProfile>): string[] => {
  const missingFields: string[] = [];

  if (!profile.companyName?.trim()) {
    missingFields.push('Company Name');
  }
  if (!profile.businessRegistrationNumber?.trim()) {
    missingFields.push('Business Registration Number');
  }
  if (!profile.taxId?.trim()) {
    missingFields.push('Tax ID');
  }
  if (!profile.industry?.trim()) {
    missingFields.push('Industry');
  }
  if (!profile.contactPerson?.trim()) {
    missingFields.push('Contact Person');
  }
  if (!profile.emailVerified) {
    missingFields.push('Email Verification');
  }

  return missingFields;
};
