import { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import type { Bid, LiveAuctionState } from '@/types/auction';
import apiClient from '@/services/api';
import auctionApiService from '@/services/auctionApiService';
import { showSuccessToast, showErrorToast } from '@/utils/toast';
import { 
  Trophy, 
  Clock, 
  DollarSign, 
  Building2, 
  CheckCircle, 
  XCircle, 
  Loader2,
  AlertCircle,
  TrendingDown,
  StopCircle
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ConnectionStatus from '@/components/shared/ConnectionStatus';
import type { ConnectionState } from '@/components/shared/ConnectionStatus';

interface ClientLiveMonitorProps {
  auctionId: number;
  onAuctionEnded?: () => void;
}

export const ClientLiveMonitor: React.FC<ClientLiveMonitorProps> = ({ auctionId, onAuctionEnded }) => {
  // State management
  const [bids, setBids] = useState<Bid[]>([]);
  const [currentAcceptedBid, setCurrentAcceptedBid] = useState<Bid | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [processingBidId, setProcessingBidId] = useState<number | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionState>('connecting');
  const [showEndAuctionDialog, setShowEndAuctionDialog] = useState(false);
  const [isEndingAuction, setIsEndingAuction] = useState(false);

  // Handler: Accept a bid
  const handleAcceptBid = async (bidId: number) => {
    try {
      setProcessingBidId(bidId);
      
      // Call REST API to accept the bid
      await apiClient.put(`/api/auctions/${auctionId}/bids/${bidId}/accept`);
      
      showSuccessToast('Bid accepted successfully');
    } catch (error: any) {
      console.error('Error accepting bid:', error);
      const errorMessage = error.response?.data?.message || 'Failed to accept bid';
      showErrorToast(errorMessage);
    } finally {
      setProcessingBidId(null);
    }
  };

  // Handler: Reject a bid
  const handleRejectBid = async (bidId: number) => {
    try {
      setProcessingBidId(bidId);
      
      // Call REST API to reject the bid
      await apiClient.put(`/api/auctions/${auctionId}/bids/${bidId}/reject`);
      
      showSuccessToast('Bid rejected');
    } catch (error: any) {
      console.error('Error rejecting bid:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reject bid';
      showErrorToast(errorMessage);
    } finally {
      setProcessingBidId(null);
    }
  };

  // Handler: End auction
  const handleEndAuction = async () => {
    try {
      setIsEndingAuction(true);
      
      // Call REST API to end the auction
      await auctionApiService.endAuction(auctionId);
      
      showSuccessToast('Auction ended successfully');
      setShowEndAuctionDialog(false);
      
      // Notify parent component if callback provided
      if (onAuctionEnded) {
        onAuctionEnded();
      }
    } catch (error: any) {
      console.error('Error ending auction:', error);
      const errorMessage = error.response?.data?.message || 'Failed to end auction';
      showErrorToast(errorMessage);
    } finally {
      setIsEndingAuction(false);
    }
  };

  // Component lifecycle - SignalR connection setup
  useEffect(() => {
    // Get gateway URL - SignalR hub is accessible through NGINX gateway
    const gatewayUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    
    // Get auth token for SignalR connection
    const authToken = localStorage.getItem('auth_token');
    
    // Initialize SignalR connection with automatic reconnection
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${gatewayUrl}/hub/auctionHub`, {
        accessTokenFactory: () => authToken || ''
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
          const delay = Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
          return delay;
        }
      })
      .build();

    // Connection state change handlers
    newConnection.onreconnecting(() => {
      console.log('SignalR reconnecting...');
      setConnectionStatus('reconnecting');
    });

    newConnection.onreconnected(() => {
      console.log('SignalR reconnected');
      setConnectionStatus('connected');
      showSuccessToast('Reconnected to live auction');
    });

    newConnection.onclose(() => {
      console.log('SignalR connection closed');
      setConnectionStatus('disconnected');
    });

    // Event handler: ReceiveBid - Update bid list when new bid arrives
    newConnection.on('ReceiveBid', (bid: Bid) => {
      console.log('Received new bid:', bid);
      setBids(prev => {
        // Add new bid to the top and keep last 20 bids
        const updatedBids = [bid, ...prev];
        return updatedBids.slice(0, 20);
      });
    });

    // Event handler: ReceiveBidAccepted - Update current winner
    newConnection.on('ReceiveBidAccepted', (bid: Bid) => {
      console.log('Bid accepted:', bid);
      setCurrentAcceptedBid(bid);
      // Update the bid status in the list
      setBids(prev => prev.map(b => 
        b.id === bid.id ? { ...b, status: 'ACCEPTED' as const } : b
      ));
    });

    // Event handler: ReceiveBidRejected - Update bid status
    newConnection.on('ReceiveBidRejected', (bid: Bid) => {
      console.log('Bid rejected:', bid);
      // Update the bid status in the list
      setBids(prev => prev.map(b => 
        b.id === bid.id ? { ...b, status: 'REJECTED' as const } : b
      ));
    });

    // Event handler: ReceiveLiveState - Initial state for late joiners
    newConnection.on('ReceiveLiveState', (state: LiveAuctionState) => {
      console.log('Received live state:', state);
      setCurrentAcceptedBid(state.currentAcceptedBid);
      setBids(state.recentBids);
    });

    // Event handler: ReceiveAuctionStatusChange - Handle auction status changes
    newConnection.on('ReceiveAuctionStatusChange', (statusChange: any) => {
      console.log('Auction status changed:', statusChange);
      // Could update UI to reflect status change
    });

    // Start connection and join auction
    const startConnection = async () => {
      try {
        setIsConnecting(true);
        setConnectionError(null);
        setConnectionStatus('connecting');
        
        await newConnection.start();
        console.log('SignalR connected successfully');
        setConnectionStatus('connected');
        
        // Join the auction room
        await newConnection.invoke('JoinAuction', auctionId);
        console.log(`Joined auction ${auctionId}`);
        
        setIsConnecting(false);
      } catch (error) {
        console.error('SignalR connection error:', error);
        setConnectionError('Failed to connect to live auction');
        setConnectionStatus('disconnected');
        setIsConnecting(false);
        showErrorToast('Failed to connect to live auction');
      }
    };

    startConnection();

    // Cleanup on unmount
    return () => {
      if (newConnection) {
        newConnection.invoke('LeaveAuction', auctionId)
          .then(() => {
            console.log(`Left auction ${auctionId}`);
            return newConnection.stop();
          })
          .then(() => {
            console.log('SignalR connection stopped');
          })
          .catch(error => {
            console.error('Error during cleanup:', error);
          });
      }
    };
  }, [auctionId]);

  // Utility: Format timestamp to readable time
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  // Utility: Get status badge styling
  const getStatusBadgeClass = (status: Bid['status']): string => {
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

  // Utility: Get status icon
  const getStatusIcon = (status: Bid['status']) => {
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

  // Show connection error state
  if (connectionError) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
          Connection Error
        </h3>
        <p className="text-[var(--text-secondary)] mb-4">{connectionError}</p>
        <Button 
          variant="primary" 
          onClick={() => window.location.reload()}
        >
          Retry Connection
        </Button>
      </Card>
    );
  }

  // Show connecting state
  if (isConnecting) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="h-12 w-12 text-[var(--accent-blue)] mx-auto mb-4 animate-spin" />
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
          Connecting to Live Auction
        </h3>
        <p className="text-[var(--text-secondary)]">
          Establishing real-time connection...
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status and Actions Bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <ConnectionStatus status={connectionStatus} />
          
          <Button
            variant="outline"
            onClick={() => setShowEndAuctionDialog(true)}
            className="h-9 text-red-400 border-red-500/30 hover:bg-red-500/10"
          >
            <StopCircle className="h-4 w-4" />
            End Auction
          </Button>
        </div>
      </Card>

      {/* End Auction Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showEndAuctionDialog}
        onClose={() => setShowEndAuctionDialog(false)}
        onConfirm={handleEndAuction}
        title="End Auction"
        message="Are you sure you want to end this auction? This action cannot be undone. The current accepted bid will be declared as the winner."
        confirmText="End Auction"
        cancelText="Cancel"
        variant="danger"
        isLoading={isEndingAuction}
      />

      {/* Current Winner Section */}
      {currentAcceptedBid && (
        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/30">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Trophy className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  Current Winner
                  <span className="px-2 py-1 rounded-full text-xs font-medium border bg-green-500/20 text-green-400 border-green-500/30">
                    ACCEPTED
                  </span>
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  This bid is currently accepted
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-[var(--text-muted)]" />
              <div>
                <p className="text-xs text-[var(--text-muted)]">Organization</p>
                <p className="text-base font-semibold text-[var(--text-primary)]">
                  {currentAcceptedBid.organizationName}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-[var(--text-muted)]" />
              <div>
                <p className="text-xs text-[var(--text-muted)]">Bid Amount</p>
                <p className="text-2xl font-bold text-green-400">
                  ${currentAcceptedBid.amount.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-[var(--text-muted)]" />
              <div>
                <p className="text-xs text-[var(--text-muted)]">Accepted</p>
                <p className="text-base font-semibold text-[var(--text-primary)]">
                  {formatTime(currentAcceptedBid.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Bid Stream Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingDown className="h-6 w-6 text-[var(--accent-blue)]" />
            <div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                Incoming Bids
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Real-time bid stream ({bids.length} bids)
              </p>
            </div>
          </div>
        </div>

        {bids.length === 0 ? (
          <div className="text-center py-12">
            <TrendingDown className="h-16 w-16 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              No Bids Yet
            </h4>
            <p className="text-[var(--text-secondary)]">
              Waiting for organizations to submit their bids...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bids.map((bid) => (
              <div
                key={bid.id}
                className={`p-4 rounded-lg border transition-all ${
                  bid.status === 'ACCEPTED'
                    ? 'bg-green-500/10 border-green-500/30'
                    : bid.status === 'REJECTED'
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-[var(--bg-secondary)] border-[var(--border-light)] hover:border-[var(--accent-blue)]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="h-5 w-5 text-[var(--text-muted)]" />
                      <span className="font-semibold text-[var(--text-primary)]">
                        {bid.organizationName}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusBadgeClass(bid.status)}`}>
                        {getStatusIcon(bid.status)}
                        {bid.status}
                      </span>
                      {bid.isCurrentLowest && bid.status === 'PENDING' && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          Lowest Bid
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-[var(--text-muted)]" />
                        <span className="text-lg font-bold text-[var(--text-primary)]">
                          ${bid.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[var(--text-muted)]">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(bid.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons for PENDING bids */}
                  {bid.status === 'PENDING' && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAcceptBid(bid.id)}
                        disabled={processingBidId === bid.id}
                        className="h-9"
                      >
                        {processingBidId === bid.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectBid(bid.id)}
                        disabled={processingBidId === bid.id}
                        className="h-9"
                      >
                        {processingBidId === bid.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ClientLiveMonitor;
