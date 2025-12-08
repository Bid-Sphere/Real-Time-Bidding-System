import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import type { TeamMember } from '@/types/organization';
import Input from '@/components/ui/Input';
import MultiSelect from '@/components/ui/MultiSelect';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<TeamMember, 'id' | 'organizationId' | 'createdAt'>) => void;
  initialData?: TeamMember;
}

// Common skills for suggestions
const SKILL_OPTIONS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'C++',
  'Go',
  'Rust',
  'SQL',
  'MongoDB',
  'PostgreSQL',
  'AWS',
  'Azure',
  'Docker',
  'Kubernetes',
  'GraphQL',
  'REST API',
  'UI/UX Design',
  'Project Management',
  'Agile',
  'Scrum',
  'DevOps',
  'CI/CD',
  'Machine Learning',
  'Data Science',
  'Mobile Development',
  'iOS',
  'Android',
  'Flutter',
  'React Native',
];

export const AddTeamMemberModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddTeamMemberModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    skills: [] as string[],
    bio: '',
    avatar: '',
    linkedIn: '',
    portfolio: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form with initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        role: initialData.role,
        skills: initialData.skills,
        bio: initialData.bio || '',
        avatar: initialData.avatar || '',
        linkedIn: initialData.linkedIn || '',
        portfolio: initialData.portfolio || '',
      });
    } else {
      // Reset form when adding new member
      setFormData({
        name: '',
        role: '',
        skills: [],
        bio: '',
        avatar: '',
        linkedIn: '',
        portfolio: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }

    if (formData.linkedIn && !formData.linkedIn.match(/^https?:\/\//)) {
      newErrors.linkedIn = 'LinkedIn URL must start with http:// or https://';
    }

    if (formData.portfolio && !formData.portfolio.match(/^https?:\/\//)) {
      newErrors.portfolio = 'Portfolio URL must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave({
      name: formData.name.trim(),
      role: formData.role.trim(),
      skills: formData.skills,
      bio: formData.bio.trim() || undefined,
      avatar: formData.avatar.trim() || undefined,
      linkedIn: formData.linkedIn.trim() || undefined,
      portfolio: formData.portfolio.trim() || undefined,
    });

    onClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      role: '',
      skills: [],
      bio: '',
      avatar: '',
      linkedIn: '',
      portfolio: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-[#1a1a2e] border border-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-white">
                  {initialData ? 'Edit Team Member' : 'Add Team Member'}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Name */}
                <Input
                  label="Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                  required
                  placeholder="Enter team member name"
                />

                {/* Role */}
                <Input
                  label="Role"
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  error={errors.role}
                  required
                  placeholder="e.g., Senior Developer, Project Manager"
                />

                {/* Skills */}
                <MultiSelect
                  label="Skills"
                  options={SKILL_OPTIONS}
                  value={formData.skills}
                  onChange={(skills) => setFormData({ ...formData, skills })}
                  error={errors.skills}
                  required
                  placeholder="Type to add skills..."
                  helperText="Press Enter to add custom skills"
                />

                {/* Bio */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-white">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Brief description of the team member..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-700 bg-[#0a0a0f] text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none"
                  />
                </div>

                {/* Avatar Upload Placeholder */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-white">
                    Avatar URL
                  </label>
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="https://example.com/avatar.jpg"
                      className="flex-1"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors flex items-center gap-2"
                      disabled
                      title="File upload will be available after backend integration"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    File upload will be available after backend integration
                  </span>
                </div>

                {/* LinkedIn */}
                <Input
                  label="LinkedIn Profile"
                  type="url"
                  value={formData.linkedIn}
                  onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                  error={errors.linkedIn}
                  placeholder="https://linkedin.com/in/username"
                />

                {/* Portfolio */}
                <Input
                  label="Portfolio Website"
                  type="url"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  error={errors.portfolio}
                  placeholder="https://portfolio.com"
                />

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all font-medium shadow-lg shadow-blue-500/25"
                  >
                    {initialData ? 'Save Changes' : 'Add Member'}
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
