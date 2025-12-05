export type UserRole = 'client' | 'organization';

export interface ClientProfile {
  id?: number;
  userId?: number;
  companyName?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  billingAddress?: string;
  taxId?: string;
}

export interface OrganizationProfile {
  id?: number;
  userId?: number;
  companyName: string;
  industry: string;
  companySize?: string;
  website?: string;
  taxId?: string;
  businessRegistrationNumber?: string;
  contactPerson?: string;
  contactPersonRole?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  phone?: string;
  location?: string;
  isActive?: boolean;
  // Role-specific profiles
  clientProfile?: ClientProfile;
  organizationProfile?: OrganizationProfile;
}
