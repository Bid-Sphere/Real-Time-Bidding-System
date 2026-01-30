import { useState, useEffect } from 'react';
import { X, Clock, DollarSign, MessageCircle, Eye, Check, XIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import { useBidStore } from '@/store/useBidStore';
import type { Project } from '../../types/project';

interface ViewBidsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onAcceptBid: (bidId: string) => void;
  onRejectBid: (bidId: string) => void;
  onOpenChat: (bidderId: string) => void;
  onViewProfile: (bidderId: string) => void;
}

type SortOption = 'lowest_price' | 'highest_rating' | 'most_recent' | 'fastest_completion';

export default function ViewBidsPanel({
  isOpen,
  onClose,
  project,
  onAcceptBid,
  onRejectBid,
  onOpenChat,
  onViewProfile
}: ViewBidsPanelProps) {
  const { bids, isLoading, fetchBidsForProject } = useBidStore();
  const [sortBy, setSortBy] = useState<SortOption>('lowest_price');
  const [selectedBids, setSelectedBids] = useState<string[]>([]);
  const [expandedProposals, setExpandedProposals] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && project.id) {
      fetchBidsForProject(project.id);
    }
  }, [isOpen, project.id, fetchBidsForProject]);

  if (!isOpen) return null;

  const sortedBids = [...bids].sort((a, b) => {
    switch (sortBy) {
      case 'lowest_price':
        return a.proposedPrice - b.proposedPrice;
      case 'most_recent':
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      case 'fastest_completion':
        return a.estimatedDuration - b.estimatedDuration;
      default:
        return 0;
    }
  });

  const lowestBid = bids.length > 0 ? Math.min(...bids.map(bid => bid.proposedPrice)) : 0;

  const toggleProposal = (bidId: string) => {
    setExpandedProposals(prev =>
      prev.includes(bidId)
        ? prev.filter(id => id !== bidId)
        : [...prev, bidId]
    );
  };

  const toggleBidSelection = (bidId: string) => {
    setSelectedBids(prev =>
      prev.includes(bidId)
        ? prev.filter(id => id !== bidId)
        : [...prev, bidId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Bids for "{project.title}"
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {bids.length} bids received
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-4">
            <Select
              options={[
                { value: 'lowest_price', label: 'Lowest Price First' },
                { value: 'most_recent', label: 'Most Recent First' },
                { value: 'fastest_completion', label: 'Fastest Completion' }
              ]}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            />

            {selectedBids.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedBids.length} selected
                </span>
                <Button variant="outline" size="sm">
                  Compare Selected
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Bids List */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400">Loading bids...</div>
            </div>
          ) : bids.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-gray-400 text-lg">No bids received yet</p>
                <p className="text-gray-500 text-sm mt-2">Bids will appear here once organizations submit them</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedBids.map((bid) => (
                <Card key={bid.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedBids.includes(bid.id)}
                        onChange={() => toggleBidSelection(bid.id)}
                        className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {bid.bidderName}
                          </h3>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            🏢 {bid.bidderType}
                          </span>
                          {bid.proposedPrice === lowestBid && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-xs font-medium">
                              Lowest Bid
                            </span>
                          )}
                          {bid.status === 'ACCEPTED' && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
                              ✓ Accepted
                            </span>
                          )}
                          {bid.status === 'REJECTED' && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs font-medium">
                              ✗ Rejected
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-300">
                              Submitted {new Date(bid.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                          {bid.ranking && (
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">⭐</span>
                              <span>Rank #{bid.ranking}</span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <div>
                              <div className="text-sm text-gray-300">Proposed Price</div>
                              <div className="text-xl font-bold text-white">
                                ${bid.proposedPrice.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-600" />
                            <div>
                              <div className="text-sm text-gray-300">Estimated Duration</div>
                              <div className="text-xl font-bold text-white">
                                {bid.estimatedDuration} days
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Proposal */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Proposal
                          </h4>
                          <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50">
                            <p className={`text-gray-200 ${
                              expandedProposals.includes(bid.id) ? '' : 'line-clamp-3'
                            }`}>
                              {bid.proposal}
                            </p>
                            {bid.proposal.length > 200 && (
                              <button
                                onClick={() => toggleProposal(bid.id)}
                                className="text-blue-600 hover:text-blue-700 text-sm mt-2"
                              >
                                {expandedProposals.includes(bid.id) ? 'Show less' : 'Show more'}
                              </button>
                            )}
                          </div>
                        </div>

                        {bid.rejectionReason && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">
                              Rejection Reason
                            </h4>
                            <div className="bg-red-900/20 backdrop-blur-sm p-3 rounded-lg border border-red-700/50">
                              <p className="text-red-200 text-sm">{bid.rejectionReason}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewProfile(bid.bidderId)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenChat(bid.bidderId)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                    </div>

                    {bid.status === 'PENDING' && (
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRejectBid(bid.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <XIcon className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onAcceptBid(bid.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept Bid
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}