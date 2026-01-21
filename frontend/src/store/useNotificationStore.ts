import { create } from 'zustand';
import type { Notification } from '@/types/organization';


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

  fetchNotifications: async (_orgId: string, _unreadOnly: boolean = false, _limit?: number) => {
    set({ isLoading: true, error: null });
    try {
      // Mock data for now - replace with actual API call
      const notifications: Notification[] = [];
      
      // Calculate unread count
      const unreadCount = notifications.filter((n: Notification) => !n.read).length;
      
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
      // Mock implementation - replace with actual API call
      // await api.markNotificationAsRead(notificationId);
      
      // Update the notification in local state
      const notifications = get().notifications.map((n: Notification) => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      
      // Recalculate unread count
      const unreadCount = notifications.filter((n: Notification) => !n.read).length;
      
      set({ notifications, unreadCount });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to mark notification as read'
      });
      throw error;
    }
  },

  markAllAsRead: async (_orgId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock implementation - replace with actual API call
      // await api.markAllNotificationsAsRead(orgId);
      
      // Update all notifications in local state
      const notifications = get().notifications.map((n: Notification) => ({ ...n, read: true }));
      
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
      // Mock data for now - replace with actual API call
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      // Add to local state
      const notifications = [newNotification, ...get().notifications];
      const unreadCount = notifications.filter((n: Notification) => !n.read).length;
      
      set({ notifications, unreadCount });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create notification'
      });
      throw error;
    }
  },
}));
