import React from 'react';
import { Link } from 'react-router-dom';
import logoSmall from '../../assets/images/logos/ba-brand-icon-colored.png';
import logoFull from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';

const PasswordResetSuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Desktop Logo - Top Left with Background */}
      <div className="hidden lg:block absolute top-0 left-0 right-0 bg-orange-50 py-4 px-8">
        <img 
          src={logoFull} 
          alt="BaoAfrik Logo" 
          className="h-8 object-contain"
        />
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo - Centered with Background */}
          <div className="lg:hidden bg-white -mx-4 px-4 py-6 mb-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 mb-6">
                <img 
                  src={logoSmall} 
                  alt="BaoAfrik Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="text-center mb-8 mt-16 lg:mt-0">
            {/* Success Checkmark Icon */}
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-medium text-gray-900 mb-3">
              Password reset successfully
            </h1>
            <p className="text-gray-500 text-sm px-4 mb-8">
              Your password has been reset, you can now log in with the new password.
            </p>

            {/* Back to Sign In Page Button */}
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center w-full max-w-xs mx-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Back to sign in page
            </Link>
          </div>
        </div>
      </div>

      {/* Footer - Hidden on mobile */}
      <div className="hidden lg:block py-6 px-4 text-center">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>All rights reserved</span>
          </div>
          <span>•</span>
          <Link to="/contact" className="hover:text-gray-600">Contact us</Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-gray-600">Terms and conditions of use</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-gray-600">Privacy policies</Link>
          <span>•</span>
          <Link to="/cookies" className="hover:text-gray-600">Cookies</Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;
