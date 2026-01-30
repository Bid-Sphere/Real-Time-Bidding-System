import toast from 'react-hot-toast';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  message: string;
  type: ToastType;
  duration?: number; // milliseconds, default 3000
}

/**
 * Display a toast notification
 */
export const showToast = (options: ToastOptions): void => {
  const { message, type, duration = 3000 } = options;

  const toastOptions = {
    duration,
    position: 'top-right' as const,
  };

  switch (type) {
    case 'success':
      toast.success(message, {
        ...toastOptions,
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });
      break;
    case 'error':
      toast.error(message, {
        ...toastOptions,
        duration: 4000, // Longer for errors
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
      break;
    case 'info':
      toast(message, {
        ...toastOptions,
        style: {
          background: '#3B82F6',
          color: '#fff',
        },
      });
      break;
    case 'warning':
      toast(message, {
        ...toastOptions,
        style: {
          background: '#F59E0B',
          color: '#fff',
        },
      });
      break;
  }
};

/**
 * Display a success toast notification
 */
export const showSuccessToast = (message: string): void => {
  showToast({ message, type: 'success' });
};

/**
 * Display an error toast notification
 */
export const showErrorToast = (message: string): void => {
  showToast({ message, type: 'error' });
};

/**
 * Convert technical errors to user-friendly messages
 */
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    // Map common error patterns to friendly messages
    const message = error.message.toLowerCase();

    if (message.includes('network') || message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (message.includes('unauthorized') || message.includes('401')) {
      return 'Session expired. Please log in again.';
    }
    if (message.includes('forbidden') || message.includes('403')) {
      return 'You do not have permission to perform this action.';
    }
    if (message.includes('not found') || message.includes('404')) {
      return 'The requested resource was not found.';
    }
    if (message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }

    // Return original message if no pattern matches
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};
