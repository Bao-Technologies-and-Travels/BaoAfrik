import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoSmall from '../../assets/images/logos/ba-brand-icon-colored.png';
import logoFull from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import lilLogo from '../../assets/images/pre/lil.png';

const EmailVerificationSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Removed auto-redirect - let user choose to proceed or skip

  const handleContinue = () => {
    navigate('/profile-setup');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Desktop Header - Top Left with Background */}
      <div className="hidden lg:block absolute top-0 left-0 right-0 bg-orange-50 py-4 px-8 border-b-2 border-orange-200">
        <div className="flex items-center justify-between">
          <Link to="/">
            <img 
              src={logoFull} 
              alt="BaoAfrik Logo" 
              className="h-8 object-contain"
            />
          </Link>
          <button className="p-2 rounded-lg hover:bg-orange-100 transition-colors">
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-8 lg:pt-16">
        <div className="w-full max-w-md text-center">
          {/* Mobile Logo - Centered with Background */}
          <div className="lg:hidden bg-white -mx-4 px-4 py-6 mb-6 sm:mb-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 mb-6 sm:mb-8">
                <img 
                  src={logoSmall} 
                  alt="BaoAfrik Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Success Message */}
        <h2 className="text-display text-xl sm:text-2xl text-gray-900 mb-3 sm:mb-4">
          Email Verified Successfully!
        </h2>
        <p className="text-body text-gray-500 text-sm mb-6 sm:mb-8 px-2">
          Your email has been verified. You can now complete your profile setup to get started.
        </p>

        {/* Continue Button */}
         <button
           onClick={handleContinue}
           disabled={isLoading}
           className={`w-full disabled:cursor-not-allowed font-semibold py-2.5 sm:py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 mb-4 sm:mb-6 text-sm sm:text-base ${
             !isLoading
               ? 'text-white'
               : 'bg-gray-200 text-gray-400'
           }`}
           style={!isLoading ? { backgroundColor: '#F9A825' } : {}}
         >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="md" color="white" className="mr-2" />
              <span className="text-sm sm:text-base">Loading...</span>
            </div>
          ) : (
            <span className="text-sm sm:text-base">Continue to Profile Setup</span>
          )}
        </button>

          {/* Skip Link */}
          <Link to="/login" className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm">
            Skip for now and sign in
          </Link>
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

export default EmailVerificationSuccess;
