import { useState } from 'react';
import type { Bid, BidSummary } from '@/types/organization';
import type { BidResponse } from '@/services/biddingApiService';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Mail } from 'lucide-react';
import { useBidStore } from '@/store/useBidStore';

interface MyBidsSummaryProps {
  summary: BidSummary;
  bids?: BidResponse[];
  onViewAll: () => void;
  onEditBid?: (bid: Bid | BidResponse) => void;
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

  const handleEdit = (bid: BidResponse) => {
    if (onEditBid) {
      // Convert BidResponse to Bid format for the edit modal
      const bidData: Bid = {
        id: bid.id,
        projectId: bid.projectId,
        projectTitle: bid.projectTitle || '',
        organizationId: bid.bidderId,
        proposedPrice: bid.proposedPrice,
        estimatedTimeline: String(bid.estimatedDuration),
        coverLetter: bid.proposal,
        status: bid.status.toLowerCase() as 'pending' | 'shortlisted' | 'accepted' | 'rejected',
        submittedAt: bid.submittedAt,
        updatedAt: bid.updatedAt,
        ranking: bid.ranking
      };
      onEditBid(bidData);
    }
  };

  const handleContactClient = (clientEmail: string) => {
    // Open Gmail compose with client email
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(clientEmail)}`;
    window.open(gmailUrl, '_blank');
  };

  // Map status from BidResponse to display format
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'ACCEPTED':
        return 'bg-green-500/20 text-green-400';
      case 'REJECTED':
        return 'bg-red-500/20 text-red-400';
      case 'WITHDRAWN':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
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
                    <div
                      key={bid.id}
                      className="bg-[rgba(26,26,46,0.4)] rounded-lg p-5 border border-gray-800 hover:border-gray-700 transition-all duration-200"
                    >
                      {/* Header with Title and Status */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 pr-4">
                          <h4 className="text-lg font-semibold text-white mb-2">{bid.projectTitle || 'Project'}</h4>
                          <div className="flex items-center gap-3">
                            {(bid as any).isAuctionBid ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30">
                                🏆 Won Auction
                              </span>
                            ) : (
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
                                {bid.status}
                              </span>
                            )}
                            {bid.ranking && !((bid as any).isAuctionBid) && (
                              <span className="text-sm text-gray-400">Rank #{bid.ranking}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white mb-1">${bid.proposedPrice.toLocaleString()}</div>
                          {bid.estimatedDuration > 0 && (
                            <div className="text-sm text-gray-400">{bid.estimatedDuration} days</div>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                        {/* Left side - Edit/Withdraw for pending, Accepted date for accepted/auction */}
                        <div className="flex items-center gap-3">
                          {bid.status === 'PENDING' && !(bid as any).isAuctionBid && (
                            <>
                              <button
                                onClick={() => handleEdit(bid)}
                                className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                Edit Bid
                              </button>
                              <span className="text-gray-600">•</span>
                              <button
                                onClick={() => handleWithdraw(bid.id)}
                                className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                              >
                                Withdraw
                              </button>
                            </>
                          )}
                          {(bid.status === 'ACCEPTED' || (bid as any).isAuctionBid) && (
                            <span className="text-sm text-gray-400">
                              {(bid as any).isAuctionBid ? 'Won on' : 'Accepted on'} {new Date(bid.acceptedAt || bid.updatedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        
                        {/* Right side - Contact button for accepted/auction */}
                        {(bid.status === 'ACCEPTED' || (bid as any).isAuctionBid) && bid.clientEmail && (
                          <button
                            onClick={() => handleContactClient(bid.clientEmail!)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-blue-500/40"
                          >
                            <Mail className="w-4 h-4" />
                            Contact Client
                          </button>
                        )}
                      </div>
                    </div>
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
