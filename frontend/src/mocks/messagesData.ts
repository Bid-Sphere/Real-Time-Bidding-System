import type { Message } from '@/types/organization';

export const mockMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'org-1',
      senderName: 'TechSolutions Inc.',
      senderRole: 'organization',
      content: 'Thank you for considering our proposal. We are excited about the opportunity to work on your mobile banking app.',
      sentAt: '2024-11-26T11:00:00Z',
      readAt: '2024-11-26T11:15:00Z'
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      senderId: 'client-2',
      senderName: 'FinanceBank',
      senderRole: 'client',
      content: 'We reviewed your portfolio and are impressed with your previous work. Can you tell us more about your security approach?',
      sentAt: '2024-11-27T09:30:00Z',
      readAt: '2024-11-27T10:00:00Z'
    },
    {
      id: 'msg-3',
      conversationId: 'conv-1',
      senderId: 'org-1',
      senderName: 'TechSolutions Inc.',
      senderRole: 'organization',
      content: 'Absolutely! We implement end-to-end encryption, biometric authentication, and follow OWASP security guidelines. We also conduct regular security audits and penetration testing.',
      sentAt: '2024-11-27T14:20:00Z',
      readAt: '2024-11-27T14:35:00Z'
    },
    {
      id: 'msg-4',
      conversationId: 'conv-1',
      senderId: 'client-2',
      senderName: 'FinanceBank',
      senderRole: 'client',
      content: 'That sounds great. We are moving forward with shortlisting your proposal.',
      sentAt: '2024-12-02T14:20:00Z',
      readAt: '2024-12-02T15:00:00Z'
    },
    {
      id: 'msg-5',
      conversationId: 'conv-1',
      senderId: 'org-1',
      senderName: 'TechSolutions Inc.',
      senderRole: 'organization',
      content: 'Thank you! We have started preparing a detailed project plan and timeline.',
      sentAt: '2024-12-03T10:15:00Z',
      readAt: '2024-12-03T11:00:00Z'
    },
    {
      id: 'msg-6',
      conversationId: 'conv-1',
      senderId: 'client-2',
      senderName: 'FinanceBank',
      senderRole: 'client',
      content: 'Thanks for the update. When can we schedule a demo?',
      sentAt: '2024-12-07T15:30:00Z'
    }
  ],
  'conv-2': [
    {
      id: 'msg-7',
      conversationId: 'conv-2',
      senderId: 'org-1',
      senderName: 'TechSolutions Inc.',
      senderRole: 'organization',
      content: 'We are very interested in your healthcare management system project. Our team has extensive experience with HIPAA-compliant solutions.',
      sentAt: '2024-12-01T09:30:00Z',
      readAt: '2024-12-01T10:00:00Z'
    },
    {
      id: 'msg-8',
      conversationId: 'conv-2',
      senderId: 'client-7',
      senderName: 'MediCare Clinic',
      senderRole: 'client',
      content: 'Your proposal stands out. Can you provide references from previous healthcare clients?',
      sentAt: '2024-12-02T11:15:00Z',
      readAt: '2024-12-02T13:00:00Z'
    },
    {
      id: 'msg-9',
      conversationId: 'conv-2',
      senderId: 'org-1',
      senderName: 'TechSolutions Inc.',
      senderRole: 'organization',
      content: 'Of course! I will send you contact information for three healthcare clients we have worked with in the past two years.',
      sentAt: '2024-12-02T14:30:00Z',
      readAt: '2024-12-02T15:00:00Z'
    },
    {
      id: 'msg-10',
      conversationId: 'conv-2',
      senderId: 'client-7',
      senderName: 'MediCare Clinic',
      senderRole: 'client',
      content: 'Congratulations! We would like to proceed with your proposal.',
      sentAt: '2024-12-06T11:00:00Z',
      readAt: '2024-12-06T11:30:00Z'
    }
  ],
  'conv-3': [
    {
      id: 'msg-11',
      conversationId: 'conv-3',
      senderId: 'org-1',
      senderName: 'TechSolutions Inc.',
      senderRole: 'organization',
      content: 'We would love to build your AI-powered chatbot. Our team has worked on several NLP projects with excellent results.',
      sentAt: '2024-11-29T16:30:00Z',
      readAt: '2024-11-30T09:00:00Z'
    },
    {
      id: 'msg-12',
      conversationId: 'conv-3',
      senderId: 'client-4',
      senderName: 'SupportHub',
      senderRole: 'client',
      content: 'Can you provide more details about your NLP approach?',
      sentAt: '2024-12-05T14:20:00Z'
    }
  ],
  'conv-4': [
    {
      id: 'msg-13',
      conversationId: 'conv-4',
      senderId: 'org-1',
      senderName: 'TechSolutions Inc.',
      senderRole: 'organization',
      content: 'Thank you for the opportunity to bid on your educational learning platform. We have built similar platforms with great success.',
      sentAt: '2024-12-01T15:45:00Z',
      readAt: '2024-12-02T09:00:00Z'
    },
    {
      id: 'msg-14',
      conversationId: 'conv-4',
      senderId: 'client-10',
      senderName: 'EduLearn',
      senderRole: 'client',
      content: 'Your proposal looks promising. We have a few questions.',
      sentAt: '2024-12-04T10:15:00Z',
      readAt: '2024-12-04T11:00:00Z'
    }
  ],
  'conv-5': [
    {
      id: 'msg-15',
      conversationId: 'conv-5',
      senderId: 'org-1',
      senderName: 'TechSolutions Inc.',
      senderRole: 'organization',
      content: 'We are excited about your customer support ticketing system project. Our team specializes in building efficient support solutions.',
      sentAt: '2024-12-01T10:30:00Z',
      readAt: '2024-12-01T14:00:00Z'
    },
    {
      id: 'msg-16',
      conversationId: 'conv-5',
      senderId: 'client-21',
      senderName: 'SupportDesk',
      senderRole: 'client',
      content: 'We are reviewing all proposals and will get back to you soon.',
      sentAt: '2024-12-03T16:45:00Z',
      readAt: '2024-12-03T17:00:00Z'
    }
  ]
};
