import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logoSmall from '../../assets/images/logos/ba-brand-icon-colored.png';
import logoFull from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';

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

  // Form validation state
  const isFormValid = formData.firstName.trim() && 
                     formData.lastName.trim() && 
                     formData.gender && 
                     formData.birthDate;

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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Desktop Logo - Top Left */}
      <div className="hidden lg:block absolute top-6 left-8">
        <img 
          src={logoFull} 
          alt="BaoAfrik Logo" 
          className="h-8 object-contain"
        />
      </div>
      
      <div className="w-full max-w-lg">
        {/* Mobile Logo - Centered */}
        <div className="lg:hidden text-center mb-8">
          <div className="mx-auto w-16 h-16 mb-6">
            <img 
              src={logoSmall} 
              alt="BaoAfrik Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        <h1 className="text-2xl font-medium text-gray-900 mb-12 mt-16 text-center">
          Profile Information
        </h1>

        {/* Display general error if any */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left side - Profile Image */}
            <div className="w-full lg:w-2/5 flex items-center justify-center">
              <div className="bg-blue-50 rounded-2xl p-16 flex flex-col items-center justify-center w-80 h-80">
                <div className="w-40 h-40 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => fileInputRef.current?.click()}>
                  <svg className="w-20 h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-base text-gray-500 text-center whitespace-nowrap">Add a profile photo</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Right side - Form Fields */}
            <div className="w-full space-y-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
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
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
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
                <div className="relative">
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
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
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 cursor-pointer"
                  required
                />
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={`w-full py-3 rounded-lg font-medium transition-colors text-sm cursor-pointer ${
                isFormValid && !isLoading
                  ? 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                  <span>Saving information...</span>
                </div>
              ) : (
                'Save Information'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
