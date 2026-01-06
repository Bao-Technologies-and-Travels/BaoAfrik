import React, { createContext, useContext, useState, ReactNode } from 'react';
import NotificationToast from '../components/NotificationToast';

interface NotificationData {
  type: 'message' | 'app';
  mainText: string;
  subText?: string;
  subText2?: string;
  sender?: string;
  onClick?: () => void;
  clickText?: string;
  duration?: number;
}

interface NotificationToastContextType {
  showNotification: (notification: NotificationData) => void;
  hideNotification: () => void;
}

const NotificationToastContext = createContext<NotificationToastContextType | undefined>(undefined);

export const NotificationToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showNotification = (notificationData: NotificationData) => {
    setNotification(notificationData);
    setIsVisible(true);

    // Auto-hide after specified duration (default 5 seconds)
    const duration = notificationData.duration || 5000;
    setTimeout(() => {
      hideNotification();
    }, duration);
  };

  const hideNotification = () => {
    setIsVisible(false);
    setTimeout(() => {
      setNotification(null);
    }, 300); // Wait for animation to complete
  };

  return (
    <NotificationToastContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notification && (
        <NotificationToast
          type={notification.type}
          mainText={notification.mainText}
          subText={notification.subText}
          subText2={notification.subText2}
          sender={notification.sender}
          isVisible={isVisible}
          onClose={hideNotification}
          onClick={notification.onClick}
          clickText={notification.clickText}
        />
      )}
    </NotificationToastContext.Provider>
  );
};

export const useNotificationToast = () => {
  const context = useContext(NotificationToastContext);
  if (!context) {
    throw new Error('useNotificationToast must be used within NotificationToastProvider');
  }
  return context;
};

