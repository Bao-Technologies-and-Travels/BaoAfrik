import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';
import logoIcon from '../../assets/images/logos/ba-brand-icon-colored.png';
import logoPre from '../../assets/images/pre/logo.png';
import avatar from '../../assets/images/logos/avatar.png';
import messageIcon from '../../assets/images/pre/message.svg';
import boxIcon from '../../assets/images/pre/box.svg';
import groupIcon from '../../assets/images/pre/group.svg';
import frameIcon from '../../assets/images/pre/frame.svg';
import podsIcon from '../../assets/images/pre/pods.svg';
import settingIcon from '../../assets/images/pre/setting.svg';
import basketIcon from '../../assets/images/pre/basket.png';
import notificationIcon from '../../assets/images/pre/notification.svg';
import arrowDownIcon from '../../assets/images/pre/arrow-down.svg';

interface HeaderProps {
  showSearchBar?: boolean;
  isProductDetailPage?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showSearchBar = false, isProductDetailPage = false }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [highlightChats, setHighlightChats] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
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
      const languageSelector = target.closest('.language-selector');
      const desktopMenuDropdown = target.closest('.desktop-menu-dropdown');
      const mobileMenuOverlay = target.closest('.mobile-menu-overlay');

      if (!languageSelector && isLanguageDropdownOpen) {
        setIsLanguageDropdownOpen(false);
      }

      if (!desktopMenuDropdown && isDesktopMenuOpen) {
        setIsDesktopMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageDropdownOpen, isDesktopMenuOpen]);

  const isHomePage = location.pathname === '/';

  return (
    <>
      {/* Overlay for Home page when menu is open */}
      {isHomePage && isDesktopMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          style={{ backgroundColor: '#0000001A' }}
        />
      )}
      
      <header className={`shadow-sm relative ${isProductDetailPage ? 'lg:block hidden' : ''} ${!user ? 'border-b border-orange-100' : ''}`} style={{backgroundColor: user ? '#FFFFFF' : '#FFFBF5', fontFamily: 'Poppins, sans-serif'}}>
      <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-3">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Positioned further left */}
          <div className="flex-shrink-0 ml-0 sm:-ml-6 md:-ml-12">
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
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                {/* Category Dropdown */}
                <select className="px-3 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-sm">
                  <option value="">All Categories</option>
                  <option value="Food & Spices">Food & Spices</option>
                  <option value="Fashion & Textiles">Fashion & Textiles</option>
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
                  style={{backgroundColor: '#F9A825'}}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                    style={{ borderColor: '#E4E4E4', color: '#BABABA' }}
                  >
                    {selectedLanguage}
                    <img src={arrowDownIcon} alt="Arrow" className="ml-1 w-4 h-4" />
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
                
                <Link 
                  to="/register" 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                  style={{backgroundColor: '#FEF6E9'}}
                >
                  <img src={basketIcon} alt="Basket" className="w-5 h-5" style={{filter: 'brightness(0) saturate(100%) invert(59%) sepia(94%) saturate(423%) hue-rotate(359deg) brightness(98%) contrast(98%)'}} />
                  <span className="text-sm font-normal" style={{color: '#F9A825'}}>Start selling</span>
                </Link>
                
                {/* Notification Icon */}
                <Link 
                  to="/notifications" 
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 relative"
                  title="Notifications"
                  aria-label="View notifications"
                >
                  <img 
                    src={notificationIcon} 
                    alt="Notifications" 
                    className="w-6 h-6"
                    style={{ filter: 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(92%)' }}
                  />
                </Link>
                
                <Link 
                  to="/profile" 
                  className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full hover:ring-1 hover:ring-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                  title="Profile"
                  aria-label="Go to profile page"
                >
                  <img 
                    src={user.profileImage || avatar} 
                    alt="User profile picture" 
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
                    style={{ color: '#171717' }}
                    aria-label="Open user menu"
                  >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  
                  {/* Desktop Dropdown Menu */}
                  {isDesktopMenuOpen && (
          <div className="fixed right-8 top-0 w-64 bg-white rounded-2xl shadow-lg border border-gray-200 py-3 z-50 max-h-screen overflow-y-auto custom-scrollbar desktop-menu-dropdown" style={{ scrollbarWidth: 'thin', scrollbarColor: 'white #f3f4f6' }}>
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
                        onClick={() => setIsDesktopMenuOpen(false)}
                      >
                            <svg className="w-3 h-3 mr-1.5 border border-orange-500 rounded-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#F9A822'}}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                            Start selling
                        </Link>
                          <button
                            onClick={() => setIsDesktopMenuOpen(false)}
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
                              src={user?.profileImage || avatar} 
                          alt="User avatar" 
                          className="w-12 h-12 rounded-full object-cover"
                          width="48"
                          height="48"
                        />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">My profile</p>
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-900">{user?.name || 'Jean Kameni'}</h3>
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
                          onClick={() => setIsDesktopMenuOpen(false)}
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
                          className={`flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg ${highlightChats ? 'bg-gray-50' : ''}`}
                          onClick={() => setIsDesktopMenuOpen(false)}
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
                        onClick={() => setIsDesktopMenuOpen(false)}
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
                        onClick={() => setIsDesktopMenuOpen(false)}
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
                        onClick={() => setIsDesktopMenuOpen(false)}
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
                          onClick={() => setIsDesktopMenuOpen(false)}
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
                          onClick={() => setIsDesktopMenuOpen(false)}
                        >
                          <div className="flex items-center space-x-2">
                            <img src={settingIcon} alt="Setting" className="w-4 h-4" style={{color: '#64B5F6'}} />
                            <div>
                              <div className="font-medium text-sm" style={{color: '#6A6A6A'}}>Settings</div>
                              <div className="text-xs text-gray-500">Set your account preferences</div>
                          </div>
                        </div>
                      </Link>
                      </div>

                      {/* Logout Button */}
                      <div className="px-3 pt-3 border-t border-gray-100">
                        <button 
                          onClick={() => {
                            handleLogout();
                            setIsDesktopMenuOpen(false);
                          }}
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
                    style={{ borderColor: '#E4E4E4', color: '#BABABA' }}
                  >
                    {selectedLanguage}
                    <img src={arrowDownIcon} alt="Arrow" className="ml-1 w-4 h-4" />
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
                
                 <Link 
                   to="/login" 
                   className="inline-flex items-center px-8 py-2 text-white rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                   style={{backgroundColor: '#F9A822'}}
                   onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'}
                   onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A822'}
                 >
                   Sign In
                 </Link>
                <Link 
                  to="/register" 
                    className="inline-flex items-center px-8 py-2 rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border"
                    style={{borderColor: '#F9A822', color: '#F9A822'}}
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

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
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
                   style={{backgroundColor: '#FEF6E9'}}
                >
                  <img src={basketIcon} alt="Basket" className="w-5 h-5" style={{filter: 'brightness(0) saturate(100%) invert(59%) sepia(94%) saturate(423%) hue-rotate(359deg) brightness(98%) contrast(98%)'}} />
                  <span className="text-sm font-normal" style={{color: '#F9A825'}}>Start selling</span>
            </Link>
            
            {/* Notification Icon */}
            <Link
              to="/notifications"
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
            </Link>
            
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
                           className={`w-full flex items-center px-4 py-2 text-sm transition-colors duration-200 ${
                             selectedLanguage === 'EN' 
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
                           className={`w-full flex items-center px-4 py-2 text-sm transition-colors duration-200 ${
                             selectedLanguage === 'FR' 
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
                  className="h-8 w-auto"
                />
              </div>
              
              {/* Translation Toggle and Close Button */}
              <div className="flex items-center space-x-2">
                {/* Translation Toggle */}
                <div className="relative">
                  <button
                    onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                    className="flex items-center space-x-1 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-2 border-gray-300 rounded-md transition-colors duration-200"
                    aria-label="Select language"
                  >
                    <span className="text-xs font-medium">{selectedLanguage}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
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
                // Logged in user mobile menu
                <div className="space-y-6">

                  {/* Profile Section */}
                  <div className="flex items-center space-x-3 py-4">
                      <img 
                        src={user.profileImage || avatar} 
                        alt="User avatar" 
                      className="w-16 h-16 rounded-full object-cover"
                      width="64"
                      height="64"
                    />
                    <div className="flex-1">
                      <p className="text-sm" style={{color: '#64B5F6'}}>My profile</p>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">{user.name || 'Jean Kameni'}</h3>
                        <div className="w-8 h-8 rounded flex items-center justify-center" style={{backgroundColor: '#E3F2FD'}}>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#64B5F6'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Create a new listing button */}
                  <Link 
                    to="/create-listing" 
                    className="block w-full bg-blue-50 text-blue-600 px-4 py-3 rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>Create a new listing</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  </Link>

                  {/* Navigation Menu Items */}
                  <div className="space-y-1">
                    {/* Chats */}
                    <Link 
                      to="/messages" 
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <img src={messageIcon} alt="Message" className="w-5 h-5" style={{color: '#64B5F6'}} />
                      <div>
                          <div className="font-medium" style={{color: '#6A6A6A'}}>Chats</div>
                          <div className="text-sm text-gray-500">Check your discussions in your inbox</div>
                      </div>
                    </div>
                           <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                             <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                           </div>
                  </Link>

                  {/* My listings */}
                  <Link 
                    to="/my-listings" 
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <img src={boxIcon} alt="Box" className="w-5 h-5" style={{color: '#64B5F6'}} />
                      <div>
                        <div className="font-medium text-gray-900">My listings</div>
                          <div className="text-sm text-gray-500">Manage your published listings</div>
                        </div>
                      </div>
                           <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                             <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                  </Link>

                    {/* My requests */}
                  <Link 
                      to="/my-requests" 
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                        <img src={groupIcon} alt="Group" className="w-5 h-5" style={{color: '#64B5F6'}} />
                      <div>
                        <div className="font-medium text-gray-900">My requests</div>
                          <div className="text-sm text-gray-500">View and manage your requests</div>
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
                      <img src={frameIcon} alt="Frame" className="w-5 h-5" style={{color: '#64B5F6'}} />
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

                    {/* Help Center */}
                    <Link 
                      to="/help" 
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                        <img src={podsIcon} alt="Pods" className="w-5 h-5" style={{color: '#64B5F6'}} />
                      <div>
                          <div className="font-medium text-gray-900">Help Center</div>
                          <div className="text-sm text-gray-500">Need to talk ? We're listening</div>
                        </div>
                           </div>
                    </Link>

                    {/* Settings */}
                    <Link 
                      to="/settings" 
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <img src={settingIcon} alt="Setting" className="w-5 h-5" style={{color: '#64B5F6'}} />
                        <div>
                               <div className="font-medium" style={{color: '#6A6A6A'}}>Settings</div>
                          <div className="text-sm text-gray-500">Set your account preferences</div>
                        </div>
                           </div>
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-6">
                    <button 
                      onClick={handleLogout}
                      className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Log Out</span>
                      </div>
                    </div>
                      <p className="text-xs text-gray-500 text-left ml-8">Log out of BAO Afrik</p>
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
                       style={{backgroundColor: '#F9A822'}}
                       onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'}
                       onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A822'}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                       Sign In
                  </Link>
                  <Link 
                    to="/register" 
                        className="block w-full text-center px-8 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors font-medium text-lg border"
                        style={{borderColor: '#F9A822', color: '#F9A822'}}
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
                         <img src={boxIcon} alt="Box" className="w-5 h-5" style={{color: '#64B5F6'}} />
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
                         <img src={groupIcon} alt="Group" className="w-5 h-5" style={{color: '#64B5F6'}} />
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
                         <img src={frameIcon} alt="Frame" className="w-5 h-5" style={{color: '#64B5F6'}} />
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
                         <img src={boxIcon} alt="Box" className="w-5 h-5" style={{color: '#64B5F6'}} />
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
                         <img src={podsIcon} alt="Pods" className="w-5 h-5" style={{color: '#64B5F6'}} />
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
