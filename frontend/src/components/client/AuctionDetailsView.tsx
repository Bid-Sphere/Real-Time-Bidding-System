import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import auctionApiService from '@/services/auctionApiService';
import { showErrorToast } from '@/utils/toast';

interface AuctionDetailsViewProps {
  auctionId: string;
  auctionTitle: string;
  onBack: () => void;
}

export const AuctionDetailsView: React.FC<AuctionDetailsViewProps> = ({
  auctionId,
  auctionTitle,
  onBack
}) => {
  const [auctionDetails, setAuctionDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        setIsLoading(true);
        const response = await auctionApiService.getAuctionById(auctionId);
        setAuctionDetails(response);
      } catch (error) {
        console.error('Failed to fetch auction details:', error);
        showErrorToast('Failed to load auction details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuctionDetails();
  }, [auctionId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ACTIVE':
      case 'LIVE':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'CLOSED':
      case 'ENDED':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Calendar className="h-4 w-4" />;
      case 'ACTIVE':
      case 'LIVE':
        return <Clock className="h-4 w-4" />;
      case 'CLOSED':
      case 'ENDED':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

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
          <p className="text-[var(--text-secondary)]">Loading details...</p>
        </Card>
      ) : (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
            {auctionTitle}
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-[var(--text-muted)] mb-1">Category</p>
              <p className="text-base text-[var(--text-primary)]">{auctionDetails?.projectCategory}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)] mb-1">Status</p>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(auctionDetails?.status)}`}>
                {getStatusIcon(auctionDetails?.status)}
                {auctionDetails?.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)] mb-1">Total Bids</p>
              <p className="text-base text-[var(--text-primary)]">{auctionDetails?.totalBids || 0}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)] mb-1">Current Lowest Bid</p>
              <p className="text-base text-[var(--text-primary)]">
                {auctionDetails?.currentLowestBid ? `$${auctionDetails.currentLowestBid.toLocaleString()}` : 'No bids yet'}
              </p>
            </div>
            {auctionDetails?.reservePrice && (
              <div>
                <p className="text-sm text-[var(--text-muted)] mb-1">Starting Bid / Budget</p>
                <p className="text-base text-[var(--text-primary)]">
                  ${auctionDetails.reservePrice.toLocaleString()}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-[var(--text-muted)] mb-1">Start Time</p>
              <p className="text-base text-[var(--text-primary)]">
                {auctionDetails?.startTime ? new Date(auctionDetails.startTime).toLocaleString() : 'Not started'}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)] mb-1">End Time</p>
              <p className="text-base text-[var(--text-primary)]">
                {auctionDetails?.endTime ? new Date(auctionDetails.endTime).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AuctionDetailsView;
