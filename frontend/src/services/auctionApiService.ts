import apiClient from './api';
import type { AuctionStatus, Bid, LiveAuctionState } from '@/types/auction';

export interface AuctionDTO {
  id: string;
  projectId: string;
  clientUserId: string;
  status: AuctionStatus;
  startTime: string;
  endTime: string;
  actualStartTime?: string;
  currentHighestBid?: number;
  winnerOrganizationId?: string;
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
export const goLive = async (auctionId: string): Promise<AuctionDTO> => {
  const response = await apiClient.post<ApiResponse<AuctionDTO>>(
    `/api/auctions/${auctionId}/go-live`
  );
  return response.data.data;
};

/**
 * Submit a bid to a live auction
 */
export const submitBid = async (
  auctionId: string,
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
  auctionId: string,
  bidId: string
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
  auctionId: string,
  bidId: string
): Promise<Bid> => {
  const response = await apiClient.put<ApiResponse<Bid>>(
    `/api/auctions/${auctionId}/bids/${bidId}/reject`
  );
  return response.data.data;
};

/**
 * Get live auction state (for late joiners)
 */
export const getLiveState = async (auctionId: string): Promise<LiveAuctionState> => {
  const response = await apiClient.get<ApiResponse<LiveAuctionState>>(
    `/api/auctions/${auctionId}/live-state`
  );
  return response.data.data;
};

/**
 * End an auction manually
 */
export const endAuction = async (auctionId: string, userId: string): Promise<AuctionDTO> => {
  const response = await apiClient.post<ApiResponse<AuctionDTO>>(
    `/api/auctions/${auctionId}/end`,
    {},
    {
      headers: {
        'X-User-Id': userId
      }
    }
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

/**
 * Get auction by ID
 */
export const getAuctionById = async (auctionId: string) => {
  const response = await apiClient.get<ApiResponse<any>>(
    `/api/auctions/${auctionId}`
  );
  return response.data.data;
};

/**
 * Get bids for an auction
 */
export const getAuctionBids = async (auctionId: string, page: number = 0, limit: number = 100) => {
  const response = await apiClient.get<ApiResponse<any>>(
    `/api/auctions/${auctionId}/bids?page=${page}&limit=${limit}`
  );
  return response.data.data;
};

/**
 * Get my auction bids (for organizations)
 */
export const getMyAuctionBids = async (organizationId: string, page: number = 0, limit: number = 100) => {
  const response = await apiClient.get<ApiResponse<any>>(
    `/api/auctions/my-bids?page=${page}&limit=${limit}`,
    {
      headers: {
        'X-Organization-Id': organizationId
      }
    }
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
  getAuctionById,
  getAuctionBids,
  getMyAuctionBids,
};

export default auctionApiService;
