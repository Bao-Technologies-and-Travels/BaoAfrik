import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/pre/logo.png';
import sideIcon from '../assets/images/pre/side.png';
import lilLogo from '../assets/images/pre/lil.png';
import avatarIcon from '../assets/images/pre/avatar.png';
import basketIcon from '../assets/images/pre/basket.png';
import leftIcon from '../assets/images/pre/left.png';
import notificationIcon from '../assets/images/pre/notification.svg';
import settingIcon from '../assets/images/pre/setting.svg';
import arrowDownIcon from '../assets/images/pre/arrow-down.svg';
import messageIcon from '../assets/images/pre/message.svg';
import boxIcon from '../assets/images/pre/box.svg';
import groupIcon from '../assets/images/pre/group.svg';
import frameIcon from '../assets/images/pre/frame.svg';
import podsIcon from '../assets/images/pre/pods.svg';
import profileInactiveIcon from '../assets/images/pre/pc1.svg';
import profileActiveIcon from '../assets/images/pre/pc2.svg';
import securityInactiveIcon from '../assets/images/pre/sc1.svg';
import securityActiveIcon from '../assets/images/pre/sc2.svg';
import languageInactiveIcon from '../assets/images/pre/lc1.svg';
import languageActiveIcon from '../assets/images/pre/lc2.svg';
import notificationInactiveIcon from '../assets/images/pre/n1.svg';
import notificationActiveIcon from '../assets/images/pre/n2.svg';
import verifyIcon from '../assets/images/pre/verify.svg';
import logoIcon from '../assets/images/logos/ba-brand-icon-colored.png';
import avatar from '../assets/images/logos/avatar.png';
import messageAvatarIcon from '../assets/images/pre/main.png';
import appNotificationIcon from '../assets/images/pre/nof.svg';

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState<'all' | 'unread' | 'messages'>('all');
  const [activeTab, setActiveTab] = useState('personal');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeolocationEnabled, setIsGeolocationEnabled] = useState(false);
  const [biography, setBiography] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedSidebarOption, setSelectedSidebarOption] = useState<'profile' | 'security' | 'language' | 'notifications'>('profile');
  
  // Mock notification data with read/unread status
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'message', isRead: false, sender: 'Nadine Ngum', text: 'sent you a message', subText: 'Click to view', time: '19 min ago', day: 'Today' },
    { id: 2, type: 'app', isRead: false, text: 'Your profile has been updated,', subText: 'you are now...', subText2: 'Invoice 6 August 2025 Sequence: 2-7480...', time: '2 hrs ago', day: 'Today' },
    { id: 3, type: 'message', isRead: true, text: 'New Reviews and Rates from Nadine Ngum...', subText: '"I recently purchased a beautiful Kente...', time: '17:12', day: 'Yesterday' },
    { id: 4, type: 'app', isRead: true, text: 'New post alert', subText: 'A new listing regarding your recent search...', time: '14:57', day: 'Yesterday' },
    { id: 5, type: 'message', isRead: true, sender: 'Elidiana IKE', text: 'sent you a message', subText: 'See more details', time: '11:31', day: 'Yesterday' },
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

  const sidebarOptions = [
    {
      value: 'profile',
      label: 'Profile',
      activeIcon: profileActiveIcon,
      inactiveIcon: profileInactiveIcon
    },
    {
      value: 'security',
      label: 'Security & Privacy',
      activeIcon: securityActiveIcon,
      inactiveIcon: securityInactiveIcon
    },
    {
      value: 'language',
      label: 'Language & Currency',
      activeIcon: languageActiveIcon,
      inactiveIcon: languageInactiveIcon
    },
    {
      value: 'notifications',
      label: 'Notifications',
      activeIcon: notificationActiveIcon,
      inactiveIcon: notificationInactiveIcon
    }
  ] as const;

  const handleHomepageClick = () => {
    navigate('/', { replace: false });
  };

  const handleMenuClick = () => {
    navigate('/', { 
      replace: false,
      state: { 
        openMenu: true
      }
    });
  };

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    setIsLanguageDropdownOpen(false);
  };

  // Handle clicks outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const languageSelector = target.closest('.language-selector');
      const menuDropdown = target.closest('.menu-dropdown');
      const notificationDropdown = target.closest('.notification-dropdown');

      if (!languageSelector && isLanguageDropdownOpen) {
        setIsLanguageDropdownOpen(false);
      }

      if (!menuDropdown && isMenuDropdownOpen) {
        setIsMenuDropdownOpen(false);
      }

      if (!notificationDropdown && isNotificationOpen) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageDropdownOpen, isMenuDropdownOpen, isNotificationOpen]);

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="flex h-screen">
        {/* Left Sidebar - Full Height */}
        <div className="w-72 bg-white border-r-2 border-gray-300 flex-col h-screen sticky top-0 relative">
          {/* Header */}
          <header className="bg-white">
            <div className="w-full pl-6 pr-0 sm:pl-6 sm:pr-2 lg:pl-6 lg:pr-4">
              <div className="flex items-center justify-between h-16">
                {/* Desktop - Logo and sidebar button */}
                <div className="flex items-center justify-between w-full">
                  <img 
                    src={logo} 
                    alt="bao'Afrik" 
                    className="h-8 w-auto"
                  />
                  <button className="bg-white hover:bg-gray-50 rounded-lg transition-colors w-10 h-10 flex items-center justify-center ml-auto">
                    <img 
                      src={sideIcon} 
                      alt="Minimize sidebar" 
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Settings Navigation */}
          <div className="flex-1 flex flex-col pt-6 pl-6 pr-0">
            {/* Settings Title */}
            <h1 className="text-2xl font-medium text-gray-900 mb-6">Settings</h1>
            
            {/* Search Bar */}
            <div className="relative mb-6 pr-6">
              <style>
                {`
                  .sidebar-search::placeholder {
                    color: #B2B2B2;
                  }
                `}
              </style>
              <input
                type="text"
                placeholder="Search something?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 sidebar-search"
                style={{ backgroundColor: '#F1F1F1', color: '#B2B2B2' }}
              />
            </div>

            {/* Navigation Items */}
            <div className="space-y-1">
              {sidebarOptions.map((option) => {
                const isActive = selectedSidebarOption === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSelectedSidebarOption(option.value)}
                    type="button"
                    className="w-full flex items-center space-x-3 pl-3 pr-0 py-2 rounded-l-lg rounded-r-none transition-colors"
                    style={{
                      backgroundColor: isActive ? '#F0F8FE' : 'transparent',
                      borderRight: isActive ? '2px solid #64B5F6' : '2px solid transparent',
                      marginRight: isActive ? '-2px' : '0'
                    }}
                  >
                    <img
                      src={isActive ? option.activeIcon : option.inactiveIcon}
                      alt={option.label}
                      className="w-5 h-5"
                    />
                    <span
                      className="text-sm font-medium text-left"
                      style={{ color: isActive ? '#64B5F6' : '#939393' }}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-gray-50">
            <div className="w-full pl-6 pr-4 sm:pl-6 sm:pr-6 lg:pl-6 lg:pr-8">
              <div className="flex items-center justify-between h-16">
                {/* Center - Breadcrumb */}
                <div className="hidden md:flex items-center space-x-1 text-[10px] md:text-xs">
                  <img 
                    src={leftIcon} 
                    alt="Back" 
                    className="w-4 h-4 cursor-pointer mr-2"
                    onClick={handleHomepageClick}
                  />
                  <span 
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={handleHomepageClick}
                  >
                    Homepage
                  </span>
                  <span className="mx-2" style={{ color: '#D4D4D4' }}>·</span>
                  <span 
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={handleMenuClick}
                  >
                    Menu
                  </span>
                  <span className="mx-2" style={{ color: '#D4D4D4' }}>·</span>
                  <span className="text-gray-400 hover:text-gray-600 cursor-pointer">Settings</span>
                  <span className="mx-2" style={{ color: '#D4D4D4' }}>·</span>
                  <span className="text-gray-900 font-medium">Profile Setting</span>
                </div>

                {/* Right side - Language, button, profile, notifications */}
                <div className="flex items-center space-x-4 bg-gray-50 px-4 py-2 rounded-lg">
                  {/* Language Selector */}
                  <div className="relative language-selector">
                    <button 
                      onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                      className="flex items-center px-2.5 py-1 border rounded-lg bg-white text-sm font-normal hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                      style={{ borderColor: '#E4E4E4', color: '#BABABA' }}
                    >
                      {selectedLanguage}
                      <img src={arrowDownIcon} alt="Arrow" className="ml-1 w-4 h-4" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isLanguageDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <div className="py-1">
                          <button
                            onClick={() => handleLanguageSelect('EN')}
                            className="w-full text-left px-4 py-2 text-sm transition-colors"
                            style={{
                              backgroundColor: selectedLanguage === 'EN' ? '#F0F8FE' : 'transparent',
                              color: selectedLanguage === 'EN' ? '#64B5F6' : '#374151'
                            }}
                          >
                            English
                          </button>
                          <button
                            onClick={() => handleLanguageSelect('FR')}
                            className="w-full text-left px-4 py-2 text-sm transition-colors"
                            style={{
                              backgroundColor: selectedLanguage === 'FR' ? '#F0F8FE' : 'transparent',
                              color: selectedLanguage === 'FR' ? '#64B5F6' : '#374151'
                            }}
                          >
                            French
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Become Seller Button */}
                  <Link
                    to="/register"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                    style={{ backgroundColor: '#FEF6E9' }}
                  >
                    <img 
                      src={basketIcon} 
                      alt="Basket" 
                      className="w-5 h-5"
                      style={{filter: 'brightness(0) saturate(100%) invert(59%) sepia(94%) saturate(423%) hue-rotate(359deg) brightness(98%) contrast(98%)'}}
                    />
                    <span className="text-sm font-normal" style={{ color: '#F9A825' }}>Start Selling</span>
                  </Link>

                  {/* Notification Button */}
                  <div className="relative notification-dropdown">
                    <button
                      onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 focus:outline-none transition-all duration-200 relative"
                      title="Notifications"
                      aria-label="View notifications"
                    >
                      <img 
                        src={notificationIcon} 
                        alt="Notifications" 
                        className="w-6 h-6"
                        style={{ filter: 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(92%)' }}
                      />
                      {unreadCount > 0 && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF0000' }}>
                          <span className="text-white font-medium" style={{ fontSize: '9px' }}>{unreadCount}</span>
                        </div>
                      )}
                    </button>

                    {/* Notification Dropdown */}
                    {isNotificationOpen && (
                      <div 
                        className="fixed right-8 top-20 w-96 bg-white shadow-lg border border-gray-200 z-50 notification-dropdown"
                        style={{ 
                          borderRadius: '20px',
                          maxHeight: '600px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        {/* Header */}
                        <div className="px-6 pt-5 pb-3">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold" style={{ color: '#212121' }}>Notifications</h3>
                            <button
                              onClick={() => setIsNotificationOpen(false)}
                              className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>

                          {/* Tabs */}
                          <div className="flex items-center space-x-6 border-b border-gray-200 relative">
                            <button
                              onClick={() => setNotificationTab('all')}
                              className="pb-2 font-normal transition-colors relative"
                              style={{ 
                                color: notificationTab === 'all' ? '#64B5F6' : '#BABABA',
                                fontSize: '12px'
                              }}
                            >
                              All
                              {notificationTab === 'all' && (
                                <div className="absolute bottom-0 h-0.5" style={{ backgroundColor: '#64B5F6', left: '-4px', right: '-4px' }} />
                              )}
                            </button>
                            <button
                              onClick={() => setNotificationTab('unread')}
                              className="pb-2 font-normal transition-colors relative"
                              style={{ 
                                color: notificationTab === 'unread' ? '#64B5F6' : '#BABABA',
                                fontSize: '12px'
                              }}
                            >
                              Unreads
                              {notificationTab === 'unread' && (
                                <div className="absolute bottom-0 h-0.5" style={{ backgroundColor: '#64B5F6', left: '-4px', right: '-4px' }} />
                              )}
                            </button>
                            <button
                              onClick={() => setNotificationTab('messages')}
                              className="pb-2 font-normal transition-colors relative"
                              style={{ 
                                color: notificationTab === 'messages' ? '#64B5F6' : '#BABABA',
                                fontSize: '12px'
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
                        <div 
                          className="flex-1"
                          style={{ 
                            overflowY: 'auto',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                          }}
                        >
                          <style>
                            {`
                              .notification-dropdown::-webkit-scrollbar {
                                display: none;
                              }
                            `}
                          </style>

                          {/* Render notifications grouped by day */}
                          {['Today', 'Yesterday'].map(day => {
                            const dayNotifs = filteredNotifications.filter(n => n.day === day);
                            if (dayNotifs.length === 0) return null;
                            
                            return (
                              <div key={day} className={day === 'Today' ? 'pt-3 pb-1' : 'pt-2 pb-2'}>
                                <p className="text-xs font-medium mb-2 px-6" style={{ color: '#B0B0B0' }}>{day}</p>
                                
                                {dayNotifs.map((notif) => (
                                  <div key={notif.id} className="transition-colors cursor-pointer" style={{ backgroundColor: notif.isRead ? 'transparent' : '#F5FBFF' }}>
                                    <div className="flex items-start space-x-2 py-2 px-6">
                                      <div className="relative flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: notif.type === 'message' ? '#E3F2FD' : '#F9A825', border: '2px solid white' }}>
                                          {notif.type === 'message' ? (
                                            <img src={avatar} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
                                          ) : (
                                            <img src={logoIcon} alt="Logo" className="w-6 h-6" style={{ filter: 'brightness(0) invert(1)' }} />
                                          )}
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF' }}>
                                          <img src={notif.type === 'message' ? messageAvatarIcon : appNotificationIcon} alt="Icon" className="w-3 h-3" />
                                        </div>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1 min-w-0">
                                            {notif.sender ? (
                                              <p style={{ fontSize: '11px' }}>
                                                <span className="font-semibold" style={{ color: notif.isRead ? '#939393' : '#616161' }}>{notif.sender}</span> <span style={{ color: '#939393' }}>{notif.text}</span>
                                              </p>
                                            ) : (
                                              <p className={notif.id === 2 && !notif.isRead ? 'font-semibold' : ''} style={{ color: notif.isRead ? '#939393' : '#616161', fontSize: '11px' }}>{notif.text}</p>
                                            )}
                                            {notif.subText && (
                                              <p className={notif.id === 1 ? 'mt-0.5' : 'text-xs mt-0.5'} style={{ color: notif.id === 1 && !notif.isRead ? '#64B5F6' : '#9E9E9E', fontSize: notif.id === 1 ? '11px' : '10px' }}>{notif.subText}</p>
                                            )}
                                            {notif.subText2 && (
                                              <p className="text-xs mt-0.5" style={{ color: '#9E9E9E', fontSize: '10px' }}>{notif.subText2}</p>
                                            )}
                                          </div>
                                          <div className="flex flex-col items-end ml-2 flex-shrink-0" style={{ gap: notif.isRead ? '2px' : '4px' }}>
                                            <button className="text-gray-400 hover:text-gray-600">
                                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <circle cx="6" cy="12" r="1.5"/>
                                                <circle cx="12" cy="12" r="1.5"/>
                                                <circle cx="18" cy="12" r="1.5"/>
                                              </svg>
                                            </button>
                                            {notif.isRead ? (
                                              <span className="text-xs" style={{ color: '#9E9E9E', fontSize: '10px' }}>{notif.time}</span>
                                            ) : (
                                              <div className="flex items-center space-x-1" style={{ marginTop: notif.id === 2 ? '16px' : '6px' }}>
                                                <span style={{ color: '#9E9E9E', fontSize: '9px' }}>{notif.time}</span>
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#64B5F6' }} />
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {notif.id !== dayNotifs[dayNotifs.length - 1].id && <div className="border-b border-gray-100" />}
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile Picture */}
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src={avatarIcon} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Menu Button */}
                  <div className="relative menu-dropdown">
                    <button 
                      onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                      className="p-2 text-gray-600 hover:text-gray-900"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isMenuDropdownOpen && (
                      <div className="fixed right-8 top-0 w-64 bg-white rounded-2xl shadow-lg border border-gray-200 py-3 z-50 max-h-screen overflow-y-auto custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: 'white #f3f4f6' }}>
                        {/* Start selling button with exit */}
                        <div className="px-3 pb-3 flex items-center justify-between">
                          <Link 
                            to="/register" 
                            className="inline-flex items-center px-3 py-1.5 rounded-lg font-normal text-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2" 
                            style={{backgroundColor: '#FFF8F0', color: '#F9A822'}}
                            onMouseEnter={(e) => {
                              (e.target as HTMLElement).style.backgroundColor = '#FFF0E6';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.backgroundColor = '#FFF8F0';
                            }}
                            onClick={() => setIsMenuDropdownOpen(false)}
                          >
                            <svg className="w-3 h-3 mr-1.5 border border-orange-500 rounded-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#F9A822'}}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                            Start selling
                          </Link>
                          <button
                            onClick={() => setIsMenuDropdownOpen(false)}
                            className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Profile Section */}
                        <div className="flex items-center space-x-2 px-3 py-3 border-b border-gray-100">
                          <img 
                            src={avatarIcon} 
                            alt="User avatar" 
                            className="w-12 h-12 rounded-full object-cover"
                            width="48"
                            height="48"
                          />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500">My profile</p>
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold text-gray-900">Jean Kameni</h3>
                              <div className="w-6 h-6 rounded flex items-center justify-center" style={{backgroundColor: '#E3F2FD'}}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#64B5F6'}}>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Create a new listing button */}
                        <div className="px-3 py-3">
                          <Link
                            to="/create-listing"
                            className="block w-full px-3 py-2 rounded-lg font-medium text-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                            style={{backgroundColor: '#E3F2FD', color: '#64B5F6'}}
                            onClick={() => setIsMenuDropdownOpen(false)}
                          >
                            <div className="flex items-center justify-center space-x-1.5">
                              <span>Create a new listing</span>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#64B5F6'}}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                          </Link>
                        </div>

                        {/* Navigation Menu Items */}
                        <div className="space-y-0.5 px-2">
                          {/* Chats */}
                          <Link 
                            to="/messages" 
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                            onClick={() => setIsMenuDropdownOpen(false)}
                          >
                            <div className="flex items-center space-x-2">
                              <img src={messageIcon} alt="Message" className="w-4 h-4" style={{color: '#64B5F6'}} />
                              <div>
                                <div className="font-medium text-sm" style={{color: '#6A6A6A'}}>Chats</div>
                              </div>
                            </div>
                          </Link>

                          {/* My listings */}
                          <Link 
                            to="/my-listings" 
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                            onClick={() => setIsMenuDropdownOpen(false)}
                          >
                            <div className="flex items-center space-x-2">
                              <img src={boxIcon} alt="Box" className="w-4 h-4" style={{color: '#64B5F6'}} />
                              <div>
                                <div className="font-medium text-sm" style={{color: '#6A6A6A'}}>My listings</div>
                              </div>
                            </div>
                          </Link>

                          {/* My requests */}
                          <Link 
                            to="/my-requests" 
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                            onClick={() => setIsMenuDropdownOpen(false)}
                          >
                            <div className="flex items-center space-x-2">
                              <img src={groupIcon} alt="Group" className="w-4 h-4" style={{color: '#64B5F6'}} />
                              <div>
                                <div className="font-medium text-sm" style={{color: '#6A6A6A'}}>My requests</div>
                              </div>
                            </div>
                          </Link>

                          {/* Bookmarks */}
                          <Link 
                            to="/bookmarks" 
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                            onClick={() => setIsMenuDropdownOpen(false)}
                          >
                            <div className="flex items-center space-x-2">
                              <img src={frameIcon} alt="Frame" className="w-4 h-4" style={{color: '#64B5F6'}} />
                              <div>
                                <div className="font-medium text-sm" style={{color: '#6A6A6A'}}>Bookmarks</div>
                              </div>
                            </div>
                          </Link>

                          {/* Help Center */}
                          <Link 
                            to="/help" 
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                            onClick={() => setIsMenuDropdownOpen(false)}
                          >
                            <div className="flex items-center space-x-2">
                              <img src={podsIcon} alt="Pods" className="w-4 h-4" style={{color: '#64B5F6'}} />
                              <div>
                                <div className="font-medium text-sm" style={{color: '#6A6A6A'}}>Help Center</div>
                              </div>
                            </div>
                          </Link>

                          {/* Settings */}
                          <Link 
                            to="/settings" 
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                            onClick={() => setIsMenuDropdownOpen(false)}
                          >
                            <div className="flex items-center space-x-2">
                              <img src={settingIcon} alt="Setting" className="w-4 h-4" style={{color: '#64B5F6'}} />
                              <div>
                                <div className="font-medium text-sm" style={{color: '#6A6A6A'}}>Settings</div>
                              </div>
                            </div>
                          </Link>

                          {/* Log Out */}
                          <div className="px-3 pt-3 border-t border-gray-100">
                            <button 
                              onClick={() => setIsMenuDropdownOpen(false)}
                              className="w-full bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6A6A6A'}}>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <div className="text-left">
                                  <div className="font-medium text-xs" style={{color: '#6A6A6A'}}>Log Out</div>
                                  <div className="text-xs" style={{color: '#6A6A6A'}}>Log out of BAO Afrik</div>
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 mx-8 mt-8 mb-0 flex gap-6 overflow-hidden" style={{ minHeight: 'calc(100vh - 140px)', maxHeight: 'calc(100vh - 140px)' }}>
            {/* Left Content Area */}
            <div className="flex-1 bg-white border border-gray-200 rounded-[20px] p-4 overflow-y-auto scrollbar-hide">
              {/* Section Header */}
              <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
                <div className="mb-3">
                <h1 className="text-lg font-semibold text-gray-900 mb-1">Profile Setting</h1>
                <p className="text-xs" style={{ color: '#BABABA' }}>
                  Update your profile and control what others see on BAO' Afrik.
                </p>
              </div>
              </div>

              {/* Sub-navigation Tabs */}
              <div className="flex items-center space-x-4 mb-4 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`flex items-center space-x-1.5 pb-2 relative ${
                    activeTab === 'personal' ? 'border-b-2' : ''
                  }`}
                  style={{
                    borderBottomColor: activeTab === 'personal' ? '#64B5F6' : 'transparent'
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: activeTab === 'personal' ? '#64B5F6' : '#6A6A6A' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: activeTab === 'personal' ? '#64B5F6' : '#6A6A6A' }}>
                    Personal Information
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('verification')}
                  className={`flex items-center space-x-1.5 pb-2 relative ${
                    activeTab === 'verification' ? 'border-b-2' : ''
                  }`}
                  style={{
                    borderBottomColor: activeTab === 'verification' ? '#64B5F6' : 'transparent'
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: activeTab === 'verification' ? '#64B5F6' : '#6A6A6A' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: activeTab === 'verification' ? '#64B5F6' : '#6A6A6A' }}>
                    Verification
                  </span>
                </button>
              </div>

              {/* Personal Information Tab Content */}
              {activeTab === 'personal' && (
                <div className="space-y-3">
                  <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
                    {/* Upload Photo Section */}
                    <div>
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center" style={{ borderColor: '#E1E1E1' }}>
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#BABABA' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <button 
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        style={{ backgroundColor: '#F0F8FE', color: '#64B5F6' }}
                      >
                        Upload a photo
                      </button>
                      <p className="text-[10px]" style={{ color: '#BABABA' }}>
                        At least 800 x 800 px recommended. JPG or PNG allowed.
                      </p>
                    </div>
                  </div>
                  </div>

                  {/* Profile Setting Details */}
                  <div className="border rounded-2xl p-3 bg-white shadow-sm" style={{ borderColor: '#E1E1E1' }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-900">Profile Setting</h3>
                      <button
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                        className="flex items-center space-x-1 px-2 py-1 border rounded-lg transition-colors hover:bg-gray-50"
                        style={{ borderColor: '#D9D9D9' }}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#6A6A6A' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="text-[10px]" style={{ color: '#6A6A6A' }}>Edit</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] mb-0.5 block" style={{ color: '#BABABA' }}>Full name</label>
                        <p className="text-xs font-semibold text-gray-900">Jean Kameni</p>
                      </div>
                      <div>
                        <label className="text-[10px] mb-0.5 block" style={{ color: '#BABABA' }}>Gender</label>
                        <p className="text-xs text-gray-900">Male</p>
                      </div>
                      <div>
                        <label className="text-[10px] mb-0.5 block" style={{ color: '#BABABA' }}>Birthday</label>
                        <p className="text-xs text-gray-900">13/09/2000</p>
                      </div>
                    </div>
                  </div>

                  {/* Location Section */}
                  <div className="border rounded-2xl p-3 bg-white shadow-sm" style={{ borderColor: '#E1E1E1' }}>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Location</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-900">Geolocation</span>
                      <button
                        onClick={() => setIsGeolocationEnabled(!isGeolocationEnabled)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          isGeolocationEnabled ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            isGeolocationEnabled ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value="London, United Kingdom"
                        readOnly
                        className="w-full px-3 py-2 pl-8 rounded-lg text-xs focus:outline-none"
                        style={{ backgroundColor: '#F1F1F1', color: '#212121' }}
                      />
                      <svg 
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{ color: '#64B5F6' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Biography Section */}
                  <div className="border rounded-2xl p-3 bg-white shadow-sm" style={{ borderColor: '#E1E1E1' }}>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Biography</h3>
                    <div className="relative">
                      <textarea
                        value={biography}
                        onChange={(e) => {
                          if (e.target.value.length <= 500) {
                            setBiography(e.target.value);
                          }
                        }}
                        placeholder="Can you tell us more about yourself?"
                        className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none resize-none"
                        style={{ 
                          backgroundColor: '#F1F1F1', 
                          color: '#212121',
                          minHeight: '80px'
                        }}
                        maxLength={500}
                      />
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px]" style={{ color: '#64B5F6' }}>
                          {biography.length}/500
                        </span>
                        <button
                          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                          style={{ backgroundColor: '#F1F1F1', color: '#6A6A6A' }}
                        >
                          Save biographie
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Verification Tab Content */}
              {activeTab === 'verification' && (
                <div className="text-center py-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500">Verification content will be implemented here</p>
                </div>
              )}
            </div>

            {/* Right Panel - Profile Completion */}
            <div className="w-64 bg-white border border-gray-200 rounded-[20px] p-4 overflow-y-auto scrollbar-hide" style={{ paddingBottom: '20px', maxHeight: 'fit-content' }}>
              <h3 className="text-sm font-medium text-gray-900 mb-4 text-center">Complete your profile</h3>
              
              {/* Progress Indicator */}
              <div className="flex flex-col items-center mb-4">
                <div className="flex items-center justify-center mb-4">
                  <img src={verifyIcon} alt="Verify" className="w-14 h-14" />
                </div>
                <div className="w-full relative" style={{ marginTop: '12px', marginBottom: '12px' }}>
                  <span className="absolute -top-5 left-0 text-xs font-semibold" style={{ color: '#6A6A6A' }}>20%</span>
                  <div className="w-full bg-gray-200 rounded-full h-1.5" style={{ backgroundColor: '#F1F1F1' }}>
                    <div className="h-1.5 rounded-full" style={{ width: '20%', backgroundColor: '#4CD964' }}></div>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-4">
                <div className="flex items-center space-x-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#4CD964' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: '#6A6A6A' }}>Setup account <span className="font-medium" style={{ color: '#6A6A6A' }}>10%</span></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#4CD964' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: '#6A6A6A' }}>Personnal information <span className="font-medium" style={{ color: '#6A6A6A' }}>10%</span></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#B0B0B0' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: '#B0B0B0' }}>Upload your photo <span className="font-medium" style={{ color: '#6A6A6A' }}>10%</span></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#B0B0B0' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: '#B0B0B0' }}>Location <span className="font-medium" style={{ color: '#6A6A6A' }}>10%</span></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#B0B0B0' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: '#B0B0B0' }}>Description <span className="font-medium" style={{ color: '#6A6A6A' }}>10%</span></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#B0B0B0' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: '#B0B0B0' }}>Verification first step <span className="font-medium" style={{ color: '#6A6A6A' }}>25%</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-gray-50">
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
                  <Link to="/contact" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Contact Us</Link>
                  <span style={{ color: '#BABABA' }}>|</span>
                  <Link to="/terms" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Terms and conditions of use</Link>
                  <span style={{ color: '#BABABA' }}>|</span>
                  <Link to="/privacy" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Privacy policies</Link>
                  <span style={{ color: '#BABABA' }}>|</span>
                  <Link to="/cookies" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Cookies</Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;

