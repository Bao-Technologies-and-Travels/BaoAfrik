import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { UpdateProfileData, apiClient } from '../../services/api';
import { s3Service } from '../../services/s3Service';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import logoSmall from '../../assets/images/logos/ba-brand-icon-colored.png';
import logoFull from '../../assets/images/logos/ba-Primary-brand-logo-colored.png';
import lilLogo from '../../assets/images/pre/lil.png';

// Types for better type safety
interface FormData {
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  gender?: string;
  birthDate?: string;
  general?: string;
}

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const auth = useAuth();
  const { addToast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // State management
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: '',
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [initialData, setInitialData] = useState<FormData & { profileImage: string }>({
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: '',
    profileImage: '',
  });

  // Memoized validation
  const isFormValid = useCallback((): boolean => {
    return Boolean(
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.gender &&
      formData.birthDate
    );
  }, [formData]);

  // check if changes have been made to the user data
  const hasChanges = useCallback((): boolean => {
    return (
      formData.firstName !== initialData.firstName ||
      formData.lastName !== initialData.lastName ||
      formData.gender !== initialData.gender ||
      formData.birthDate !== initialData.birthDate ||
      profileImage !== initialData.profileImage
    );
  }, [formData, initialData, profileImage]);

  // Date formatting utility
  const formatDateForInput = useCallback((dateString: string): string => {
    if (!dateString) return '';

    try {
      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }

      // Otherwise parse the date and format properly
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';

      // Use local date components to avoid timezone issues
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      return `${year}-${month}-${day}`;
    } catch (error) {
      return '';
    }
  }, []);

  // fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.getCurrentUser();
        if (response.success && response.data) {
          const userData = response.data;
          const birthDateStr = formatDateForInput(userData.birthDate || '');

          const newFormData: FormData = {
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            gender: userData.gender || '',
            birthDate: birthDateStr,
          };

          setFormData(newFormData);
          setInitialData({
            ...newFormData,
            profileImage: userData.profileImage || '',
          });

          if (userData.profileImage) {
            setProfileImage(userData.profileImage);
            setExistingImageUrl(userData.profileImage);
          }
        }
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Data Loading Error',
          message: 'Failed to load your profile data. Please refresh the page.',
          duration: 3000,
        });
      }
    };

    fetchUserData();
  }, [addToast, formatDateForInput]);

  // Input handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      setFormData(prev => ({
        ...prev,
        birthDate: dateString,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        birthDate: '',
      }));
    }

    if (errors.birthDate) {
      setErrors(prev => ({
        ...prev,
        birthDate: '',
      }));
    }
  };

  // Image handling
  const validateImageFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return 'Please select a valid image (JPEG, PNG, GIF)';
    }

    if (file.size > maxSize) {
      return 'Image size must be less than 5MB';
    }

    return null;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setErrors(prev => ({ ...prev, general: validationError }));
      return;
    }

    setSelectedFile(file);
    setImageRemoved(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileImage(event.target?.result as string);
    };
    reader.onerror = () => {
      setErrors(prev => ({
        ...prev,
        general: 'Failed to read image file',
      }));
    };
    reader.readAsDataURL(file);

    // Clear general error
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = async () => {
    try {
      setProfileImage(null);
      setSelectedFile(null);
      setImageRemoved(true);

      // Only delete from S3 if we have an existing URL
      if (existingImageUrl && existingImageUrl.includes('amazonaws.com')) {
        await s3Service.deleteFile(existingImageUrl);
      }

      setExistingImageUrl(null);

      if (errors.general) {
        setErrors(prev => ({ ...prev, general: '' }));
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        general: 'Failed to remove image from storage',
      }));
    }
  };

  // Image upload to S3
  const uploadImageToS3 = async (): Promise<string | null> => {
    if (!selectedFile || !user) return null;

    setIsUploadingImage(true);
    try {
      const { uploadUrl, fileUrl } = await s3Service.getPresignedUrlForProfile(
        selectedFile,
        user.id
      );

      await s3Service.uploadFile(selectedFile, uploadUrl);
      return fileUrl;
    } catch (error) {
      throw new Error('Failed to upload image to storage');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = 'First name can only contain letters';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = 'Last name can only contain letters';
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    // Birth date validation
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
        newErrors.birthDate = 'Birth date cannot be in the future';
      } else if (age < 13) {
        newErrors.birthDate = 'You must be at least 13 years old to use this platform';
      } else if (age > 120) {
        newErrors.birthDate = 'Please enter a valid birth date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If no changes, navigate away
    if (!hasChanges()) {
      addToast({
        type: 'info',
        title: 'Profile unchanged',
        message: 'No changes were made to your profile.',
        duration: 3000
      });
      navigate('/');
      return;
    }

    // Validate form
    if (!validateForm()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fix the errors in the form before submitting.',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      let imageUrl: string | null = null;

      // Handle image upload/removal
      if (selectedFile) {
        // Upload new image
        imageUrl = await uploadImageToS3();

        // Delete old image if it exists and is different from new one
        if (existingImageUrl && existingImageUrl !== imageUrl) {
          await s3Service.deleteFile(existingImageUrl);
        }
      } else if (imageRemoved) {
        // Image was removed
        imageUrl = null;
        if (existingImageUrl) {
          await s3Service.deleteFile(existingImageUrl);
        }
      } else {
        // Keep existing image
        imageUrl = existingImageUrl;
      }

      // Prepare profile data
      const profileData: UpdateProfileData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        gender: formData.gender,
        birthDate: formData.birthDate,
        profileImage: imageUrl,
      };

      // API call
      const response = await apiClient.updateProfile(profileData);

      if (!response.success) {
        // Handle API validation errors
        if (response.errors) {
          const apiErrors: FormErrors = {};
          Object.entries(response.errors).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              apiErrors[key as keyof FormErrors] = value.join(', ');
            } else if (typeof value === 'string') {
              apiErrors[key as keyof FormErrors] = value;
            }
          });
          setErrors(apiErrors);
          throw new Error('Please fix the validation errors');
        } else {
          throw new Error(response.message || 'Failed to update profile');
        }
      }

      // fetch updated user data from API after successfully making changes
      try {
        const userResponse = await apiClient.getCurrentUser();

        if (userResponse.success && userResponse.data) {
          const updatedUser = userResponse.data;

          if (typeof (auth as any).setUser === 'function') {
            (auth as any).setUser(updatedUser);
          } else if (typeof (auth as any).refreshUser === 'function') {
            (auth as any).refreshUser(updatedUser);
          }

          try {
            localStorage.setItem('user', JSON.stringify(updatedUser));
          } catch (e) { }

          const event = new CustomEvent('userProfileUpdated', {
            detail: { user: updatedUser, timestamp: Date.now() }
          });
          window.dispatchEvent(event);
        }
      } catch (fetchError) {
        console.warn('Failed to fetch updated user data:', fetchError);
      }

      addToast({
        type: 'success',
        title: 'Profile updated',
        message: 'Changes made successfully.',
        duration: 2000,
      });

      // redirect to home and force refresh
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (error: any) {

      let toastMessage = 'Failed to update profile. Please try again.';
      let toastTitle = 'Update Failed';

      if (error.message.includes('S3') || error.message.includes('storage')) {
        toastTitle = 'Image Error';
        toastMessage = 'Failed to process image. Please try again.';
      } else if (error.message.includes('validation')) {
        toastTitle = 'Validation Error';
        toastMessage = 'Please check the form for errors and try again.';
      }

      addToast({
        type: 'error',
        title: toastTitle,
        message: toastMessage,
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasExistingData = Boolean(
    user?.firstName || user?.lastName || user?.gender || user?.birthDate || user?.profileImage
  );

  const currentBirthDate = formData.birthDate ?
    (() => {
      const [year, month, day] = formData.birthDate.split('-').map(Number);
      return new Date(year, month - 1, day);
    })() :
    null;

  return (
    <div className='min-h-screen bg-white flex flex-col'>
      {/* Desktop Header */}
      <div className='hidden lg:block absolute top-0 left-0 right-0 bg-orange-50 py-4 px-8 border-b-2 border-orange-200'>
        <div className='flex items-center justify-between'>
          <Link to='/' aria-label='Go to homepage'>
            <img
              src={logoFull}
              alt='BaoAfrik Logo'
              className='h-8 object-contain'
            />
          </Link>
          <button
            className='p-2 rounded-lg hover:bg-orange-100 transition-colors'
            aria-label='Menu'
          >
            <svg className='w-6 h-6 text-orange-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-8 lg:pt-16'>
        <div className='w-full max-w-2xl'>
          {/* Mobile Logo */}
          <div className='lg:hidden bg-white -mx-4 px-4 py-6 mb-8'>
            <div className='text-center'>
              <div className='mx-auto w-16 h-16 mb-6'>
                <img
                  src={logoSmall}
                  alt='BaoAfrik Logo'
                  className='w-full h-full object-contain'
                />
              </div>
            </div>
          </div>

          <h1 className='text-2xl font-medium text-gray-900 mb-6 mt-16 text-center'>
            Profile Information
          </h1>

          {/* Error Display */}
          {errors.general && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg' role='alert'>
              <p className='text-red-600 text-sm'>{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-6' noValidate>
            <div className='flex flex-col lg:flex-row gap-16'>
              {/* Profile Image Section */}
              <div className='w-full lg:w-2/5 flex items-center justify-center'>
                <div className='bg-blue-50 rounded-2xl p-8 flex flex-col items-center justify-center w-80 h-80'>
                  <div
                    className='w-40 h-40 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 cursor-pointer hover:bg-blue-200 transition-colors relative overflow-hidden'
                    onClick={handleImageClick}
                    role='button'
                    aria-label={profileImage ? 'Change profile photo' : 'Add profile photo'}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleImageClick();
                      }
                    }}
                  >
                    {profileImage ? (
                      <>
                        <img
                          src={profileImage}
                          alt='Profile'
                          className='w-full h-full object-cover rounded-2xl'
                        />
                        <div className='absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center'>
                          <svg
                            className='w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
                            />
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
                            />
                          </svg>
                        </div>
                      </>
                    ) : (
                      <svg
                        className='w-20 h-20 text-blue-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1.5}
                          d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                        />
                      </svg>
                    )}
                    {isUploadingImage && (
                      <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-2xl'>
                        <LoadingSpinner size='sm' color='white' />
                      </div>
                    )}
                  </div>
                  <div className='flex items-center gap-2 flex-wrap justify-center'>
                    <p className='text-base text-gray-500 text-center whitespace-nowrap'>
                      {profileImage ? 'Change profile photo' : 'Add a profile photo'}
                    </p>
                    {profileImage && (
                      <button
                        type='button'
                        onClick={handleRemoveImage}
                        className='text-red-500 hover:text-red-700 text-sm underline'
                        disabled={isUploadingImage}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/jpeg,image/jpg,image/png,image/gif'
                    onChange={handleImageUpload}
                    className='hidden'
                    aria-label='Profile image upload'
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className='w-full lg:w-3/5 space-y-6'>
                {/* First Name */}
                <div>
                  <label
                    htmlFor='firstName'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    First Name
                  </label>
                  <input
                    type='text'
                    id='firstName'
                    name='firstName'
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-5 py-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 ${errors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder='Enter your first name'
                    required
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  />
                  {errors.firstName && (
                    <p id='firstName-error' className='mt-1 text-sm text-red-600'>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor='lastName'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Last Name
                  </label>
                  <input
                    type='text'
                    id='lastName'
                    name='lastName'
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-5 py-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 ${errors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder='Enter your last name'
                    required
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  />
                  {errors.lastName && (
                    <p id='lastName-error' className='mt-1 text-sm text-red-600'>
                      {errors.lastName}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label
                    htmlFor='gender'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Gender
                  </label>
                  <div className='relative'>
                    <select
                      id='gender'
                      name='gender'
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`w-full px-5 py-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 appearance-none cursor-pointer ${errors.gender ? 'border-red-300' : 'border-gray-300'
                        }`}
                      required
                      aria-invalid={!!errors.gender}
                      aria-describedby={errors.gender ? 'gender-error' : undefined}
                    >
                      <option value=''>Select your gender</option>
                      <option value='male'>Male</option>
                      <option value='female'>Female</option>
                      <option value='other'>Other</option>
                      <option value='prefer-not-to-say'>Prefer not to say</option>
                    </select>
                    <div className='absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none'>
                      <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                      </svg>
                    </div>
                  </div>
                  {errors.gender && (
                    <p id='gender-error' className='mt-1 text-sm text-red-600'>
                      {errors.gender}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label
                    htmlFor='birthDate'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Date of Birth
                  </label>
                  <div className={`flex items-center justify-between border rounded-2xl px-4 min-h-[60px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent ${errors.birthDate ? 'border-red-300' : 'border-gray-300'
                    }`}>
                    <DatePicker
                      id='birthDate'
                      selected={currentBirthDate}
                      onChange={handleDateChange}
                      dateFormat='dd-MM-yyyy'
                      placeholderText='DD-MM-YYYY'
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode='select'
                      scrollableYearDropdown
                      maxDate={new Date()}
                      shouldCloseOnSelect
                      showPopperArrow={false}
                      autoComplete='bday'
                      className='flex-1 bg-transparent text-base outline-none placeholder:text-gray-400 cursor-text w-full'
                      aria-invalid={!!errors.birthDate}
                      aria-describedby={errors.birthDate ? 'birthDate-error' : undefined}
                      calendarStartDay={1}
                      onChangeRaw={(e) => {
                        if (!e || typeof e !== 'object' || !e.target) return;

                        const input = e.target as HTMLInputElement;
                        const originalValue = input.value;

                        if (originalValue && /^[0-9-]*$/.test(originalValue)) {
                          let value = originalValue.replace(/\D/g, ''); // Remove all non-digits

                          // Auto-format with hyphens: DD-MM-YYYY
                          if (value.length > 4) {
                            value = `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4, 8)}`;
                          } else if (value.length >= 2) {
                            value = `${value.slice(0, 2)}-${value.slice(2)}`;
                          }

                          if (value !== originalValue) {
                            input.value = value;
                          }

                          // Parse the formatted date when complete
                          if (value.length === 10) {
                            const [day, month, year] = value.split('-').map(Number);
                            if (day && month && year) {
                              const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                              setFormData(prev => ({ ...prev, birthDate: dateString }));

                              // Clear error if any
                              if (errors.birthDate) {
                                setErrors(prev => ({ ...prev, birthDate: '' }));
                              }
                              return;
                            }
                          }

                          setFormData(prev => ({ ...prev, birthDate: '' }));
                        }
                      }}
                      onKeyDown={(e) => {
                        const input = e.target as HTMLInputElement;
                        const cursorPosition = input.selectionStart;
                        const value = input.value;

                        // Allow navigation and deletion keys
                        const allowedKeys = [
                          'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
                          'Tab', 'Home', 'End', 'Enter'
                        ];

                        if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                          e.preventDefault();
                          return;
                        }

                        // allow delete of hyphens
                        if (e.key === 'Backspace') {
                          if (cursorPosition === 3 || cursorPosition === 6) {
                            const newValue = value.slice(0, cursorPosition - 2) + value.slice(cursorPosition);
                            input.value = newValue;
                            setFormData(prev => ({ ...prev, birthDate: '' }));
                            input.setSelectionRange(cursorPosition - 2, cursorPosition - 2);
                            e.preventDefault();
                          }
                        }
                      }}
                      onBlur={(e) => {
                        const input = e.target as HTMLInputElement;
                        const value = input.value;

                        if (value.length > 0) {
                          if (value.length === 10) {
                            const [inputDay, inputMonth, inputYear] = value.split('-').map(Number);

                            if (inputDay && inputMonth && inputYear &&
                              inputDay >= 1 && inputDay <= 31 &&
                              inputMonth >= 1 && inputMonth <= 12 &&
                              inputYear >= 1900) {

                              const date = new Date(inputYear, inputMonth - 1, inputDay);
                              const today = new Date();

                              if (isNaN(date.getTime()) || date.getDate() !== inputDay) {
                                setErrors(prev => ({
                                  ...prev,
                                  birthDate: 'Please enter a valid date'
                                }));
                              } else if (date > today) {
                                setErrors(prev => ({
                                  ...prev,
                                  birthDate: 'Birth date cannot be in the future'
                                }));
                              } else {
                                const dateString = `${inputYear}-${inputMonth.toString().padStart(2, '0')}-${inputDay.toString().padStart(2, '0')}`;
                                setFormData(prev => ({ ...prev, birthDate: dateString }));

                                if (errors.birthDate) {
                                  setErrors(prev => ({ ...prev, birthDate: '' }));
                                }
                              }
                            } else {
                              setErrors(prev => ({
                                ...prev,
                                birthDate: 'Please enter a valid date in DD-MM-YYYY format'
                              }));
                            }
                          } else {
                            setFormData(prev => ({ ...prev, birthDate: '' }));
                            setErrors(prev => ({
                              ...prev,
                              birthDate: 'Please enter a complete date in DD-MM-YYYY format'
                            }));
                          }
                        } else {
                          if (errors.birthDate) {
                            setErrors(prev => ({ ...prev, birthDate: '' }));
                          }
                        }
                      }}
                      adjustDateOnChange={false}
                      useWeekdaysShort={false}
                      strictParsing
                    />

                    {/* Calendar Icon */}
                    <button
                      type='button'
                      onClick={() => document.getElementById('birthDate')?.focus()}
                      className='ml-3 text-gray-400 hover:text-blue-500 transition-colors duration-150 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                      aria-label='Open calendar'
                    >
                      <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-5 h-5'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                      </svg>
                    </button>
                  </div>
                  {errors.birthDate && (
                    <p id='birthDate-error' className='mt-1 text-sm text-red-600'>
                      {errors.birthDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className='pt-8 pb-8 md:pb-0'>
              <button
                type='submit'
                disabled={isLoading || !isFormValid() || isUploadingImage}
                className={`w-full py-3 rounded-lg font-medium transition-colors text-sm cursor-pointer text-white ${isFormValid() && !isLoading && !isUploadingImage
                  ? 'text-white bg-yellow-500 hover:bg-yellow-700 cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {isLoading || isUploadingImage ? (
                  <div className='flex items-center justify-center'>
                    <LoadingSpinner size='sm' color='white' className='mr-2' />
                    <span>
                      {isUploadingImage ? 'Uploading image...' : 'Saving information...'}
                    </span>
                  </div>
                ) : hasExistingData ? (
                  'Update Profile'
                ) : (
                  'Save Information'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className='hidden lg:block py-6 px-4'>
        <div className='border-t border-gray-200 pt-4'>
          <div className='flex items-center justify-between text-xs text-gray-400'>
            <div className='flex items-center space-x-1'>
              <img src={lilLogo} alt='BaoAfrik' className='w-4 h-4' />
              <span>© All rights reserved</span>
            </div>
            <div className='flex items-center space-x-4'>
              <Link to='/contact' className='hover:text-gray-600'>
                Contact Us
              </Link>
              <span>|</span>
              <Link to='/terms' className='hover:text-gray-600'>
                Terms and conditions of use
              </Link>
              <span>|</span>
              <Link to='/privacy' className='hover:text-gray-600'>
                Privacy policies
              </Link>
              <span>|</span>
              <Link to='/cookies' className='hover:text-gray-600'>
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;