import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';
import logoIcon from '../../assets/images/logos/ba-brand-icon-colored.png';
import avatar from '../../assets/images/logos/avatar.png';

interface HeaderProps {
  showSearchBar?: boolean;
  isProductDetailPage?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showSearchBar = false, isProductDetailPage = false }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

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

  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 relative ${isProductDetailPage ? 'lg:block hidden' : ''}`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Positioned further left */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded transition-all duration-200"
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
          <div className="hidden md:flex items-center space-x-6 ml-auto">
            {user ? (
              // Logged in user buttons
              <>
                <Link 
                  to="/register" 
                  className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-600 rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2" 
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  Become a seller
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full hover:ring-2 hover:ring-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
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
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 font-medium focus:outline-none focus:text-orange-600 focus:underline transition-colors duration-200"
                >
                  Logout
                </button>
                
                {/* Desktop Burger Menu */}
                <div className="relative">
                  <button
                    onClick={toggleDesktopMenu}
                    className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200"
                    aria-label="Open user menu"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  
                  {/* Desktop Dropdown Menu */}
                  {isDesktopMenuOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-4 z-50 max-h-[80vh] overflow-y-auto">
                      {/* Become a seller button */}
                      <div className="px-4 pb-4">
                      <Link 
                           to="/register" 
                           className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-600 rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2" 
                        onClick={() => setIsDesktopMenuOpen(false)}
                      >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                          Become a seller
                        </Link>
                      </div>

                      {/* Profile Section */}
                      <div className="flex items-center space-x-3 px-4 py-4 border-b border-gray-100">
                            <img 
                              src={user?.profileImage || avatar} 
                          alt="User avatar" 
                          className="w-16 h-16 rounded-full object-cover"
                          width="64"
                          height="64"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">My profile</p>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-bold text-gray-900">{user?.name || 'Jean Kameni'}</h3>
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Create a new listing button */}
                      <div className="px-4 py-4">
                        <Link 
                          to="/create-listing" 
                          className="block w-full bg-blue-50 text-blue-600 px-4 py-3 rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2" 
                          onClick={() => setIsDesktopMenuOpen(false)}
                        >
                          <div className="flex items-center justify-between">
                            <span>Create a new listing</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                        </Link>
                      </div>

                      {/* Navigation Menu Items */}
                      <div className="space-y-1 px-2">
                        {/* Chats */}
                        <Link 
                          to="/messages" 
                          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                          onClick={() => setIsDesktopMenuOpen(false)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                          </div>
                          <div>
                              <div className="font-medium text-gray-900">Chats</div>
                              <div className="text-sm text-gray-500">Check your discussions in your inbox</div>
                            </div>
                          </div>
                           <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                             <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                             </svg>
                        </div>
                      </Link>

                      {/* Notifications */}
                      <Link 
                        to="/notifications" 
                          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setIsDesktopMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.07 2.82l3.12 3.12M7.05 5.84L10.17 8.96M3.98 8.91l3.12 3.12M1 12.03l3.12 3.12M3.98 15.15l3.12 3.12M7.05 18.2l3.12 3.12M10.07 21.22l3.12 3.12" />
                            </svg>
                          </div>
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
                          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setIsDesktopMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
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

                        {/* Become a seller */}
                      <Link 
                          to="/register" 
                          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setIsDesktopMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </div>
                          <div>
                              <div className="font-medium text-gray-900">Become a seller</div>
                              <div className="text-sm text-gray-500">Publish and manage your articles better</div>
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
                          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setIsDesktopMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Bookmarks</div>
                              <div className="text-sm text-gray-500">Find your saved posts here</div>
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
                          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                          onClick={() => setIsDesktopMenuOpen(false)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                              </svg>
                            </div>
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

                        {/* Settings */}
                        <Link 
                          to="/settings" 
                          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                          onClick={() => setIsDesktopMenuOpen(false)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">Settings</div>
                              <div className="text-sm text-gray-500">Set your account preferences</div>
                          </div>
                        </div>
                           <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                             <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                             </svg>
                        </div>
                      </Link>
                      </div>

                      {/* Logout Button */}
                      <div className="px-4 pt-4 border-t border-gray-100">
                        <button 
                          onClick={() => {
                            handleLogout();
                            setIsDesktopMenuOpen(false);
                          }}
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
                          <p className="text-xs text-gray-500 mt-1">Log out of BAO Afrik</p>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Not logged in buttons (includes visitor mode)
              <>
                <Link 
                  to="/register" 
                   className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-600 rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2" 
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  Become a seller
                </Link>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-gray-900 font-medium focus:outline-none focus:text-orange-600 focus:underline transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                   className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-600 rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Become a seller button - always visible on mobile */}
            <Link 
              to="/register" 
               className="inline-flex items-center px-3 py-2 bg-orange-100 text-orange-600 rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2" 
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              Become a seller
            </Link>
            
            {/* Burger Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown - Full Screen Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col">
            {/* Header with Close Button */}
            <div className="flex justify-end items-center p-4 flex-shrink-0">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200"
                aria-label="Close navigation menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Content - Scrollable */}
            <div className="px-6 py-4 flex-1 overflow-y-auto">
              {user ? (
                // Logged in user mobile menu
                <div className="space-y-6">
                  {/* Become a seller button */}
                  <Link 
                    to="/register" 
                    className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-600 rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    Become a seller
                  </Link>

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
                      <p className="text-sm text-gray-500">My profile</p>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-gray-900">{user.name || 'Jean Kameni'}</h3>
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Create a new listing button */}
                  <Link 
                    to="/create-listing" 
                    className="block w-full bg-blue-50 text-blue-600 px-4 py-3 rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
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
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                      <div>
                          <div className="font-medium text-gray-900">Chats</div>
                          <div className="text-sm text-gray-500">Check your discussions in your inbox</div>
                      </div>
                    </div>
                           <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                             <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                           </div>
                  </Link>

                  {/* Notifications */}
                  <Link 
                    to="/notifications" 
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.07 2.82l3.12 3.12M7.05 5.84L10.17 8.96M3.98 8.91l3.12 3.12M1 12.03l3.12 3.12M3.98 15.15l3.12 3.12M7.05 18.2l3.12 3.12M10.07 21.22l3.12 3.12" />
                        </svg>
                      </div>
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
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
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

                    {/* Become a seller */}
                  <Link 
                    to="/register" 
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </div>
                      <div>
                          <div className="font-medium text-gray-900">Become a seller</div>
                          <div className="text-sm text-gray-500">Publish and manage your articles better</div>
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
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Bookmarks</div>
                          <div className="text-sm text-gray-500">Find your saved posts here</div>
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
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                        </svg>
                      </div>
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

                    {/* Settings */}
                    <Link 
                      to="/settings" 
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Settings</div>
                          <div className="text-sm text-gray-500">Set your account preferences</div>
                        </div>
                      </div>
                           <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                             <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                             </svg>
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
                      <p className="text-xs text-gray-500 mt-1">Log out of BAO Afrik</p>
                  </button>
                  </div>
                </div>
              ) : (
                // Not logged in mobile menu - Visitor
                <div className="space-y-8 mt-12">
                  <Link 
                    to="/login" 
                    className="block w-full text-center px-6 py-4 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-orange-50 focus:text-orange-700 transition-colors font-medium text-lg border border-gray-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                     className="block w-full text-center px-6 py-4 rounded-lg bg-orange-100 text-orange-600 font-medium text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
