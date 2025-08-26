import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logoSmall from '../../assets/images/logos/ba-brand-icon-colored.png';
import logoLarge from '../../assets/images/logos/Frame 656.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const { login, setVisitorMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Remember Me service functions (backend-ready)
  const rememberMeService = {
    saveRememberedEmail: (email: string) => {
      const rememberData = {
        email,
        timestamp: new Date().getTime(),
        expiresIn: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
      };
      localStorage.setItem('rememberedEmail', JSON.stringify(rememberData));
    },
    
    getRememberedEmail: () => {
      const stored = localStorage.getItem('rememberedEmail');
      if (!stored) return null;
      
      try {
        const data = JSON.parse(stored);
        const now = new Date().getTime();
        
        // Check if expired (30 days)
        if (now - data.timestamp > data.expiresIn) {
          localStorage.removeItem('rememberedEmail');
          return null;
        }
        
        return data.email;
      } catch {
        localStorage.removeItem('rememberedEmail');
        return null;
      }
    },
    
    clearRememberedEmail: () => {
      localStorage.removeItem('rememberedEmail');
    }
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
      newErrors.email = 'Email is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain both letters and numbers';
    }

    // Show password requirements if password field has content but criteria not met
    if (password && password.length > 0 && password.length < 8) {
      newErrors.passwordHint = 'Password must be at least 8 characters with letters and numbers';
    } else if (password && password.length >= 8 && !/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      newErrors.passwordHint = 'Password must contain both letters and numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call to validate credentials
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Login attempt:', { email, password });
      
      // Check credentials against registered users in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = registeredUsers.find((u: any) => 
        u.email === email && u.password === password
      );
      
      if (user) {
        // Valid credentials - login successful
        const userData = {
          id: user.email, // Use email as ID for demo
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          profileImage: user.profileImage || undefined
        };
        
        // Handle remember me functionality
        if (rememberMe) {
          rememberMeService.saveRememberedEmail(email);
        } else {
          rememberMeService.clearRememberedEmail();
        }
        
        login(userData);
        navigate('/');
      } else {
        // Invalid credentials or user doesn't exist
        setErrors({ 
          general: 'Invalid email or password. Please check your credentials and try again.' 
        });
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({ 
        general: 'Login failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      setIsLoading(true);
      console.log(`${provider} login clicked`);
      
      // Simulate brief authentication delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate checking if account exists in BaoAfrik database
      // 60% chance account exists for demo purposes
      const accountExists = Math.random() > 0.4;
      
      if (accountExists) {
        // Account found - simulate getting user data
        const mockUserData = {
          google: {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            profileImage: 'https://via.placeholder.com/150',
            provider: 'google'
          },
          facebook: {
            id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@facebook.com',
            profileImage: 'https://via.placeholder.com/150',
            provider: 'facebook'
          },
          github: {
            id: '3',
            name: 'Dev User',
            email: 'dev.user@github.com',
            profileImage: 'https://via.placeholder.com/150',
            provider: 'github'
          }
        };
        
        const userData = mockUserData[provider as keyof typeof mockUserData];
        
        // Store user data and redirect to validation success
        localStorage.setItem('tempSocialUser', JSON.stringify(userData));
        
        navigate('/social-login-validation', {
          state: {
            provider: provider,
            isLogin: true
          }
        });
      } else {
        // No account found - redirect to error page
        navigate('/social-login-error', {
          state: {
            provider: provider
          }
        });
      }
      
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      setErrors({ general: `Failed to login with ${provider}. Please try again.` });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVisitorAccess = () => {
    // Set visitor mode and navigate to home page
    setVisitorMode(true);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Visitor Access Button */}
          <div className="text-center">
            <button
              onClick={handleVisitorAccess}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Access as visitor
            </button>
          </div>
          
          {/* Success Message */}
          {successMessage && messageType === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            </div>
          )}
          
          {/* General Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  minLength={8}
                  pattern="^(?=.*[a-zA-Z])(?=.*\d).{8,}$"
                  disabled={isLoading}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
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
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              {errors.passwordHint && !errors.password && (
                <div className="mt-1 flex items-center text-sm text-orange-600">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
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
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-orange-600 hover:text-orange-500">
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          <div className="text-center">
            <span className="text-gray-400 text-sm">Or sign in with</span>
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              disabled={isLoading}
              className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
              className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </button>
          </div>

          <div className="text-center">
            <span className="text-gray-500 text-sm">Don't have an account? </span>
            <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500">
              Sign Up
            </Link>
          </div>
        </form>
        </div>
      </div>

      {/* Right side - Logo Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100">
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
              Your gateway to authentic African products and cultural experiences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
