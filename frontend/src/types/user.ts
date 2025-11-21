export type UserRole = 'client' | 'organization' | 'freelancer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  // Client-specific fields
  phone?: string;
  location?: string;
  // Organization-specific fields
  organizationName?: string;
  companySize?: string;
  industry?: string;
  website?: string;
  // Freelancer-specific fields
  professionalTitle?: string;
  skills?: string[];
  experienceLevel?: 'beginner' | 'intermediate' | 'expert';
  hourlyRate?: string;
  portfolioUrl?: string;
  bio?: string;
}
