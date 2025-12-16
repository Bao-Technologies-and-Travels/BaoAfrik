import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoFull from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';
import lilLogo from '../../assets/images/pre/lil.png';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { authService } from '../../services/authService';
import { useToast } from '../../contexts/ToastContext';

import leftIcon from '../../assets/images/pre/left.png';
import backArrowIcon from '../../assets/images/pre/back arrow.svg';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const { addToast } = useToast();
  const fromProfileSettings = location.state?.fromProfileSettings || false;

  // State for the entire flow
  const [step, setStep] = useState<'code' | 'password'>('code');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [countdown, setCountdown] = useState(0);
  const [resetToken, setResetToken] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false
  });
  const [isMobile, setIsMobile] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Code input handlers
  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits are entered
    if (newCode.every(digit => digit !== '') && index === 5) {
      handleVerifyCode(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').split('').slice(0, 6);

    if (digits.length === 6) {
      const newCode = [...code];
      digits.forEach((digit, index) => {
        newCode[index] = digit;
      });
      setCode(newCode);
      inputRefs.current[5]?.focus();

      // Auto-verify
      setTimeout(() => handleVerifyCode(newCode.join('')), 100);
    }
  };

  // Code verification
  const handleVerifyCode = async (submittedCode = code.join('')) => {
    if (submittedCode.length !== 6) {
      setErrors({ code: 'Please enter the 6-digit code' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authService.verifyResetCode(email, submittedCode);

      if (response.success && response.data) {
        setResetToken(response.data.resetToken);
        setStep('password');
        setErrors({});
      } else {
        setErrors({
          code: response.message || 'Invalid verification code'
        });
      }
    } catch (error: any) {
      setErrors({
        code: error.response?.data?.message || 'Failed to verify code. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend code
  const handleResendCode = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const response = await authService.forgotPassword(email);

      if (response.success) {
        setCountdown(60); // 60 seconds countdown
        setErrors({});
        // Clear the code inputs
        setCode(['', '', '', '', '', '']);
        addToast({
          type: "success",
          title: "New code sent",
          message: "Check your email and spam folder for a new code that has been sent",
          duration: 2000,
        });
        inputRefs.current[0]?.focus();
      } else {
        setErrors({
          general: response.message || 'Failed to resend code'
        });
      }
    } catch (error: any) {
      setErrors({
        general: error.response?.data?.message || 'Failed to resend code. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // show password requirements if password field has content but criteria not met
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      delete newErrors.password;

      const requirements = [];
      if (formData.password.length < 8) requirements.push('at least 8 characters');
      if (!/(?=.*[a-z])/.test(formData.password)) requirements.push('one lowercase letter');
      if (!/(?=.*[A-Z])/.test(formData.password)) requirements.push('one uppercase letter');
      if (!/(?=.*\d)/.test(formData.password)) requirements.push('one number');
      if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password)) requirements.push('one special character');

      if (requirements.length > 0) {
        newErrors.passwordHint = `Password must contain: ${requirements.join(', ')}`;
      } else {
        delete newErrors.passwordHint;
      }
    }

    // confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match. Please repeat the password entered above.'
    } else {
      delete newErrors.confirmPassword;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Password reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      password: true,
      confirmPassword: true
    });

    if (!validateForm()) return;


    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await authService.resetPassword({
        resetToken: resetToken,
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword
      });

      addToast({
        type: 'success',
        title: 'Password modified',
        message: 'Your password has been reset. Redirecting to login in 3 seconds...',
        duration: 2000
      })

      if (response.success) {
        navigate('/password-reset-success');
      } else {
        setErrors({
          general: response.message || 'Failed to reset password. Please try again.'
        });
      }
    } catch (error: any) {
      setErrors({
        general: error.response?.data?.message || 'Failed to reset password. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Go back to code entry
  const handleBackToCode = () => {
    setStep('code');
    setErrors({});

  };

  const getPasswordRequirements = () => {
    const password = formData.password;
    return [
      { text: 'At least 8 characters', met: password.length >= 8 },
      { text: 'One lowercase letter (a-z)', met: /(?=.*[a-z])/.test(password) },
      { text: 'One uppercase letter (A-Z)', met: /(?=.*[A-Z])/.test(password) },
      { text: 'One number (0-9)', met: /(?=.*\d)/.test(password) },
      { text: 'One special character', met: /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password) }
    ];
  };

  const isPasswordValid = () => {
    const requirements = getPasswordRequirements();
    return requirements.every(req => req.met);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  useEffect(() => {
    if (step === 'password') {
      validateForm();
    }
  }, [formData.password, formData.confirmPassword, step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Render code verification step
  const renderCodeStep = () => (
    <>
      <div className="text-center mb-8">
        <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="text-2xl font-medium text-gray-900 mb-3">
          Enter Verification Code
        </h1>
        <p className="text-gray-500 text-sm mb-2">
          We sent a 6-digit code to <strong>{email}</strong>
        </p>
        <p className="text-gray-500 text-sm">
          Enter the code below to reset your password
        </p>
      </div>

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleVerifyCode(); }} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
            6-Digit Verification Code
          </label>
          <div className="flex justify-center space-x-2 mb-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`w-12 h-12 text-center text-lg font-semibold border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.code ? 'border-red-500' : 'border-gray-300'
                  }`}
                disabled={isLoading}
                autoFocus={index === 0}
              />
            ))}
          </div>
          {errors.code && (
            <p className="text-center mt-2 text-sm text-red-600">{errors.code}</p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading || code.some(digit => digit === '')}
            className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-200 ${!code.some(digit => digit === '') && !isLoading
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="md" color="white" className="mr-2" />
                Verifying...
              </div>
            ) : (
              'Verify Code'
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm mb-4">
          Didn't receive the code?
        </p>
        <button
          onClick={handleResendCode}
          disabled={isLoading || countdown > 0}
          className={`text-sm font-medium ${countdown > 0 || isLoading
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-orange-500 hover:text-orange-600'
            }`}
        >
          {countdown > 0
            ? `Resend code in ${countdown}s`
            : 'Resend verification code'
          }
        </button>
      </div>
    </>
  );

  // Render password reset step
  const renderPasswordStep = () => (
    <>
      <div className="text-center mb-8">
        <div className="mx-auto w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>

        <h1 className="text-2xl font-medium text-gray-900 mb-3">
          Reset Password
        </h1>
        <p className="text-gray-500 text-sm">
          Please enter your new password
        </p>
      </div>

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleResetPassword} className="space-y-6">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed ${touched.password && errors.password ? 'border-red-500' :
                !touched.password ? 'border-gray-200' :
                  isPasswordValid() ? 'border-green-500' : 'border-orange-500'
                }`}
              placeholder="Enter new password"
              required
              disabled={isLoading}
              minLength={8}
              onBlur={handleBlur}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {/* Password requirements checklist */}
          {(touched.password || formData.password) && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Password must contain:</p>
              <div className="space-y-1">
                {getPasswordRequirements().map((req, index) => (
                  <div key={index} className="flex items-center text-sm">
                    {req.met ? (
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {touched.password && errors.password && !errors.passwordHint && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500' :
                !touched.confirmPassword ? 'border-gray-200' :
                  formData.confirmPassword && !errors.confirmPassword ? 'border-green-500' : 'border-gray-200'
                }`}
              placeholder="Confirm new password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.confirmPassword}
            </p>
          )}
          {touched.confirmPassword && formData.confirmPassword && !errors.confirmPassword && (
            <p className="mt-1 text-sm text-green-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Passwords match
            </p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading || !formData.password.trim() || !formData.confirmPassword.trim()}
            className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-200 ${formData.password.trim() && formData.confirmPassword.trim() && !isLoading
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="md" color="white" className="mr-2" />
                Saving new password...
              </div>
            ) : (
              'Save new password'
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={handleBackToCode}
          className="text-orange-500 hover:text-orange-600 font-medium text-sm"
        >
          ← Back to code verification
        </button>
      </div>
    </>
  );

  if (!email) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Email Required</h1>
            <p className="text-gray-600 mb-6">
              Please go back and enter your email address to receive a verification code.
            </p>
            <Link
              to="/forgot-password"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Back to Forgot Password
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="mb-2 w-full mt-6" style={{ marginLeft: '-8px' }}>
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
          {/* Mobile Header */}
          {isMobileFromProfile ? (
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
          ) : (
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
          )}

          {/* Main content */}
          <div className="bg-white border-0 lg:border border-gray-200 rounded-lg shadow-none lg:shadow-lg p-8 mt-0 lg:mt-16">
            {step === 'code' ? renderCodeStep() : renderPasswordStep()}
          </div>
        </div>
      </div>

      {/* Footer */}
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
      <style>{`
        .reset-password-input::placeholder {
          color: #E9E9E9 !important;
          font-size: 12px !important;
          font-family: 'Poppins', sans-serif !important;
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;