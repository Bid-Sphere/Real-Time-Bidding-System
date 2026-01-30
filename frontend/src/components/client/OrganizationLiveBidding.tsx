import { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import type { Bid, LiveAuctionState } from '@/types/auction';
import apiClient from '@/services/api';
import { showSuccessToast, showErrorToast } from '@/utils/toast';
import { 
  TrendingDown, 
  Clock, 
  DollarSign, 
  Building2, 
  Send,
  Loader2,
  AlertCircle,
  Info,
  Target
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ConnectionStatus from '@/components/shared/ConnectionStatus';
import type { ConnectionState } from '@/components/shared/ConnectionStatus';

interface OrganizationLiveBiddingProps {
  auctionId: number;
  organizationId: number; // Reserved for future use (e.g., filtering own bids)
}

export const OrganizationLiveBidding: React.FC<OrganizationLiveBiddingProps> = ({ 
  auctionId, 
  organizationId: _organizationId // Prefix with underscore to indicate intentionally unused
}) => {
  // State management
  const [currentLowestBid, setCurrentLowestBid] = useState<Bid | null>(null);
  const [recentBids, setRecentBids] = useState<Bid[]>([]);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [minimumNextBid, setMinimumNextBid] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionState>('connecting');

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

    // Event handler: ReceiveBid - Update bid list and current lowest
    newConnection.on('ReceiveBid', (bid: Bid) => {
      console.log('Received new bid:', bid);
      setRecentBids(prev => {
        // Add new bid to the top and keep last 5 bids
        const updatedBids = [bid, ...prev];
        return updatedBids.slice(0, 5);
      });
      
      // Update current lowest if this is the lowest bid
      if (bid.isCurrentLowest) {
        setCurrentLowestBid(bid);
      }
    });

    // Event handler: ReceiveBidAccepted - Update current lowest
    newConnection.on('ReceiveBidAccepted', (bid: Bid) => {
      console.log('Bid accepted:', bid);
      setCurrentLowestBid(bid);
    });

    // Event handler: ReceiveLiveState - Initial state for late joiners
    newConnection.on('ReceiveLiveState', (state: LiveAuctionState) => {
      console.log('Received live state:', state);
      setCurrentLowestBid(state.currentAcceptedBid);
      setRecentBids(state.recentBids);
      setMinimumNextBid(state.minimumNextBid);
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

  // Handler: Submit bid
  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Parse and validate bid amount on client side
    const amount = parseFloat(bidAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid positive bid amount');
      return;
    }
    
    if (minimumNextBid > 0 && amount >= minimumNextBid) {
      setError(`Bid must be below $${minimumNextBid.toLocaleString()}`);
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Call REST API to submit the bid
      await apiClient.post(`/api/auctions/${auctionId}/bids`, { amount });
      
      // Clear form on successful submission
      setBidAmount('');
      setError('');
      showSuccessToast('Bid submitted successfully');
    } catch (error: any) {
      console.error('Error submitting bid:', error);
      // Handle API errors and display error messages
      const errorMessage = error.response?.data?.message || 'Failed to submit bid';
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      {/* Connection Status Bar */}
      <Card className="p-4">
        <ConnectionStatus status={connectionStatus} />
      </Card>

      {/* Current State Section */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Target className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              Current Lowest Bid
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Beat this bid to take the lead
            </p>
          </div>
        </div>

        {currentLowestBid ? (
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-light)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-[var(--text-muted)]" />
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Organization</p>
                  <p className="text-base font-semibold text-[var(--text-primary)]">
                    {currentLowestBid.organizationName}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-[var(--text-muted)]" />
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Bid Amount</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${currentLowestBid.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-light)]">
            <TrendingDown className="h-12 w-12 text-[var(--text-muted)] mx-auto mb-3 opacity-50" />
            <p className="text-[var(--text-secondary)]">
              No bids yet. Be the first to bid!
            </p>
          </div>
        )}
      </Card>

      {/* Bid Submission Form */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-green-500/20 rounded-lg">
            <Send className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              Submit Your Bid
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Enter your competitive bid amount
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmitBid} className="space-y-4">
          <div>
            <label htmlFor="bidAmount" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Bid Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
              <input
                id="bidAmount"
                type="number"
                step="0.01"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={minimumNextBid > 0 ? `Must be below ${minimumNextBid.toLocaleString()}` : 'Enter your bid amount'}
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            {/* Show minimum decrement requirement hint */}
            <div className="mt-2 flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-400">
                <p className="font-medium mb-1">Minimum Decrement Requirement</p>
                <p className="text-blue-300">
                  Your bid must be at least 5% lower or $100 less than the current lowest bid
                </p>
              </div>
            </div>
          </div>

          {/* Display error messages */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || !bidAmount}
            className="w-full h-12"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Submitting Bid...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Submit Bid
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Recent Bids Section */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <Clock className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              Recent Bids
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Last 5 bids in this auction ({recentBids.length} shown)
            </p>
          </div>
        </div>

        {recentBids.length === 0 ? (
          <div className="text-center py-8 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-light)]">
            <Clock className="h-12 w-12 text-[var(--text-muted)] mx-auto mb-3 opacity-50" />
            <p className="text-[var(--text-secondary)]">
              No recent bids to display
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBids.map((bid) => (
              <div
                key={bid.id}
                className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-light)] hover:border-[var(--accent-blue)]/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-[var(--text-muted)]" />
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">
                        {bid.organizationName}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(bid.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {bid.amount.toLocaleString()}
                    </p>
                    {bid.status === 'ACCEPTED' && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                        Accepted
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default OrganizationLiveBidding;
