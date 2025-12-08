import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTeamStore } from '@/store/useTeamStore';
import { useAuthStore } from '@/store/authStore';
import { TeamsGrid } from '@/components/teams/TeamsGrid';
import { AddTeamMemberModal } from '@/components/teams/AddTeamMemberModal';
import type { TeamMember } from '@/types/organization';
import { Loader2 } from 'lucide-react';

export const TeamsSection = () => {
  const { user } = useAuthStore();
  const { members, isLoading, fetchTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useTeamStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | undefined>(undefined);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Fetch team members on mount
  useEffect(() => {
    if (user?.id) {
      fetchTeamMembers(user.id);
    }
  }, [user?.id, fetchTeamMembers]);

  const handleAddClick = () => {
    setEditingMember(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setEditingMember(member);
      setIsModalOpen(true);
    }
  };

  const handleDeleteClick = (memberId: string) => {
    setShowDeleteConfirm(memberId);
  };

  const handleConfirmDelete = async () => {
    if (showDeleteConfirm && user?.id) {
      try {
        await deleteTeamMember(user.id, showDeleteConfirm);
        setShowDeleteConfirm(null);
      } catch (error) {
        console.error('Failed to delete team member:', error);
      }
    }
  };

  const handleSave = async (data: Omit<TeamMember, 'id' | 'organizationId' | 'createdAt'>) => {
    if (!user?.id) return;

    try {
      if (editingMember) {
        // Update existing member
        await updateTeamMember(user.id, editingMember.id, data);
      } else {
        // Add new member
        await addTeamMember(user.id, data);
      }
      setIsModalOpen(false);
      setEditingMember(undefined);
    } catch (error) {
      console.error('Failed to save team member:', error);
    }
  };

  if (isLoading && members.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6"
    >
      <TeamsGrid
        members={members}
        onAddClick={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Add/Edit Modal */}
      <AddTeamMemberModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMember(undefined);
        }}
        onSave={handleSave}
        initialData={editingMember}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteConfirm(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-[#1a1a2e] border border-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-2">Delete Team Member</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to remove this team member? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default TeamsSection;
