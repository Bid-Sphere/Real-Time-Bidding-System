import { useState } from 'react';
import { Play } from 'lucide-react';
import Button from '@/components/ui/Button';
import auctionApiService from '@/services/auctionApiService';
import { showSuccessToast, showErrorToast } from '@/utils/toast';
import type { AuctionStatus } from '@/types/auction';

interface GoLiveButtonProps {
  auctionId: number;
  currentStatus: AuctionStatus;
  onStatusChange: (newStatus: AuctionStatus) => void;
}

/**
 * GoLiveButton Component
 * 
 * Allows clients to manually start a scheduled auction by clicking "Go Live".
 * Only renders when the auction status is SCHEDULED.
 * 
 * Requirements: 1.1, 1.3
 */
export const GoLiveButton: React.FC<GoLiveButtonProps> = ({ 
  auctionId, 
  currentStatus,
  onStatusChange 
}) => {
  const [loading, setLoading] = useState(false);
  
  const handleGoLive = async () => {
    setLoading(true);
    try {
      // Call the auction service API to transition auction to LIVE status
      const updatedAuction = await auctionApiService.goLive(auctionId);
      
      // Show success message
      showSuccessToast('Auction is now live!');
      
      // Notify parent component of status change
      onStatusChange(updatedAuction.status);
    } catch (err: any) {
      console.error('Failed to start auction:', err);
      
      // Show error message
      const errorMessage = err.response?.data?.message || 'Failed to start auction. Please try again.';
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Only render button when status is SCHEDULED
  if (currentStatus !== 'SCHEDULED') {
    return null;
  }
  
  return (
    <Button 
      variant="primary" 
      className="h-9"
      onClick={handleGoLive}
      disabled={loading}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Starting...
        </>
      ) : (
        <>
          <Play className="h-4 w-4" />
          Go Live
        </>
      )}
    </Button>
  );
};

export default GoLiveButton;
