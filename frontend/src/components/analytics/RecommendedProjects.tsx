import type { Project } from '@/types/organization';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, Users, MapPin } from 'lucide-react';

interface RecommendedProjectsProps {
  projects: Project[];
  organizationIndustry?: string;
  isVerified: boolean;
  onBidClick: (projectId: string) => void;
  onInterestClick: (projectId: string) => void;
}

export const RecommendedProjects = ({
  projects,
  organizationIndustry,
  isVerified,
  onBidClick,
  onInterestClick,
}: RecommendedProjectsProps) => {
  // Filter projects based on organization profile (industry match)
  const filteredProjects = organizationIndustry
    ? projects.filter(
        (project) =>
          project.category.toLowerCase() === organizationIndustry.toLowerCase() ||
          project.status === 'open'
      )
    : projects;

  // Limit to 6 projects
  const displayProjects = filteredProjects.slice(0, 6);

  if (displayProjects.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[rgba(26,26,46,0.6)] to-[rgba(26,26,46,0.4)] backdrop-blur-sm rounded-xl p-8 border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-4">Recommended Projects</h2>
        <p className="text-gray-400 text-center py-8">No recommended projects available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[rgba(26,26,46,0.6)] to-[rgba(26,26,46,0.4)] backdrop-blur-sm rounded-xl p-6 border border-gray-800">
      <h2 className="text-xl font-semibold text-white mb-6">Recommended Projects</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-[rgba(26,26,46,0.4)] rounded-lg p-4 border border-gray-800 hover:border-blue-500/50 transition-all duration-300"
          >
            {/* Category Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                {project.category}
              </span>
              <span className="text-xs text-gray-500">{project.bidCount} bids</span>
            </div>

            {/* Project Title */}
            <h3 className="text-white font-semibold mb-2 line-clamp-2 min-h-[3rem]">
              {project.title}
            </h3>

            {/* Client Name */}
            <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              {project.clientName}
            </p>

            {/* Budget */}
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span>
                ${project.budgetMin.toLocaleString()} - ${project.budgetMax.toLocaleString()}
              </span>
            </div>

            {/* Location */}
            {project.location && (
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{project.location}</span>
              </div>
            )}

            {/* Deadline */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <Calendar className="w-4 h-4" />
              <span>{new Date(project.deadline).toLocaleDateString()}</span>
            </div>

            {/* Action Buttons - Touch-friendly 44x44px minimum */}
            <div className="flex gap-2">
              <button
                onClick={() => onBidClick(project.id)}
                disabled={!isVerified}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${
                  isVerified
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/50'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                title={!isVerified ? 'Email verification required' : 'Submit a bid'}
                aria-label="Bid on project"
              >
                Bid Now
              </button>
              <button
                onClick={() => onInterestClick(project.id)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium border border-gray-700 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="Mark as interested"
                aria-label="Mark as interested"
              >
                ★
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
