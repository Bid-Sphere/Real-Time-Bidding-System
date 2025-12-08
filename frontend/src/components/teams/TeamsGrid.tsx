import type { TeamMember } from '@/types/organization';
import { TeamMemberCard } from './TeamMemberCard';
import { Plus } from 'lucide-react';

interface TeamsGridProps {
  members: TeamMember[];
  onAddClick: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TeamsGrid = ({ members, onAddClick, onEdit, onDelete }: TeamsGridProps) => {
  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Team Members</h2>
          <p className="text-gray-400 mt-1">
            Showcase your team's expertise and capabilities
          </p>
        </div>
        <button
          onClick={onAddClick}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all font-medium shadow-lg shadow-blue-500/25 flex items-center gap-2 min-h-[44px]"
          aria-label="Add team member"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Team Member</span>
          <span className="sm:hidden">Add Member</span>
        </button>
      </div>

      {/* Grid */}
      {members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[rgba(26,26,46,0.6)] backdrop-blur-sm border border-gray-800 rounded-xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
            <Plus className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Team Members Yet</h3>
          <p className="text-gray-400 mb-6">
            Start building your team showcase by adding your first member
          </p>
          <button
            onClick={onAddClick}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all font-medium shadow-lg shadow-blue-500/25 inline-flex items-center gap-2 min-h-[44px]"
            aria-label="Add your first team member"
          >
            <Plus className="w-5 h-5" />
            Add Your First Team Member
          </button>
        </div>
      )}
    </div>
  );
};
