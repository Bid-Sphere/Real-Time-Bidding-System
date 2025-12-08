import { create } from 'zustand';
import type { Bid } from '@/types/organization';
import { mockApiService } from '@/mocks/mockApiService';

interface BidState {
  bids: Bid[];
  isLoading: boolean;
  error: string | null;
  total: number;
  
  // Actions
  fetchBids: (orgId: string, status?: string) => Promise<void>;
  getBid: (bidId: string) => Promise<Bid>;
  updateBid: (bidId: string, data: Partial<Pick<Bid, 'proposedPrice' | 'estimatedTimeline' | 'coverLetter'>>) => Promise<void>;
  withdrawBid: (bidId: string) => Promise<void>;
}

export const useBidStore = create<BidState>((set, get) => ({
  bids: [],
  isLoading: false,
  error: null,
  total: 0,

  fetchBids: async (orgId: string, status?: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await mockApiService.bids.getBids(orgId, status);
      set({ 
        bids: result.bids,
        total: result.total,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch bids', 
        isLoading: false 
      });
    }
  },

  getBid: async (bidId: string) => {
    set({ isLoading: true, error: null });
    try {
      const bid = await mockApiService.bids.getBid(bidId);
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

  updateBid: async (bidId: string, data: Partial<Pick<Bid, 'proposedPrice' | 'estimatedTimeline' | 'coverLetter'>>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedBid = await mockApiService.bids.updateBid(bidId, data);
      
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
      await mockApiService.bids.withdrawBid(bidId);
      
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
}));
