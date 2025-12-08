import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useChatStore } from '@/store/useChatStore';
import { useOrganizationStore } from '@/store/useOrganizationStore';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';

const ChatSection = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(
    conversationId
  );

  const {
    conversations,
    activeConversation,
    messages,
    isLoading,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markAsRead,
  } = useChatStore();

  const { profile } = useOrganizationStore();

  // Fetch conversations on mount
  useEffect(() => {
    if (profile?.id) {
      fetchConversations(profile.id);
    }
  }, [profile?.id, fetchConversations]);

  // Handle conversation selection
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    
    // Find and set the active conversation
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      fetchMessages(id);
      markAsRead(id);
    }
  };

  // Handle URL parameter changes
  useEffect(() => {
    if (conversationId && conversationId !== activeConversationId) {
      handleSelectConversation(conversationId);
    }
  }, [conversationId]);

  // Handle sending messages
  const handleSendMessage = async (content: string) => {
    if (activeConversationId) {
      await sendMessage(activeConversationId, content);
    }
  };

  // Get current user ID from profile
  const currentUserId = profile?.userId || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-[calc(100vh-4rem)]"
    >
      <ChatList
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        isLoading={isLoading && conversations.length === 0}
      />
      <ChatWindow
        conversation={activeConversation}
        messages={messages}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
        isLoading={isLoading && messages.length === 0 && !!activeConversation}
      />
    </motion.div>
  );
};

export default ChatSection;
