import { create } from 'zustand';
import type { Conversation, Message, Attachment } from '@/types/organization';

interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  totalUnreadCount: number;
  
  // Actions
  fetchConversations: (orgId: string) => Promise<void>;
  setActiveConversation: (conversation: Conversation | null) => void;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string, attachments?: Attachment[]) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  isLoading: false,
  error: null,
  totalUnreadCount: 0,

  fetchConversations: async (_orgId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock data for now - replace with actual API call
      const conversations: Conversation[] = [];
      
      // Calculate total unread count
      const totalUnreadCount = conversations.reduce((sum: number, conv: Conversation) => sum + conv.unreadCount, 0);
      
      set({ 
        conversations,
        totalUnreadCount,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch conversations', 
        isLoading: false 
      });
    }
  },

  setActiveConversation: (conversation: Conversation | null) => {
    set({ activeConversation: conversation, messages: [] });
    
    // Fetch messages for the active conversation
    if (conversation) {
      get().fetchMessages(conversation.id);
    }
  },

  fetchMessages: async (_conversationId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock data for now - replace with actual API call
      const result = { messages: [] };
      set({ 
        messages: result.messages,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch messages', 
        isLoading: false 
      });
    }
  },

  sendMessage: async (conversationId: string, content: string, attachments?: Attachment[]) => {
    set({ isLoading: true, error: null });
    try {
      // Mock data for now - replace with actual API call
      const newMessage: Message = {
        id: Date.now().toString(),
        conversationId,
        content,
        senderId: 'current-user',
        senderName: 'Current User',
        senderRole: 'organization',
        sentAt: new Date().toISOString(),
        attachments: attachments || []
      };
      
      // Add the new message to the local state
      const messages = [...get().messages, newMessage];
      
      // Update the conversation's last message
      const conversations = get().conversations.map(c => 
        c.id === conversationId 
          ? { ...c, lastMessage: content, lastMessageAt: newMessage.sentAt }
          : c
      );
      
      set({ messages, conversations, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to send message', 
        isLoading: false 
      });
      throw error;
    }
  },

  markAsRead: async (conversationId: string) => {
    try {
      // Mock implementation - replace with actual API call
      // await api.markConversationAsRead(conversationId);
      
      // Update the conversation's unread count in local state
      const conversations = get().conversations.map(c => 
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      );
      
      // Recalculate total unread count
      const totalUnreadCount = conversations.reduce((sum: number, conv: Conversation) => sum + conv.unreadCount, 0);
      
      set({ conversations, totalUnreadCount });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to mark conversation as read'
      });
      throw error;
    }
  },
}));
