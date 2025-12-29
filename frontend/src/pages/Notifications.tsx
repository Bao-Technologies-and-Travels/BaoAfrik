import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { useNotificationToast } from '../contexts/NotificationToastContext';
import arrowLeftIcon from '../assets/images/pre/arrow-left.svg';
import lilLogo from '../assets/images/pre/lil.png';
import avatar from '../assets/images/logos/avatar.png';
import logoIcon from '../assets/images/logos/ba-brand-icon-colored.png';
import messageAvatarIcon from '../assets/images/pre/main.png';
import appNotificationIcon from '../assets/images/pre/nof.svg';
import { useSocket } from "../contexts/socketContext";

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

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotificationToast();
  const [notificationTab, setNotificationTab] = useState<'all' | 'unread' | 'messages'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loadingActors, setLoadingActors] = useState<boolean>(false);
  const socket = useSocket();

  // Format notification data
  const formatNotificationData = (notificationsData: any[]): Notification[] => {
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

      return {
        ...n,
        meta,
        day: getDayLabel(created),
        time: formatTime(created),
        actor: n.actor || undefined
      };
    });
  };

  // Fetch notifications
  useEffect(() => {
    let mounted = true;
    const loadNotifications = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const json = await res.json();
        if (mounted && json.success) {
          const formattedNotifications = formatNotificationData(json.data.items || []);
          setNotifications(formattedNotifications);

          const unread = formattedNotifications.filter(n => !n.isRead).length;
          setUnreadCount(unread);

        }
      } catch (e) {
        console.error('Failed to load notifications:', e);
      }
    };

    loadNotifications();
    return () => { mounted = false; };
  }, []);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

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

    const onNotification = async (payload: any) => {
      const newNotification = formatNotificationData([payload])[0];

      setNotifications(prev => [newNotification, ...prev]);
      if (!newNotification.isRead) {
        setUnreadCount(prev => prev + 1);
      }
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
          userId: payload.userId || '',
          day: getDayLabel(created),
          time: payload.time || formatTime(created),
          title: payload.senderName || payload.title || 'Someone',
          body: payload.preview || payload.body || '',
          meta: {
            conversationId: payload.conversationId,
            messageId: payload.messageId,
            senderImage: payload.senderImage || payload.senderAvatar
          },
          type: 'NEW_MESSAGE',
          isRead: false,
          createdAt: created.toISOString(),
          actor,
          senderAvatar: payload.senderAvatar,
          senderImage: payload.senderImage
        };

        return [normalized, ...prev];
      });
      setUnreadCount(prev => prev + 1);
    };

    const onNewProductNotification = (payload: any) => {
      setNotifications(prev => {
        if (payload?.productId) {
          const has = prev.some(n => n.meta?.productId === payload.productId);
          if (has) return prev;
        }

        const created = new Date();
        const normalized: Notification = {
          id: payload.id || `tmp-${Date.now()}-${Math.random()}`,
          userId: payload.userId || '',
          day: getDayLabel(created),
          time: payload.time || formatTime(created),
          title: payload.sellerName || 'A seller',
          body: `just listed "${payload.productTitle || 'a new product'}"`,
          meta: {
            productId: payload.productId,
            productTitle: payload.productTitle,
            productImage: payload.productImage,
            sellerId: payload.sellerId,
            sellerName: payload.sellerName,
            sellerImage: payload.sellerImage
          },
          type: 'product',
          isRead: false,
          createdAt: created.toISOString(),
          actor: payload.sellerImage ? {
            id: payload.sellerId,
            firstName: payload.sellerName?.split(' ')[0] || '',
            lastName: payload.sellerName?.split(' ').slice(1).join(' ') || '',
            profileImage: payload.sellerImage
          } : undefined,
          sellerImage: payload.sellerImage
        };

        return [normalized, ...prev];
      });
      setUnreadCount(prev => prev + 1);
    };

    const onCount = (payload: any) => {
      const count = (payload && (payload.totalUnread ?? payload.unreadCount)) as number | undefined;
      if (typeof count === 'number') setUnreadCount(count);
    };

    socket.on('notification', onNotification);
    socket.on('new_message_notification', onNewMessageNotification);
    socket.on('new_product_notification', onNewProductNotification);
    socket.on('notification_count', onCount);

    return () => {
      socket.off('notification', onNotification);
      socket.off('new_message_notification', onNewMessageNotification);
      socket.off('new_product_notification', onNewProductNotification);
      socket.off('notification_count', onCount);
    };
  }, [socket]);

  const handleViewMessage = (notif: Notification) => {
    navigate('/notification-detail', {
      state: {
        notification: notif,
        fromNotification: true
      }
    });
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        showNotification({
          type: 'app',
          mainText: 'All notifications marked as read'
        });
      }

    } catch (e) {
      console.error('Failed to mark all as read:', e);
      showNotification({
        type: 'app',
        mainText: 'Failed to mark notifications as read'
      });
    }
  };

  const handleNotificationAction = (notif: Notification, action: string) => {
    switch (action) {
      case 'delete':
        console.log('Delete notification:', notif.id);
        break;
      case 'mark_read':
        if (!notif.isRead) {
          markAsRead(notif.id);
        }
        break;
      case 'view':
        if (notif.type === 'message' || notif.type === 'NEW_MESSAGE') {
          handleViewMessage(notif);
        } else if (notif.type === 'product' && notif.meta?.productId) {
          // Navigate to product page
          navigate(`/product/${notif.meta.productId}`);
        }
        break;
      default:
        break;
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`${process.env.REACT_APP_API_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error('Failed to mark as read:', e);
    }
  };

  // Filter notifications based on tab
  const filteredNotifications = notifications.filter(notif => {
    if (notificationTab === 'all') return true;
    if (notificationTab === 'unread') return !notif.isRead;
    if (notificationTab === 'messages') return notif.type === 'message' || notif.type === 'NEW_MESSAGE';
    return true;
  });

  // Pagination
  const totalItems = filteredNotifications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

  // Group by day
  const notificationsByDay = paginatedNotifications.reduce((acc, notif) => {
    const day = notif.day || 'Other';
    if (!acc[day]) acc[day] = [];
    acc[day].push(notif);
    return acc;
  }, {} as Record<string, Notification[]>);

  // get actor data
  const getActorData = (notif: Notification): NotificationActor | null => {
    return notif.actor || notif._actor || null;
  }

  // Get display name for actor
  const getActorName = (notif: Notification) => {
    // Parse meta if it's a string (should already be parsed, but just in case)
    let meta = notif.meta;
    if (typeof meta === 'string') {
      try {
        meta = JSON.parse(meta);
      } catch (e) {
        meta = null;
      }
    }

    // For product notifications, use the seller name from meta or title
    if (notif.type === 'product') {
      const sellerName = meta?.sellerName || notif.meta?.sellerName || notif.title;
      if (sellerName && sellerName !== 'A seller' && sellerName !== 'Notification') {
        return sellerName;
      }
      // Try to get from actor if available
      const actor = getActorData(notif);
      if (actor?.firstName || actor?.lastName) {
        return `${actor.firstName || ''} ${actor.lastName || ''}`.trim() || 'A seller';
      }
      return 'A seller';
    }

    // For message notifications
    if (notif.type === 'NEW_MESSAGE' || notif.type === 'message') {
      if (notif.title && notif.title !== 'Notification' && notif.title !== 'Someone') {
        return notif.title;
      }
      // Try to get from actor
      const actor = getActorData(notif);
      if (actor?.firstName || actor?.lastName) {
        return `${actor.firstName || ''} ${actor.lastName || ''}`.trim() || 'Someone';
      }
      if (notif.body && notif.body.includes(':')) {
        const namePart = notif.body.split(':')[0];
        if (namePart.length < 50) {
          return namePart;
        }
      }
      return 'Someone';
    }

    return 'Someone';
  };

  // Get actor profile image
  const getActorImage = (notif: Notification) => {
    const tryUrl = (u?: string | null) => {
      if (!u) return null;
      // if relative path, prefix with API url
      if (!/^https?:\/\//i.test(u) && process.env.REACT_APP_API_URL) {
        return `${process.env.REACT_APP_API_URL.replace(/\/$/, '')}/${u.replace(/^\//, '')}`;
      }
      return u;
    };

    // Parse meta if it's a string (should already be parsed, but just in case)
    let meta = notif.meta;
    if (typeof meta === 'string') {
      try {
        meta = JSON.parse(meta);
      } catch (e) {
        meta = null;
      }
    }

    // For message notifications, show sender's profile image
    if (notif.type === 'message' || notif.type === 'NEW_MESSAGE') {
      const actor = getActorData(notif);
      const srcCandidates = [
        actor?.profileImage,
        actor?.avatar,
        notif.senderAvatar,
        notif.senderImage,
        meta?.senderImage,
        meta?.actorImage,
        notif.meta?.senderImage,
        notif.meta?.actorImage
      ];

      for (const c of srcCandidates) {
        const resolved = tryUrl(c);
        if (resolved) return resolved;
      }
      return avatar; // Fallback to default avatar for messages
    }

    // For product notifications, show seller's image if available, otherwise return null for logo
    if (notif.type === 'product') {
      const sellerImage = meta?.sellerImage || notif.meta?.sellerImage || getActorData(notif)?.profileImage || notif.sellerImage;
      const resolved = tryUrl(sellerImage);
      if (resolved) return resolved;
      return null; // Return null to show logo
    }

    // For other notifications, try to get actor image
    const actor = getActorData(notif);
    const srcCandidates = [
      actor?.profileImage,
      actor?.avatar,
      notif.senderAvatar,
      meta?.senderImage,
      meta?.actorImage,
      notif.meta?.senderImage,
      notif.meta?.actorImage
    ];

    for (const c of srcCandidates) {
      const resolved = tryUrl(c);
      if (resolved) return resolved;
    }

    return null; // Return null to show logo for non-message notifications
  };

  return (
    <>
      <Header />
      <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA', fontFamily: 'Poppins, sans-serif' }}>
        <div className="mx-auto px-6 py-6" style={{ maxWidth: '1100px' }}>
          {/* Breadcrumbs and Search Bar */}
          <div className="flex items-center justify-between mb-6 mt-4">
            <nav className="flex items-center space-x-2 text-sm">
              <img
                src={arrowLeftIcon}
                alt="Back"
                className="w-4 h-4 cursor-pointer"
                onClick={() => navigate('/')}
              />
              <span
                className="hover:text-gray-700 cursor-pointer"
                style={{ color: '#BABABA' }}
                onClick={() => navigate('/')}
              >
                Homepage
              </span>
              <span style={{ color: '#BABABA' }}>·</span>
              <span className="font-medium" style={{ color: '#4D4D4D' }}>Notifications</span>
            </nav>

            <div className="w-80">
              <input
                type="text"
                placeholder="Search a chat?"
                className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                style={{ backgroundColor: '#F1F1F1', color: '#B2B2B2' }}
              />
            </div>
          </div>

          {/* Notifications Panel */}
          <div className="bg-white rounded-2xl shadow-sm" style={{ minHeight: '600px', border: '1px solid #E4E4E4' }}>
            {/* Header */}
            <div className="px-8 pt-6 pb-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h1 className="text-xl font-semibold" style={{ color: '#212121' }}>Notifications</h1>

                  {unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount} unread
                    </span>
                  )}

                  {/* Test Toast Button */}
                  <button
                    onClick={() => showNotification({
                      type: 'app',
                      mainText: 'Your profile has been updated,',
                      subText: 'you ...',
                      subText2: 'Invoice 6 August 2025 Sequence: 2-7 ...'
                    })}
                    className="text-xs px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Test Toast
                  </button>
                </div>

                {/* Pagination */}
                <div className="flex items-center">
                  <span className="text-sm mr-3" style={{ color: '#BABABA' }}>
                    {startIndex + 1} - {endIndex} of {totalItems}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="disabled:opacity-30 mr-1"
                  >
                    <span className="text-lg" style={{ color: '#BABABA' }}>&lt;</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="disabled:opacity-30"
                  >
                    <span className="text-lg" style={{ color: '#BABABA' }}>&gt;</span>
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center space-x-8 border-b border-gray-200 relative">
                {(['all', 'unread', 'messages'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => {
                      setNotificationTab(tab);
                      setCurrentPage(1);
                    }}
                    className="pb-3 font-normal transition-colors relative capitalize"
                    style={{
                      color: notificationTab === tab ? '#64B5F6' : '#BABABA',
                      fontSize: '14px'
                    }}
                  >
                    {tab}
                    {notificationTab === tab && (
                      <div className="absolute bottom-0 h-0.5" style={{ backgroundColor: '#64B5F6', left: '-4px', right: '-4px' }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification List */}
            <div className="pb-6">
              {Object.entries(notificationsByDay).map(([day, dayNotifications]) => (
                <div key={day} className="pt-3 pb-2">
                  <p className="text-base font-medium mb-3 px-8" style={{ color: '#B0B0B0' }}>{day}</p>

                  {dayNotifications.map((notif: Notification, index: number) => (
                    <div
                      key={notif.id}
                      className="transition-colors cursor-pointer"
                      style={{ backgroundColor: notif.isRead ? 'transparent' : '#F5FBFF' }}
                      onClick={() => {
                        if (!notif.isRead) {
                          markAsRead(notif.id);
                        }
                        // if (notif.type === 'message' || notif.type === 'NEW_MESSAGE') {
                        //   handleViewMessage(notif);
                        // }
                        navigate('/notification-detail', {
                          state: {
                            notification: notif,
                            fromNotifications: true
                          }
                        });
                      }}
                    >
                      <div className="flex items-start space-x-4 py-4 px-8">
                        <div className="relative flex-shrink-0">
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"
                            style={{
                              backgroundColor: (notif.type === 'message' || notif.type === 'NEW_MESSAGE') ? '#E3F2FD' : '#F9A825',
                              border: '2px solid white'
                            }}
                          >
                            {(() => {
                              const actorImage = getActorImage(notif);
                              const isMessage = notif.type === 'message' || notif.type === 'NEW_MESSAGE';

                              // For messages, always show sender's image (or fallback avatar)
                              if (isMessage) {
                                return (
                                  <img
                                    src={actorImage || avatar}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = avatar; }}
                                  />
                                );
                              }

                              // For product notifications, show seller image if available
                              if (notif.type === 'product' && actorImage) {
                                return (
                                  <img
                                    src={actorImage}
                                    alt="Seller"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = logoIcon; }}
                                  />
                                );
                              }

                              // For all other cases, show logo
                              return (
                                <img
                                  src={logoIcon}
                                  alt="Logo"
                                  className="w-10 h-10"
                                  style={{ filter: 'brightness(0) invert(1)' }}
                                />
                              );
                            })()}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF' }}>
                            <img
                              src={(notif.type === 'message' || notif.type === 'NEW_MESSAGE') ? messageAvatarIcon : appNotificationIcon}
                              alt="Icon"
                              className="w-4 h-4"
                            />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p style={{ fontSize: '15px', color: notif.isRead ? '#939393' : '#616161' }}>
                                {(notif.type === 'message' || notif.type === 'NEW_MESSAGE') ? (
                                  <>
                                    <span className="font-semibold">{getActorName(notif)}</span>
                                    <span> {notif.body || 'sent you a message'}</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="font-semibold">{notif.title}</span>
                                    {notif.body && <span> {notif.body}</span>}
                                  </>
                                )}
                              </p>

                              {(notif.type === 'message' || notif.type === 'NEW_MESSAGE') && (
                                <p
                                  className="mt-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                                  style={{
                                    color: !notif.isRead ? '#64B5F6' : '#9E9E9E',
                                    fontSize: '14px',
                                    textDecoration: 'underline'
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewMessage(notif);
                                  }}
                                >
                                  Click to View
                                </p>
                              )}
                            </div>

                            <div className="flex flex-col items-end ml-4 flex-shrink-0" style={{ gap: '4px' }}>
                              {/* Action Menu */}
                              <div className="relative">
                                <button
                                  className="hover:opacity-70 p-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNotificationAction(notif, 'mark_read');
                                  }}
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#4D4D4D' }}>
                                    <circle cx="6" cy="12" r="1.5" />
                                    <circle cx="12" cy="12" r="1.5" />
                                    <circle cx="18" cy="12" r="1.5" />
                                  </svg>
                                </button>
                              </div>

                              <div className="flex items-center space-x-2">
                                <span style={{ color: '#9E9E9E', fontSize: '12px' }}>{notif.time}</span>
                                {!notif.isRead && (
                                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#64B5F6' }} />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index !== dayNotifications.length - 1 && <div className="border-b border-gray-100" />}
                    </div>
                  ))}
                </div>
              ))}

              {filteredNotifications.length === 0 && (
                <div className="text-center py-12">
                  <p style={{ color: '#BABABA' }}>No notifications found</p>
                </div>
              )}

              {/* Mark all as read */}
              {unreadCount > 0 && (
                <div className="mt-6 px-8">
                  <button
                    onClick={markAllAsRead}
                    className="text-sm hover:opacity-70 transition-opacity"
                    style={{ color: '#939393' }}
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-6">
            <div className="px-8 py-4">
              <div className="flex items-center justify-between text-sm" style={{ color: '#BABABA' }}>
                <div className="flex items-center space-x-2">
                  <img src={lilLogo} alt="lil" className="w-6 h-6" />
                  <span>© All rights reserved</span>
                </div>
                <div className="flex items-center space-x-4">
                  <a href="/contact" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Contact Us</a>
                  <span>|</span>
                  <a href="/terms" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Terms and conditions of use</a>
                  <span>|</span>
                  <a href="/privacy" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Privacy policies</a>
                  <span>|</span>
                  <a href="/cookies" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Cookies</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Notifications;