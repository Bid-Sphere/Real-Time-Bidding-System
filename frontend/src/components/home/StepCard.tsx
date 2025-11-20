interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const StepCard = ({ stepNumber, title, description, icon }: StepCardProps) => {
  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Step number badge */}
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary-main to-info-main text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10">
        {stepNumber}
      </div>

      {/* Icon container */}
      <div className="mb-6 w-24 h-24 bg-gradient-to-br from-primary-main/10 to-info-main/10 dark:from-primary-main/20 dark:to-info-main/20 rounded-2xl flex items-center justify-center text-primary-main shadow-md">
        <div className="w-12 h-12">
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
        {description}
      </p>
    </div>
  );
};
