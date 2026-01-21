import type { User, UserRole } from './user';

export interface LoginCredentials {
  email: string;
  password: string;
}

// Profile interfaces matching backend structure
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
  clientProfile?: ClientProfile;
  organizationProfile?: OrganizationProfile;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  registrationStep: number | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  signup: (data: SignupData) => Promise<any>;
  logout: () => void;
  checkAuth: () => void;
  setToken: (token: string | null) => void;
}
