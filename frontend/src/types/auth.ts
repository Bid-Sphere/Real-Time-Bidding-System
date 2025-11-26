import type { User, UserRole } from './user';

export interface LoginCredentials {
  email: string;
  password: string;
}

// Profile interfaces matching backend structure
export interface FreelancerProfile {
  professionalTitle: string;
  skills: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  hourlyRate: number;
  portfolioUrl?: string;
  bio?: string;
  resumeUrl?: string;
}

export interface ClientProfile {
  companyName?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  billingAddress?: string;
  taxId?: string;
}

export interface OrganizationProfile {
  companyName: string;
  industry: string;
  companySize?: string;
  website?: string;
  taxId?: string;
  businessRegistrationNumber?: string;
  contactPerson?: string;
  contactPersonRole?: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  location?: string;
  // Role-specific profiles
  freelancerProfile?: FreelancerProfile;
  clientProfile?: ClientProfile;
  organizationProfile?: OrganizationProfile;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}
