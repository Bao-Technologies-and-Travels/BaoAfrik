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
    { id: 2, type: 'app', isRead: false, text: 'Your profile has been updated,', additionalText: 'you are now a seller.', subText: 'Facture 6 août 2025 Séquence : 2-7480206584 N° de commande : MQKW6YTK42Documen...', time: '2 h ago', day: 'Today' },
    { id: 3, type: 'message', isRead: true, sender: 'Nadine Ngum', text: 'New Reviews and Rates from', additionalText: 'on your profile', subText: '"I recently purchased a beautiful Kente cloth from Joaquin, and I couldn\'t be happier the co ... "', time: '21:47', day: 'Yesterday' },
    { id: 4, type: 'app', isRead: true, text: 'New post alert', subText: 'A new listing regarding your recent search for "Shrimps" is available on BAO Afrik.', time: '20:14', day: 'Yesterday' },
    { id: 5, type: 'message', isRead: true, sender: 'Fatima Kouyate', text: 'sent you a message', subText: 'See more details', time: '17:59', day: 'Yesterday' },
    { id: 6, type: 'message', isRead: true, sender: 'Amadou Diallo', text: 'sent you a message', subText: 'See more details', time: '11:37', day: 'Yesterday' },
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

  const totalAvailableNotifications = 100; // Total notifications in the system
  const totalItems = filteredNotifications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

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
          <div className="bg-white rounded-2xl shadow-sm" style={{ minHeight: '600px', border: '1px solid #E4E4E4' }}>
            {/* Header */}
            <div className="px-8 pt-6 pb-4">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold" style={{ color: '#212121' }}>Notifications</h1>
                
                {/* Pagination */}
                <div className="flex items-center">
                  <span className="text-sm mr-3" style={{ color: '#BABABA' }}>
                    {startIndex + 1} - {endIndex} out of {totalAvailableNotifications}
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
                    disabled={currentPage === totalPages}
                    className="disabled:opacity-30"
                  >
                    <span className="text-lg" style={{ color: '#BABABA' }}>&gt;</span>
                  </button>
                </div>
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
              </div>
            </div>

            {/* Notification List */}
            <div className="pb-6">
              {['Today', 'Yesterday'].map(day => {
                const dayNotifs = paginatedNotifications.filter(n => n.day === day);
                if (dayNotifs.length === 0) return null;
                
                return (
                  <div key={day} className={day === 'Today' ? 'pt-3 pb-2' : 'pt-2 pb-2'}>
                    <p className="text-base font-medium mb-3 px-8" style={{ color: '#B0B0B0' }}>{day}</p>
                    
                    {dayNotifs.map((notif, index) => (
                      <div key={notif.id} className="transition-colors cursor-pointer" style={{ backgroundColor: notif.isRead ? 'transparent' : '#F5FBFF' }}>
                        <div className="flex items-start space-x-4 py-4 px-8">
                          <div className="relative flex-shrink-0">
                            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: notif.type === 'message' ? '#E3F2FD' : '#F9A825', border: '2px solid white' }}>
                              {notif.type === 'message' ? (
                                <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                              ) : (
                                <img src={logoIcon} alt="Logo" className="w-8 h-8" style={{ filter: 'brightness(0) invert(1)' }} />
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF' }}>
                              <img src={notif.type === 'message' ? messageAvatarIcon : appNotificationIcon} alt="Icon" className="w-5 h-5" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                {notif.sender ? (
                                  notif.id === 3 ? (
                                    <p style={{ fontSize: '15px' }}>
                                      <span style={{ color: '#616161' }}>{notif.text} </span>
                                      <span style={{ color: '#939393' }}>{notif.sender}</span>
                                      <span style={{ color: '#616161' }}> {notif.additionalText}</span>
                                    </p>
                                  ) : notif.id === 1 ? (
                                    <p style={{ fontSize: '15px' }}>
                                      <span className="font-semibold" style={{ color: notif.isRead ? '#939393' : '#616161' }}>{notif.sender}</span> <span style={{ color: '#939393' }}>{notif.text}</span>
                                    </p>
                                  ) : (
                                    <p style={{ fontSize: '15px' }}>
                                      <span style={{ color: notif.isRead ? '#939393' : '#616161' }}>{notif.sender}</span> <span style={{ color: '#939393' }}>{notif.text}</span>
                                    </p>
                                  )
                                ) : (
                                  <p style={{ fontSize: '15px' }}>
                                    {notif.id === 2 ? (
                                      <>
                                        <span className="font-semibold" style={{ color: notif.isRead ? '#939393' : '#616161' }}>{notif.text}</span>
                                        <span style={{ color: '#939393' }}> {notif.additionalText}</span>
                                      </>
                                    ) : (
                                      <span style={{ color: notif.isRead ? '#939393' : '#616161' }}>{notif.text}</span>
                                    )}
                                  </p>
                                )}
                                {notif.subText && (
                                  notif.id === 1 ? (
                                    <p 
                                      className="mt-1.5 cursor-pointer hover:opacity-80 transition-opacity" 
                                      style={{ color: !notif.isRead ? '#64B5F6' : '#9E9E9E', fontSize: '14px' }}
                                      onClick={() => navigate('/notification-detail')}
                                    >
                                      {notif.subText}
                                    </p>
                                  ) : (
                                    <p className="mt-1.5" style={{ color: '#9E9E9E', fontSize: '13px' }}>{notif.subText}</p>
                                  )
                                )}
                              </div>
                              <div className="flex flex-col items-end ml-4 flex-shrink-0" style={{ gap: notif.isRead ? '4px' : '8px' }}>
                                <button className="hover:opacity-70">
                                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#4D4D4D' }}>
                                    <circle cx="6" cy="12" r="1.5"/>
                                    <circle cx="12" cy="12" r="1.5"/>
                                    <circle cx="18" cy="12" r="1.5"/>
                                  </svg>
                                </button>
                                {notif.isRead ? (
                                  <span style={{ color: '#9E9E9E', fontSize: '13px' }}>{notif.time}</span>
                                ) : (
                                  <div className="flex items-center space-x-2" style={{ marginTop: notif.id === 2 ? '10px' : '6px' }}>
                                    <span style={{ color: '#9E9E9E', fontSize: '12px' }}>{notif.time}</span>
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#64B5F6' }} />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        {index !== dayNotifs.length - 1 && <div className="border-b border-gray-100" />}
                      </div>
                    ))}
                  </div>
                );
              })}

              {/* Mark all as read */}
              <div className="mt-6 px-8">
                <button onClick={markAllAsRead} className="text-sm hover:opacity-70 transition-opacity" style={{ color: '#939393' }}>
                  Mark all as read
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-6">
            <div className="px-8 py-4">
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

export default Notifications;

