import type { User, UserRole } from './user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  // Client fields
  phone?: string;
  location?: string;
  // Organization fields
  organizationName?: string;
  companySize?: string;
  industry?: string;
  website?: string;
  // Freelancer fields
  professionalTitle?: string;
  skills?: string[];
  experienceLevel?: 'beginner' | 'intermediate' | 'expert';
  hourlyRate?: string;
  portfolioUrl?: string;
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
