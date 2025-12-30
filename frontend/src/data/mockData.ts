import type { Project, DashboardStats } from '../types/project';
import { Shield, Zap, Users, Award } from 'lucide-react';

export const mockStats: DashboardStats = {
  totalProjects: 12,
  activeBids: 23,
  completedProjects: 8,
  averageBidAmount: 4250
};

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Website Development',
    category: 'IT',
    description: 'Need a modern e-commerce website with payment integration and admin dashboard.',
    budget: 5000,
    deadline: new Date('2024-02-15'),
    status: 'accepting_bids',
    biddingType: 'standard_bidding',
    visibility: 'both',
    location: 'Remote',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'Payment Integration'],
    attachments: [],
    bidCount: 5,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    clientId: 'client1',
    isStrictDeadline: true,
    biddingEndDate: new Date('2024-01-20')
  },
  {
    id: '2',
    title: 'Office Building Construction',
    category: 'Construction',
    description: 'Construction of a 5-story office building with modern amenities.',
    budget: 250000,
    deadline: new Date('2024-08-30'),
    status: 'in_discussion',
    biddingType: 'standard_bidding',
    visibility: 'organizations_only',
    location: 'New York, NY',
    requiredSkills: ['Construction Management', 'Civil Engineering', 'Project Planning'],
    attachments: [],
    bidCount: 3,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-14'),
    clientId: 'client1',
    isStrictDeadline: false,
    biddingEndDate: new Date('2024-01-25')
  }
];

// Features data for BentoGrid component
export const features = [
  {
    id: 1,
    icon: Shield,
    title: 'Secure Payments',
    description: 'Your transactions are protected with bank-level security and escrow services.'
  },
  {
    id: 2,
    icon: Zap,
    title: 'Fast Matching',
    description: 'Our AI-powered system connects you with the perfect freelancers in minutes.'
  },
  {
    id: 3,
    icon: Users,
    title: 'Global Talent',
    description: 'Access to millions of skilled professionals from around the world.'
  },
  {
    id: 4,
    icon: Award,
    title: 'Quality Assured',
    description: 'All freelancers are vetted and rated by our community for quality work.'
  }
];