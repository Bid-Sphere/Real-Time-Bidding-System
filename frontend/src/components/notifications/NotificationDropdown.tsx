/**
 * NotificationDropdown Component
 * Organization Dashboard - Notifications System
 * 
 * Requirements: 9.1-9.5
 * 
 * Features:
 * - Notification bell icon with unread count badge
 * - Dropdown showing recent notifications
 * - Each notification displays icon, message, timestamp, unread indicator
 * - Click notification to navigate and mark as read
 * - "Mark All as Read" action
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, MessageSquare, FileText, Award, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '@/store/useNotificationStore';
import type { Notification } from '@/types/organization';

interface NotificationDropdownProps {
  organizationId: string;
}

export default function NotificationDropdown({ organizationId }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { 
    notifications, 
    unreadCount, 
    isLoading,
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotificationStore();

  // Fetch notifications on mount
  useEffect(() => {
    if (organizationId) {
      fetchNotifications(organizationId);
    }
  }, [organizationId, fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get icon for notification type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_project':
        return <FileText className="w-4 h-4" />;
      case 'bid_status_change':
        return <TrendingUp className="w-4 h-4" />;
      case 'new_message':
        return <MessageSquare className="w-4 h-4" />;
      case 'project_awarded':
        return <Award className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  // Get icon color for notification type
  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'new_project':
        return 'text-blue-400 bg-blue-500/10';
      case 'bid_status_change':
        return 'text-purple-400 bg-purple-500/10';
      case 'new_message':
        return 'text-green-400 bg-green-500/10';
      case 'project_awarded':
        return 'text-yellow-400 bg-yellow-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Handle notification click
  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate to relevant section
    if (notification.link) {
      navigate(notification.link);
    }

    // Close dropdown
    setIsOpen(false);
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    await markAllAsRead(organizationId);
  };

  // Get recent notifications (limit to 10)
  const recentNotifications = notifications.slice(0, 10);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 rounded-lg transition-colors duration-200"
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell className="w-5 h-5" />
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-[380px] max-h-[500px] rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-light)] bg-white/5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              
              {/* Mark All as Read Button */}
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-[var(--accent-blue)] hover:text-[var(--accent-purple)] transition-colors duration-200"
                >
                  <CheckCheck className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[420px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-[var(--accent-blue)] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : recentNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <Bell className="w-12 h-12 text-[var(--text-muted)] mb-3" />
                  <p className="text-sm text-[var(--text-muted)] text-center">
                    No notifications yet
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border-light)]">
                  {recentNotifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`
                        w-full flex items-start gap-3 px-4 py-3 text-left
                        hover:bg-white/5 transition-colors duration-200
                        ${!notification.read ? 'bg-blue-500/5' : ''}
                      `}
                    >
                      {/* Icon */}
                      <div className={`
                        flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                        ${getIconColor(notification.type)}
                      `}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`
                          text-sm font-medium mb-0.5
                          ${!notification.read ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}
                        `}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          {formatTimestamp(notification.createdAt)}
                        </p>
                      </div>

                      {/* Unread Indicator */}
                      {!notification.read && (
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[var(--accent-blue)] mt-2" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - View All Link */}
            {recentNotifications.length > 0 && (
              <div className="border-t border-[var(--border-light)] bg-white/5">
                <button
                  onClick={() => {
                    navigate('/organization-dashboard/notifications');
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 text-sm font-medium text-[var(--accent-blue)] hover:text-[var(--accent-purple)] transition-colors duration-200"
                >
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
