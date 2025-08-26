import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoSmall from '../../assets/images/logos/ba-brand-icon-colored.png';

interface SocialLoginErrorProps {}

const SocialLoginError: React.FC<SocialLoginErrorProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get provider from navigation state
  const provider = location.state?.provider || 'social media';

  const handleCreateAccount = () => {
    navigate('/register');
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* BaoAfrik Logo */}
      <div className="w-12 h-12 sm:w-16 sm:h-16 mb-8 sm:mb-12">
        <img 
          src={logoSmall} 
          alt="BaoAfrik Logo" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Error Icon */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 sm:mb-8">
        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Error Message */}
      <div className="text-center mb-6 sm:mb-8 max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
          No Account Found
        </h2>
        <p className="text-gray-600 text-base sm:text-lg mb-2 px-2">
          We couldn't find a BaoAfrik account associated with this {provider} account.
        </p>
        <p className="text-gray-500 text-sm px-2">
          Would you like to create a new account or try a different login method?
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 sm:space-y-4 w-full max-w-sm">
        <button
          onClick={handleCreateAccount}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-xl transition-colors duration-200 text-sm sm:text-base"
        >
          Create New Account
        </button>
        
        <button
          onClick={handleBackToLogin}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 sm:py-3 px-6 rounded-xl transition-colors duration-200 text-sm sm:text-base"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default SocialLoginError;
