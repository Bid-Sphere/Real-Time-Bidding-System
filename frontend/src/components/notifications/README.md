# Notifications System

## Overview

The notifications system provides real-time updates to organization users about important events in the dashboard.

## Components

### NotificationDropdown

Located in `NotificationDropdown.tsx`, this component displays:
- Notification bell icon with unread count badge
- Dropdown with recent notifications (up to 10)
- Each notification shows icon, title, message, timestamp, and unread indicator
- "Mark All as Read" action
- Navigation to relevant sections when notifications are clicked

**Props:**
- `organizationId: string` - The ID of the organization user

**Features:**
- Automatically fetches notifications on mount
- Updates unread count in real-time
- Closes dropdown when clicking outside
- Formats timestamps relative to current time (e.g., "5m ago", "2h ago")
- Color-coded icons based on notification type

## Integration

### Navbar Integration

The NotificationDropdown is integrated into the Navbar component and only displays for organization users:

```tsx
{user?.role === 'organization' && user?.id && (
  <NotificationDropdown organizationId={user.id} />
)}
```

### Chat Badge Integration

The chat navigation badge in the SidePanel automatically updates when new messages arrive through the `useChatStore`:

```tsx
{item.id === 'chat' && totalUnreadCount > 0 && (
  <motion.div className="...">
    {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
  </motion.div>
)}
```

## Notification Types

The system supports four notification types:

1. **new_project** - New projects matching organization profile
   - Icon: FileText
   - Color: Blue
   - Links to: Project Discovery section

2. **bid_status_change** - Bid status updates (shortlisted, accepted, rejected)
   - Icon: TrendingUp
   - Color: Purple
   - Links to: Analytics section with bid details

3. **new_message** - New messages from clients
   - Icon: MessageSquare
   - Color: Green
   - Links to: Chat section with conversation

4. **project_awarded** - Project awarded to organization
   - Icon: Award
   - Color: Yellow
   - Links to: Project details

## Triggering Notifications

Notifications are triggered using helper functions in `utils/notificationHelpers.ts`:

```typescript
import { createNewProjectNotification } from '@/utils/notificationHelpers';

// Trigger a notification
await createNewProjectNotification(
  userId,
  projectTitle,
  projectId
);
```

### Available Helper Functions

- `createNewProjectNotification(userId, projectTitle, projectId)`
- `createBidStatusNotification(userId, projectTitle, status, bidId)`
- `createNewMessageNotification(userId, senderName, projectTitle, conversationId)`
- `createProjectAwardedNotification(userId, projectTitle, projectId)`

## Testing

Demo functions are available in the browser console for testing:

```javascript
// Trigger individual notifications
window.demoNewProjectNotification()
window.demoBidStatusNotification('shortlisted')
window.demoNewMessageNotification()
window.demoProjectAwardedNotification()

// Trigger all notifications at once
window.demoAllNotifications()
```

## State Management

The notification system uses Zustand for state management (`useNotificationStore`):

**State:**
- `notifications: Notification[]` - Array of all notifications
- `unreadCount: number` - Count of unread notifications
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message if any

**Actions:**
- `fetchNotifications(orgId, unreadOnly?, limit?)` - Fetch notifications
- `markAsRead(notificationId)` - Mark single notification as read
- `markAllAsRead(orgId)` - Mark all notifications as read
- `createNotification(notification)` - Create a new notification

## Future Enhancements

When WebSocket integration is added:

1. Real-time notification push without polling
2. Typing indicators in chat
3. Live bid updates
4. Instant notification delivery

The current implementation is designed to easily integrate with WebSocket events by calling the same helper functions when events are received.

## Requirements Validation

This implementation satisfies the following requirements:

- **9.1**: Notification bell icon with unread count badge ✓
- **9.2**: Dropdown showing recent notifications ✓
- **9.3**: Notifications for new projects, bid status changes, new messages ✓
- **9.4**: Each notification displays icon, message, timestamp ✓
- **9.5**: Click notification to navigate and mark as read ✓
- **9.6**: Chat navigation badge updates with new messages ✓
- **9.7**: Mock data with defined API contract ✓
