import React, { useState, useEffect, useRef } from 'react';
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
import pi1Icon from '../assets/images/pre/pi1.svg';
import pi2Icon from '../assets/images/pre/pi2.svg';
import v1Icon from '../assets/images/pre/v1.svg';
import v2Icon from '../assets/images/pre/v2.svg';
import cameraIcon from '../assets/images/pre/camera.svg';
import locationIcon from '../assets/images/pre/PL.svg';
import pencilIcon from '../assets/images/pre/pencil.svg';
import loadIcon from '../assets/images/pre/load.svg';
import calendarIcon from '../assets/images/pre/calendar.svg';
import zapIcon from '../assets/images/pre/zap1.svg';
import fbIcon from '../assets/images/pre/FB1.svg';
import igIcon from '../assets/images/pre/IG1.svg';
import xIcon from '../assets/images/pre/x.svg';

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
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const genderDropdownRef = useRef<HTMLDivElement>(null);
  const [isBirthdayCalendarOpen, setIsBirthdayCalendarOpen] = useState(false);
  const birthdayCalendarRef = useRef<HTMLDivElement>(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  
  // Profile editing state
  const [profileData, setProfileData] = useState({
    fullName: 'Jean Kameni',
    gender: 'Male',
    birthday: '13/09/2000'
  });
  
  // Image upload state
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const genderOptions = ['Male', 'Female', 'Other'];
  const phoneDropdownRef = useRef<HTMLDivElement>(null);

  const [verificationForm, setVerificationForm] = useState({
    email: 'google.mail@gmail.com',
    phone: ''
  });
  const [selectedPhoneCode, setSelectedPhoneCode] = useState({
    label: 'United States',
    code: '+1',
    flag: 'us'
  });
  const [isPhoneCodeDropdownOpen, setIsPhoneCodeDropdownOpen] = useState(false);
  const phoneCodes = [
    { label: 'United States', code: '+1', flag: 'us' },
    { label: 'United Kingdom', code: '+44', flag: 'gb' },
    { label: 'France', code: '+33', flag: 'fr' },
    { label: 'Cameroon', code: '+237', flag: 'cm' },
    { label: 'South Africa', code: '+27', flag: 'za' }
  ];

  const [socialConnections, setSocialConnections] = useState({
    whatsapp: false,
    facebook: false,
    instagram: false,
    linkedin: false,
    x: false
  });

  const socialPlatforms = [
    {
      key: 'whatsapp',
      name: 'Whatsapp',
      description: 'Connect with your Whatsapp account',
      icon: zapIcon
    },
    {
      key: 'facebook',
      name: 'Facebook',
      description: 'Connect with your Facebook account',
      icon: fbIcon
    },
    {
      key: 'instagram',
      name: 'Instagram',
      description: 'Connect with your Instagram account',
      icon: igIcon
    },
    {
      key: 'linkedin',
      name: 'LinkedIn',
      description: 'Connect with your LinkedIn account',
      icon: null
    },
    {
      key: 'x',
      name: 'X',
      description: 'Connect with your X account',
      icon: xIcon
    }
  ] as const;
  
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

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsImageLoading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsImageLoading(false);
            const reader = new FileReader();
            reader.onloadend = () => {
              setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle profile save
  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    setIsGenderDropdownOpen(false);
    setIsBirthdayCalendarOpen(false);
  };

  const handleVerificationInput = (field: 'email' | 'phone', value: string) => {
    setVerificationForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneCodeSelect = (code: { label: string; flag: string; code: string }) => {
    setSelectedPhoneCode(code);
    setIsPhoneCodeDropdownOpen(false);
  };

  const handleSocialToggle = (key: keyof typeof socialConnections) => {
    setSocialConnections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseBirthday = (value: string) => {
    const [day, month, year] = value.split('/');
    if (!day || !month || !year) return null;
    const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const handleGenderSelect = (gender: string) => {
    setProfileData(prev => ({ ...prev, gender }));
    setIsGenderDropdownOpen(false);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCalendarDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const openBirthdayCalendar = () => {
    const parsed = parseBirthday(profileData.birthday);
    if (parsed) {
      setCalendarDate(parsed);
    }
    setIsBirthdayCalendarOpen(true);
  };

  const generateCalendarDays = () => {
    const startOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
    const endOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const days: (Date | null)[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= endOfMonth.getDate(); day++) {
      days.push(new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day));
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

      if (genderDropdownRef.current && !genderDropdownRef.current.contains(target) && isGenderDropdownOpen) {
        setIsGenderDropdownOpen(false);
      }

      if (birthdayCalendarRef.current && !birthdayCalendarRef.current.contains(target) && isBirthdayCalendarOpen) {
        setIsBirthdayCalendarOpen(false);
      }

      if (phoneDropdownRef.current && !phoneDropdownRef.current.contains(target) && isPhoneCodeDropdownOpen) {
        setIsPhoneCodeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageDropdownOpen, isMenuDropdownOpen, isNotificationOpen, isGenderDropdownOpen, isBirthdayCalendarOpen, isPhoneCodeDropdownOpen]);

  return (
    <>
      <style>{`
        .profile-edit-input::placeholder {
          color: #BABABA !important;
        }
        .profile-edit-input-birthday::placeholder {
          color: #BABABA !important;
        }
        .verification-input::placeholder {
          color: #D9D9D9 !important;
        }
      `}</style>
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
                <div className="hidden md:flex items-center space-x-3 text-[10px] md:text-xs">
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
                  <span className="mx-3" style={{ color: '#D4D4D4' }}>·</span>
                  <span 
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={handleMenuClick}
                  >
                    Menu
                  </span>
                  <span className="mx-3" style={{ color: '#D4D4D4' }}>·</span>
                  <span className="text-gray-400 hover:text-gray-600 cursor-pointer">Settings</span>
                  <span className="mx-3" style={{ color: '#D4D4D4' }}>·</span>
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
            <div className="flex-1 bg-white border border-gray-200 rounded-[20px] px-8 py-4 overflow-y-auto scrollbar-hide">
              {/* Section Header */}
              <div className="bg-white p-2 mb-3">
                <div className="mb-2">
                <h1 className="text-sm font-semibold text-gray-900 mb-0.5">Profile Setting</h1>
                <p className="text-[10px]" style={{ color: '#BABABA' }}>
                  Update your profile and control what others see on BAO' Afrik.
                </p>
              </div>
              </div>

              {/* Sub-navigation Tabs */}
              <div className="flex items-center space-x-4 mb-2 -mx-8 px-8 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`flex items-center space-x-1.5 pb-2 relative ${
                    activeTab === 'personal' ? 'border-b-2' : ''
                  }`}
                  style={{
                    borderBottomColor: activeTab === 'personal' ? '#64B5F6' : 'transparent'
                  }}
                >
                  <img 
                    src={activeTab === 'personal' ? pi2Icon : pi1Icon} 
                    alt="Personal Information" 
                    className="w-4 h-4"
                  />
                  <span className="text-xs font-normal" style={{ color: activeTab === 'personal' ? '#64B5F6' : '#B0B0B0' }}>
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
                  <img 
                    src={activeTab === 'verification' ? v2Icon : v1Icon} 
                    alt="Verification" 
                    className="w-4 h-4"
                  />
                  <span className="text-xs font-normal" style={{ color: activeTab === 'verification' ? '#64B5F6' : '#B0B0B0' }}>
                    Verification
                  </span>
                </button>
              </div>

              {/* Personal Information Tab Content */}
              {activeTab === 'personal' && (
                <div className="space-y-3">
                  <div className="bg-white py-3">
                    {/* Upload Photo Section */}
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-24 h-24 border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden"
                        style={{ 
                          borderColor: isImageLoading ? '#83C4F8' : '#E1E1E1', 
                          borderRadius: '13px',
                          background: isImageLoading 
                            ? 'repeating-linear-gradient(-45deg, #F5FBFF, #F5FBFF 18px, #F8FCFF 18px, #F8FCFF 36px)'
                            : (profileImage ? 'transparent' : 'transparent'),
                          border: isImageLoading ? '2px dashed #83C4F8' : (profileImage ? 'none' : '2px dashed #E1E1E1')
                        }}
                      >
                        {isImageLoading ? (
                          <div className="flex flex-col items-center justify-center">
                            <div className="relative mb-2">
                              {/* Gray base circle */}
                              <svg width="48" height="48" className="transform -rotate-90">
                                <circle
                                  cx="24"
                                  cy="24"
                                  r="22"
                                  fill="none"
                                  stroke="#E9E9E9"
                                  strokeWidth="2"
                                />
                                {/* Blue progress arc */}
                                <circle
                                  cx="24"
                                  cy="24"
                                  r="22"
                                  fill="none"
                                  stroke="#83C4F8"
                                  strokeWidth="2"
                                  strokeDasharray={`${(uploadProgress / 100) * 138} 138`}
                                  strokeLinecap="round"
                                />
                              </svg>
                              {/* Icon in center */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <img 
                                  src={loadIcon} 
                                  alt="Loading" 
                                  style={{ 
                                    width: '20px', 
                                    height: '20px',
                                    filter: 'brightness(0) saturate(100%) invert(70%) sepia(36%) saturate(624%) hue-rotate(172deg) brightness(100%) contrast(96%)'
                                  }}
                                />
                              </div>
                            </div>
                            <p className="text-[8px] font-medium" style={{ color: '#83C4F8' }}>
                              {uploadProgress}%
                            </p>
                          </div>
                        ) : profileImage ? (
                          <>
                            <img
                              src={profileImage}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                            <div 
                              className="absolute inset-0 flex items-center justify-center"
                              style={{ backgroundColor: '#FFFFFF99' }}
                            >
                              <img 
                                src={cameraIcon} 
                                alt="Camera" 
                                className="w-8 h-8" 
                                style={{ filter: 'brightness(0) invert(1)' }}
                              />
                            </div>
                          </>
                        ) : (
                          <img src={cameraIcon} alt="Camera" className="w-8 h-8" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          ref={fileInputRef}
                          className="hidden"
                        />
                        <button 
                          onClick={handleUploadButtonClick}
                          className="px-2 py-1.5 rounded-lg text-xs font-normal transition-colors border mb-1"
                          style={{ backgroundColor: 'white', color: '#6A6A6A', borderColor: '#D9D9D9', width: 'fit-content' }}
                        >
                          Upload a photo
                        </button>
                        <p className="text-[10px]" style={{ color: '#ACAAAA' }}>
                          At least 800 x 800 px recommanded.<br />
                          JPG or PNG allowed
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="mt-4 -mx-8" style={{ height: '0.5px', backgroundColor: '#E9E9E9' }}></div>

                  {/* Profile Setting Details */}
                  <div className="border rounded-2xl p-2 bg-white shadow-sm" style={{ borderColor: '#E1E1E1' }}>
                    {!isEditingProfile ? (
                      <>
                        <div className="flex items-center justify-between mb-2" style={{ paddingLeft: '4px', paddingRight: '4px' }}>
                          <h3 className="text-xs font-semibold" style={{ color: '#6A6A6A' }}>Profile Setting</h3>
                          <button
                            onClick={() => setIsEditingProfile(true)}
                            className="flex items-center space-x-1 px-2 py-1 border rounded-lg transition-colors hover:bg-gray-50"
                            style={{ borderColor: '#D9D9D9' }}
                          >
                            <img src={pencilIcon} alt="Edit" className="w-3 h-3" />
                            <span className="text-[10px]" style={{ color: '#6A6A6A' }}>Edit</span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between" style={{ paddingLeft: '4px', paddingRight: '4px' }}>
                          <div style={{ marginRight: '4px' }}>
                            <label className="text-[10px] mb-0.5 block" style={{ color: '#6A6A6A' }}>Full name</label>
                            <p className="text-xs font-medium" style={{ color: '#212121' }}>{profileData.fullName}</p>
                          </div>
                          <div>
                            <label className="text-[10px] mb-0.5 block" style={{ color: '#6A6A6A' }}>Gender</label>
                            <p className="text-xs font-medium" style={{ color: '#212121' }}>{profileData.gender}</p>
                          </div>
                          <div style={{ marginLeft: '4px' }}>
                            <label className="text-[10px] mb-0.5 block" style={{ color: '#6A6A6A' }}>Birthday</label>
                            <p className="text-xs font-medium" style={{ color: '#212121' }}>{profileData.birthday}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        {/* Full Name Field */}
                        <div className="relative">
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px]" style={{ color: '#6A6A6A' }}>Full name</label>
                            <button
                              onClick={handleSaveProfile}
                              className="flex items-center space-x-1"
                              style={{ color: '#BABABA' }}
                            >
                              <span className="text-[10px]">Save changes</span>
                              <img src={arrowDownIcon} alt="Save" className="w-3 h-3" style={{ transform: 'rotate(180deg)' }} />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={profileData.fullName}
                            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                            placeholder="Idriss Uswold"
                            className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none profile-edit-input"
                            style={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #E9E9E9',
                              color: profileData.fullName ? '#212121' : '#BABABA'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#64B5F6';
                              e.target.style.caretColor = '#64B5F6';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#E9E9E9';
                            }}
                          />
                        </div>
                        {/* Gender and Birthday Fields */}
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 gender-dropdown" ref={genderDropdownRef}>
                            <label className="text-[10px] mb-1 block" style={{ color: '#6A6A6A' }}>Gender</label>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setIsGenderDropdownOpen(prev => !prev)}
                                className="w-full px-3 py-2 pr-8 rounded-lg text-xs text-left focus:outline-none"
                                style={{ 
                                  backgroundColor: 'white', 
                                  border: '1px solid #E9E9E9',
                                  color: profileData.gender ? '#212121' : '#B0B0B0'
                                }}
                              >
                                {profileData.gender || 'Select gender'}
                              </button>
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                  <path d="M6 9l6 6 6-6" stroke="#BABABA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                              {isGenderDropdownOpen && (
                                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-lg py-2">
                                  {genderOptions.map(option => (
                                    <button
                                      type="button"
                                      key={option}
                                      onClick={() => handleGenderSelect(option)}
                                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs"
                                      style={{
                                        backgroundColor: profileData.gender === option ? '#F0F8FE' : 'transparent',
                                        color: profileData.gender === option ? '#64B5F6' : '#B0B0B0'
                                      }}
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex-1" ref={birthdayCalendarRef}>
                            <label className="text-[10px] mb-1 block" style={{ color: '#6A6A6A' }}>Birthday</label>
                            <div className="relative birthday-calendar">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <img 
                                  src={calendarIcon} 
                                  alt="Calendar" 
                                  style={{ width: '14px', height: '14px', filter: 'brightness(0) saturate(100%) invert(79%) sepia(6%) saturate(136%) hue-rotate(189deg) brightness(88%) contrast(89%)' }}
                                />
                              </span>
                              <input
                                type="text"
                                value={profileData.birthday}
                                onChange={(e) => setProfileData({ ...profileData, birthday: e.target.value })}
                                placeholder="13/09/2000"
                                className="w-full px-3 py-2 pl-9 rounded-lg text-xs focus:outline-none profile-edit-input-birthday"
                                style={{ 
                                  backgroundColor: 'white', 
                                  border: '1px solid #E9E9E9',
                                  color: profileData.birthday ? '#212121' : '#BABABA'
                                }}
                                onFocus={(e) => {
                                  e.target.style.borderColor = '#64B5F6';
                                  e.target.style.caretColor = '#64B5F6';
                                  openBirthdayCalendar();
                                }}
                                onClick={() => openBirthdayCalendar()}
                                onBlur={(e) => {
                                  e.target.style.borderColor = '#E9E9E9';
                                }}
                                readOnly
                              />
                              {isBirthdayCalendarOpen && (
                                <div className="absolute z-20 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <button
                                      type="button"
                                      className="w-6 h-6 flex items-center justify-center rounded-full"
                                      style={{ backgroundColor: '#F5F5F5', color: '#6A6A6A' }}
                                      onClick={() => handleMonthChange('prev')}
                                    >
                                      ‹
                                    </button>
                                    <span className="text-xs font-medium" style={{ color: '#6A6A6A' }}>
                                      {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </span>
                                    <button
                                      type="button"
                                      className="w-6 h-6 flex items-center justify-center rounded-full"
                                      style={{ backgroundColor: '#F5F5F5', color: '#6A6A6A' }}
                                      onClick={() => handleMonthChange('next')}
                                    >
                                      ›
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-7 gap-1 text-[10px] mb-1" style={{ color: '#B0B0B0' }}>
                                    {daysOfWeek.map(day => (
                                      <span key={day} className="text-center font-medium">{day}</span>
                                    ))}
                                  </div>
                                  <div className="grid grid-cols-7 gap-1 text-[11px]">
                                    {calendarDays.map((day, index) => {
                                      if (!day) {
                                        return <span key={index} className="h-7 flex items-center justify-center text-gray-300 text-[10px]"> </span>;
                                      }
                                      const value = formatDate(day);
                                      const isSelected = profileData.birthday === value;
                                      return (
                                        <button
                                          type="button"
                                          key={value}
                                          className="h-7 rounded-full flex items-center justify-center transition-colors"
                                          style={{
                                            backgroundColor: isSelected ? '#F0F8FE' : 'transparent',
                                            color: isSelected ? '#64B5F6' : '#6A6A6A'
                                          }}
                                          onClick={() => {
                                            setProfileData(prev => ({ ...prev, birthday: value }));
                                            setIsBirthdayCalendarOpen(false);
                                          }}
                                        >
                                          {day.getDate()}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Location Section */}
                  <div className="border rounded-2xl p-3 bg-white shadow-sm" style={{ borderColor: '#E1E1E1' }}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-normal" style={{ color: '#6A6A6A' }}>Location</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px]" style={{ color: '#64B5F6' }}>Geolocation</span>
                        <button
                          onClick={() => setIsGeolocationEnabled(!isGeolocationEnabled)}
                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                          style={{ backgroundColor: isGeolocationEnabled ? '#4CD964' : '#D1D5DB' }}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isGeolocationEnabled ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value="London, United Kingdom"
                        readOnly
                        className="w-full px-3 py-2 pl-8 rounded-xl text-xs focus:outline-none"
                        style={{ backgroundColor: 'white', color: '#6A6A6A', border: '1px solid #E9E9E9', borderRadius: '12px' }}
                      />
                      <img 
                        src={locationIcon} 
                        alt="Location" 
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4"
                        style={{ filter: 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(92%)' }}
                      />
                    </div>
                  </div>

                  {/* Biography Section */}
                  <div className="border rounded-2xl p-3 bg-white shadow-sm" style={{ borderColor: '#E1E1E1' }}>
                    <div className="relative">
                      <textarea
                        value={biography}
                        onChange={(e) => {
                          if (e.target.value.length <= 500) {
                            setBiography(e.target.value);
                          }
                        }}
                        placeholder="Can you tell us more about yourself ?"
                        className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none resize-none"
                        style={{ 
                          backgroundColor: 'white', 
                          color: '#212121',
                          minHeight: '80px',
                          border: 'none'
                        }}
                        maxLength={500}
                      />
                      <style>
                        {`
                          textarea::placeholder {
                            color: #D9D9D9;
                          }
                        `}
                      </style>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px]" style={{ color: '#D9D9D9' }}>
                          {biography.length}/500
                        </span>
                        <button
                          className="px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors"
                          style={{ backgroundColor: '#E9E9E9', color: '#6A6A6A' }}
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
                <div className="bg-white rounded-2xl p-4">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium" style={{ color: '#6A6A6A' }}>
                          Email address
                        </label>
                        <button className="text-[10px] font-normal" style={{ color: '#64B5F6' }}>
                          Change mail address
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type="email"
                          value={verificationForm.email}
                          onChange={(e) => handleVerificationInput('email', e.target.value)}
                          placeholder="Enter your email address"
                          className="verification-input w-full px-4 py-2 pr-24 rounded-lg text-xs focus:outline-none"
                          style={{ border: '1px solid #E9E9E9', borderRadius: '10px', color: '#212121' }}
                        />
                        <span className="absolute top-1/2 right-2 -translate-y-1/2">
                          <span
                            className="px-3.5 py-1 text-[10px] font-medium inline-flex items-center justify-center"
                            style={{ backgroundColor: '#EDFBF0', color: '#4CD964', borderRadius: '6px' }}
                          >
                            Verified
                          </span>
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: '#6A6A6A' }}>
                        Phone number
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="relative" ref={phoneDropdownRef}>
                          <button
                            type="button"
                            onClick={() => setIsPhoneCodeDropdownOpen(prev => !prev)}
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg border bg-white focus:outline-none"
                          style={{ borderColor: '#E9E9E9', borderRadius: '10px' }}
                          >
                            <img
                              src={`https://flagcdn.com/40x30/${selectedPhoneCode.flag}.png`}
                              alt={selectedPhoneCode.label}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                          <span className="text-xs font-medium" style={{ color: '#B0B0B0' }}>
                              {selectedPhoneCode.code}
                            </span>
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                              <path d="M6 9l6 6 6-6" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          {isPhoneCodeDropdownOpen && (
                            <div className="absolute z-30 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-lg py-2">
                              {phoneCodes.map(code => (
                                <button
                                  type="button"
                                  key={code.code}
                                  onClick={() => handlePhoneCodeSelect(code)}
                                  className="w-full px-3 py-2 flex items-center space-x-2 text-left hover:bg-gray-50"
                                >
                                  <img
                                    src={`https://flagcdn.com/40x30/${code.flag}.png`}
                                    alt={code.label}
                                    className="w-5 h-5 rounded-full object-cover"
                                  />
                                  <div className="flex items-center space-x-2">
                                    <p className="text-xs font-medium" style={{ color: '#212121' }}>
                                      {code.label}
                                    </p>
                                    <p className="text-[11px]" style={{ color: '#B0B0B0' }}>
                                      {code.code}
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <input
                          type="tel"
                          value={verificationForm.phone}
                          onChange={(e) => handleVerificationInput('phone', e.target.value)}
                          placeholder="Enter your phone number"
                          className="verification-input flex-1 px-4 py-2 rounded-lg text-xs focus:outline-none"
                          style={{ border: '1px solid #E9E9E9', borderRadius: '10px', color: '#212121' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-sm font-medium mb-1.5" style={{ color: '#212121' }}>
                      First level verification
                    </h3>
                    <p className="text-[11px] mb-5" style={{ color: '#939393' }}>
                      Connect your social media accounts to verify your identity. Connecting at least two accounts will earn you a first-level verified badge.
                    </p>
                    <div className="space-y-3">
                      {socialPlatforms.map(platform => (
                        <div key={platform.key} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {platform.key === 'linkedin' ? (
                              <svg width="28" height="28" viewBox="0 0 448 512">
                                <rect width="448" height="512" rx="90" fill="#0A66C2" />
                                <path
                                  d="M100.28 448H7.4V148.9h92.88zm-46.44-340a53.79 53.79 0 1153.79-53.79 53.79 53.79 0 01-53.79 53.79zM447.9 448h-92.68V302.4c0-34.7-.7-79.3-48.3-79.3-48.3 0-55.7 37.7-55.7 76.7V448h-92.7V148.9h89v40.8h1.3c12.4-23.6 42.6-48.3 87.7-48.3 93.8 0 111.1 61.8 111.1 142.3z"
                                  fill="#fff"
                                />
                              </svg>
                            ) : (
                              <img src={platform.icon} alt={platform.name} className="w-6 h-6" />
                            )}
                            <div className="text-left">
                              <p className="text-sm font-medium" style={{ color: '#6A6A6A' }}>
                                {platform.name}
                              </p>
                              <p className="text-[11px]" style={{ color: '#B0B0B0' }}>
                                {platform.description}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSocialToggle(platform.key as keyof typeof socialConnections)}
                            className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                            style={{ backgroundColor: socialConnections[platform.key as keyof typeof socialConnections] ? '#64B5F6' : '#E4E4E4' }}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                socialConnections[platform.key as keyof typeof socialConnections] ? 'translate-x-5' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
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
            <div className="px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between text-xs" style={{ color: '#BABABA' }}>
                <div className="flex items-center space-x-1.5">
                  <img 
                    src={lilLogo} 
                    alt="lil" 
                    className="w-5 h-5"
                  />
                  <span>©</span>
                  <span className="text-[11px]">All rights reserved</span>
                </div>
                <div className="flex items-center space-x-3 text-[11px]">
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
    </>
  );
};

export default ProfileSettings;

