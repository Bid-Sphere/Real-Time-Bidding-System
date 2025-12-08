import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

export const MetricCard = ({ title, value, icon, trend }: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="relative bg-gradient-to-br from-[rgba(26,26,46,0.6)] to-[rgba(26,26,46,0.4)] backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400">
            {icon}
          </div>
          
          {/* Trend indicator */}
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium ${
              trend.direction === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        
        {/* Value */}
        <div className="mb-2">
          <div className="text-3xl font-bold text-white">
            {value}
          </div>
        </div>
        
        {/* Title */}
        <div className="text-sm text-gray-400">
          {title}
        </div>
      </div>
    </motion.div>
  );
};
