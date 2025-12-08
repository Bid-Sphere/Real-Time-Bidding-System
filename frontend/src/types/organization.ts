// Organization Dashboard Type Definitions

// Organization Profile
export interface OrganizationProfile {
  id: string;
  userId: string;
  companyName: string;
  industry: string;
  companySize?: string;
  website?: string;
  taxId: string;
  businessRegistrationNumber: string;
  contactPerson: string;
  contactPersonRole: string;
  logo?: string;
  coverImage?: string;
  certifications?: string[];
  portfolioLinks?: string[];
  serviceOfferings?: string[];
  location?: string;
  emailVerified: boolean;
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;
}

// Analytics Data
export interface AnalyticsData {
  totalBids: number;
  winRate: number; // percentage
  activeProjects: number;
  totalEarnings: number;
  pendingBids: number;
  acceptedBids: number;
  rejectedBids: number;
  averageResponseTime: number; // in hours
  completionRate: number; // percentage
}

// Project
export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string; // ISO date
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  requirements: string[];
  attachments?: Attachment[];
  bidCount: number;
  status: 'open' | 'in_bidding' | 'awarded' | 'completed' | 'cancelled';
  location?: string;
  postedAt: string;
  isInterested?: boolean; // client-side flag
  hasBid?: boolean; // client-side flag
}

// Bid
export interface Bid {
  id: string;
  projectId: string;
  projectTitle: string;
  organizationId: string;
  proposedPrice: number;
  estimatedTimeline: string;
  coverLetter: string;
  attachments?: Attachment[];
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
  submittedAt: string;
  updatedAt: string;
  ranking?: number; // position among all bids (without revealing prices)
}

// Team Member
export interface TeamMember {
  id: string;
  organizationId: string;
  name: string;
  role: string;
  skills: string[];
  bio?: string;
  avatar?: string;
  linkedIn?: string;
  portfolio?: string;
  createdAt: string;
}

// Chat Conversation
export interface Conversation {
  id: string;
  projectId: string;
  projectTitle: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  organizationId: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  createdAt: string;
}

// Message
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'organization';
  content: string;
  attachments?: Attachment[];
  sentAt: string;
  readAt?: string;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  type: 'new_project' | 'bid_status_change' | 'new_message' | 'project_awarded';
  title: string;
  message: string;
  link?: string; // navigation target
  read: boolean;
  createdAt: string;
}

// Activity
export interface Activity {
  id: string;
  type: 'bid_submitted' | 'message_received' | 'project_awarded' | 'profile_updated';
  description: string;
  icon: string;
  timestamp: string;
  link?: string;
}

// Attachment
export interface Attachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
}

// Filter State
export interface FilterState {
  category?: string;
  budgetMin?: number;
  budgetMax?: number;
  deadline?: 'urgent' | 'this_week' | 'this_month' | 'any';
  location?: string;
  searchQuery?: string;
}

// Bid Summary for Analytics
export interface BidSummary {
  total: number;
  pending: number;
  accepted: number;
  shortlisted: number;
  rejected: number;
}

// Verification Status
export type VerificationStatus = 'unverified' | 'pending' | 'verified';
