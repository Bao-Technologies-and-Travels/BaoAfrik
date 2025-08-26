import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoSmall from '../../assets/images/logos/ba-brand-icon-colored.png';
import logoLarge from '../../assets/images/logos/Frame 656.png';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Required field validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    }

    // Password validation
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain both letters and numbers';
      }
    }

    // Show password requirements if password field is focused but criteria not met
    if (formData.password && formData.password.length > 0 && formData.password.length < 8) {
      newErrors.passwordHint = 'Password must be at least 8 characters with letters and numbers';
    } else if (formData.password && formData.password.length >= 8 && !/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.passwordHint = 'Password must contain both letters and numbers';
    }

    // Confirm password validation
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      // TODO: Implement registration API call
      console.log('Registration attempt:', formData);
      
      // Store user credentials in localStorage for frontend-only demo
      const userCredentials = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        profileImage: undefined, // Will be set during profile setup
        registeredAt: new Date().toISOString()
      };
      
      // Get existing users or create empty array
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Check if user already exists
      const userExists = existingUsers.some((user: any) => user.email === formData.email);
      
      if (userExists) {
        setErrors({ email: 'An account with this email already exists' });
        setIsLoading(false);
        return;
      }
      
      // Add new user to the list
      existingUsers.push(userCredentials);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
      
      // Store current user email for profile setup
      localStorage.setItem('currentUserEmail', formData.email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // On successful registration, redirect to email verification
      navigate('/verify-email', { 
        state: { 
          email: formData.email,
          fromRegistration: true 
        } 
      });
      
    } catch (error) {
      console.error('Registration failed:', error);
      
      // Simulate different types of server errors for demo
      const errorType = Math.random();
      
      if (errorType < 0.3) {
        // Simulate server error
        setErrors({ general: 'Server error occurred. Please try again later.' });
      } else if (errorType < 0.6) {
        // Simulate network error
        setErrors({ general: 'Network error. Please check your connection and try again.' });
      } else {
        // Generic error
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      setIsLoading(true);
      console.log(`${provider} login clicked`);
      
      // Simulate brief authentication delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate getting user data from social provider
      const mockSocialData = {
        google: {
          name: 'John Doe',
          email: 'john.doe@gmail.com',
          picture: 'https://via.placeholder.com/150',
          provider: 'google'
        },
        facebook: {
          name: 'Jane Smith',
          email: 'jane.smith@facebook.com',
          picture: 'https://via.placeholder.com/150',
          provider: 'facebook'
        },
        github: {
          name: 'Dev User',
          email: 'dev.user@github.com',
          picture: 'https://via.placeholder.com/150',
          provider: 'github'
        }
      };
      
      const socialUserData = mockSocialData[provider as keyof typeof mockSocialData];
      
      // Store social login data temporarily
      localStorage.setItem('tempSocialUser', JSON.stringify(socialUserData));
      
      // Redirect to validation success screen
      navigate('/social-login-validation', {
        state: {
          provider: provider
        }
      });
      
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      alert(`Failed to login with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex">
      {/* Mobile-first single column layout */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 lg:space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6">
              <img 
                src={logoSmall} 
                alt="BaoAfrik Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-display text-xl sm:text-2xl text-gray-900 mb-2">
              Sign Up
            </h2>
            <p className="text-body text-gray-500 text-sm px-2">
              Please fill in your information to connect to BaoAfrik
            </p>
          </div>
          
          <form className="mt-6 sm:mt-8 space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 sm:space-y-5">
              <div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Phone number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>
              
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  pattern="^(?=.*[a-zA-Z])(?=.*\d).{8,}$"
                  disabled={isLoading}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              <div>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    disabled={isLoading}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Sign Up'
                )}
              </button>
            </div>

            <div className="text-center">
              <span className="text-gray-400 text-sm">Or sign up with</span>
            </div>

            {/* Social Login Buttons */}
            <div className="flex justify-center space-x-4 sm:space-x-6">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24">
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
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('github')}
                disabled={isLoading}
                className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </button>
            </div>

            <div className="text-center">
              <span className="text-gray-500 text-sm">Already have an account? </span>
              <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Illustration - Hidden on mobile */}
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
        </div>
      </div>
    </div>
  );
};

export default Register;
