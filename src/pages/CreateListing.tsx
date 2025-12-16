import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/images/pre/logo.png';
import shippxIcon from '../assets/images/pre/shippx.svg';
import locIcon from '../assets/images/pre/Loc.svg';
import imageIcon from '../assets/images/pre/image.svg';
import draftsIcon from '../assets/images/pre/drafts.svg';
import trashIcon from '../assets/images/pre/trash.svg';
import draft2Icon from '../assets/images/pre/draft2.svg';
import flyIcon from '../assets/images/pre/fly.svg';
import basketIcon from '../assets/images/pre/basket.png';
import avatarIcon from '../assets/images/pre/avatar.png';
import notificationIcon from '../assets/images/pre/notification.svg';
import translationToggleIcon from '../assets/images/pre/tt.svg';
import arrowLeftIcon from '../assets/images/pre/arrow-left.svg';
import backArrowIcon from '../assets/images/pre/back arrow.svg';
import pencilIcon from '../assets/images/pre/pencil.svg';
import lilLogo from '../assets/images/pre/lil.png';
import searchNormalIcon from '../assets/images/pre/search-normal.svg';
import messageIcon from '../assets/images/pre/message.svg';
import boxIcon from '../assets/images/pre/box.svg';
import groupIcon from '../assets/images/pre/group.svg';
import frameIcon from '../assets/images/pre/frame.svg';
import podsIcon from '../assets/images/pre/pods.svg';
import settingIcon from '../assets/images/pre/setting.svg';
import pathIcon from '../assets/images/pre/Path.svg';
import path2Icon from '../assets/images/pre/path2.svg';
import loadIcon from '../assets/images/pre/load.svg';
import a1 from '../assets/images/pre/a1.png';
import a2 from '../assets/images/pre/a2.png';
import a3 from '../assets/images/pre/a3.png';
import a4 from '../assets/images/pre/a4.png';
import verityIcon from '../assets/images/pre/verity.svg';
import avatar from '../assets/images/logos/avatar.png';
import listingtoastIcon from '../assets/images/pre/listingtoast.svg';

interface DraftListing {
  id: string;
  title: string;
  price: string;
  currency: string;
  image: string;
  description: string;
  country: string;
  flag: string;
}

const initialDraftListings: DraftListing[] = [
  {
    id: 'd1',
    title: 'African Wristband',
    price: '65.8',
    currency: 'USD',
    image: a1,
    description: 'Warm pepper notes with a mellow finish, the kind of spice you sprinkle on everything once it hits your pantry.',
    country: 'Cameroon',
    flag: 'https://flagcdn.com/w20/cm.png'
  },
  {
    id: 'd2',
    title: 'African Comb',
    price: '65.8',
    currency: 'USD',
    image: a2,
    description: 'Hand-carved teeth that glide through coils without snagging. Feels like grandma\'s favorite comb, but made for modern curls.',
    country: 'Ghana',
    flag: 'https://flagcdn.com/w20/gh.png'
  },
  {
    id: 'd3',
    title: 'African Wristband',
    price: '65.8',
    currency: 'USD',
    image: a3,
    description: 'Layered beads in earthy tones. Wear it solo or stack it—makes any everyday outfit feel like market day.',
    country: 'Benin',
    flag: 'https://flagcdn.com/w20/bj.png'
  },
  {
    id: 'd4',
    title: 'Bitter Cola',
    price: 'N/A',
    currency: 'USD',
    image: a4,
    description: 'Earthy, slightly bitter with a citrusy snap. Great for chewing, steeping in tea, or making house bitters.',
    country: 'Nigeria',
    flag: 'https://flagcdn.com/w20/ng.png'
  }
];

const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const [isMobile, setIsMobile] = useState(false);
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
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);
  const [showMobileDrafts, setShowMobileDrafts] = useState(false);
  const [draftListings, setDraftListings] = useState<DraftListing[]>(initialDraftListings);
  const draftSeedRef = useRef(JSON.stringify(initialDraftListings));
  const currentDraftSeed = JSON.stringify(initialDraftListings);
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
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [showNotification, setShowNotification] = useState(false);

  // Check if all required fields are filled
  const isFormComplete = title.trim() !== '' && 
                         description.trim() !== '' && 
                         price.trim() !== '' && 
                         quantity > 0 && 
                         category !== '' && 
                         origin !== '' && 
                         imageUrls.length > 0;

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

const renderDraftCountryBadge = (label: string, flagUrl: string) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #E1E1E1',
      padding: '3px 12px',
      borderRadius: '999px',
      fontSize: '11px',
      fontFamily: 'Poppins, sans-serif',
      minHeight: '26px'
    }}
  >
    <img
      src={flagUrl}
      alt={`${label} flag`}
      style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }}
    />
    <span style={{ color: '#939393', fontWeight: 300 }}>{label}</span>
  </span>
);

