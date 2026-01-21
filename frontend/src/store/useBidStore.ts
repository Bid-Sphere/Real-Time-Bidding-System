import { create } from 'zustand';
import type { Bid } from '@/types/organization';


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

  fetchBids: async (_orgId: string, _status?: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock data for now - replace with actual API call
      const result = { bids: [], total: 0 };
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
      // Mock data for now - replace with actual API call
      const bid = { id: bidId } as Bid;
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
      // Mock data for now - replace with actual API call
      const updatedBid = { id: bidId, ...data } as Bid;
      
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
      // Mock implementation - replace with actual API call
      // await api.withdrawBid(bidId);
      
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
