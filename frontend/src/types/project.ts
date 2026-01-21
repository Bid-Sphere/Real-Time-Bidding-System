/**
 * Project Types
 * For Client Dashboard functionality
 */

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  budget: number;
  deadline: Date;
  status: ProjectStatus;
  biddingType: BiddingType;
  location?: string;
  requiredSkills: string[];
  attachments: ProjectAttachment[];
  bidCount: number;
  createdAt: Date;
  updatedAt: Date;
  clientId: string;
  isStrictDeadline: boolean;
  biddingEndDate: Date;
}

export interface ProjectAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
}

export interface Bid {
  id: string;
  projectId: string;
  bidderId: string;
  bidderName: string;
  bidderType: 'organization';
  bidderRating: number;
  completedProjects: number;
  proposedPrice: number;
  estimatedDuration: number; // in days
  proposal: string;
  attachments: ProjectAttachment[];
  teamComposition?: TeamMember[];
  submittedAt: Date;
  status: BidStatus;
}

export interface TeamMember {
  name: string;
  role: string;
  experience: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeBids: number;
  completedProjects: number;
  averageBidAmount?: number;
}

export type ProjectCategory = 'IT' | 'Construction' | 'Supply';

export type ProjectStatus = 
  | 'open_for_bidding'
  | 'accepting_bids'
  | 'in_discussion'
  | 'closed_for_bidding'
  | 'awarded'
  | 'completed';

export type BiddingType = 'live_auction' | 'standard_bidding';

export type BidStatus = 'pending' | 'accepted' | 'rejected';

export type ProjectFilter = 'all' | 'active' | 'in_discussion' | 'closed';

export type SortOption = 
  | 'lowest_price'
  | 'highest_rating'
  | 'most_recent'
  | 'fastest_completion';

export interface CreateProjectData {
  title: string;
  category: ProjectCategory;
  description: string;
  requiredSkills: string[];
  location?: string;
  deadline: Date;
  isStrictDeadline: boolean;
  biddingType: BiddingType;
  budget: number;
  biddingDuration: number; // hours for live auction, days for standard
  attachments: File[];
}