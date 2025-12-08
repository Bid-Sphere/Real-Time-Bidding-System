import type { Activity } from '@/types/organization';
import { motion } from 'framer-motion';
import { 
  FileText, 
  MessageSquare, 
  Award, 
  User, 
  CheckCircle,
  Clock
} from 'lucide-react';

interface RecentActivityProps {
  activities: Activity[];
}

const getActivityIcon = (type: Activity['type']) => {
  const iconMap = {
    bid_submitted: FileText,
    message_received: MessageSquare,
    project_awarded: Award,
    profile_updated: User,
  };

  const Icon = iconMap[type] || CheckCircle;
  return <Icon className="w-5 h-5" />;
};

const getActivityColor = (type: Activity['type']) => {
  const colorMap = {
    bid_submitted: 'text-blue-400 bg-blue-500/20',
    message_received: 'text-purple-400 bg-purple-500/20',
    project_awarded: 'text-green-400 bg-green-500/20',
    profile_updated: 'text-yellow-400 bg-yellow-500/20',
  };

  return colorMap[type] || 'text-gray-400 bg-gray-500/20';
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  if (activities.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[rgba(26,26,46,0.6)] to-[rgba(26,26,46,0.4)] backdrop-blur-sm rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <p className="text-gray-400 text-center py-8">No recent activity to display.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[rgba(26,26,46,0.6)] to-[rgba(26,26,46,0.4)] backdrop-blur-sm rounded-xl p-6 border border-gray-800">
      <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-start gap-4 group"
          >
            {/* Timeline connector */}
            <div className="relative flex flex-col items-center">
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(
                  activity.type
                )} transition-all duration-200 group-hover:scale-110`}
              >
                {getActivityIcon(activity.type)}
              </div>
              
              {/* Vertical line */}
              {index < activities.length - 1 && (
                <div className="w-0.5 h-full bg-gray-800 mt-2" />
              )}
            </div>

            {/* Activity content */}
            <div className="flex-1 pb-4">
              <div className="bg-[rgba(26,26,46,0.4)] rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-all">
                <p className="text-white text-sm mb-2">{activity.description}</p>
                
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimestamp(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
