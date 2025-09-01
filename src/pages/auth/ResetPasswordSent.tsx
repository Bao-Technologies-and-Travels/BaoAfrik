import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoSmall from '../../assets/images/logos/ba-brand-icon-colored.png';
import logoFull from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Desktop Logo - Top Left with Background */}
      <div className="hidden lg:block absolute top-0 left-0 right-0 bg-orange-50 py-4 px-8">
        <img 
          src={logoFull} 
          alt="BaoAfrik Logo" 
          className="h-8 object-contain"
        />
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo - Centered with Background */}
          <div className="lg:hidden bg-white -mx-4 px-4 py-6 mb-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 mb-6">
                <img 
                  src={logoSmall} 
                  alt="BaoAfrik Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="text-center mb-8 mt-16 lg:mt-0">
            {/* Mail Verification Icon */}
            <div className="mx-auto w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-medium text-gray-900 mb-3">
              Mail verification
            </h1>
            <p className="text-gray-500 text-sm px-4 mb-2">
              Please enter the 6-digit code sent to the email address <span className="font-medium text-gray-700">{maskEmail(email)}</span>
            </p>
            <p className="text-red-500 text-xs">
              Request another code 0:{countdown.toString().padStart(2, '0')}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 6-Digit Code Input */}
            <div className="flex justify-center space-x-3">
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
                  className="w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                  disabled={isLoading}
                />
              ))}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || verificationCode.join('').length !== 6}
                className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-200 ${
                  verificationCode.join('').length === 6 && !isLoading
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-700'
                }`}
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
          <div className="mt-6 text-center">
            {canResend ? (
              <button
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-sm text-orange-600 hover:text-orange-500 focus:outline-none focus:underline disabled:opacity-50"
              >
                Resend verification code
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                Resend code in {countdown} seconds
              </p>
            )}
          </div>

          <div className="mt-8 text-center">
            <Link 
              to="/forgot-password" 
              className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:underline"
            >
              Back to Email Entry
            </Link>
          </div>
        </div>
      </div>

      {/* Footer - Hidden on mobile */}
      <div className="hidden lg:block py-6 px-4 text-center">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>All rights reserved</span>
          </div>
          <span>•</span>
          <Link to="/contact" className="hover:text-gray-600">Contact us</Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-gray-600">Terms and conditions of use</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-gray-600">Privacy policies</Link>
          <span>•</span>
          <Link to="/cookies" className="hover:text-gray-600">Cookies</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordSent;
