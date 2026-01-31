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
  ArrowLeft,
  X,
  MapPin,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import auctionApiService from '@/services/auctionApiService';
import projectApiService from '@/services/projectApiService';
import { showErrorToast } from '@/utils/toast';
import { OrganizationLiveBidding } from './OrganizationLiveBidding';
import { useAuthStore } from '@/store/authStore';
import type { Project } from '@/types/project';

interface AuctionListing {
  id: string;
  projectId: string; // Add projectId field
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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loadingProjectDetails, setLoadingProjectDetails] = useState(false);
  
  // Get organization ID from user profile - ensure it's a number
  const organizationId = Number(user?.organizationProfile?.id || user?.id || 1);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setIsLoading(true);
      // Fetch all auctions (active and scheduled) from auction-service
      const response = await auctionApiService.getActiveAuctions(0, 100);
      const auctionListings = await Promise.all(response.content.map(async (auction: any) => {
        // Fetch project details to get budget and client info
        let projectDetails = null;
        try {
          projectDetails = await projectApiService.getProjectById(auction.projectId);
        } catch (error) {
          console.error(`Failed to fetch project details for ${auction.projectId}:`, error);
        }

        return {
          id: auction.auctionId || auction.id,
          projectId: auction.projectId,
          title: auction.projectTitle,
          category: auction.projectCategory,
          description: projectDetails?.description || '',
          clientName: projectDetails?.clientName || 'Unknown Client',
          budget: projectDetails?.budget || 0, // Starting bid from project
          auctionStartTime: auction.startTime,
          auctionEndTime: auction.endTime,
          status: mapAuctionStatus(auction.status),
          currentBids: auction.totalBids || 0,
          currentHighestBid: auction.currentHighestBid,
          currentLowestBid: auction.currentHighestBid,
          viewCount: 0, // Will be fetched separately for LIVE auctions
          requiredSkills: projectDetails?.requiredSkills || [],
          myBid: undefined
        };
      }));
      
      setAuctions(auctionListings);
      
      // Fetch viewer counts for LIVE auctions
      auctionListings.forEach(async (auction) => {
        if (auction.status === 'LIVE') {
          try {
            const response = await fetch(`http://localhost:8080/api/realtime/auctions/${auction.id}/viewers`);
            const data = await response.json();
            setAuctions(prev => prev.map(a => 
              a.id === auction.id ? { ...a, viewCount: data.viewerCount } : a
            ));
          } catch (error) {
            console.error(`Failed to fetch viewer count for auction ${auction.id}:`, error);
          }
        }
      });
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

  const handleViewDetails = async (auction: AuctionListing) => {
    try {
      setLoadingProjectDetails(true);
      setShowDetailsModal(true);
      
      // Fetch project details from project-service using the projectId from auction
      const project = await projectApiService.getProjectById(auction.projectId);
      setSelectedProject(project);
    } catch (error) {
      console.error('Failed to fetch project details:', error);
      showErrorToast('Failed to load project details');
      setShowDetailsModal(false);
    } finally {
      setLoadingProjectDetails(false);
    }
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProject(null);
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

      {/* Project Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Loading State */}
            {loadingProjectDetails && (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-blue)] mx-auto mb-4"></div>
                <p className="text-[var(--text-secondary)]">Loading project details...</p>
              </div>
            )}

            {/* Project Details Content */}
            {!loadingProjectDetails && selectedProject && (
              <>
                {/* Header with close button */}
                <div className="flex items-start justify-between p-6 border-b border-[var(--border-light)]">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                      {selectedProject.title}
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] rounded-full text-sm font-medium">
                        {selectedProject.category}
                      </span>
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium">
                        {selectedProject.biddingType === 'LIVE_AUCTION' ? 'Live Auction' : 'Standard Bidding'}
                      </span>
                      <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-medium">
                        {selectedProject.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseDetailsModal}
                    className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-[var(--text-muted)]" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Key Info Grid - Only show for LIVE/ACTIVE auctions */}
                  {selectedProject.status !== 'DRAFT' && selectedProject.status !== 'OPEN' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-light)]">
                        <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-xs font-medium">Starting Bid</span>
                        </div>
                        <p className="text-xl font-bold text-[var(--text-primary)]">
                          ${selectedProject.budget.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-light)]">
                        <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-xs font-medium">Deadline</span>
                        </div>
                        <p className="text-lg font-bold text-[var(--text-primary)]">
                          {new Date(selectedProject.deadline).toLocaleDateString()}
                        </p>
                        {selectedProject.strictDeadline && (
                          <p className="text-xs text-orange-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Strict
                          </p>
                        )}
                      </div>

                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-light)]">
                        <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2">
                          <Target className="h-4 w-4" />
                          <span className="text-xs font-medium">Total Bids</span>
                        </div>
                        <p className="text-xl font-bold text-[var(--text-primary)]">
                          {selectedProject.bidCount || 0}
                        </p>
                      </div>

                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-light)]">
                        <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2">
                          <Eye className="h-4 w-4" />
                          <span className="text-xs font-medium">Views</span>
                        </div>
                        <p className="text-xl font-bold text-[var(--text-primary)]">
                          {selectedProject.viewCount || 0}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Starting Bid and Deadline for SCHEDULED auctions */}
                  {(selectedProject.status === 'DRAFT' || selectedProject.status === 'OPEN') && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-light)]">
                        <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-xs font-medium">Starting Bid</span>
                        </div>
                        <p className="text-xl font-bold text-[var(--text-primary)]">
                          ${selectedProject.budget.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-light)]">
                        <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-xs font-medium">Deadline</span>
                        </div>
                        <p className="text-lg font-bold text-[var(--text-primary)]">
                          {new Date(selectedProject.deadline).toLocaleDateString()}
                        </p>
                        {selectedProject.strictDeadline && (
                          <p className="text-xs text-orange-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Strict
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Project Description
                    </h4>
                    <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Location and Skills Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Location */}
                    {selectedProject.location && (
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location
                        </h4>
                        <p className="text-[var(--text-secondary)] px-3 py-2 bg-[var(--bg-secondary)] rounded-lg">
                          {selectedProject.location}
                        </p>
                      </div>
                    )}

                    {/* Required Skills */}
                    {selectedProject.requiredSkills && selectedProject.requiredSkills.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Required Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.requiredSkills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] text-sm rounded-md border border-[var(--accent-blue)]/20"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Auction Times (if applicable) */}
                  {selectedProject.biddingType === 'LIVE_AUCTION' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Auction Start Time - get from auction data */}
                      {(() => {
                        const auction = auctions.find(a => a.projectId === selectedProject.id);
                        return auction?.auctionStartTime ? (
                          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-400 mb-1">
                              <Calendar className="h-4 w-4" />
                              <span className="text-sm font-semibold">Auction Starts</span>
                            </div>
                            <p className="text-[var(--text-primary)] font-medium">
                              {new Date(auction.auctionStartTime).toLocaleString()}
                            </p>
                          </div>
                        ) : null;
                      })()}
                      
                      {/* Auction End Time */}
                      {selectedProject.auctionEndTime && (
                        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                          <div className="flex items-center gap-2 text-orange-400 mb-1">
                            <Gavel className="h-4 w-4" />
                            <span className="text-sm font-semibold">Auction Ends</span>
                          </div>
                          <p className="text-[var(--text-primary)] font-medium">
                            {new Date(selectedProject.auctionEndTime).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="flex gap-3 p-6 border-t border-[var(--border-light)] bg-[var(--bg-secondary)]">
                  <Button
                    variant="outline"
                    onClick={handleCloseDetailsModal}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  
                  {/* Show different actions based on auction status */}
                  {(() => {
                    const auction = auctions.find(a => a.projectId === selectedProject.id);
                    const auctionStatus = auction?.status;
                    
                    if (auctionStatus === 'SCHEDULED') {
                      return (
                        <Button
                          variant="outline"
                          onClick={handleCloseDetailsModal}
                          className="flex-1"
                        >
                          <Calendar className="h-4 w-4" />
                          Set Reminder
                        </Button>
                      );
                    } else if (auctionStatus === 'LIVE') {
                      return (
                        <Button
                          variant="primary"
                          onClick={() => {
                            handleCloseDetailsModal();
                            if (auction) handleEnterAuction(auction);
                          }}
                          className="flex-1"
                        >
                          <Gavel className="h-4 w-4" />
                          Enter Auction
                        </Button>
                      );
                    } else {
                      return (
                        <Button
                          variant="outline"
                          onClick={handleCloseDetailsModal}
                          className="flex-1"
                          disabled
                        >
                          Auction Ended
                        </Button>
                      );
                    }
                  })()}
                </div>
              </>
            )}
          </Card>
        </div>
      )}

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
                    <p className="text-xs text-[var(--text-muted)] mb-1">Starting Bid</p>
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
                        {auction.currentLowestBid.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {auction.myBid && (
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1">My Bid</p>
                      <p className="text-lg font-semibold text-blue-400 flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {auction.myBid.amount.toLocaleString()}
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
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="h-9"
                    onClick={() => handleViewDetails(auction)}
                  >
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
