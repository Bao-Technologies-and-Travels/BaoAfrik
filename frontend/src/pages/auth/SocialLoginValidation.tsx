import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logoSmall from '../../assets/images/logos/ba-brand-icon-colored.png';
import logoFull from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';

interface SocialLoginValidationProps {}

const SocialLoginValidation: React.FC<SocialLoginValidationProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Get provider and login type from navigation state
  const provider = location.state?.provider || 'social media';
  const isLogin = location.state?.isLogin || false;

  const handleNext = () => {
    if (isLogin) {
      // For login flow - get user data and login directly
      const socialUserData = JSON.parse(localStorage.getItem('tempSocialUser') || '{}');
      
      // Login the user with social data
      if (socialUserData.id) {
        login(socialUserData);
      }
      
      // Clean up temporary storage
      localStorage.removeItem('tempSocialUser');
      
      // Redirect to home
      navigate('/');
    } else {
      // For registration flow - continue to profile setup
      navigate('/profile-setup', { 
        state: { 
          fromSocialLogin: true,
          provider: provider 
        } 
      });
    }
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
        <div className="text-center">
          {/* Mobile Logo - Centered */}
          <div className="lg:hidden w-12 h-12 sm:w-16 sm:h-16 mb-8 sm:mb-12 mx-auto">
            <img 
              src={logoSmall} 
              alt="BaoAfrik Logo" 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Success Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 sm:mb-8 mx-auto">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Success Message */}
          <div className="text-center mb-6 sm:mb-8 max-w-md">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Authentication Successful!
            </h2>
            <p className="text-gray-600 text-base sm:text-lg px-2">
              You have successfully authenticated with {provider}.
            </p>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl transition-colors duration-200 text-sm sm:text-base"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialLoginValidation;
