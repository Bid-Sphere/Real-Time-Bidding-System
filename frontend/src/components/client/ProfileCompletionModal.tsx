import { motion } from 'framer-motion';
import { AlertTriangle, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { getMissingClientFields, calculateClientProfileCompletion } from '../../utils/clientProfileUtils';
import type { ClientProfile } from '../../types/client';

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Partial<ClientProfile> | null;
  actionAttempted?: string;
}

export const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
  isOpen,
  onClose,
  profile,
  actionAttempted = 'perform this action',
}) => {
  const navigate = useNavigate();

  if (!isOpen || !profile) return null;

  const missingFields = getMissingClientFields(profile);
  const completionPercentage = calculateClientProfileCompletion(profile);

  const handleCompleteProfile = () => {
    onClose();
    navigate('/client-dashboard/profile');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
            <h2 className="text-xl font-semibold text-white">Complete Your Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6">
          <p className="text-gray-300">
            To {actionAttempted}, you need to complete your profile first. Your profile is currently{' '}
            <span className="font-semibold text-yellow-500">{completionPercentage}% complete</span>.
          </p>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Missing Fields */}
          {missingFields.length > 0 && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Missing Required Fields:
              </h3>
              <ul className="space-y-1">
                {missingFields.slice(0, 5).map((field, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                    {field}
                  </li>
                ))}
                {missingFields.length > 5 && (
                  <li className="text-sm text-gray-400 ml-3.5">
                    ... and {missingFields.length - 5} more
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <p className="text-sm text-blue-300">
              <strong>Why complete your profile?</strong>
              <br />
              • Unlock all platform features
              • Increase credibility with service providers
              • Get better project recommendations
              • Enable secure transactions
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCompleteProfile}
            className="flex-1"
          >
            Complete Profile
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};