import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';
import Card from './Card';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

/**
 * ConfirmDialog Component
 * 
 * A reusable confirmation dialog for critical actions.
 * Supports different variants (danger, warning, info) with appropriate styling.
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconColor: 'text-red-400',
          iconBg: 'bg-red-500/20',
          confirmButton: 'bg-red-500 hover:bg-red-600',
        };
      case 'warning':
        return {
          iconColor: 'text-yellow-400',
          iconBg: 'bg-yellow-500/20',
          confirmButton: 'bg-yellow-500 hover:bg-yellow-600',
        };
      case 'info':
        return {
          iconColor: 'text-blue-400',
          iconBg: 'bg-blue-500/20',
          confirmButton: 'bg-blue-500 hover:bg-blue-600',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="h-5 w-5 text-[var(--text-muted)]" />
        </button>

        {/* Icon */}
        <div className={`w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center mb-4`}>
          <AlertTriangle className={`h-6 w-6 ${styles.iconColor}`} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-[var(--text-secondary)] mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 ${styles.confirmButton}`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmDialog;
