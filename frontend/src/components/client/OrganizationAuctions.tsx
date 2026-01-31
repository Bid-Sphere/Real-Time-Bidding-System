import { useState, useEffect } from 'react';
import { 
  Gavel, 
  Clock, 
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  Search,
  Trophy,
  Target,
  Zap,
  ArrowLeft
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import auctionApiService from '@/services/auctionApiService';
import { showErrorToast } from '@/utils/toast';
import { OrganizationLiveBidding } from './OrganizationLiveBidding';
import { useAuthStore } from '@/store/authStore';

interface AuctionListing {
  id: string;
  title: string;
  category: string;
  description: string;
  clientName: string;
  budget: number;
  auctionStartTime?: string;
  auctionEndTime: string;
  status: 'SCHEDULED' | 'LIVE' | 'ENDED';
  currentBids: number;
  currentHighestBid?: number;
  currentLowestBid?: number;
  viewCount: number;
  requiredSkills: string[];
  myBid?: {
    amount: number;
    rank: number;
    isWinning: boolean;
  };
}

type AuctionFilter = 'all' | 'upcoming' | 'live' | 'participated';

export default function OrganizationAuctions() {
  const { user } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState<AuctionFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [auctions, setAuctions] = useState<AuctionListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAuction, setSelectedAuction] = useState<AuctionListing | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'bidding'>('list');
  
  // Get organization ID from user profile - ensure it's a number
  const organizationId = Number(user?.organizationProfile?.id || user?.id || 1);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setIsLoading(true);
      // Fetch active auctions from auction-service
      const response = await auctionApiService.getActiveAuctions(0, 100);
      const auctionListings = response.content.map((auction: any) => ({
        id: auction.auctionId || auction.id,
        title: auction.projectTitle,
        category: auction.projectCategory,
        description: '', // Not available in auction response
        clientName: 'Client', // Not available in auction response
        budget: 0, // Not available in auction response
        auctionStartTime: auction.startTime,
        auctionEndTime: auction.endTime,
        status: mapAuctionStatus(auction.status),
        currentBids: auction.totalBids || 0,
        currentHighestBid: auction.currentHighestBid,
        currentLowestBid: auction.currentHighestBid, // Using highest as lowest for now
        viewCount: 0,
        requiredSkills: [],
        myBid: undefined // TODO: Fetch user's bid for this auction
      }));
      setAuctions(auctionListings);
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
      showErrorToast('Failed to fetch auctions');
    } finally {
      setIsLoading(false);
    }
  };

  const mapAuctionStatus = (status: string): 'SCHEDULED' | 'LIVE' | 'ENDED' => {
    // Map auction-service status to component status
    switch (status) {
      case 'ACTIVE':
        return 'LIVE';
      case 'CLOSED':
      case 'ENDED':
      case 'CANCELLED':
        return 'ENDED';
      case 'SCHEDULED':
      default:
        return 'SCHEDULED';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'LIVE':
        return 'bg-green-500/20 text-green-400 border-green-500/30 animate-pulse';
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
      case 'LIVE':
        return <Zap className="h-4 w-4" />;
      case 'ENDED':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatTimeRemaining = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  const formatStartTime = (startTime: string | undefined) => {
    if (!startTime) return 'Not scheduled';
    
    const now = new Date();
    const start = new Date(startTime);
    const diff = start.getTime() - now.getTime();
    
    if (diff <= 0) return 'Started';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `Starts in ${days}d ${hours % 24}h`;
    }
    
    return `Starts in ${hours}h`;
  };

  const filteredAuctions = auctions.filter(auction => {
    let matchesFilter = true;
    
    if (activeFilter === 'upcoming') {
      matchesFilter = auction.status === 'SCHEDULED';
    } else if (activeFilter === 'live') {
      matchesFilter = auction.status === 'LIVE';
    } else if (activeFilter === 'participated') {
      matchesFilter = !!auction.myBid;
    }
    
    const matchesSearch = auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         auction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         auction.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const liveAuctionsCount = auctions.filter(a => a.status === 'LIVE').length;
  const upcomingAuctionsCount = auctions.filter(a => a.status === 'SCHEDULED').length;
  const participatedCount = auctions.filter(a => a.myBid).length;
  const winningBidsCount = auctions.filter(a => a.myBid?.isWinning).length;

  const handleEnterAuction = (auction: AuctionListing) => {
    // Navigate to live bidding view
    setSelectedAuction(auction);
    setViewMode('bidding');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedAuction(null);
  };

  // Show live bidding view when an auction is selected and in bidding mode
  if (viewMode === 'bidding' && selectedAuction) {
    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBackToList}
            className="h-10"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Auctions
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
              <Gavel className="h-8 w-8 text-[var(--accent-blue)]" />
              {selectedAuction.title}
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">
              Live Bidding - {selectedAuction.clientName}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 ${getStatusColor(selectedAuction.status)}`}>
            {getStatusIcon(selectedAuction.status)}
            {selectedAuction.status}
          </span>
        </div>

        {/* Conditional rendering based on auction status */}
        {selectedAuction.status === 'LIVE' && (
          <OrganizationLiveBidding 
            auctionId={selectedAuction.id} 
            organizationId={organizationId}
          />
        )}

        {selectedAuction.status === 'SCHEDULED' && (
          <Card className="p-8 text-center">
            <Calendar className="h-16 w-16 text-[var(--text-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Auction Not Started Yet
            </h3>
            <p className="text-[var(--text-secondary)]">
              This auction is scheduled to start {formatStartTime(selectedAuction.auctionStartTime)}
            </p>
          </Card>
        )}

        {selectedAuction.status === 'ENDED' && (
          <Card className="p-8 text-center">
            <Clock className="h-16 w-16 text-[var(--text-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Auction Ended
            </h3>
            <p className="text-[var(--text-secondary)]">
              This auction has concluded. Check back for results.
            </p>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
            <Gavel className="h-8 w-8 text-[var(--accent-blue)]" />
            Live Auctions
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Browse and participate in live project auctions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Live Auctions</p>
              <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                {liveAuctionsCount}
              </p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Zap className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Upcoming</p>
              <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                {upcomingAuctionsCount}
              </p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Participated</p>
              <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                {participatedCount}
              </p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Target className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Winning Bids</p>
              <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                {winningBidsCount}
              </p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Trophy className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search auctions by title, category, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={activeFilter === 'all' ? 'primary' : 'outline'}
              onClick={() => setActiveFilter('all')}
              className="h-9"
            >
              All
            </Button>
            <Button
              variant={activeFilter === 'upcoming' ? 'primary' : 'outline'}
              onClick={() => setActiveFilter('upcoming')}
              className="h-9"
            >
              <Calendar className="h-4 w-4" />
              Upcoming
            </Button>
            <Button
              variant={activeFilter === 'live' ? 'primary' : 'outline'}
              onClick={() => setActiveFilter('live')}
              className="h-9"
            >
              <Zap className="h-4 w-4" />
              Live Now
            </Button>
            <Button
              variant={activeFilter === 'participated' ? 'primary' : 'outline'}
              onClick={() => setActiveFilter('participated')}
              className="h-9"
            >
              <Target className="h-4 w-4" />
              My Bids
            </Button>
          </div>
        </div>
      </Card>

      {/* Auctions List */}
      {isLoading ? (
        <Card className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-blue)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading auctions...</p>
        </Card>
      ) : filteredAuctions.length === 0 ? (
        <Card className="p-12 text-center">
          <Gavel className="h-16 w-16 text-[var(--text-muted)] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            No Auctions Found
          </h3>
          <p className="text-[var(--text-secondary)]">
            {searchQuery 
              ? 'No auctions match your search criteria'
              : 'No auctions available at the moment. Check back soon!'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAuctions.map((auction) => (
            <Card key={auction.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                      {auction.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(auction.status)}`}>
                      {getStatusIcon(auction.status)}
                      {auction.status}
                    </span>
                    {auction.myBid?.isWinning && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        Winning
                      </span>
                    )}
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm mb-3">
                    {auction.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] mb-3">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Client: {auction.clientName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {auction.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {auction.currentBids} bids
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {auction.viewCount} views
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {auction.requiredSkills.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] text-xs rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                    {auction.requiredSkills.length > 5 && (
                      <span className="px-2 py-1 bg-[var(--bg-secondary)] text-[var(--text-muted)] text-xs rounded-md">
                        +{auction.requiredSkills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--border-light)]">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">Budget</p>
                    <p className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {auction.budget.toLocaleString()}
                    </p>
                  </div>
                  
                  {auction.currentLowestBid && (
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1">Current Lowest</p>
                      <p className="text-lg font-semibold text-green-400 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        ${auction.currentLowestBid.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {auction.myBid && (
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1">My Bid</p>
                      <p className="text-lg font-semibold text-blue-400 flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        ${auction.myBid.amount.toLocaleString()}
                        <span className="text-xs text-[var(--text-muted)]">
                          (Rank #{auction.myBid.rank})
                        </span>
                      </p>
                    </div>
                  )}

                  {auction.status === 'LIVE' && (
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1">Time Remaining</p>
                      <p className="text-lg font-semibold text-orange-400 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTimeRemaining(auction.auctionEndTime)}
                      </p>
                    </div>
                  )}

                  {auction.status === 'SCHEDULED' && (
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1">Auction Start</p>
                      <p className="text-lg font-semibold text-blue-400 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatStartTime(auction.auctionStartTime)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="h-9">
                    View Details
                  </Button>
                  {auction.status === 'LIVE' && !auction.myBid && (
                    <Button 
                      variant="primary" 
                      className="h-9"
                      onClick={() => handleEnterAuction(auction)}
                    >
                      <Gavel className="h-4 w-4" />
                      Enter Auction
                    </Button>
                  )}
                  {auction.status === 'LIVE' && auction.myBid && (
                    <Button 
                      variant="primary" 
                      className="h-9"
                      onClick={() => handleEnterAuction(auction)}
                    >
                      <Eye className="h-4 w-4" />
                      Monitor Auction
                    </Button>
                  )}
                  {auction.status === 'SCHEDULED' && (
                    <Button variant="outline" className="h-9">
                      <Calendar className="h-4 w-4" />
                      Set Reminder
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
