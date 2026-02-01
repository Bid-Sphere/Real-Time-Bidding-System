/**
 * Live Auction Types
 * For real-time bidding functionality
 */

// Enums
export type BidStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type AuctionStatus = 'SCHEDULED' | 'ACTIVE' | 'LIVE' | 'CLOSED' | 'ENDED' | 'CANCELLED';

// Core Interfaces
export interface Bid {
  id: string;
  auctionId: string;
  organizationId: string;
  organizationName: string;
  amount: number;
  status: BidStatus;
  createdAt: string;
  isCurrentLowest: boolean;
}

export interface LiveAuctionState {
  currentAcceptedBid: Bid | null;
  recentBids: Bid[];
  auctionStatus: AuctionStatus;
  remainingTimeMs: number;
  minimumNextBid: number;
}

export interface AuctionStatusChange {
  auctionId: string;
  oldStatus: AuctionStatus;
  newStatus: AuctionStatus;
  timestamp: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuctionDTO {
  id: number;
  projectId: number;
  clientUserId: number;
  status: AuctionStatus;
  startTime: string;
  endTime: string;
  actualStartTime?: string;
  currentHighestBid?: number;
  winnerOrganizationId?: number;
  winningBidAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BidDTO {
  id: string;
  auctionId: string;
  organizationId: string;
  organizationName: string;
  amount: number;
  status: BidStatus;
  createdAt: string;
  isCurrentLowest: boolean;
}

export interface SubmitBidRequest {
  amount: number;
}

export interface GoLiveResponse extends ApiResponse<AuctionDTO> {}

export interface SubmitBidResponse extends ApiResponse<BidDTO> {}

export interface AcceptBidResponse extends ApiResponse<BidDTO> {}

export interface RejectBidResponse extends ApiResponse<BidDTO> {}

export interface GetLiveStateResponse extends ApiResponse<LiveAuctionState> {}

export interface EndAuctionResponse extends ApiResponse<AuctionDTO> {}
