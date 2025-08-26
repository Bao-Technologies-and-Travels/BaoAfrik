import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';
import avatar from '../../assets/images/logos/avatar.png';

interface HeaderProps {
  showSearchBar?: boolean;
  isProductDetailPage?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showSearchBar = false, isProductDetailPage = false }) => {
  const { user, isVisitor, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
              <img 
                src={logo} 
                alt="BaoAfrik - African Marketplace Logo" 
                className="h-8 w-auto object-contain"
                width="120"
                height="32"
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
                  className="inline-flex items-center px-4 py-2 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2" 
                  style={{backgroundColor: '#F9A825'}} 
                  onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'} 
                  onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}
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
              </>
            ) : (
              // Not logged in buttons (includes visitor mode)
              <>
                <Link 
                  to="/register" 
                  className="inline-flex items-center px-4 py-2 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2" 
                  style={{backgroundColor: '#F9A825'}} 
                  onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'} 
                  onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}
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
                  className="btn-primary focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 transition-all duration-200"
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
              className="inline-flex items-center px-3 py-2 text-white rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2" 
              style={{backgroundColor: '#F9A825'}} 
              onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'} 
              onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}
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
          <div className="md:hidden fixed inset-0 bg-white z-50">
            {/* Header with Logo and Close Button */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <Link 
                to="/" 
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded transition-all duration-200"
                aria-label="BaoAfrik Home"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <img 
                  src={logo} 
                  alt="BaoAfrik - African Marketplace Logo" 
                  className="h-8 w-auto object-contain"
                  width="120"
                  height="32"
                />
              </Link>
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

            {/* Menu Content */}
            <div className="px-6 py-8">
              {user ? (
                // Logged in user mobile menu
                <div className="space-y-4 mt-8">
                  {/* Profile Section with Avatar */}
                  <Link 
                    to="/profile" 
                    className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 focus:outline-none focus:bg-orange-50 transition-colors rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={user.profileImage || avatar} 
                        alt="User profile picture" 
                        className="w-12 h-12 rounded-full object-cover"
                        width="48"
                        height="48"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Your Profile</div>
                        <div className="text-sm text-gray-500">{user.name || 'Jean Kameni'}</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  {/* Notifications */}
                  <Link 
                    to="/notifications" 
                    className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 focus:outline-none focus:bg-orange-50 transition-colors rounded-lg"
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
                        <div className="text-sm text-gray-500">Check your notifications</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
                    </div>
                  </Link>

                  {/* Messages */}
                  <Link 
                    to="/messages" 
                    className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 focus:outline-none focus:bg-orange-50 transition-colors rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Messages</div>
                        <div className="text-sm text-gray-500">Check your messages</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">1</span>
                    </div>
                  </Link>

                  {/* Request & Bring / Become a Seller */}
                  <Link 
                    to="/register" 
                    className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 focus:outline-none focus:bg-orange-50 transition-colors rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Request & Bring</div>
                        <div className="text-sm text-gray-500">Request products from sellers</div>
                      </div>
                    </div>
                  </Link>

                  {/* Become a Seller */}
                  <Link 
                    to="/register" 
                    className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 focus:outline-none focus:bg-orange-50 transition-colors rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Become a Seller</div>
                        <div className="text-sm text-gray-500">Start selling your products</div>
                      </div>
                    </div>
                  </Link>

                  {/* Bookmarks */}
                  <Link 
                    to="/bookmarks" 
                    className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 focus:outline-none focus:bg-orange-50 transition-colors rounded-lg"
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
                        <div className="text-sm text-gray-500">View your saved items</div>
                      </div>
                    </div>
                  </Link>
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
                    className="block w-full text-center px-6 py-4 rounded-lg text-white font-medium text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
                    style={{backgroundColor: '#F9A825'}}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}
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
