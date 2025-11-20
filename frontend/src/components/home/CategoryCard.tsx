import Card from '@/components/ui/Card';
import { Badge } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  projectCount: number;
  onClick: () => void;
}

export const CategoryCard = ({
  title,
  description,
  icon,
  projectCount,
  onClick,
}: CategoryCardProps) => {
  return (
    <Card
      variant="elevated"
      hoverable
      clickable
      onClick={onClick}
      className="h-full cursor-pointer group"
      role="button"
      aria-label={`Explore ${title} - ${projectCount} active projects`}
    >
        <div className="p-8">
          {/* Icon with gradient background */}
          <div 
            className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-main to-info-main text-white shadow-lg shadow-primary-main/30 group-hover:shadow-xl group-hover:shadow-primary-main/40 transition-shadow duration-200"
            aria-hidden="true"
          >
            <div className="w-8 h-8">
              {icon}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-main dark:group-hover:text-primary-light transition-colors duration-200">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            {description}
          </p>

          {/* Project count badge */}
          <div className="flex items-center gap-2 text-sm" aria-label={`${projectCount} active projects`}>
            <Badge className="w-4 h-4 text-primary-main" aria-hidden="true" />
            <span className="font-semibold text-primary-main">
              {projectCount} Active Projects
            </span>
          </div>
        </div>
    </Card>
  );
};
