import { useState, useEffect } from 'react';
import { Search, Users, DollarSign, Calendar, Clock, Eye, Check, X } from 'lucide-react';
import { DashboardHeader } from '@/components/client';
import { useClientProjectStore } from '../../store/useClientProjectStore';
import { useBidStore } from '../../store/useBidStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { showSuccessToast, showErrorToast, formatErrorMessage } from '@/utils/toast';
import { projectApiService } from '@/services/projectApiService';
import type { BidResponse } from '@/services/biddingApiService';

export default function ClientBids() {
  const { projects, fetchMyProjects } = useClientProjectStore();
  const { fetchBidsForProject, acceptBid, rejectBid } = useBidStore();
  
  const [allBids, setAllBids] = useState<(BidResponse & { projectTitle: string })[]>([]);
  const [filteredBids, setFilteredBids] = useState<(BidResponse & { projectTitle: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'ACCEPTED' | 'REJECTED'>('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [selectedBid, setSelectedBid] = useState<BidResponse | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch all projects and their bids
  useEffect(() => {
    const loadBids = async () => {
      setIsLoading(true);
      try {
        await fetchMyProjects();
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBids();
  }, [fetchMyProjects]);

  useEffect(() => {
    // Fetch bids for all projects
    const fetchAllBids = async () => {
      if (projects.length === 0) {
        setAllBids([]);
        setFilteredBids([]);
        return;
      }

      try {
        const bidsPromises = projects.map(async (project) => {
          try {
            const result = await fetchBidsForProject(project.id);
            // Add project title to each bid
            return result.content.map(bid => ({
              ...bid,
              projectTitle: project.title
            }));
          } catch (error) {
            console.error(`Failed to fetch bids for project ${project.id}:`, error);
            return [];
          }
        });

        const bidsArrays = await Promise.all(bidsPromises);
        const allBidsFlat = bidsArrays.flat();
        setAllBids(allBidsFlat);
        setFilteredBids(allBidsFlat);
      } catch (error) {
        console.error('Failed to fetch bids:', error);
      }
    };

    fetchAllBids();
  }, [projects, fetchBidsForProject]);

  // Apply filters
  useEffect(() => {
    let filtered = [...allBids];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(bid => bid.status === statusFilter);
    }

    // Project filter
    if (projectFilter !== 'all') {
      filtered = filtered.filter(bid => bid.projectId === projectFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(bid =>
        bid.projectTitle.toLowerCase().includes(query) ||
        bid.bidderName.toLowerCase().includes(query) ||
        bid.proposal.toLowerCase().includes(query)
      );
    }

    setFilteredBids(filtered);
  }, [allBids, statusFilter, projectFilter, searchQuery]);

  const handleAcceptBid = async (bid: BidResponse) => {
    if (!window.confirm(`Accept bid from ${bid.bidderName} for $${bid.proposedPrice.toLocaleString()}?`)) {
      return;
    }

    try {
      await acceptBid(bid.id);
      await projectApiService.updateProjectStatus(bid.projectId, 'IN_PROGRESS');
      
      showSuccessToast('Bid accepted successfully! Project status updated to In Progress.');
      
      // Refresh bids
      await fetchMyProjects();
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      showErrorToast(`Failed to accept bid: ${errorMessage}`);
    }
  };

  const handleRejectBid = async (bid: BidResponse) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    if (reason === null) return; // User cancelled

    try {
      await rejectBid(bid.id, reason || undefined);
      showSuccessToast('Bid rejected successfully');
      
      // Refresh bids
      await fetchMyProjects();
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      showErrorToast(`Failed to reject bid: ${errorMessage}`);
    }
  };

  const handleViewDetails = (bid: BidResponse) => {
    setSelectedBid(bid);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'ACCEPTED':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'REJECTED':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'WITHDRAWN':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'ACCEPTED':
        return <Check className="h-4 w-4" />;
      case 'REJECTED':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <>
        <DashboardHeader
          title="Bids"
          subtitle="Manage all bids received on your projects"
        />
        <div className="bg-background-card/60 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading bids...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        title="Bids"
        subtitle="Manage all bids received on your projects"
      />

      {/* Filters Bar */}
      <div className="bg-background-card/60 backdrop-blur-xl border border-white/10 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1 w-full md:w-auto">
            <Input
              placeholder="Search by project, organization, or proposal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select
              options={[
                { value: 'all', label: 'All Projects' },
                ...projects.map(p => ({ value: p.id, label: p.title }))
              ]}
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="flex-1 md:w-48"
            />
            
            <Select
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'PENDING', label: 'Pending' },
                { value: 'ACCEPTED', label: 'Accepted' },
                { value: 'REJECTED', label: 'Rejected' }
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="flex-1 md:w-40"
            />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-background-card/60 backdrop-blur-xl border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Bids</p>
              <p className="text-2xl font-bold text-white mt-1">{allBids.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-background-card/60 backdrop-blur-xl border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">
                {allBids.filter(b => b.status === 'PENDING').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-background-card/60 backdrop-blur-xl border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Accepted</p>
              <p className="text-2xl font-bold text-green-400 mt-1">
                {allBids.filter(b => b.status === 'ACCEPTED').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Check className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-background-card/60 backdrop-blur-xl border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Rejected</p>
              <p className="text-2xl font-bold text-red-400 mt-1">
                {allBids.filter(b => b.status === 'REJECTED').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <X className="h-6 w-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Bids List */}
      <div className="bg-background-card/60 backdrop-blur-xl border border-white/10 rounded-lg p-6">
        {filteredBids.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Bids Found</h3>
            <p className="text-gray-400">
              {allBids.length === 0
                ? "You haven't received any bids yet. Bids will appear here once organizations submit them."
                : "No bids match your current filters. Try adjusting your search or filter criteria."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBids.map((bid) => (
              <div
                key={bid.id}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {bid.projectTitle}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(bid.status)}`}>
                        {getStatusIcon(bid.status)}
                        {bid.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      From: <span className="text-white font-medium">{bid.bidderName}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Proposed Price:</span>
                    <span className="text-white font-semibold">
                      ${bid.proposedPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white font-semibold">
                      {bid.estimatedDuration} days
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Submitted:</span>
                    <span className="text-white font-semibold">
                      {new Date(bid.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">Proposal:</p>
                  <p className="text-sm text-gray-300 line-clamp-2">{bid.proposal}</p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(bid)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>

                  {bid.status === 'PENDING' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptBid(bid)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleRejectBid(bid)}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bid Details Modal */}
      {selectedBid && showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDetailsModal(false)}
          />
          
          <div className="relative bg-[#1a1a2e] rounded-xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-[#1a1a2e] border-b border-white/10 p-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Bid Details</h2>
                <p className="text-gray-400 text-sm">{selectedBid.projectTitle}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2.5 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Organization</label>
                <p className="text-white font-semibold">{selectedBid.bidderName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Proposed Price</label>
                  <p className="text-white font-semibold text-lg">
                    ${selectedBid.proposedPrice.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Estimated Duration</label>
                  <p className="text-white font-semibold text-lg">
                    {selectedBid.estimatedDuration} days
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedBid.status)}`}>
                  {getStatusIcon(selectedBid.status)}
                  {selectedBid.status}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Submitted Date</label>
                <p className="text-white">
                  {new Date(selectedBid.submittedAt).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Proposal</label>
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                  <p className="text-gray-300 whitespace-pre-wrap">{selectedBid.proposal}</p>
                </div>
              </div>

              {selectedBid.rejectionReason && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Rejection Reason</label>
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-300">{selectedBid.rejectionReason}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-[#1a1a2e] border-t border-white/10 p-6 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
              {selectedBid.status === 'PENDING' && (
                <>
                  <Button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleAcceptBid(selectedBid);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Accept Bid
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleRejectBid(selectedBid);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject Bid
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
