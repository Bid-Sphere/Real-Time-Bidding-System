import { useState } from 'react';
import type { Bid, BidSummary } from '@/types/organization';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BidListItem } from '@/components/bids/BidListItem';
import { useBidStore } from '@/store/useBidStore';

interface MyBidsSummaryProps {
  summary: BidSummary;
  bids?: Bid[];
  onViewAll: () => void;
  onEditBid?: (bid: Bid) => void;
}

export const MyBidsSummary = ({ summary, bids, onViewAll, onEditBid }: MyBidsSummaryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { withdrawBid } = useBidStore();

  const handleToggleExpand = () => {
    if (!isExpanded && bids === undefined) {
      // Fetch bids if not already loaded
      onViewAll();
    }
    setIsExpanded(!isExpanded);
  };

  const handleWithdraw = async (bidId: string) => {
    await withdrawBid(bidId);
    // Refresh the bids list after withdrawal
    onViewAll();
  };

  const handleEdit = (bid: Bid) => {
    if (onEditBid) {
      onEditBid(bid);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[rgba(26,26,46,0.6)] to-[rgba(26,26,46,0.4)] backdrop-blur-sm rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">My Bids Summary</h2>
        <button
          onClick={handleToggleExpand}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors min-h-[44px] px-2"
          aria-label={isExpanded ? 'Hide bid details' : 'View all bids'}
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? 'Hide Details' : 'View All Bids'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[rgba(26,26,46,0.4)] rounded-lg p-4 border border-gray-800">
          <div className="text-2xl font-bold text-white mb-1">{summary.total}</div>
          <div className="text-sm text-gray-400">Total Bids</div>
        </div>
        <div className="bg-[rgba(26,26,46,0.4)] rounded-lg p-4 border border-gray-800">
          <div className="text-2xl font-bold text-yellow-400 mb-1">{summary.pending}</div>
          <div className="text-sm text-gray-400">Pending</div>
        </div>
        <div className="bg-[rgba(26,26,46,0.4)] rounded-lg p-4 border border-gray-800">
          <div className="text-2xl font-bold text-blue-400 mb-1">{summary.shortlisted}</div>
          <div className="text-sm text-gray-400">Shortlisted</div>
        </div>
        <div className="bg-[rgba(26,26,46,0.4)] rounded-lg p-4 border border-gray-800">
          <div className="text-2xl font-bold text-green-400 mb-1">{summary.accepted}</div>
          <div className="text-sm text-gray-400">Accepted</div>
        </div>
      </div>

      {/* Expanded Bid List */}
      <AnimatePresence>
        {isExpanded && bids && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden origin-top"
          >
            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">All Bids</h3>
              
              {bids.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No bids submitted yet.</p>
              ) : (
                <div className="space-y-3">
                  {bids.map((bid) => (
                    <BidListItem
                      key={bid.id}
                      bid={bid}
                      onEdit={handleEdit}
                      onWithdraw={handleWithdraw}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
