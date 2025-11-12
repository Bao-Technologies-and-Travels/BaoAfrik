import React, { createContext, useContext, useState, ReactNode } from 'react';
import NotificationToast from '../components/NotificationToast';

interface NotificationData {
  type: 'message' | 'app';
  mainText: string;
  subText?: string;
  subText2?: string;
  sender?: string;
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

    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideNotification();
    }, 5000);
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