const buildDraftPrefillPayload = (draft: DraftListing) => {
  const payload: Record<string, string> = {};
  if (draft.title) payload.title = draft.title;
  if (draft.description) payload.description = draft.description;
  if (draft.price && draft.price.toLowerCase() !== 'n/a') {
    payload.price = draft.price;
    if (draft.currency) payload.currency = draft.currency;
  }
  if (draft.country) payload.country = draft.country;
  if (draft.image) payload.image = draft.image;
  return payload;
};

  const applyPrefillToForm = (prefill: Record<string, string>) => {
    if (prefill.title) setTitle(prefill.title);
    if (prefill.description) setDescription(prefill.description);
    if (prefill.price) setPrice(prefill.price);
    if (prefill.currency) setCurrency(prefill.currency);
    if (prefill.country) {
      const originOption = countries.find(
        (country) => country.label.toLowerCase() === prefill.country.toLowerCase()
      );
      if (originOption) setOrigin(originOption.value);
    }
    if (prefill.image) {
      setImageUrls([prefill.image]);
      setImages([]);
      setPrimaryImageIndex(0);
    }
  };

  const handleDraftApply = (draft: DraftListing) => {
    const prefillData = buildDraftPrefillPayload(draft);
    applyPrefillToForm(prefillData);
    setIsDraftsModalOpen(false);
  };

  const handleDraftDelete = (draftId: string) => {
    setDraftListings((prev) => prev.filter((draft) => draft.id !== draftId));
  };

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
        alert('You can only upload up to 10 images');
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
      alert('You can only upload up to 10 images');
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

  const handleSaveDraft = () => {
    console.log('Saving as draft...');
    // TODO: Implement save draft functionality
  };

  const handlePostListing = () => {
    if (!isFormComplete) return;
    
    console.log('Posting listing...');
    // Show success modal
    setShowSuccessModal(true);
    setCountdown(10);
    
    // Show notification after a few seconds delay
    setTimeout(() => {
      setShowNotification(true);
    }, 2000);
  };

  // Countdown effect
  useEffect(() => {
    if (showSuccessModal && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showSuccessModal && countdown === 0) {
      // Navigate to owner view state (product detail with fromMyListings state)
      const newListingId = `new-${Date.now()}`;
      navigate(`/product/${newListingId}`, {
        state: {
          fromMyListings: true,
          listing: {
            id: newListingId,
            title,
            price,
            currency,
            image: imageUrls[primaryImageIndex] || imageUrls[0] || '',
            status: 'inactive' as const,
            rating: 0,
            reviews: 0,
            createdAt: Date.now(),
            priceValue: parseFloat(price) || 0,
            messages: 0,
            category: category || '',
            reviewStatus: 'success' as const
          },
          sellerVerified: false
        }
      });
    }
  }, [showSuccessModal, countdown, navigate, title, price, currency, imageUrls, primaryImageIndex, category]);

  const handleBackToHomepage = () => {
    // Navigate to owner view state (product detail with fromMyListings state)
    const newListingId = `new-${Date.now()}`;
    navigate(`/product/${newListingId}`, {
      state: {
        fromMyListings: true,
        listing: {
          id: newListingId,
          title,
          price,
          currency,
          image: imageUrls[primaryImageIndex] || imageUrls[0] || '',
          status: 'inactive' as const,
          rating: 0,
          reviews: 0,
          createdAt: Date.now(),
          priceValue: parseFloat(price) || 0,
          messages: 0,
          category: category || '',
          reviewStatus: 'pending' as const
        },
        sellerVerified: false
      }
    });
  };

  const handleAddNewListing = () => {
    // Reset form
    setTitle('');
    setDescription('');
    setPrice('');
    setCurrency('USD');
    setQuantity(1);
    setCategory('');
    setOrigin('');
    setSaleType('Default');
    setDeliveryAvailable(false);
    setLocation('London, United Kingdom');
    setImages([]);
    setImageUrls([]);
    setPrimaryImageIndex(0);
    setShowSuccessModal(false);
    setShowNotification(false);
    setCountdown(10);
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (draftSeedRef.current !== currentDraftSeed) {
      draftSeedRef.current = currentDraftSeed;
      setDraftListings(initialDraftListings);
    }
  }, [currentDraftSeed]);

  useEffect(() => {
    const stateDraft = (routerLocation.state as { draft?: Record<string, string> } | null)?.draft;
    if (stateDraft) {
      applyPrefillToForm(stateDraft);
      setIsDraftsModalOpen(true);
      navigate(routerLocation.pathname, { replace: true, state: {} });
    }
  }, [routerLocation.state, routerLocation.pathname, navigate]);

  const renderDraftCard = (draft: DraftListing) => (
    <div
      key={draft.id}
      className="flex items-center gap-4"
      style={{
        border: '1px solid #E9E9E9',
        borderRadius: '14px',
        padding: '16px 20px',
        backgroundColor: '#FFFFFF',
        width: '100%'
      }}
    >
      <div
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '12px',
          overflow: 'hidden',
          flexShrink: 0
        }}
      >
        <img src={draft.image} alt={draft.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100px'
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', color: '#1E1E1E', fontSize: '15px' }}>
            <span>{draft.title}</span>
            <span style={{ color: '#B0B0B0' }}>·</span>
            <span style={{ color: '#B0B0B0' }}>
              {draft.currency} {draft.price}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1 px-2 py-1"
              style={{
                backgroundColor: '#F4F4F4',
                color: '#939393',
                borderRadius: '6px',
                fontSize: '11px',
                fontFamily: 'Poppins, sans-serif'
              }}
              onClick={() => handleDraftApply(draft)}
            >
              <img src={draft2Icon} alt="Edit" className="w-3 h-3" />
              Use
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                backgroundColor: '#FFE9E9'
              }}
              onClick={() => handleDraftDelete(draft.id)}
            >
              <img
                src={trashIcon}
                alt="Delete"
                className="w-3.5 h-3.5"
                style={{
                  filter: 'brightness(0) saturate(100%) invert(53%) sepia(46%) saturate(3205%) hue-rotate(332deg) brightness(103%) contrast(102%)'
                }}
              />
            </button>
          </div>
        </div>
        <div style={{ alignSelf: 'flex-start', marginTop: '4px', marginBottom: '2px' }}>
          {renderDraftCountryBadge(draft.country, draft.flag)}
        </div>
        <p
          style={{
            color: '#B0B0B0',
            fontSize: '12px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 300,
            marginTop: '0',
            textAlign: 'left'
          }}
        >
          {draft.description}
        </p>
      </div>
    </div>
  );

  // Mobile Drafts View - Exact copy from MyListings
  if (showMobileDrafts && isMobile) {
    return (
      <div className="bg-white min-h-screen flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {/* Mobile Drafts Header */}
        <div className="lg:hidden fixed top-4 left-4 right-4 z-50 flex items-center justify-between mb-16">
          <button
            type="button"
            onClick={() => setShowMobileDrafts(false)}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
            style={{ boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}
            aria-label="Back"
          >
            <img src={backArrowIcon} alt="Back" className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
              style={{ boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}
              aria-label="Search"
            >
              <img src={searchNormalIcon} alt="Search" className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
              style={{ boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}
              aria-label="More options"
            >
              <svg width="16" height="4" viewBox="0 0 24 4" fill="none">
                <circle cx="4" cy="2" r="2" fill="#171717" />
                <circle cx="12" cy="2" r="2" fill="#171717" />
                <circle cx="20" cy="2" r="2" fill="#171717" />
              </svg>
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="pt-20 px-4 mb-6">
          <h1
            className="text-lg font-semibold"
            style={{ color: '#171717', fontFamily: 'Bricolage Grotesque, sans-serif' }}
          >
            Drafts ({draftListings.length})
          </h1>
        </div>

        {/* Drafts List */}
        <div className="px-4 pb-20 space-y-4">
          {draftListings.map((draft) => (
            <div
              key={draft.id}
              className="bg-white flex gap-3"
            >
              {/* Draft Image */}
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                <img src={draft.image} alt={draft.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Draft Info - Right of image */}
              <div className="flex-1 flex flex-col justify-between">
                {/* Title and Price */}
                <div className="flex items-center gap-1.5 mb-1">
                  <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', color: '#1E1E1E', fontSize: '14px', fontWeight: 500 }}>
                    {draft.title}
                  </span>
                  <span style={{ color: '#B0B0B0', fontSize: '14px' }}>·</span>
                  <span style={{ color: '#B0B0B0', fontSize: '12px', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                    {draft.currency} {draft.price}
                  </span>
                </div>

                {/* Country tag if exists */}
                {draft.country && (
                  <div className="inline-flex items-center gap-1 py-0.5 rounded-full mb-1" style={{ border: '1px solid #E1E1E1', paddingLeft: '6px', paddingRight: '8px', width: 'fit-content' }}>
                    <img
                      src={draft.flag}
                      alt={draft.country}
                      className="w-3 h-3 rounded-full object-cover"
                    />
                    <span style={{ color: '#939393', fontSize: '10px', fontFamily: 'Poppins, sans-serif' }}>
                      {draft.country}
                    </span>
                  </div>
                )}

                {/* Description - smaller, center-right, 2 lines max */}
                <p 
                  style={{ 
                    color: '#B0B0B0', 
                    fontSize: '10px', 
                    fontFamily: 'Poppins, sans-serif', 
                    lineHeight: '1.4', 
                    marginBottom: '6px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {draft.description || '(Empty)'}
                </p>

                {/* Action Buttons - Bottom right */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5"
                    style={{
                      backgroundColor: '#F4F4F4',
                      color: '#939393',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontFamily: 'Poppins, sans-serif',
                      border: 'none',
                      cursor: 'pointer',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      paddingTop: '4px',
                      paddingBottom: '4px'
                    }}
                    onClick={() => {
                      handleDraftApply(draft);
                      setShowMobileDrafts(false);
                    }}
                  >
                    <img src={pencilIcon} alt="Edit" className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center"
                    style={{
                      backgroundColor: '#FFE9E9',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      paddingLeft: '8px',
                      paddingRight: '8px',
                      paddingTop: '4px',
                      paddingBottom: '4px'
                    }}
                    onClick={() => {
                      setDraftListings((prev) => prev.filter((d) => d.id !== draft.id));
                    }}
                  >
                    <img src={trashIcon} alt="Delete" className="w-3.5 h-3.5" style={{ filter: 'brightness(0) saturate(100%) invert(53%) sepia(46%) saturate(3205%) hue-rotate(332deg) brightness(103%) contrast(102%)' }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="bg-white mt-auto">
          <div className="px-4 py-5">
            <div className="flex flex-col items-center text-xs space-y-2" style={{ color: '#BABABA' }}>
              <div className="flex items-center space-x-1.5">
                <img src={lilLogo} alt="Bao Afrik" className="w-5 h-5" />
                <span>©</span>
                <span className="text-[11px]">All rights reserved</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] flex-wrap justify-center">
                <Link to="/contact" className="hover:text-gray-900 whitespace-nowrap" style={{ color: '#BABABA' }}>Contact Us</Link>
                <span style={{ color: '#BABABA' }}>|</span>
                <Link to="/terms" className="hover:text-gray-900 whitespace-nowrap" style={{ color: '#BABABA' }}>Terms and conditions of use</Link>
                <span style={{ color: '#BABABA' }}>|</span>
                <Link to="/privacy" className="hover:text-gray-900 whitespace-nowrap" style={{ color: '#BABABA' }}>Privacy policies</Link>
                <span style={{ color: '#BABABA' }}>|</span>
                <Link to="/cookies" className="hover:text-gray-900 whitespace-nowrap" style={{ color: '#BABABA' }}>Cookies</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  const renderDraftsModal = () => {
    if (!isDraftsModalOpen) return null;
    
    // Desktop modal view
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center hidden lg:flex"
        style={{ backgroundColor: '#0000001A' }}
        onClick={() => setIsDraftsModalOpen(false)}
      >
        <div
          className="relative w-full max-w-2xl"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '30px',
            boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
            padding: '28px'
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                color: '#1E1E1E',
                fontSize: '18px'
              }}
            >
              Drafts ({draftListings.length})
            </h2>
            <button
              aria-label="Close drafts"
              onClick={() => setIsDraftsModalOpen(false)}
              style={{
                color: '#BABABA',
                fontSize: '26px',
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
          <div
            className="drafts-scroll"
            style={{
              maxHeight: '60vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              paddingRight: '8px'
            }}
          >
            {draftListings.map((draft) => renderDraftCard(draft))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <style>{`
        .create-listing-input::placeholder {
          color: #D9D9D9;
          font-size: 0.85rem;
        }
        @media (max-width: 1023px) {
          .create-listing-input::placeholder {
            font-size: 0.7rem;
          }
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
      {/* Navigation Bar - Fixed at top */}
      <header className="hidden lg:block flex-shrink-0 rounded-t-2xl" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-3">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 -ml-16">
              <img src={logo} alt="bao'Afrik" className="h-8 w-auto" />
            </Link>

            {/* Right Side Navigation */}
            <div className="flex items-center space-x-4 -mr-12">
              {/* Language Selector */}
              <div className="relative language-selector">
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <span>{selectedLanguage}</span>
                  <img src={translationToggleIcon} alt="Toggle" className="w-4 h-4" />
                </button>
                
                {/* Dropdown Menu */}
                {isLanguageDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <button
                        onClick={() => handleLanguageSelect('EN')}
                        className="w-full text-left px-4 py-2 text-sm transition-colors"
                        style={{
                          backgroundColor: selectedLanguage === 'EN' ? '#F0F8FE' : 'transparent',
                          color: selectedLanguage === 'EN' ? '#64B5F6' : '#374151'
                        }}
                      >
                        English
                      </button>
                      <button
                        onClick={() => handleLanguageSelect('FR')}
                        className="w-full text-left px-4 py-2 text-sm transition-colors"
                        style={{
                          backgroundColor: selectedLanguage === 'FR' ? '#F0F8FE' : 'transparent',
                          color: selectedLanguage === 'FR' ? '#64B5F6' : '#374151'
                        }}
                      >
                        French
                      </button>
                    </div>
                  </div>
                )}
        </div>
        
              {/* Start Selling Button */}
              <Link
                to="/create-listing"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: '#FEF6E9' }}
              >
                <img src={basketIcon} alt="Basket" className="w-5 h-5" style={{ filter: 'brightness(0) saturate(100%) invert(59%) sepia(94%) saturate(423%) hue-rotate(359deg) brightness(98%) contrast(98%)' }} />
                <span className="text-sm font-normal" style={{ color: '#F9A825' }}>
                  Start Selling
                </span>
              </Link>

              {/* Notification Icon */}
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <img src={notificationIcon} alt="Notifications" className="w-6 h-6" />
          </button>

              {/* Profile Picture */}
              <button className="p-0.5 hover:opacity-80 transition-opacity">
                <img src={avatarIcon} alt="Profile" className="w-9 h-9 rounded-full" />
              </button>

              {/* Menu Button */}
              <div className="relative menu-dropdown">
                <button 
                  onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    +9
        </div>
                </button>
                
                {/* Dropdown Menu */}
                {isMenuDropdownOpen && (
                  <div className="fixed right-8 top-0 w-64 bg-white rounded-2xl shadow-lg border border-gray-200 py-3 z-50 max-h-screen overflow-y-auto custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: 'white #f3f4f6' }}>
                    {/* Start selling button with exit */}
                    <div className="px-3 pb-3 flex items-center justify-between">
                      <Link 
                        to="/register" 
                        className="inline-flex items-center px-3 py-1.5 rounded-lg font-normal text-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2" 
                        style={{backgroundColor: '#FFF8F0', color: '#F9A822'}}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = '#FFF0E6';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = '#FFF8F0';
                        }}
                        onClick={() => setIsMenuDropdownOpen(false)}
                      >
                        <svg className="w-3 h-3 mr-1.5 border border-orange-500 rounded-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#F9A822'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                        Start selling
                      </Link>
                      <button
                        onClick={() => setIsMenuDropdownOpen(false)}
                        className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Profile Section */}
                    <div className="flex items-center space-x-2 px-3 py-3 border-b border-gray-100">
                      <img 
                        src={avatarIcon} 
                        alt="User avatar" 
                        className="w-12 h-12 rounded-full object-cover"
                        width="48"
                        height="48"
                      />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">My profile</p>
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-gray-900">Jean Kameni</h3>
                          <div className="w-6 h-6 rounded flex items-center justify-center" style={{backgroundColor: '#E3F2FD'}}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#64B5F6'}}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Create a new listing button */}
                    <div className="px-3 py-3">
                      <Link
                        to="/create-listing"
                        className="block w-full px-3 py-2 rounded-lg font-medium text-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{backgroundColor: '#E3F2FD', color: '#64B5F6'}}
                        onClick={() => setIsMenuDropdownOpen(false)}
                      >
                        <div className="flex items-center justify-center space-x-1.5">
                          <span>Create a new listing</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#64B5F6'}}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                      </Link>
                    </div>

                    {/* Navigation Menu Items */}
                    <div className="space-y-0.5 px-2">
                      {/* Chats */}
                      <Link 
                        to="/messages" 
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setIsMenuDropdownOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={messageIcon} alt="Message" className="w-4 h-4" style={{color: '#64B5F6'}} />
                          <div>
                            <div className="font-medium text-sm" style={{color: '#6A6A6A'}}>Chats</div>
                          </div>
                        </div>
                      </Link>

                      {/* My listings */}
                      <Link 
                        to="/my-listings" 
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setIsMenuDropdownOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={boxIcon} alt="Box" className="w-4 h-4" style={{color: '#64B5F6'}} />
                          <div>
                            <div className="font-medium text-sm" style={{color: '#6A6A6A'}}>My listings</div>
                          </div>
                        </div>
                      </Link>

                      {/* My requests */}
                      <Link 
                        to="/my-requests" 
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setIsMenuDropdownOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={groupIcon} alt="Group" className="w-4 h-4" style={{color: '#64B5F6'}} />
                          <div>
                            <div className="font-medium text-sm" style={{color: '#6A6A6A'}}>My requests</div>
                          </div>
                        </div>
                      </Link>

                      {/* Bookmarks */}
                      <Link 
                        to="/bookmarks" 
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setIsMenuDropdownOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={frameIcon} alt="Frame" className="w-4 h-4" style={{color: '#64B5F6'}} />
                          <div>
                            <div className="font-medium text-sm" style={{color: '#6A6A6A'}}>Bookmarks</div>
                          </div>
                        </div>
                      </Link>

                      {/* Help Center */}
                      <Link 
                        to="/help" 
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setIsMenuDropdownOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={podsIcon} alt="Pods" className="w-4 h-4" style={{color: '#64B5F6'}} />
                          <div>
                            <div className="font-medium text-sm" style={{color: '#6A6A6A'}}>Help Center</div>
                          </div>
                        </div>
                      </Link>

                      {/* Settings */}
                      <Link 
                        to="/settings" 
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setIsMenuDropdownOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={settingIcon} alt="Setting" className="w-4 h-4" style={{color: '#64B5F6'}} />
                          <div>
                            <div className="font-medium text-sm" style={{color: '#6A6A6A'}}>Settings</div>
                          </div>
                        </div>
                      </Link>

                      {/* Log Out */}
                      <div className="px-3 pt-3 border-t border-gray-100">
                        <button 
                          onClick={() => setIsMenuDropdownOpen(false)}
                          className="w-full bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6A6A6A'}}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <div className="text-left">
                              <div className="font-medium text-xs" style={{color: '#6A6A6A'}}>Log Out</div>
                              <div className="text-xs" style={{color: '#6A6A6A'}}>Log out of BAO Afrik</div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content - Scrollable */}
      <div className="flex-1 overflow-y-auto py-3 px-4 lg:py-6 sm:px-6 lg:px-8 bg-white lg:bg-[#F5F5F5]">
        {!showSuccessModal ? (
        <div className="max-w-7xl mx-auto">
          {/* Mobile Top Bar - Back Arrow and Drafts Button */}
          <div className="flex items-center justify-between mb-3 lg:hidden px-2">
            {/* Back Arrow */}
            <img 
              src={arrowLeftIcon} 
              alt="Back" 
              className="w-5 h-5 cursor-pointer ml-2" 
              onClick={handleHomepageClick}
            />
            {/* Drafts Button */}
            <button
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg mr-2"
              style={{ backgroundColor: '#F0F8FE' }}
              onClick={() => {
                if (isMobile) {
                  setShowMobileDrafts(true);
                } else {
                  setIsDraftsModalOpen(true);
                }
              }}
            >
              <img src={draftsIcon} alt="Drafts" className="w-3.5 h-3.5" />
              <span className="font-medium text-xs" style={{ color: '#64B5F6' }}>
                Drafts
              </span>
              <span
                className="px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: '#CFE8FC', color: '#64B5F6', fontSize: '0.7rem' }}
              >
                {draftListings.length}
              </span>
            </button>
          </div>

          {/* Desktop Breadcrumbs and Drafts Button */}
          <div className="hidden lg:flex items-center justify-between mb-4">
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
              onClick={() => setIsDraftsModalOpen(true)}
            >
              <img src={draftsIcon} alt="Drafts" className="w-4 h-4" />
              <span className="font-medium text-xs" style={{ color: '#64B5F6' }}>
                Drafts
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: '#CFE8FC', color: '#64B5F6', fontSize: '0.72rem' }}
              >
                {draftListings.length}
              </span>
            </button>
          </div>

          {/* Main Form Container */}
          <div className="bg-white rounded-2xl lg:border lg:border-gray-300 lg:shadow-sm pt-4 lg:pt-10 px-4 lg:px-6 pb-6 lg:pb-16">
            {/* Desktop Form Header */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
                    Create a new listing
                  </h1>
                  <p className="mt-1 text-xs" style={{ color: '#BABABA' }}>Add a new product</p>
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

            {/* Mobile Title Section */}
            <div className="lg:hidden mb-6">
              <h1 className="text-lg font-semibold text-gray-900">
                Create a new listing
              </h1>
              <p className="mt-0.5 text-xs" style={{ color: '#BABABA' }}>Add a new product</p>
            </div>

            {/* Mobile Form Layout */}
            <div className="lg:hidden space-y-3">
              {/* Image Upload Box - Mobile */}
              <div>
                      <div
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`text-center relative image-upload-area ${isDraggingOver ? 'dragging-over' : ''}`}
                        style={{
                          backgroundColor: isImageLoading ? 'transparent' : (isDraggingOver ? 'transparent' : (imageUrls.length > 0 ? 'transparent' : 'white')),
                          background: (isImageLoading || isDraggingOver)
                            ? 'repeating-linear-gradient(-45deg, #F5FBFF, #F5FBFF 18px, #F8FCFF 18px, #F8FCFF 36px)'
                            : (imageUrls.length > 0 ? 'transparent' : 'white'),
                          border: (isImageLoading || isDraggingOver) ? '2px dashed #83C4F8' : '1px solid #E9E9E9',
                          borderRadius: '20px',
                          height: imageUrls.length > 0 ? '260px' : '240px',
                          display: imageUrls.length > 0 ? 'flex' : 'flex',
                          justifyContent: imageUrls.length > 0 ? 'center' : 'center',
                          alignItems: imageUrls.length > 0 ? 'center' : 'center',
                          padding: imageUrls.length > 0 ? '0' : '60px 16px'
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
                       <div className="absolute inset-0 flex items-center justify-center" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                         <img
                           src={imageUrls[primaryImageIndex]}
                           alt="Upload"
                           className="w-full h-full object-cover"
                         />
                       </div>
                      ) : (
                       <div className="flex flex-col items-center justify-center">
                         <img
                           src={imageIcon}
                           alt="Upload"
                           className="mb-4 opacity-60"
                           style={{ width: '64px', height: '64px' }}
                         />
                         <label className="inline-block">
                           <input
                             type="file"
                             multiple
                             accept="image/*"
                             onChange={handleImageUpload}
                             className="hidden"
                           />
                           <span
                             className="px-4 py-1.5 rounded-lg font-medium cursor-pointer inline-block text-xs"
                             style={{ backgroundColor: '#F0F8FE', color: '#64B5F6' }}
                           >
                             Upload Photos
                           </span>
                         </label>
                       </div>
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

                 {/* Image Preview Section - Mobile - Exactly like desktop structure */}
                 {imageUrls.length > 0 && (
                    <div className="flex gap-3 mt-4" style={{ paddingTop: '25px', paddingBottom: '15px' }}>
                      <style>{`
                        .mobile-image-preview-scroll::-webkit-scrollbar {
                          display: none;
                        }
                      `}</style>
                      
                      {/* Conditionally wrap in scrollable container when 4+ images */}
                      {imageUrls.length >= 4 ? (
                        <div 
                          className="relative"
                          style={{ 
                            width: imageUrls.length >= 10 ? '378px' : '294px',
                            height: '100px',
                            paddingTop: '15px',
                            paddingBottom: '15px',
                            marginTop: '-15px',
                            marginBottom: '-15px',
                            overflow: 'hidden'
                          }}
                        >
                          <div 
                            className="mobile-image-preview-scroll flex gap-3"
                            style={{ 
                              overflowX: 'auto',
                              overflowY: 'visible',
                              scrollbarWidth: 'none',
                              msOverflowStyle: 'none',
                              WebkitOverflowScrolling: 'touch',
                              height: '70px',
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
                                width: '70px', 
                                height: '70px',
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
                                  width: '18px',
                                  height: '18px',
                                  backgroundColor: '#4D4D4D',
                                  borderRadius: '50%',
                                  border: '2px solid white',
                                  top: '-9px',
                                  right: '-9px',
                                  zIndex: 20
                                }}
                              >
                                <svg 
                                  width="6" 
                                  height="6" 
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
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#F9A825',
                                    borderRadius: '50%',
                                    border: '2px solid white',
                                    zIndex: 10
                                  }}
                                >
                                  <svg 
                                    width="10" 
                                    height="8" 
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
                          
                          {/* Fade effect on left - Mobile - exactly like desktop */}
                          <div 
                            className="absolute left-0 pointer-events-none"
                            style={{
                              width: '40px',
                              height: '100px',
                              top: '0',
                              background: 'linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
                              zIndex: 15
                            }}
                          />
                          
                          {/* Fade effect on right - Mobile - exactly like desktop */}
                          <div 
                            className="absolute right-0 pointer-events-none"
                            style={{
                              width: '40px',
                              height: '100px',
                              top: '0',
                              background: 'linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
                              zIndex: 15
                            }}
                          />
                        </div>
                      ) : (
                        // Show images without scrollable container when 1-3 images - Mobile
                        imageUrls.map((url, index) => (
                          <div 
                            key={index}
                            className="relative"
                            style={{ 
                              width: '70px', 
                              height: '70px',
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
                                width: '18px',
                                height: '18px',
                                backgroundColor: '#4D4D4D',
                                borderRadius: '50%',
                                border: '2px solid white',
                                top: '-9px',
                                right: '-9px',
                                zIndex: 20
                              }}
                            >
                              <svg 
                                width="6" 
                                height="6" 
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
                                  width: '20px',
                                  height: '20px',
                                  backgroundColor: '#F9A825',
                                  borderRadius: '50%',
                                  border: '2px solid white',
                                  zIndex: 10
                                }}
                              >
                                <svg 
                                  width="10" 
                                  height="8" 
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
                      
                      {/* Upload Next Images Interface - Mobile - Fixed at 4th position (outside container, like desktop) */}
                      {imageUrls.length < 10 && (
                        <div className="flex flex-col items-center" style={{ flexShrink: 0 }}>
                          <label 
                            className="flex items-center justify-center cursor-pointer"
                            style={{
                              width: '70px',
                              height: '70px',
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
                              width="24" 
                              height="24" 
                              viewBox="0 0 32 32"
                              fill="none"
                              stroke="#64B5F6"
                              strokeWidth="2"
                              strokeLinecap="round"
                            >
                              <path d="M16 8V24M8 16H24" />
                            </svg>
                          </label>
                        </div>
                      )}
                    </div>
                 )}
               </div>

              {/* Mobile Location Section */}
              <div className="flex items-start justify-between mt-16 mb-16">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-1 mb-0.5">
                    <img src={locIcon} alt="Location" className="w-3 h-3 hidden" />
                    <span className="text-xs font-medium" style={{ color: '#6A6A6A', fontSize: '0.7rem' }}>Your location</span>
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="text-xs font-medium border-none focus:outline-none ml-0"
                    style={{ color: '#64B5F6', fontSize: '0.7rem' }}
                  />
                </div>
                <button
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap"
                  style={{ backgroundColor: '#F0F8FE', color: '#64B5F6', fontSize: '0.7rem' }}
                >
                  Change location
                </button>
              </div>

              {/* Mobile Title Input */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#6A6A6A' }}>
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter product name"
                  className="create-listing-input w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Mobile Description */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#6A6A6A' }}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="... Describe your product"
                  rows={3}
                  className="create-listing-textarea w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                />
              </div>

              {/* Mobile Price and Quantity Section - Side by Side */}
              <div className="flex items-start gap-3">
                {/* Mobile Price Section */}
                <div className="flex-1" style={{ minWidth: '0' }}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#6A6A6A' }}>
                    Price
                  </label>
                  <div className="relative w-full">
                    <div className="price-input-container flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:border-transparent">
                      {/* Currency Dropdown */}
                      <div className="relative currency-dropdown" style={{ position: 'static' }}>
                        <button
                          type="button"
                          onClick={() => {
                            console.log('Currency button clicked, current state:', isCurrencyDropdownOpen);
                            setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen);
                          }}
                        className="pl-2 pr-1 py-2 border-none focus:outline-none bg-white flex items-center"
                        style={{ color: '#E4E4E4', fontSize: '0.7rem', cursor: 'pointer' }}
                      >
                        <span>{currency}</span>
                        <svg
                          className="w-2.5 h-2.5 ml-0.5"
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
                          style={{ borderRadius: '10px', minWidth: '220px', left: '0', top: 'calc(100% + 6px)' }}
                        >
                          {currencies.map((curr, index) => (
                            <div
                              key={curr.value}
                              className={`w-full ${
                                index === 0 ? 'rounded-t-lg' : ''
                              } ${
                                index === currencies.length - 1 ? 'rounded-b-lg' : ''
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
                                  fontSize: '0.75rem',
                                  padding: '8px 12px',
                                  fontWeight: 500
                                }}
                              >
                                {currency === curr.value && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      left: '6px',
                                      right: '6px',
                                      top: '3px',
                                      bottom: '3px',
                                      backgroundColor: '#F0F8FE',
                                      borderRadius: '6px',
                                      zIndex: 0
                                    }}
                                  />
                                )}
                                <img
                                  src={`https://flagcdn.com/w40/${curr.flagCode}.png`}
                                  alt=""
                                  style={{
                                    width: '20px',
                                    height: '15px',
                                    marginRight: '10px',
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

                      <div style={{ width: '1px', height: '24px', backgroundColor: '#D1D5DB', marginLeft: '6px', marginRight: '6px', flexShrink: 0 }}></div>
                      <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Insert Pricing"
                        className="create-listing-input flex-1 pl-2 pr-2 py-2 border-none focus:outline-none focus:ring-0"
                        style={{ borderLeft: 'none', boxShadow: 'none', fontSize: '0.7rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Quantity */}
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#6A6A6A' }}>
                    Quantity
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg font-medium text-base flex-shrink-0"
                      style={{ backgroundColor: '#E3F2FD', color: '#64B5F6' }}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="px-2.5 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ width: '100%', fontSize: '0.75rem' }}
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg font-medium text-base flex-shrink-0"
                      style={{ backgroundColor: '#E3F2FD', color: '#64B5F6' }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Categories */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#6A6A6A' }}>
                  Categories
                </label>
                <div className="relative category-dropdown w-full">
                  {/* Dropdown Button */}
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="w-full px-2.5 py-2 border border-gray-300 rounded-lg focus:outline-none text-left flex items-center justify-between"
                    style={{ 
                      borderColor: isCategoryDropdownOpen ? '#97CDF9' : '#D1D5DB',
                      boxShadow: isCategoryDropdownOpen ? '0 0 0 2px #97CDF9' : 'none'
                    }}
                  >
                    <span style={{ color: category ? '#6A6A6A' : '#D9D9D9', fontSize: '0.75rem' }}>
                      {category ? categories.find(c => c.value === category)?.label : 'Choose category'}
                    </span>
                    <svg 
                      className="w-3.5 h-3.5" 
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
                      className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 shadow-lg overflow-hidden"
                      style={{ borderRadius: '10px' }}
                    >
                      {categories.map((cat, index) => (
                        <div
                          key={cat.value}
                          className={`w-full ${
                            index === 0 ? 'rounded-t-lg' : ''
                          } ${
                            index === categories.length - 1 ? 'rounded-b-lg' : ''
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
                              fontSize: '0.75rem',
                              padding: '8px 12px',
                              fontWeight: 500
                            }}
                          >
                            {category === cat.value && (
                              <div 
                                style={{
                                  position: 'absolute',
                                  left: '6px',
                                  right: '6px',
                                  top: '3px',
                                  bottom: '3px',
                                  backgroundColor: '#F0F8FE',
                                  borderRadius: '6px',
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

              {/* Mobile Origin of product */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#6A6A6A' }}>
                  Origin of product
                </label>
                <div className="relative origin-dropdown w-full">
                  {/* Dropdown Button */}
                  <button
                    type="button"
                    onClick={() => setIsOriginDropdownOpen(!isOriginDropdownOpen)}
                    className="w-full px-2.5 py-2 border border-gray-300 rounded-lg focus:outline-none text-left flex items-center justify-between"
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
                             width: '18px',
                             height: '13px',
                             marginRight: '8px',
                             borderRadius: '4px',
                             objectFit: 'cover'
                           }}
                         />
                         <span style={{ color: '#6A6A6A', fontSize: '0.75rem', fontWeight: 500 }}>
                           {countries.find(c => c.value === origin)?.label}
                         </span>
                       </div>
                     ) : (
                       <span style={{ color: '#D9D9D9', fontSize: '0.75rem' }}>
                         Choose origin of product
                       </span>
                     )}
                    <svg 
                      className="w-3.5 h-3.5" 
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
                      className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 shadow-lg overflow-y-auto origin-dropdown-scroll"
                      style={{ 
                        borderRadius: '10px',
                        maxHeight: '200px'
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
                          className={`w-full ${
                            index === 0 ? 'rounded-t-xl' : ''
                          } ${
                            index === countries.length - 1 ? 'rounded-b-xl' : ''
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

              {/* Mobile Type of sale */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#6A6A6A' }}>
                  Type of sale
                </label>
                <div className="relative sale-type-dropdown w-full">
                  {/* Dropdown Button */}
                  <button
                    type="button"
                    onClick={() => setIsSaleTypeDropdownOpen(!isSaleTypeDropdownOpen)}
                    className="w-full px-2.5 border border-gray-300 rounded-lg focus:outline-none text-left flex items-center justify-between"
                    style={{
                      borderColor: isSaleTypeDropdownOpen ? '#97CDF9' : '#D1D5DB',
                      boxShadow: isSaleTypeDropdownOpen ? '0 0 0 2px #97CDF9' : 'none',
                      paddingTop: saleType === 'Urgent' ? '4px' : '8px',
                      paddingBottom: saleType === 'Urgent' ? '4px' : '8px'
                    }}
                  >
                    <div className="flex items-center">
                      {saleType === 'Urgent' ? (
                        <div 
                          className="flex items-center"
                          style={{
                            backgroundColor: '#FEF6E9',
                            color: '#F9A825',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: 500
                          }}
                        >
                          <span>Urgent</span>
                          <img 
                            src={path2Icon} 
                            alt=""
                            style={{ 
                              width: '11px',
                              height: '11px',
                              marginLeft: '5px'
                            }}
                          />
                        </div>
                      ) : (
                        <span style={{ color: saleType ? '#6A6A6A' : '#D9D9D9', fontSize: '0.75rem' }}>
                          {saleType ? saleTypes.find(s => s.value === saleType)?.label : 'Choose type of sale'}
                        </span>
                      )}
                    </div>
                    <svg 
                      className="w-3.5 h-3.5" 
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
                      className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 shadow-lg overflow-hidden"
                      style={{ borderRadius: '10px' }}
                    >
                      {saleTypes.map((type, index) => (
                        <div
                          key={type.value}
                          className={`w-full ${
                            index === 0 ? 'rounded-t-lg' : ''
                          } ${
                            index === saleTypes.length - 1 ? 'rounded-b-lg' : ''
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
                              fontSize: '0.75rem',
                              padding: '10px 12px',
                              fontWeight: 500
                            }}
                          >
                            {saleType === type.value && (
                              <div 
                                style={{
                                  position: 'absolute',
                                  left: '6px',
                                  right: '6px',
                                  top: '3px',
                                  bottom: '3px',
                                  backgroundColor: '#F0F8FE',
                                  borderRadius: '6px',
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
                                  width: '12px',
                                  height: '12px',
                                  position: 'relative',
                                  zIndex: 1,
                                  opacity: 0.7,
                                  marginLeft: '6px'
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

              {/* Mobile Delivery available */}
              <div className="py-3 mb-12">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-medium" style={{ color: '#6A6A6A' }}>
                      Delivery available
                    </label>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Lorem ipsum dolor sit amet consectutor
                    </p>
                  </div>
                  <button
                    onClick={() => setDeliveryAvailable(!deliveryAvailable)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      deliveryAvailable ? '' : 'bg-gray-300'
                    }`}
                    style={deliveryAvailable ? { backgroundColor: '#4CD964' } : {}}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        deliveryAvailable ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Mobile Buttons */}
              <div className="flex flex-col items-center space-y-2.5 mt-4">
                <button
                  onClick={handlePostListing}
                  className="flex items-center justify-center space-x-2 w-full py-2 rounded-xl font-medium transition-colors text-sm"
                  style={{ 
                    backgroundColor: isFormComplete ? '#F9A825' : '#E9E9E9', 
                    color: isFormComplete ? '#FFFFFF' : '#6A6A6A',
                    cursor: isFormComplete ? 'pointer' : 'not-allowed'
                  }}
                >
                  <span>Post listing</span>
                  <img 
                    src={flyIcon} 
                    alt="Post" 
                    className="w-4 h-4" 
                    style={{ 
                      filter: isFormComplete 
                        ? 'brightness(0) invert(1)' 
                        : 'none'
                    }}
                  />
                </button>
                <button
                  onClick={handleSaveDraft}
                  className="flex items-center justify-center w-full py-2 rounded-xl font-medium transition-colors text-sm"
                  style={{ color: '#939393' }}
                >
                  <span>Save as draft</span>
                </button>
              </div>
            </div>

            {/* Desktop Form Columns */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        .drafts-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .drafts-scroll::-webkit-scrollbar {
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
                            console.log('Currency button clicked, current state:', isCurrencyDropdownOpen);
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
                                className={`w-full ${
                                  index === 0 ? 'rounded-t-xl' : ''
                                } ${
                                  index === currencies.length - 1 ? 'rounded-b-xl' : ''
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

                      <div style={{ width: '1px', height: '28px', backgroundColor: '#D1D5DB', marginLeft: '10px', marginRight: '10px', flexShrink: 0 }}></div>
                      <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Insert Pricing"
                        className="create-listing-input flex-1 pl-3 pr-3 py-2.5 border-none focus:outline-none focus:ring-0 text-sm"
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
                            className={`w-full ${
                              index === 0 ? 'rounded-t-xl' : ''
                            } ${
                              index === categories.length - 1 ? 'rounded-b-xl' : ''
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
                            className={`w-full ${
                              index === 0 ? 'rounded-t-xl' : ''
                            } ${
                              index === countries.length - 1 ? 'rounded-b-xl' : ''
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
                                fontSize: '0.75rem',
                                padding: '6px 12px',
                                fontWeight: 500
                              }}
                            >
                              {origin === country.value && (
                                <div 
                                  style={{
                                    position: 'absolute',
                                    left: '6px',
                                    right: '6px',
                                    top: '3px',
                                    bottom: '3px',
                                    backgroundColor: '#F0F8FE',
                                    borderRadius: '6px',
                                    zIndex: 0
                                  }}
                                />
                              )}
                              <img
                                src={`https://flagcdn.com/w40/${country.flagCode}.png`}
                                srcSet={`https://flagcdn.com/w80/${country.flagCode}.png 2x`}
                                alt={`${country.label} flag`}
                                style={{ 
                                  width: '20px',
                                  height: '15px',
                                  marginRight: '10px', 
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
                            className={`w-full ${
                              index === 0 ? 'rounded-t-xl' : ''
                            } ${
                              index === saleTypes.length - 1 ? 'rounded-b-xl' : ''
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
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        deliveryAvailable ? '' : 'bg-gray-300'
                      }`}
                      style={deliveryAvailable ? { backgroundColor: '#4CD964' } : {}}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          deliveryAvailable ? 'translate-x-5' : 'translate-x-1'
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
                    className="flex items-center space-x-2 px-16 py-2.5 rounded-xl font-medium transition-colors text-sm"
                    style={{ 
                      backgroundColor: isFormComplete ? '#F9A825' : '#E9E9E9', 
                      color: isFormComplete ? '#FFFFFF' : '#6A6A6A',
                      cursor: isFormComplete ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <span>Post listing</span>
                    <img 
                      src={flyIcon} 
                      alt="Post" 
                      className="w-5 h-5" 
                      style={{ 
                        filter: isFormComplete 
                          ? 'brightness(0) invert(1)' 
                          : 'none'
                      }}
                    />
          </button>
                </div>
              </div>
        </div>
          </div>
        </div>
        ) : null}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-50"
            style={{ backgroundColor: '#0000001A' }}
            onClick={(e) => e.stopPropagation()}
          />
          
          {/* Notification - Far Above Modal */}
          {showNotification && (
            <div 
              className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] animate-slide-down max-w-[300px] lg:max-w-[350px] w-[calc(100%-32px)]"
            >
              <div 
                className="flex items-start space-x-2 lg:space-x-3 p-2.5 lg:p-3 rounded-xl shadow-lg"
                style={{ backgroundColor: '#F5FBFF', border: '1px solid #CFE8FC' }}
              >
                {/* Listing Image */}
                <div className="relative flex-shrink-0">
                  <div 
                    className="w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center overflow-hidden" 
                    style={{ 
                      backgroundColor: '#E3F2FD',
                      border: '2px solid white'
                    }}
                  >
                    {imageUrls[primaryImageIndex] || imageUrls[0] ? (
                      <img 
                        src={imageUrls[primaryImageIndex] || imageUrls[0]} 
                        alt="Listing" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <img src={avatar} alt="Listing" className="w-5 h-5 lg:w-6 lg:h-6 rounded-full object-cover" />
                    )}
                  </div>
                  {/* Listingtoast Icon Badge - Bottom Right */}
                  <div 
                    className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#FFF' }}
                  >
                    <img 
                      src={listingtoastIcon} 
                      alt="Listing" 
                      className="w-2.5 h-2.5 lg:w-3 lg:h-3" 
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] lg:text-xs">
                    <span style={{ color: '#939393' }}>Your listing is </span>
                    <span className="font-semibold" style={{ color: '#212121' }}>under review</span>
                  </p>
                  <p className="text-[11px] lg:text-xs mt-0.5" style={{ color: '#939393' }}>
                    We analyze your listing, Please wait a f.
                  </p>
                </div>

                {/* Close Button */}
                <button 
                  onClick={() => setShowNotification(false)}
                  className="flex-shrink-0 hover:opacity-70 transition-opacity"
                >
                  <svg 
                    className="w-3.5 h-3.5 lg:w-4 lg:h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    style={{ color: '#6A6A6A' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <style>
                {`
                  @keyframes slide-down {
                    from {
                      transform: translate(-50%, -20px);
                      opacity: 0;
                    }
                    to {
                      transform: translate(-50%, 0);
                      opacity: 1;
                    }
                  }
                  .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                  }
                `}
              </style>
            </div>
          )}

          {/* Success Modal - Centered */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div 
              className="bg-white relative rounded-[20px] lg:rounded-[30px] p-8 lg:p-12 max-w-[340px] lg:max-w-[420px] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Verity Icon - Top Center */}
              <div className="flex justify-center mb-4 lg:mb-6">
                <img src={verityIcon} alt="Success" className="w-12 h-12 lg:w-16 lg:h-16" />
              </div>

              {/* Title */}
              <h2 
                className="text-center mb-2 lg:mb-3 text-lg lg:text-[22px]"
                style={{ 
                  color: '#212121', 
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontWeight: '600'
                }}
              >
                Your listing has been registered
              </h2>

              {/* Description */}
              <p 
                className="text-center mb-6 lg:mb-8 text-xs lg:text-sm"
                style={{ 
                  color: '#B0B0B0',
                  lineHeight: '1.5'
                }}
              >
                Lorem ipsum dolor sit amet consectetur. Molestie etiam mattis ornare adipiscing adipiscing.
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-2 lg:gap-3">
                {/* Back to Listing Page Button */}
                <button
                  onClick={handleBackToHomepage}
                  className="flex-1 py-2 lg:py-2.5 rounded-xl font-medium transition-colors text-[9px] lg:text-[10px]"
                  style={{ 
                    backgroundColor: '#F1F1F1',
                    color: '#6A6A6A',
                    borderRadius: '12px'
                  }}
                >
                  Back to listing page ({countdown}s)
                </button>

                {/* Add New Listing Button */}
                <button
                  onClick={handleAddNewListing}
                  className="flex-1 py-2 lg:py-2.5 rounded-xl font-medium transition-colors text-[10px] lg:text-[11px]"
                  style={{ 
                    backgroundColor: 'white',
                    color: '#F9A825',
                    border: '1px solid #F9A825',
                    borderRadius: '12px'
                  }}
                >
                  Add new listing
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {renderDraftsModal()}
    </div>
  );
};

export default CreateListing;
