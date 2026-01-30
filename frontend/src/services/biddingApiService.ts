import apiClient from './api';

// Base URL for bidding service - goes through API gateway
const BIDDING_API_BASE = 'http://localhost:8080/api/bids';

export interface SubmitBidRequest {
  projectId: string;
  clientId: string;
  clientEmail?: string;
  clientPhone?: string;
  proposedPrice: number;
  estimatedDuration: number;
  proposal: string;
}

export interface UpdateBidRequest {
  proposedPrice: number;
  estimatedDuration: number;
  proposal: string;
}

export interface RejectBidRequest {
  reason?: string;
}

export interface BidResponse {
  id: string;
  projectId: string;
  projectTitle?: string;
  bidderId: string;
  bidderName: string;
  bidderType: 'ORGANIZATION' | 'INDIVIDUAL';
  proposedPrice: number;
  estimatedDuration: number;
  proposal: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  submittedAt: string;
  updatedAt: string;
  acceptedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  ranking?: number;
  totalBids?: number;
  // Client contact info (only for accepted bids)
  clientEmail?: string;
  clientPhone?: string;
}

export interface BidStatsResponse {
  totalBids: number;
  pendingBids: number;
  acceptedBids: number;
  rejectedBids: number;
  averageBidAmount: number;
  lowestBid: number;
  highestBid: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * Submit a new bid on a project
 */
export const submitBid = async (request: SubmitBidRequest): Promise<BidResponse> => {
  const response = await apiClient.post<ApiResponse<BidResponse>>(
    BIDDING_API_BASE,
    request
  );
  return response.data.data;
};

/**
 * Get all bids for a specific project
 */
export const getBidsForProject = async (
  projectId: string,
  params?: {
    status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
    sort?: 'date_desc' | 'date_asc' | 'price_asc' | 'price_desc';
    page?: number;
    limit?: number;
  }
): Promise<PageResponse<BidResponse>> => {
  const response = await apiClient.get<ApiResponse<PageResponse<BidResponse>>>(
    `${BIDDING_API_BASE}/project/${projectId}`,
    { params }
  );
  return response.data.data;
};

/**
 * Get my bids (for organizations)
 */
export const getMyBids = async (params?: {
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  page?: number;
  limit?: number;
}): Promise<PageResponse<BidResponse>> => {
  const response = await apiClient.get<ApiResponse<PageResponse<BidResponse>>>(
    `${BIDDING_API_BASE}/my-bids`,
    { params }
  );
  return response.data.data;
};

/**
 * Get a single bid by ID
 */
export const getBidById = async (bidId: string): Promise<BidResponse> => {
  const response = await apiClient.get<ApiResponse<BidResponse>>(
    `${BIDDING_API_BASE}/${bidId}`
  );
  return response.data.data;
};

/**
 * Update an existing bid (only PENDING bids)
 */
export const updateBid = async (
  bidId: string,
  request: UpdateBidRequest
): Promise<BidResponse> => {
  const response = await apiClient.put<ApiResponse<BidResponse>>(
    `${BIDDING_API_BASE}/${bidId}`,
    request
  );
  return response.data.data;
};

/**
 * Withdraw a bid (only PENDING bids)
 */
export const withdrawBid = async (bidId: string): Promise<void> => {
  await apiClient.delete<ApiResponse<void>>(`${BIDDING_API_BASE}/${bidId}`);
};

/**
 * Accept a bid (CLIENT role only)
 */
export const acceptBid = async (bidId: string): Promise<BidResponse> => {
  const response = await apiClient.post<ApiResponse<BidResponse>>(
    `${BIDDING_API_BASE}/${bidId}/accept`
  );
  return response.data.data;
};

/**
 * Reject a bid (CLIENT role only)
 */
export const rejectBid = async (
  bidId: string,
  request?: RejectBidRequest
): Promise<void> => {
  await apiClient.post<ApiResponse<void>>(
    `${BIDDING_API_BASE}/${bidId}/reject`,
    request || {}
  );
};

/**
 * Get bid statistics for a project
 */
export const getBidStats = async (projectId: string): Promise<BidStatsResponse> => {
  const response = await apiClient.get<ApiResponse<BidStatsResponse>>(
    `${BIDDING_API_BASE}/project/${projectId}/stats`
  );
  return response.data.data;
};

/**
 * Health check for bidding service
 */
export const healthCheck = async (): Promise<string> => {
  const response = await apiClient.get<ApiResponse<string>>(
    `${BIDDING_API_BASE}/health`
  );
  return response.data.data;
};

const biddingApiService = {
  submitBid,
  getBidsForProject,
  getMyBids,
  getBidById,
  updateBid,
  withdrawBid,
  acceptBid,
  rejectBid,
  getBidStats,
  healthCheck,
};

export default biddingApiService;
