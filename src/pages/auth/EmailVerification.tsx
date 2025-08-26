import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoSmall from '../../assets/images/logos/ba-brand-icon-colored.png';
import logoLarge from '../../assets/images/logos/Frame 656.png';

const EmailVerification: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Get email from navigation state
  const email = location.state?.email || 'your email';
  const fromRegistration = location.state?.fromRegistration || false;

  // Countdown timer for resend functionality
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

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

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newCode = [...verificationCode];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newCode[i] = pastedData[i];
      }
    }
    
    setVerificationCode(newCode);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = verificationCode.join('');
    
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement email verification API call
      console.log('Verifying code:', code);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // On success, redirect to login or dashboard
      console.log('Email verified successfully!');
      
      if (fromRegistration) {
        // If coming from registration, redirect to verification success page
        navigate('/email-verification-success');
      } else {
        // If verifying existing account, redirect to dashboard/profile
        navigate('/profile');
      }
      
    } catch (error) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setCountdown(60);
    setError('');
    
    try {
      // TODO: Implement resend verification code API call
      console.log('Resending verification code...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      setError('Failed to resend code. Please try again.');
      setCanResend(true);
      setCountdown(0);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6">
            <img 
              src={logoSmall} 
              alt="BaoAfrik Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-display text-xl sm:text-2xl text-gray-900 mb-2">
            Verify Your Email
          </h2>
          <p className="text-body text-gray-500 text-sm mb-6 sm:mb-8 px-2">
            We've sent a 6-digit verification code to <span className="font-medium text-gray-700">{email}</span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-xs sm:text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Verification Code Input */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Enter verification code
            </label>
            <div className="flex justify-between space-x-1 sm:space-x-2">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-semibold border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || verificationCode.some(digit => !digit)}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 text-sm sm:text-base"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                <span className="text-sm sm:text-base">Verifying...</span>
              </div>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>

        {/* Resend Code */}
        <div className="text-center mt-4 sm:mt-6">
          <p className="text-xs sm:text-sm text-gray-500 mb-2">
            Didn't receive the code?
          </p>
          {canResend ? (
            <button
              onClick={handleResendCode}
              className="text-orange-600 hover:text-orange-500 font-medium text-xs sm:text-sm"
            >
              Resend Code
            </button>
          ) : (
            <p className="text-gray-400 text-xs sm:text-sm">
              Resend code in {countdown}s
            </p>
          )}
        </div>

        {/* Back to Login */}
        <div className="text-center mt-6 sm:mt-8">
          <Link to="/login" className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
