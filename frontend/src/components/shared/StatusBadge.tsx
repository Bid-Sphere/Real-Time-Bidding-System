import type { Bid } from '@/types/organization';

type StatusType = Bid['status'] | 'verified' | 'unverified';
type SizeType = 'sm' | 'md' | 'lg';

interface StatusBadgeProps {
  status: StatusType;
  size?: SizeType;
}

export const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  // Color coding: yellow (pending), blue (shortlisted), green (accepted/verified), red (rejected/unverified)
  const colors: Record<StatusType, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    shortlisted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    accepted: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    verified: 'bg-green-500/20 text-green-400 border-green-500/30',
    unverified: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const sizes: Record<SizeType, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span
      className={`rounded-full font-medium border ${colors[status]} ${sizes[size]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
