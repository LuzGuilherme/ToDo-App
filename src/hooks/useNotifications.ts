'use client';

import { useState, useEffect, useCallback } from 'react';

export type NotificationPermission = 'default' | 'granted' | 'denied';

interface ReminderMessage {
  title: string;
  body: string;
  urgency: 'gentle' | 'firm' | 'urgent';
}

const REMINDER_MESSAGES: Record<number, ReminderMessage> = {
  1: {
    title: 'Friendly Reminder',
    body: "Hey, you said you'd work on this today. Ready to start?",
    urgency: 'gentle',
  },
  2: {
    title: 'Task Waiting',
    body: "This task is still waiting. What's blocking you?",
    urgency: 'firm',
  },
  3: {
    title: 'Overdue Task!',
    body: 'This task is overdue! Deal with it now or reschedule.',
    urgency: 'urgent',
  },
};

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission as NotificationPermission);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result as NotificationPermission);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!isSupported || permission !== 'granted') return null;

      try {
        const notification = new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        return notification;
      } catch (error) {
        console.error('Error sending notification:', error);
        return null;
      }
    },
    [isSupported, permission]
  );

  const sendTaskReminder = useCallback(
    (taskTitle: string, escalationLevel: number) => {
      const level = Math.min(Math.max(escalationLevel, 1), 3);
      const message = REMINDER_MESSAGES[level];

      return sendNotification(message.title, {
        body: `"${taskTitle}" - ${message.body}`,
        tag: `task-reminder-${taskTitle}`,
        requireInteraction: level >= 2,
      });
    },
    [sendNotification]
  );

  const sendMorningReminder = useCallback(() => {
    return sendNotification('Good Morning!', {
      body: "Time to plan your day. What will you commit to today?",
      tag: 'morning-commitment',
      requireInteraction: true,
    });
  }, [sendNotification]);

  const sendOverdueAlert = useCallback(
    (count: number) => {
      return sendNotification('Overdue Tasks!', {
        body: `You have ${count} overdue task${count > 1 ? 's' : ''}. Time to take action!`,
        tag: 'overdue-alert',
        requireInteraction: true,
      });
    },
    [sendNotification]
  );

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
    sendTaskReminder,
    sendMorningReminder,
    sendOverdueAlert,
  };
}

export function getReminderMessage(escalationLevel: number): ReminderMessage {
  const level = Math.min(Math.max(escalationLevel, 1), 3);
  return REMINDER_MESSAGES[level];
}
