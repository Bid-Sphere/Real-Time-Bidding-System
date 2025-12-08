import { useState, useEffect } from 'react';
import type { Bid } from '@/types/organization';
import { X, DollarSign, Calendar, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditBidModalProps {
  bid: Bid | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (bidId: string, data: Partial<Pick<Bid, 'proposedPrice' | 'estimatedTimeline' | 'coverLetter'>>) => Promise<void>;
}

export const EditBidModal = ({ bid, isOpen, onClose, onSave }: EditBidModalProps) => {
  const [formData, setFormData] = useState({
    proposedPrice: '',
    estimatedTimeline: '',
    coverLetter: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bid) {
      setFormData({
        proposedPrice: bid.proposedPrice.toString(),
        estimatedTimeline: bid.estimatedTimeline,
        coverLetter: bid.coverLetter,
      });
    }
  }, [bid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bid) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const price = parseFloat(formData.proposedPrice);
      if (isNaN(price) || price <= 0) {
        throw new Error('Please enter a valid price');
      }

      if (!formData.estimatedTimeline.trim()) {
        throw new Error('Please enter an estimated timeline');
      }

      if (!formData.coverLetter.trim()) {
        throw new Error('Please enter a cover letter');
      }

      await onSave(bid.id, {
        proposedPrice: price,
        estimatedTimeline: formData.estimatedTimeline.trim(),
        coverLetter: formData.coverLetter.trim(),
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update bid');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      onClose();
    }
  };

  if (!bid) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1a1a2e] rounded-xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div>
                  <h2 className="text-2xl font-bold text-white">Edit Bid</h2>
                  <p className="text-gray-400 text-sm mt-1">{bid.projectTitle}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center p-2"
                  disabled={isSubmitting}
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Proposed Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Proposed Price
                  </label>
                  <input
                    type="number"
                    value={formData.proposedPrice}
                    onChange={(e) => setFormData({ ...formData, proposedPrice: e.target.value })}
                    className="w-full px-4 py-2 bg-[rgba(26,26,46,0.6)] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Enter proposed price"
                    min="0"
                    step="0.01"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Estimated Timeline */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Estimated Timeline
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedTimeline}
                    onChange={(e) => setFormData({ ...formData, estimatedTimeline: e.target.value })}
                    className="w-full px-4 py-2 bg-[rgba(26,26,46,0.6)] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="e.g., 2 weeks, 1 month"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Cover Letter
                  </label>
                  <textarea
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    className="w-full px-4 py-2 bg-[rgba(26,26,46,0.6)] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors min-h-[150px] resize-y"
                    placeholder="Explain why you're the best fit for this project..."
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
