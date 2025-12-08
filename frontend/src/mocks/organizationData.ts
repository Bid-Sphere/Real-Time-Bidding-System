import type { OrganizationProfile } from '@/types/organization';

export const mockOrganizationProfiles: OrganizationProfile[] = [
  {
    id: 'org-1',
    userId: 'user-1',
    companyName: 'TechSolutions Inc.',
    industry: 'Software Development',
    companySize: '50-100',
    website: 'https://techsolutions.example.com',
    taxId: 'TAX-123456789',
    businessRegistrationNumber: 'BRN-987654321',
    contactPerson: 'John Smith',
    contactPersonRole: 'CEO',
    logo: '/avatars/techsolutions-logo.png',
    coverImage: '/covers/techsolutions-cover.jpg',
    certifications: ['ISO 9001', 'ISO 27001', 'AWS Certified'],
    portfolioLinks: [
      'https://github.com/techsolutions',
      'https://dribbble.com/techsolutions'
    ],
    serviceOfferings: [
      'Web Development',
      'Mobile App Development',
      'Cloud Solutions',
      'DevOps Consulting'
    ],
    location: 'San Francisco, CA',
    emailVerified: true,
    completionPercentage: 100,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-01T14:30:00Z'
  },
  {
    id: 'org-2',
    userId: 'user-2',
    companyName: 'Creative Designs Studio',
    industry: 'Design & Marketing',
    companySize: '10-50',
    website: 'https://creativedesigns.example.com',
    taxId: 'TAX-234567890',
    businessRegistrationNumber: 'BRN-876543210',
    contactPerson: 'Sarah Johnson',
    contactPersonRole: 'Creative Director',
    certifications: ['Adobe Certified Expert'],
    serviceOfferings: [
      'UI/UX Design',
      'Brand Identity',
      'Digital Marketing'
    ],
    location: 'New York, NY',
    emailVerified: false,
    completionPercentage: 66,
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-11-28T16:45:00Z'
  }
];

// Default organization for current user
export const currentOrganization = mockOrganizationProfiles[0];
