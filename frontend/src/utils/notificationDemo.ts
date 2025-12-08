/**
 * Notification Demo Utilities
 * Organization Dashboard - Notifications System
 * 
 * Demo functions to test the notification system
 * These can be called from the browser console for testing
 */

import {
  createNewProjectNotification,
  createBidStatusNotification,
  createNewMessageNotification,
  createProjectAwardedNotification,
} from './notificationHelpers';

/**
 * Demo: Trigger a new project notification
 * Usage in console: window.demoNewProjectNotification()
 */
export const demoNewProjectNotification = async () => {
  await createNewProjectNotification(
    'user-1',
    'E-commerce Website Redesign',
    'proj-demo-1'
  );
  console.log('✅ New project notification created');
};

/**
 * Demo: Trigger a bid status change notification
 * Usage in console: window.demoBidStatusNotification('shortlisted')
 */
export const demoBidStatusNotification = async (
  status: 'shortlisted' | 'accepted' | 'rejected' = 'shortlisted'
) => {
  await createBidStatusNotification(
    'user-1',
    'Mobile App Development',
    status,
    'bid-demo-1'
  );
  console.log(`✅ Bid status notification created: ${status}`);
};

/**
 * Demo: Trigger a new message notification
 * Usage in console: window.demoNewMessageNotification()
 */
export const demoNewMessageNotification = async () => {
  await createNewMessageNotification(
    'user-1',
    'John Smith',
    'Website Redesign Project',
    'conv-demo-1'
  );
  console.log('✅ New message notification created');
};

/**
 * Demo: Trigger a project awarded notification
 * Usage in console: window.demoProjectAwardedNotification()
 */
export const demoProjectAwardedNotification = async () => {
  await createProjectAwardedNotification(
    'user-1',
    'Corporate Website Development',
    'proj-demo-2'
  );
  console.log('✅ Project awarded notification created');
};

/**
 * Demo: Trigger multiple notifications at once
 * Usage in console: window.demoAllNotifications()
 */
export const demoAllNotifications = async () => {
  await demoNewProjectNotification();
  await new Promise(resolve => setTimeout(resolve, 500));
  
  await demoBidStatusNotification('shortlisted');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  await demoNewMessageNotification();
  await new Promise(resolve => setTimeout(resolve, 500));
  
  await demoProjectAwardedNotification();
  
  console.log('✅ All demo notifications created');
};

// Expose to window for console testing
if (typeof window !== 'undefined') {
  (window as any).demoNewProjectNotification = demoNewProjectNotification;
  (window as any).demoBidStatusNotification = demoBidStatusNotification;
  (window as any).demoNewMessageNotification = demoNewMessageNotification;
  (window as any).demoProjectAwardedNotification = demoProjectAwardedNotification;
  (window as any).demoAllNotifications = demoAllNotifications;
}
