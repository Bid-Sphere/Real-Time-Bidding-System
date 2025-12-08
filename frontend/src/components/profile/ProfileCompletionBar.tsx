import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface ProfileCompletionBarProps {
  percentage: number;
  missingFields: string[];
}

export const ProfileCompletionBar: React.FC<ProfileCompletionBarProps> = ({
  percentage,
  missingFields,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const isComplete = percentage === 100;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-white">Profile Completion</h3>
          {isComplete ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          )}
        </div>
        <span className="text-2xl font-bold text-white">{percentage}%</span>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full origin-left ${
            isComplete
              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
              : 'bg-gradient-to-r from-blue-500 to-purple-500'
          }`}
          style={{ width: '100%' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: percentage / 100 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Missing Fields Tooltip */}
      {!isComplete && missingFields.length > 0 && (
        <div className="mt-3 relative">
          <button
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 min-h-[44px] px-2"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            aria-label="Show missing fields"
            aria-expanded={showTooltip}
          >
            <AlertCircle className="w-4 h-4" />
            {missingFields.length} field{missingFields.length !== 1 ? 's' : ''} remaining
          </button>

          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 top-full mt-2 z-10 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl min-w-[250px]"
            >
              <p className="text-sm font-semibold text-white mb-2">Missing Fields:</p>
              <ul className="space-y-1">
                {missingFields.map((field, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                    {field}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      )}

      {isComplete && (
        <p className="mt-2 text-sm text-green-500 flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          Your profile is complete!
        </p>
      )}
    </div>
  );
};
