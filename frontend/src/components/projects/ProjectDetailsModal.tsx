import type { Project } from '@/types/organization';
import Button from '@/components/ui/Button';
import { CountdownTimer } from '@/components/shared/CountdownTimer';

interface ProjectDetailsModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onBid: () => void;
  isVerified: boolean;
  hideActions?: boolean; // Hide bid actions for client view
}

export function ProjectDetailsModal({
  project,
  isOpen,
  onClose,
  onBid,
  isVerified,
  hideActions = false,
}: ProjectDetailsModalProps) {
  if (!isOpen) return null;

  // Debug logging
  console.log('=== PROJECT DETAILS MODAL ===');
  console.log('Project:', project);
  console.log('Bidding Type:', project.biddingType);
  console.log('Winning Bid Amount:', project.winningBidAmount);
  console.log('Winner Organization Name:', project.winnerOrganizationName);
  console.log('Winner Email:', project.winnerEmail);
  console.log('Budget Min:', project.budgetMin);
  console.log('Budget Max:', project.budgetMax);
  console.log('============================');

  const formatBudget = (min: number, max: number) => {
    if (min === max) {
      return `$${min.toLocaleString()}`;
    }
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1a1a2e] rounded-xl border border-white/10 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a2e] border-b border-white/10 p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              {project.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{project.clientName}</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                {project.category}
              </span>
            </div>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Budget and Deadline */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg">
            <div>
              <p className="text-sm text-gray-400 mb-1">
                {project.biddingType === 'LIVE_AUCTION' && project.winningBidAmount 
                  ? 'Winning Bid' 
                  : 'Budget Range'}
              </p>
              <p className="text-xl font-semibold text-white">
                {project.biddingType === 'LIVE_AUCTION' && project.winningBidAmount
                  ? `$${project.winningBidAmount.toLocaleString()}`
                  : formatBudget(project.budgetMin, project.budgetMax)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Deadline</p>
              <CountdownTimer deadline={project.deadline} />
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Project Description
            </h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Requirements */}
          {project.requirements && project.requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Requirements
              </h3>
              <ul className="space-y-2">
                {project.requirements.map((req, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-300"
                  >
                    <svg
                      className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Timeline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Posted On</p>
              <p className="text-white">{formatDate(project.postedAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Deadline</p>
              <p className="text-white">{formatDate(project.deadline)}</p>
            </div>
          </div>

          {/* Location */}
          {project.location && (
            <div>
              <p className="text-sm text-gray-400 mb-1">Location</p>
              <div className="flex items-center gap-2 text-white">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{project.location}</span>
              </div>
            </div>
          )}

          {/* Attachments */}
          {project.attachments && project.attachments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Attachments
              </h3>
              <div className="space-y-2">
                {project.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="text-white text-sm">{attachment.filename}</p>
                      <p className="text-gray-400 text-xs">
                        {(attachment.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Bid Stats / Winner Info */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            {/* Show Winner Info for Live Auction with winner */}
            {project.biddingType === 'LIVE_AUCTION' && project.winnerOrganizationName ? (
              <div>
                <p className="text-sm text-gray-400 mb-3">Winner</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-white font-medium text-lg">
                      {project.winnerOrganizationName}
                    </span>
                  </div>
                  {project.winnerEmail && (
                    <Button
                      onClick={() => window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${project.winnerEmail}`, '_blank')}
                      variant="outline"
                      className="h-9 text-sm"
                    >
                      <svg
                        className="w-4 h-4 mr-1.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Contact
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              /* Show bid count for other projects */
              <div className="flex items-center gap-2 text-blue-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="font-medium">
                  {project.bidCount} {project.bidCount === 1 ? 'bid' : 'bids'} submitted
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {!hideActions && (
          <div className="sticky bottom-0 bg-[#1a1a2e] border-t border-white/10 p-6 flex items-center justify-end gap-3">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
            <Button
              onClick={onBid}
              disabled={!isVerified || project.hasBid}
              title={!isVerified ? 'Email verification required' : project.hasBid ? 'Already bid on this project' : ''}
            >
              {project.hasBid ? 'Bid Submitted' : 'Bid Now'}
            </Button>
          </div>
        )}
        {hideActions && (
          <div className="sticky bottom-0 bg-[#1a1a2e] border-t border-white/10 p-6 flex items-center justify-end gap-3">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
