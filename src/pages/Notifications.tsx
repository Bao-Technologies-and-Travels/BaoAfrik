import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import arrowLeftIcon from '../assets/images/pre/arrow-left.svg';
import lilLogo from '../assets/images/pre/lil.png';
import avatar from '../assets/images/logos/avatar.png';
import logoIcon from '../assets/images/logos/ba-brand-icon-colored.png';
import messageAvatarIcon from '../assets/images/pre/main.png';
import appNotificationIcon from '../assets/images/pre/nof.svg';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [notificationTab, setNotificationTab] = useState<'all' | 'unread' | 'messages'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Mock notification data
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'message', isRead: false, sender: 'Nadine Ngum', text: 'sent you a message', subText: 'Click to view', time: '19 min ago', day: 'Today' },
    { id: 2, type: 'app', isRead: false, text: 'Your profile has been updated,', subText: 'you are now...', subText2: 'Invoice 6 August 2025 Sequence: 2-7480...', time: '2 hrs ago', day: 'Today' },
    { id: 3, type: 'message', isRead: true, text: 'New Reviews and Rates from Nadine Ngum...', subText: '"I recently purchased a beautiful Kente...', time: '17:12', day: 'Yesterday' },
    { id: 4, type: 'app', isRead: true, text: 'New post alert', subText: 'A new listing regarding your recent search...', time: '14:57', day: 'Yesterday' },
    { id: 5, type: 'message', isRead: true, sender: 'Elidiana IKE', text: 'sent you a message', subText: 'See more details', time: '11:31', day: 'Yesterday' },
    { id: 6, type: 'message', isRead: true, sender: 'Amadou Diallo', text: 'sent you a message', subText: 'See more details', time: '10:15', day: 'Yesterday' },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (notificationTab === 'all') return true;
    if (notificationTab === 'unread') return !notif.isRead;
    if (notificationTab === 'messages') return notif.type === 'message';
    return true;
  });

  const totalItems = filteredNotifications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F5F5' }}>
        {/* Main Content */}
        <div className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Breadcrumbs and Search Bar */}
          <div className="flex items-center justify-between mb-6">
            {/* Breadcrumbs */}
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
              <span 
                className="hover:text-gray-700 cursor-pointer" 
                style={{ color: '#BABABA' }}
              >
                Menu
              </span>
              <span style={{ color: '#BABABA' }}>·</span>
              <span className="font-medium" style={{ color: '#4D4D4D' }}>Notifications</span>
            </nav>

            {/* Search Bar */}
            <div className="w-80">
              <style>
                {`
                  .notification-search::placeholder {
                    color: #B2B2B2;
                  }
                `}
              </style>
              <input
                type="text"
                placeholder="Search a chat?"
                className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm notification-search"
                style={{ backgroundColor: '#F1F1F1' }}
              />
            </div>
          </div>

          {/* Notifications Panel */}
          <div className="bg-white rounded-2xl shadow-sm" style={{ minHeight: '600px' }}>
            {/* Header */}
            <div className="px-8 pt-6 pb-4">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold" style={{ color: '#212121' }}>Notifications</h1>
              </div>

              {/* Tabs */}
              <div className="flex items-center space-x-8 border-b border-gray-200 relative">
                <button
                  onClick={() => setNotificationTab('all')}
                  className="pb-3 font-normal transition-colors relative"
                  style={{ 
                    color: notificationTab === 'all' ? '#64B5F6' : '#BABABA',
                    fontSize: '14px'
                  }}
                >
                  All
                  {notificationTab === 'all' && (
                    <div className="absolute bottom-0 h-0.5" style={{ backgroundColor: '#64B5F6', left: '-4px', right: '-4px' }} />
                  )}
                </button>
                <button
                  onClick={() => setNotificationTab('unread')}
                  className="pb-3 font-normal transition-colors relative"
                  style={{ 
                    color: notificationTab === 'unread' ? '#64B5F6' : '#BABABA',
                    fontSize: '14px'
                  }}
                >
                  Unreads
                  {notificationTab === 'unread' && (
                    <div className="absolute bottom-0 h-0.5" style={{ backgroundColor: '#64B5F6', left: '-4px', right: '-4px' }} />
                  )}
                </button>
                <button
                  onClick={() => setNotificationTab('messages')}
                  className="pb-3 font-normal transition-colors relative"
                  style={{ 
                    color: notificationTab === 'messages' ? '#64B5F6' : '#BABABA',
                    fontSize: '14px'
                  }}
                >
                  Messages
                  {notificationTab === 'messages' && (
                    <div className="absolute bottom-0 h-0.5" style={{ backgroundColor: '#64B5F6', left: '-4px', right: '-4px' }} />
                  )}
                </button>

                {/* Pagination */}
                <div className="ml-auto flex items-center space-x-4 pb-3">
                  <span className="text-sm" style={{ color: '#BABABA' }}>
                    {startIndex + 1} - {endIndex} out of {totalItems}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="disabled:opacity-30"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#BABABA' }}>
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="disabled:opacity-30"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#BABABA' }}>
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Notification List */}
            <div className="px-8 pb-6">
              {['Today', 'Yesterday'].map(day => {
                const dayNotifs = paginatedNotifications.filter(n => n.day === day);
                if (dayNotifs.length === 0) return null;
                
                return (
                  <div key={day} className={day === 'Today' ? 'mb-6' : ''}>
                    <p className="text-sm font-medium mb-4" style={{ color: '#B0B0B0' }}>{day}</p>
                    
                    {dayNotifs.map((notif) => (
                      <div key={notif.id} className="transition-colors cursor-pointer mb-4 rounded-xl p-4" style={{ backgroundColor: notif.isRead ? 'transparent' : '#F5FBFF' }}>
                        <div className="flex items-start space-x-3">
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: notif.type === 'message' ? '#E3F2FD' : '#F9A825', border: '2px solid white' }}>
                              {notif.type === 'message' ? (
                                <img src={avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                              ) : (
                                <img src={logoIcon} alt="Logo" className="w-7 h-7" style={{ filter: 'brightness(0) invert(1)' }} />
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF' }}>
                              <img src={notif.type === 'message' ? messageAvatarIcon : appNotificationIcon} alt="Icon" className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                {notif.sender ? (
                                  <p style={{ fontSize: '13px' }}>
                                    <span className="font-semibold" style={{ color: notif.isRead ? '#939393' : '#616161' }}>{notif.sender}</span> <span style={{ color: '#939393' }}>{notif.text}</span>
                                  </p>
                                ) : (
                                  <p className={notif.id === 2 && !notif.isRead ? 'font-semibold' : ''} style={{ color: notif.isRead ? '#939393' : '#616161', fontSize: '13px' }}>{notif.text}</p>
                                )}
                                {notif.subText && (
                                  <p className="mt-1" style={{ color: notif.id === 1 && !notif.isRead ? '#64B5F6' : '#9E9E9E', fontSize: '12px' }}>{notif.subText}</p>
                                )}
                                {notif.subText2 && (
                                  <p className="mt-1" style={{ color: '#9E9E9E', fontSize: '12px' }}>{notif.subText2}</p>
                                )}
                              </div>
                              <div className="flex flex-col items-end ml-4 flex-shrink-0" style={{ gap: '4px' }}>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="6" cy="12" r="1.5"/>
                                    <circle cx="12" cy="12" r="1.5"/>
                                    <circle cx="18" cy="12" r="1.5"/>
                                  </svg>
                                </button>
                                {notif.isRead ? (
                                  <span className="text-xs" style={{ color: '#9E9E9E', fontSize: '11px' }}>{notif.time}</span>
                                ) : (
                                  <div className="flex items-center space-x-1.5" style={{ marginTop: notif.id === 2 ? '16px' : '6px' }}>
                                    <span style={{ color: '#9E9E9E', fontSize: '10px' }}>{notif.time}</span>
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#64B5F6' }} />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}

              {/* Mark all as read */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button onClick={markAllAsRead} className="text-sm hover:opacity-70 transition-opacity" style={{ color: '#939393' }}>
                  Mark all as read
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 mt-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
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
    </>
  );
};

export default Notifications;

