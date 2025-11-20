import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoFull from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';
import lilLogo from '../../assets/images/pre/lil.png';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import updateIcon from '../../assets/images/pre/update.svg.svg';

const ResetPasswordSent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend functionality
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Mask email for display
  const maskEmail = (email: string) => {
    if (!email) return 'g***********@gmail.com';
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return 'g***********@gmail.com';
    
    const maskedLocal = localPart.charAt(0) + '*'.repeat(Math.max(0, localPart.length - 1));
    return `${maskedLocal}@${domain}`;
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement verification API call
      console.log('Verifying reset code:', code, 'for email:', email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to reset password page
      navigate('/reset-password', { 
        state: { 
          email: email 
        } 
      });
      
    } catch (error) {
      console.error('Verification failed:', error);
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      // TODO: Implement resend API call
      console.log('Resending verification code to:', email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset countdown
      setCountdown(60);
      setCanResend(false);
      
    } catch (error) {
      setError('Failed to resend code. Please try again.');
      setCanResend(true);
      setCountdown(0);
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
          <div className="bg-white rounded-[30px] shadow-lg p-8 lg:p-10 mt-0 lg:mt-16" style={{ boxShadow: '0 4px 30px 0 rgba(0,0,0,0.05)' }}>
            <div className="text-center mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {/* Mail Verification Icon */}
              <div className="mx-auto w-16 h-16 flex items-center justify-center mb-5">
                <img src={updateIcon} alt="Mail verification" className="w-14 h-14" />
              </div>
              
              <h1 className="text-lg font-semibold mb-1.5" style={{ color: '#212121' }}>
                Mail verification
              </h1>
              <p className="text-xs px-4 mb-2" style={{ color: '#BABABA' }}>
                Please enter the 6-digit code received at the email address {maskEmail(email)}
              </p>
              {!canResend ? (
                <p className="text-[11px] mt-1 mb-0" style={{ color: '#FF6E6E', fontFamily: 'Poppins, sans-serif' }}>
                  Request another code 0:{countdown.toString().padStart(2, '0')}
                </p>
              ) : (
                <button
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-[11px] focus:outline-none"
                  style={{ color: '#64B5F6', textDecoration: 'underline', fontFamily: 'Poppins, sans-serif' }}
                >
                  Request a new digital code
                </button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 6-Digit Code Input */}
              <div className="flex justify-center space-x-2">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="verification-input w-12 h-12 text-center text-lg font-medium bg-white"
                    style={{ border: `1px solid ${error ? '#EF4444' : '#E9E9E9'}`, borderRadius: '10px', color: '#212121' }}
                    disabled={isLoading}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#BABABA';
                      e.currentTarget.style.borderWidth = '0.5px';
                    }}
                    onBlur={(e) => (e.currentTarget.style.borderColor = error ? '#EF4444' : '#E9E9E9')}
                  />
                ))}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || verificationCode.join('').length !== 6}
                  className="w-full py-2.5 px-4 rounded-[10px] transition-all duration-200 text-sm font-medium"
                  style={{
                    backgroundColor: verificationCode.join('').length === 6 && !isLoading ? '#F9A825' : '#E9E9E9',
                    color: verificationCode.join('').length === 6 && !isLoading ? '#FFFFFF' : '#6A6A6A'
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="md" color={verificationCode.join('').length === 6 ? 'white' : 'gray'} className="mr-2" />
                      Verifying...
                    </div>
                  ) : (
                    'Confirm email address'
                  )}
                </button>
              </div>
            </form>

            {/* Resend Code */}
            <div className="mt-6 text-center"></div>
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

export default ResetPasswordSent;
