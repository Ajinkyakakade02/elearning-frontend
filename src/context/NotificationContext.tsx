// src/context/NotificationContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  FaPlayCircle,
  FaFileAlt,
  FaBolt
} from 'react-icons/fa';

export type NotificationType = 'info' | 'success' | 'warning';
export type NotificationCategory = 'quiz' | 'dsa' | 'exam';

export interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  icon?: React.ReactNode;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// ONLY THESE 3 NOTIFICATIONS - with short, clean messages
const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_quiz_1',
    type: 'info',
    category: 'quiz',
    title: '📝 Solve Practice Quizzes',
    message: 'Solve Practice Quizzes',  // Short and clean
    read: false,
    createdAt: new Date(),
    actionUrl: '/quiz',
    icon: <FaPlayCircle className="text-blue-500" />
  },
  {
    id: 'notif_dsa_1',
    type: 'success',
    category: 'dsa',
    title: '📊 Free DSA Sheet Available',
    message: 'Free DSA Sheet Available',  // Short and clean
    read: false,
    createdAt: new Date(),
    actionUrl: '/dsa/sheet',
    icon: <FaFileAlt className="text-green-500" />
  },
  {
    id: 'notif_exam_1',
    type: 'warning',
    category: 'exam',
    title: '🎯 Crack JEE Exam 2026',
    message: 'Crack JEE Exam 2026',  // Short and clean
    read: false,
    createdAt: new Date(),
    actionUrl: '/jee',
    icon: <FaBolt className="text-yellow-500" />
  }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(DEFAULT_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};