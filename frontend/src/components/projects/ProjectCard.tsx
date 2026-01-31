import type { Project } from '@/types/organization';
import { CountdownTimer } from '@/components/shared/CountdownTimer';
import Button from '@/components/ui/Button';

interface ProjectCardProps {
  project: Project;
  isVerified: boolean;
  hasBidded?: boolean;
  onViewDetails: () => void;
  onBid: () => void;
  onInterest: () => void;
}

export function ProjectCard({
  project,
  isVerified,
  hasBidded = false,
  onViewDetails,
  onBid,
  onInterest,
}: ProjectCardProps) {
  const formatBudget = (min: number, max: number) => {
    if (min === max) {
      return `$${min.toLocaleString()}`;
    }
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  return (
    <div className="bg-[#1a1a2e]/60 backdrop-blur-sm rounded-xl p-6 border border-white/5 hover:border-blue-500/30 transition-all duration-300 group hover:scale-[1.02] hover:-translate-y-1 animate-fade-in-up h-full flex flex-col"
    >
      {/* Header - Fixed height */}
      <div className="flex items-start justify-between mb-4 min-h-[60px]">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
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
            <span className="truncate">{project.clientName}</span>
          </div>
        </div>

        {/* Category Badge */}
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30 flex-shrink-0 ml-2">
          {project.category}
        </span>
      </div>

      {/* Description - Fixed height */}
      <div className="h-10 mb-4">
        <p className="text-gray-300 text-sm line-clamp-2">
          {project.description}
        </p>
      </div>

      {/* Budget and Deadline - Fixed height */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5 h-[60px]">
        <div>
          <p className="text-xs text-gray-400 mb-1">Budget</p>
          <p className="text-lg font-semibold text-white">
            {formatBudget(project.budgetMin, project.budgetMax)}
          </p>
        </div>

        <CountdownTimer deadline={project.deadline} />
      </div>

      {/* Spacer to push buttons to bottom */}
      <div className="flex-1"></div>

      {/* Bid Count and Location - Fixed height, always same position, centered */}
      <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-400 h-[20px]">
        <div className="flex items-center gap-1.5">
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
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>{project.bidCount} bids</span>
        </div>

        {project.location && (
          <div className="flex items-center gap-1.5">
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
        )}
      </div>

      {/* Action Buttons - Always at bottom, centered */}
      <div className="flex items-center justify-center gap-3">
        <Button
          onClick={onViewDetails}
          variant="outline"
          size="md"
          className="w-[110px] h-[44px]"
        >
          Details
        </Button>

        <Button
          onClick={onBid}
          disabled={!isVerified || hasBidded}
          size="md"
          className="w-[130px] h-[44px]"
          title={!isVerified ? 'Email verification required' : hasBidded ? 'Already bid on this project' : ''}
        >
          {hasBidded ? 'Bidded' : 'Bid'}
        </Button>

        <button
          onClick={onInterest}
          className={`rounded-full transition-colors w-[44px] h-[44px] flex items-center justify-center ${
            project.isInterested
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
          }`}
          title={project.isInterested ? 'Remove from interested' : 'Mark as interested'}
          aria-label={project.isInterested ? 'Remove from interested' : 'Mark as interested'}
        >
          <svg
            className="w-5 h-5"
            fill={project.isInterested ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
