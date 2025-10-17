import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logoSmall from '../../assets/images/logos/ba-brand-icon-colored.png';
import logoFull from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import lilLogo from '../../assets/images/pre/lil.png';
import { UpdateProfileData, apiClient } from '../../services/api';
import { s3Service } from '../../services/s3Service';
import { useToast } from '../../contexts/ToastContext';
import avatar from '../../assets/images/logos/avatar.png';

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, updateUserProfile, refreshUserProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: ''
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUpLoadingImage] = useState(false);

  // Track initial form data to detect changes
  const [initialFormData, setInitialFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: '',
  });

  // Form validation state
  const isFormValid =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.gender &&
    formData.birthDate;

  useEffect(() => {
    const initializeUserData = async () => {
      if (user) {
        let userData = user;

        if (!user.gender || !user.birthDate) {
          try {
            const response = await apiClient.getCurrentUser();
            if (response.success && response.data) {
              userData = response.data;
              updateUserProfile(response.data);
            }
          } catch (error) {
            console.error('Failed to fetch complete user profile:', error);
          }
        }

        const initialData = {
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          gender: userData.gender || '',
          birthDate: userData.birthDate ? formatDateForInput(userData.birthDate) : ''
        };

        setFormData(initialData);
        setInitialFormData(initialData);

        if (userData.profileImage) {
          setProfileImage(userData.profileImage);
          setExistingImageUrl(userData.profileImage);
        }
      }
    };

    initializeUserData();
  }, [user, updateUserProfile]);

  const hasFormChanges = () => {
    return (
      formData.firstName !== initialFormData.firstName ||
      formData.lastName !== initialFormData.lastName ||
      formData.gender !== initialFormData.gender ||
      formData.birthDate !== initialFormData.birthDate ||
      selectedFile !== null ||
      imageRemoved
    );
  };

  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return '';
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    } catch (error) {
      return '';
    }
  }

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
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5mb

      if (!validTypes.includes(file.type)) {
        setErrors(
          prev => ({
            ...prev, general: 'Please select a valid image (JPEG, PNG GIF)'
          }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(
          prev => ({
            ...prev, general: 'Image size must be less than 5MB'
          })
        );
        return;
      }

      setSelectedFile(file);
      setImageRemoved(false);

      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      if (errors.general) {
        setErrors(prev => ({
          ...prev, general: ''
        }));
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = async () => {
    try {
      setProfileImage(null);
      setSelectedFile(null);
      setExistingImageUrl(null);
      setImageRemoved(true);

      if (existingImageUrl && existingImageUrl.includes('amazonaws.com')) {
        await s3Service.deleteImage(existingImageUrl);
      }

      if (errors.general) {
        setErrors(prev => ({ ...prev, general: '' }));
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        general: 'Failed to remove image from storage'
      }));
    }
  };

  const uploadImageToS3 = async (): Promise<string | null> => {
    if (!selectedFile || !user) return null;

    setIsUpLoadingImage(true);
    try {
      const uploadResult = await s3Service.uploadImage(selectedFile, user.id);

      if (uploadResult.success && uploadResult.imageUrl) {
        return uploadResult.imageUrl;
      } else {
        throw new Error(uploadResult.error || 'Failed to upload image');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsUpLoadingImage(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

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
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (birthDate > today) {
        newErrors.birthDate = 'Birth date cannot be after today\'s date';
      } else if (age < 13) {
        newErrors.birthDate = 'You must be at least 13 years old to access the platform';
      } else if (age > 120) {
        newErrors.birthDate = 'Please enter a valid birth date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!hasFormChanges()) {
      addToast({
        type: 'info',
        title: 'No changes made',
        message: 'Nothing was modified, profile remains unchanged',
        duration: 3000,
      });

      setTimeout(() => {
        navigate('/');
      }, 3000);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const profileData: UpdateProfileData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        gender: formData.gender,
        birthDate: formData.birthDate,
      };

      if (selectedFile) {
        // Upload new image to S3
        const uploadedUrl = await uploadImageToS3();
        profileData.profileImage = uploadedUrl;

        // delete old image if it exists and is different from new one
        if (existingImageUrl && existingImageUrl !== uploadedUrl) {
          await s3Service.deleteImage(existingImageUrl);
        }
      } else if (imageRemoved) {
        if (existingImageUrl) {
          await s3Service.deleteImage(existingImageUrl);
        }
      }

      const response = await apiClient.updateProfile(profileData);

      if (!response.success) {
        if (response.errors) {
          const apiErrors: { [key: string]: string } = {};
          Object.entries(response.errors).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              apiErrors[key] = value.join(', ');
            } else if (typeof value === 'string') {
              apiErrors[key] = value;
            } else {
              apiErrors[key] = 'Invalid field value'
            }
          });
          setErrors(apiErrors);
          throw new Error('Please fix the validation errors');
        } else {
          throw new Error(response.message || 'Failed to update profile');
        }
      }

      addToast({
        type: 'success',
        title: 'Profile modified',
        message: 'Profile updated successfully. Redirecting automatically in 3 seeconds...',
        duration: 3000
      });

      setTimeout(() => {
        logout();
        navigate('/login');
      }, 3000)

    } catch (error: any) {
      if (error.message.includes('S3') || error.message.includes('storage')) {
        addToast({
          type: 'error',
          title: 'Image Error',
          message: 'Failed to process image. Please try again.',
          duration: 5000
        });
      } else if (error.message.includes('validation')) {
        addToast({
          type: 'error',
          title: 'Validation Error',
          message: 'Please fix the form errors and try again.',
          duration: 5000
        });
      } else {
        addToast({
          type: 'error',
          title: 'Update Failed',
          message: error.message || 'Failed to save profile information. Please try again.',
          duration: 5000
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasExistingData = user?.firstName || user?.lastName || user?.gender || user?.birthDate || user?.profileImage;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Desktop Header - Top Left with Background */}
      <div className="hidden lg:block absolute top-0 left-0 right-0 bg-orange-50 py-4 px-8 border-b-2 border-orange-200">
        <div className="flex items-center justify-between">
          <Link to="/">
            <img
              src={logoFull}
              alt="BaoAfrik Logo"
              className="h-8 object-contain"
            />
          </Link>
          <button className="p-2 rounded-lg hover:bg-orange-100 transition-colors">
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-8 lg:pt-16">
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

          <h1 className="text-2xl font-medium text-gray-900 mb-6 mt-16 text-center">
            Profile Information
          </h1>

          <div className="hidden sm:flex items-center justify-end mb-6">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              1
            </div>
          </div>

          {/* Display success message if any */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{successMessage}</p>
              {!user?.firstName && (
                <p className="text-green-600 text-sm mt-1">
                  You will be redirected to login in 3 seconds...
                </p>
              )}
            </div>
          )}

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
                  <div className="w-40 h-40 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 cursor-pointer hover:bg-blue-200 transition-colors relative overflow-hidden" onClick={handleImageClick}>
                    {profileImage ? (
                      <>
                        <img
                          src={profileImage || avatar}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                          <svg className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </>
                    ) : (
                      <svg className="w-20 h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-2xl">
                        <LoadingSpinner size="sm" color="white" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-base text-gray-500 text-center whitespace-nowrap">
                      {profileImage ? 'Change profile photo' : 'Add a profile photo'}
                    </p>
                    {profileImage && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                        className="ml-2 text-red-500 hover:text-red-700 text-sm underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
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
                    name="firstName"
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
                    name="lastName"
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
                    className="w-full px-6 py-5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50 cursor-pointer min-h-[60px]"
                    required
                  />
                  {errors.birthDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-8 pb-8 md:pb-0">
              <button
                type="submit"
                disabled={isLoading || !isFormValid || isUploadingImage}
                className={`w-full py-3 rounded-lg font-medium transition-colors text-sm cursor-pointer ${isFormValid && !isLoading && !isUploadingImage
                  ? 'text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                style={isFormValid && !isLoading && !isUploadingImage ? { backgroundColor: '#F9A825' } : {}}
              >
                {isLoading || isUploadingImage ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" color="white" className="mr-2" />
                    <span>{isUploadingImage ? 'Uploading image....' : 'Saving information'}</span>
                  </div>
                ) : (
                  hasExistingData ? 'Update Profile' : 'Save Information'
                )}
              </button>
            </div>
          </form>
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

export default ProfileSetup;
