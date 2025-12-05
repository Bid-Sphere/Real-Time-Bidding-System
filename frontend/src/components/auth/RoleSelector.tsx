import { motion } from 'framer-motion';
import { Building2, User } from 'lucide-react';
import type { UserRole } from '@/types/user';

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onSelectRole: (role: UserRole) => void;
}

const roles = [
  {
    value: 'client' as UserRole,
    label: 'Client',
    description: 'Post tasks and receive bids',
    icon: User,
  },
  {
    value: 'organization' as UserRole,
    label: 'Organization',
    description: 'Company account for team projects',
    icon: Building2,
  },
];

export const RoleSelector = ({ selectedRole, onSelectRole }: RoleSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] text-center">
        Select Your Role
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-xl mx-auto">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.value;

          return (
            <motion.button
              key={role.value}
              type="button"
              onClick={() => onSelectRole(role.value)}
              className={`
                relative flex flex-col items-center gap-3 rounded-xl border-2 p-6 text-center transition-all
                ${isSelected
                  ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10'
                  : 'border-[var(--border-light)] bg-[var(--bg-elevated)] hover:border-[var(--accent-blue)]/50'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`
                  rounded-full p-3
                  ${isSelected
                    ? 'bg-[var(--accent-blue)] text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                  }
                `}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p
                  className={`
                    font-semibold
                    ${isSelected
                      ? 'text-[var(--accent-blue)]'
                      : 'text-[var(--text-primary)]'
                    }
                  `}
                >
                  {role.label}
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {role.description}
                </p>
              </div>
              {isSelected && (
                <motion.div
                  className="absolute right-3 top-3 h-5 w-5 rounded-full bg-[var(--accent-blue)]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
