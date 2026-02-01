import { create } from 'zustand';
import biddingApiService, { type BidResponse } from '@/services/biddingApiService';

interface BidState {
  bids: BidResponse[];
  isLoading: boolean;
  error: string | null;
  total: number;
  
  // Actions
  fetchMyBids: (status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN') => Promise<void>;
  fetchBidsForProject: (projectId: string, status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN') => Promise<{ content: BidResponse[]; totalElements: number }>;
  getBid: (bidId: string) => Promise<BidResponse>;
  submitBid: (projectId: string, clientId: string, proposedPrice: number, estimatedDuration: number, proposal: string) => Promise<BidResponse>;
  updateBid: (bidId: string, proposedPrice: number, estimatedDuration: number, proposal: string) => Promise<void>;
  withdrawBid: (bidId: string) => Promise<void>;
  acceptBid: (bidId: string) => Promise<BidResponse>;
  rejectBid: (bidId: string, reason?: string) => Promise<void>;
  clearError: () => void;
}

export const useBidStore = create<BidState>((set, get) => ({
  bids: [],
  isLoading: false,
  error: null,
  total: 0,

  fetchMyBids: async (status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN') => {
    set({ isLoading: true, error: null });
    try {
      // Get user from auth store to get organization ID
      const { useAuthStore } = await import('@/store/authStore');
      const user = useAuthStore.getState().user;
      const organizationId = user?.organizationProfile?.id || user?.id;
      
      // Fetch standard bids
      const result = await biddingApiService.getMyBids({ status, page: 0, limit: 100 });
      
      // Fetch project API service once
      const projectApiService = await import('@/services/projectApiService').then(m => m.default);
      
      // Fetch project titles for standard bids
      const bidsWithTitles = await Promise.all(
        result.content.map(async (bid) => {
          try {
            const project = await projectApiService.getProjectById(bid.projectId);
            return {
              ...bid,
              projectTitle: project.title
            };
          } catch (error) {
            console.error(`Failed to fetch project ${bid.projectId}:`, error);
            return {
              ...bid,
              projectTitle: 'Project'
            };
          }
        })
      );
      
      // Fetch auction bids only if we have an organization ID
      let auctionBidsWithEmails: any[] = [];
      if (organizationId) {
        try {
          const auctionApiService = await import('@/services/auctionApiService').then(m => m.default);
          const auctionBidsResult = await auctionApiService.getMyAuctionBids(String(organizationId), 0, 100);
          
          // Convert auction bids to BidResponse format and fetch client emails
          auctionBidsWithEmails = await Promise.all(
            auctionBidsResult.content
              .filter((ab: any) => ab.auctionStatus === 'ENDED' && ab.isWinning) // Only show winning bids from ended auctions
              .map(async (ab: any) => {
                let clientEmail = '';
                try {
                  const project = await projectApiService.getProjectById(ab.projectId);
                  clientEmail = project.clientName; // Backend returns email in clientName field
                } catch (error) {
                  console.error(`Failed to fetch project ${ab.projectId} for client email:`, error);
                }
                
                return {
                  id: ab.auctionId, // Use auction ID as bid ID
                  projectId: ab.projectId,
                  projectTitle: ab.projectTitle,
                  bidderId: '', // Not available in auction bid response
                  bidderName: '',
                  proposedPrice: ab.myHighestBid,
                  estimatedDuration: 0, // Not available in auction bid response
                  proposal: '',
                  status: 'ACCEPTED' as const, // Winning auction bids are treated as accepted
                  submittedAt: ab.endTime, // Use end time as submitted time
                  updatedAt: ab.endTime,
                  acceptedAt: ab.endTime, // Use end time as accepted time
                  clientEmail: clientEmail,
                  ranking: 1, // Winner is always rank 1
                  isAuctionBid: true, // Flag to identify auction bids
                };
              })
          );
        } catch (error) {
          console.error('Failed to fetch auction bids:', error);
          // Continue without auction bids if there's an error
        }
      }
      
      // Merge standard bids and auction bids
      const allBids = [...bidsWithTitles, ...auctionBidsWithEmails];
      
      set({ 
        bids: allBids,
        total: result.totalElements + auctionBidsWithEmails.length,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch bids', 
        isLoading: false 
      });
    }
  },

  fetchBidsForProject: async (projectId: string, status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN') => {
    set({ isLoading: true, error: null });
    try {
      const result = await biddingApiService.getBidsForProject(projectId, { 
        status, 
        sort: 'price_asc',
        page: 0, 
        limit: 100 
      });
      set({ 
        bids: result.content,
        total: result.totalElements,
        isLoading: false 
      });
      return result; // Return the result so caller can access totalElements
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch bids', 
        isLoading: false 
      });
      throw error;
    }
  },

  getBid: async (bidId: string) => {
    set({ isLoading: true, error: null });
    try {
      const bid = await biddingApiService.getBidById(bidId);
      set({ isLoading: false });
      return bid;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch bid', 
        isLoading: false 
      });
      throw error;
    }
  },

  submitBid: async (projectId: string, clientId: string, proposedPrice: number, estimatedDuration: number, proposal: string) => {
    set({ isLoading: true, error: null });
    try {
      // Fetch project details to get client email
      const projectApiService = await import('@/services/projectApiService').then(m => m.default);
      const project = await projectApiService.getProjectById(projectId);
      
      const bid = await biddingApiService.submitBid({
        projectId,
        clientId,
        clientEmail: project.clientName, // This is actually the email from backend
        clientPhone: '', // Not available in project data
        proposedPrice,
        estimatedDuration,
        proposal
      });
      
      // Add the new bid to the local state
      const bids = [bid, ...get().bids];
      const total = get().total + 1;
      
      set({ bids, total, isLoading: false });
      return bid;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to submit bid', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateBid: async (bidId: string, proposedPrice: number, estimatedDuration: number, proposal: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedBid = await biddingApiService.updateBid(bidId, {
        proposedPrice,
        estimatedDuration,
        proposal
      });
      
      // Update the bid in the local state
      const bids = get().bids.map(b => 
        b.id === bidId ? updatedBid : b
      );
      
      set({ bids, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update bid', 
        isLoading: false 
      });
      throw error;
    }
  },

  withdrawBid: async (bidId: string) => {
    set({ isLoading: true, error: null });
    try {
      await biddingApiService.withdrawBid(bidId);
      
      // Remove the bid from the local state
      const bids = get().bids.filter(b => b.id !== bidId);
      const total = get().total - 1;
      
      set({ bids, total, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to withdraw bid', 
        isLoading: false 
      });
      throw error;
    }
  },

  acceptBid: async (bidId: string) => {
    set({ isLoading: true, error: null });
    try {
      const acceptedBid = await biddingApiService.acceptBid(bidId);
      
      // Update the bid in the local state
      const bids = get().bids.map(b => 
        b.id === bidId ? acceptedBid : b
      );
      
      set({ bids, isLoading: false });
      return acceptedBid;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to accept bid', 
        isLoading: false 
      });
      throw error;
    }
  },

  rejectBid: async (bidId: string, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      await biddingApiService.rejectBid(bidId, { reason });
      
      // Update the bid status in the local state
      const bids = get().bids.map(b => 
        b.id === bidId ? { ...b, status: 'REJECTED' as const, rejectionReason: reason } : b
      );
      
      set({ bids, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to reject bid', 
        isLoading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
