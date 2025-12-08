import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'text' | 'circle';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ variant = 'card', count = 1, className = '' }: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={`bg-[#1a1a2e]/60 backdrop-blur-sm rounded-xl p-6 border border-white/5 ${className}`}>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded w-5/6"></div>
              </div>
              <div className="flex gap-2 mt-4">
                <div className="h-10 bg-gray-700 rounded w-24"></div>
                <div className="h-10 bg-gray-700 rounded w-24"></div>
              </div>
            </div>
          </div>
        );

      case 'list':
        return (
          <div className={`bg-[#1a1a2e]/60 backdrop-blur-sm rounded-lg p-4 border border-white/5 ${className}`}>
            <div className="animate-pulse flex items-center space-x-4">
              <div className="rounded-full bg-gray-700 h-12 w-12"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={`animate-pulse space-y-2 ${className}`}>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-4/6"></div>
          </div>
        );

      case 'circle':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="rounded-full bg-gray-700 h-16 w-16"></div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {skeletons.map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </>
  );
}

// Specific skeleton components for common use cases
export function ProjectCardSkeleton() {
  return (
    <div className="bg-[#1a1a2e]/60 backdrop-blur-sm rounded-xl p-6 border border-white/5">
      <div className="animate-pulse space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
          <div className="h-6 w-20 bg-gray-700 rounded-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-700 rounded"></div>
          <div className="h-3 bg-gray-700 rounded w-5/6"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-4 bg-gray-700 rounded w-24"></div>
          <div className="h-4 bg-gray-700 rounded w-24"></div>
          <div className="h-4 bg-gray-700 rounded w-24"></div>
        </div>
        <div className="flex gap-2 pt-4 border-t border-white/5">
          <div className="h-10 bg-gray-700 rounded flex-1"></div>
          <div className="h-10 bg-gray-700 rounded flex-1"></div>
          <div className="h-10 bg-gray-700 rounded flex-1"></div>
        </div>
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-[#1a1a2e]/60 backdrop-blur-sm rounded-xl p-6 border border-white/5">
      <div className="animate-pulse space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-700 rounded w-24"></div>
          <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
        </div>
        <div className="h-10 bg-gray-700 rounded w-32"></div>
        <div className="h-3 bg-gray-700 rounded w-20"></div>
      </div>
    </div>
  );
}

export function TeamMemberCardSkeleton() {
  return (
    <div className="bg-[#1a1a2e]/60 backdrop-blur-sm rounded-xl p-6 border border-white/5">
      <div className="animate-pulse space-y-4">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-gray-700 h-16 w-16"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-24"></div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="h-6 bg-gray-700 rounded w-16"></div>
          <div className="h-6 bg-gray-700 rounded w-20"></div>
          <div className="h-6 bg-gray-700 rounded w-18"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-700 rounded"></div>
          <div className="h-3 bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
}

export function ChatListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-[#1a1a2e]/60 backdrop-blur-sm rounded-lg p-4 border border-white/5">
          <div className="animate-pulse flex items-center space-x-3">
            <div className="rounded-full bg-gray-700 h-12 w-12"></div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-700 rounded w-32"></div>
                <div className="h-3 bg-gray-700 rounded w-16"></div>
              </div>
              <div className="h-3 bg-gray-700 rounded w-48"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
