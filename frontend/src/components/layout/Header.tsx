import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/images/logos/ba-Primary-brand-logo-colored.png";
import logoIcon from "../../assets/images/logos/ba-brand-icon-colored.png";
import logoPre from "../../assets/images/pre/logo.png";
import avatar from "../../assets/images/logos/avatar.png";
import messageIcon from "../../assets/images/pre/message.svg";
import boxIcon from "../../assets/images/pre/box.svg";
import groupIcon from "../../assets/images/pre/group.svg";
import frameIcon from "../../assets/images/pre/frame.svg";
import podsIcon from "../../assets/images/pre/pods.svg";
import settingIcon from "../../assets/images/pre/setting.svg";
import basketIcon from "../../assets/images/pre/basket.png";
import notificationIcon from "../../assets/images/pre/notification.svg";
import arrowDownIcon from "../../assets/images/pre/arrow-down.svg";
import messageAvatarIcon from '../../assets/images/pre/main.png';
import appNotificationIcon from '../../assets/images/pre/nof.svg';

interface HeaderProps {
  showSearchBar?: boolean;
  isProductDetailPage?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  showSearchBar = false,
  isProductDetailPage = false,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  const [highlightChats, setHighlightChats] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState<'all' | 'unread' | 'messages'>('all');

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

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDesktopMenu = () => {
    setIsDesktopMenuOpen(!isDesktopMenuOpen);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setIsLanguageDropdownOpen(false);
  };

  // Listen for navigation from Messages page to open menu and highlight Chats
  useEffect(() => {
    const state = location.state as any;
    if (state?.openMenu && state?.highlightChats) {
      setIsDesktopMenuOpen(true);
      setHighlightChats(true);

      // Clear the highlight after 2 seconds
      setTimeout(() => {
        setHighlightChats(false);
      }, 2000);
    }
  }, [location]);

  // Handle clicks outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const languageSelector = target.closest(".language-selector");
      const desktopMenuDropdown = target.closest(".desktop-menu-dropdown");
      const mobileMenuOverlay = target.closest(".mobile-menu-overlay");
      const notificationDropdown = target.closest('.notification-dropdown');

      if (!languageSelector && isLanguageDropdownOpen) {
        setIsLanguageDropdownOpen(false);
      }

      if (!desktopMenuDropdown && isDesktopMenuOpen) {
        setIsDesktopMenuOpen(false);
      }

