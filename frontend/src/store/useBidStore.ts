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
      const result = await biddingApiService.getMyBids({ status, page: 0, limit: 100 });
      
      // Fetch project titles for all bids
      const projectApiService = await import('@/services/projectApiService').then(m => m.default);
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
      
      set({ 
        bids: bidsWithTitles,
        total: result.totalElements,
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
