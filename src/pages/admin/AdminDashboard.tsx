import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/pre/logo.png';
import ov1Icon from '../../assets/images/admin/ov1.svg';
import ov2Icon from '../../assets/images/admin/ov2.svg';
import perfomanceIcon from '../../assets/images/admin/perfomance.svg';
import userIcon from '../../assets/images/admin/user.svg';
import listingboxIcon from '../../assets/images/admin/listingbox.svg';
import requesticonIcon from '../../assets/images/admin/requesticon.svg';
import chatsIcon from '../../assets/images/admin/chats.svg';
import clockIcon from '../../assets/images/admin/clock.svg';
import exportIcon from '../../assets/images/admin/export.svg';
import settingIcon from '../../assets/images/admin/setting.svg';
import activeusersIcon from '../../assets/images/admin/activeusers.svg';
import activelistingsIcon from '../../assets/images/admin/activelistings.svg';
import peopleIcon from '../../assets/images/admin/people.svg';
import flagIcon from '../../assets/images/admin/flag.svg';
import notificationIcon from '../../assets/images/pre/notification.svg';
import arrowDownIcon from '../../assets/images/pre/arrow-down.svg';
import avatar from '../../assets/images/logos/avatar.png';
import logoIcon from '../../assets/images/logos/ba-brand-icon-colored.png';
import messageAvatarIcon from '../../assets/images/pre/main.png';
import appNotificationIcon from '../../assets/images/pre/nof.svg';
import visualIcon from '../../assets/images/admin/visual.svg';
import MustUsersArc from '../../components/ui/MustUsersArc';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSidebarOption, setSelectedSidebarOption] = useState('overview');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState<'all' | 'unread' | 'messages'>('all');
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('France');
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);

  // Mock notification data
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'message', isRead: false, sender: 'Nadine Ngum', text: 'sent you a message', subText: 'Click to view', time: '19 min ago', day: 'Today' },
    { id: 2, type: 'app', isRead: false, text: 'Your profile has been updated,', subText: 'you are now...', subText2: 'Invoice 6 August 2025 Sequence: 2-7480...', time: '2 hrs ago', day: 'Today' },
    { id: 3, type: 'message', isRead: true, text: 'New Reviews and Rates from Nadine Ngum...', subText: '"I recently purchased a beautiful Kente...', time: '17:12', day: 'Yesterday' },
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

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const languageSelector = target.closest('.language-selector');
      const notificationDropdown = target.closest('.notification-dropdown');
      const menuDropdown = target.closest('.menu-dropdown');

      if (!languageSelector && isLanguageDropdownOpen) {
        setIsLanguageDropdownOpen(false);
      }
      if (!notificationDropdown && isNotificationOpen) {
        setIsNotificationOpen(false);
      }
      if (!menuDropdown && isMenuDropdownOpen) {
        setIsMenuDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageDropdownOpen, isNotificationOpen, isMenuDropdownOpen]);

  const sidebarOptions = [
    {
      section: null,
      value: 'overview',
      label: 'Overview',
      activeIcon: ov2Icon,
      inactiveIcon: ov1Icon
    },
    {
      section: 'ACTIVITY',
      value: 'performance',
      label: 'Perfomance',
      activeIcon: perfomanceIcon,
      inactiveIcon: perfomanceIcon
    },
    {
      section: 'ACTIVITY',
      value: 'reported-issues',
      label: 'Reported Issues',
      activeIcon: flagIcon,
      inactiveIcon: flagIcon
    },
    {
      section: 'MANAGEMENT',
      value: 'users',
      label: 'Users',
      activeIcon: userIcon,
      inactiveIcon: userIcon
    },
    {
      section: 'MANAGEMENT',
      value: 'listings',
      label: 'Listings',
      activeIcon: listingboxIcon,
      inactiveIcon: listingboxIcon
    },
    {
      section: 'MANAGEMENT',
      value: 'requests',
      label: 'Requests',
      activeIcon: requesticonIcon,
      inactiveIcon: requesticonIcon
    },
    {
      section: 'GENERAL',
      value: 'chat',
      label: 'Chat',
      activeIcon: chatsIcon,
      inactiveIcon: chatsIcon
    },
    {
      section: 'GENERAL',
      value: 'history',
      label: 'History',
      activeIcon: clockIcon,
      inactiveIcon: clockIcon
    },
    {
      section: 'GENERAL',
      value: 'export',
      label: 'Export data',
      activeIcon: exportIcon,
      inactiveIcon: exportIcon
    },
    {
      section: 'GENERAL',
      value: 'settings',
      label: 'Settings',
      activeIcon: settingIcon,
      inactiveIcon: settingIcon
    }
  ];

  const handleLogout = () => {
    // TODO: Implement logout
    navigate('/');
  };

  // Get current date and time for last update
  const getLastUpdate = () => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${day}, ${date} ${month}. ${year} - ${displayHours}:${displayMinutes} ${ampm}`;
  };


  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      <style>
        {`
          @keyframes rotateGlobe {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .admin-sidebar-scroll::-webkit-scrollbar {
            display: none;
          }
          .admin-sidebar-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .admin-content-scroll::-webkit-scrollbar {
            display: none;
          }
          .admin-content-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      <div className="flex">
        {/* Left Sidebar */}
        <div
          style={{
            width: '240px',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #F1F1F1',
            margin: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 32px)',
            position: 'sticky',
            top: '16px'
          }}
        >
          {/* Logo */}
          <div style={{ marginBottom: '20px' }}>
            <img src={logo} alt="bao'Afrik" style={{ height: '24px', width: 'auto' }} />
          </div>

          {/* Navigation Options */}
          <div style={{ flex: 1, overflowY: 'auto' }} className="admin-sidebar-scroll">
            {sidebarOptions.map((option, index) => {
              const isActive = selectedSidebarOption === option.value;
              const showSectionTitle = index === 0 || 
                (sidebarOptions[index - 1].section !== option.section && option.section);

              return (
                <React.Fragment key={option.value}>
                  {showSectionTitle && option.section && (
                    <div style={{ 
                      color: '#B0B0B0', 
                      fontSize: '10px', 
                      fontWeight: 500,
                      marginTop: index > 0 ? '16px' : '0',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      {option.section}
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedSidebarOption(option.value)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px',
                      borderRadius: '12px',
                      backgroundColor: (isActive && option.value !== 'overview') ? '#F0F8FE' : 'transparent',
                      color: isActive ? '#64B5F6' : '#6A6A6A',
                      fontSize: '12px',
                      fontWeight: isActive ? 500 : 400,
                      border: 'none',
                      cursor: 'pointer',
                      marginBottom: '2px',
                      transition: 'all 0.2s',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive || option.value === 'overview') {
                        (e.target as HTMLElement).style.backgroundColor = '#F9F9F9';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive || option.value === 'overview') {
                        (e.target as HTMLElement).style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <img 
                      src={isActive ? option.activeIcon : option.inactiveIcon} 
                      alt={option.label} 
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span>{option.label}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              backgroundColor: '#F3F4F6',
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              marginTop: '16px',
              fontFamily: 'Poppins, sans-serif'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#E5E7EB';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#F3F4F6';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="#6A6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#6A6A6A', margin: 0, fontFamily: 'Poppins, sans-serif' }}>Log Out</div>
                <div style={{ fontSize: '12px', color: '#6A6A6A', margin: 0, fontFamily: 'Poppins, sans-serif' }}>Log out of BAO Afrik</div>
              </div>
            </div>
          </button>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, padding: '16px', paddingRight: '16px', overflowY: 'auto', maxHeight: 'calc(100vh - 32px)' }} className="admin-content-scroll">
          {/* Top Navigation Bar */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            {/* Search Bar */}
            <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
              <input
                type="text"
                placeholder="Search, press &quot;/&quot; for commands"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#F1F1F1',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#212121',
                  fontSize: '12px',
                  fontFamily: 'Poppins, sans-serif'
                }}
              />
              <style>
                {`
                  input::placeholder {
                    color: #B2B2B2;
                  }
                `}
              </style>
            </div>

            {/* Right Side Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '16px' }}>
              {/* Language Toggle */}
              <div className="relative language-selector" ref={languageDropdownRef}>
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px 10px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E4E4E4',
                    borderRadius: '8px',
                    color: '#BABABA',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 400
                  }}
                >
                  <span>{selectedLanguage}</span>
                  <img src={arrowDownIcon} alt="Arrow" style={{ width: '12px', height: '12px', marginLeft: '4px' }} />
                </button>

                {isLanguageDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '160px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E4E4E4',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    zIndex: 50,
                    padding: '6px',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    {['EN', 'FR', 'DE', 'ES'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setSelectedLanguage(lang);
                          setIsLanguageDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          backgroundColor: selectedLanguage === lang ? '#F0F8FE' : 'transparent',
                          color: selectedLanguage === lang ? '#64B5F6' : '#212121',
                          fontSize: '12px',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notification Icon */}
              <div className="relative notification-dropdown" ref={notificationDropdownRef}>
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  style={{
                    position: 'relative',
                    width: 'auto',
                    height: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <img 
                    src={notificationIcon} 
                    alt="Notifications" 
                    style={{ 
                      width: '24px', 
                      height: '24px',
                      filter: 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(92%)'
                    }}
                  />
                  {unreadCount > 0 && (
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '18px',
                      height: '18px',
                      backgroundColor: '#FF0000',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ color: '#FFFFFF', fontSize: '10px', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                        {unreadCount}
                      </span>
                    </div>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div 
                    className="notification-dropdown"
                    style={{
                      position: 'fixed',
                      right: '16px',
                      top: '64px',
                      width: '384px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      border: '1px solid #E4E4E4',
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                      zIndex: 50,
                      maxHeight: '600px',
                      display: 'flex',
                      flexDirection: 'column',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    {/* Header */}
                    <div style={{ padding: '20px', borderBottom: '1px solid #E4E4E4' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#212121', margin: 0, fontFamily: 'Bricolage Grotesque, sans-serif' }}>Notifications</h3>
                        <button
                          onClick={() => setIsNotificationOpen(false)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: '#9C9C9C'
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>

                      {/* Tabs */}
                      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #E4E4E4', position: 'relative' }}>
                        {(['all', 'unread', 'messages'] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setNotificationTab(tab)}
                            style={{
                              paddingBottom: '8px',
                              fontSize: '12px',
                              fontWeight: 400,
                              color: notificationTab === tab ? '#64B5F6' : '#BABABA',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              textTransform: 'capitalize',
                              fontFamily: 'Poppins, sans-serif',
                              position: 'relative'
                            }}
                          >
                            {tab === 'all' ? 'All' : tab === 'unread' ? 'Unreads' : 'Messages'}
                            {notificationTab === tab && (
                              <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: '-4px',
                                right: '-4px',
                                height: '2px',
                                backgroundColor: '#64B5F6'
                              }} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notification List */}
                    <div style={{ 
                      flex: 1, 
                      overflowY: 'auto',
                      maxHeight: '400px',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}>
                      <style>
                        {`
                          .notification-dropdown::-webkit-scrollbar {
                            display: none;
                          }
                        `}
                      </style>
                      {['Today', 'Yesterday'].map(day => {
                        const dayNotifs = filteredNotifications.filter(n => n.day === day);
                        if (dayNotifs.length === 0) return null;
                        
                        return (
                          <div key={day} style={{ paddingTop: day === 'Today' ? '12px' : '8px', paddingBottom: '4px' }}>
                            <p style={{ fontSize: '10px', fontWeight: 500, margin: '0 0 8px 24px', color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>{day}</p>
                            
                            {dayNotifs.map((notif) => (
                              <div key={notif.id} style={{ 
                                transition: 'background-color 0.2s',
                                cursor: 'pointer',
                                backgroundColor: notif.isRead ? 'transparent' : '#F5FBFF'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '8px 24px' }}>
                                  <div style={{ position: 'relative', flexShrink: 0 }}>
                                    <div style={{ 
                                      width: '40px', 
                                      height: '40px', 
                                      borderRadius: '50%', 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'center',
                                      backgroundColor: notif.type === 'message' ? '#E3F2FD' : '#F9A825',
                                      border: '2px solid white'
                                    }}>
                                      {notif.type === 'message' ? (
                                        <img src={avatar} alt="Avatar" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                                      ) : (
                                        <img src={logoIcon} alt="Logo" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
                                      )}
                                    </div>
                                    <div style={{ 
                                      position: 'absolute', 
                                      bottom: '-2px', 
                                      right: '-2px', 
                                      width: '16px', 
                                      height: '16px', 
                                      borderRadius: '50%', 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'center',
                                      backgroundColor: '#FFF'
                                    }}>
                                      <img src={notif.type === 'message' ? messageAvatarIcon : appNotificationIcon} alt="Icon" style={{ width: '12px', height: '12px' }} />
                                    </div>
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        {notif.sender ? (
                                          <p style={{ fontSize: '11px', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                                            <span style={{ 
                                              fontWeight: notif.isRead ? 400 : 600,
                                              color: notif.isRead ? '#939393' : '#616161'
                                            }}>
                                              {notif.sender}
                                            </span>
                                            <span style={{ color: '#939393' }}> {notif.text}</span>
                                          </p>
                                        ) : (
                                          <p style={{ 
                                            fontSize: '11px',
                                            fontWeight: notif.id === 2 && !notif.isRead ? 600 : 400,
                                            color: notif.isRead ? '#939393' : '#616161',
                                            margin: 0,
                                            fontFamily: 'Poppins, sans-serif'
                                          }}>
                                            {notif.text}
                                          </p>
                                        )}
                                        {notif.subText && (
                                          <p style={{ 
                                            fontSize: notif.id === 1 ? '11px' : '10px',
                                            color: notif.id === 1 && !notif.isRead ? '#64B5F6' : '#9E9E9E',
                                            margin: '2px 0 0 0',
                                            fontFamily: 'Poppins, sans-serif'
                                          }}>
                                            {notif.subText}
                                          </p>
                                        )}
                                        {notif.subText2 && (
                                          <p style={{ 
                                            fontSize: '10px',
                                            color: '#9E9E9E',
                                            margin: '2px 0 0 0',
                                            fontFamily: 'Poppins, sans-serif'
                                          }}>
                                            {notif.subText2}
                                          </p>
                                        )}
                                      </div>
                                      <div style={{ 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        gap: notif.isRead ? '2px' : '4px',
                                        marginLeft: '8px',
                                        flexShrink: 0
                                      }}>
                                        <button style={{ 
                                          background: 'none',
                                          border: 'none',
                                          cursor: 'pointer',
                                          padding: '2px',
                                          color: '#9C9C9C'
                                        }}>
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <circle cx="6" cy="12" r="1.5"/>
                                            <circle cx="12" cy="12" r="1.5"/>
                                            <circle cx="18" cy="12" r="1.5"/>
                                          </svg>
                                        </button>
                                        {notif.isRead ? (
                                          <span style={{ fontSize: '10px', color: '#9E9E9E', fontFamily: 'Poppins, sans-serif' }}>{notif.time}</span>
                                        ) : (
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: notif.id === 2 ? '12px' : '4px' }}>
                                            <span style={{ fontSize: '9px', color: '#9E9E9E', fontFamily: 'Poppins, sans-serif' }}>{notif.time}</span>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#64B5F6' }} />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {notif.id !== dayNotifs[dayNotifs.length - 1].id && <div style={{ borderBottom: '1px solid #F3F4F6', marginLeft: '72px' }} />}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    {unreadCount > 0 && (
                      <div style={{ 
                        padding: '16px 24px',
                        borderTop: '1px solid #E4E4E4',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <button
                          onClick={markAllAsRead}
                          style={{
                            color: '#939393',
                            fontSize: '12px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'Poppins, sans-serif'
                          }}
                        >
                          Mark all as read
                        </button>
                        <button 
                          onClick={() => {
                            navigate('/notifications');
                            setIsNotificationOpen(false);
                          }}
                          style={{
                            color: '#64B5F6',
                            fontSize: '12px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'Poppins, sans-serif'
                          }}
                        >
                          See all notifications →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Admin Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ 
                    margin: 0,
                    color: '#212121',
                    fontSize: '12px',
                    fontWeight: 500,
                    fontFamily: 'Bricolage Grotesque, sans-serif'
                  }}>
                    Herman Kabore
                  </p>
                  <p style={{ 
                    margin: 0,
                    color: '#B0B0B0',
                    fontSize: '10px',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Main Admin
                  </p>
                </div>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#E3F2FD',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <img 
                    src={avatar} 
                    alt="Profile" 
                    style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }} 
                  />
                </div>
                <div className="relative menu-dropdown" ref={menuDropdownRef}>
                  <button
                    onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                    style={{
                      padding: '8px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#171717'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div>
            {/* Metrics Cards and Reported Issues Container */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 0.85fr) 1fr',
              gap: '10px',
              marginTop: '0',
              marginBottom: '0',
              alignItems: 'start'
            }}>
              {/* Row for title/description + dropdown + reported issues title */}
              <div style={{ gridColumn: '1 / 3', marginBottom: '0' }}>
                <h1 style={{ 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  color: '#212121',
                  margin: 0,
                  fontFamily: 'Bricolage Grotesque, sans-serif'
                }}>
                  Dashboard
                </h1>
                <p style={{ 
                  color: '#9C9C9C',
                  fontSize: '12px',
                  margin: '2px 0 0 0',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  Last update: {getLastUpdate()}{' '}
                  <button
                    style={{
                      color: '#64B5F6',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontSize: '12px',
                      fontFamily: 'Poppins, sans-serif',
                      padding: 0
                    }}
                  >
                    Refresh
                  </button>
                </p>
              </div>

              {/* Row for dropdown and title above Active Listings and Reported Issues */}
              <div style={{ gridColumn: '3', display: 'flex', justifyContent: 'flex-end', marginBottom: '0', marginTop: '22px' }}>
                <select style={{
                  padding: '6px 10px',
                  paddingRight: '28px',
                  borderRadius: '8px',
                  border: '1px solid #E4E4E4',
                  fontSize: '11px',
                  color: '#6A6A6A',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23939393' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '12px'
                }}>
                  <option>This week</option>
                </select>
              </div>
              <div style={{ gridColumn: '4', marginBottom: '0', marginTop: '6px' }}>
                <h2 style={{ 
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#212121',
                  margin: 0,
                  fontFamily: 'Bricolage Grotesque, sans-serif'
                }}>
                  Reported Issues
                </h2>
              </div>
              {/* Visitors Card */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '10px',
                border: '1px solid #F1F1F1'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ 
                      color: '#9C9C9C',
                      fontSize: '10px',
                      margin: '0 0 4px 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Visitors number
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <p style={{ 
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#212121',
                        margin: 0,
                        fontFamily: 'Bricolage Grotesque, sans-serif'
                      }}>
                        569
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        backgroundColor: '#EDFBF0',
                        padding: '2px 6px',
                        borderRadius: '12px'
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span style={{ color: '#22C55E', fontSize: '9px', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>+17.89%</span>
                      </div>
                    </div>
                    <p style={{ 
                      color: '#9C9C9C',
                      fontSize: '8px',
                      margin: 0,
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Last month: 2094
                    </p>
                  </div>
                  <img src={peopleIcon} alt="Visitors" style={{ width: '24px', height: '24px' }} />
                </div>
              </div>

              {/* Active Users Card */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '10px',
                border: '1px solid #F1F1F1'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ 
                      color: '#9C9C9C',
                      fontSize: '10px',
                      margin: '0 0 4px 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Active users
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <p style={{ 
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#212121',
                        margin: 0,
                        fontFamily: 'Bricolage Grotesque, sans-serif'
                      }}>
                        201
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        backgroundColor: '#FFE9E9',
                        padding: '2px 6px',
                        borderRadius: '12px'
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M17 7L7 17M7 17H17M7 17V7" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span style={{ color: '#EF4444', fontSize: '9px', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>-4.23%</span>
                      </div>
                    </div>
                    <p style={{ 
                      color: '#9C9C9C',
                      fontSize: '8px',
                      margin: 0,
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Last month: 2094
                    </p>
                  </div>
                  <img src={activeusersIcon} alt="Active Users" style={{ width: '24px', height: '24px' }} />
                </div>
              </div>

              {/* Active Listings Card */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '10px',
                border: '1px solid #F1F1F1'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ 
                      color: '#9C9C9C',
                      fontSize: '10px',
                      margin: '0 0 4px 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Active listings
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <p style={{ 
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#212121',
                        margin: 0,
                        fontFamily: 'Bricolage Grotesque, sans-serif'
                      }}>
                        714
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        backgroundColor: '#EDFBF0',
                        padding: '2px 6px',
                        borderRadius: '12px'
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span style={{ color: '#22C55E', fontSize: '9px', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>+109</span>
                      </div>
                    </div>
                    <p style={{ 
                      color: '#9C9C9C',
                      fontSize: '8px',
                      margin: 0,
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Last month: 2094
                    </p>
                  </div>
                  <img src={activelistingsIcon} alt="Active Listings" style={{ width: '24px', height: '24px' }} />
                </div>
              </div>

              {/* Reported Issues - aligned with Active Listings */}
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: '-24px' }}>
                {/* Reported Issues */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '12px',
                  border: '0.5px solid #F1F1F1',
                  width: '100%',
                  maxWidth: '320px'
                }}>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { name: 'Clara Vanstone', issue: 'Phishing attempt', time: '30 min ago', avatar: avatar, bgColor: '#E3F2FD' },
                      { name: 'Robert OWEN', issue: 'Phishing attempt', time: '2h ago', avatar: avatar, bgColor: '#FFF3E0' },
                      { name: 'Kalhesi Doumbia', issue: 'Phishing attempt', time: 'Yesterday', avatar: avatar, bgColor: '#F3E5F5' }
                    ].map((item, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: '10px'
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: item.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <img 
                            src={item.avatar} 
                            alt={item.name} 
                            style={{ 
                              width: '24px', 
                              height: '24px', 
                              borderRadius: '50%',
                              objectFit: 'cover'
                            }} 
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                            <p style={{ 
                              fontSize: '12px',
                              fontWeight: 500,
                              color: '#212121',
                              margin: 0,
                              fontFamily: 'Poppins, sans-serif',
                              flex: 1
                            }}>
                              {item.name}
                            </p>
                            <button style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '2px',
                              flexShrink: 0
                            }}>
                              <svg width="12" height="12" viewBox="0 0 24 4" fill="none">
                                <circle cx="4" cy="2" r="2" fill="#9C9C9C" />
                                <circle cx="12" cy="2" r="2" fill="#9C9C9C" />
                                <circle cx="20" cy="2" r="2" fill="#9C9C9C" />
                              </svg>
                            </button>
                          </div>
                          <p style={{ 
                            fontSize: '10px',
                            color: '#9C9C9C',
                            margin: 0,
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            {item.issue}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                            <p style={{ 
                              fontSize: '9px',
                              color: '#B0B0B0',
                              margin: 0,
                              fontFamily: 'Poppins, sans-serif'
                            }}>
                              {item.time}
                            </p>
                            <div style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: '#64B5F6'
                            }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ textAlign: 'right', marginTop: '12px' }}>
                    <button style={{
                      color: '#64B5F6',
                      fontSize: '11px',
                      fontWeight: 500,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      See all reported issues →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Performance Overview (left) + User per country (right) */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 0.85fr) 1fr',
              gap: '10px',
              marginTop: '0',
              marginBottom: '12px',
              alignItems: 'start'
            }}>
            {/* Performance Overview - left 3 columns */}
            <div style={{ 
              gridColumn: '1 / 4',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '16px',
              border: '1px solid #F1F1F1',
              width: '100%',
              marginTop: '-100px'
            }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '4px',
                  marginTop: '0'
                }}>
                  <h2 style={{ 
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#212121',
                    margin: 0,
                    fontFamily: 'Bricolage Grotesque, sans-serif'
                  }}>
                    Performance Overview
                  </h2>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select style={{
                      padding: '6px 10px',
                      paddingRight: '28px',
                      borderRadius: '8px',
                      border: '1px solid #E4E4E4',
                      fontSize: '11px',
                      color: '#6A6A6A',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      fontFamily: 'Poppins, sans-serif',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23939393' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 8px center',
                      backgroundSize: '12px'
                    }}>
                      <option>Listings</option>
                    </select>
                    <select style={{
                      padding: '6px 10px',
                      paddingRight: '28px',
                      borderRadius: '8px',
                      border: '1px solid #E4E4E4',
                      fontSize: '11px',
                      color: '#6A6A6A',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      fontFamily: 'Poppins, sans-serif',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23939393' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 8px center',
                      backgroundSize: '12px'
                    }}>
                      <option>Month</option>
                    </select>
                  </div>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#9C9C9C' 
                    }} />
                    <span style={{ fontSize: '9px', color: '#9C9C9C', fontFamily: 'Poppins, sans-serif' }}>Past weeks</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#F9A825' 
                    }} />
                    <span style={{ fontSize: '9px', color: '#9C9C9C', fontFamily: 'Poppins, sans-serif' }}>Current Week</span>
                  </div>
                </div>

                {/* Chart */}
                <div
                  style={{
                    position: 'relative',
                    height: '280px',
                    padding: '14px 14px 10px 14px',
                    backgroundColor: 'transparent',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', height: '100%' }}>
                    {/* Y-axis */}
                    <div
                      style={{
                        width: '34px',
                        flexShrink: 0,
                        height: '100%',
                        position: 'relative'
                      }}
                    >
                      {['40k', '30k', '20k', '10k', '0k'].map((v, idx) => {
                        // Align with grid lines: 0%, 25%, 50%, 75%, 100%
                        const positions = [0, 0.25, 0.5, 0.75, 1];
                        // Calculate position accounting for line height (1px) - center the text on the line
                        // Same approach for all labels: position + 0.5px offset, then translateY(-50%) to center
                        // Adjust 30k (idx 1), 20k (idx 2), 10k (idx 3), and 0k (idx 4) to move them up
                        const offset =
                          idx === 1 ? '-8px' :
                          idx === 2 ? '-16px' :
                          idx === 3 ? '-24px' :
                          idx === 4 ? '-34px' :
                          '0.5px';
                        return (
                          <div
                            key={v}
                            style={{
                              position: 'absolute',
                              top: `calc(${positions[idx] * 100}% + ${offset})`,
                              transform: 'translateY(-50%)',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <span
                              style={{
                                fontSize: '11px',
                                color: '#B0B0B0',
                                fontFamily: 'Poppins, sans-serif',
                                lineHeight: 1
                              }}
                            >
                              {v}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bars + X axis */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Plot area (grid + axes + bars) */}
                      <div
                        style={{
                          flex: 1,
                          position: 'relative',
                          paddingLeft: '6px',
                          paddingRight: '6px',
                          paddingBottom: '10px'
                        }}
                      >
                        {/* Grid lines (aligned with Y-axis numbers) */}
                        {[0, 1, 2, 3, 4].map((i) => {
                          // Align with Y-axis labels: 0%, 25%, 50%, 75%, 100%
                          const positions = [0, 0.25, 0.5, 0.75, 1];
                          return (
                            <div
                              key={i}
                              style={{
                                position: 'absolute',
                                left: '0',
                                right: '0',
                                top: `${positions[i] * 100}%`,
                                height: '1px',
                                backgroundImage:
                                  'repeating-linear-gradient(to right, #D9D9D9 0 6px, transparent 6px 18px)',
                                opacity: 1,
                                pointerEvents: 'none',
                                transform: 'translateY(-0.5px)'
                              }}
                            />
                          );
                        })}

                        {/* Bars */}
                        <div
                          style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: '1px',
                            display: 'flex',
                            alignItems: 'stretch',
                            justifyContent: 'space-between',
                            gap: '16px',
                            paddingLeft: '16px',
                            paddingRight: '6px',
                            paddingBottom: '0px'
                          }}
                        >
                          {[
                            { month: 'Mar', trackH: 28, fillH: 55 },
                            { month: 'Apr', trackH: 46, fillH: 35 },
                            { month: 'May', trackH: 100, fillH: 30 },
                            { month: 'Jun', trackH: 70, fillH: 30 },
                            { month: 'Jul', trackH: 80, fillH: 20 },
                            { month: 'Aug', trackH: 80, fillH: 14 },
                            { month: 'Sep', trackH: 50, fillH: 30 },
                            { month: 'Oct', trackH: 76, fillH: 36 },
                            { month: 'Nov', trackH: 58, fillH: 26 },
                            { month: 'Dec', trackH: 90, fillH: 56, isCurrent: true }
                          ].map((item) => {
                            const trackWidth = 'clamp(34px, 4.2vw, 48px)';
                            const trackRadius = '12px';
                            const fillRadius = '10px';

                            return (
                              <div
                                key={item.month}
                                style={{
                                  flex: 1,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  minWidth: 0,
                                  height: '100%',
                                  alignItems: 'flex-end'
                                }}
                              >
                                <div
                                  style={{
                                    width: trackWidth,
                                    height: `${item.trackH}%`,
                                    backgroundColor: '#FAFAFA',
                                    borderRadius: trackRadius,
                                    position: 'relative',
                                    overflow: 'visible',
                                    border: '1px solid rgba(0,0,0,0.04)'
                                  }}
                                >
                                  <div
                                    style={{
                                      position: 'absolute',
                                      left: '2px',
                                      right: '2px',
                                      bottom: '2px',
                                      height: `${item.fillH}%`,
                                      backgroundColor: item.isCurrent ? 'transparent' : '#E4E4E4',
                                      backgroundImage: item.isCurrent
                                        ? 'linear-gradient(0deg, rgba(249, 168, 37, 0.20) 0%, rgba(249, 168, 37, 0.80) 100%)'
                                        : undefined,
                                      borderRadius: fillRadius,
                                      overflow: 'hidden'
                                    }}
                                  >
                                    {/* zebra stripes for current week */}
                                    {item.isCurrent && (
                                      <div
                                        style={{
                                          position: 'absolute',
                                          inset: 0,
                                          backgroundImage:
                                            'repeating-linear-gradient(135deg, rgba(249, 168, 37, 0.15) 0px, rgba(249, 168, 37, 0.15) 6px, rgba(255, 255, 255, 0) 6px, rgba(255, 255, 255, 0) 12px)'
                                        }}
                                      />
                                    )}
                                  </div>
                                  
                                  {/* blue dot marker - at top of fill bar */}
                                  {item.isCurrent && (
                                    <div
                                      style={{
                                        position: 'absolute',
                                        bottom: `calc(${item.fillH}% + 2px)`,
                                        left: '50%',
                                        transform: 'translate(-50%, 50%)',
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        backgroundColor: '#64B5F6',
                                        boxShadow: '0 0 0 1px #FFFFFF',
                                        zIndex: 10
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          gap: '16px',
                          paddingLeft: '6px',
                          paddingRight: '6px',
                          paddingTop: '16px'
                        }}
                      >
                        {['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
                          <div
                            key={m}
                            style={{
                              flex: 1,
                              display: 'flex',
                              justifyContent: 'center'
                            }}
                          >
                            <span
                              style={{
                                fontSize: '11px',
                                color: '#B0B0B0',
                                fontFamily: 'Poppins, sans-serif'
                              }}
                            >
                              {m}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
            </div>

            {/* User per country - right column (independent of Performance Overview height) */}
            <div style={{ gridColumn: '4', display: 'flex', flexDirection: 'column', marginTop: '12px' }}>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '10px',
                  border: '0.5px solid #F1F1F1',
                  width: '100%',
                  maxWidth: '320px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '0px'
                  }}>
                    <h2 style={{ 
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#212121',
                      margin: 0,
                      fontFamily: 'Bricolage Grotesque, sans-serif'
                    }}>
                      User per country
                    </h2>
                    <select style={{
                      padding: '6px 10px',
                      paddingRight: '28px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '11px',
                      color: '#B0B0B0',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      fontFamily: 'Poppins, sans-serif',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23939393' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 8px center',
                      backgroundSize: '12px'
                    }}>
                      <option>This week</option>
                    </select>
                  </div>

                  {/* Progress Chart */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    marginTop: '-74px',
                    marginBottom: '8px'
                  }}>
                    <MustUsersArc 
                      percentage={67.56}
                      users={104}
                      width={200}
                    />
                  </div>

                  {/* Country Breakdown Section */}
                  <div style={{
                    padding: '4px 10px',
                    backgroundColor: '#FAFAFA',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ flex: 1 }}>
                      {/* Less users at top left */}
                      <p style={{ 
                        fontSize: '9px',
                        color: '#6A6A6A',
                        margin: '0 0 4px 0',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        Less users: 2.89%
                      </p>
                      
                      {/* France text */}
                      <p style={{ 
                        fontSize: '10px',
                        color: '#939393',
                        margin: '0 0 3px 0',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        France
                      </p>
                      
                      {/* Users count and badge - badge directly to the right in one line */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'nowrap' }}>
                        <span style={{ 
                          fontSize: '11px', 
                          color: '#202224', 
                          fontWeight: 500, 
                          fontFamily: 'Bricolage Grotesque, sans-serif',
                          whiteSpace: 'nowrap'
                        }}>
                          67 Users
                        </span>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '3px',
                          backgroundColor: '#EDFBF0',
                          padding: '2px 5px',
                          borderRadius: '10px'
                        }}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span style={{ color: '#22C55E', fontSize: '8px', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>+17.89%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Globe visualization - reduced size to fit appropriately */}
                    <div 
                      ref={globeRef}
                      style={{
                        width: '160px',
                        height: '65px',
                        position: 'relative',
                        flexShrink: 0,
                        marginLeft: 'auto'
                      }}
                    >
                      <img 
                        src={visualIcon} 
                        alt="Globe" 
                        style={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities - Full width to align with cards above */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 0.85fr) 1fr',
              gap: '10px',
              marginTop: '12px',
              marginBottom: '0',
              alignItems: 'start'
            }}>
              <div style={{
                gridColumn: '1 / 5',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '10px 6px 10px 12px',
                border: '1px solid #F1F1F1',
                boxSizing: 'border-box',
                width: 'calc(100% - 20px)',
                maxWidth: 'calc(100% - 20px)'
              }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <h2 style={{ 
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#212121',
                  margin: 0,
                  fontFamily: 'Bricolage Grotesque, sans-serif'
                }}>
                  Recents activities
                </h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select style={{
                    padding: '4px 10px',
                    paddingRight: '28px',
                    borderRadius: '8px',
                    border: '1px solid #E4E4E4',
                    fontSize: '11px',
                    color: '#6A6A6A',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23939393' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                    backgroundSize: '12px'
                  }}>
                    <option>All</option>
                  </select>
                  <select style={{
                    padding: '4px 10px',
                    paddingRight: '28px',
                    borderRadius: '8px',
                    border: '1px solid #E4E4E4',
                    fontSize: '11px',
                    color: '#6A6A6A',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23939393' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                    backgroundSize: '12px'
                  }}>
                    <option>Sort by</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #F1F1F1' }}>
                      <th style={{ 
                        padding: '5px 8px',
                        textAlign: 'left',
                        fontSize: '10px',
                        fontWeight: 500,
                        color: '#939393',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Users
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#939393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8l-6-6-6 6" />
                            <path d="M18 16l-6 6-6-6" />
                          </svg>
                        </div>
                      </th>
                      <th style={{ 
                        padding: '5px 8px',
                        textAlign: 'left',
                        fontSize: '10px',
                        fontWeight: 500,
                        color: '#939393',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Date of creation
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#939393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8l-6-6-6 6" />
                            <path d="M18 16l-6 6-6-6" />
                          </svg>
                        </div>
                      </th>
                      <th style={{ 
                        padding: '5px 8px',
                        textAlign: 'left',
                        fontSize: '10px',
                        fontWeight: 500,
                        color: '#939393',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Activity
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#939393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8l-6-6-6 6" />
                            <path d="M18 16l-6 6-6-6" />
                          </svg>
                        </div>
                      </th>
                      <th style={{ 
                        padding: '5px 8px',
                        textAlign: 'left',
                        fontSize: '10px',
                        fontWeight: 500,
                        color: '#939393',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Clara Vanstone', email: 'mailaddresses@gmail.com', date: 'Mon, 21 Dec 2024', activity: 'Joined BAO Afrik', isNewUser: true, avatar: avatar },
                      { name: 'Clara Vanstone', email: 'mailaddresses@gmail.com', date: 'Mon, 21 Dec 2024', activity: 'Post new listing', isNewUser: false, avatar: avatar }
                    ].map((item, index) => (
                      <tr key={index} style={{ borderBottom: index < 1 ? '1px solid #F1F1F1' : 'none' }}>
                        {/* Users Column */}
                        <td style={{ padding: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            {/* Square Profile Image */}
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '4px',
                              backgroundColor: '#E3F2FD',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <img 
                                src={item.avatar} 
                                alt={item.name} 
                                style={{ 
                                  width: '26px', 
                                  height: '26px', 
                                  borderRadius: '4px',
                                  objectFit: 'cover'
                                }} 
                              />
                            </div>
                            {/* User Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', flexWrap: 'wrap' }}>
                                <p style={{ 
                                  fontSize: '10px',
                                  color: '#212121',
                                  margin: 0,
                                  fontWeight: 500,
                                  fontFamily: 'Bricolage Grotesque, sans-serif'
                                }}>
                                  {item.name}
                                </p>
                                {item.isNewUser && (
                                  <span style={{
                                    backgroundColor: '#F0F8FE',
                                    color: '#64B5F6',
                                    fontSize: '8px',
                                    fontWeight: 500,
                                    padding: '2px 5px',
                                    borderRadius: '4px',
                                    fontFamily: 'Poppins, sans-serif',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    New user
                                  </span>
                                )}
                              </div>
                              <p style={{ 
                                fontSize: '9px',
                                color: '#939393',
                                margin: 0,
                                fontFamily: 'Poppins, sans-serif'
                              }}>
                                {item.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        {/* Date of creation Column */}
                        <td style={{ padding: '8px' }}>
                          <p style={{ 
                            fontSize: '10px',
                            color: '#939393',
                            margin: 0,
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            {item.date}
                          </p>
                        </td>
                        {/* Activity Column */}
                        <td style={{ padding: '8px' }}>
                          <p style={{ 
                            fontSize: '10px',
                            color: '#939393',
                            margin: 0,
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            {item.activity}
                          </p>
                        </td>
                        {/* Actions Column */}
                        <td style={{ padding: '8px' }}>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            {/* Eye Icon Button */}
                            <button
                              style={{
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                padding: 0
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </button>
                            {/* More Options Button */}
                            <button
                              type="button"
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                border: '0.3px solid #B0B0B0',
                                backgroundColor: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                padding: 0
                              }}
                            >
                              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="3" cy="6" r="1.2" fill="#B0B0B0" />
                                <circle cx="6" cy="6" r="1.2" fill="#B0B0B0" />
                                <circle cx="9" cy="6" r="1.2" fill="#B0B0B0" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
