import { useState } from 'react';
import type { Bid } from '@/types/organization';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Calendar, DollarSign, Clock, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface BidListItemProps {
  bid: Bid;
  onEdit?: (bid: Bid) => void;
  onWithdraw?: (bidId: string) => void;
}

export const BidListItem = ({ bid, onEdit, onWithdraw }: BidListItemProps) => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    if (!onWithdraw) return;
    
    if (window.confirm('Are you sure you want to withdraw this bid? This action cannot be undone.')) {
      setIsWithdrawing(true);
      try {
        await onWithdraw(bid.id);
      } catch (error) {
        console.error('Failed to withdraw bid:', error);
        setIsWithdrawing(false);
      }
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(bid);
    }
  };

  // Only show edit and withdraw buttons for pending status
  const showActions = bid.status === 'pending';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[rgba(26,26,46,0.4)] rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-white font-medium mb-2">{bid.projectTitle}</h4>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(bid.submittedAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {bid.proposedPrice.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {bid.estimatedTimeline}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <StatusBadge status={bid.status} />
        </div>
      </div>

      {bid.ranking && (
        <div className="mb-3 text-xs text-blue-400">
          Ranked #{bid.ranking} among all bids
        </div>
      )}

      {/* Action buttons - only for pending status, touch-friendly 44x44px minimum */}
      {showActions && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-800">
          <button
            onClick={handleEdit}
            className="flex items-center gap-1 px-3 py-2.5 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all min-h-[44px]"
            disabled={isWithdrawing}
            aria-label="Edit bid"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleWithdraw}
            className="flex items-center gap-1 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all min-h-[44px]"
            disabled={isWithdrawing}
            aria-label="Withdraw bid"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isWithdrawing ? 'Withdrawing...' : 'Withdraw'}</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};
