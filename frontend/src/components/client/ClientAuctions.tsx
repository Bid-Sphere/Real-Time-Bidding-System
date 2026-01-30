import { useState, useEffect } from 'react';
import { 
  Gavel, 
  Clock, 
  Play, 
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  Search,
  Plus
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { projectApiService } from '@/services/projectApiService';
import { showErrorToast } from '@/utils/toast';

interface AuctionProject {
  id: string;
  title: string;
  category: string;
  description: string;
  budget: number;
  auctionStartTime?: string;
  auctionEndTime: string;
  status: 'SCHEDULED' | 'LIVE' | 'ENDED';
  currentBids: number;
  currentHighestBid?: number;
  viewCount: number;
  createdAt: string;
  biddingType: string;
}

type AuctionFilter = 'all' | 'scheduled' | 'live' | 'ended';

export default function ClientAuctions() {
  const [activeFilter, setActiveFilter] = useState<AuctionFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [auctions, setAuctions] = useState<AuctionProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setIsLoading(true);
      // Fetch projects where biddingType is LIVE_AUCTION
      const response = await projectApiService.getMyProjects();
      const auctionProjects = response.projects
        .filter((project: any) => project.biddingType === 'LIVE_AUCTION')
        .map((project: any) => ({
          id: project.id,
          title: project.title,
          category: project.category,
          description: project.description,
          budget: project.budget,
          auctionStartTime: project.auctionStartTime,
          auctionEndTime: project.auctionEndTime,
          status: determineAuctionStatus(project),
          currentBids: project.bidCount || 0,
          currentHighestBid: project.highestBid,
          viewCount: project.viewCount || 0,
          createdAt: project.createdAt,
          biddingType: project.biddingType
        }));
      setAuctions(auctionProjects);
    } catch (error) {
      showErrorToast('Failed to fetch auctions');
    } finally {
      setIsLoading(false);
    }
  };

  const determineAuctionStatus = (project: any): 'SCHEDULED' | 'LIVE' | 'ENDED' => {
    const now = new Date();
    const endTime = new Date(project.auctionEndTime);
    
    // Check if auction has ended
    if (now > endTime) {
      return 'ENDED';
    }
    
    // Check if auction is live (project status is ACCEPTING_BIDS or IN_DISCUSSION)
    if (project.status === 'ACCEPTING_BIDS' || project.status === 'IN_DISCUSSION') {
      return 'LIVE';
    }
    
    // Otherwise it's scheduled
    return 'SCHEDULED';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'LIVE':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
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
        return <Play className="h-4 w-4" />;
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
      return `${days}d ${hours % 24}h remaining`;
    }
    
    return `${hours}h ${minutes}m remaining`;
  };

  const handleStartAuction = async (auctionId: string) => {
    // TODO: Implement start auction logic - update project status to ACCEPTING_BIDS
    console.log('Starting auction:', auctionId);
    // This will call the auction service to create an auction
  };

  const handleJoinAuction = (auctionId: string) => {
    // TODO: Navigate to live auction room
    console.log('Joining auction:', auctionId);
  };

  const filteredAuctions = auctions.filter(auction => {
    const matchesFilter = activeFilter === 'all' || auction.status.toLowerCase() === activeFilter;
    const matchesSearch = auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         auction.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
            <Gavel className="h-8 w-8 text-[var(--accent-blue)]" />
            My Auctions
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Manage your live auction projects
          </p>
        </div>
        <Button variant="primary" size="md" className="h-10">
          <Plus className="h-5 w-5" />
          Create Auction Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Total Auctions</p>
              <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                {auctions.length}
              </p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Gavel className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Live Auctions</p>
              <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                {auctions.filter(a => a.status === 'LIVE').length}
              </p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Play className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Total Bids</p>
              <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                {auctions.reduce((sum, a) => sum + a.currentBids, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Avg. Bid Value</p>
              <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                ${auctions.length > 0 
                  ? Math.round(auctions.reduce((sum, a) => sum + (a.currentHighestBid || 0), 0) / auctions.length).toLocaleString()
                  : 0}
              </p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-400" />
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
              placeholder="Search auctions..."
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
              variant={activeFilter === 'scheduled' ? 'primary' : 'outline'}
              onClick={() => setActiveFilter('scheduled')}
              className="h-9"
            >
              <Calendar className="h-4 w-4" />
              Scheduled
            </Button>
            <Button
              variant={activeFilter === 'live' ? 'primary' : 'outline'}
              onClick={() => setActiveFilter('live')}
              className="h-9"
            >
              <Play className="h-4 w-4" />
              Live
            </Button>
            <Button
              variant={activeFilter === 'ended' ? 'primary' : 'outline'}
              onClick={() => setActiveFilter('ended')}
              className="h-9"
            >
              <Clock className="h-4 w-4" />
              Ended
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
          <p className="text-[var(--text-secondary)] mb-6">
            {searchQuery 
              ? 'No auctions match your search criteria'
              : 'Create your first auction project to get started'}
          </p>
          <Button variant="primary" className="h-10">
            <Plus className="h-5 w-5" />
            Create Auction Project
          </Button>
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
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm mb-3">
                    {auction.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Category: {auction.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {auction.currentBids} bids
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {auction.viewCount} views
                    </span>
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
                  {auction.currentHighestBid && (
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1">Current Highest Bid</p>
                      <p className="text-lg font-semibold text-green-400 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        ${auction.currentHighestBid.toLocaleString()}
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
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="h-9">
                    View Details
                  </Button>
                  {auction.status === 'SCHEDULED' && (
                    <Button 
                      variant="primary" 
                      className="h-9"
                      onClick={() => handleStartAuction(auction.id)}
                    >
                      <Play className="h-4 w-4" />
                      Start Auction
                    </Button>
                  )}
                  {auction.status === 'LIVE' && (
                    <Button 
                      variant="primary" 
                      className="h-9"
                      onClick={() => handleJoinAuction(auction.id)}
                    >
                      <Eye className="h-4 w-4" />
                      Monitor Live
                    </Button>
                  )}
                  {auction.status === 'ENDED' && (
                    <Button variant="primary" className="h-9">
                      View Results
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
