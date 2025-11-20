import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoFull from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';
import lilLogo from '../../assets/images/pre/lil.png';
import verifyIcon from '../../assets/images/pre/verify.png';
import leftIcon from '../../assets/images/pre/left.png';

const PasswordResetSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fromProfileSettings = location.state?.fromProfileSettings || false;
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    if (!fromProfileSettings) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Auto-redirect to security tab when countdown expires
      // Use window.location to ensure proper navigation
      navigate('/profile-settings', { 
        state: { selectedSidebarOption: 'security' },
        replace: false
      });
    }
  }, [fromProfileSettings, countdown, navigate]);

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

          {/* Main content with border and shadow */}
          <div className="bg-white rounded-[30px] shadow-lg p-8 lg:p-10 mt-0 lg:mt-16" style={{ boxShadow: '0 4px 30px 0 rgba(0,0,0,0.05)' }}>
            <div className="text-center mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {/* Success Checkmark Icon */}
              <div className="mx-auto w-16 h-16 flex items-center justify-center mb-5">
                <img src={verifyIcon} alt="Success" className="w-full h-full object-contain" />
              </div>
              
              <h1 className="text-lg font-semibold mb-2" style={{ color: '#212121' }}>
                Password reset successfully
              </h1>
              <p className="text-xs px-4 mb-8" style={{ color: '#6A6A6A' }}>
                Your password has been reset, you can now log in with the new password.
              </p>

              {/* Back Button - Different text based on source */}
              {fromProfileSettings ? (
                <button
                  onClick={() => navigate('/profile-settings', { state: { selectedSidebarOption: 'security' } })}
                  className="inline-flex items-center justify-center w-full max-w-xs mx-auto px-6 py-2.5 text-sm font-light rounded-[10px] transition-colors duration-200"
                  style={{ backgroundColor: '#F9A825', color: '#FFFFFF' }}
                >
                  Back to setting page ({countdown}s)
                </button>
              ) : (
                <Link 
                  to="/" 
                  className="inline-flex items-center justify-center w-full max-w-xs mx-auto px-6 py-2.5 text-sm font-normal rounded-[10px] transition-colors duration-200"
                  style={{ backgroundColor: '#F9A825', color: '#FFFFFF' }}
                >
                  Back to home page
                </Link>
              )}
            </div>
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
    </div>
  );
};

export default PasswordResetSuccess;
