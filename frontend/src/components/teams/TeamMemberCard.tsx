import type { TeamMember } from '@/types/organization';
import { Edit2, Trash2 } from 'lucide-react';

interface TeamMemberCardProps {
  member: TeamMember;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TeamMemberCard = ({ member, onEdit, onDelete }: TeamMemberCardProps) => {
  return (
    <div className="bg-[rgba(26,26,46,0.6)] backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02] animate-fade-in-up h-full flex flex-col"
    >
      {/* Header with Name and Actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">{member.name}</h3>
          <p className="text-sm text-gray-400 mt-1">{member.role}</p>
        </div>

        {/* Action Buttons - Touch-friendly 44x44px minimum */}
        <div className="flex gap-2 ml-4 flex-shrink-0">
          <button
            onClick={() => onEdit(member.id)}
            className="p-2.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Edit team member"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(member.id)}
            className="p-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Delete team member"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Skills */}
      {member.skills && member.skills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {member.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bio Excerpt - Fixed height for consistency */}
      <div className="flex-1 mb-4">
        {member.bio && (
          <p className="text-sm text-gray-400 line-clamp-3">
            {member.bio}
          </p>
        )}
      </div>

      {/* Links - Always at bottom */}
      {(member.linkedIn || member.portfolio) && (
        <div className="pt-4 border-t border-gray-800 flex gap-3 mt-auto">
          {member.linkedIn && (
            <a
              href={member.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              LinkedIn →
            </a>
          )}
          {member.portfolio && (
            <a
              href={member.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              Portfolio →
            </a>
          )}
        </div>
      )}
    </div>
  );
};
