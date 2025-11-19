import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import logo from '../assets/images/pre/logo.png';
import shippxIcon from '../assets/images/pre/shippx.svg';
import locIcon from '../assets/images/pre/Loc.svg';
import imageIcon from '../assets/images/pre/image.svg';
import draftsIcon from '../assets/images/pre/drafts.svg';
import draft2Icon from '../assets/images/pre/draft2.svg';
import flyIcon from '../assets/images/pre/fly.svg';
import basketIcon from '../assets/images/pre/basket.png';
import avatarIcon from '../assets/images/pre/avatar.png';
import notificationIcon from '../assets/images/pre/notification.svg';
import translationToggleIcon from '../assets/images/pre/tt.svg';
import arrowLeftIcon from '../assets/images/pre/arrow-left.svg';
import messageIcon from '../assets/images/pre/message.svg';
import boxIcon from '../assets/images/pre/box.svg';
import groupIcon from '../assets/images/pre/group.svg';
import frameIcon from '../assets/images/pre/frame.svg';
import podsIcon from '../assets/images/pre/pods.svg';
import settingIcon from '../assets/images/pre/setting.svg';
import pathIcon from '../assets/images/pre/Path.svg';
import path2Icon from '../assets/images/pre/path2.svg';
import loadIcon from '../assets/images/pre/load.svg';
import { useAuth } from "../contexts/AuthContext";
import { useToast } from '../contexts/ToastContext';
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { add } from 'date-fns';