      if (!notificationDropdown && isNotificationOpen) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLanguageDropdownOpen, isDesktopMenuOpen, isNotificationOpen]);

  const isHomePage = location.pathname === "/";

  const handleProfileSetup = () => {
    navigate("/profile-setup");
  }

  return (
    <>
      {/* Overlay for Home page when menu is open */}
      {isHomePage && isDesktopMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: "#0000001A" }}
        />
      )}

      <header className={`shadow-sm relative ${isProductDetailPage ? 'lg:block hidden' : ''} ${!user ? 'border-b border-orange-100' : ''}`} style={{ backgroundColor: user ? '#FFFFFF' : '#FFFBF5', fontFamily: 'Poppins, sans-serif' }}>
        <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-3">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Positioned further left */}
            <div className="flex-shrink-0 -ml-6 sm:-ml-12">
              <Link
                to="/"
                className="flex items-center focus:outline-none rounded transition-all duration-200"
                aria-label="BaoAfrik Home"
              >
                {/* Desktop: Full logo, Mobile: Icon only */}
                <img
                  src={logo}
                  alt="BaoAfrik - African Marketplace Logo"
                  className="hidden sm:block h-8 w-auto object-contain"
                  width="120"
                  height="32"
                />
                <img
                  src={logoIcon}
                  alt="BaoAfrik Logo"
                  className="sm:hidden h-10 w-10 object-contain"
                  width="40"
                  height="40"
                />
              </Link>
            </div>

            {/* Center Search Bar - Only show on product detail page */}
            {showSearchBar && (
              <div className="flex-1 max-w-2xl mx-6">
                <div className="flex items-center gap-2">
                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search for products..."
                      className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Category Dropdown */}
                  <select className="px-3 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-sm">
                    <option value="">All Categories</option>
                    <option value="Food & Spices">Food & Spices</option>
                    <option value="Fashion & Textiles">
                      Fashion & Textiles
                    </option>
                    <option value="Beauty & Wellness">Beauty & Wellness</option>
                    <option value="Home & Decor">Home & Decor</option>
                    <option value="Books & Media">Books & Media</option>
                  </select>

                  {/* Place of Origin Input */}
                  <input
                    type="text"
                    placeholder="Place of origin"
                    className="px-3 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm w-32"
                  />

                  {/* Location Input */}
                  <input
                    type="text"
                    placeholder="Location"
                    className="px-3 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm w-24"
                  />

                  {/* Search Button */}
                  <button
                    className="text-white px-4 py-2 rounded-full font-medium text-sm transition-colors duration-200"
                    style={{ backgroundColor: "#F9A825" }}
                    onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.backgroundColor =
                      "#E6941F")
                    }
                    onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.backgroundColor =
                      "#F9A825")
                    }
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 ml-auto -mr-6 sm:-mr-12">
              {user ? (
                // Logged in user buttons
                <>
                  {/* Language Toggle */}
                  <div className="relative">
                    <button
                      onClick={toggleLanguageDropdown}
                      className="flex items-center px-2.5 py-1 border rounded-lg bg-white text-sm font-normal hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                      style={{ borderColor: "#E4E4E4", color: "#BABABA" }}
                    >
                      {selectedLanguage}
                      <img
                        src={arrowDownIcon}
                        alt="Arrow"
                        className="ml-1 w-4 h-4"
                      />
                    </button>

                    {/* Language Dropdown */}
                    {isLanguageDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-3 z-50">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
                          <h3 className="text-sm font-medium text-gray-700">
                            Language :
                          </h3>
                          <button
                            onClick={() => setIsLanguageDropdownOpen(false)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Language Options */}
                        <div className="py-2">
                          <button
                            onClick={() => handleLanguageChange("EN")}
                            className="w-full flex items-center px-4 py-2 text-sm transition-colors duration-200"
                            style={{
                              backgroundColor:
                                selectedLanguage === "EN"
                                  ? "#F0F8FE"
                                  : "transparent",
                              color:
                                selectedLanguage === "EN"
                                  ? "#64B5F6"
                                  : "#374151",
                            }}
                          >
                            English
                          </button>
                          <button
                            onClick={() => handleLanguageChange("FR")}
                            className="w-full flex items-center px-4 py-2 text-sm transition-colors duration-200"
                            style={{
                              backgroundColor:
                                selectedLanguage === "FR"
                                  ? "#F0F8FE"
                                  : "transparent",
                              color:
                                selectedLanguage === "FR"
                                  ? "#64B5F6"
                                  : "#374151",
                            }}
                          >
                            French
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/register"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                    style={{ backgroundColor: "#FEF6E9" }}
                  >
                    <img
                      src={basketIcon}
                      alt="Basket"
                      className="w-5 h-5"
                      style={{
                        filter:
                          "brightness(0) saturate(100%) invert(59%) sepia(94%) saturate(423%) hue-rotate(359deg) brightness(98%) contrast(98%)",
                      }}
                    />
                    <span
                      className="text-sm font-normal"
                      style={{ color: "#F9A825" }}
                    >
                      Start selling
                    </span>
                  </Link>

                  {/* Notification Icon */}
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
                        <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF0000' }}>
                          <span className="text-white text-xs font-medium">{unreadCount}</span>
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
                                                <circle cx="6" cy="12" r="1.5" />
                                                <circle cx="12" cy="12" r="1.5" />
                                                <circle cx="18" cy="12" r="1.5" />
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

                        {/* Footer */}
                        <div className="px-6 pt-5 pb-3 flex items-center justify-between">
                          <button onClick={markAllAsRead} className="text-xs hover:opacity-70 transition-opacity" style={{ color: '#939393' }}>
                            Mark all as read
                          </button>
                          <button
                            onClick={() => {
                              navigate('/notifications');
                              setIsNotificationOpen(false);
                            }}
                            className="text-xs flex items-center space-x-1 hover:opacity-70 transition-opacity"
                            style={{ color: '#64B5F6' }}
                          >
                            <span>See all notifications</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/account"
                    className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full hover:ring-1 hover:ring-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    title="Profile"
                    aria-label="Go to profile page"
                  >
                    <img
                      src={user.profileImage || avatar}
                      alt="User Icon"
                      className="w-8 h-8 rounded-full object-cover"
                      width="32"
                      height="32"
                    />
                  </Link>

                  {/* Desktop Burger Menu */}
                  <div className="relative desktop-menu-dropdown">
                    <button
                      onClick={toggleDesktopMenu}
                      className="p-3 rounded-md hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                      style={{ color: "#171717" }}
                      aria-label="Open user menu"
                    >
                      <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </button>

                    {/* Desktop Dropdown Menu */}
                    {isDesktopMenuOpen && (
                      <div
                        className="fixed right-8 top-0 w-64 bg-white rounded-2xl shadow-lg border border-gray-200 py-3 z-50 max-h-screen overflow-y-auto custom-scrollbar desktop-menu-dropdown"
                        style={{
                          scrollbarWidth: "thin",
                          scrollbarColor: "white #f3f4f6",
                        }}
                      >
                        {/* Start selling button with exit */}
                        <div className="px-3 pb-3 flex items-center justify-between">
                          <Link
                            to="/register"
                            className="inline-flex items-center px-3 py-1.5 rounded-lg font-normal text-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                            style={{
                              backgroundColor: "#FFF8F0",
                              color: "#F9A822",
                            }}
                            onMouseEnter={(e) => {
                              (e.target as HTMLElement).style.backgroundColor =
                                "#FFF0E6";
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.backgroundColor =
                                "#FFF8F0";
                            }}
                            onClick={() => setIsDesktopMenuOpen(false)}
                          >
                            <svg
                              className="w-3 h-3 mr-1.5 border border-orange-500 rounded-full p-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              style={{ color: "#F9A822" }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                              />
                            </svg>
                            Start selling
                          </Link>
                          <button
                            onClick={() => setIsDesktopMenuOpen(false)}
                            className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Profile Section */}
                        <div className="flex items-center justify-around">
                          <div className="flex justify-center items-center gap-2">
                            <img
                              src={user?.profileImage || avatar}
                              alt="User avatar"
                              className="w-12 h-12 rounded-full object-cover"
                              width="48"
                              height="48"
                            />
                            <div className="flex-col">
                              <p className="text-xs text-gray-500">My profile</p>
                              <h3 className="text-sm font-bold text-gray-900">
                                {user?.firstName && user?.lastName
                                  ? `${user.firstName} ${user.lastName}`
                                  : user?.firstName
                                    ? user.firstName
                                    : user?.lastName
                                      ? user.lastName
                                      : user?.email
                                        ? user.email.split("@")[0]
                                        : "User"}
                              </h3>
                            </div>
                          </div>
                          <div style={{ position: 'relative', zIndex: 999 }}>
                            <button
                              onClick={() => {
                                handleProfileSetup();
                              }}
                            >
                              <svg
                                className="w-5 h-5 pointer-events-none"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                style={{ color: "#64B5F6" }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Create a new listing button */}
                        <div className="px-3 py-3">
                          <Link
                            to="/create-listing"
                            className="block w-full px-3 py-2 rounded-lg font-medium text-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                            style={{
                              backgroundColor: "#E3F2FD",
                              color: "#64B5F6",
                            }}
                            onClick={() => setIsDesktopMenuOpen(false)}
                          >
                            <div className="flex items-center justify-center space-x-1.5">
                              <span>Create a new listing</span>
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                style={{ color: "#64B5F6" }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </div>
                          </Link>
                        </div>

                        {/* Navigation Menu Items */}
                        <div className="space-y-0.5 px-2">
                          {/* Chats */}
                          <Link
                            to="/messages"
                            className={`flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg ${highlightChats ? "bg-gray-50" : ""
                              }`}
                            onClick={() => setIsDesktopMenuOpen(false)}
                          >
                            <div className="flex items-center space-x-2">
                              <img
                                src={messageIcon}
                                alt="Message"
                                className="w-4 h-4"
                                style={{ color: "#64B5F6" }}
                              />
                              <div>
                                <div
                                  className="font-medium text-sm"
                                  style={{ color: "#6A6A6A" }}
                                >
                                  Chats
                                </div>
                              </div>
                            </div>
                          </Link>

                          {/* My listings */}
                          <Link
                            to="/my-listings"
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                            onClick={() => setIsDesktopMenuOpen(false)}
                          >
                            <div className="flex items-center space-x-2">
                              <img
                                src={boxIcon}
                                alt="Box"
                                className="w-4 h-4"
                                style={{ color: "#64B5F6" }}
                              />
                              <div>
                                <div className="font-medium text-sm" style={{ color: "#6A6A6A" }}>
                                  My listings
                                </div>
                              </div>
                            </div>
                          </Link>

                          {/* My requests */}
                          <Link
                            to="/my-requests"
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                            onClick={() => setIsDesktopMenuOpen(false)}
                          >
                            <div className="flex items-center space-x-2">
                              <img
                                src={groupIcon}
                                alt="Group"
                                className="w-4 h-4"
                                style={{ color: "#64B5F6" }}
                              />
                              <div>
                                <div
                                  className="font-medium text-sm"
                                  style={{ color: "#6A6A6A" }}
                                >
                                  My requests
                                </div>
                              </div>
                            </div>
                          </Link>

                          {/* Bookmarks */}
                          <Link
                            to="/bookmarks"
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                            onClick={() => setIsDesktopMenuOpen(false)}
                          >
                            <div className="flex items-center space-x-2">
                              <img
                                src={frameIcon}
                                alt="Frame"
                                className="w-4 h-4"
                                style={{ color: "#64B5F6" }}
                              />
                              <div>
                                <div
                                  className="font-medium text-sm"
                                  style={{ color: "#6A6A6A" }}
                                >
                                  Bookmarks
                                </div>
                              </div>
                            </div>
                          </Link>

                          {/* Help Center */}
                          <Link
                            to="/help"
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                            onClick={() => setIsDesktopMenuOpen(false)}
                          >
                            <div className="flex items-center space-x-2">
                              <img
                                src={podsIcon}
                                alt="Pods"
                                className="w-4 h-4"
                                style={{ color: "#64B5F6" }}
                              />
                              <div>
                                <div
                                  className="font-medium text-sm"
                                  style={{ color: "#6A6A6A" }}
                                >
                                  Help Center
                                </div>
                              </div>
                            </div>
                          </Link>

                          {/* Settings */}
                          <Link
                            to="/settings"
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                            onClick={() => setIsDesktopMenuOpen(false)}
                          >
                            <div className="flex items-center space-x-2">
                              <img
                                src={settingIcon}
                                alt="Setting"
                                className="w-4 h-4"
                                style={{ color: "#64B5F6" }}
                              />
                              <div>
                                <div
                                  className="font-medium text-sm"
                                  style={{ color: "#6A6A6A" }}
                                >
                                  Settings
                                </div>
                                <div className="text-xs text-gray-500">
                                  Set your account preferences
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>

                        {/* Logout Button */}
                        <Link to="/login">
                          <div className="px-3 pt-3 border-t border-gray-100">
                            <button
                              onClick={() => {
                                handleLogout();
                                setIsDesktopMenuOpen(false);
                              }}
                              className="w-full bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#6A6A6A' }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <div className="text-left">
                                  <div className="font-medium text-xs" style={{ color: '#6A6A6A' }}>Log Out</div>
                                  <div className="text-xs" style={{ color: '#6A6A6A' }}>Log out of BAO Afrik</div>
                                </div>
                              </div>
                            </button>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // Not logged in buttons (includes visitor mode)
                <>
                  {/* Language Toggle */}
                  <div className="relative">
                    <button
                      onClick={toggleLanguageDropdown}
                      className="flex items-center px-2.5 py-1 border rounded-lg bg-white text-sm font-normal hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                      style={{ borderColor: "#E4E4E4", color: "#BABABA" }}
                    >
                      {selectedLanguage}
                      <img
                        src={arrowDownIcon}
                        alt="Arrow"
                        className="ml-1 w-4 h-4"
                      />
                    </button>

                    {/* Language Dropdown */}
                    {isLanguageDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-3 z-50">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
                          <h3 className="text-sm font-medium text-gray-700">
                            Language :
                          </h3>
                          <button
                            onClick={() => setIsLanguageDropdownOpen(false)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Language Options */}
                        <div className="py-2">
                          <button
                            onClick={() => handleLanguageChange("EN")}
                            className="w-full flex items-center px-4 py-2 text-sm transition-colors duration-200"
                            style={{
                              backgroundColor:
                                selectedLanguage === "EN"
                                  ? "#F0F8FE"
                                  : "transparent",
                              color:
                                selectedLanguage === "EN"
                                  ? "#64B5F6"
                                  : "#374151",
                            }}
                          >
                            English
                          </button>
                          <button
                            onClick={() => handleLanguageChange("FR")}
                            className="w-full flex items-center px-4 py-2 text-sm transition-colors duration-200"
                            style={{
                              backgroundColor:
                                selectedLanguage === "FR"
                                  ? "#F0F8FE"
                                  : "transparent",
                              color:
                                selectedLanguage === "FR"
                                  ? "#64B5F6"
                                  : "#374151",
                            }}
                          >
                            French
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-2 text-white rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ backgroundColor: "#F9A822" }}
                    onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.backgroundColor =
                      "#E6941F")
                    }
                    onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.backgroundColor =
                      "#F9A822")
                    }
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-2 rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border"
                    style={{ borderColor: "#F9A822", color: "#F9A822" }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.backgroundColor =
                        "#FFF8F0";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.backgroundColor =
                        "transparent";
                    }}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-4">
              {user ? (
                // Logged in user mobile navigation
                <>
                  {/* Language Toggle for mobile */}
                  <div className="relative mr-1">
                    <button
                      onClick={toggleLanguageDropdown}
                      className="flex items-center px-2.5 py-1 border rounded-lg bg-white text-sm font-normal hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                      style={{ borderColor: '#E4E4E4', color: '#BABABA' }}
                    >
                      {selectedLanguage}
                      <img src={arrowDownIcon} alt="Arrow" className="ml-1 w-4 h-4" />
                    </button>

                    {/* Language Dropdown for mobile */}
                    {isLanguageDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-3 z-50">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
                          <h3 className="text-sm font-medium text-gray-700">Language :</h3>
                          <button
                            onClick={() => setIsLanguageDropdownOpen(false)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Language Options */}
                        <div className="py-2">
                          <button
                            onClick={() => handleLanguageChange('EN')}
                            className="w-full flex items-center px-4 py-2 text-sm transition-colors duration-200"
                            style={{
                              backgroundColor: selectedLanguage === 'EN' ? '#F0F8FE' : 'transparent',
                              color: selectedLanguage === 'EN' ? '#64B5F6' : '#374151'
                            }}
                          >
                            English
                          </button>
                          <button
                            onClick={() => handleLanguageChange('FR')}
                            className="w-full flex items-center px-4 py-2 text-sm transition-colors duration-200"
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

                  {/* Become a seller button - only for logged in users */}
                  <Link
                    to="/register"
                    className="flex items-center space-x-1.5 px-2.5 py-2 rounded-lg transition-colors mr-1"
                    style={{ backgroundColor: '#FEF6E9' }}
                  >
                    <img src={basketIcon} alt="Basket" className="w-5 h-5" style={{ filter: 'brightness(0) saturate(100%) invert(59%) sepia(94%) saturate(423%) hue-rotate(359deg) brightness(98%) contrast(98%)' }} />
                    <span className="text-sm font-normal" style={{ color: '#F9A825' }}>Start selling</span>
                  </Link>

                  {/* Notification Icon */}
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none transition-all duration-200 relative"
                    title="Notifications"
                    aria-label="View notifications"
                  >
                    <img
                      src={notificationIcon}
                      alt="Notifications"
                      className="w-5 h-5"
                      style={{ filter: 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(92%)' }}
                    />
                  </button>

                  {/* Burger Menu Button */}
                  <button
                    onClick={toggleMobileMenu}
                    className="p-1.5 rounded-md focus:outline-none transition-all duration-200"
                    style={{ color: '#171717' }}
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMobileMenuOpen}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      {isMobileMenuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>
                </>
              ) : (
                // Logged out user mobile navigation
                <>
                  {/* Language Toggle for mobile */}
                  <div className="relative" style={{ marginRight: window.innerWidth < 640 ? '8px' : '4px' }}>
                    <button
                      onClick={toggleLanguageDropdown}
                      className="flex items-center border rounded-lg bg-white font-normal hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                      style={{
                        borderColor: '#E4E4E4',
                        color: '#BABABA',
                        padding: window.innerWidth < 640 ? '4px 8px' : '6px 10px',
                        fontSize: window.innerWidth < 640 ? '11px' : '14px'
                      }}
                    >
                      {selectedLanguage}
                      <img src={arrowDownIcon} alt="Arrow" className="ml-1" style={{ width: window.innerWidth < 640 ? '12px' : '16px', height: window.innerWidth < 640 ? '12px' : '16px' }} />
                    </button>

                    {/* Language Dropdown for mobile */}
                    {isLanguageDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-3 z-50">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
                          <h3 className="text-sm font-medium text-gray-700">Language :</h3>
                          <button
                            onClick={() => setIsLanguageDropdownOpen(false)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Language Options */}
                        <div className="py-2">
                          <button
                            onClick={() => handleLanguageChange('EN')}
                            className={`w-full flex items-center px-4 py-2 text-sm transition-colors duration-200 ${selectedLanguage === 'EN'
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            <img
                              src="https://flagcdn.com/w20/gb.png"
                              alt="UK flag"
                              className="w-5 h-4 mr-3 object-cover rounded-sm"
                              width="20"
                              height="16"
                            />
                            English
                          </button>
                          <button
                            onClick={() => handleLanguageChange('FR')}
                            className={`w-full flex items-center px-4 py-2 text-sm transition-colors duration-200 ${selectedLanguage === 'FR'
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            French
                          </button>
                          <button
                            onClick={() => handleLanguageChange('DE')}
                            className="w-full flex items-center px-4 py-2 text-sm transition-colors duration-200"
                            style={{
                              backgroundColor: selectedLanguage === 'DE' ? '#F0F8FE' : 'transparent',
                              color: selectedLanguage === 'DE' ? '#64B5F6' : '#374151'
                            }}
                          >
                            <img
                              src="https://flagcdn.com/w20/de.png"
                              alt="Germany flag"
                              className="w-5 h-4 mr-3 object-cover rounded-sm"
                              width="20"
                              height="16"
                            />
                            Germany
                          </button>
                          <button
                            onClick={() => handleLanguageChange('ES')}
                            className="w-full flex items-center px-4 py-2 text-sm transition-colors duration-200"
                            style={{
                              backgroundColor: selectedLanguage === 'ES' ? '#F0F8FE' : 'transparent',
                              color: selectedLanguage === 'ES' ? '#64B5F6' : '#374151'
                            }}
                          >
                            <img
                              src="https://flagcdn.com/w20/es.png"
                              alt="Spain flag"
                              className="w-5 h-4 mr-3 object-cover rounded-sm"
                              width="20"
                              height="16"
                            />
                            Spanish
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sign In Button - Mobile */}
                  <Link
                    to="/login"
                    className="inline-flex items-center text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none"
                    style={{
                      backgroundColor: '#F9A822',
                      padding: window.innerWidth < 640 ? '4px 12px' : '8px 32px',
                      fontSize: window.innerWidth < 640 ? '11px' : '14px',
                      marginRight: window.innerWidth < 640 ? '8px' : '4px'
                    }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A822'}
                  >
                    Sign In
                  </Link>

                  {/* Sign Up Button - Mobile */}
                  <Link
                    to="/register"
                    className="inline-flex items-center rounded-lg font-medium transition-colors duration-200 focus:outline-none border"
                    style={{
                      borderColor: '#F9A822',
                      color: '#F9A822',
                      padding: window.innerWidth < 640 ? '4px 12px' : '8px 32px',
                      fontSize: window.innerWidth < 640 ? '11px' : '14px'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = '#FFF8F0';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Dropdown - Full Screen Overlay */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col">
              {/* Header with Logo, Translation Toggle, and Close Button */}
              <div className="flex justify-between items-center p-4 flex-shrink-0">
                {/* Logo */}
                <div className="flex items-center">
                  <img
                    src={logoPre}
                    alt="bao'Afrik"
                    className="h-6 w-auto"
                  />
                </div>

                {/* Translation Toggle and Close Button */}
                <div className="flex items-center space-x-2">
                  {/* Translation Toggle */}
                  <div className="relative">
                    <button
                      onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                      className="flex items-center border rounded-lg bg-white font-normal hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                      style={{
                        borderColor: '#E4E4E4',
                        color: '#BABABA',
                        padding: '4px 8px',
                        fontSize: '11px'
                      }}
                      aria-label="Select language"
                    >
                      {selectedLanguage}
                      <img src={arrowDownIcon} alt="Arrow" className="ml-1" style={{ width: '12px', height: '12px' }} />
                    </button>

                    {/* Language Dropdown */}
                    {isLanguageDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-3 z-50">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
                          <h3 className="text-sm font-medium text-gray-700">Language :</h3>
                          <button
                            onClick={() => setIsLanguageDropdownOpen(false)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Language Options */}
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setSelectedLanguage('EN');
                              setIsLanguageDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center"
                          >
                            <img src="https://flagcdn.com/w20/gb.png" alt="UK flag" className="w-5 h-4 object-cover rounded-sm mr-3" />
                            English
                          </button>
                          <button
                            onClick={() => {
                              setSelectedLanguage('FR');
                              setIsLanguageDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center"
                          >
                            <img src="https://flagcdn.com/w20/fr.png" alt="France flag" className="w-5 h-4 object-cover rounded-sm mr-3" />
                            France
                          </button>
                          <button
                            onClick={() => {
                              setSelectedLanguage('DE');
                              setIsLanguageDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center"
                          >
                            <img src="https://flagcdn.com/w20/de.png" alt="Germany flag" className="w-5 h-4 object-cover rounded-sm mr-3" />
                            Germany
                          </button>
                          <button
                            onClick={() => {
                              setSelectedLanguage('ES');
                              setIsLanguageDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center"
                          >
                            <img src="https://flagcdn.com/w20/es.png" alt="Spain flag" className="w-5 h-4 object-cover rounded-sm mr-3" />
                            Spanish
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-all duration-200"
                    aria-label="Close navigation menu"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Menu Content - Scrollable */}
              <div className="px-6 py-4 flex-1 overflow-y-auto">
                {user ? (
                  // Logged in user mobile menu - Matches Desktop
                  <div className="space-y-4">
                    {/* Start selling button */}
                    <div className="pb-2">
                      <Link
                        to="/register"
                        className="inline-flex items-center px-3 py-2 rounded-lg font-normal text-sm transition-colors duration-200 focus:outline-none"
                        style={{ backgroundColor: '#FFF8F0', color: '#F9A822' }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-1.5 border border-orange-500 rounded-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#F9A822' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                        Start selling
                      </Link>
                    </div>

                    {/* Profile Section */}
                    <div className="flex items-center space-x-3 py-3 border-b border-gray-100">
                      <img
                        src={user?.profileImage || avatar}
                        alt="User avatar"
                        className="w-12 h-12 rounded-full object-cover"
                        width="48"
                        height="48"
                      />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">My profile</p>
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-gray-900">{user?.firstName && user?.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user?.firstName
                              ? user.firstName
                              : user?.lastName
                                ? user.lastName
                                : user?.email
                                  ? user.email.split("@")[0]
                                  : "User"}</h3>
                          <Link to='/profile-setup'>
                            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: '#E3F2FD' }}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#64B5F6' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Create a new listing button */}
                    <div className="py-3">
                      <Link
                        to="/create-listing"
                        className="block w-full px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none"
                        style={{ backgroundColor: '#E3F2FD', color: '#64B5F6' }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center justify-center space-x-1.5">
                          <span>Create a new listing</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#64B5F6' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                      </Link>
                    </div>

                    {/* Navigation Menu Items */}
                    <div className="space-y-0.5">
                      {/* Chats */}
                      <Link
                        to="/messages"
                        className={`flex items-center justify-between px-3 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg ${highlightChats ? 'bg-gray-50' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={messageIcon} alt="Message" className="w-5 h-5" style={{ color: '#64B5F6' }} />
                          <div>
                            <div className="font-medium text-sm" style={{ color: '#6A6A6A' }}>Chats</div>
                          </div>
                        </div>
                      </Link>

                      {/* My listings */}
                      <Link
                        to="/my-listings"
                        className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={boxIcon} alt="Box" className="w-5 h-5" style={{ color: '#64B5F6' }} />
                          <div>
                            <div className="font-medium text-sm" style={{ color: '#6A6A6A' }}>My listings</div>
                          </div>
                        </div>
                      </Link>

                      {/* My requests */}
                      <Link
                        to="/my-requests"
                        className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={groupIcon} alt="Group" className="w-5 h-5" style={{ color: '#64B5F6' }} />
                          <div>
                            <div className="font-medium text-sm" style={{ color: '#6A6A6A' }}>My requests</div>
                          </div>
                        </div>
                      </Link>

                      {/* Bookmarks */}
                      <Link
                        to="/bookmarks"
                        className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={frameIcon} alt="Frame" className="w-5 h-5" style={{ color: '#64B5F6' }} />
                          <div>
                            <div className="font-medium text-sm" style={{ color: '#6A6A6A' }}>Bookmarks</div>
                          </div>
                        </div>
                      </Link>

                      {/* Help Center */}
                      <Link
                        to="/help"
                        className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={podsIcon} alt="Pods" className="w-5 h-5" style={{ color: '#64B5F6' }} />
                          <div>
                            <div className="font-medium text-sm" style={{ color: '#6A6A6A' }}>Help Center</div>
                          </div>
                        </div>
                      </Link>

                      {/* Settings */}
                      <Link
                        to="/settings"
                        className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={settingIcon} alt="Setting" className="w-5 h-5" style={{ color: '#64B5F6' }} />
                          <div>
                            <div className="font-medium text-sm" style={{ color: '#6A6A6A' }}>Settings</div>
                            <div className="text-xs text-gray-500">Set your account preferences</div>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-3 border-t border-gray-100">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200 focus:outline-none"
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#6A6A6A' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <div className="text-left">
                            <div className="font-medium text-xs" style={{ color: '#6A6A6A' }}>Log Out</div>
                            <div className="text-xs" style={{ color: '#6A6A6A' }}>Log out of BAO Afrik</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Not logged in mobile menu - Visitor
                  <div className="space-y-6">
                    {/* Profile Section */}
                    <div className="flex items-center space-x-3 py-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">My profile</p>
                        <h3 className="text-lg font-bold text-gray-900">Me</h3>
                      </div>
                    </div>

                    {/* Sign In and Sign Up Buttons */}
                    <div className="space-y-4">
                      <Link
                        to="/login"
                        className="block w-full text-center px-8 py-4 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors font-medium text-lg"
                        style={{ backgroundColor: '#F9A822' }}
                        onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'}
                        onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A822'}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="block w-full text-center px-8 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors font-medium text-lg border"
                        style={{ borderColor: '#F9A822', color: '#F9A822' }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = '#FFF8F0';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = 'transparent';
                        }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1">
                      {/* Notifications */}
                      <Link
                        to="/notifications"
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <img src={boxIcon} alt="Box" className="w-5 h-5" style={{ color: '#64B5F6' }} />
                          <div>
                            <div className="font-medium text-gray-900">Notifications</div>
                            <div className="text-sm text-gray-500">Don't miss anything about your activities</div>
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>

                      {/* Request & Bring */}
                      <Link
                        to="/request-bring"
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <img src={groupIcon} alt="Group" className="w-5 h-5" style={{ color: '#64B5F6' }} />
                          <div>
                            <div className="font-medium text-gray-900">Request & Bring</div>
                            <div className="text-sm text-gray-500">Lorem ipsum dolor sit amet consectetur.</div>
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>

                      {/* Bookmarks */}
                      <Link
                        to="/bookmarks"
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <img src={frameIcon} alt="Frame" className="w-5 h-5" style={{ color: '#64B5F6' }} />
                          <div>
                            <div className="font-medium text-gray-900">Bookmarks</div>
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>

                      {/* Become a seller */}
                      <Link
                        to="/register"
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <img src={boxIcon} alt="Box" className="w-5 h-5" style={{ color: '#64B5F6' }} />
                          <div>
                            <div className="font-medium text-gray-900">Start selling</div>
                            <div className="text-sm text-gray-500">Publish and manage your articles better</div>
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>

                      {/* Help Center */}
                      <Link
                        to="/help"
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <img src={podsIcon} alt="Pods" className="w-5 h-5" style={{ color: '#64B5F6' }} />
                          <div>
                            <div className="font-medium text-gray-900">Help Center</div>
                            <div className="text-sm text-gray-500">Need to talk ? We're listening</div>
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
