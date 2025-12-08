import { useState, useEffect, useRef } from 'react';
import type { Conversation, Message } from '@/types/organization';
import { MessageBubble } from './MessageBubble';
import { Send } from 'lucide-react';

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

export const ChatWindow = ({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
  isLoading = false,
}: ChatWindowProps) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && conversation) {
      onSendMessage(messageInput.trim());
      setMessageInput('');
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Select a conversation
          </h3>
          <p className="text-gray-400">
            Choose a conversation from the list to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0f]">
      {/* Chat Header */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-semibold">
              {conversation.clientName.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {conversation.clientName}
            </h3>
            <p className="text-sm text-gray-400">{conversation.projectTitle}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isSent={message.senderId === currentUserId}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* WebSocket Placeholder Notice */}
      <div className="px-6 py-2 bg-blue-900/20 border-t border-blue-800/30">
        <p className="text-xs text-blue-300 text-center">
          💡 Real-time messaging via WebSocket will be integrated in the next phase
        </p>
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-800 px-6 py-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 text-white rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-6 py-3 font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center gap-2 min-h-[44px]"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </form>
    </div>
  );
};
