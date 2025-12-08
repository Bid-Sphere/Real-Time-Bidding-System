/**
 * Notification Helper Functions
 * Organization Dashboard - Notifications System
 * 
 * Helper functions to trigger notifications on dashboard events
 * 
 * INTEGRATION NOTES:
 * ==================
 * These functions are designed to be called when specific events occur:
 * 
 * 1. New Matching Projects (Requirement 9.3):
 *    - Called when backend detects a new project matching organization profile
 *    - In production: WebSocket event or polling mechanism
 *    - In mock: Can be triggered manually or via mock data updates
 * 
 * 2. Bid Status Changes (Requirement 9.3):
 *    - Called when client updates bid status (shortlisted, accepted, rejected)
 *    - In production: WebSocket event from backend
 *    - In mock: Simulated via mock API service
 * 
 * 3. New Messages (Requirement 9.3, 9.6):
 *    - Called when a new message arrives in a conversation
 *    - Updates both notification dropdown and chat navigation badge
 *    - In production: WebSocket event
 *    - In mock: Triggered when mock messages are created
 * 
 * The notification system automatically:
 * - Updates the notification bell badge with unread count
 * - Updates the chat navigation badge when new messages arrive
 * - Allows navigation to relevant sections when notifications are clicked
 * - Supports "Mark All as Read" functionality
 */

import { useNotificationStore } from '@/store/useNotificationStore';

/**
 * Create a notification for a new matching project
 */
export const createNewProjectNotification = async (
  userId: string,
  projectTitle: string,
  projectId: string
) => {
  const { createNotification } = useNotificationStore.getState();
  
  await createNotification({
    userId,
    type: 'new_project',
    title: 'New Matching Project',
    message: `A new project "${projectTitle}" matches your profile and expertise.`,
    link: `/organization-dashboard/projects?highlight=${projectId}`,
    read: false,
  });
};

/**
 * Create a notification for bid status change
 */
export const createBidStatusNotification = async (
  userId: string,
  projectTitle: string,
  status: 'shortlisted' | 'accepted' | 'rejected',
  bidId: string
) => {
  const { createNotification } = useNotificationStore.getState();
  
  const statusMessages = {
    shortlisted: `Your bid for "${projectTitle}" has been shortlisted!`,
    accepted: `Congratulations! Your bid for "${projectTitle}" has been accepted.`,
    rejected: `Your bid for "${projectTitle}" was not selected this time.`,
  };
  
  await createNotification({
    userId,
    type: 'bid_status_change',
    title: 'Bid Status Update',
    message: statusMessages[status],
    link: `/organization-dashboard/analytics?bid=${bidId}`,
    read: false,
  });
};

/**
 * Create a notification for a new message
 */
export const createNewMessageNotification = async (
  userId: string,
  senderName: string,
  projectTitle: string,
  conversationId: string
) => {
  const { createNotification } = useNotificationStore.getState();
  
  await createNotification({
    userId,
    type: 'new_message',
    title: 'New Message',
    message: `${senderName} sent you a message about "${projectTitle}".`,
    link: `/organization-dashboard/chat/${conversationId}`,
    read: false,
  });
};

/**
 * Create a notification for project awarded
 */
export const createProjectAwardedNotification = async (
  userId: string,
  projectTitle: string,
  projectId: string
) => {
  const { createNotification } = useNotificationStore.getState();
  
  await createNotification({
    userId,
    type: 'project_awarded',
    title: 'Project Awarded',
    message: `You've been awarded the project "${projectTitle}". Time to get started!`,
    link: `/organization-dashboard/projects/${projectId}`,
    read: false,
  });
};

/**
 * Trigger notification when chat badge should update
 * This is called when new messages arrive
 */
export const updateChatBadge = (unreadCount: number) => {
  // The SidePanel already listens to the chat store's totalUnreadCount
  // This function is here for future WebSocket integration
  // For now, the badge updates automatically through the store
  return unreadCount;
};
