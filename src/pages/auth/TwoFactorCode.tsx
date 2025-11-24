import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import keyIcon from '../../assets/images/pre/key.svg';
import backArrowIcon from '../../assets/images/pre/back arrow.svg';

const TwoFactorCode: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromProfileSettings = location.state?.fromProfileSettings || false;
  const phone = location.state?.phone || '';
  const phoneCode = location.state?.phoneCode || { code: '+1', label: 'United States' };
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isMobile, setIsMobile] = useState(false);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCodeInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = verificationCode.join('');
    if (code.length === 6) {
      navigate('/two-factor-success', {
        state: {
          fromProfileSettings: fromProfileSettings,
          phone: phone,
          phoneCode: phoneCode
        }
      });
    }
  };

  const maskPhone = (phone: string) => {
    if (!phone) return '******';
    return `${phone.charAt(0)}${'*'.repeat(Math.max(0, phone.length - 1))}`;
  };

  const isMobileFromProfile = isMobile && fromProfileSettings;

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-4 lg:pt-16">
        <div className="w-full max-w-md">
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

          {/* Main content */}
          <div className={`bg-white rounded-[30px] p-8 lg:p-10 mt-0 lg:mt-16 ${isMobileFromProfile ? '' : 'shadow-lg'}`} style={isMobileFromProfile ? {} : { boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}>
            <div className="text-center mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <img src={keyIcon} alt="Key" className="w-16 h-16" />
              </div>

              {/* Title */}
              <h2
                className="text-xl text-center mb-1.5"
                style={{ color: '#212121', fontFamily: isMobileFromProfile ? 'Bricolage Grotesque, sans-serif' : 'Bricolage Grotesque, sans-serif', fontWeight: 500 }}
              >
                Two step authentication
              </h2>

              {/* Description */}
              <p className="text-xs text-center mb-6" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                Enter the authentication code below we sent to<br />
                {phoneCode.code} {maskPhone(phone)}
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 6-Digit Code Input */}
                <div className="flex justify-center gap-2 mt-8 mb-8">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (codeInputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-medium bg-white border rounded-lg"
                      style={{
                        borderColor: '#E9E9E9',
                        color: '#212121',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#CFE8FC';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#E9E9E9';
                      }}
                    />
                  ))}
                </div>

                {/* Continue Button - Full width on mobile */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={verificationCode.join('').length !== 6}
                    className={`${isMobileFromProfile ? 'w-full' : 'flex-1'} py-2 px-4 rounded-[12px] text-sm font-light transition-colors`}
                    style={{ 
                      backgroundColor: verificationCode.join('').length === 6 ? '#F9A825' : '#E9E9E9',
                      color: verificationCode.join('').length === 6 ? '#FFFFFF' : '#6A6A6A',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorCode;

