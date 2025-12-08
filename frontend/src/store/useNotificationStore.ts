import { create } from 'zustand';
import type { Notification } from '@/types/organization';
import { mockApiService } from '@/mocks/mockApiService';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchNotifications: (orgId: string, unreadOnly?: boolean, limit?: number) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (orgId: string) => Promise<void>;
  createNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async (orgId: string, unreadOnly: boolean = false, limit?: number) => {
    set({ isLoading: true, error: null });
    try {
      const notifications = await mockApiService.notifications.getNotifications(orgId, unreadOnly, limit);
      
      // Calculate unread count
      const unreadCount = notifications.filter(n => !n.read).length;
      
      set({ 
        notifications,
        unreadCount,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch notifications', 
        isLoading: false 
      });
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      await mockApiService.notifications.markAsRead(notificationId);
      
      // Update the notification in local state
      const notifications = get().notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      
      // Recalculate unread count
      const unreadCount = notifications.filter(n => !n.read).length;
      
      set({ notifications, unreadCount });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to mark notification as read'
      });
      throw error;
    }
  },

  markAllAsRead: async (orgId: string) => {
    set({ isLoading: true, error: null });
    try {
      await mockApiService.notifications.markAllAsRead(orgId);
      
      // Update all notifications in local state
      const notifications = get().notifications.map(n => ({ ...n, read: true }));
      
      set({ 
        notifications,
        unreadCount: 0,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to mark all notifications as read', 
        isLoading: false 
      });
      throw error;
    }
  },

  createNotification: async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    try {
      const newNotification = await mockApiService.notifications.createNotification(notification);
      
      // Add to local state
      const notifications = [newNotification, ...get().notifications];
      const unreadCount = notifications.filter(n => !n.read).length;
      
      set({ notifications, unreadCount });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create notification'
      });
      throw error;
    }
  },
}));
