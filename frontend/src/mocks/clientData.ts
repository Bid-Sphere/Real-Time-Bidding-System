import type { ClientProfile, ClientAnalyticsData } from '../types/client';

export const mockClientProfile: ClientProfile = {
  id: 1,
  userId: 1,
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@techstart.com',
  companyName: 'TechStart Solutions',
  industry: 'Technology',
  website: 'https://techstartsolutions.com',
  billingAddress: '123 Innovation Drive, San Francisco, CA 94105',
  taxId: '',
  emailVerified: false,
  completionPercentage: 62, // Will be calculated based on filled fields
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z',
};

export const mockClientAnalytics: ClientAnalyticsData = {
  totalProjects: 12,
  activeProjects: 3,
  completedProjects: 8,
  totalSpent: 45000,
  averageBidAmount: 3750,
  averageProjectDuration: 21, // days
  successfulProjects: 8,
  cancelledProjects: 1,
  averageRating: 4.6,
};