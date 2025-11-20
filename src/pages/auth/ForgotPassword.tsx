import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoFull from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';
import lilLogo from '../../assets/images/pre/lil.png';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import profileIcon from '../../assets/images/pre/profile.svg';
import leftIcon from '../../assets/images/pre/left.png';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromProfileSettings = location.state?.fromProfileSettings || false;
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [emailNotFound, setEmailNotFound] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkEmailExists = (email: string): boolean => {
    // Check if email exists in registered users (localStorage mock)
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    return registeredUsers.some((user: any) => user.email.toLowerCase() === email.toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validate email
    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    setErrors({});
    setEmailNotFound(false);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if email exists in our mock database
      const emailExists = checkEmailExists(email);
      
      if (!emailExists) {
        // Email not found in system
        setEmailNotFound(true);
        setErrors({ email: 'No account found with this email address' });
        return;
      }
      
      // Email exists, proceed to reset verification
      console.log('Forgot password request for:', email);
      
      // Navigate to password reset verification page
      navigate('/reset-password-sent', { 
        state: { 
          email: email,
          fromProfileSettings: fromProfileSettings
        } 
      });
    } catch (error) {
      console.error('Forgot password failed:', error);
      setErrors({ general: 'Failed to send reset email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Desktop Logo - Top Left with Background */}
      <div className="hidden lg:block absolute top-0 left-0 right-0 py-4 px-8 border-b" style={{ backgroundColor: '#FEF6E9', borderColor: '#FCD79B' }}>
        <div className="flex items-center justify-between">
          <Link to="/">
            <img 
              src={logoFull} 
              alt="BaoAfrik Logo" 
              className="h-8 object-contain cursor-pointer"
            />
          </Link>
          <button className="p-2 rounded-lg transition-colors" style={{ color: '#F9A825' }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-4 lg:pt-16">
        <div className="w-full max-w-md">
          {/* Breadcrumbs - Only show when accessed from Profile Settings */}
          {fromProfileSettings && (
            <div className="mb-0 -mt-4 w-full max-w-2xl" style={{ marginLeft: '-16px' }}>
              <nav className="flex items-center flex-nowrap space-x-2" style={{ fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>
                <img 
                  src={leftIcon} 
                  alt="Back" 
                  className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0" 
                  style={{ width: '14px', height: '14px' }}
                  onClick={() => navigate('/profile-settings', { state: { selectedSidebarOption: 'security' } })}
                />
                <Link 
                  to="/" 
                  className="hover:opacity-80 transition-opacity whitespace-nowrap flex-shrink-0" 
                  style={{ color: '#BABABA' }}
                >
                  Homepage
                </Link>
                <span className="flex-shrink-0" style={{ color: '#BABABA', fontSize: '17px', lineHeight: 1 }}>·</span>
                <span 
                  className="hover:opacity-80 transition-opacity cursor-pointer whitespace-nowrap flex-shrink-0" 
                  style={{ color: '#BABABA' }}
                  onClick={() => navigate('/')}
                >
                  Menu
                </span>
                <span className="flex-shrink-0" style={{ color: '#BABABA', fontSize: '17px', lineHeight: 1 }}>·</span>
                <span 
                  className="hover:opacity-80 transition-opacity cursor-pointer whitespace-nowrap flex-shrink-0" 
                  style={{ color: '#BABABA' }}
                  onClick={() => navigate('/profile-settings', { state: { selectedSidebarOption: 'security' } })}
                >
                  Settings
                </span>
                <span className="flex-shrink-0" style={{ color: '#BABABA', fontSize: '17px', lineHeight: 1 }}>·</span>
                <span 
                  className="hover:opacity-80 transition-opacity cursor-pointer whitespace-nowrap flex-shrink-0" 
                  style={{ color: '#BABABA' }}
                  onClick={() => navigate('/profile-settings', { state: { selectedSidebarOption: 'security' } })}
                >
                  Security & Privacy
                </span>
                <span className="flex-shrink-0" style={{ color: '#BABABA', fontSize: '17px', lineHeight: 1 }}>·</span>
                <span className="font-medium whitespace-nowrap flex-shrink-0" style={{ color: '#212121' }}>
                  Reset Password
                </span>
              </nav>
            </div>
          )}
           {/* Mobile Header - Fixed Position */}
           <div className="lg:hidden fixed top-5 right-5 z-50">
             <div className="flex items-center space-x-2">
               <div className="flex items-center space-x-2 px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-white">
                 <span className="text-sm font-medium text-gray-700">EN</span>
                 <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
               </div>
              <button className="p-2 rounded-lg transition-colors bg-white border border-gray-200" style={{ color: '#F9A825' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                 </svg>
               </button>
             </div>
           </div>

          {/* Main content with border and shadow */}
          <div className="bg-white rounded-[30px] shadow-lg p-8 lg:p-10 mt-0 lg:mt-16" style={{ boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}>
            <div className="text-left lg:text-center mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {/* Profile Mail Icon - Hidden on mobile */}
              <div className="hidden lg:flex mx-auto w-16 h-16 rounded-2xl items-center justify-center mb-6" style={{ backgroundColor: '#F0F8FE' }}>
                <img src={profileIcon} alt="Profile" className="w-8 h-8" style={{ filter: 'brightness(0) saturate(100%) invert(68%) sepia(34%) saturate(641%) hue-rotate(177deg) brightness(98%) contrast(96%)' }} />
              </div>
              
              <h1 className="text-lg font-semibold mb-1.5" style={{ color: '#212121', fontFamily: 'Poppins, sans-serif' }}>
                Profile Mail
              </h1>
              <p className="text-[11px] lg:text-xs px-0 lg:px-4" style={{ color: '#BABABA', fontFamily: 'Poppins, sans-serif' }}>
                Please enter the email address associated with your BAO Afrik profile.
              </p>
            </div>

            {/* Display general error if any */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-[11px] font-medium mb-2" style={{ color: '#212121', fontFamily: 'Poppins, sans-serif' }}>
                  Email address
                </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                onMouseEnter={(e) => (e.target as HTMLInputElement).focus()}
                className={`forgot-password-input w-full px-4 py-3 border rounded-xl text-sm bg-white ${
                  errors.email ? 'border-red-500' : ''
                }`}
                placeholder="Enter your email address"
                required
                disabled={isLoading}
                autoFocus
                style={{
                  borderColor: errors.email ? '#EF4444' : '#E9E9E9',
                  color: '#212121',
                  borderRadius: '10px'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#BABABA';
                  e.currentTarget.style.borderWidth = '0.5px';
                }}
                onBlur={(e) => (e.currentTarget.style.borderColor = errors.email ? '#EF4444' : '#E9E9E9')}
              />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full py-2.5 px-4 rounded-xl transition-all duration-200 text-xs font-medium"
                  style={{
                    backgroundColor: email.trim() && !isLoading ? '#F9A825' : '#E9E9E9',
                    color: email.trim() && !isLoading ? '#FFFFFF' : '#6A6A6A',
                    fontFamily: 'Poppins, sans-serif',
                    borderRadius: '10px',
                    fontWeight: 400
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="md" color="gray" className="mr-2" />
                      Sending...
                    </div>
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </form>

            {/* Email not found message and sign up link */}
            {emailNotFound && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-red-800 font-medium">Account Not Found</p>
                </div>
                <p className="text-red-700 text-sm mb-3">
                  We couldn't find an account associated with this email address.
                </p>
                <p className="text-red-700 text-sm mb-4">
                  Would you like to create a new account instead?
                </p>
                <Link 
                  to="/register" 
                  className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Footer - Hidden on mobile */}
      <div className="hidden lg:block py-6 px-4">
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-xs" style={{ color: '#BABABA' }}>
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

      <style>{`
        .forgot-password-input::placeholder {
          color: #E9E9E9 !important;
          font-size: 12px !important;
          font-family: 'Poppins', sans-serif !important;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
