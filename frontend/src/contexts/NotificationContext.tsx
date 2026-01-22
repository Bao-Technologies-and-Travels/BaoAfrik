import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useSocket } from './socketContext';

interface NotificationActor {
  id: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  avatar?: string;
}

interface Notification {
  id: string;
  userId?: string;
  actorId?: string;
  actor?: NotificationActor;
  type: string;
  title: string;
  body?: string;
  message?: string;
  text?: string;
  additionalText?: string;
  subText?: string;
  meta?: any;
  isRead: boolean;
  createdAt?: string;
  day?: string;
  time?: string;
  _actor?: NotificationActor;
  senderAvatar?: string;
  senderImage?: string;
  sellerImage?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  notificationCount: number;
  isLoading: boolean;
  refreshNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  formatNotificationData: (notificationsData: any[]) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const socket = useSocket();

  // Format notification data helper
  const formatNotificationData = useCallback((notificationsData: any[]): Notification[] => {
    return notificationsData.map((n: any) => {
      const created = n.createdAt ? new Date(n.createdAt) : new Date();
      const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const getDayLabel = (date: Date) => {
        const d = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        d.setHours(0, 0, 0, 0);
        if (d.getTime() === today.getTime()) return 'Today';
        if (d.getTime() === yesterday.getTime()) return 'Yesterday';
        return d.toLocaleDateString();
      };

      // Parse meta if it's a string
      let meta = n.meta;
      if (typeof meta === 'string') {
        try {
          meta = JSON.parse(meta);
        } catch (error) {
          meta = null;
        }
      }

      // For product notifications, map message to text/additionalText structure
      let text = n.text || n.title;
      let additionalText = n.additionalText || meta?.additionalText;
      let subText = n.subText || meta?.subText;

      // For product availability notifications, format the message properly
      if (n.type === 'product' && n.message) {
        const message = n.message;
        // If message contains "Your listing" and "is now available", format it
        if (message.includes('Your listing') && message.includes('is now available')) {
          // Extract product title from message
          const match = message.match(/Your listing "([^"]+)" is now available/);
          if (match) {
            text = 'Your profile has been updated,';
            additionalText = 'you are now a seller.';
            // Use a default subText or extract from meta if available
            subText = meta?.subText || `Facture 6 août 2025 Séquence : 2-7480206584 N° de commande : MQKW6YTK42Documen...`;
          }
        } else {
          // For other product messages, use the message as text
          text = n.title || message;
          additionalText = meta?.additionalText;
          subText = meta?.subText;
        }
      }

      return {
        ...n,
        meta,
        text,
        additionalText,
        subText,
        day: getDayLabel(created),
        time: n.time || formatTime(created),
        actor: n.actor || undefined
      };
    });
  }, []);

  // Fetch notifications from API
  const refreshNotifications = useCallback(async () => {
    const isVisitor = localStorage.getItem('isVisitor') === 'true';
    if (isVisitor) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const res = await fetch(`${process.env.REACT_APP_API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        setIsLoading(false);
        return;
      }

      const json = await res.json();
      if (!json.success) {
        setIsLoading(false);
        return;
      }

      const formattedNotifications = formatNotificationData(json.data.items || []);
      setNotifications(formattedNotifications);
      if (json.data.unreadCount !== undefined) {
        setNotificationCount(json.data.unreadCount);
      }
    } catch (e) {
      console.warn('Failed to load notifications', e);
    } finally {
      setIsLoading(false);
    }
  }, [formatNotificationData]);

  // Mark single notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      await fetch(`${process.env.REACT_APP_API_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      // Update local state optimistically
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
      setNotificationCount(prev => Math.max(0, prev - 1));

      // Refresh to ensure persistence
      await refreshNotifications();
    } catch (e) {
      console.warn('Failed to mark notification as read', e);
    }
  }, [refreshNotifications]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      await fetch(`${process.env.REACT_APP_API_URL}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state optimistically
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      setNotificationCount(0);

      // Refresh to ensure persistence
      await refreshNotifications();
    } catch (e) {
      console.warn('Failed to mark all as read', e);
    }
  }, [refreshNotifications]);

  // Initial load
  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  // Socket events
  useEffect(() => {
    if (!socket) return;

    const formatTime = (date: Date) =>
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const getDayLabel = (date: Date) => {
      const d = new Date(date);
      const today = new Date();
      if (d.toDateString() === today.toDateString()) {
        return 'Today';
      }
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      if (d.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      }
      return d.toLocaleDateString();
    };

    const onNotification = (payload: any) => {
      const created = payload.createdAt ? new Date(payload.createdAt) : new Date();
      const actor = payload.actor ?? payload._actor ?? payload.meta?.actor ?? payload.user ?? null;
      const normalized = {
        ...payload,
        actor,
        day: getDayLabel(created),
        time: payload.time || formatTime(created),
        id: payload.id || `notif-${Date.now()}-${Math.random()}`
      };

      setNotifications(prev => {
        const existsById = prev.some(n => n.id === normalized.id);
        const existsByMeta = normalized.meta?.messageId ? prev.some(n => n.meta?.messageId === normalized.meta.messageId) : false;
        if (existsById || existsByMeta) return prev;
        return [normalized, ...prev];
      });
      setNotificationCount(prev => prev + 1);
    };

    const onNewMessageNotification = (payload: any) => {
      setNotifications(prev => {
        if (payload?.messageId) {
          const has = prev.some(n => n.meta?.messageId === payload.messageId);
          if (has) return prev;
        }

      const created = new Date();
      const actor = payload.actor ?? payload._actor ?? payload.meta?.actor ?? (payload.senderImage ? {
        id: payload.senderId || payload.userId,
        firstName: payload.senderName?.split(' ')[0] || '',
        lastName: payload.senderName?.split(' ').slice(1).join(' ') || '',
        profileImage: payload.senderImage || payload.senderAvatar
      } : null);

        const normalized: Notification = {
          id: payload.id || `tmp-${Date.now()}-${Math.random()}`,
          day: getDayLabel(created),
          time: payload.time || formatTime(created),
          title: payload.senderName || payload.title || 'Someone',
          body: payload.preview || payload.body || '',
          meta: {
            conversationId: payload.conversationId,
            messageId: payload.messageId,
            senderImage: payload.senderImage || payload.senderAvatar,
            preview: payload.preview
          },
          type: 'NEW_MESSAGE',
          isRead: false,
          actor
        };

        const existsByMeta = payload?.messageId ? prev.some(n => n.meta?.messageId === payload.messageId) : false;
        if (existsByMeta) return prev;
        return [normalized, ...prev];
      });
      setNotificationCount(prev => prev + 1);
    };

    const onNewProductNotification = (payload: any) => {
      setNotifications(prev => {
        if (payload?.productId) {
          const has = prev.some(n => n.meta?.productId === payload.productId && n.type === 'product');
          if (has) return prev;
        }

      const created = new Date();
      const isOwnListing = payload.sellerId === payload.userId;
      const normalized: Notification = {
        id: payload.id || `tmp-${Date.now()}-${Math.random()}`,
        day: getDayLabel(created),
        time: payload.time || formatTime(created),
        title: isOwnListing ? 'Your listing is available on the platform' : (payload.sellerName || 'A seller'),
        body: isOwnListing
          ? `Your listing "${payload.productTitle || 'a new product'}" is now available on the marketplace`
          : `just listed "${payload.productTitle || 'a new product'}"`,
        message: isOwnListing
          ? `Your listing "${payload.productTitle || 'a new product'}" is now available on the marketplace`
          : `just listed "${payload.productTitle || 'a new product'}"`,
        meta: {
          productId: payload.productId,
          productTitle: payload.productTitle,
          productImage: payload.productImage,
          sellerId: payload.sellerId,
          sellerName: payload.sellerName,
          sellerImage: isOwnListing ? null : payload.sellerImage
        },
        type: 'product',
        isRead: false,
        createdAt: created.toISOString(),
        actor: isOwnListing ? undefined : (payload.sellerImage ? {
          id: payload.sellerId,
          firstName: payload.sellerName?.split(' ')[0] || '',
          lastName: payload.sellerName?.split(' ').slice(1).join(' ') || '',
          profileImage: payload.sellerImage
        } : undefined),
        sellerImage: isOwnListing ? null : payload.sellerImage
      };

        // Format the notification
        const formatted = formatNotificationData([normalized])[0];
        const existsByMeta = payload?.productId ? prev.some(n => n.meta?.productId === payload.productId && n.type === 'product') : false;
        if (existsByMeta) return prev;
        return [formatted, ...prev];
      });
      setNotificationCount(prev => prev + 1);
    };

    const onProductStatusChange = (payload: any) => {
      setNotifications(prev => {
        if (payload?.productId) {
          const has = prev.some(n => n.meta?.productId === payload.productId && n.type === 'product_status_change');
          if (has) return prev;
        }

      const created = new Date();
      const statusMessage = payload.previousStatus === 'PUBLISHED' && payload.newStatus === 'DRAFT'
        ? `Your listing "${payload.productTitle || 'a product'}" has been moved to drafts`
        : `Your listing "${payload.productTitle || 'a product'}" status changed from ${payload.previousStatus} to ${payload.newStatus}`;

      const normalized: Notification = {
        id: payload.id || `tmp-${Date.now()}-${Math.random()}`,
        day: getDayLabel(created),
        time: payload.time || formatTime(created),
        title: 'Status Change',
        body: statusMessage,
        meta: {
          productId: payload.productId,
          productTitle: payload.productTitle,
          previousStatus: payload.previousStatus,
          newStatus: payload.newStatus
        },
        type: 'product_status_change',
        isRead: false,
        createdAt: created.toISOString()
      };

        const existsByMeta = payload?.productId ? prev.some(n => n.meta?.productId === payload.productId && n.type === 'product_status_change') : false;
        if (existsByMeta) return prev;
        return [normalized, ...prev];
      });
      setNotificationCount(prev => prev + 1);
    };

    const onNotificationCount = (payload: any) => {
      const count = (payload && (payload.totalUnread ?? payload.unreadCount ?? payload.total)) as number | undefined;
      if (typeof count === 'number') {
        setNotificationCount(count);
      }
    };

    socket.on('notification', onNotification);
    socket.on('new_message_notification', onNewMessageNotification);
    socket.on('new_product_notification', onNewProductNotification);
    socket.on('product_status_change', onProductStatusChange);
    socket.on('notification_count', onNotificationCount);

    return () => {
      socket.off('notification', onNotification);
      socket.off('new_message_notification', onNewMessageNotification);
      socket.off('new_product_notification', onNewProductNotification);
      socket.off('product_status_change', onProductStatusChange);
      socket.off('notification_count', onNotificationCount);
    };
  }, [socket, formatNotificationData]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        notificationCount,
        isLoading,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        formatNotificationData
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
