import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoFull from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';
import lilLogo from '../../assets/images/pre/lil.png';
import verifyIcon from '../../assets/images/pre/verify.png';
import verityIcon from '../../assets/images/pre/verity.svg';
import leftIcon from '../../assets/images/pre/left.png';
import backArrowIcon from '../../assets/images/pre/back arrow.svg';

const PasswordResetSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fromProfileSettings = location.state?.fromProfileSettings || false;
  const [countdown, setCountdown] = useState(15);
  const [isMobile, setIsMobile] = useState(false);

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
      navigate('/settings', { 
        state: { selectedSidebarOption: 'security' },
        replace: false
      });
    }
  }, [fromProfileSettings, countdown, navigate]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isMobileFromProfile = isMobile && fromProfileSettings;

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
          {/* Breadcrumbs - Only show when accessed from Profile Settings (desktop only) */}
          {fromProfileSettings && !isMobile && (
            <div className="mb-0 -mt-4 w-full max-w-2xl" style={{ marginLeft: '-16px' }}>
              <nav className="flex items-center flex-nowrap space-x-2" style={{ fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>
                <img 
                  src={leftIcon} 
                  alt="Back" 
                  className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0" 
                  style={{ width: '14px', height: '14px' }}
                  onClick={() => navigate('/settings', { state: { selectedSidebarOption: 'security' } })}
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
                  onClick={() => navigate('/', { state: { openMenu: true } })}
                >
                  Menu
                </span>
                <span className="flex-shrink-0" style={{ color: '#BABABA', fontSize: '17px', lineHeight: 1 }}>·</span>
                <span 
                  className="hover:opacity-80 transition-opacity cursor-pointer whitespace-nowrap flex-shrink-0" 
                  style={{ color: '#BABABA' }}
                  onClick={() => navigate('/', { state: { openMenu: true, highlightSettings: true } })}
                >
                  Settings
                </span>
                <span className="flex-shrink-0" style={{ color: '#BABABA', fontSize: '17px', lineHeight: 1 }}>·</span>
                <span 
                  className="hover:opacity-80 transition-opacity cursor-pointer whitespace-nowrap flex-shrink-0" 
                  style={{ color: '#BABABA' }}
                  onClick={() => navigate('/settings', { state: { selectedSidebarOption: 'security' } })}
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
          {isMobileFromProfile && (
            <div className="lg:hidden fixed top-4 left-4 right-4 z-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/settings', { state: { selectedSidebarOption: 'security' } })}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
                style={{ boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}
                aria-label="Back to security"
              >
                <img src={backArrowIcon} alt="Back" className="w-4 h-4" />
              </button>
              <div className="w-10" />
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
                style={{ boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}
                aria-label="More options"
              >
                <svg width="16" height="4" viewBox="0 0 24 4" fill="none">
                  <circle cx="4" cy="2" r="2" fill="#171717" />
                  <circle cx="12" cy="2" r="2" fill="#171717" />
                  <circle cx="20" cy="2" r="2" fill="#171717" />
                </svg>
              </button>
            </div>
          )}

          {/* Main content with border and shadow */}
          <div className={`bg-white rounded-[30px] p-8 lg:p-10 mt-0 lg:mt-16 ${isMobileFromProfile ? '' : 'shadow-lg'}`} style={isMobileFromProfile ? {} : { boxShadow: '0 4px 30px 0 rgba(0,0,0,0.05)' }}>
            <div className="text-center mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {/* Success Checkmark Icon */}
              <div className="mx-auto w-16 h-16 flex items-center justify-center mb-5">
                {isMobileFromProfile ? (
                  <img src={verityIcon} alt="Success" className="w-full h-full object-contain" />
                ) : (
                  <img src={verifyIcon} alt="Success" className="w-full h-full object-contain" />
                )}
              </div>
              
              <h1 className="text-lg font-semibold mb-2" style={{ color: '#212121', fontFamily: isMobileFromProfile ? 'Bricolage Grotesque, sans-serif' : 'Poppins, sans-serif' }}>
                Password reset successfully
              </h1>
              <p className="text-xs px-4 mb-8" style={{ color: '#6A6A6A' }}>
                Your password has been reset, you can now log in with the new password.
              </p>

              {/* Back Button - Different text based on source */}
              {fromProfileSettings ? (
                <button
                  onClick={() => navigate('/settings', { state: { selectedSidebarOption: 'security' } })}
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
