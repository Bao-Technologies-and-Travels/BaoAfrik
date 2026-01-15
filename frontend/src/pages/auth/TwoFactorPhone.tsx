import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import keyIcon from '../../assets/images/pre/key.svg';
import backArrowIcon from '../../assets/images/pre/back arrow.svg';
import arrowDownIcon from '../../assets/images/pre/arrow-down.svg';
import { twoFactorService } from '../../services/twoFactorService';
import { useToast } from '../../contexts/ToastContext';

const phoneCodes = [
  { label: 'United States', code: '+1', flag: 'us' },
  { label: 'United Kingdom', code: '+44', flag: 'gb' },
  { label: 'France', code: '+33', flag: 'fr' },
  { label: 'Cameroon', code: '+237', flag: 'cm' },
  { label: 'South Africa', code: '+27', flag: 'za' },
  { label: 'Algeria', code: '+213', flag: 'dz' },
  { label: 'Angola', code: '+244', flag: 'ao' },
  { label: 'Benin', code: '+229', flag: 'bj' },
  { label: 'Congo', code: '+242', flag: 'cg' },
  { label: 'Gabon', code: '+241', flag: 'ga' }
];

const TwoFactorPhone: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const fromProfileSettings = location.state?.fromProfileSettings || false;
  const email = location.state?.email || '';
  const password = location.state?.password || '';
  const [phone, setPhone] = useState('');
  const [selectedPhoneCode, setSelectedPhoneCode] = useState({
    label: 'United States',
    code: '+1',
    flag: 'us'
  });
  const [isPhoneCodeDropdownOpen, setIsPhoneCodeDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const phoneCodeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (phoneCodeDropdownRef.current && !phoneCodeDropdownRef.current.contains(event.target as Node)) {
        setIsPhoneCodeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Please enter your phone number',
        duration: 3000
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Enable 2FA with phone method
      await twoFactorService.enable('phone', phone, selectedPhoneCode.code);
      
      navigate('/two-factor-code', {
        state: {
          fromProfileSettings: fromProfileSettings,
          email: email,
          password: password,
          phone: phone,
          phoneCode: selectedPhoneCode
        }
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to enable 2FA',
        duration: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
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
                We'll send a verification code to this number whenever you sign in to your account
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* Phone Number Input */}
                <div>
                  <label className="block text-xs mb-2" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>
                    Phone number
                  </label>
                  <div className="flex gap-2">
                    {/* Country Code Dropdown */}
                    <div className="relative flex-shrink-0" ref={phoneCodeDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsPhoneCodeDropdownOpen(!isPhoneCodeDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-3 border rounded-[12px] bg-white focus:outline-none"
                        style={{
                          borderColor: '#E9E9E9',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        <img
                          src={`https://flagcdn.com/w20/${selectedPhoneCode.flag}.png`}
                          alt={selectedPhoneCode.label}
                          className="w-5 h-5 rounded-full"
                          style={{ objectFit: 'cover' }}
                        />
                        <span className="text-xs" style={{ color: '#939393' }}>
                          {selectedPhoneCode.code}
                        </span>
                        <img
                          src={arrowDownIcon}
                          alt="Arrow"
                          className="w-4 h-4"
                          style={{ filter: 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(90%)' }}
                        />
                      </button>

                      {/* Dropdown */}
                      {isPhoneCodeDropdownOpen && (
                        <div
                          className="absolute top-full left-0 mt-1 bg-white z-50 w-48"
                          style={{
                            borderRadius: '20px',
                            boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                            overflow: 'hidden'
                          }}
                        >
                          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {phoneCodes.map((code) => (
                              <button
                                key={code.code}
                                type="button"
                                onClick={() => {
                                  setSelectedPhoneCode(code);
                                  setIsPhoneCodeDropdownOpen(false);
                                }}
                                className="flex items-center gap-2 px-3 py-2 transition-colors w-full"
                                style={{
                                  backgroundColor: selectedPhoneCode.code === code.code ? '#F0F8FE' : 'transparent',
                                  borderRadius: selectedPhoneCode.code === code.code ? '8px' : '0',
                                  margin: selectedPhoneCode.code === code.code ? '4px 8px' : '0',
                                  width: selectedPhoneCode.code === code.code ? 'calc(100% - 16px)' : '100%'
                                }}
                              >
                                <img
                                  src={`https://flagcdn.com/w20/${code.flag}.png`}
                                  alt={code.label}
                                  className="w-4 h-4 rounded-full"
                                  style={{ objectFit: 'cover' }}
                                />
                                <span
                                  className="text-xs flex-1 text-left"
                                  style={{
                                    color: selectedPhoneCode.code === code.code ? '#64B5F6' : '#BABABA',
                                    fontFamily: 'Poppins, sans-serif'
                                  }}
                                >
                                  {code.code} <span style={{ margin: '0 2px' }}>·</span> {code.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Phone Number Input */}
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="flex-1 px-4 py-3 border rounded-[12px] bg-white focus:outline-none"
                      style={{
                        borderColor: '#E9E9E9',
                        color: '#212121',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: isMobileFromProfile ? '11px' : '14px'
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
                </div>

                {/* Continue Button - Full width on mobile */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${isMobileFromProfile ? 'w-full' : 'flex-1'} py-2 px-4 rounded-[12px] text-sm font-light transition-colors`}
                    style={{
                      backgroundColor: isSubmitting ? '#E9E9E9' : '#F9A825',
                      color: isSubmitting ? '#6A6A6A' : '#FFFFFF',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    {isSubmitting ? 'Processing...' : 'Continue'}
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

export default TwoFactorPhone;

