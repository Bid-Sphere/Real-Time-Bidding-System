import { Wifi, WifiOff, Loader2 } from 'lucide-react';

export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'reconnecting';

interface ConnectionStatusProps {
  status: ConnectionState;
  className?: string;
}

/**
 * ConnectionStatus Component
 * 
 * Displays the current SignalR connection status with appropriate icons and colors.
 * Used to provide visual feedback about real-time connection state.
 */
export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  status, 
  className = '' 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <Wifi className="h-4 w-4" />,
          text: 'Connected',
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
        };
      case 'connecting':
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          text: 'Connecting',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30',
        };
      case 'reconnecting':
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          text: 'Reconnecting',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30',
        };
      case 'disconnected':
        return {
          icon: <WifiOff className="h-4 w-4" />,
          text: 'Disconnected',
          color: 'text-red-400',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div 
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${config.color} ${config.bgColor} ${config.borderColor} ${className}`}
    >
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};

export default ConnectionStatus;
