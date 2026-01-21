import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import authService from '@/services/authService';

interface HealthStatus {
  status: 'loading' | 'success' | 'error';
  message: string;
}

export default function BackendHealthCheck() {
  const [health, setHealth] = useState<HealthStatus>({
    status: 'loading',
    message: 'Checking backend connection...'
  });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const message = await authService.healthCheck();
        setHealth({
          status: 'success',
          message: message || 'Backend is healthy'
        });
      } catch (error: any) {
        setHealth({
          status: 'error',
          message: error.message || 'Backend connection failed'
        });
      }
    };

    checkHealth();
  }, []);

  const getIcon = () => {
    switch (health.status) {
      case 'loading':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-400" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />;
    }
  };

  const getStatusColor = () => {
    switch (health.status) {
      case 'loading':
        return 'border-blue-400/20 bg-blue-400/10';
      case 'success':
        return 'border-green-400/20 bg-green-400/10';
      case 'error':
        return 'border-red-400/20 bg-red-400/10';
    }
  };

  return (
    <div className={`p-3 rounded-lg border ${getStatusColor()} flex items-center gap-3`}>
      {getIcon()}
      <div>
        <p className="text-sm font-medium text-white">Backend Status</p>
        <p className="text-xs text-gray-300">{health.message}</p>
      </div>
    </div>
  );
}