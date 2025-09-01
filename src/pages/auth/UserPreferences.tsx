import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logoSmall from '../../assets/images/logos/ba-brand-icon-colored.png';
import logoFull from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const UserPreferences: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherDescription, setOtherDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const reasons = [
    { id: 'sell', label: 'Sell products', color: 'blue' },
    { id: 'buy', label: 'Buy products', color: 'orange' },
    { id: 'transport', label: 'Transport products', color: 'red' },
    { id: 'other', label: 'Other', color: 'green' }
  ];

  const handleReasonToggle = (reasonId: string) => {
    setSelectedReasons([reasonId]); // Only allow single selection
    setError('');
    
    if (reasonId === 'other') {
      setShowOtherInput(true);
    } else {
      setShowOtherInput(false);
      setOtherDescription('');
    }
  };

  const validateOtherDescription = (description: string): boolean => {
    const trimmed = description.trim().toLowerCase();
    
    // Check if description is too short
    if (trimmed.length < 10) {
      return false;
    }
    
    // Check for inappropriate content (basic validation)
    const inappropriateWords = ['spam', 'test', 'nothing', 'idk', 'dunno'];
    if (inappropriateWords.some(word => trimmed.includes(word))) {
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedReasons.length === 0) {
      setError('Please select a reason');
      return;
    }

    // Validate 'other' description if selected
    if (selectedReasons.includes('other')) {
      if (!otherDescription.trim()) {
        setError('Please provide a description');
        return;
      }
      
      if (!validateOtherDescription(otherDescription)) {
        setError('Please provide a more detailed and appropriate description (minimum 10 characters)');
        return;
      }
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement user preferences API call
      console.log('Saving user preferences:', {
        reasons: selectedReasons,
        description: selectedReasons.includes('other') ? otherDescription : null
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Complete user registration by logging them in with stored profile data
      const storedUser = JSON.parse(localStorage.getItem('tempUserProfile') || '{}');
      login({
        id: '1',
        name: storedUser.name || 'User',
        email: storedUser.email || 'user@example.com',
        profileImage: storedUser.profileImage
      });
      
      // Clear temporary storage
      localStorage.removeItem('tempUserProfile');
      
      // On success, redirect to home page
      navigate('/');
      
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = selectedReasons.length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 sm:px-6 lg:px-8">
      {/* Desktop Logo - Top Left with Background */}
      <div className="hidden lg:block absolute top-0 left-0 right-0 bg-orange-50 py-4 px-8">
        <img 
          src={logoFull} 
          alt="BaoAfrik Logo" 
          className="h-8 object-contain"
        />
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl">
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
          
          {/* Back Arrow */}
          <div className="flex justify-start mb-4">
            <button
              onClick={() => navigate('/profile-setup')}
              className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          <h1 className="text-xl sm:text-2xl font-medium text-gray-900 mb-6 sm:mb-8 px-2">
            Why do you want to join BaoAfrik?
          </h1>
          
          <div className="flex items-center justify-end mb-6 sm:mb-8">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              2
            </div>
          </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Reason Options */}
          <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {reasons.slice(0, 2).map((reason) => {
                const isSelected = selectedReasons.includes(reason.id);
                const getBorderColor = () => {
                  if (reason.color === 'blue') return isSelected ? 'border-blue-400' : 'border-blue-200';
                  if (reason.color === 'orange') return isSelected ? 'border-orange-400' : 'border-orange-200';
                  return 'border-gray-200';
                };
                const getIcon = () => {
                  if (reason.id === 'sell') return (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  );
                  if (reason.id === 'buy') return (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                  );
                  return null;
                };
                
                return (
                  <button
                    key={reason.id}
                    type="button"
                    onClick={() => handleReasonToggle(reason.id)}
                    className={`flex-1 p-3 sm:p-4 border-2 rounded-xl flex items-center space-x-2 sm:space-x-3 transition-all duration-200 ${getBorderColor()} hover:shadow-sm min-h-[50px] sm:min-h-[60px]`}
                  >
                    {getIcon()}
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      {reason.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {reasons.slice(2, 4).map((reason) => {
                const isSelected = selectedReasons.includes(reason.id);
                const getBorderColor = () => {
                  if (reason.color === 'red') return isSelected ? 'border-red-400' : 'border-red-200';
                  if (reason.color === 'green') return isSelected ? 'border-green-400' : 'border-green-200';
                  return 'border-gray-200';
                };
                const getIcon = () => {
                  if (reason.id === 'transport') return (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  );
                  return (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  );
                };
                
                return (
                  <button
                    key={reason.id}
                    type="button"
                    onClick={() => handleReasonToggle(reason.id)}
                    className={`flex-1 p-3 sm:p-4 border-2 rounded-xl flex items-center space-x-2 sm:space-x-3 transition-all duration-200 ${getBorderColor()} hover:shadow-sm min-h-[50px] sm:min-h-[60px]`}
                  >
                    {getIcon()}
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      {reason.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Other Description Input */}
          {showOtherInput && (
            <div className="mb-4 sm:mb-6">
              <label htmlFor="otherDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="otherDescription"
                value={otherDescription}
                onChange={(e) => setOtherDescription(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                rows={3}
                placeholder="Please describe your reason for joining BaoAfrik..."
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 sm:mb-6">
              <p className="text-red-500 text-sm text-center px-2">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className={`w-full font-medium py-3 sm:py-4 px-6 rounded-xl transition-colors duration-200 text-sm sm:text-base ${
              isFormValid && !isLoading
                ? 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="md" color="gray" className="mr-2" />
                <span className="text-sm sm:text-base">Finishing...</span>
              </div>
            ) : (
              <span className="text-sm sm:text-base">Finish Setup</span>
            )}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;
