import type { Message } from '@/types/organization';

interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
}

export const MessageBubble = ({ message, isSent }: MessageBubbleProps) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
  };

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isSent
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
            : 'bg-gray-800 text-gray-100'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <p
          className={`text-xs mt-2 ${
            isSent ? 'text-blue-100' : 'text-gray-400'
          }`}
        >
          {formatTimestamp(message.sentAt)}
        </p>
      </div>
    </div>
  );
};
