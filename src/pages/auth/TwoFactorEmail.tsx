import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import keyIcon from '../../assets/images/pre/key.svg';
import backArrowIcon from '../../assets/images/pre/back arrow.svg';

const TwoFactorEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromProfileSettings = location.state?.fromProfileSettings || false;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/two-factor-phone', {
      state: {
        fromProfileSettings: fromProfileSettings,
        email: email,
        password: password
      }
    });
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
            <div className="mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
                Please enter your information
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* Email Input */}
                <div>
                  <label className="block text-xs mb-2" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your mail address"
                    className="w-full px-4 py-3 border rounded-[12px] text-sm bg-white focus:outline-none"
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
                    required
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-xs mb-2" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border rounded-[12px] text-sm bg-white focus:outline-none"
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
                    required
                  />
                </div>

                {/* Continue Button - Full width on mobile */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className={`${isMobileFromProfile ? 'w-full' : 'flex-1'} py-2 px-4 rounded-[12px] text-sm font-light transition-colors`}
                    style={{ 
                      backgroundColor: '#F9A825',
                      color: '#FFFFFF',
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

export default TwoFactorEmail;

