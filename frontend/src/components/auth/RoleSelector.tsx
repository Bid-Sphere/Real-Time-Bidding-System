import { motion } from 'framer-motion';
import { Building2, User, Briefcase } from 'lucide-react';
import type { UserRole } from '@/types/user';

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onSelectRole: (role: UserRole) => void;
}

const roles = [
  {
    value: 'client' as UserRole,
    label: 'Client',
    description: 'Post projects and receive bids',
    icon: User,
  },
  {
    value: 'organization' as UserRole,
    label: 'Organization',
    description: 'Bid on projects with your team',
    icon: Building2,
  },
  {
    value: 'freelancer' as UserRole,
    label: 'Freelancer',
    description: 'Bid on projects independently',
    icon: Briefcase,
  },
];

export const RoleSelector = ({ selectedRole, onSelectRole }: RoleSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Select Your Role
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                  ? 'border-primary-main bg-primary-main/5 dark:bg-primary-main/10'
                  : 'border-gray-200 bg-white hover:border-primary-main/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-main/50'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`
                  rounded-full p-3
                  ${isSelected
                    ? 'bg-primary-main text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
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
                      ? 'text-primary-main'
                      : 'text-gray-900 dark:text-white'
                    }
                  `}
                >
                  {role.label}
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {role.description}
                </p>
              </div>
              {isSelected && (
                <motion.div
                  className="absolute right-3 top-3 h-5 w-5 rounded-full bg-primary-main"
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
