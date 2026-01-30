import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logoSmall from "../../assets/images/logos/ba-brand-icon-colored.png";
import logoLarge from "../../assets/images/logos/Frame 656.png";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { authService } from "../../services/authService";
import { useToast } from "../../contexts/ToastContext";
import keyIcon from "../../assets/images/pre/key.svg";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const { addToast } = useToast();

  // 2FA Modal State
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<'phone' | 'email'>('phone');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [twoFactorCountdown, setTwoFactorCountdown] = useState(60);
  const [canResendTwoFactor, setCanResendTwoFactor] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const twoFactorCodeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const twoFactorModalRef = useRef<HTMLDivElement>(null);

  const { login, setVisitorMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Remember Me service functions (backend-ready)
  const rememberMeService = {
    saveRememberedEmail: (email: string) => {
      const rememberData = {
        email,
        timestamp: new Date().getTime(),
        expiresIn: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
      };
      localStorage.setItem("rememberedEmail", JSON.stringify(rememberData));
    },

    getRememberedEmail: () => {
      const stored = localStorage.getItem("rememberedEmail");
      if (!stored) return null;

      try {
        const data = JSON.parse(stored);
        const now = new Date().getTime();

        // Check if expired (30 days)
        if (now - data.timestamp > data.expiresIn) {
          localStorage.removeItem("rememberedEmail");
          return null;
        }

        return data.email;
      } catch {
        localStorage.removeItem("rememberedEmail");
        return null;
      }
    },

    clearRememberedEmail: () => {
      localStorage.removeItem("rememberedEmail");
    },
  };

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = rememberMeService.getRememberedEmail();
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // Get success message from email verification
  const successMessageFromLocation = location.state?.message;
  const messageTypeFromLocation = location.state?.type;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email =
        "Please enter a valid email address of format name@example.com";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    // clear localStorage and sessionStorage before logging in
    localStorage.clear();
    sessionStorage.clear();

    // Clear any existing cookies
    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.trim().split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    const completeLogin = async (
      user: any,
      accessToken: string,
      refreshToken?: string
    ) => {
      // Store tokens and user data
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      localStorage.setItem("user", JSON.stringify(user));

      // Handle remember me
      if (rememberMe) {
        rememberMeService.saveRememberedEmail(email);
      } else {
        rememberMeService.clearRememberedEmail();
      }

      // Update auth context
      login(
        {
          id: user.id,
          email: user.email,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          profileImage: user.profileImage || undefined,
        },
        accessToken,
        refreshToken
      );

      // check if user needs to complete profile setup
      const profileIncomplete = !user.firstName || !user.lastName;

      if (profileIncomplete) {
        navigate("/profile-setup");
        addToast({
          type: 'info',
          title: 'Action needed!',
          message: 'Please complete your profile',
          duration: 2500
        });
      } else {
        navigate("/");
        addToast({
          type: "success",
          title: "Login successful",
          message: `Welcome back, ${user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.firstName
              ? user.firstName
              : user?.email?.split("@")[0] || "User"
            }!`,
          duration: 2000,
        });
      }

    };

    try {
      const response = await authService.login({
        email: email.toLowerCase(),
        password,
        rememberMe,
      });

      if (!response.success) {
        // Handle error cases
        if (response.message === "Invalid email") {
          setErrors({
            email: "No account found with this email address.",
          });
        } else if (response.message === "Invalid password") {
          setErrors({
            password: "Incorrect password. Please try again.",
          });
        } else {
          throw new Error(response.message || "Login failed.");
        }
        return;
      }

      // Check if 2FA is required
      const responseData = response.data as any;
      if (responseData?.requires2FA) {
        // Show 2FA modal instead of navigating
        setTwoFactorMethod(responseData.method || 'phone');
        setShowTwoFactorModal(true);
        setTwoFactorCountdown(60);
        setCanResendTwoFactor(false);
        setVerificationCode(['', '', '', '', '', '']);
        // Focus first input after modal opens
        setTimeout(() => {
          twoFactorCodeInputRefs.current[0]?.focus();
        }, 100);
        return;
      }

      const loginData = response.data;

      if (!loginData) {
        throw new Error("No login data received from server");
      }

      const { user, accessToken, refreshToken } = loginData;

      if (!user || !accessToken) {
        const nestedData = (loginData as any).data;
        if (nestedData) {
          const {
            user: nestedUser,
            accessToken: nestedAccessToken,
            refreshToken: nestedRefreshToken,
          } = nestedData;
          if (nestedUser && nestedAccessToken) {
            // Use the nested data
            await completeLogin(
              nestedUser,
              nestedAccessToken,
              nestedRefreshToken
            );
            return;
          }
        }
        throw new Error("Missing user data or access token");
      }

      await completeLogin(user, accessToken, refreshToken);
    } catch (error: any) {
      if (error.message === "Please verify your email before logging in") {
        setErrors({
          general:
            "Please verify your email before logging in. Redirecting to verification page in 3 seconds...",
        });
        setTimeout(() => {
          navigate("/verify-email", {
            state: {
              email: email.toLowerCase(),
              message: "Please verify your email address to continue",
              type: "info",
            },
          });
        }, 3000);
      } else {
        setErrors({
          general: error.message || "Login failed. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Show alert that social login is not available yet
    // alert('Social login not available yet. Backend coming soon.');
    addToast({
      type: "info",
      title: "Feature coming soon",
      message: `Social login with ${provider} coming soon. Please login with email and password`,
      duration: 2000,
    });
  };

  const handleVisitorAccess = () => {
    // Set visitor mode and navigate to home page
    setVisitorMode(true);
    navigate("/");
  };

  // Countdown timer for 2FA resend
  useEffect(() => {
    if (twoFactorCountdown > 0 && showTwoFactorModal) {
      const timer = setTimeout(() => setTwoFactorCountdown(twoFactorCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (twoFactorCountdown === 0 && showTwoFactorModal) {
      setCanResendTwoFactor(true);
    }
  }, [twoFactorCountdown, showTwoFactorModal]);

  // Handle 2FA code input change
  const handleTwoFactorCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      twoFactorCodeInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle 2FA code key down
  const handleTwoFactorCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      twoFactorCodeInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle 2FA OTP verification
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = verificationCode.join('');
    if (code.length !== 6) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Please enter the complete 6-digit code',
        duration: 3000
      });
      return;
    }

    setIsVerifyingOTP(true);
    try {
      const response = await authService.verifyLoginOTP(email.toLowerCase(), code);

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;

        // Store tokens and user data
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(user));

        // Update auth context
        login(
          {
            id: user.id,
            email: user.email,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
            profileImage: user.profileImage || undefined,
          },
          accessToken,
          refreshToken
        );

        // Close modal
        setShowTwoFactorModal(false);
        setVerificationCode(['', '', '', '', '', '']);

        // Check if profile is incomplete
        const profileIncomplete = !user.firstName || !user.lastName;

        if (profileIncomplete) {
          navigate('/profile-setup');
          addToast({
            type: 'info',
            title: 'Action needed!',
            message: 'Please complete your profile',
            duration: 2500
          });
        } else {
          navigate('/');
          addToast({
            type: 'success',
            title: 'Login successful',
            message: `Welcome back, ${user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : user?.firstName
                ? user.firstName
                : user?.email?.split('@')[0] || 'User'
              }!`,
            duration: 2000
          });
        }
      } else {
        throw new Error(response.message || 'Invalid verification code');
      }
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Verification failed',
        message: error.message || 'Invalid verification code',
        duration: 3000
      });
      // Clear the code inputs
      setVerificationCode(['', '', '', '', '', '']);
      twoFactorCodeInputRefs.current[0]?.focus();
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  // Handle resend 2FA code
  const handleResendTwoFactorCode = async () => {
    if (!canResendTwoFactor) return;

    try {
      // Re-login to trigger new OTP
      setIsLoading(true);
      const response = await authService.login({
        email: email.toLowerCase(),
        password,
        rememberMe,
      });

      if (response.success) {
        const responseData = response.data as any;
        if (responseData?.requires2FA) {
          setTwoFactorCountdown(60);
          setCanResendTwoFactor(false);
          addToast({
            type: 'success',
            title: 'Code sent',
            message: 'A new verification code has been sent',
            duration: 2000
          });
        }
      }
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to resend code',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (twoFactorModalRef.current && !twoFactorModalRef.current.contains(event.target as Node)) {
        // Don't close on outside click - user must verify
      }
    };

    if (showTwoFactorModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTwoFactorModal]);

  return (
    <div className="min-h-screen bg-white flex" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center pt-8 md:pt-0">
            <button
              onClick={handleVisitorAccess}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
            >
              {/* <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg> */}
              Back to Homepage
            </button>
          </div>

          {/* Success Message */}
          {successMessage && messageType === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            </div>
          )}

          {/* General Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Logo */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 mb-6">
              <img
                src={logoSmall}
                alt="BaoAfrik Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-display text-2xl text-gray-900 mb-2">
              Sign In
            </h2>
            <p className="text-body text-gray-500 text-sm">
              Welcome back! Please sign in to your BaoAfrik account
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed ${errors.email ? "border-red-500" : "border-gray-200"
                    }`}
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    minLength={8}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed ${errors.password ? "border-red-500" : "border-gray-200"
                      }`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                {errors.passwordHint && !errors.password && (
                  <div className="mt-1 flex items-center text-sm text-orange-600">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.passwordHint}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded disabled:cursor-not-allowed"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500 underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
                style={{ backgroundColor: isLoading ? "#9CA3AF" : "#F9A825" }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="md" color="white" className="mr-2" />
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>

            {/* social login */}
            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign in with
                </span>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
                className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("facebook")}
                disabled={isLoading}
                className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("apple")}
                disabled={isLoading}
                className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <svg
                  className="w-6 h-6 text-gray-900"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                </svg>
              </button>
            </div> */}

            <div className="text-center">
              <span className="text-gray-500 text-sm">
                Don't have an account?{" "}
              </span>
              <Link
                to="/register"
                className="font-medium text-black hover:text-gray-700 underline"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Logo Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-orange-50 via-orange-100 to-white">
        <div className="max-w-md text-center">
          {/* Large BaoAfrik Logo */}
          <div className="mx-auto w-80 h-80 mb-8 flex items-center justify-center">
            <img
              src={logoLarge}
              alt="BaoAfrik - Authentic African Marketplace"
              className="max-w-full max-h-full object-contain drop-shadow-lg"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-display text-2xl text-gray-800 font-semibold">
              Welcome Back to BaoAfrik
            </h3>
            <p className="text-body text-gray-600 text-lg leading-relaxed">
              Your gateway to authentic African products and cultural
              experiences
            </p>
          </div>
        </div>
      </div>

      {/* 2FA Verification Modal */}
      {showTwoFactorModal && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: '#0000001A' }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              ref={twoFactorModalRef}
              className="bg-white rounded-[30px] pt-12 sm:pt-14 px-6 sm:px-8 pb-16 relative max-w-md w-full"
              style={{ boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <img src={keyIcon} alt="Key" className="w-16 h-16" />
              </div>

              {/* Title */}
              <h2
                className="text-xl text-center mb-1.5"
                style={{ color: '#212121', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 500 }}
              >
                Two step authentication
              </h2>

              {/* Description */}
              <p className="text-xs text-center mb-2" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                Enter the authentication code below we sent to<br />
                {twoFactorMethod === 'phone' ? 'your phone number' : email}
              </p>
              {!canResendTwoFactor ? (
                <p className="text-[11px] mt-3 mb-6 text-center" style={{ color: '#FF6E6E', fontFamily: 'Poppins, sans-serif' }}>
                  Request another code 0:{twoFactorCountdown.toString().padStart(2, '0')}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendTwoFactorCode}
                  className="text-[11px] mb-6 mx-auto block focus:outline-none"
                  style={{ color: '#64B5F6', textDecoration: 'underline', fontFamily: 'Poppins, sans-serif' }}
                >
                  Request a new digital code
                </button>
              )}

              {/* Form */}
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                {/* 6-Digit Code Input */}
                <div className="flex justify-center gap-2 mt-8 mb-8">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (twoFactorCodeInputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleTwoFactorCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleTwoFactorCodeKeyDown(index, e)}
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

                {/* Continue Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={verificationCode.join('').length !== 6 || isVerifyingOTP}
                    className="w-full py-2 px-4 rounded-[12px] text-sm font-light transition-colors"
                    style={{
                      backgroundColor: verificationCode.join('').length === 6 && !isVerifyingOTP ? '#F9A825' : '#E9E9E9',
                      color: verificationCode.join('').length === 6 && !isVerifyingOTP ? '#FFFFFF' : '#6A6A6A',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    {isVerifyingOTP ? 'Verifying...' : 'Continue'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
