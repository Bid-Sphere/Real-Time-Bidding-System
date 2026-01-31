import { useState, useEffect } from 'react';
import { X, Clock, DollarSign, MessageCircle, Eye, Check, XIcon, Trophy } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import { useBidStore } from '@/store/useBidStore';
import { getAuctionBids } from '@/services/auctionApiService';
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

interface AuctionBid {
  id: string;
  auctionId: string;
  organizationId: string;
  organizationName: string;
  bidAmount: number;
  bidStatus: 'ACCEPTED' | 'REJECTED' | 'PENDING';
  submittedAt: string;
}

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
  const [auctionBids, setAuctionBids] = useState<AuctionBid[]>([]);
  const [isLoadingAuction, setIsLoadingAuction] = useState(false);

  // Debug logging
  console.log('=== VIEW BIDS PANEL ===');
  console.log('Project:', project);
  console.log('Bidding Type:', project.biddingType);
  console.log('Winner Organization Name:', project.winnerOrganizationName);
  console.log('Winning Amount:', project.winningAmount);
  console.log('Winner Email:', project.winnerEmail);
  console.log('Winner Organization ID:', project.winnerOrganizationId);
  console.log('Winning Bid ID:', project.winningBidId);
  console.log('Auction ID:', project.auctionId);
  console.log('========================');

  useEffect(() => {
    if (isOpen && project.id) {
      console.log('=== FETCHING BIDS ===');
      console.log('Project ID:', project.id);
      console.log('Bidding Type:', project.biddingType);
      console.log('Auction ID:', project.auctionId);
      
      // Check if this is a LIVE_AUCTION project
      if (project.biddingType === 'LIVE_AUCTION' && project.auctionId) {
        // Fetch bids from auction service
        console.log('Fetching auction bids for auction ID:', project.auctionId);
        setIsLoadingAuction(true);
        getAuctionBids(project.auctionId)
          .then((response) => {
            console.log('Auction bids response:', response);
            console.log('Auction bids array:', response.bids);
            setAuctionBids(response.bids || []);
          })
          .catch((error) => {
            console.error('Failed to fetch auction bids:', error);
            setAuctionBids([]);
          })
          .finally(() => {
            setIsLoadingAuction(false);
          });
      } else {
        // Fetch bids from bidding service (standard bidding)
        console.log('Fetching standard bids for project ID:', project.id);
        fetchBidsForProject(project.id);
      }
    }
  }, [isOpen, project.id, project.biddingType, project.auctionId, fetchBidsForProject]);

  if (!isOpen) return null;

  // Determine which bids to display based on project type
  const isAuctionProject = project.biddingType === 'LIVE_AUCTION';
  const displayBids = isAuctionProject ? auctionBids : bids;
  const loading = isAuctionProject ? isLoadingAuction : isLoading;

  // For auction projects, find the winning bid (lowest accepted bid)
  const winningBid = isAuctionProject 
    ? auctionBids.find(bid => bid.bidStatus === 'ACCEPTED')
    : null;

  const sortedAuctionBids = isAuctionProject
    ? [...auctionBids].sort((a, b) => a.bidAmount - b.bidAmount)
    : [];

  const sortedStandardBids = !isAuctionProject
    ? [...bids].sort((a, b) => {
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
      })
    : [];

  const lowestBid = isAuctionProject
    ? (auctionBids.length > 0 ? Math.min(...auctionBids.map(bid => bid.bidAmount)) : 0)
    : (bids.length > 0 ? Math.min(...bids.map(bid => bid.proposedPrice)) : 0);

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
                {isAuctionProject ? 'Auction Results' : 'Bids'} for "{project.title}"
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {displayBids.length} {isAuctionProject ? 'bids submitted' : 'bids received'}
              </p>
              {isAuctionProject && winningBid && (
                <div className="mt-2 flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Trophy className="h-5 w-5" />
                  <span className="font-semibold">
                    Winner: {winningBid.organizationName} - ${winningBid.bidAmount.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Controls - Only show for standard bidding */}
          {!isAuctionProject && (
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
          )}
        </div>

        {/* Bids List */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Winner Card - Show at top for auction projects with winner */}
          {isAuctionProject && project.winnerOrganizationName && (
            <Card className="p-6 mb-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <Trophy className="h-8 w-8 text-green-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white">
                        {project.winnerOrganizationName}
                      </h3>
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium border border-green-500/30">
                        Winner
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      <span className="text-2xl font-bold text-green-400">
                        {project.winningAmount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </span>
                    </div>
                  </div>
                </div>
                {project.winnerEmail && (
                  <Button
                    onClick={() => window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${project.winnerEmail}`, '_blank')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Winner
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* All Bids Section Header */}
          {isAuctionProject && project.winnerOrganizationName && displayBids.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-300">All Bids</h3>
              <p className="text-sm text-gray-400">Review all submitted bids for this auction</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400">Loading bids...</div>
            </div>
          ) : displayBids.length === 0 && !(isAuctionProject && project.winnerOrganizationName) ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-gray-400 text-lg">No bids received yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  {isAuctionProject 
                    ? 'Bids will appear here once the auction receives submissions'
                    : 'Bids will appear here once organizations submit them'}
                </p>
              </div>
            </div>
          ) : null}

          {!loading && displayBids.length > 0 && isAuctionProject && (
            // Render auction bids
            <div className="space-y-6">
              {sortedAuctionBids.map((bid) => (
                <Card key={bid.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {bid.organizationName}
                        </h3>
                        {bid.bidAmount === lowestBid && bid.bidStatus === 'ACCEPTED' && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-xs font-medium flex items-center gap-1">
                            <Trophy className="h-3 w-3" />
                            Winner
                          </span>
                        )}
                        {bid.bidStatus === 'ACCEPTED' && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
                            ✓ Accepted
                          </span>
                        )}
                        {bid.bidStatus === 'REJECTED' && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs font-medium">
                            ✗ Rejected
                          </span>
                        )}
                        {bid.bidStatus === 'PENDING' && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full text-xs font-medium">
                            Pending
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
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="text-sm text-gray-300">Bid Amount</div>
                          <div className="text-xl font-bold text-white">
                            ${bid.bidAmount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewProfile(bid.organizationId)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenChat(bid.organizationId)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && displayBids.length > 0 && !isAuctionProject && (
            // Render standard bids
            <div className="space-y-6">
              {sortedStandardBids.map((bid) => (
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