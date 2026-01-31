import { useState } from 'react';
import type { Project } from '@/types/organization';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface BidSubmissionModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bidData: BidFormData) => void;
  isVerified: boolean;
}

export interface BidFormData {
  proposedPrice: number;
  estimatedTimeline: string;
  coverLetter: string;
  attachments?: File[];
}

export function BidSubmissionModal({
  project,
  isOpen,
  onClose,
  onSubmit,
  isVerified,
}: BidSubmissionModalProps) {
  const [formData, setFormData] = useState<BidFormData>({
    proposedPrice: 0,
    estimatedTimeline: '',
    coverLetter: '',
    attachments: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BidFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BidFormData, string>> = {};

    if (!formData.proposedPrice || formData.proposedPrice <= 0) {
      newErrors.proposedPrice = 'Please enter a valid price';
    }

    if (formData.proposedPrice < project.budgetMin || formData.proposedPrice > project.budgetMax) {
      newErrors.proposedPrice = `Price must be between $${project.budgetMin.toLocaleString()} and $${project.budgetMax.toLocaleString()}`;
    }

    if (!formData.estimatedTimeline) {
      newErrors.estimatedTimeline = 'Please select a timeline';
    }

    if (!formData.coverLetter || formData.coverLetter.trim().length < 50) {
      newErrors.coverLetter = 'Cover letter must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isVerified) {
      setErrors({ coverLetter: 'Email verification required to submit bids' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        proposedPrice: 0,
        estimatedTimeline: '',
        coverLetter: '',
        attachments: [],
      });
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({ coverLetter: 'Failed to submit bid. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      proposedPrice: 0,
      estimatedTimeline: '',
      coverLetter: '',
      attachments: [],
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1a1a2e] rounded-xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a2e] border-b border-white/10 p-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Submit Bid</h2>
            <p className="text-gray-400 text-sm">{project.title}</p>
          </div>

          <button
            onClick={handleClose}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Unverified Warning */}
          {!isVerified && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="text-red-400 font-medium">Email Verification Required</p>
                  <p className="text-red-300 text-sm mt-1">
                    You must verify your email address before submitting bids. Please complete email verification in your profile.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Budget Reference */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Project Budget Range</p>
            <p className="text-lg font-semibold text-white">
              ${project.budgetMin === project.budgetMax 
                ? project.budgetMin.toLocaleString() 
                : `${project.budgetMin.toLocaleString()} - ${project.budgetMax.toLocaleString()}`}
            </p>
          </div>

          {/* Proposed Price */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Proposed Price ($) <span className="text-red-400">*</span>
            </label>
            <Input
              type="number"
              placeholder="Enter your proposed price"
              value={formData.proposedPrice || ''}
              onChange={(e) =>
                setFormData({ ...formData, proposedPrice: parseFloat(e.target.value) || 0 })
              }
              min={project.budgetMin}
              max={project.budgetMax}
              className={errors.proposedPrice ? 'border-red-500' : ''}
            />
            {errors.proposedPrice && (
              <p className="text-red-400 text-sm mt-1">{errors.proposedPrice}</p>
            )}
          </div>

          {/* Estimated Timeline */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Estimated Timeline <span className="text-red-400">*</span>
            </label>
            <Input
              type="date"
              value={formData.estimatedTimeline}
              onChange={(e) =>
                setFormData({ ...formData, estimatedTimeline: e.target.value })
              }
              min={new Date().toISOString().split('T')[0]}
              className={errors.estimatedTimeline ? 'border-red-500' : ''}
            />
            {errors.estimatedTimeline && (
              <p className="text-red-400 text-sm mt-1">{errors.estimatedTimeline}</p>
            )}
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cover Letter <span className="text-red-400">*</span>
            </label>
            <textarea
              placeholder="Explain why you're the best fit for this project (minimum 50 characters)..."
              value={formData.coverLetter}
              onChange={(e) =>
                setFormData({ ...formData, coverLetter: e.target.value })
              }
              rows={6}
              className={`w-full px-4 py-3 bg-white/5 border ${
                errors.coverLetter ? 'border-red-500' : 'border-white/10'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.coverLetter && (
                <p className="text-red-400 text-sm">{errors.coverLetter}</p>
              )}
              <p className="text-gray-400 text-sm ml-auto">
                {formData.coverLetter.length} / 50 minimum
              </p>
            </div>
          </div>

          {/* Attachments Placeholder */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
              <svg
                className="w-12 h-12 text-gray-400 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-gray-400 text-sm">
                File upload functionality will be available soon
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#1a1a2e] border-t border-white/10 p-6 flex items-center justify-end gap-3">
          <Button onClick={handleClose} variant="outline" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={(e: React.MouseEvent) => handleSubmit(e)}
            disabled={!isVerified || isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Bid'}
          </Button>
        </div>
      </div>
    </div>
  );
}
