import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import verityIcon from '../../assets/images/pre/verity.svg';
import backArrowIcon from '../../assets/images/pre/back arrow.svg';

const TwoFactorSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromProfileSettings = location.state?.fromProfileSettings || false;
  const phone = location.state?.phone || '';
  const phoneCode = location.state?.phoneCode || { code: '+1', label: 'United States' };
  const [isMobile, setIsMobile] = useState(false);
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!fromProfileSettings) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Auto-redirect to security view when countdown expires
      navigate('/settings', { 
        state: { selectedSidebarOption: 'security', fromTwoFactorSuccess: true },
        replace: false
      });
    }
  }, [fromProfileSettings, countdown, navigate]);

  const maskPhone = (phone: string) => {
    if (!phone) return '******';
    return `${phone.charAt(0)}${'*'.repeat(Math.max(0, phone.length - 1))}`;
  };

  const isMobileFromProfile = isMobile && fromProfileSettings;

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className={`flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 ${isMobileFromProfile ? 'pt-16' : 'pt-4 lg:pt-16'}`}>
        <div className="w-full max-w-md">
          {/* Mobile Header - Fixed Position */}
          {isMobileFromProfile && (
            <div className="lg:hidden fixed top-4 left-4 right-4 z-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/settings', { state: { selectedSidebarOption: 'security', fromTwoFactorSuccess: true } })}
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

          {/* Main content */}
          <div className={`bg-white rounded-[30px] p-8 lg:p-10 mt-0 lg:mt-16 ${isMobileFromProfile ? '' : 'shadow-lg'}`} style={isMobileFromProfile ? {} : { boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}>
            <div className="text-center px-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {/* Icon */}
              <div className="flex justify-center mb-7">
                <img src={verityIcon} alt="Verified" className="w-20 h-20" />
              </div>

              {/* Title */}
              <h2
                className="text-xl mb-4"
                style={{ color: '#212121', fontFamily: isMobileFromProfile ? 'Bricolage Grotesque, sans-serif' : 'Bricolage Grotesque, sans-serif', fontWeight: 500 }}
              >
                Successfully enable
              </h2>

              {/* Description */}
              <p className="text-sm mb-12" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif', fontWeight: 300 }}>
                Your phone number is set to {phoneCode.code} {maskPhone(phone)}<br />
                Authentification code will be sent<br />
                to this number when you logging in
              </p>

              {/* Close Button */}
              {fromProfileSettings ? (
                <button
                  onClick={() => navigate('/settings', { state: { selectedSidebarOption: 'security', fromTwoFactorSuccess: true } })}
                  className={`${isMobileFromProfile ? 'w-full' : 'w-full max-w-xs mx-auto'} py-2.5 rounded-[12px] text-sm font-light transition-colors`}
                  style={{ backgroundColor: '#F9A825', color: '#FFFFFF', borderRadius: '12px' }}
                >
                  Back to setting page ({countdown}s)
                </button>
              ) : (
                <button
                  onClick={() => navigate('/settings', { state: { selectedSidebarOption: 'security' } })}
                  className={`${isMobileFromProfile ? 'w-full' : 'w-full max-w-xs mx-auto'} py-2.5 rounded-[12px] text-sm font-normal transition-colors`}
                  style={{ backgroundColor: '#F9A825', color: '#FFFFFF', borderRadius: '12px' }}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSuccess;

