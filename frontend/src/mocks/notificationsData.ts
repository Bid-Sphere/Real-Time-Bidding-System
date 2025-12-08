import type { Notification } from '@/types/organization';

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'new_message',
    title: 'New Message',
    message: 'FinanceBank sent you a message about Mobile Banking App',
    link: '/dashboard/organization/chat/conv-1',
    read: false,
    createdAt: '2024-12-07T15:30:00Z'
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'bid_status_change',
    title: 'Bid Shortlisted',
    message: 'Your bid for Mobile Banking App has been shortlisted',
    link: '/dashboard/organization/analytics',
    read: false,
    createdAt: '2024-12-02T14:20:00Z'
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'project_awarded',
    title: 'Project Awarded',
    message: 'Congratulations! You won the Healthcare Management System project',
    link: '/dashboard/organization/analytics',
    read: true,
    createdAt: '2024-12-06T11:00:00Z'
  },
  {
    id: 'notif-4',
    userId: 'user-1',
    type: 'new_message',
    title: 'New Message',
    message: 'SupportHub sent you a message about AI-Powered Chatbot Development',
    link: '/dashboard/organization/chat/conv-3',
    read: false,
    createdAt: '2024-12-05T14:20:00Z'
  },
  {
    id: 'notif-5',
    userId: 'user-1',
    type: 'new_project',
    title: 'New Matching Project',
    message: 'A new project matching your profile: Content Management System',
    link: '/dashboard/organization/projects',
    read: true,
    createdAt: '2024-12-05T09:45:00Z'
  },
  {
    id: 'notif-6',
    userId: 'user-1',
    type: 'bid_status_change',
    title: 'Bid Rejected',
    message: 'Your bid for Corporate Website Redesign was not selected',
    link: '/dashboard/organization/analytics',
    read: true,
    createdAt: '2024-12-05T09:45:00Z'
  },
  {
    id: 'notif-7',
    userId: 'user-1',
    type: 'bid_status_change',
    title: 'Bid Shortlisted',
    message: 'Your bid for Educational Learning Platform has been shortlisted',
    link: '/dashboard/organization/analytics',
    read: true,
    createdAt: '2024-12-03T16:15:00Z'
  },
  {
    id: 'notif-8',
    userId: 'user-1',
    type: 'new_project',
    title: 'New Matching Project',
    message: 'A new project matching your profile: Video Conferencing Platform',
    link: '/dashboard/organization/projects',
    read: true,
    createdAt: '2024-12-05T11:15:00Z'
  },
  {
    id: 'notif-9',
    userId: 'user-1',
    type: 'bid_status_change',
    title: 'Bid Shortlisted',
    message: 'Your bid for Customer Support Ticketing System has been shortlisted',
    link: '/dashboard/organization/analytics',
    read: true,
    createdAt: '2024-12-04T13:45:00Z'
  },
  {
    id: 'notif-10',
    userId: 'user-1',
    type: 'new_message',
    title: 'New Message',
    message: 'EduLearn sent you a message about Educational Learning Platform',
    link: '/dashboard/organization/chat/conv-4',
    read: true,
    createdAt: '2024-12-04T10:15:00Z'
  }
];
