import type { Conversation } from '@/types/organization';
import { MessageCircle } from 'lucide-react';

interface ChatListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  isLoading?: boolean;
}

export const ChatList = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  isLoading = false,
}: ChatListProps) => {
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="w-80 border-r border-gray-800 bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="w-80 border-r border-gray-800 bg-[#0a0a0f] flex items-center justify-center p-6">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            No conversations yet. Mark a project as interested or submit a bid to start chatting!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-gray-800 bg-[#0a0a0f] overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold text-white">Messages</h2>
        <p className="text-sm text-gray-400 mt-1">
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Conversations List */}
      <div className="divide-y divide-gray-800">
        {conversations.map((conversation) => {
          const isActive = conversation.id === activeConversationId;
          const hasUnread = conversation.unreadCount > 0;

          return (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full px-4 py-4 text-left hover:bg-gray-900/50 transition-colors ${
                isActive ? 'bg-gray-900 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-lg">
                    {conversation.clientName.charAt(0)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3
                      className={`font-semibold truncate ${
                        hasUnread ? 'text-white' : 'text-gray-300'
                      }`}
                    >
                      {conversation.clientName}
                    </h3>
                    {conversation.lastMessageAt && (
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatTimestamp(conversation.lastMessageAt)}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mb-1 truncate">
                    {conversation.projectTitle}
                  </p>

                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm truncate ${
                        hasUnread ? 'text-gray-300 font-medium' : 'text-gray-500'
                      }`}
                    >
                      {conversation.lastMessage
                        ? truncateMessage(conversation.lastMessage)
                        : 'No messages yet'}
                    </p>

                    {/* Unread Badge */}
                    {hasUnread && (
                      <span className="ml-2 bg-blue-600 text-white text-xs font-bold rounded-full px-2 py-0.5 flex-shrink-0">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
