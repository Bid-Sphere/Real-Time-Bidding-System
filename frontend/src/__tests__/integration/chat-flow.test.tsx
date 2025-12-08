import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ChatSection from '@/pages/dashboard/ChatSection';
import { useChatStore } from '@/store/useChatStore';

vi.mock('@/store/useChatStore');

describe('Chat Flow Integration Tests', () => {
  const mockConversations = [
    {
      id: '1',
      projectId: 'proj1',
      projectTitle: 'Test Project',
      clientId: 'client1',
      clientName: 'Test Client',
      organizationId: 'org1',
      lastMessage: 'Hello there',
      lastMessageAt: new Date().toISOString(),
      unreadCount: 2,
      createdAt: new Date().toISOString(),
    },
  ];

  const mockMessages = [
    {
      id: '1',
      conversationId: '1',
      senderId: 'client1',
      senderName: 'Test Client',
      senderRole: 'client' as const,
      content: 'Hello there',
      sentAt: new Date().toISOString(),
    },
    {
      id: '2',
      conversationId: '1',
      senderId: 'org1',
      senderName: 'Test Org',
      senderRole: 'organization' as const,
      content: 'Hi, how can I help?',
      sentAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (useChatStore as any).mockReturnValue({
      conversations: mockConversations,
      activeConversation: null,
      messages: [],
      isLoading: false,
      fetchConversations: vi.fn(),
      fetchMessages: vi.fn(),
      sendMessage: vi.fn(),
      markAsRead: vi.fn(),
    });
  });

  it('should display list of conversations', () => {
    render(
      <BrowserRouter>
        <ChatSection />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Client')).toBeInTheDocument();
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('should display unread count badge on conversations', () => {
    render(
      <BrowserRouter>
        <ChatSection />
      </BrowserRouter>
    );

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should load messages when conversation is selected', async () => {
    const mockFetchMessages = vi.fn();
    (useChatStore as any).mockReturnValue({
      conversations: mockConversations,
      activeConversation: mockConversations[0],
      messages: mockMessages,
      isLoading: false,
      fetchConversations: vi.fn(),
      fetchMessages: mockFetchMessages,
      sendMessage: vi.fn(),
      markAsRead: vi.fn(),
    });

    render(
      <BrowserRouter>
        <ChatSection />
      </BrowserRouter>
    );

    // Click on conversation
    const conversation = screen.getByText('Test Client');
    fireEvent.click(conversation);

    await waitFor(() => {
      expect(mockFetchMessages).toHaveBeenCalledWith('1');
    });
  });

  it('should display messages in chat window', () => {
    (useChatStore as any).mockReturnValue({
      conversations: mockConversations,
      activeConversation: mockConversations[0],
      messages: mockMessages,
      isLoading: false,
      fetchConversations: vi.fn(),
      fetchMessages: vi.fn(),
      sendMessage: vi.fn(),
      markAsRead: vi.fn(),
    });

    render(
      <BrowserRouter>
        <ChatSection />
      </BrowserRouter>
    );

    expect(screen.getByText('Hello there')).toBeInTheDocument();
    expect(screen.getByText('Hi, how can I help?')).toBeInTheDocument();
  });

  it('should allow sending messages', async () => {
    const mockSendMessage = vi.fn();
    (useChatStore as any).mockReturnValue({
      conversations: mockConversations,
      activeConversation: mockConversations[0],
      messages: mockMessages,
      isLoading: false,
      fetchConversations: vi.fn(),
      fetchMessages: vi.fn(),
      sendMessage: mockSendMessage,
      markAsRead: vi.fn(),
    });

    render(
      <BrowserRouter>
        <ChatSection />
      </BrowserRouter>
    );

    // Find message input
    const messageInput = screen.getByPlaceholderText(/Type your message/i);
    fireEvent.change(messageInput, { target: { value: 'New message' } });

    // Find and click send button
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith('1', 'New message');
    });
  });

  it('should mark conversation as read when opened', async () => {
    const mockMarkAsRead = vi.fn();
    (useChatStore as any).mockReturnValue({
      conversations: mockConversations,
      activeConversation: mockConversations[0],
      messages: mockMessages,
      isLoading: false,
      fetchConversations: vi.fn(),
      fetchMessages: vi.fn(),
      sendMessage: vi.fn(),
      markAsRead: mockMarkAsRead,
    });

    render(
      <BrowserRouter>
        <ChatSection />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockMarkAsRead).toHaveBeenCalledWith('1');
    });
  });
});
