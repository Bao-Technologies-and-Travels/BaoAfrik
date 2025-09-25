import React from 'react';
import { Link } from 'react-router-dom';
import logoSmall from '../../assets/images/logos/ba-brand-icon-colored.png';
import logoFull from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';
import lilLogo from '../../assets/images/pre/lil.png';
import verifyIcon from '../../assets/images/pre/verify.png';

const PasswordResetSuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Desktop Logo - Top Left with Background */}
      <div className="hidden lg:block absolute top-0 left-0 right-0 bg-orange-50 py-4 px-8 border-b-2 border-orange-200">
        <div className="flex items-center justify-between">
          <Link to="/">
            <img 
              src={logoFull} 
              alt="BaoAfrik Logo" 
              className="h-8 object-contain cursor-pointer"
            />
          </Link>
          <button className="p-2 rounded-lg hover:bg-orange-100 transition-colors">
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-4 lg:pt-16">
        <div className="w-full max-w-md">

          {/* Main content with border and shadow */}
          <div className="bg-white border-0 lg:border border-gray-200 rounded-lg shadow-none lg:shadow-lg p-8 mt-0 lg:mt-16">
            <div className="text-center mb-8">
              {/* Success Checkmark Icon */}
              <div className="mx-auto w-20 h-20 flex items-center justify-center mb-6">
                <img 
                  src={verifyIcon} 
                  alt="Success" 
                  className="w-full h-full object-contain"
                />
              </div>
              
              <h1 className="text-xl sm:text-2xl font-medium text-gray-900 mb-3">
                Password reset successfully
              </h1>
              <p className="text-gray-500 text-sm px-4 mb-8">
                Your password has been reset, you can now log in with the new password.
              </p>

              {/* Back to Sign In Page Button */}
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center w-full max-w-xs mx-auto px-6 py-3 text-white font-medium rounded-lg transition-colors duration-200"
                style={{ backgroundColor: '#F9A825' }}
              >
                Back to sign in page
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Hidden on mobile */}
      <div className="hidden lg:block py-6 px-4">
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <img src={lilLogo} alt="BaoAfrik" className="w-4 h-4" />
              <span>© All rights reserved</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/contact" className="hover:text-gray-600">Contact Us</Link>
              <span>|</span>
              <Link to="/terms" className="hover:text-gray-600">Terms and conditions of use</Link>
              <span>|</span>
              <Link to="/privacy" className="hover:text-gray-600">Privacy policies</Link>
              <span>|</span>
              <Link to="/cookies" className="hover:text-gray-600">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;
