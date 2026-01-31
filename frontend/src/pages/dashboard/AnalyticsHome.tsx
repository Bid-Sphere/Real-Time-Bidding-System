import { useEffect, useState } from 'react';
import { useOrganizationStore } from '@/store/useOrganizationStore';
import { useBidStore } from '@/store/useBidStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useAuthStore } from '@/store/authStore';
import { MetricCard } from '@/components/analytics/MetricCard';
import { RecommendedProjects } from '@/components/analytics/RecommendedProjects';
import { MyBidsSummary } from '@/components/analytics/MyBidsSummary';
import { EditBidModal } from '@/components/bids/EditBidModal';
import type { Project, BidSummary, Bid } from '@/types/organization';
import type { BidResponse } from '@/services/biddingApiService';
import { 
  TrendingUp, 
  DollarSign, 
  Briefcase, 
  Target 
} from 'lucide-react';

const AnalyticsHome = () => {
  const { user } = useAuthStore();
  const { profile, fetchProfile } = useOrganizationStore();
  const { bids, fetchMyBids } = useBidStore();
  const { markAsInterested } = useProjectStore();
  
  const [recommendedProjects, setRecommendedProjects] = useState<Project[]>([]);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(false);
  const [showAllBids, setShowAllBids] = useState(false);
  const [editingBid, setEditingBid] = useState<Bid | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Get organization ID from user
  const orgId = user?.id || '';

  useEffect(() => {
    // Fetch all data on mount
    const fetchData = async () => {
      if (!orgId) return;
      
      await Promise.all([
        fetchProfile(orgId),
        fetchMyBids(), // Fetch bids to populate the summary
        fetchRecommendedProjectsData(),
      ]);
    };

    fetchData();
  }, [orgId]);

  const fetchRecommendedProjectsData = async () => {
    setIsLoadingRecommended(true);
    try {
      // TODO: Connect to real API
      // Mock data for now
      const projects: Project[] = [];
      setRecommendedProjects(projects);
    } catch (error) {
      console.error('Failed to fetch recommended projects:', error);
    } finally {
      setIsLoadingRecommended(false);
    }
  };

  const handleViewAllBids = async () => {
    if (!showAllBids && bids.length === 0) {
      await fetchMyBids();
    }
    setShowAllBids(true);
  };

  const handleBidClick = async (projectId: string) => {
    // In a real implementation, this would open a bid submission modal
    console.log('Bid on project:', projectId);
    // For now, just show an alert
    alert('Bid submission modal would open here. This will be implemented in task 7.5');
  };

  const handleInterestClick = async (projectId: string) => {
    try {
      await markAsInterested(projectId, orgId);
      // Refresh recommended projects to show the newly interested project
      await fetchRecommendedProjectsData();
    } catch (error) {
      console.error('Failed to mark project as interested:', error);
    }
  };

  const handleEditBid = (bid: Bid | BidResponse) => {
    // Convert BidResponse to Bid format if needed
    const bidData: Bid = 'organizationId' in bid ? bid : {
      id: bid.id,
      projectId: bid.projectId,
      projectTitle: bid.projectTitle || '',
      organizationId: bid.bidderId,
      proposedPrice: bid.proposedPrice,
      estimatedTimeline: String(bid.estimatedDuration),
      coverLetter: bid.proposal,
      status: bid.status.toLowerCase() as 'pending' | 'shortlisted' | 'accepted' | 'rejected',
      submittedAt: bid.submittedAt,
      updatedAt: bid.updatedAt,
      ranking: bid.ranking
    };
    
    setEditingBid(bidData);
    setIsEditModalOpen(true);
  };

  const handleSaveBid = async (bidId: string, data: Partial<Pick<Bid, 'proposedPrice' | 'estimatedTimeline' | 'coverLetter'>>) => {
    // Convert Bid type to BidResponse parameters
    const proposedPrice = Number(data.proposedPrice) || 0;
    const estimatedDuration = Number(data.estimatedTimeline) || 0;
    const proposal = String(data.coverLetter) || '';
    
    const { updateBid } = useBidStore.getState();
    await updateBid(bidId, proposedPrice, estimatedDuration, proposal);
    
    // Refresh bids after update
    await fetchMyBids();
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingBid(null);
  };

  // Calculate bid summary from actual bids (includes both standard and auction bids)
  const bidSummary: BidSummary = {
    total: bids.length,
    pending: bids.filter(b => b.status === 'PENDING').length,
    accepted: bids.filter(b => b.status === 'ACCEPTED').length,
    shortlisted: 0, // Not tracking shortlisted status yet
    rejected: bids.filter(b => b.status === 'REJECTED').length,
  };

  // Calculate metrics from actual bids data
  const totalBidsSubmitted = bids.length;
  const acceptedBids = bids.filter(b => b.status === 'ACCEPTED' || (b as any).isWinning).length;
  const winRate = totalBidsSubmitted > 0 ? Math.round((acceptedBids / totalBidsSubmitted) * 100) : 0;
  const activeProjects = bids.filter(b => b.status === 'ACCEPTED' || (b as any).isWinning).length;
  const totalEarnings = bids
    .filter(b => b.status === 'ACCEPTED' || (b as any).isWinning)
    .reduce((sum, bid) => sum + bid.proposedPrice, 0);

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Bids Submitted"
          value={totalBidsSubmitted}
          icon={<Target className="w-6 h-6" />}
        />
        <MetricCard
          title="Win Rate"
          value={`${winRate}%`}
          icon={<TrendingUp className="w-6 h-6" />}
        />
        <MetricCard
          title="Active Projects"
          value={activeProjects}
          icon={<Briefcase className="w-6 h-6" />}
        />
        <MetricCard
          title="Total Earnings"
          value={`$${totalEarnings.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6" />}
        />
      </div>

      {/* Recommended Projects */}
      {isLoadingRecommended ? (
        <div className="bg-gradient-to-br from-[rgba(26,26,46,0.6)] to-[rgba(26,26,46,0.4)] backdrop-blur-sm rounded-xl p-8 border border-gray-800">
          <div className="text-center text-gray-400">Loading recommended projects...</div>
        </div>
      ) : (
        <RecommendedProjects
          projects={recommendedProjects}
          organizationIndustry={profile?.industry}
          isVerified={profile?.emailVerified || false}
          onBidClick={handleBidClick}
          onInterestClick={handleInterestClick}
        />
      )}

      {/* Full Width Bids Summary */}
      <MyBidsSummary
        summary={bidSummary}
        bids={showAllBids ? bids : undefined}
        onViewAll={handleViewAllBids}
        onEditBid={handleEditBid}
      />

      {/* Edit Bid Modal */}
      <EditBidModal
        bid={editingBid}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveBid}
      />
    </div>
  );
};


export default AnalyticsHome;
