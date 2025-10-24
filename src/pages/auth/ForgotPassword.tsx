import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoSmall from '../../assets/images/logos/ba-brand-icon-colored.png';
import logoFull from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';
import lilLogo from '../../assets/images/pre/lil.png';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [emailNotFound, setEmailNotFound] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkEmailExists = (email: string): boolean => {
    // Check if email exists in registered users (localStorage mock)
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    return registeredUsers.some((user: any) => user.email.toLowerCase() === email.toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validate email
    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    setErrors({});
    setEmailNotFound(false);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if email exists in our mock database
      const emailExists = checkEmailExists(email);
      
      if (!emailExists) {
        // Email not found in system
        setEmailNotFound(true);
        setErrors({ email: 'No account found with this email address' });
        return;
      }
      
      // Email exists, proceed to reset verification
      console.log('Forgot password request for:', email);
      
      // Navigate to password reset verification page
      navigate('/reset-password-sent', { 
        state: { 
          email: email 
        } 
      });
    } catch (error) {
      console.error('Forgot password failed:', error);
      setErrors({ general: 'Failed to send reset email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Desktop Logo - Top Left with Background */}
      <div className="hidden lg:block absolute top-0 left-0 right-0 bg-orange-50 py-4 px-8 border-b-2 border-orange-200">
        <div className="flex items-center justify-between">
          <Link to="/">
            <img 
              src={logoFull} 
              alt="BaoAfrik Logo" 
              className="h-8 object-contain cursor-pointer"
            />
          </Link>
          <button className="p-2 rounded-lg hover:bg-orange-100 transition-colors">
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
               <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors bg-white border border-gray-200">
                 <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                 </svg>
               </button>
             </div>
           </div>

          {/* Main content with border and shadow */}
          <div className="bg-white border-0 lg:border border-gray-200 rounded-lg shadow-none lg:shadow-lg p-8 mt-0 lg:mt-16">
            <div className="text-left lg:text-center mb-8">
              {/* Profile Mail Icon - Hidden on mobile */}
              <div className="hidden lg:block mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              <h1 className="text-2xl font-medium text-gray-900 mb-3">
                Profile Mail
              </h1>
              <p className="text-gray-500 text-sm px-0 lg:px-4">
                Please enter the email address associated with your BAO Afrik profile.
              </p>
            </div>

            {/* Display general error if any */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                onMouseEnter={(e) => (e.target as HTMLInputElement).focus()}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
                required
                disabled={isLoading}
                autoFocus
              />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-200 ${
                    email.trim() && !isLoading
                      ? 'text-white'
                      : 'bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-700'
                  }`}
                  style={email.trim() && !isLoading ? { backgroundColor: '#F9A825' } : {}}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="md" color={email.trim() ? 'white' : 'gray'} className="mr-2" />
                      Sending...
                    </div>
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </form>

            {/* Email not found message and sign up link */}
            {emailNotFound && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-red-800 font-medium">Account Not Found</p>
                </div>
                <p className="text-red-700 text-sm mb-3">
                  We couldn't find an account associated with this email address.
                </p>
                <p className="text-red-700 text-sm mb-4">
                  Would you like to create a new account instead?
                </p>
                <Link 
                  to="/register" 
                  className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Footer - Hidden on mobile */}
      <div className="hidden lg:block py-6 px-4">
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
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

export default ForgotPassword;
