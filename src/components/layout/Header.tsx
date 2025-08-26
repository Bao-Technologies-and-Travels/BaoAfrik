import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';
import avatar from '../../assets/images/logos/avatar.png';

interface HeaderProps {
  showSearchBar?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showSearchBar = false }) => {
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
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Positioned further left */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src={logo} 
                alt="BaoAfrik" 
                className="h-8 w-auto object-contain"
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
                <Link to="/register" className="inline-flex items-center px-4 py-2 text-white rounded-lg font-medium transition-colors duration-200" style={{backgroundColor: '#F9A825'}} onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'} onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  Become a seller
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full hover:ring-2 hover:ring-blue-300 transition-all duration-200"
                  title="Profile"
                >
                  <img 
                    src={user.profileImage || avatar} 
                    alt="Profile Avatar" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              // Not logged in buttons (includes visitor mode)
              <>
                <Link to="/register" className="inline-flex items-center px-4 py-2 text-white rounded-lg font-medium transition-colors duration-200" style={{backgroundColor: '#F9A825'}} onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'} onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  Become a seller
                </Link>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Become a seller button - always visible on mobile */}
            <Link to="/register" className="inline-flex items-center px-3 py-2 text-white rounded-lg font-medium text-sm transition-colors duration-200" style={{backgroundColor: '#F9A825'}} onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'} onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              Become a seller
            </Link>
            
            {/* Burger Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Toggle menu"
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
        
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              {user ? (
                // Logged in user mobile menu
                <>
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <img 
                      src={user.profileImage || avatar} 
                      alt="Profile Avatar" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // Not logged in mobile menu
                <>
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-3 py-2 rounded-md text-white font-medium transition-colors"
                    style={{backgroundColor: '#F9A825'}}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
