import type { Activity } from '@/types/organization';

export const mockActivities: Activity[] = [
  {
    id: 'activity-1',
    type: 'project_awarded',
    description: 'Won the Healthcare Management System project',
    icon: '🎉',
    timestamp: '2024-12-06T11:00:00Z',
    link: '/dashboard/organization/analytics'
  },
  {
    id: 'activity-2',
    type: 'bid_submitted',
    description: 'Submitted bid for Cryptocurrency Trading Bot',
    icon: '📝',
    timestamp: '2024-12-04T16:00:00Z',
    link: '/dashboard/organization/analytics'
  },
  {
    id: 'activity-3',
    type: 'bid_submitted',
    description: 'Submitted bid for Real Estate Listing Platform',
    icon: '📝',
    timestamp: '2024-12-04T10:00:00Z',
    link: '/dashboard/organization/analytics'
  },
  {
    id: 'activity-4',
    type: 'message_received',
    description: 'Received message from FinanceBank',
    icon: '💬',
    timestamp: '2024-12-03T10:15:00Z',
    link: '/dashboard/organization/chat/conv-1'
  },
  {
    id: 'activity-5',
    type: 'bid_submitted',
    description: 'Submitted bid for E-commerce Platform Development',
    icon: '📝',
    timestamp: '2024-12-03T14:45:00Z',
    link: '/dashboard/organization/analytics'
  },
  {
    id: 'activity-6',
    type: 'message_received',
    description: 'Received message from SupportDesk',
    icon: '💬',
    timestamp: '2024-12-03T16:45:00Z',
    link: '/dashboard/organization/chat/conv-5'
  },
  {
    id: 'activity-7',
    type: 'bid_submitted',
    description: 'Submitted bid for Event Management Platform',
    icon: '📝',
    timestamp: '2024-12-02T14:30:00Z',
    link: '/dashboard/organization/analytics'
  },
  {
    id: 'activity-8',
    type: 'bid_submitted',
    description: 'Submitted bid for Social Media Analytics Dashboard',
    icon: '📝',
    timestamp: '2024-12-02T13:20:00Z',
    link: '/dashboard/organization/analytics'
  },
  {
    id: 'activity-9',
    type: 'profile_updated',
    description: 'Updated organization profile',
    icon: '✏️',
    timestamp: '2024-12-01T14:30:00Z',
    link: '/dashboard/organization/profile'
  },
  {
    id: 'activity-10',
    type: 'bid_submitted',
    description: 'Submitted bid for Healthcare Management System',
    icon: '📝',
    timestamp: '2024-12-01T09:15:00Z',
    link: '/dashboard/organization/analytics'
  }
];
