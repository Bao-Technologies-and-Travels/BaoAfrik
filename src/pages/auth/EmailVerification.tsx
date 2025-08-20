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
        // If coming from registration, redirect to login with success message
        navigate('/login', { 
          state: { 
            message: 'Email verified successfully! Please sign in to continue.',
            type: 'success'
          } 
        });
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="mx-auto w-20 h-20 mb-6">
              <img 
                src={logoSmall} 
                alt="BaoAfrik Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-display text-2xl text-gray-900 mb-2">
              Verify Your Email
            </h2>
            <p className="text-body text-gray-500 text-sm mb-2">
              We've sent a 6-digit verification code to:
            </p>
            <p className="text-body text-gray-900 text-sm font-semibold mb-4">
              {email}
            </p>
            <p className="text-body text-gray-600 text-sm">
              Please enter the code below to complete your {fromRegistration ? 'registration' : 'verification'}.
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* 6-Digit Code Input */}
            <div className="space-y-4">
              <div className="flex justify-center space-x-3">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900"
                  />
                ))}
              </div>
              
              {error && (
                <div className="text-center">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || verificationCode.join('').length !== 6}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify Email'
                )}
              </button>
            </div>

            {/* Resend Code */}
            <div className="text-center space-y-2">
              <p className="text-gray-500 text-sm">Didn't receive the code?</p>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={!canResend}
                className="font-medium text-orange-600 hover:text-orange-500 disabled:text-gray-400 disabled:cursor-not-allowed text-sm"
              >
                {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
              </button>
            </div>

            <div className="text-center">
              <Link to="/register" className="font-medium text-gray-500 hover:text-gray-700 text-sm">
                ← Back to Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100">
        <div className="max-w-md text-center">
          {/* Large Logo Illustration */}
          <div className="mx-auto w-80 h-80 mb-8 flex items-center justify-center">
            <img 
              src={logoLarge} 
              alt="BaoAfrik Large Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-center">
            <h3 className="text-display text-xl text-gray-700 mb-2">
              Almost There!
            </h3>
            <p className="text-body text-gray-600 text-sm">
              Just one more step to join the BaoAfrik community and start discovering authentic African products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
