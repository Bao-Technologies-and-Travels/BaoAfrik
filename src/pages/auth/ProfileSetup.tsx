import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logoSmall from '../../assets/images/logos/ba-brand-icon-colored.png';

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check if coming from social login
  const fromSocialLogin = location.state?.fromSocialLogin || false;
  const provider = location.state?.provider || null;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: ''
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // Load social login data if available
  useEffect(() => {
    if (fromSocialLogin) {
      const socialUserData = JSON.parse(localStorage.getItem('tempSocialUser') || '{}');
      if (socialUserData.name) {
        const nameParts = socialUserData.name.split(' ');
        setFormData(prev => ({
          ...prev,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || ''
        }));
      }
      if (socialUserData.profileImage) {
        setProfileImage(socialUserData.profileImage);
      }
    }
  }, [fromSocialLogin]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = 'First name can only contain letters';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = 'Last name can only contain letters';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        // age--;
      }
      
      if (birthDate > today) {
        newErrors.birthDate = 'Birth date cannot be in the future';
      } else if (age < 13) {
        newErrors.birthDate = 'You must be at least 13 years old';
      } else if (age > 120) {
        newErrors.birthDate = 'Please enter a valid birth date';
      }
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
      // TODO: Implement profile setup API call
      console.log('Setting up profile:', formData);
      
      // Store profile data temporarily for use after preferences
      let profileData;
      if (fromSocialLogin) {
        const socialUserData = JSON.parse(localStorage.getItem('tempSocialUser') || '{}');
        profileData = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: socialUserData.email || 'user@example.com',
          profileImage: profileImage || undefined,
          provider: provider
        };
      } else {
        // For regular registration, get user data from localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const currentUserEmail = localStorage.getItem('currentUserEmail'); // We'll set this during registration
        const currentUser = registeredUsers.find((u: any) => u.email === currentUserEmail);
        
        profileData = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: currentUser?.email || 'user@example.com',
          profileImage: profileImage || undefined
        };
        
        // Update the user's profile image in the registered users list
        if (currentUser) {
          currentUser.profileImage = profileImage;
          currentUser.name = `${formData.firstName} ${formData.lastName}`;
          localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        }
      }
      localStorage.setItem('tempUserProfile', JSON.stringify(profileData));
      
      // Update user profile with image
      updateUserProfile(profileData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // On success, redirect to questions page
      navigate('/user-preferences');
      
    } catch (error) {
      console.error('Profile setup failed:', error);
      setErrors({ general: 'Failed to save profile information. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 mb-6">
            <img 
              src={logoSmall} 
              alt="BaoAfrik Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-medium text-gray-900 mb-6">
            Profile Information
          </h1>
          <div className="flex items-center justify-end mb-8">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              1
            </div>
          </div>
        </div>

        {/* Display general error if any */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left side - Profile Photo */}
            <div className="w-full lg:w-1/2">
              <div className="bg-sky-100 rounded-2xl p-4 sm:p-6 lg:p-8 h-full flex flex-col items-center justify-center min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]">
                <div className="relative">
                  {profileImage ? (
                    <div className="relative">
                      <img
                        src={profileImage}
                        alt="Profile preview"
                        className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                      <svg className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 sm:mt-6 bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  {profileImage ? 'Change Photo' : 'Upload Photo'}
                </button>
              </div>
            </div>

            {/* Right side - Form Fields */}
            <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter your first name"
                  required
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter your last name"
                  required
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white"
                  required
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                )}
              </div>

              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  required
                />
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 gap-3 sm:gap-0">
            <button
              type="button"
              onClick={() => navigate('/user-preferences')}
              className="px-4 sm:px-6 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm sm:text-base order-2 sm:order-1"
            >
              Skip for now
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed text-sm sm:text-base order-1 sm:order-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span className="text-sm sm:text-base">Saving...</span>
                </div>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
