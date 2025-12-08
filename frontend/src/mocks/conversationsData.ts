import type { Conversation } from '@/types/organization';

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    projectId: 'proj-2',
    projectTitle: 'Mobile Banking App',
    clientId: 'client-2',
    clientName: 'FinanceBank',
    clientAvatar: '/avatars/financebank.png',
    organizationId: 'org-1',
    lastMessage: 'Thanks for the update. When can we schedule a demo?',
    lastMessageAt: '2024-12-07T15:30:00Z',
    unreadCount: 2,
    createdAt: '2024-11-26T10:30:00Z'
  },
  {
    id: 'conv-2',
    projectId: 'proj-7',
    projectTitle: 'Healthcare Management System',
    clientId: 'client-7',
    clientName: 'MediCare Clinic',
    clientAvatar: '/avatars/medicare.png',
    organizationId: 'org-1',
    lastMessage: 'Congratulations! We would like to proceed with your proposal.',
    lastMessageAt: '2024-12-06T11:00:00Z',
    unreadCount: 0,
    createdAt: '2024-12-01T09:15:00Z'
  },
  {
    id: 'conv-3',
    projectId: 'proj-4',
    projectTitle: 'AI-Powered Chatbot Development',
    clientId: 'client-4',
    clientName: 'SupportHub',
    clientAvatar: '/avatars/supporthub.png',
    organizationId: 'org-1',
    lastMessage: 'Can you provide more details about your NLP approach?',
    lastMessageAt: '2024-12-05T14:20:00Z',
    unreadCount: 1,
    createdAt: '2024-11-29T16:20:00Z'
  },
  {
    id: 'conv-4',
    projectId: 'proj-10',
    projectTitle: 'Educational Learning Platform',
    clientId: 'client-10',
    clientName: 'EduLearn',
    clientAvatar: '/avatars/edulearn.png',
    organizationId: 'org-1',
    lastMessage: 'Your proposal looks promising. We have a few questions.',
    lastMessageAt: '2024-12-04T10:15:00Z',
    unreadCount: 0,
    createdAt: '2024-12-01T15:30:00Z'
  },
  {
    id: 'conv-5',
    projectId: 'proj-21',
    projectTitle: 'Customer Support Ticketing System',
    clientId: 'client-21',
    clientName: 'SupportDesk',
    clientAvatar: '/avatars/supportdesk.png',
    organizationId: 'org-1',
    lastMessage: 'We are reviewing all proposals and will get back to you soon.',
    lastMessageAt: '2024-12-03T16:45:00Z',
    unreadCount: 0,
    createdAt: '2024-12-01T10:15:00Z'
  }
];
