import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';

const Header: React.FC = () => {
  const { user, isVisitor, logout } = useAuth();

  const handleLogout = () => {
    logout();
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

          {/* Navigation - Different based on user state */}
          <nav className="hidden md:flex items-center space-x-8">
            {user ? (
              // Logged in user navigation
              <>
                <Link to="/listings" className="text-gray-600 hover:text-gray-900 font-medium">
                  Browse
                </Link>
                <Link to="/create-listing" className="text-gray-600 hover:text-gray-900 font-medium">
                  Sell
                </Link>
                <Link to="/messages" className="text-gray-600 hover:text-gray-900 font-medium">
                  Messages
                </Link>
              </>
            ) : !isVisitor ? (
              // Not authenticated navigation (default)
              <>
                <Link to="/listings" className="text-gray-600 hover:text-gray-900 font-medium">
                  Browse
                </Link>
                <Link to="/create-listing" className="text-gray-600 hover:text-gray-900 font-medium">
                  Sell
                </Link>
                <Link to="/messages" className="text-gray-600 hover:text-gray-900 font-medium">
                  Messages
                </Link>
              </>
            ) : null}
          </nav>

          {/* Auth Buttons - Positioned further right */}
          <div className="flex items-center space-x-6 ml-auto">
            {user ? (
              // Logged in user buttons
              <>
                <Link to="/profile" className="text-gray-600 hover:text-gray-900 font-medium">
                  Profile
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
                {isVisitor && (
                  <Link to="/register" className="text-orange-600 hover:text-orange-700 font-medium">
                    Become a seller
                  </Link>
                )}
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
