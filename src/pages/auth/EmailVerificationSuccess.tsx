import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoSmall from '../../assets/images/logos/ba-brand-icon-colored.png';
import logoFull from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';

const EmailVerificationSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Removed auto-redirect - let user choose to proceed or skip

  const handleContinue = () => {
    navigate('/profile-setup');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 sm:px-6 lg:px-8">
      {/* Desktop Logo - Top Left */}
      <div className="hidden lg:block absolute top-6 left-8">
        <img 
          src={logoFull} 
          alt="BaoAfrik Logo" 
          className="h-8 object-contain"
        />
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md text-center">
          {/* Mobile Logo - Centered */}
          <div className="lg:hidden mx-auto w-12 h-12 sm:w-16 sm:h-16 mb-6 sm:mb-8">
            <img 
              src={logoSmall} 
              alt="BaoAfrik Logo" 
              className="w-full h-full object-contain"
            />
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
          className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 mb-4 sm:mb-6 text-sm sm:text-base"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
              <span className="text-sm sm:text-base">Loading...</span>
            </div>
          ) : (
            'Continue to Profile Setup'
          )}
        </button>

          {/* Skip Link */}
          <Link to="/login" className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm">
            Skip for now and sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationSuccess;
