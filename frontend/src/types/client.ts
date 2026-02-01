// Client Dashboard Type Definitions

// Client Profile based on auth service Client model
export interface ClientProfile {
  id?: number;
  userId?: number;
  companyName?: string; // Optional for individual clients
  industry?: string;
  website?: string;
  billingAddress?: string;
  taxId?: string;
  // Additional fields from User model
  firstName?: string;
  lastName?: string;
  email?: string;
  emailVerified?: boolean;
  completionPercentage?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Client Analytics Data
export interface ClientAnalyticsData {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalSpent: number;
  averageBidAmount: number;
  averageProjectDuration: number; // in days
  successfulProjects: number;
  cancelledProjects: number;
  averageRating: number;
}

// Project Posted by Client
export interface ClientProject {
  id: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  budget: number;
  deadline: string;
  clientId: string;
  requirements: string[];
  attachments?: Attachment[];
  bidCount: number;
  status: 'DRAFT' | 'OPEN' | 'ACCEPTING_BIDS' | 'IN_DISCUSSION' | 'CLOSED' | 'IN_PROGRESS' | 'COMPLETED';
  location?: string;
  requiredSkills: string[];
  biddingType: 'LIVE_AUCTION' | 'STANDARD';
  strictDeadline: boolean;
  biddingEndDate: string;
  postedAt: string;
  updatedAt: string;
  // Auction winner fields
  winningBidId?: string;
  winnerOrganizationId?: string;
  winningAmount?: number;
  winnerEmail?: string;
  winnerOrganizationName?: string;
}

// Bid Received by Client
export interface ReceivedBid {
  id: string;
  projectId: string;
  projectTitle: string;
  bidderId: string;
  bidderName: string;
  bidderType: 'organization' | 'freelancer';
  bidderRating: number;
  completedProjects: number;
  proposedPrice: number;
  estimatedDuration: number;
  proposal: string;
  attachments?: Attachment[];
  teamComposition?: TeamMember[];
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
  submittedAt: string;
  updatedAt: string;
}

// Team Member (for organization bids)
export interface TeamMember {
  name: string;
  role: string;
  experience: string;
  skills?: string[];
  avatar?: string;
}

// Chat Conversation for Client
export interface ClientConversation {
  id: string;
  projectId: string;
  projectTitle: string;
  bidderId: string;
  bidderName: string;
  bidderAvatar?: string;
  bidderType: 'organization' | 'freelancer';
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  createdAt: string;
}

// Message in Client Chat
export interface ClientMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'bidder';
  content: string;
  attachments?: Attachment[];
  sentAt: string;
  readAt?: string;
}

// Client Notification
export interface ClientNotification {
  id: string;
  userId: string;
  type: 'new_bid' | 'bid_withdrawn' | 'new_message' | 'project_milestone' | 'payment_due';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

// Client Activity
export interface ClientActivity {
  id: string;
  type: 'project_posted' | 'bid_received' | 'bid_accepted' | 'message_sent' | 'payment_made';
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

// Project Filter State for Client
export interface ClientFilterState {
  status?: 'all' | 'active' | 'in_discussion' | 'closed';
  category?: string;
  budgetMin?: number;
  budgetMax?: number;
  dateRange?: 'all' | 'this_week' | 'this_month' | 'last_month';
  searchQuery?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalProjects: number;
  activeBids: number;
  completedProjects: number;
  averageBidAmount?: number;
}

// Verification Status
export type VerificationStatus = 'unverified' | 'pending' | 'verified';

// Profile Completion Requirements
export interface ProfileCompletionRequirements {
  basic: string[];
  business: string[];
  verification: string[];
}