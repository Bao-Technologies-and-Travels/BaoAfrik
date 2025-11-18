import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/pre/logo.png';
import sideIcon from '../assets/images/pre/side.png';
import lilLogo from '../assets/images/pre/lil.png';
import avatarIcon from '../assets/images/pre/avatar.png';
import basketIcon from '../assets/images/pre/basket.png';
import leftIcon from '../assets/images/pre/left.png';
import notificationIcon from '../assets/images/pre/notification.svg';
import settingIcon from '../assets/images/pre/setting.svg';
import translationToggleIcon from '../assets/images/pre/tt.svg';
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

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeolocationEnabled, setIsGeolocationEnabled] = useState(false);
  const [biography, setBiography] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedSidebarOption, setSelectedSidebarOption] = useState<'profile' | 'security' | 'language' | 'notifications'>('profile');

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
                      borderRight: isActive ? '1px solid #64B5F6' : '1px solid transparent',
                      marginRight: isActive ? '-1px' : '0'
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
                      className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <span>{selectedLanguage}</span>
                      <img src={translationToggleIcon} alt="Toggle" className="w-4 h-4" />
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
                  <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <img src={notificationIcon} alt="Notifications" className="w-6 h-6" />
                  </button>

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
          <div className="flex-1 bg-white border border-gray-200 rounded-2xl mx-8 mt-8 mb-0 flex" style={{ minHeight: 'calc(100vh - 140px)' }}>
            <div className="flex-1 p-8 space-y-6">
              {/* Section Header */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Profile Setting</h1>
                <p className="text-sm" style={{ color: '#BABABA' }}>
                  Update your profile and control what others see on BAO' Afrik.
                </p>
              </div>
              </div>

              {/* Sub-navigation Tabs */}
              <div className="flex items-center space-x-6 mb-8 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`flex items-center space-x-2 pb-3 relative ${
                    activeTab === 'personal' ? 'border-b-2' : ''
                  }`}
                  style={{
                    borderBottomColor: activeTab === 'personal' ? '#64B5F6' : 'transparent'
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: activeTab === 'personal' ? '#64B5F6' : '#6A6A6A' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-medium" style={{ color: activeTab === 'personal' ? '#64B5F6' : '#6A6A6A' }}>
                    Personal Information
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('verification')}
                  className={`flex items-center space-x-2 pb-3 relative ${
                    activeTab === 'verification' ? 'border-b-2' : ''
                  }`}
                  style={{
                    borderBottomColor: activeTab === 'verification' ? '#64B5F6' : 'transparent'
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: activeTab === 'verification' ? '#64B5F6' : '#6A6A6A' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium" style={{ color: activeTab === 'verification' ? '#64B5F6' : '#6A6A6A' }}>
                    Verification
                  </span>
                </button>
              </div>

              {/* Personal Information Tab Content */}
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    {/* Upload Photo Section */}
                    <div>
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-48 h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center" style={{ borderColor: '#E1E1E1' }}>
                        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#BABABA' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <button 
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{ backgroundColor: '#F0F8FE', color: '#64B5F6' }}
                      >
                        Upload a photo
                      </button>
                      <p className="text-xs" style={{ color: '#BABABA' }}>
                        At least 800 x 800 px recommended. JPG or PNG allowed.
                      </p>
                    </div>
                  </div>
                  </div>

                  {/* Profile Setting Details */}
                  <div className="border rounded-3xl p-6 bg-white shadow-sm" style={{ borderColor: '#E1E1E1' }}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Profile Setting</h3>
                      <button
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 border rounded-lg transition-colors hover:bg-gray-50"
                        style={{ borderColor: '#D9D9D9' }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#6A6A6A' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="text-xs" style={{ color: '#6A6A6A' }}>Edit</span>
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs mb-1 block" style={{ color: '#BABABA' }}>Full name</label>
                        <p className="text-sm font-semibold text-gray-900">Jean Kameni</p>
                      </div>
                      <div>
                        <label className="text-xs mb-1 block" style={{ color: '#BABABA' }}>Gender</label>
                        <p className="text-sm text-gray-900">Male</p>
                      </div>
                      <div>
                        <label className="text-xs mb-1 block" style={{ color: '#BABABA' }}>Birthday</label>
                        <p className="text-sm text-gray-900">13/09/2000</p>
                      </div>
                    </div>
                  </div>

                  {/* Location Section */}
                  <div className="border rounded-3xl p-6 bg-white shadow-sm" style={{ borderColor: '#E1E1E1' }}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-900">Geolocation</span>
                      <button
                        onClick={() => setIsGeolocationEnabled(!isGeolocationEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isGeolocationEnabled ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isGeolocationEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value="London, United Kingdom"
                        readOnly
                        className="w-full px-4 py-3 pl-10 rounded-lg text-sm focus:outline-none"
                        style={{ backgroundColor: '#F1F1F1', color: '#212121' }}
                      />
                      <svg 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
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
                  <div className="border rounded-3xl p-6 bg-white shadow-sm" style={{ borderColor: '#E1E1E1' }}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Biography</h3>
                    <div className="relative">
                      <textarea
                        value={biography}
                        onChange={(e) => {
                          if (e.target.value.length <= 500) {
                            setBiography(e.target.value);
                          }
                        }}
                        placeholder="Can you tell us more about yourself?"
                        className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none resize-none"
                        style={{ 
                          backgroundColor: '#F1F1F1', 
                          color: '#212121',
                          minHeight: '120px'
                        }}
                        maxLength={500}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs" style={{ color: '#64B5F6' }}>
                          {biography.length}/500
                        </span>
                        <button
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
                <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <p className="text-gray-500">Verification content will be implemented here</p>
                </div>
              )}
            </div>

            {/* Right Panel - Profile Completion */}
            <div className="w-80 bg-white border-l border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Complete your profile</h3>
              
              {/* Progress Indicator */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#E8F5E9' }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#4CAF50' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">20%</span>
              </div>

              {/* Checklist */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#4CAF50' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-900">Setup account 10%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#4CAF50' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-900">Personnal information 10%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#BABABA' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm text-gray-500">Upload your photo 10%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#BABABA' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm text-gray-500">Location 10%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#BABABA' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm text-gray-500">Description 10%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#BABABA' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm text-gray-500">Verification first step 25%</span>
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

