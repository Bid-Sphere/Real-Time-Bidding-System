/**
 * Central Types Export
 * Re-exports all types from individual type files for convenient importing
 */

// Auction types
export type {
  BidStatus,
  AuctionStatus,
  Bid,
  LiveAuctionState,
  AuctionStatusChange,
  ApiResponse,
  AuctionDTO,
  BidDTO,
  SubmitBidRequest,
  GoLiveResponse,
  SubmitBidResponse,
  AcceptBidResponse,
  RejectBidResponse,
  GetLiveStateResponse,
  EndAuctionResponse,
} from './auction';

// Auth types
export type {
  LoginCredentials,
  SignupData,
  AuthState,
  ClientProfile as AuthClientProfile,
  OrganizationProfile as AuthOrganizationProfile,
} from './auth';

// Client types
export type {
  ClientProfile,
  ClientAnalyticsData,
  ClientProject,
  ReceivedBid,
  TeamMember,
  ClientConversation,
  ClientMessage,
  ClientNotification,
  ClientActivity,
  Attachment,
  ClientFilterState,
  DashboardStats,
  VerificationStatus,
  ProfileCompletionRequirements,
} from './client';

// Organization types
export type {
  OrganizationProfile,
  AnalyticsData,
  Project as OrgProject,
  Bid as OrgBid,
  TeamMember as OrgTeamMember,
  Conversation,
  Message,
  Notification,
  Activity,
  Attachment as OrgAttachment,
  FilterState,
  BidSummary,
  VerificationStatus as OrgVerificationStatus,
} from './organization';

// Project types
export type {
  Project,
  ProjectAttachment,
  Bid as ProjectBid,
  TeamMember as ProjectTeamMember,
  DashboardStats as ProjectDashboardStats,
  ProjectCategory,
  ProjectStatus,
  BiddingType,
  BidStatus as ProjectBidStatus,
  ProjectFilter,
  SortOption,
  CreateProjectData,
} from './project';

// User types
export type {
  User,
  UserRole,
  UserStatus,
  ClientProfile as UserClientProfile,
  OrganizationProfile as UserOrganizationProfile,
} from './user';
