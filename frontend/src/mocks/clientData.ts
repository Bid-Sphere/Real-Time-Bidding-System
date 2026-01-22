import type { ClientProfile, ClientAnalyticsData } from '../types/client';

export const mockClientProfile: ClientProfile = {
  id: 'client-1',
  userId: 'user-client-1',
  fullName: 'John Smith',
  companyName: 'TechStart Solutions',
  industry: 'Technology',
  companySize: 'Small (11-50 employees)',
  website: 'https://techstartsolutions.com',
  taxId: '',
  businessRegistrationNumber: '',
  contactPersonRole: 'CEO & Founder',
  phoneNumber: '+1 (555) 123-4567',
  businessAddress: '123 Innovation Drive, San Francisco, CA 94105',
  country: 'United States',
  timeZone: 'America/Los_Angeles',
  logo: undefined,
  coverImage: undefined,
  companyDescription: 'A growing technology startup focused on innovative software solutions for small and medium businesses.',
  projectDescription: 'We typically need help with web development projects, mobile app development, and UI/UX design. Our projects usually involve modern technologies like React, Node.js, and cloud platforms. We value clear communication, timely delivery, and high-quality code.',
  projectDocuments: [],
  yearsInBusiness: 3,
  annualRevenue: '$500K - $1M',
  linkedInProfile: 'https://linkedin.com/in/johnsmith-ceo',
  preferredCategories: ['Web Development', 'Mobile Apps', 'UI/UX Design'],
  typicalBudgetRange: '$5,000 - $10,000',
  projectFrequency: 'Regular (monthly)',
  communicationMethod: 'Email and Video calls',
  emailVerified: false,
  phoneVerified: false,
  businessVerified: false,
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