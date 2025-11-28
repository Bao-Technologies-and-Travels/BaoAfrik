import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import arrowLeftIcon from '../assets/images/pre/arrow-left.svg';
import trashIcon from '../assets/images/pre/trash.svg';
import shareIcon from '../assets/images/pre/Share.svg';
import lilLogo from '../assets/images/pre/lil.png';
import avatar from '../assets/images/logos/avatar.png';
import starIcon from '../assets/images/pre/star.svg';
import messageAvatarIcon from '../assets/images/pre/main.png';

const NotificationDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentNotification, setCurrentNotification] = useState(1);
  const [notification, setNotification] = useState<any>(null);

  const totalNotifications = 100;

  // get notification data from navigation state
  useEffect(() => {
    const state = location.state as any;
    if (state?.notification) {
      setNotification(state.notification)
      console.log('Received notification data:', state.notification);
    } else {
      navigate('/notifications');
    }
  }, [location, navigate]);

  const handlePrevious = () => {
    if (currentNotification > 1) {
      setCurrentNotification(currentNotification - 1);
    }
  };

  const handleNext = () => {
    if (currentNotification < totalNotifications) {
      setCurrentNotification(currentNotification + 1);
    }
  };

  const handleViewMessage = () => {
    if (notification?.meta?.conversationId) {
      navigate('/messages', {
        state: {
          conversationId: notification.meta.conversationId,
          fromNotification: true
        }
      });
    } else {
      // Fallback to general messages
      navigate('/messages');
    }
  };

  const getActorName = (notif: any) => {
    if (notif?.actor) {
      const { firstName, lastName } = notif.actor;
      if (firstName && lastName) return `${firstName} ${lastName}`;
      if (firstName) return firstName;
      if (lastName) return lastName;
    }

    if (notif?.senderName) {
      return notif.senderName;
    }

    if (notif?.title) {
      const nameMatch = notif.title.match(/^([^ ]+) /);
      if (nameMatch) return nameMatch[1];
    }

    return 'Someone';
  };

  const getActorImage = (notif: any) => {
    return notif?.actor?.profileImage || notif?.senderAvatar || avatar;
  };

  const getTimeAgo = (createdAt: string) => {
    if (!createdAt) return '19 min ago';

    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (!notification) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAFA' }}>
          <div>Loading notification...</div>
        </div>
      </>
    );
  }

  const isMessageNotification = notification.type === 'message' || notification.type === 'NEW_MESSAGE';

  return (
    <>
      <Header />
      <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA', fontFamily: 'Poppins, sans-serif' }}>
        <div className="mx-auto px-6 py-6" style={{ maxWidth: '1100px' }}>
          {/* Breadcrumbs and Search Bar */}
          <div className="flex items-center justify-between mb-6 mt-4">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm">
              <img
                src={arrowLeftIcon}
                alt="Back"
                className="w-4 h-4 cursor-pointer"
                onClick={() => navigate('/notifications')}
              />
              <span
                className="hover:text-gray-700 cursor-pointer"
                style={{ color: '#BABABA' }}
                onClick={() => navigate('/')}
              >
                Homepage
              </span>
              <span style={{ color: '#BABABA' }}>·</span>
              <span
                className="hover:text-gray-700 cursor-pointer"
                style={{ color: '#BABABA' }}
              >
                Menu
              </span>
              <span style={{ color: '#BABABA' }}>·</span>
              <span className="font-medium" style={{ color: '#4D4D4D' }}>Notification Details</span>
            </nav>

            {/* Search Bar */}
            <div className="w-80">
              <style>
                {`
                  .notification-detail-search::placeholder {
                    color: #B2B2B2;
                  }
                `}
              </style>
              <input
                type="text"
                placeholder="Search a notification?"
                className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm notification-detail-search"
                style={{ backgroundColor: '#F1F1F1' }}
              />
            </div>
          </div>

          {/* Notification Detail Panel */}
          <div className="bg-white rounded-2xl shadow-sm" style={{ minHeight: '600px', border: '1px solid #E4E4E4' }}>
            {/* Action Icons Row */}
            <div className="px-8 pt-6 pb-4" style={{ borderBottom: '1.5px solid #E0E0E0' }}>
              <div className="flex items-center justify-between">
                {/* Left Side Icons */}
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => navigate('/notifications')}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="hover:opacity-70 transition-opacity">
                    <img src={trashIcon} alt="Delete" className="w-6 h-6" />
                  </button>
                  <button className="hover:opacity-70 transition-opacity">
                    <img src={shareIcon} alt="Share" className="w-6 h-6" />
                  </button>
                </div>

                {/* Right Side Pagination */}
                <div className="flex items-center">
                  <span className="text-sm mr-3" style={{ color: '#BABABA' }}>
                    {currentNotification} out of {totalNotifications}
                  </span>
                  <button
                    onClick={handlePrevious}
                    disabled={currentNotification === 1}
                    className="disabled:opacity-30 mr-1"
                  >
                    <span className="text-lg" style={{ color: '#BABABA' }}>&lt;</span>
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentNotification === totalNotifications}
                    className="disabled:opacity-30"
                  >
                    <span className="text-lg" style={{ color: '#BABABA' }}>&gt;</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Timestamp - Left aligned below divider */}
            <div className="px-8 pt-6">
              <div className="flex items-center space-x-2 mb-8" style={{ color: '#9E9E9E' }}>
                <svg className="w-4 h-4" fill="white" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ color: '#9E9E9E' }}>
                  <circle cx="12" cy="12" r="10" fill="white" stroke="#9E9E9E" strokeWidth="1.5"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" stroke="#9E9E9E" strokeWidth="1.5" fill="none"/>
                </svg>
                <span className="text-xs">{getTimeAgo(notification.createdAt)}</span>
              </div>
            </div>

            {/* Notification Content - Centered */}
            <div className="px-8 pb-12 flex flex-col items-center justify-center" style={{ minHeight: '350px' }}>

              {/* Avatar with badge */}
              <div className="relative mb-6">
                <div className="rounded-full flex items-center justify-center overflow-hidden" style={{ width: '64px', height: '64px', backgroundColor: isMessageNotification ? '#E3F2FD' : '#F9A825', border: '2px solid white' }}>
                  <img src={getActorImage(notification)} alt={getActorName(notification)} className="w-full h-full object-cover" />
                </div>
                <div className="absolute" style={{ bottom: '-2px', right: '-2px', width: '24px', height: '24px', backgroundColor: '#FFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={messageAvatarIcon} alt="Badge" className="w-6 h-6" />
                </div>
              </div>

              {/* Main Text */}
              <p className="text-base font-normal mb-2 text-center">
                <span style={{ color: '#212121' }}>{getActorName(notification)}</span>
                <span style={{ color: '#939393' }}>
                  {isMessageNotification ? ' sent you a message' : ` ${notification.body || notification.title}`}
                </span>
              </p>

              {/* Secondary Text */}
              {isMessageNotification && (
                <p className="text-sm font-medium mb-6" style={{ color: '#64B5F6' }}>
                  New message
                </p>
              )}

              {/* View Message Button */}
              {isMessageNotification && (
                <button 
                  onClick={handleViewMessage}
                  className="px-16 py-3 rounded-lg font-medium text-sm transition-colors hover:bg-blue-50"
                  style={{ 
                    border: '2px solid #64B5F6',
                    color: '#64B5F6',
                    backgroundColor: 'transparent'
                  }}
                >
                  View the message
                </button>
              )}
            </div>

            {/* Information Footer */}
            <div className="pt-8 pb-6 flex flex-col items-center">
              <div className="mb-3" style={{ width: '50%', height: '1px', backgroundColor: '#D0D0D0' }}></div>
              <p className="text-center px-8" style={{ color: '#9E9E9E', fontSize: '10px' }}>
                You can manage your notification preferences in the{' '}
                <a href="/notification-settings" className="underline hover:opacity-70" style={{ color: '#000000' }}>
                  notification settings page
                </a>
                {' '}or{' '}
                <a href="/contact" className="underline hover:opacity-70" style={{ color: '#000000' }}>
                  contact customer service
                </a>
                {' '}if you encounter any issues.
              </p>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16">
            <div className="py-6">
              <div className="flex items-center justify-between text-sm" style={{ color: '#BABABA' }}>
                <div className="flex items-center space-x-2">
                  <img
                    src={lilLogo}
                    alt="lil"
                    className="w-6 h-6"
                  />
                  <span>©</span>
                  <span>All rights reserved</span>
                </div>
                <div className="flex items-center space-x-4">
                  <a href="/contact" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Contact Us</a>
                  <span style={{ color: '#BABABA' }}>|</span>
                  <a href="/terms" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Terms and conditions of use</a>
                  <span style={{ color: '#BABABA' }}>|</span>
                  <a href="/privacy" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Privacy policies</a>
                  <span style={{ color: '#BABABA' }}>|</span>
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

export default NotificationDetail;

