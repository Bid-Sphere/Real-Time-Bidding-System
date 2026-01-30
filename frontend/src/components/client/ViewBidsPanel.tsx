import { useState } from 'react';
import { X, Star, Clock, DollarSign, MessageCircle, Eye, Check, XIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import type { Bid, Project, SortOption } from '../../types/project';

interface ViewBidsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  bids: Bid[];
  onAcceptBid: (bidId: string) => void;
  onRejectBid: (bidId: string) => void;
  onOpenChat: (bidderId: string) => void;
  onViewProfile: (bidderId: string) => void;
}

// Mock bids data
const mockBids: Bid[] = [
  {
    id: '1',
    projectId: '1',
    bidderId: 'org1',
    bidderName: 'TechSolutions Inc.',
    bidderType: 'organization',
    bidderRating: 4.8,
    completedProjects: 45,
    proposedPrice: 4500,
    estimatedDuration: 30,
    proposal: 'We have extensive experience in e-commerce development with React and Node.js. Our team can deliver a modern, scalable solution with payment integration, inventory management, and admin dashboard.',
    attachments: [],
    teamComposition: [
      { name: 'John Smith', role: 'Lead Developer', experience: '5 years React/Node.js' },
      { name: 'Sarah Johnson', role: 'UI/UX Designer', experience: '4 years e-commerce design' },
      { name: 'Mike Chen', role: 'Backend Developer', experience: '3 years API development' }
    ],
    submittedAt: new Date('2024-01-12'),
    status: 'pending'
  },
  {
    id: '2',
    projectId: '1',
    bidderId: 'org1',
    bidderName: 'Tech Solutions Inc',
    bidderType: 'organization',
    bidderRating: 4.9,
    completedProjects: 28,
    proposedPrice: 3800,
    estimatedDuration: 35,
    proposal: 'Full-stack development team with 6+ years experience. We specialize in React/Node.js e-commerce platforms. We can provide a complete solution including responsive design, secure payment processing, and SEO optimization.',
    attachments: [],
    submittedAt: new Date('2024-01-13'),
    status: 'pending'
  },
  {
    id: '3',
    projectId: '1',
    bidderId: 'org2',
    bidderName: 'Digital Craft Agency',
    bidderType: 'organization',
    bidderRating: 4.6,
    completedProjects: 32,
    proposedPrice: 5200,
    estimatedDuration: 25,
    proposal: 'Premium e-commerce development with focus on conversion optimization and user experience. We include advanced analytics, A/B testing setup, and 3 months of free maintenance.',
    attachments: [],
    teamComposition: [
      { name: 'Emma Wilson', role: 'Project Manager', experience: '7 years project management' },
      { name: 'David Kim', role: 'Senior Developer', experience: '8 years full-stack development' },
      { name: 'Lisa Zhang', role: 'QA Engineer', experience: '4 years testing automation' }
    ],
    submittedAt: new Date('2024-01-11'),
    status: 'pending'
  }
];

export default function ViewBidsPanel({
  isOpen,
  onClose,
  project,
  onAcceptBid,
  onRejectBid,
  onOpenChat,
  onViewProfile
}: ViewBidsPanelProps) {
  const [sortBy, setSortBy] = useState<SortOption>('lowest_price');
  const [selectedBids, setSelectedBids] = useState<string[]>([]);
  const [expandedProposals, setExpandedProposals] = useState<string[]>([]);

  if (!isOpen) return null;

  const bids = mockBids; // Use mock data for now

  const sortedBids = [...bids].sort((a, b) => {
    switch (sortBy) {
      case 'lowest_price':
        return a.proposedPrice - b.proposedPrice;
      case 'highest_rating':
        return b.bidderRating - a.bidderRating;
      case 'most_recent':
        return b.submittedAt.getTime() - a.submittedAt.getTime();
      case 'fastest_completion':
        return a.estimatedDuration - b.estimatedDuration;
      default:
        return 0;
    }
  });

  const lowestBid = Math.min(...bids.map(bid => bid.proposedPrice));

  const toggleProposal = (bidId: string) => {
    setExpandedProposals(prev =>
      prev.includes(bidId)
        ? prev.filter(id => id !== bidId)
        : [...prev, bidId]
    );
  };

  const toggleBidSelection = (bidId: string) => {
    setSelectedBids(prev =>
      prev.includes(bidId)
        ? prev.filter(id => id !== bidId)
        : [...prev, bidId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Bids for "{project.title}"
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {bids.length} bids received
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-4">
            <Select
              options={[
                { value: 'lowest_price', label: 'Lowest Price First' },
                { value: 'highest_rating', label: 'Highest Rating First' },
                { value: 'most_recent', label: 'Most Recent First' },
                { value: 'fastest_completion', label: 'Fastest Completion' }
              ]}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            />

            {selectedBids.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedBids.length} selected
                </span>
                <Button variant="outline" size="sm">
                  Compare Selected
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Bids List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {sortedBids.map((bid) => (
              <Card key={bid.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedBids.includes(bid.id)}
                      onChange={() => toggleBidSelection(bid.id)}
                      className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {bid.bidderName}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bid.bidderType === 'organization' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {bid.bidderType === 'organization' ? '🏢 Organization' : '👤 Organization'}
                        </span>
                        {bid.proposedPrice === lowestBid && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-xs font-medium">
                            Lowest Bid
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span>{bid.bidderRating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{bid.completedProjects} completed</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">Submitted {bid.submittedAt.toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <div>
                            <div className="text-sm text-gray-300">Proposed Price</div>
                            <div className="text-xl font-bold text-white">
                              ${bid.proposedPrice.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="text-sm text-gray-300">Estimated Duration</div>
                            <div className="text-xl font-bold text-white">
                              {bid.estimatedDuration} days
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Team Composition for Organizations */}
                      {bid.bidderType === 'organization' && bid.teamComposition && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Team Composition
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {bid.teamComposition.map((member, index) => (
                              <div key={index} className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700/50">
                                <div className="font-medium text-sm text-white">
                                  {member.name}
                                </div>
                                <div className="text-xs text-gray-300">
                                  {member.role}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {member.experience}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Proposal */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Proposal
                        </h4>
                        <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50">
                          <p className={`text-gray-200 ${
                            expandedProposals.includes(bid.id) ? '' : 'line-clamp-3'
                          }`}>
                            {bid.proposal}
                          </p>
                          {bid.proposal.length > 200 && (
                            <button
                              onClick={() => toggleProposal(bid.id)}
                              className="text-blue-600 hover:text-blue-700 text-sm mt-2"
                            >
                              {expandedProposals.includes(bid.id) ? 'Show less' : 'Show more'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Attachments */}
                      {bid.attachments && bid.attachments.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Attachments
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {bid.attachments.map((attachment) => (
                              <div key={attachment.id} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {attachment.filename}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewProfile(bid.bidderId)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenChat(bid.bidderId)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRejectBid(bid.id)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <XIcon className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onAcceptBid(bid.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept Bid
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}