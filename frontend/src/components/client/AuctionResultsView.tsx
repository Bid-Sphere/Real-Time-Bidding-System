import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Building2, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import auctionApiService from '@/services/auctionApiService';
import { showErrorToast } from '@/utils/toast';

interface AuctionResultsViewProps {
  auctionId: string;
  auctionTitle: string;
  onBack: () => void;
}

export const AuctionResultsView: React.FC<AuctionResultsViewProps> = ({
  auctionId,
  auctionTitle,
  onBack
}) => {
  const [bids, setBids] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuctionResults = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all bids for this auction
        const bidsResponse = await auctionApiService.getAuctionBids(auctionId, 0, 100);
        setBids(bidsResponse.content || []);
      } catch (error) {
        console.error('Failed to fetch auction results:', error);
        showErrorToast('Failed to load auction results');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuctionResults();
  }, [auctionId]);

  const formatTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'REJECTED':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Filter accepted bids and sort by amount (lowest first for reverse auction)
  const acceptedBids = bids
    .filter(bid => bid.bidStatus === 'ACCEPTED')
    .sort((a, b) => a.bidAmount - b.bidAmount);

  const winningBid = acceptedBids.length > 0 ? acceptedBids[0] : null;

  // Count bids by status
  const acceptedCount = bids.filter(b => b.bidStatus === 'ACCEPTED').length;
  const rejectedCount = bids.filter(b => b.bidStatus === 'REJECTED').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="h-10"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Auctions
        </Button>
      </div>

      {isLoading ? (
        <Card className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-blue)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading results...</p>
        </Card>
      ) : (
        <>
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
              Auction Results: {auctionTitle}
            </h2>

            {/* Winner Section */}
            {winningBid ? (
              <div className="mb-8 p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Trophy className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                      Winning Bid
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Lowest accepted bid
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-[var(--text-muted)]" />
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Organization</p>
                      <p className="text-base font-semibold text-[var(--text-primary)]">
                        {winningBid.bidderName || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-[var(--text-muted)]" />
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Winning Amount</p>
                      <p className="text-2xl font-bold text-green-400">
                        ${winningBid.bidAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[var(--text-muted)]" />
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Submitted</p>
                      <p className="text-base font-semibold text-[var(--text-primary)]">
                        {formatTime(winningBid.bidTime)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-8 p-6 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-center">
                <Trophy className="h-12 w-12 text-[var(--text-muted)] mx-auto mb-3 opacity-50" />
                <p className="text-[var(--text-secondary)]">
                  No winner - No bids were accepted
                </p>
              </div>
            )}

            {/* Auction Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-[var(--bg-secondary)] rounded-lg">
              <div className="text-center">
                <p className="text-sm text-[var(--text-muted)] mb-1">Total Bids</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{bids.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[var(--text-muted)] mb-1">Accepted Bids</p>
                <p className="text-2xl font-bold text-green-400">{acceptedCount}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[var(--text-muted)] mb-1">Rejected Bids</p>
                <p className="text-2xl font-bold text-red-400">{rejectedCount}</p>
              </div>
            </div>
          </Card>

          {/* Bid History */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              Bid History ({bids.length} bids)
            </h3>

            {bids.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
                <p className="text-[var(--text-secondary)]">
                  No bids were submitted for this auction
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {bids.map((bid, index) => (
                  <div
                    key={bid.id || index}
                    className={`p-4 rounded-lg border transition-all ${
                      bid.bidStatus === 'ACCEPTED'
                        ? 'bg-green-500/10 border-green-500/30'
                        : bid.bidStatus === 'REJECTED'
                        ? 'bg-red-500/10 border-red-500/30'
                        : 'bg-[var(--bg-secondary)] border-[var(--border-light)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Building2 className="h-5 w-5 text-[var(--text-muted)]" />
                          <span className="font-semibold text-[var(--text-primary)]">
                            {bid.bidderName || 'Unknown Organization'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusBadgeClass(bid.bidStatus)}`}>
                            {getStatusIcon(bid.bidStatus)}
                            {bid.bidStatus}
                          </span>
                          {bid.id === winningBid?.id && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1">
                              <Trophy className="h-3 w-3" />
                              Winner
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-[var(--text-muted)]" />
                            <span className="text-lg font-bold text-[var(--text-primary)]">
                              ${bid.bidAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[var(--text-muted)]">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(bid.bidTime)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default AuctionResultsView;
