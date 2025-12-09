
import { Notification, User } from '../types';
import { MOCK_USERS_LIST } from '../constants';

const NOTIFICATIONS_KEY = 'insta_notifications';

class NotificationService {
  
  // Send a review notification to a business owner
  public notifyReview(ownerId: string, businessName: string, reviewerName: string) {
    // 1. Fetch user preferences (Simulated)
    // Try to get from local storage if it's the currently logged in user (mock scenario), 
    // otherwise fallback to static mock data
    const storedUser = localStorage.getItem('insta_user');
    let user: User | undefined;
    
    if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.id === ownerId) {
            user = parsed;
        }
    }
    
    if (!user) {
        user = MOCK_USERS_LIST.find(u => u.id === ownerId);
    }

    if (!user) {
        console.warn(`[Notification] User ${ownerId} not found.`);
        return;
    }

    // 2. Check Preferences
    const { email, inApp } = user.notificationPreferences || { email: true, inApp: true };

    const notification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        userId: ownerId,
        type: 'review',
        title: 'New Review Received',
        message: `${reviewerName} just left a review for ${businessName}.`,
        date: new Date().toISOString(),
        isRead: false,
        link: '/dashboard' // In real app, deep link to specific review
    };

    // 3. Dispatch Notifications
    if (email) {
        this.sendEmail(user.email, notification);
    }

    if (inApp) {
        this.storeInAppNotification(notification);
    }
  }

  // Simulate Email Sending
  private sendEmail(email: string, notification: Notification) {
      console.log(`%c[Email Service] Sending to ${email}:`, 'color: cyan; font-weight: bold;');
      console.log(`Subject: ${notification.title}`);
      console.log(`Body: ${notification.message}`);
  }

  // Store in Local Storage for In-App display
  private storeInAppNotification(notification: Notification) {
      const existing = this.getAllNotifications();
      const updated = [notification, ...existing];
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
      console.log(`[Notification] In-app notification stored for user ${notification.userId}`);
  }

  public getNotifications(userId: string): Notification[] {
      const all = this.getAllNotifications();
      return all.filter(n => n.userId === userId);
  }

  public markAsRead(notificationId: string) {
      const all = this.getAllNotifications();
      const updated = all.map(n => n.id === notificationId ? { ...n, isRead: true } : n);
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  }

  public markAllAsRead(userId: string) {
      const all = this.getAllNotifications();
      const updated = all.map(n => n.userId === userId ? { ...n, isRead: true } : n);
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  }

  private getAllNotifications(): Notification[] {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
  }
}

export const notificationService = new NotificationService();