const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState('');
  const [origin, setOrigin] = useState('');
  const [saleType, setSaleType] = useState('Default');
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [location, setLocation] = useState('London, United Kingdom');
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isOriginDropdownOpen, setIsOriginDropdownOpen] = useState(false);
  const [isSaleTypeDropdownOpen, setIsSaleTypeDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [draggedImagesTotal, setDraggedImagesTotal] = useState(0);
  const [currentDraggedImageIndex, setCurrentDraggedImageIndex] = useState(0);
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const [productData, setProductData] = useState<any>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const { addToast } = useToast();

  // Check if all required fields are filled
  const isFormComplete = title.trim() !== '' &&
    description.trim() !== '' &&
    price.trim() !== '' &&
    quantity > 0 &&
    category !== '' &&
    origin !== '' &&
    (isEditMode || imageUrls.length > 0);

  useEffect(() => {
    if (isEditMode && id) {
      fetchProductData(id);
    }
  }, [isEditMode, id]);

  const validateRequiredFields = (): boolean => {
    const missing: string[] = [];
    if (!category || category.trim() === '') missing.push('Category');

    if (missing.length > 0) {
      addToast({
        type: 'error',
        title: 'Please complete required fields',
        message: `Please select: ${missing.join(', ')}`,
        duration: 2000
      });
      return false;
    }
    return true;
  };

  const fetchProductData = async (productId: string) => {
    setIsLoadingProduct(true);
    try {
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }

      const result = await response.json();

      if (result.success) {
        const product = result.data;
        setProductData(product);

        setTitle(product.title || '');
        setDescription(product.description || '');
        setPrice(product.price?.toString() || '');
        setCurrency(product.currency || 'USD');
        setQuantity(product.quantity || 1);
        setCategory(product.category || '');
        setOrigin(product.origin || '');
        setSaleType(product.saleType || 'Default');
        setDeliveryAvailable(product.deliveryAvailable || false);
        setLocation(product.location || 'London, United Kingdom');

        if (product.images && product.images.length > 0) {
          const existingImageUrls = product.images.map((img: any) => img.url);
          setImageUrls(existingImageUrls);

          const primaryIndex = product.images.findIndex((img: any) => img.isPrimary);
          setPrimaryImageIndex(primaryIndex >= 0 ? primaryIndex : 0);
        }
      }
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to load",
        message: "Unable to retrieve product data. Please check your internet connection.",
        duration: 3000
      });
      navigate('/my-listings');
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const categories = [
    { value: 'beauty', label: 'Beauty & Wellness' },
    { value: 'books', label: 'Books & Media' },
    { value: 'fashion', label: 'Fashion & Textiles' },
    { value: 'food', label: 'Foods & Spices' },
    { value: 'home', label: 'Home & Decor' }
  ];

  const saleTypes = [
    { value: 'Default', label: 'Default' },
    { value: 'Urgent', label: 'Urgent', icon: pathIcon }
  ];

  const currencies = [
    { value: 'USD', label: 'US Dollar', flagCode: 'us' },
    { value: 'CAD', label: 'Canadian Dollar', flagCode: 'ca' },
    { value: 'GBP', label: 'Pound Sterling', flagCode: 'gb' },
    { value: 'EUR', label: 'Euro', flagCode: 'eu' }
  ];

  const countries = [
    { value: 'algeria', label: 'Algeria', flagCode: 'dz' },
    { value: 'angola', label: 'Angola', flagCode: 'ao' },
    { value: 'benin', label: 'Benin', flagCode: 'bj' },
    { value: 'botswana', label: 'Botswana', flagCode: 'bw' },
    { value: 'burkina-faso', label: 'Burkina Faso', flagCode: 'bf' },
    { value: 'burundi', label: 'Burundi', flagCode: 'bi' },
    { value: 'cabo-verde', label: 'Cabo Verde', flagCode: 'cv' },
    { value: 'cameroon', label: 'Cameroon', flagCode: 'cm' },
    { value: 'central-african-republic', label: 'Central African Republic', flagCode: 'cf' },
    { value: 'chad', label: 'Chad', flagCode: 'td' },
    { value: 'comoros', label: 'Comoros', flagCode: 'km' },
    { value: 'congo-brazzaville', label: 'Congo (Brazzaville)', flagCode: 'cg' },
    { value: 'congo-kinshasa', label: 'Congo (Kinshasa)', flagCode: 'cd' },
    { value: 'cote-divoire', label: "Côte d'Ivoire", flagCode: 'ci' },
    { value: 'djibouti', label: 'Djibouti', flagCode: 'dj' },
    { value: 'egypt', label: 'Egypt', flagCode: 'eg' },
    { value: 'equatorial-guinea', label: 'Equatorial Guinea', flagCode: 'gq' },
    { value: 'eritrea', label: 'Eritrea', flagCode: 'er' },
    { value: 'eswatini', label: 'Eswatini', flagCode: 'sz' },
    { value: 'ethiopia', label: 'Ethiopia', flagCode: 'et' },
    { value: 'gabon', label: 'Gabon', flagCode: 'ga' },
    { value: 'gambia', label: 'Gambia', flagCode: 'gm' },
    { value: 'ghana', label: 'Ghana', flagCode: 'gh' },
    { value: 'guinea', label: 'Guinea', flagCode: 'gn' },
    { value: 'guinea-bissau', label: 'Guinea-Bissau', flagCode: 'gw' },
    { value: 'kenya', label: 'Kenya', flagCode: 'ke' },
    { value: 'lesotho', label: 'Lesotho', flagCode: 'ls' },
    { value: 'liberia', label: 'Liberia', flagCode: 'lr' },
    { value: 'libya', label: 'Libya', flagCode: 'ly' },
    { value: 'madagascar', label: 'Madagascar', flagCode: 'mg' },
    { value: 'malawi', label: 'Malawi', flagCode: 'mw' },
    { value: 'mali', label: 'Mali', flagCode: 'ml' },
    { value: 'mauritania', label: 'Mauritania', flagCode: 'mr' },
    { value: 'mauritius', label: 'Mauritius', flagCode: 'mu' },
    { value: 'morocco', label: 'Morocco', flagCode: 'ma' },
    { value: 'mozambique', label: 'Mozambique', flagCode: 'mz' },
    { value: 'namibia', label: 'Namibia', flagCode: 'na' },
    { value: 'niger', label: 'Niger', flagCode: 'ne' },
    { value: 'nigeria', label: 'Nigeria', flagCode: 'ng' },
    { value: 'rwanda', label: 'Rwanda', flagCode: 'rw' },
    { value: 'sao-tome-and-principe', label: 'São Tomé and Príncipe', flagCode: 'st' },
    { value: 'senegal', label: 'Senegal', flagCode: 'sn' },
    { value: 'seychelles', label: 'Seychelles', flagCode: 'sc' },
    { value: 'sierra-leone', label: 'Sierra Leone', flagCode: 'sl' },
    { value: 'somalia', label: 'Somalia', flagCode: 'so' },
    { value: 'south-africa', label: 'South Africa', flagCode: 'za' },
    { value: 'south-sudan', label: 'South Sudan', flagCode: 'ss' },
    { value: 'sudan', label: 'Sudan', flagCode: 'sd' },
    { value: 'tanzania', label: 'Tanzania', flagCode: 'tz' },
    { value: 'togo', label: 'Togo', flagCode: 'tg' },
    { value: 'tunisia', label: 'Tunisia', flagCode: 'tn' },
    { value: 'uganda', label: 'Uganda', flagCode: 'ug' },
    { value: 'zambia', label: 'Zambia', flagCode: 'zm' },
    { value: 'zimbabwe', label: 'Zimbabwe', flagCode: 'zw' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files || []);
      if (images.length + files.length <= 10) {
        files.forEach((file) => {
          setIsImageLoading(true);
          setUploadProgress(0);

          // Simulate realistic loading progress
          const reader = new FileReader();

          // Simulate progress updates with realistic timing
          let progress = 0;
          const progressInterval = setInterval(() => {
            progress += Math.random() * 15 + 5; // Random increment between 5-20
            if (progress > 100) progress = 100;
            setUploadProgress(Math.floor(progress));

            if (progress >= 100) {
              clearInterval(progressInterval);
            }
          }, 200); // Update every 200ms

          reader.onload = (event) => {
            setTimeout(() => {
              setImages(prev => [...prev, file]);
              setImageUrls(prev => {
                const newUrls = [...prev, event.target?.result as string];
                // Set the newly uploaded image as primary
                setPrimaryImageIndex(newUrls.length - 1);
                return newUrls;
              });
              setIsImageLoading(false);
              setUploadProgress(0);
            }, 2000); // Total loading time ~2 seconds
          };

          reader.readAsDataURL(file);
        });
      } else {
        addToast({
          type: "error",
          title: "Upload limit",
          message: "You can only upload up to 10 images at a time",
          duration: 3000
        });
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));

    // Adjust primary image index if necessary
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(0);
    } else if (primaryImageIndex > index) {
      setPrimaryImageIndex(prev => prev - 1);
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only set to false if we're leaving the drop zone entirely
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
      setIsDraggingOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));

    if (images.length + files.length <= 10) {
      // Set total dragged images count
      setDraggedImagesTotal(files.length);

      files.forEach((file, index) => {
        setIsImageLoading(true);
        setUploadProgress(0);
        setCurrentDraggedImageIndex(index + 1); // Start from 1

        // Simulate realistic loading progress
        const reader = new FileReader();

        // Simulate progress updates with realistic timing
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += Math.random() * 15 + 5; // Random increment between 5-20
          if (progress > 100) progress = 100;
          setUploadProgress(Math.floor(progress));

          if (progress >= 100) {
            clearInterval(progressInterval);
          }
        }, 200); // Update every 200ms

        reader.onload = (event) => {
          setTimeout(() => {
            setImages(prev => [...prev, file]);
            setImageUrls(prev => {
              const newUrls = [...prev, event.target?.result as string];
              // Set the newly uploaded image as primary
              setPrimaryImageIndex(newUrls.length - 1);
              return newUrls;
            });

            // Reset counters when all images are done
            if (index === files.length - 1) {
              setIsImageLoading(false);
              setUploadProgress(0);
              setDraggedImagesTotal(0);
              setCurrentDraggedImageIndex(0);
            }
          }, 2000); // Total loading time ~2 seconds
        };

        reader.readAsDataURL(file);
      });
    } else {
      addToast({
        type: "error",
        title: "Upload limit",
        message: "You can only upload up to 10 images at a time",
        duration: 3000
      });
    }
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setIsLanguageDropdownOpen(false);
  };

  const handleHomepageClick = () => {
    // Navigate to home page while preserving login state
    navigate('/', { replace: false });
  };

  const handleMenuClick = () => {
    // Navigate to home page with menu opened and highlight Chats option
    navigate('/', {
      replace: false,
      state: {
        openMenu: true,
        highlightChats: true
      }
    });
  };

  const uploadProductImages = async (productId: string, imageFiles: File[]) => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const uploadPromises = imageFiles.map(async (file) => {
        const presignedResponse = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/images/upload-url`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
          }),
        });

        if (!presignedResponse.ok) {
          throw new Error('Failed to get upload URL');
        }

        const presignedResult = await presignedResponse.json();

        if (!presignedResult.success || !presignedResult.data?.uploadUrl) {
          throw new Error('Invalid response from upload service');
        }

        const presignedData = presignedResult.data;
        const uploadResponse = await fetch(presignedData.uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image to S3');
        }

        const addImageResponse = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            images: [{
              url: presignedData.viewUrl,
              key: presignedData.key,
              isPrimary: false,
              order: 0
            }]
          }),
        });

        if (!addImageResponse.ok) {
          throw new Error('Failed to add image to product');
        }

        return addImageResponse.json();
      });

      await Promise.all(uploadPromises);

    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      const payload = {
        title,
        description,
        price: price,
        currency,
        quantity,
        category,
        origin,
        location,
        saleType,
        deliveryAvailable
      };

      let response;
      if (isEditMode && id) {
        // Update existing product
        response = await fetch(`${process.env.REACT_APP_API_URL}/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new product
        response = await fetch(`${process.env.REACT_APP_API_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${isEditMode ? 'update' : 'save'} draft`);
      }

      if (result.success) {
        const productId = result.data.id || id;

        // Upload new images if any
        if (images.length > 0 && productId) {
          await uploadProductImages(productId, images);
        }

        // if editing a published product, set it to draft
        if(isEditMode && productId && productData && (productData as any).status === 'PUBLISHED') {
          try {
            const statusRep = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/status`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ status: 'DRAFT'})
            });

            if(!statusRep.ok) {
              const statusResult = await statusRep.json().catch(() => ({}));
              addToast({
                type: 'error',
                title: 'Action failed',
                message: 'Failed to save product as draft',
                duration: 3000
              });
            } else {
            setProductData((prev: any) => prev ? {...prev, status: 'DRAFT'} : prev);
            }
          } catch(err){
            addToast({
              type: 'error',
              title: 'Action failed',
              message: 'Unable to save product as draft',
              duration: 3000
            });
          }
        }

        // Show success message
        addToast({
          type: "success",
          title: "Action completed",
          message: `${isEditMode ? 'Draft updated' : 'Draft saved'} successfully!`,
          duration: 3000
        });
        navigate('/my-listings?tab=drafts');
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Action failed",
        message: `Failed to ${isEditMode ? 'update' : 'save'} draft: ${error.message}`,
        duration: 3000
      });
    }
  };

  const handlePostListing = async () => {
    if(!validateRequiredFields()) return;
    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');

      // First create the product as draft
      const productData = {
        title,
        description,
        price: price,
        currency,
        quantity,
        category,
        origin,
        location,
        saleType,
        deliveryAvailable
      };

      let createResponse: Response;
      let productId: string | undefined = isEditMode ? id : undefined;

      if (isEditMode && id) {
        // Update existing product
        createResponse = await fetch(`${process.env.REACT_APP_API_URL}/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(productData)
        });
        productId = id;
      } else {
        // Create new product
        createResponse = await fetch(`${process.env.REACT_APP_API_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(productData)
        });
      }

      const createResult = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(createResult.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
      }

      if (createResult.success) {
        const productId = createResult.data.id;

        // Upload images
        if (images.length > 0) {
          await uploadProductImages(productId, images);
        }

        // Publish the product
        const publishResponse = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'PUBLISHED' })
        });

        const publishResult = await publishResponse.json();

        if (!publishResponse.ok) {
          throw new Error(publishResult.message || 'Failed to publish product');
        }

        if (publishResult.success) {
          addToast({
            type: "success",
            title: "Action completed",
            message: `Listing ${isEditMode ? 'updated' : 'posted'} successfully!`,
            duration: 3000
          });
          navigate('/my-listings?tab=all');
        }
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Action failed",
        message: "Failed to post listing. Please try again.",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const languageSelector = target.closest('.language-selector');
      const menuDropdown = target.closest('.menu-dropdown');
      const categoryDropdown = target.closest('.category-dropdown');
      const originDropdown = target.closest('.origin-dropdown');
      const saleTypeDropdown = target.closest('.sale-type-dropdown');
      const currencyDropdown = target.closest('.currency-dropdown');

      if (!languageSelector && isLanguageDropdownOpen) {
        setIsLanguageDropdownOpen(false);
      }

      if (!menuDropdown && isMenuDropdownOpen) {
        setIsMenuDropdownOpen(false);
      }

      if (!categoryDropdown && isCategoryDropdownOpen) {
        setIsCategoryDropdownOpen(false);
      }

      if (!originDropdown && isOriginDropdownOpen) {
        setIsOriginDropdownOpen(false);
      }

      if (!saleTypeDropdown && isSaleTypeDropdownOpen) {
        setIsSaleTypeDropdownOpen(false);
      }

      if (!currencyDropdown && isCurrencyDropdownOpen) {
        setIsCurrencyDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageDropdownOpen, isMenuDropdownOpen, isCategoryDropdownOpen, isOriginDropdownOpen, isSaleTypeDropdownOpen, isCurrencyDropdownOpen]);

  const pageTitle = isEditMode ? 'Edit listing' : 'Create a new listing';
  const postButtonText = isEditMode ? 'Update listing' : 'Post listing';

  if (isLoadingProduct) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <style>{`
        .create-listing-input::placeholder {
          color: #D9D9D9;
          font-size: 0.85rem;
        }
        .create-listing-textarea::placeholder {
          color: #D9D9D9;
          font-size: 0.85rem;
        }
        .create-listing-select option:first-child {
          color: #D9D9D9;
          font-size: 0.85rem;
        }
        .create-listing-select:invalid {
          color: #D9D9D9;
          font-size: 0.85rem;
        }
        /* Hide number input arrows */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
        /* Drag and drop cursor */
        .image-upload-area {
          cursor: pointer;
        }
        .image-upload-area.dragging-over {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g><path fill="white" stroke="black" stroke-width="2" d="M8 6 v12 l2 2 v6 a2 2 0 004 0 v-8 h2 v4 a2 2 0 004 0 v-4 h2 v2 a2 2 0 004 0 v-2 h1 v-1 a2 2 0 00-4 0 v-9 l-2-2 h-8 l-5-1 z"/></g></svg>') 12 12, grab !important;
        }
        /* Custom select dropdown arrow */
        .create-listing-select,
        select.custom-select-arrow {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.5em;
          padding-right: 3rem;
        }
        /* Category select dropdown styling */
        .create-listing-select option {
          color: #6A6A6A;
          padding: 12px 16px;
          border-radius: 8px;
        }
        .create-listing-select option:checked,
        .create-listing-select option:hover {
          background-color: #F0F8FE !important;
          color: #6A6A6A;
        }
        /* Custom focus ring color */
        input:focus,
        textarea:focus,
        select:focus {
          --tw-ring-color: #97CDF9 !important;
          box-shadow: 0 0 0 2px #97CDF9 !important;
        }
        /* Price input container focus */
        .price-input-container:focus-within {
          --tw-ring-color: #97CDF9 !important;
          box-shadow: 0 0 0 2px #97CDF9 !important;
        }
        /* Remove any divider line in price input */
        .price-input-container select,
        .price-input-container input {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        .price-input-container select:focus,
        .price-input-container input:focus {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>

      {/* Page Content - Scrollable */}
      <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs and Drafts Button */}
          <div className="flex items-center justify-between mb-4">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-xs">
              <img
                src={arrowLeftIcon}
                alt="Back"
                className="w-4 h-4 cursor-pointer"
                onClick={handleHomepageClick}
              />
              <span
                className="hover:text-gray-700 cursor-pointer"
                style={{ color: '#BABABA' }}
                onClick={handleHomepageClick}
              >
                Homepage
              </span>
              <span className="text-gray-400">/</span>
              <span
                className="hover:text-gray-700 cursor-pointer"
                style={{ color: '#BABABA' }}
                onClick={handleMenuClick}
              >
                Menu
              </span>
              <span className="text-gray-400">/</span>
              <span className="font-medium" style={{ color: '#4D4D4D' }}>Create a new listing</span>
            </nav>

            {/* Drafts Button */}
            <button
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: '#F0F8FE' }}
            >
              <img src={draftsIcon} alt="Drafts" className="w-4 h-4" />
              <span className="font-medium text-xs" style={{ color: '#64B5F6' }}>
                Drafts
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: '#CFE8FC', color: '#64B5F6', fontSize: '0.72rem' }}
              >
                3
              </span>
            </button>
          </div>

          {/* Main Form Container */}
          <div className="bg-white rounded-2xl border border-gray-300 shadow-sm pt-10 px-6 pb-16">
            {/* Form Header */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Title Section */}
              <div className="flex items-start space-x-3 pl-8">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#F0F8FE' }}
                >
                  <img src={shippxIcon} alt="Shipping" className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-medium text-gray-900">
                    {pageTitle}
                  </h1>
                  <p className="mt-1 text-xs" style={{ color: '#BABABA' }}>
                    {isEditMode ? 'Edit your product' : 'Add a new product'}
                  </p>
                </div>
              </div>

              {/* Location Section */}
              <div className="flex items-start justify-between mt-4" style={{ maxWidth: '560px' }}>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <img src={locIcon} alt="Location" className="w-4 h-4" />
                    <span className="text-xs font-medium" style={{ color: '#6A6A6A' }}>Your location</span>
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="text-xs font-medium border-none focus:outline-none ml-6"
                    style={{ color: '#64B5F6' }}
                  />
                </div>
                <button
                  className="px-4 py-3 rounded-lg text-xs font-medium whitespace-nowrap"
                  style={{ backgroundColor: '#F0F8FE', color: '#64B5F6' }}
                >
                  Change location
                </button>
              </div>
            </div>

            {/* Form Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4 pl-8">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6A6A6A' }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter product name"
                    className="create-listing-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Image Upload Box */}
                <div>
                  <div
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`rounded-2xl text-center relative image-upload-area ${isDraggingOver ? 'dragging-over' : ''}`}
                    style={{
                      backgroundColor: isImageLoading ? 'transparent' : (isDraggingOver ? 'transparent' : (imageUrls.length > 0 ? 'transparent' : '#F5F5F5')),
                      background: (isImageLoading || isDraggingOver)
                        ? 'repeating-linear-gradient(-45deg, #F5FBFF, #F5FBFF 18px, #F8FCFF 18px, #F8FCFF 36px)'
                        : (imageUrls.length > 0 ? 'transparent' : '#F5F5F5'),
                      border: (isImageLoading || isDraggingOver) ? '2px dashed #83C4F8' : 'none',
                      borderRadius: '16px',
                      height: imageUrls.length > 0 ? '433px' : 'auto',
                      display: imageUrls.length > 0 ? 'flex' : 'block',
                      justifyContent: imageUrls.length > 0 ? 'center' : 'normal',
                      alignItems: imageUrls.length > 0 ? 'center' : 'normal',
                      padding: imageUrls.length > 0 ? '0' : '128px 80px'
                    }}
                  >
                    {isImageLoading ? (
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-xs mb-6" style={{ color: '#83C4F8', fontWeight: 500 }}>
                          Image loading
                        </p>
                        <div className="relative mb-4">
                          {/* Gray base circle */}
                          <svg width="78" height="78" className="transform -rotate-90">
                            <circle
                              cx="39"
                              cy="39"
                              r="36"
                              fill="none"
                              stroke="#E9E9E9"
                              strokeWidth="3"
                            />
                            {/* Blue progress arc */}
                            <circle
                              cx="39"
                              cy="39"
                              r="36"
                              fill="none"
                              stroke="#83C4F8"
                              strokeWidth="3"
                              strokeDasharray={`${(uploadProgress / 100) * 226} 226`}
                              strokeLinecap="round"
                            />
                          </svg>
                          {/* Icon in center */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <img
                              src={loadIcon}
                              alt="Loading"
                              style={{
                                width: '32px',
                                height: '32px',
                                filter: 'brightness(0) saturate(100%) invert(70%) sepia(36%) saturate(624%) hue-rotate(172deg) brightness(100%) contrast(96%)'
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-base font-normal" style={{ color: '#83C4F8' }}>
                            {uploadProgress}%
                          </p>
                          {draggedImagesTotal >= 2 && (
                            <p className="text-base font-normal" style={{ color: '#83C4F8' }}>
                              {currentDraggedImageIndex}/{draggedImagesTotal}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : imageUrls.length > 0 ? (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                        <img
                          src={imageUrls[primaryImageIndex]}
                          alt="Upload"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <>
                        <img
                          src={imageIcon}
                          alt="Upload"
                          className="mx-auto mb-4 opacity-60"
                          style={{ width: '24px', height: '24px' }}
                        />
                        <p className="text-xs mb-2" style={{ color: '#2D2D2D' }}>
                          Drag and drop product images here
                        </p>
                        <div className="flex items-center justify-center mb-4">
                          <div className="w-8 border-t border-gray-300"></div>
                          <p className="text-gray-400 text-sm px-3">OR</p>
                          <div className="w-8 border-t border-gray-300"></div>
                        </div>
                        <label className="inline-block">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <span
                            className="px-6 py-2.5 rounded-lg font-medium cursor-pointer inline-block"
                            style={{ backgroundColor: '#F0F8FE', color: '#64B5F6' }}
                          >
                            Upload Photos
                          </span>
                        </label>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-gray-400 text-xs">
                      You can add up to 10 photos (JPEG, JPG, PNG)
                    </p>
                    {imageUrls.length > 0 && (
                      <div
                        className="px-3 py-1 rounded-md"
                        style={{
                          backgroundColor: '#F0F8FE',
                          color: '#64B5F6',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}
                      >
                        {imageUrls.length}/10
                      </div>
                    )}
                  </div>

                  {/* Image Preview Section */}
                  {imageUrls.length > 0 && (
                    <div className="flex gap-6 mt-4" style={{ paddingTop: '15px', paddingBottom: '15px' }}>
                      <style>{`
                        .image-preview-scroll::-webkit-scrollbar {
                          display: none;
                        }
                      `}</style>

                      {/* Conditionally wrap in scrollable container when 4+ images */}
                      {imageUrls.length >= 4 ? (
                        <div
                          className="relative"
                          style={{
                            width: imageUrls.length >= 10 ? '540px' : '420px',
                            height: '130px',
                            paddingTop: '15px',
                            paddingBottom: '15px',
                            marginTop: '-15px',
                            marginBottom: '-15px',
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            className="image-preview-scroll flex gap-6"
                            style={{
                              overflowX: 'auto',
                              overflowY: 'visible',
                              scrollbarWidth: 'none',
                              msOverflowStyle: 'none',
                              height: '100px',
                              paddingLeft: '15px',
                              paddingRight: '15px',
                              marginLeft: '-15px',
                              marginRight: '-15px'
                            }}
                          >
                            {imageUrls.map((url, index) => (
                              <div
                                key={index}
                                className="relative"
                                style={{
                                  width: '100px',
                                  height: '100px',
                                  flexShrink: 0,
                                  borderRadius: '12px',
                                  overflow: 'visible'
                                }}
                              >
                                <img
                                  src={url}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  style={{ borderRadius: '12px' }}
                                />

                                {/* Light gray smoky overlay - only on primary image */}
                                {index === primaryImageIndex && (
                                  <div
                                    className="absolute inset-0"
                                    style={{
                                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                      borderRadius: '12px'
                                    }}
                                  />
                                )}

                                {/* Remove button (X) */}
                                <button
                                  onClick={() => handleRemoveImage(index)}
                                  className="absolute flex items-center justify-center"
                                  style={{
                                    width: '22px',
                                    height: '22px',
                                    backgroundColor: '#4D4D4D',
                                    borderRadius: '50%',
                                    border: '2px solid white',
                                    top: '-11px',
                                    right: '-11px',
                                    zIndex: 20
                                  }}
                                >
                                  <svg
                                    width="8"
                                    height="8"
                                    viewBox="0 0 10 10"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  >
                                    <path d="M1 1L9 9M9 1L1 9" />
                                  </svg>
                                </button>

                                {/* Primary/Checkmark button - only show on primary image */}
                                {index === primaryImageIndex && (
                                  <button
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                                    style={{
                                      width: '24px',
                                      height: '24px',
                                      backgroundColor: '#F9A825',
                                      borderRadius: '50%',
                                      border: '2px solid white',
                                      zIndex: 10
                                    }}
                                  >
                                    <svg
                                      width="12"
                                      height="10"
                                      viewBox="0 0 12 10"
                                      fill="none"
                                      stroke="white"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M1 5L4 8L11 1" />
                                    </svg>
                                  </button>
                                )}

                                {/* Clickable overlay to set as primary - only show on non-primary images */}
                                {index !== primaryImageIndex && (
                                  <div
                                    onClick={() => handleSetPrimaryImage(index)}
                                    className="absolute inset-0 cursor-pointer"
                                    style={{
                                      borderRadius: '12px',
                                      zIndex: 5
                                    }}
                                  />
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Fade effect on left - only with 4+ images */}
                          <div
                            className="absolute left-0 pointer-events-none"
                            style={{
                              width: '40px',
                              height: '130px',
                              top: '0',
                              background: 'linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
                              zIndex: 15
                            }}
                          />

                          {/* Fade effect on right - only with 4+ images */}
                          <div
                            className="absolute right-0 pointer-events-none"
                            style={{
                              width: '40px',
                              height: '130px',
                              top: '0',
                              background: 'linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
                              zIndex: 15
                            }}
                          />
                        </div>
                      ) : (
                        // Show images without scrollable container when 1-3 images
                        imageUrls.map((url, index) => (
                          <div
                            key={index}
                            className="relative"
                            style={{
                              width: '100px',
                              height: '100px',
                              flexShrink: 0,
                              borderRadius: '12px',
                              overflow: 'visible'
                            }}
                          >
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                              style={{ borderRadius: '12px' }}
                            />

                            {/* Light gray smoky overlay - only on primary image */}
                            {index === primaryImageIndex && (
                              <div
                                className="absolute inset-0"
                                style={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                  borderRadius: '12px'
                                }}
                              />
                            )}

                            {/* Remove button (X) */}
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute flex items-center justify-center"
                              style={{
                                width: '22px',
                                height: '22px',
                                backgroundColor: '#4D4D4D',
                                borderRadius: '50%',
                                border: '2px solid white',
                                top: '-11px',
                                right: '-11px',
                                zIndex: 20
                              }}
                            >
                              <svg
                                width="8"
                                height="8"
                                viewBox="0 0 10 10"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                              >
                                <path d="M1 1L9 9M9 1L1 9" />
                              </svg>
                            </button>

                            {/* Primary/Checkmark button - only show on primary image */}
                            {index === primaryImageIndex && (
                              <button
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  backgroundColor: '#F9A825',
                                  borderRadius: '50%',
                                  border: '2px solid white',
                                  zIndex: 10
                                }}
                              >
                                <svg
                                  width="12"
                                  height="10"
                                  viewBox="0 0 12 10"
                                  fill="none"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M1 5L4 8L11 1" />
                                </svg>
                              </button>
                            )}

                            {/* Clickable overlay to set as primary - only show on non-primary images */}
                            {index !== primaryImageIndex && (
                              <div
                                onClick={() => handleSetPrimaryImage(index)}
                                className="absolute inset-0 cursor-pointer"
                                style={{
                                  borderRadius: '12px',
                                  zIndex: 5
                                }}
                              />
                            )}
                          </div>
                        ))
                      )}

                      {/* Upload Next Images Interface - Fixed at 4th position */}
                      {imageUrls.length < 10 && (
                        <div className="flex flex-col items-center" style={{ flexShrink: 0 }}>
                          <label
                            className="flex items-center justify-center cursor-pointer"
                            style={{
                              width: '100px',
                              height: '100px',
                              backgroundColor: '#F0F8FE',
                              border: '2px dashed #64B5F6',
                              borderRadius: '12px'
                            }}
                          >
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            <svg
                              width="32"
                              height="32"
                              viewBox="0 0 32 32"
                              fill="none"
                              stroke="#64B5F6"
                              strokeWidth="2"
                              strokeLinecap="round"
                            >
                              <path d="M16 8V24M8 16H24" />
                            </svg>
                          </label>
                          <span
                            className="text-xs font-medium mt-2"
                            style={{ color: '#64B5F6' }}
                          >
                            Upload Photos
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6A6A6A' }}>
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="... Describe your product"
                    rows={4}
                    className="create-listing-textarea px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    style={{ width: '100%', maxWidth: '560px' }}
                  />
                </div>

                {/* Price and Quantity Row */}
                <div className="flex items-start space-x-6">
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#6A6A6A' }}>
                      Price
                    </label>
                    <div className="relative" style={{ maxWidth: '280px' }}>
                      <div className="price-input-container flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:border-transparent">
                        {/* Currency Dropdown */}
                        <div className="relative currency-dropdown" style={{ position: 'static' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen);
                            }}
                            className="pl-4 pr-1 py-3 border-none focus:outline-none bg-white flex items-center"
                            style={{ color: '#E4E4E4', fontSize: '0.85rem', cursor: 'pointer' }}
                          >
                            <span>{currency}</span>
                            <svg
                              className="w-4 h-4 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              style={{ color: '#6B7280' }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {/* Dropdown Menu */}
                          {isCurrencyDropdownOpen && (
                            <div
                              className="absolute z-50 bg-white border border-gray-200 shadow-lg overflow-hidden"
                              style={{ borderRadius: '12px', minWidth: '250px', left: '0', top: 'calc(100% + 8px)' }}
                            >
                              {currencies.map((curr, index) => (
                                <div
                                  key={curr.value}
                                  className={`w-full ${index === 0 ? 'rounded-t-xl' : ''
                                    } ${index === currencies.length - 1 ? 'rounded-b-xl' : ''
                                    }`}
                                  style={{
                                    backgroundColor: 'transparent'
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCurrency(curr.value);
                                      setIsCurrencyDropdownOpen(false);
                                    }}
                                    className="w-full text-left transition-colors relative flex items-center"
                                    style={{
                                      color: '#6A6A6A',
                                      cursor: 'pointer',
                                      fontSize: '0.8rem',
                                      padding: '10px 16px',
                                      fontWeight: 500
                                    }}
                                  >
                                    {currency === curr.value && (
                                      <div
                                        style={{
                                          position: 'absolute',
                                          left: '8px',
                                          right: '8px',
                                          top: '4px',
                                          bottom: '4px',
                                          backgroundColor: '#F0F8FE',
                                          borderRadius: '8px',
                                          zIndex: 0
                                        }}
                                      />
                                    )}
                                    <img
                                      src={`https://flagcdn.com/w40/${curr.flagCode}.png`}
                                      alt=""
                                      style={{
                                        width: '24px',
                                        height: '18px',
                                        marginRight: '12px',
                                        position: 'relative',
                                        zIndex: 1
                                      }}
                                    />
                                    <span style={{ position: 'relative', zIndex: 1 }}>
                                      {curr.label} · {curr.value}
                                    </span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div style={{ width: '1px', height: '32px', backgroundColor: '#D1D5DB', marginLeft: '12px', marginRight: '12px', flexShrink: 0 }}></div>
                        <input
                          type="text"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="Insert Pricing"
                          className="create-listing-input flex-1 pl-4 pr-4 py-3 border-none focus:outline-none focus:ring-0"
                          style={{ borderLeft: 'none', boxShadow: 'none' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#6A6A6A' }}>
                      Quantity
                    </label>
                    <div className="flex items-center space-x-2" style={{ maxWidth: '180px' }}>
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 rounded-lg font-medium text-lg flex-shrink-0"
                        style={{ backgroundColor: '#E3F2FD', color: '#64B5F6' }}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        style={{ width: '140px' }}
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 h-12 rounded-lg font-medium text-lg flex-shrink-0"
                        style={{ backgroundColor: '#E3F2FD', color: '#64B5F6' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6A6A6A' }}>
                    Categories
                  </label>
                  <div className="relative category-dropdown" style={{ width: '100%', maxWidth: '560px' }}>
                    {/* Dropdown Button */}
                    <button
                      type="button"
                      onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-left flex items-center justify-between"
                      style={{
                        borderColor: isCategoryDropdownOpen ? '#97CDF9' : '#D1D5DB',
                        boxShadow: isCategoryDropdownOpen ? '0 0 0 2px #97CDF9' : 'none'
                      }}
                    >
                      <span style={{ color: category ? '#6A6A6A' : '#D9D9D9', fontSize: '0.85rem' }}>
                        {category ? categories.find(c => c.value === category)?.label : 'Choose category'}
                      </span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: '#6B7280' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isCategoryDropdownOpen && (
                      <div
                        className="absolute z-50 w-full mt-2 bg-white border border-gray-200 shadow-lg overflow-hidden"
                        style={{ borderRadius: '12px' }}
                      >
                        {categories.map((cat, index) => (
                          <div
                            key={cat.value}
                            className={`w-full ${index === 0 ? 'rounded-t-xl' : ''
                              } ${index === categories.length - 1 ? 'rounded-b-xl' : ''
                              }`}
                            style={{
                              backgroundColor: 'transparent'
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setCategory(cat.value);
                                setIsCategoryDropdownOpen(false);
                              }}
                              className="w-full text-left transition-colors relative"
                              style={{
                                color: '#6A6A6A',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                padding: '10px 16px',
                                fontWeight: 500
                              }}
                            >
                              {category === cat.value && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    left: '8px',
                                    right: '8px',
                                    top: '4px',
                                    bottom: '4px',
                                    backgroundColor: '#F0F8FE',
                                    borderRadius: '8px',
                                    zIndex: -1
                                  }}
                                />
                              )}
                              <span style={{ position: 'relative', zIndex: 1 }}>{cat.label}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Origin of product */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6A6A6A' }}>
                    Origin of product
                  </label>
                  <div className="relative origin-dropdown" style={{ width: '100%', maxWidth: '560px' }}>
                    {/* Dropdown Button */}
                    <button
                      type="button"
                      onClick={() => setIsOriginDropdownOpen(!isOriginDropdownOpen)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-left flex items-center justify-between"
                      style={{
                        borderColor: isOriginDropdownOpen ? '#97CDF9' : '#D1D5DB',
                        boxShadow: isOriginDropdownOpen ? '0 0 0 2px #97CDF9' : 'none'
                      }}
                    >
                      {origin ? (
                        <div className="flex items-center">
                          <img
                            src={`https://flagcdn.com/w40/${countries.find(c => c.value === origin)?.flagCode}.png`}
                            srcSet={`https://flagcdn.com/w80/${countries.find(c => c.value === origin)?.flagCode}.png 2x`}
                            alt={`${countries.find(c => c.value === origin)?.label} flag`}
                            style={{
                              width: '24px',
                              height: '18px',
                              marginRight: '12px',
                              borderRadius: '4px',
                              objectFit: 'cover'
                            }}
                          />
                          <span style={{ color: '#6A6A6A', fontSize: '0.85rem', fontWeight: 500 }}>
                            {countries.find(c => c.value === origin)?.label}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: '#D9D9D9', fontSize: '0.85rem' }}>
                          Choose origin of product
                        </span>
                      )}
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: '#6B7280' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isOriginDropdownOpen && (
                      <div
                        className="absolute z-50 w-full mt-2 bg-white border border-gray-200 shadow-lg overflow-y-auto origin-dropdown-scroll"
                        style={{
                          borderRadius: '12px',
                          maxHeight: '250px'
                        }}
                      >
                        <style>{`
                          .origin-dropdown-scroll::-webkit-scrollbar {
                            width: 16px;
                          }
                          .origin-dropdown-scroll::-webkit-scrollbar-track {
                            background: transparent;
                          }
                          .origin-dropdown-scroll::-webkit-scrollbar-thumb {
                            background: #E4E4E4;
                            border-radius: 10px;
                            border: 6px solid white;
                            background-clip: padding-box;
                          }
                          .origin-dropdown-scroll::-webkit-scrollbar-thumb:hover {
                            background: #D1D5DB;
                            border: 6px solid white;
                            background-clip: padding-box;
                          }
                          .flag-emoji {
                            font-family: "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "Apple Color Emoji", "Twemoji Mozilla", sans-serif;
                          }
                        `}</style>
                        {countries.map((country, index) => (
                          <div
                            key={country.value}
                            className={`w-full ${index === 0 ? 'rounded-t-xl' : ''
                              } ${index === countries.length - 1 ? 'rounded-b-xl' : ''
                              }`}
                            style={{
                              backgroundColor: 'transparent'
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setOrigin(country.value);
                                setIsOriginDropdownOpen(false);
                              }}
                              className="w-full text-left transition-colors relative flex items-center"
                              style={{
                                color: '#6A6A6A',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                padding: '8px 16px',
                                fontWeight: 500
                              }}
                            >
                              {origin === country.value && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    left: '8px',
                                    right: '8px',
                                    top: '4px',
                                    bottom: '4px',
                                    backgroundColor: '#F0F8FE',
                                    borderRadius: '8px',
                                    zIndex: 0
                                  }}
                                />
                              )}
                              <img
                                src={`https://flagcdn.com/w40/${country.flagCode}.png`}
                                srcSet={`https://flagcdn.com/w80/${country.flagCode}.png 2x`}
                                alt={`${country.label} flag`}
                                style={{
                                  width: '24px',
                                  height: '18px',
                                  marginRight: '12px',
                                  position: 'relative',
                                  zIndex: 1,
                                  objectFit: 'cover',
                                  borderRadius: '2px'
                                }}
                              />
                              <span style={{ position: 'relative', zIndex: 1 }}>{country.label}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Type of sale */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6A6A6A' }}>
                    Type of sale
                  </label>
                  <div className="relative sale-type-dropdown" style={{ width: '100%', maxWidth: '560px' }}>
                    {/* Dropdown Button */}
                    <button
                      type="button"
                      onClick={() => setIsSaleTypeDropdownOpen(!isSaleTypeDropdownOpen)}
                      className="w-full px-4 border border-gray-300 rounded-lg focus:outline-none text-left flex items-center justify-between"
                      style={{
                        borderColor: isSaleTypeDropdownOpen ? '#97CDF9' : '#D1D5DB',
                        boxShadow: isSaleTypeDropdownOpen ? '0 0 0 2px #97CDF9' : 'none',
                        paddingTop: saleType === 'Urgent' ? '6px' : '12px',
                        paddingBottom: saleType === 'Urgent' ? '6px' : '12px'
                      }}
                    >
                      <div className="flex items-center">
                        {saleType === 'Urgent' ? (
                          <div
                            className="flex items-center"
                            style={{
                              backgroundColor: '#FEF6E9',
                              color: '#F9A825',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: 500
                            }}
                          >
                            <span>Urgent</span>
                            <img
                              src={path2Icon}
                              alt=""
                              style={{
                                width: '15px',
                                height: '15px',
                                marginLeft: '7px'
                              }}
                            />
                          </div>
                        ) : (
                          <span style={{ color: saleType ? '#6A6A6A' : '#D9D9D9', fontSize: '0.85rem' }}>
                            {saleType ? saleTypes.find(s => s.value === saleType)?.label : 'Choose type of sale'}
                          </span>
                        )}
                      </div>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: '#6B7280' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isSaleTypeDropdownOpen && (
                      <div
                        className="absolute z-50 w-full mt-2 bg-white border border-gray-200 shadow-lg overflow-hidden"
                        style={{ borderRadius: '12px' }}
                      >
                        {saleTypes.map((type, index) => (
                          <div
                            key={type.value}
                            className={`w-full ${index === 0 ? 'rounded-t-xl' : ''
                              } ${index === saleTypes.length - 1 ? 'rounded-b-xl' : ''
                              }`}
                            style={{
                              backgroundColor: 'transparent'
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setSaleType(type.value);
                                setIsSaleTypeDropdownOpen(false);
                              }}
                              className="w-full text-left transition-colors relative flex items-center"
                              style={{
                                color: type.value === 'Default' ? '#6A6A6A' : '#999999',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                padding: '16px 16px',
                                fontWeight: 500
                              }}
                            >
                              {saleType === type.value && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    left: '8px',
                                    right: '8px',
                                    top: '4px',
                                    bottom: '4px',
                                    backgroundColor: '#F0F8FE',
                                    borderRadius: '8px',
                                    zIndex: 0
                                  }}
                                />
                              )}
                              <span style={{ position: 'relative', zIndex: 1 }}>{type.label}</span>
                              {type.icon && (
                                <img
                                  src={type.icon}
                                  alt=""
                                  style={{
                                    width: '14px',
                                    height: '14px',
                                    position: 'relative',
                                    zIndex: 1,
                                    opacity: 0.7,
                                    marginLeft: '8px'
                                  }}
                                />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery available */}
                <div className="py-6">
                  <div className="flex items-center justify-between" style={{ maxWidth: '560px' }}>
                    <div>
                      <label className="block text-sm font-medium" style={{ color: '#6A6A6A' }}>
                        Delivery available
                      </label>
                      <p className="text-xs text-gray-400 mt-1">
                        Lorem ipsum dolor sit amet consectutor
                      </p>
                    </div>
                    <button
                      onClick={() => setDeliveryAvailable(!deliveryAvailable)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${deliveryAvailable ? '' : 'bg-gray-300'
                        }`}
                      style={deliveryAvailable ? { backgroundColor: '#4CD964' } : {}}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${deliveryAvailable ? 'translate-x-5' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Bottom Buttons */}
                <div className="flex items-center justify-center space-x-16 mt-16" style={{ maxWidth: '560px' }}>
                  <button
                    onClick={handleSaveDraft}
                    className="flex items-center space-x-2 rounded-xl border-2 font-medium transition-colors text-sm"
                    style={{ borderColor: '#F9A825', color: '#F9A825', paddingLeft: '4rem', paddingRight: '4.5rem', paddingTop: '0.625rem', paddingBottom: '0.625rem' }}
                  >
                    <span>Save as draft</span>
                    <img src={draft2Icon} alt="Save" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handlePostListing}
                    disabled={isLoading || !isFormComplete || isImageLoading}
                    className={`flex items-center space-x-2 px-16 py-2.5 rounded-xl font-medium transition-colors text-sm ${isFormComplete && !isLoading && !isImageLoading
                      ? "text-white bg-yellow-500 hover:bg-yellow-700 cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    style={{
                      backgroundColor: isFormComplete ? '#F9A825' : '#E9E9E9',
                      color: isFormComplete ? '#FFFFFF' : '#6A6A6A',
                      cursor: isFormComplete ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {isLoading ? (
                      <div className='flex items-center space-x-3'>
                        {/* Spinner when products are uploading */}
                        <LoadingSpinner size='sm' className='text-white' />
                        <span>Uploading products...</span>
                      </div>
                    ) : (
                      <>
                        <span>{postButtonText}</span>
                        <img
                          src={flyIcon}
                          alt="Post"
                          className='w-5 h-5'
                          style={{
                            filter: isFormComplete
                              ? 'brightness(0) invert(1)'
                              : 'none'
                          }}
                        />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;
