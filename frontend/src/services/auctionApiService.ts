import apiClient from './api';
import type { AuctionStatus, Bid, LiveAuctionState } from '@/types/auction';

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

export interface SubmitBidRequest {
  amount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Transition auction from SCHEDULED to LIVE status
 */
export const goLive = async (auctionId: number): Promise<AuctionDTO> => {
  const response = await apiClient.post<ApiResponse<AuctionDTO>>(
    `/api/auctions/${auctionId}/go-live`
  );
  return response.data.data;
};

/**
 * Submit a bid to a live auction
 */
export const submitBid = async (
  auctionId: number,
  request: SubmitBidRequest
): Promise<Bid> => {
  const response = await apiClient.post<ApiResponse<Bid>>(
    `/api/auctions/${auctionId}/bids`,
    request
  );
  return response.data.data;
};

/**
 * Accept a bid (client only)
 */
export const acceptBid = async (
  auctionId: number,
  bidId: number
): Promise<Bid> => {
  const response = await apiClient.put<ApiResponse<Bid>>(
    `/api/auctions/${auctionId}/bids/${bidId}/accept`
  );
  return response.data.data;
};

/**
 * Reject a bid (client only)
 */
export const rejectBid = async (
  auctionId: number,
  bidId: number
): Promise<Bid> => {
  const response = await apiClient.put<ApiResponse<Bid>>(
    `/api/auctions/${auctionId}/bids/${bidId}/reject`
  );
  return response.data.data;
};

/**
 * Get live auction state (for late joiners)
 */
export const getLiveState = async (auctionId: number): Promise<LiveAuctionState> => {
  const response = await apiClient.get<ApiResponse<LiveAuctionState>>(
    `/api/auctions/${auctionId}/live-state`
  );
  return response.data.data;
};

/**
 * End an auction manually
 */
export const endAuction = async (auctionId: number): Promise<AuctionDTO> => {
  const response = await apiClient.post<ApiResponse<AuctionDTO>>(
    `/api/auctions/${auctionId}/end`
  );
  return response.data.data;
};

/**
 * Get my auctions (for clients)
 */
export const getMyAuctions = async (page: number = 0, limit: number = 20) => {
  const response = await apiClient.get<ApiResponse<any>>(
    `/api/auctions/my-auctions?page=${page}&limit=${limit}`
  );
  return response.data.data;
};

/**
 * Get active auctions (for organizations)
 */
export const getActiveAuctions = async (page: number = 0, limit: number = 20) => {
  const response = await apiClient.get<ApiResponse<any>>(
    `/api/auctions/active?page=${page}&limit=${limit}`
  );
  return response.data.data;
};

const auctionApiService = {
  goLive,
  submitBid,
  acceptBid,
  rejectBid,
  getLiveState,
  endAuction,
  getMyAuctions,
  getActiveAuctions,
};

export default auctionApiService;
