import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getProductCountry, countries } from '../utils/countryHelpers';
import { getCurrencyDisplaySymbol, formatPriceDisplay, formatRequestPriceRangeLabel } from '../utils/currency';
import { UK_CITIES_PLAIN, formatCityDisplay, getCityPlain } from '../utils/ukCities';
import { productUrlSlug } from '../utils/slug';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

// Import product images from pre folder
import pre1 from '../assets/images/pre/1.png';
import pre3 from '../assets/images/pre/3.png';
import pre7 from '../assets/images/pre/7.png';
import pre10 from '../assets/images/pre/10.png';
import pre13 from '../assets/images/pre/13.png';

import earthIcon from '../assets/images/pre/earth.svg';
import arrowDownIcon from '../assets/images/pre/arrow-down.svg';
import grayArrowIcon from '../assets/images/pre/gray.svg';
import blackArrowIcon from '../assets/images/pre/black.svg';
import locationIcon from '../assets/images/pre/PL.svg';
import bookmarkIcon from '../assets/images/pre/bm.svg';
import verifyIcon from '../assets/images/pre/verify.svg';
// import unverifyIcon from '../assets/images/pre/unverify.svg';
import globyIcon from '../assets/images/pre/globy.svg';
import buyerIcon from '../assets/images/pre/buyer.svg';
import moneyIcon from '../assets/images/pre/money.svg';
import draftsIcon from '../assets/images/pre/drafts.svg';
import bagIcon from '../assets/images/pre/bag.svg';
import locIcon from '../assets/images/pre/Loc.svg';
import requestArrowIcon from '../assets/images/pre/requestarrow.svg';
import shareIcon from '../assets/images/pre/Share.svg';
import requestIcon from '../assets/images/pre/request.svg';

// Import banner images
import cameroonianFashion from '../assets/images/logos/Fashion.png'; // Traditional Kente fabrics
import cameroonianDecor from '../assets/images/logos/decor.png'; // Wooden combs
import cameroonianCulture from '../assets/images/logos/culture.png'; // Traditional woven bag

// Import scan icon
import scanIcon from '../assets/images/logos/scanner (1).png';
import SDicon from '../assets/images/pre/SDicon.svg';

interface BaseProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  category: string;
  origin: string;
  location: string;
  saleType: 'DEFAULT' | 'URGENT';
  deliveryAvailable: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'SOLD' | 'EXPIRED' | 'DELETED';
  images: any[];
  seller: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    rating: number;
    isVerifiedSeller: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface FrontendProduct {
  id: number;
  name: string;
  currency: string;
  price: string;
  image: any;
  location: string;
  verified: boolean;
  category?: string;
  origin?: string;
}

interface CategoryProducts {
  [key: string]: FrontendProduct[];
}

interface NotificationProduct {
  id: number;
  name: string;
  price: number | string;
  image: string;
}

interface Notification {
  id: string;
  product: NotificationProduct;
  timestamp: number;
  type: 'success' | 'error';
  action?: 'added' | 'removed'; // Track whether bookmark was added or removed
}

const Home: React.FC = () => {
  const navigationLocation = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  // BookmarkIcon component matching ProductDetail.tsx
  const BookmarkIcon = ({ saved }: { saved: boolean }) => (
    <div className="w-4 h-4 relative flex items-center justify-center">
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        {!saved && (
          <>
            <path
              d="M12.0837 8.87549H7.91699"
              stroke="#BABABA"
              strokeWidth="1.25"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 6.8418V11.0085"
              stroke="#BABABA"
              strokeWidth="1.25"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
        <path
          d="M14.0166 1.6665H5.98327C4.20827 1.6665 2.7666 3.1165 2.7666 4.88317V16.6248C2.7666 18.1248 3.8416 18.7582 5.15827 18.0332L9.22493 15.7748C9.65827 15.5332 10.3583 15.5332 10.7833 15.7748L14.8499 18.0332C16.1666 18.7665 17.2416 18.1332 17.2416 16.6248V4.88317C17.2888888 3.1165 15.7916 1.6665 14.0166 1.6665Z"
          stroke={saved ? '#64B5F6' : '#BABABA'}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={saved ? '#64B5F6' : 'none'}
        />
      </svg>
      {saved && (
        <svg className="w-2 h-2 absolute text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  );
  const productGridRef = React.useRef<HTMLDivElement>(null);
  const productFeedRef = React.useRef<HTMLDivElement>(null);
  const searchResultsRef = React.useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sellerLocation, setSellerLocation] = useState('');
  const [placeOfOrigin, setPlaceOfOrigin] = useState('');
  const [placeOfOriginInput, setPlaceOfOriginInput] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sharedProducts, setSharedProducts] = useState<Set<number>>(new Set());
  const [savedProducts, setSavedProducts] = useState<Set<number>>(new Set());
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [imageFormData, setImageFormData] = useState<FormData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('searchHistory');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategoryText, setSelectedCategoryText] = useState('');
  const [showPlaceOfOriginDropdown, setShowPlaceOfOriginDropdown] = useState(false);
  const [selectedPlaceOfOriginText, setSelectedPlaceOfOriginText] = useState('');
  const [focusedSearchSection, setFocusedSearchSection] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Handle "Post a Request" button click - check authentication
  const handleMakeRequestClick = () => {
    if (!user) {
      addToast({
        type: 'info',
        title: 'Login Required',
        message: 'Please log in to post a request',
        duration: 3000
      });
      return;
    }
    setShowRequestModal(true);
  };
  const [requestProductName, setRequestProductName] = useState('');
  const [requestProductOrigin, setRequestProductOrigin] = useState('');
  const [requestProductOriginInput, setRequestProductOriginInput] = useState('');
  const [requestSellerLocation, setrequestSellerLocation] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
  const [requestPriceRange, setRequestPriceRange] = useState('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [products, setProducts] = useState<BaseProduct[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<FrontendProduct[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [requestBuyerLocation, setRequestBuyerLocation] = useState('');
  const [requestFilterCountry, setRequestFilterCountry] = useState('');
  const [requestFilterPrice, setRequestFilterPrice] = useState('');
  const [location, setLocation] = useState('London');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [categoryPages, setCategoryPages] = useState<Record<string, number>>({});
  const productsPerPage = 6; // Number of products to show per page for categories

  // Mobile filter and search flow states
  const [showMobileFilterPage, setShowMobileFilterPage] = useState(false);
  const [showMobileSearchFlow, setShowMobileSearchFlow] = useState(false);
  const [filterPageOpenedFrom, setFilterPageOpenedFrom] = useState<'home' | 'search'>('home');
  const [mobileFilterCategory, setMobileFilterCategory] = useState('');
  const [mobileFilterProductOrigin, setMobileFilterProductOrigin] = useState('');
  const [mobileFilterSellerLocation, setMobileFilterSellerLocation] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isProductOriginDropdownOpen, setIsProductOriginDropdownOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [mobileSearchSubmitted, setMobileSearchSubmitted] = useState(false);
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
  const [showMobileSearchHistory, setShowMobileSearchHistory] = useState(false);
  const [showSellerLocationSuggestions, setShowSellerLocationSuggestions] = useState(false);
  const [isRequestProductOriginDropdownOpen, setIsRequestProductOriginDropdownOpen] = useState(false);
  const requestProductOriginDropdownRef = React.useRef<HTMLDivElement>(null);
  const [mobileCountryPickerOpen, setMobileCountryPickerOpen] = useState(false);
  const [mobileCountryPickerPosition, setMobileCountryPickerPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const mobileCountryPickerRef = React.useRef<HTMLDivElement>(null);
  const homeCountryPickerRef = React.useRef<HTMLDivElement>(null);
  const mobileCountryPickerPortalRef = React.useRef<HTMLDivElement>(null);
  const [hoveredCategoryOption, setHoveredCategoryOption] = useState<string | null>(null);
  const [hoveredOriginOption, setHoveredOriginOption] = useState<string | null>(null);

  const filterDropdownRef = React.useRef<HTMLDivElement>(null);
  const priceDropdownRef = React.useRef<HTMLDivElement>(null);
  const locationDropdownRef = React.useRef<HTMLDivElement>(null);
  const [openFilterDropdown, setOpenFilterDropdown] = useState<string | null>(null);
  const [openPriceDropdown, setOpenPriceDropdown] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isChangeLocationInputFocused, setIsChangeLocationInputFocused] = useState(false);
  const [changeLocationQuery, setChangeLocationQuery] = useState('');
  const [changeLocationSuggestions, setChangeLocationSuggestions] = useState<string[]>([]);
  const [hoveredLocationSuggestion, setHoveredLocationSuggestion] = useState<string | null>(null);
  const [requestUserLocation, setRequestUserLocation] = useState('');
  const [showChangeLocationModal, setShowChangeLocationModal] = useState(false);
  const [showCookiesModal, setShowCookiesModal] = useState(false);

  const locationSuggestions = [
    'Pakse, Laos',
    'Palermo, Italy',
    'Panama City, Panama',
    'Paris, France',
    'Patna, India',
    'Perth, Australia',
    'Philadelphia, USA',
    'Phnom Penh, Cambodia',
    'Prague, Czech Republic',
    'Porto, Portugal',
    'Portland, USA',
    'Pune, India',
    'London, United Kingdom',
    'New York, USA',
    'Toronto, Canada',
    'Berlin, Germany',
    'Sydney, Australia',
    'Dubai, UAE'
  ];

  const priceOptions = [
    { label: 'All', value: '' },
    { label: 'Less than £10', value: 'less-than-10' },
    { label: '£10 ~ £50', value: '10-50' },
    { label: '£50 ~ £100', value: '50-100' },
    { label: '£100 ~ £200', value: '100-200' },
    { label: 'More than £200', value: 'more-than-200' }
  ];

  // Get filtered location suggestions (mobile filter – UK cities, plain stored)
  const getFilteredLocationSuggestions = () => {
    if (!mobileFilterSellerLocation.trim()) return UK_CITIES_PLAIN.slice(0, 6);
    const query = mobileFilterSellerLocation.toLowerCase();
    return UK_CITIES_PLAIN.filter(
      (loc) =>
        loc.toLowerCase().startsWith(query) ||
        loc.toLowerCase().includes(query) ||
        formatCityDisplay(loc).toLowerCase().includes(query)
    ).slice(0, 6);
  };
  const categoryDropdownRef = React.useRef<HTMLDivElement>(null);
  const productOriginDropdownRef = React.useRef<HTMLDivElement>(null);

  const getFilteredSellerLocationSuggestions = () => {
    const query = sellerLocation.trim().toLowerCase();
    if (!query) return UK_CITIES_PLAIN.slice(0, 6);
    return UK_CITIES_PLAIN.filter(
      (loc) =>
        loc.toLowerCase().startsWith(query) ||
        loc.toLowerCase().includes(query) ||
        formatCityDisplay(loc).toLowerCase().includes(query)
    ).slice(0, 8);
  };

  // Ref to prevent duplicate product fetches within the same render cycle (React StrictMode)
  const fetchingProductsRef = useRef(false);

  // UseEffect for fetching products
  useEffect(() => {
    // Only prevent if currently fetching (to avoid duplicate calls in StrictMode)
    if (fetchingProductsRef.current) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000); // 10 second timeout

    const fetchWithTimeout = async () => {
      fetchingProductsRef.current = true;
      try {
        await fetchProducts(controller.signal);
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          setError('Request timeout - using local data');
        }
      } finally {
        clearTimeout(timeoutId);
        fetchingProductsRef.current = false;
      }
    };

    fetchWithTimeout();

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
      // Reset ref on cleanup to allow refetch if component remounts
      fetchingProductsRef.current = false;
    };
  }, []);

  // fetch products from API
  const fetchProducts = async (signal?: AbortSignal) => {

    setIsLoading(true);
    setError(null);

    try {
      // First, fetch with a reasonable limit to get the total count
      const initialResponse = await fetch(`${process.env.REACT_APP_API_URL}/products?limit=100&page=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal
      });

      if (!initialResponse.ok) {
        throw new Error(`HTTP ${initialResponse.status}: ${await initialResponse.text()}`);
      }

      const initialResult = await initialResponse.json();

      // Extract total count from response
      let allProducts: BaseProduct[] = [];
      let totalProducts = 0;

      if (initialResult.success && initialResult.data) {
        totalProducts = initialResult.data.total || 0;
        allProducts = initialResult.data.products || [];

        // If there are more products than the initial fetch, fetch all of them
        if (totalProducts > 100 && totalProducts > allProducts.length) {
          const fullResponse = await fetch(`${process.env.REACT_APP_API_URL}/products?limit=${totalProducts}&page=1`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal
          });

          if (fullResponse.ok) {
            const fullResult = await fullResponse.json();
            if (fullResult.success && fullResult.data && fullResult.data.products) {
              allProducts = fullResult.data.products;
            }
          }
        }
      }

      // Set all products
      if (allProducts.length > 0) {
        setProducts(allProducts);
      }

    } catch (error: any) {
      if (error?.name === 'AbortError') {
        // silently ignore aborted requests
        return;
      }
      setError(`API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Read category from URL params on mount and when URL changes
  useEffect(() => {
    const params = new URLSearchParams(navigationLocation.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      const decodedCategory = decodeURIComponent(categoryParam);
      setActiveCategory(decodedCategory);
      setSelectedCategory(decodedCategory);
      setSelectedCategoryText(decodedCategory);
      // Scroll to product feed when category is selected
      setTimeout(() => {
        if (productFeedRef.current) {
          productFeedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } else {
      // Reset if no category in URL
      setActiveCategory('All');
      setSelectedCategory('');
      setSelectedCategoryText('');
    }
  }, [navigationLocation.search]);

  const requestsScrollRef = useRef<HTMLDivElement>(null);
  // Ref to prevent duplicate requests fetch within the same render cycle
  const fetchingRequestsRef = useRef(false);
  const lastRequestFiltersRef = useRef<string | null>(null);
  const requestsMountFetchDoneRef = useRef(false);

  // Fetch requests on mount (same pattern as products) so cards show immediately
  useEffect(() => {
    if (fetchingRequestsRef.current) return;
    const controller = new AbortController();
    const doFetch = async () => {
      fetchingRequestsRef.current = true;
      try {
        setIsLoadingRequests(true);
        setRequestsError(null);
        const token = localStorage.getItem('accessToken');
        const queryParams = new URLSearchParams({ limit: '3', page: '1' });
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const response = await fetch(`${process.env.REACT_APP_API_URL}/requests?${queryParams.toString()}`, {
          method: 'GET',
          headers,
          signal: controller.signal
        });
        if (!response.ok) throw new Error('Failed to fetch requests');
        const result = await response.json();
        let requestsArray: any[] = [];
        if (result.success && result.data) {
          if (Array.isArray(result.data)) requestsArray = result.data;
          else if (result.data.requests && Array.isArray(result.data.requests)) requestsArray = result.data.requests;
          else if (result.data.data && Array.isArray(result.data.data)) requestsArray = result.data.data;
        } else if (Array.isArray(result)) requestsArray = result;
        else if (result.data && Array.isArray(result.data)) requestsArray = result.data;
        setRequests(requestsArray);
        lastRequestFiltersRef.current = '--';
        requestsMountFetchDoneRef.current = true;
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          setRequestsError('Failed to load requests. Please try again later.');
        }
      } finally {
        setIsLoadingRequests(false);
        fetchingRequestsRef.current = false;
      }
    };
    doFetch();
    return () => {
      controller.abort();
      fetchingRequestsRef.current = false;
    };
  }, []);

  // Refetch requests when filters change
  useEffect(() => {
    const filterKey = `${requestBuyerLocation}-${requestFilterCountry}-${requestFilterPrice}`;
    if (fetchingRequestsRef.current) return;
    // Skip initial run with no filters (mount effect already fetched)
    if (!requestsMountFetchDoneRef.current && filterKey === '--') return;
    if (lastRequestFiltersRef.current === filterKey) return;

    const controller = new AbortController();
    const fetchRequests = async () => {
      fetchingRequestsRef.current = true;
      try {
        setIsLoadingRequests(true);
        setRequestsError(null);

        const token = localStorage.getItem('accessToken');

        // Build query params with filters
        const queryParams = new URLSearchParams({
          limit: '3',
          page: '1'
        });
        if (requestBuyerLocation) {
          queryParams.append('sellerLocation', requestBuyerLocation);
        }
        if (requestFilterCountry) {
          queryParams.append('origin', requestFilterCountry);
        }
        if (requestFilterPrice) {
          // Parse price range and convert to minPrice/maxPrice
          const priceRanges: Record<string, { min?: number; max?: number }> = {
            'less-than-10': { max: 10 },
            '10-50': { min: 10, max: 50 },
            '50-100': { min: 50, max: 100 },
            '100-200': { min: 100, max: 200 },
            'more-than-200': { min: 200 }
          };
          const range = priceRanges[requestFilterPrice];
          if (range) {
            if (range.min !== undefined) {
              queryParams.append('minPrice', range.min.toString());
            }
            if (range.max !== undefined) {
              queryParams.append('maxPrice', range.max.toString());
            }
          }
        }

        // Only include auth header if token exists
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/requests?${queryParams.toString()}`, {
          method: 'GET',
          headers,
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }

        const result = await response.json();

        // Handle response format: { success: true, data: [...], pagination: {...} }
        let requestsArray: any[] = [];

        if (result.success && result.data) {
          // If data is an array, use it directly
          if (Array.isArray(result.data)) {
            requestsArray = result.data;
          }
          // If data is an object with a requests/items property, extract it
          else if (result.data.requests && Array.isArray(result.data.requests)) {
            requestsArray = result.data.requests;
          }
          // If data is an object with a data property (nested), extract it
          else if (result.data.data && Array.isArray(result.data.data)) {
            requestsArray = result.data.data;
          }
        }
        // Fallback: check if result itself is an array
        else if (Array.isArray(result)) {
          requestsArray = result;
        }
        // Fallback: check if result.data exists and is an array (without success flag)
        else if (result.data && Array.isArray(result.data)) {
          requestsArray = result.data;
        }

        setRequests(requestsArray);
        lastRequestFiltersRef.current = filterKey;
        requestsMountFetchDoneRef.current = true;

      } catch (error: any) {
        if (error?.name === 'AbortError') {
          fetchingRequestsRef.current = false;
          return;
        }
        setRequestsError('Failed to load requests. Please try again later.');
        lastRequestFiltersRef.current = null;
      } finally {
        setIsLoadingRequests(false);
        fetchingRequestsRef.current = false;
      }
    };
    fetchRequests();
    return () => {
      controller.abort();
    };
  }, [requestBuyerLocation, requestFilterCountry, requestFilterPrice]);

  const getDefaultProductImage = (category: string | undefined): any => {
    const categoryImages: { [key: string]: any } = {
      'Food & Spices': pre1,
      'Fashion & Textiles': pre7,
      'Beauty & Wellness': pre13,
      'Home & Decor': pre10,
      'Books & Media': pre3,
      'food': pre1,
      'fashion': pre7,
      'beauty': pre13,
      'home': pre10,
      'books': pre3
    };

    const categoryKey = category || 'Other';
    return categoryImages[categoryKey] || pre1;
  };

  const transformToFrontendProducts = (apiProducts: any[]): FrontendProduct[] => {
    if (!apiProducts || !Array.isArray(apiProducts)) {
      console.warn('Invalid products data for transformation:', apiProducts);
      return [];
    }

    return apiProducts.map((product: any, index: number) => {
      try {
        const productId = product.id || `product-${index}`;
        const productName = product.title || product.name || 'Unknown Product';
        const productPrice = product.price || '0';
        const productCurrency = product.currency || 'GBP';
        const productCategory = product.category || 'Other';
        const productLocation = product.location || product.seller?.location || 'Unknown Location';
        const productOrigin = product.origin || product.placeOfOrigin || '';
        const isVerified = product.seller?.isVerifiedSeller || false;

        let productImage;
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
          productImage = product.images[0]?.url || product.images[0];
        }

        if (!productImage) {
          productImage = getDefaultProductImage(productCategory);
        }

        return {
          id: productId,
          name: productName,
          price: productPrice.toString(),
          currency: productCurrency,
          image: productImage,
          location: productLocation,
          origin: productOrigin,
          verified: isVerified,
          category: productCategory
        };

      } catch (error) {
        console.error('Error transforming product:', error, product);
        return {
          id: `error-${index}`,
          name: 'Invalid Product',
          price: '0',
          currency: 'GBP',
          image: getDefaultProductImage('Other'),
          location: 'Unknown',
          origin: '',
          verified: false,
          category: 'Other'
        };
      }
    });
  };

  const getAllProducts = (): FrontendProduct[] => {
    // Filter to only show products with PUBLISHED status
    const activeProducts = products.filter(product => product.status === 'PUBLISHED');
    return transformToFrontendProducts(activeProducts);
  };

  const getAllProductsByCategory = (): CategoryProducts => {
    const productsToUse = getAllProducts();

    const categorized = productsToUse.reduce((acc: CategoryProducts, product: FrontendProduct) => {
      const category = product.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as CategoryProducts);

    return categorized;
  };

  const allProductsComputed = React.useMemo(() => {
    return getAllProductsByCategory();
  }, [products]);

  // Banner slides data
  const bannerSlides = [
    {
      id: 1,
      title: "African Spices & Sauces",
      description: "Discover our authentic spices and traditional blends from Africa",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
      category: "Food & Spices"
    },
    {
      id: 2,
      title: "African Fashion",
      description: "Beautiful traditional Kente and handwoven African fabrics",
      image: cameroonianFashion, // Traditional fabrics image
      category: "Fashion & Textiles"
    },
    {
      id: 3,
      title: "African Decor",
      description: "Handcrafted wooden combs and authentic traditional accessories",
      image: cameroonianDecor, // Wooden combs image
      category: "Home & Decor"
    },
    {
      id: 4,
      title: "African Culture",
      description: "Traditional woven bags and unique handmade cultural crafts",
      image: cameroonianCulture, // Traditional woven bag image
      category: "Books & Media"
    }
  ];

  const defaultCategories = [
    'All',
    'Food & Spices',
    'Fashion & Textiles',
    'Beauty & Wellness',
    'Home & Decor',
    'Books & Media'
  ];

  const categories = React.useMemo(() => {
    const uniqueCategories = new Set<string>(defaultCategories);

    const products = getAllProducts();
    products.forEach(p => {
      if (p.category) {
        uniqueCategories.add(p.category);
      }
    });

    return Array.from(uniqueCategories);
  }, [products]);

  // Use countries from countryHelpers for consistency
  const africanCountries = countries
    .map(c => ({ name: c.name, code: c.code, flag: c.flag }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Format price range for requests (display as £50, not GBP)
  const formatPriceRange = (minPrice: number | null | undefined, maxPrice: number | null | undefined, currency: string | null | undefined): string => {
    const min = minPrice ?? 0;
    const max = maxPrice ?? 1000;
    const symbol = getCurrencyDisplaySymbol(currency);

    if (min === 0 && max >= 1000000) {
      return `Any price ${symbol}`;
    } else if (min === 0) {
      return `Less than ${symbol}${max}`;
    } else if (max >= 1000000) {
      return `More than ${symbol}${min}`;
    } else {
      return `${symbol}${min} - ${symbol}${max}`;
    }
  };

  // Get products to display
  const productsToDisplay = React.useMemo(() => {
    if (isSearchActive) {
      return searchResults;
    }

    let displayProducts: FrontendProduct[] = [];
    if (activeCategory === 'All') {
      displayProducts = Object.values(allProductsComputed).flat();
    } else {
      displayProducts = allProductsComputed[activeCategory] || [];
    }

    // Apply country filter if selected
    if (selectedCountry) {
      const beforeCount = displayProducts.length;
      displayProducts = displayProducts.filter((product: FrontendProduct) =>
        getProductCountry(product.origin).name === selectedCountry
      );
    }

    return displayProducts;
  }, [isSearchActive, searchResults, activeCategory, allProductsComputed, selectedCountry]);

  // compute totalPages for pagination
  const itemsPerPage = 20;
  const totalPages = React.useMemo(() => {
    const totalItems = productsToDisplay.length;
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [productsToDisplay.length, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, selectedCountry, isSearchActive, searchResults.length]);

  // Scroll to top when page changes
  useEffect(() => {
    if (productGridRef.current) {
      productGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  // Get products to display with pagination applied
  const getProductsToDisplay = (): FrontendProduct[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return productsToDisplay.slice(startIndex, endIndex);
  };

  // Check if we should show "no results" state
  const shouldShowNoResultsState = () => {
    const products = productsToDisplay;
    const hasNoProducts = products.length === 0;

    // Show no results if searching and no results
    if (isSearchActive && hasNoProducts) {
      return true;
    }

    // Show no results if a category is selected (not "All") and it has no products
    if (activeCategory !== 'All' && hasNoProducts) {
      return true;
    }

    // Show no results if a country filter is applied and no products match
    if (selectedCountry && hasNoProducts) {
      return true;
    }

    return false;
  };


  useEffect(() => {
    if (searchQuery.trim() || selectedPlaceOfOriginText || sellerLocation.trim()) {
      handleSearch();
    }
  }, [searchQuery, selectedPlaceOfOriginText, sellerLocation, products]);

  // Clear search and return to category view
  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCategoryText('');
    setSellerLocation('');
    setPlaceOfOrigin('');
    setSelectedPlaceOfOriginText('');
    setSearchResults([]);
    setIsSearchActive(false);
    setSelectedCountry('');
  };

  const resetAllFilters = (sectionId: string = 'default') => {
    const isRequestSection = sectionId === 'buy-sell';

    // Reset search query
    setSearchQuery('');
    setMobileSearchQuery('');
    setMobileSearchSubmitted(false);

    // Reset category filters
    setSelectedCategory('');
    setSelectedCategoryText('');
    setActiveCategory('All');

    // Reset location/origin filters based on section
    if (isRequestSection) {
      setRequestFilterCountry('');
      setRequestFilterPrice('');
      setRequestBuyerLocation('');
    } else {
      setSelectedCountry('');
      setPlaceOfOrigin('');
      setPlaceOfOriginInput('');
      setSelectedPlaceOfOriginText('');
      setSellerLocation('');
      setIsSearchActive(false);
      setSearchResults([]);
    }

    // Reset price filter
    setSelectedPrice('');

    // Close any open dropdowns
    setOpenFilterDropdown(null);
    setOpenPriceDropdown(null);

    // Reset mobile filters if open
    if (showMobileFilterPage) {
      setShowMobileFilterPage(false);
    }
  };

  // Handle product navigation - check if user owns the product and navigate with owner view state
  const handleProductClick = async (e: React.MouseEvent, productId: string | number) => {
    e.preventDefault();

    // Track product click/engagement
    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/view`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      // Silently fail - don't block navigation
      console.error('Failed to track product view:', error);
    }

    // Find the original product from the products array
    const originalProduct = products.find(p => String(p.id) === String(productId));

    // Check if the current user is the owner
    if (user && originalProduct && originalProduct.seller && String(originalProduct.seller.id) === String(user.id)) {
      // Navigate with owner view state (similar to CreateListing)
      const productData = {
        id: originalProduct.id,
        title: originalProduct.title,
        price: originalProduct.price?.toString() || '0',
        currency: originalProduct.currency || 'GBP',
        image: originalProduct.images?.[0]?.url || '',
        status: 'inactive' as const,
        rating: 0,
        reviews: 0,
        createdAt: new Date(originalProduct.createdAt).getTime(),
        priceValue: parseFloat(originalProduct.price?.toString() || '0'),
        messages: 0,
        category: originalProduct.category || '',
        reviewStatus: 'success' as const
      };

      const slug = productUrlSlug({ slug: (originalProduct as any)?.slug, title: originalProduct.title });
      window.scrollTo(0, 0);
      navigate(`/product/${slug}`, {
        state: {
          fromMyListings: true,
          listing: productData,
          sellerVerified: originalProduct.seller.isVerifiedSeller || false
        }
      });
    } else {
      // Navigate normally for products the user doesn't own
      const slug = productUrlSlug({ slug: (originalProduct as any)?.slug, title: originalProduct?.title, id: String(productId) });
      window.scrollTo(0, 0);
      navigate(`/product/${slug}`);
    }
  };

  // Auto-slide functionality
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === bannerSlides.length - 1 ? 0 : prevSlide + 1
      );
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(slideInterval);
  }, [bannerSlides.length]);

  // mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setOpenFilterDropdown(null);
      }
      if (priceDropdownRef.current && !priceDropdownRef.current.contains(event.target as Node)) {
        setOpenPriceDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Function to update cookie preferences on backend
  const updateCookiePreferences = async (preferences: string) => {
    if (!user) {
      // If user is not logged in, just store in localStorage
      localStorage.setItem('cookiesAccepted', preferences);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        localStorage.setItem('cookiesAccepted', preferences);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/cookie-preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ preferences })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          localStorage.setItem('cookiesAccepted', preferences);
        }
      } else {
        // If API call fails, still store in localStorage
        localStorage.setItem('cookiesAccepted', preferences);
        console.warn('Failed to update cookie preferences on server, stored locally');
      }
    } catch (error) {
      // If API call fails, still store in localStorage
      localStorage.setItem('cookiesAccepted', preferences);
      console.error('Error updating cookie preferences:', error);
    }
  };

  // Check if cookies modal should be shown on first visit (logged in or not)
  useEffect(() => {
    const cookiesModalSeen = localStorage.getItem('cookiesModalSeen');
    if (!cookiesModalSeen) {
      setShowCookiesModal(true);
    }
  }, []);

  // Re-run search when country filter changes and search is active
  useEffect(() => {
    if (isSearchActive) {
      // Automatically apply country filter to current search results
      let products = Object.values(allProductsComputed).flat();

      // Reapply all search filters
      if (searchQuery.trim()) {
        products = products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedCategoryText) {
        products = products.filter(product => {
          return Object.entries(allProductsComputed).some(([category, categoryProducts]) =>
            category === selectedCategoryText && categoryProducts.some(p => p.id === product.id)
          );
        });
      }

      if (selectedPlaceOfOriginText) {
        products = products.filter(product => {
          const country = getProductCountry(product.origin).name;
          return country === selectedPlaceOfOriginText;
        });
      }

      if (selectedCountry) {
        products = products.filter(product =>
          getProductCountry(product.origin).name === selectedCountry
        );
      }

      if (sellerLocation.trim()) {
        const locPlain = sellerLocation.toLowerCase().trim();
        products = products.filter(product =>
          getCityPlain(product.location || '').toLowerCase().includes(locPlain)
        );
      }

      setSearchResults(products);
    }
  }, [selectedCountry]);

  // Handle image data from ImageSearch page
  useEffect(() => {
    const state = navigationLocation.state as any;
    if (state?.selectedImage && state?.selectedImageUrl) {
      setSelectedImage(state.selectedImage);
      setSelectedImageUrl(state.selectedImageUrl);

      // Recreate FormData since it cannot be cloned in history state
      const formData = new FormData();
      formData.append('image', state.selectedImage);
      formData.append('timestamp', new Date().toISOString());
      setImageFormData(formData);

      // Open mobile search flow if requested
      if (state.openSearchFlow && isMobile) {
        setShowMobileSearchFlow(true);
      }

      // Clear the state to prevent re-processing
      window.history.replaceState({}, document.title);
    }
  }, [navigationLocation.state, isMobile]);

  // Handle click outside for filter dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(target)) {
        setIsCategoryDropdownOpen(false);
      }
      if (productOriginDropdownRef.current && !productOriginDropdownRef.current.contains(target)) {
        setIsProductOriginDropdownOpen(false);
      }
      if (requestProductOriginDropdownRef.current && !requestProductOriginDropdownRef.current.contains(target)) {
        setIsRequestProductOriginDropdownOpen(false);
      }
      if (mobileCountryPickerOpen &&
        (!mobileCountryPickerPortalRef.current || !mobileCountryPickerPortalRef.current.contains(target)) &&
        (mobileCountryPickerRef.current ? !mobileCountryPickerRef.current.contains(target) : true) &&
        (homeCountryPickerRef.current ? !homeCountryPickerRef.current.contains(target) : true)) {
        setMobileCountryPickerOpen(false);
        setMobileCountryPickerPosition(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Render price filter button with dropdown
  const renderPriceFilterButton = (position: 'relative' | 'absolute' = 'relative', sectionId: string = 'default') => {
    const isRequestSection = sectionId === 'buy-sell';
    const currentPrice = isRequestSection ? requestFilterPrice : selectedPrice;
    const setCurrentPrice = isRequestSection ? setRequestFilterPrice : setSelectedPrice;
    const isOpen = openPriceDropdown === sectionId;
    const selectedPriceOption = priceOptions.find(opt => opt.value === currentPrice);

    return (
      <div ref={sectionId === 'default' ? priceDropdownRef : null} style={{ position, zIndex: 20 }}>
        {currentPrice ? (
          // Selected price pill
          <div
            className="flex items-center gap-2 px-3 py-1.5"
            style={{
              backgroundColor: '#F0F8FE',
              width: 'fit-content',
              borderRadius: '8px'
            }}
          >
            <span style={{ color: '#64B5F6', fontSize: isMobile ? '10px' : '14px', fontFamily: 'Poppins, sans-serif' }}>
              {selectedPriceOption?.label || currentPrice}
            </span>
            <button
              onClick={() => setCurrentPrice('')}
              className="flex items-center justify-center"
              style={{
                width: '16px',
                height: '16px',
                cursor: 'pointer'
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 3L3 9M3 3L9 9" stroke="#64B5F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        ) : (
          // Price filter button
          <button
            onClick={() => setOpenPriceDropdown(isOpen ? null : sectionId)}
            className="flex items-center transition-colors hover:bg-gray-50"
            style={{
              backgroundColor: isMobile ? '#FFFFFF' : '#FAFAFA',
              border: isMobile ? 'none' : '1px solid #E4E4E4',
              padding: isMobile ? '5px 8px' : '7px 14px',
              borderRadius: '8px',
              fontFamily: 'Poppins, sans-serif',
              gap: isMobile ? '4px' : '6px'
            }}
          >
            <span style={{ color: '#BABABA', fontSize: isMobile ? '10px' : '14px', fontWeight: 'normal' }}>Price :</span>
            <span style={{ color: '#6A6A6A', fontSize: isMobile ? '10px' : '14px' }}>All</span>
            <img
              src={arrowDownIcon}
              alt="Arrow"
              style={{
                width: isMobile ? '12px' : '16px',
                height: isMobile ? '12px' : '16px',
                transform: isOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s'
              }}
            />
          </button>
        )}

        {/* Dropdown Menu */}
        {isOpen && !currentPrice && (
          <div
            className="absolute left-0 bg-white z-10 mt-2"
            style={{
              width: isMobile ? '140px' : '180px',
              flexShrink: 0,
              borderRadius: isMobile ? '12px' : '16px',
              boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
              border: '1px solid #E9E9E9'
            }}
          >
            <div className={isMobile ? 'py-1' : 'py-1.5'}>
              {priceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setCurrentPrice(option.value);
                    setOpenPriceDropdown(null);
                  }}
                  style={{
                    color: currentPrice === option.value ? '#64B5F6' : '#B0B0B0',
                    fontSize: isMobile ? '10px' : '12px',
                    padding: isMobile ? '6px 10px' : '8px 12px'
                  }}
                  className="w-full text-left hover:bg-gray-50 transition-colors relative"
                >
                  {currentPrice === option.value && (
                    <div
                      style={{
                        position: 'absolute',
                        left: isMobile ? '6px' : '8px',
                        right: isMobile ? '6px' : '8px',
                        top: '2px',
                        bottom: '2px',
                        backgroundColor: '#F0F8FE',
                        borderRadius: '8px',
                        zIndex: -1
                      }}
                    />
                  )}
                  <span style={{ position: 'relative', zIndex: 1 }}>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render country filter button with dropdown
  const renderCountryFilterButton = (position: 'relative' | 'absolute' = 'relative', sectionId: string = 'default') => {
    const isRequestSection = sectionId === 'buy-sell';
    const currentCountry = isRequestSection ? requestFilterCountry : selectedCountry;
    const setCurrentCountry = isRequestSection ? setRequestFilterCountry : setSelectedCountry;
    const selectedCountryData = currentCountry ? africanCountries.find(c => c.name === currentCountry) : null;
    const isOpen = openFilterDropdown === sectionId;

    return (
      <div ref={sectionId === 'default' ? filterDropdownRef : null} style={{ position, zIndex: 20 }}>
        {currentCountry ? (
          // Selected country pill
          <div
            className="flex items-center gap-2 px-3 py-1.5"
            style={{
              backgroundColor: '#F0F8FE',
              width: 'fit-content',
              borderRadius: '8px'
            }}
          >
            <img
              src={selectedCountryData?.flag || ''}
              alt={selectedCountry}
              className="w-4 h-4 object-cover rounded-full"
              style={{ width: '16px', height: '16px' }}
            />
            <span style={{ color: '#64B5F6', fontSize: isMobile ? '10px' : '14px', fontFamily: 'Poppins, sans-serif' }}>
              {currentCountry}
            </span>
            <button
              onClick={() => {
                resetAllFilters(sectionId);
                setCurrentCountry('');
              }}
              className="flex items-center justify-center"
              style={{
                width: '16px',
                height: '16px',
                cursor: 'pointer'
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 3L3 9M3 3L9 9" stroke="#64B5F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        ) : (
          // Filter button
          <button
            onClick={() => setOpenFilterDropdown(isOpen ? null : sectionId)}
            className="flex items-center transition-colors hover:bg-gray-50"
            style={{
              backgroundColor: isMobile ? '#FFFFFF' : '#FAFAFA',
              border: isMobile ? 'none' : '1px solid #E4E4E4',
              padding: isMobile ? '5px 7px' : '7px 10px',
              borderRadius: '8px',
              fontFamily: 'Poppins, sans-serif',
              gap: isMobile ? '4px' : '6px'
            }}
          >
            {!isMobile && <span style={{ color: '#BABABA', fontSize: '14px', fontWeight: 'normal' }}>Origin :</span>}
            <img src={earthIcon} alt="Globe" style={{ width: isMobile ? '16px' : '22px', height: isMobile ? '16px' : '22px' }} />
            <span style={{ color: '#6A6A6A', fontSize: isMobile ? '10px' : '14px' }}>Africa</span>
            <img
              src={arrowDownIcon}
              alt="Arrow"
              style={{
                width: isMobile ? '12px' : '16px',
                height: isMobile ? '12px' : '16px',
                transform: isOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s'
              }}
            />
          </button>
        )}

        {/* Dropdown Menu */}
        {isOpen && !currentCountry && (
          <div
            className="absolute left-0 bg-white border border-gray-200 z-10 mt-2"
            style={{
              width: isMobile ? '160px' : '200px',
              flexShrink: 0,
              borderRadius: isMobile ? '12px' : '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            <style>
              {`
                .filter-dropdown-scroll::-webkit-scrollbar {
                  width: 2px;
                }
                .filter-dropdown-scroll::-webkit-scrollbar-track {
                  background: transparent;
                }
                .filter-dropdown-scroll::-webkit-scrollbar-thumb {
                  background-color: #E4E4E4;
                  border-radius: 10px;
                }
              `}
            </style>

            {/* Scrollable Country List */}
            <div
              className={`overflow-y-auto filter-dropdown-scroll ${isMobile ? 'py-1' : 'py-2'}`}
              style={{
                maxHeight: isMobile ? 'calc(4 * 36px)' : 'calc(6 * 44px)',
                scrollbarWidth: 'thin',
                scrollbarColor: '#E4E4E4 transparent'
              }}
            >
              <button
                onClick={() => {
                  setCurrentCountry('');
                  setOpenFilterDropdown(null);
                }}
                style={{
                  backgroundColor: !currentCountry ? '#F0F8FE' : 'transparent',
                  color: !currentCountry ? '#64B5F6' : '#BABABA',
                  padding: isMobile ? '6px 10px' : '8px 16px',
                  fontSize: isMobile ? '11px' : '14px'
                }}
                className="w-full text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <img
                    src={globyIcon}
                    alt="Globe"
                    className={isMobile ? 'w-3 h-3 mr-1.5' : 'w-4 h-4 mr-2'}
                    style={{
                      filter: currentCountry ? 'grayscale(100%) brightness(0.7)' : 'none'
                    }}
                  />
                  <span>Africa</span>
                </div>
              </button>
              {africanCountries.map((country) => (
                <button
                  key={country.name}
                  onClick={() => {
                    setCurrentCountry(country.name);
                    setOpenFilterDropdown(null);
                  }}
                  style={{
                    backgroundColor: currentCountry === country.name ? '#F0F8FE' : 'transparent',
                    color: currentCountry === country.name ? '#64B5F6' : '#BABABA',
                    padding: isMobile ? '6px 10px' : '8px 16px',
                    fontSize: isMobile ? '11px' : '14px'
                  }}
                  className="w-full text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center" style={{ gap: isMobile ? '6px' : '8px' }}>
                    <img
                      src={country.flag}
                      alt={`${country.name} flag`}
                      className="object-cover rounded-full"
                      style={{ width: isMobile ? '16px' : '20px', height: isMobile ? '16px' : '20px' }}
                    />
                    <span>{country.name}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Handle search functionality
  const handleSearch = () => {
    // Save search query to localStorage if it's not empty
    if (searchQuery.trim()) {
      const updatedHistory = [searchQuery.trim(), ...searchHistory.filter(item => item !== searchQuery.trim())].slice(0, 10);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    }
    // Set search as active
    setIsSearchActive(true);
    // Reset to first page when searching
    setCurrentPage(1);
    // Get all products
    const allProducts = getAllProducts();
    // Filter products based on search query and filters
    const filtered = allProducts.filter(product => {
      // Convert all values to lowercase for case-insensitive comparison
      const searchTerm = searchQuery.toLowerCase().trim();
      const productName = product.name?.toLowerCase() || '';
      const productCategory = product.category?.toLowerCase() || '';
      const productOrigin = product.origin?.toLowerCase() || '';
      const productLocationPlain = getCityPlain(product.location || '').toLowerCase();
      const selectedOrigin = selectedPlaceOfOriginText?.toLowerCase() || '';
      const sellerLoc = sellerLocation.toLowerCase().trim();
      // Check if product matches search query (if any)
      const matchesSearch = !searchTerm ||
        productName.includes(searchTerm) ||
        productCategory.includes(searchTerm);

      // Check if product matches origin (if any origin is selected)
      const matchesOrigin = !selectedOrigin ||
        (productOrigin && productOrigin.includes(selectedOrigin));

      // Check if product matches seller location (if any location is specified)
      const matchesLocation = !sellerLoc ||
        (productLocationPlain && productLocationPlain.includes(sellerLoc));
      return matchesSearch && matchesOrigin && matchesLocation;
    });
    setSearchResults(filtered);
    setShowSearchHistory(false);
  };

  // Handle Enter key press in search input
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Product grid scroll functions
  const scrollProductsLeft = () => {
    if (productGridRef.current) {
      productGridRef.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      });
    }
  };

  const scrollProductsRight = () => {
    if (productGridRef.current) {
      productGridRef.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      });
    }
  };

  // Pagination functions for categories
  const getCategoryPage = (category: string): number => {
    return categoryPages[category] || 1;
  };

  const setCategoryPage = (category: string, page: number) => {
    setCategoryPages(prev => ({ ...prev, [category]: page }));
  };

  const scrollCategoryLeft = (category: string) => {
    const currentPage = getCategoryPage(category);
    if (currentPage > 1) {
      setCategoryPage(category, currentPage - 1);
    }
  };

  const scrollCategoryRight = (category: string) => {
    const currentPage = getCategoryPage(category);
    const categoryProducts = (allProductsComputed[category as keyof typeof allProductsComputed] || []);
    const filteredProducts = selectedCountry
      ? categoryProducts.filter(product => getProductCountry(product.origin).name === selectedCountry)
      : categoryProducts;
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (currentPage < totalPages) {
      setCategoryPage(category, currentPage + 1);
    }
  };

  // Handle scan functionality - trigger file input
  const handleScan = () => {
    if (isMobile) {
      // Mobile: Navigate to dedicated image search page
      navigate('/image-search');
    } else {
      // Desktop: Open file explorer
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }
  };

  // Handle image from file
  const handleImageFromFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('Image size must be less than 10MB');
      return;
    }

    // Set selected image
    setSelectedImage(file);

    // Create preview URL
    const imageUrl = URL.createObjectURL(file);
    setSelectedImageUrl(imageUrl);

    // Create FormData for future API call
    const formData = new FormData();
    formData.append('image', file);
    formData.append('timestamp', new Date().toISOString());

    setImageFormData(formData);
  };

  // Handle image file selection
  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('Image size must be less than 10MB');
        return;
      }

      // Set selected image
      setSelectedImage(file);

      // Create FormData for future API call
      const formData = new FormData();
      formData.append('image', file);
      formData.append('timestamp', new Date().toUTCString());

      setImageFormData(formData);

    }
  };

  // Handle share functionality
  const handleShare = async (productId: number) => {
    setSharedProducts(prev => {
      const newShared = new Set(prev);
      if (newShared.has(productId)) {
        newShared.delete(productId);
        return newShared;
      } else {
        newShared.add(productId);

        // Share functionality - moved outside setState to prevent multiple calls
        setTimeout(async () => {
          const shareData = {
            title: 'Check out this product on BaoAfrik',
            text: 'I found this amazing product on BaoAfrik marketplace',
            url: window.location.href
          };

          try {
            if (navigator.share) {
              await navigator.share(shareData);
            } else {
              // Fallback: copy to clipboard
              await navigator.clipboard.writeText(window.location.href);
            }
          } catch (error) {
            console.log('Error sharing:', error);
          }
        }, 100);

        return newShared;
      }
    });
  };

  // Load saved products on mount
  useEffect(() => {
    const loadSavedProducts = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/products/saved`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {

            const savedStringIds = new Set(result.data);
            const savedNumberIds = new Set<number>();

            // Match saved string IDs with product IDs
            products.forEach((product: BaseProduct) => {
              if (savedStringIds.has(product.id)) {
                // Find the corresponding frontend product
                const frontendProduct = transformToFrontendProducts([product])[0];
                if (frontendProduct) {
                  savedNumberIds.add(Number(frontendProduct.id));
                }
              }
            });

            setSavedProducts(savedNumberIds);
          }
        }
      } catch (error) {
        console.error('Failed to load saved products:', error);
      }
    };

    if (products.length > 0) {
      loadSavedProducts();
    }
  }, [products]);

  // Handle save functionality
  const handleSave = async (productId: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // Show notification that user needs to log in
      const product = productsToDisplay.find((p: FrontendProduct) => p.id === productId);
      if (product) {
        setNotifications(prev => {
          const notificationId = `${productId}-error-${Date.now()}`;
          const errorNotification: Notification = {
            id: notificationId,
            product: {
              id: product.id,
              name: product.name,
              price: parseFloat(product.price) || 0,
              image: typeof product.image === 'string' ? product.image : ''
            },
            timestamp: Date.now(),
            type: 'error'
          };

          setTimeout(() => {
            setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
          }, 5000);

          return [...prev, errorNotification];
        });
      }
      return;
    }

    const product = productsToDisplay.find((p: FrontendProduct) => p.id === productId);
    if (!product) return;

    // Find the original product with string ID
    const originalProduct = products.find((p: BaseProduct) => {
      const frontendProduct = transformToFrontendProducts([p])[0];
      return frontendProduct && frontendProduct.id === productId;
    });

    if (!originalProduct) {
      console.error('Could not find original product for ID:', productId);
      return;
    }

    const wasSaved = savedProducts.has(productId);
    const productStringId = originalProduct.id;

    // Optimistic update
    setSavedProducts(prev => {
      const newSaved = new Set(prev);
      if (wasSaved) {
        newSaved.delete(productId);
      } else {
        newSaved.add(productId);
      }
      return newSaved;
    });

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productStringId}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update bookmark');
      }

      const result = await response.json();
      if (result.success) {
        const isNowSaved = result.data.saved;

        // Update state based on result
        setSavedProducts(prev => {
          const newSaved = new Set(prev);
          if (isNowSaved) {
            newSaved.add(productId);
          } else {
            newSaved.delete(productId);
          }
          return newSaved;
        });

        // Show success notification (keep existing notification system)
        setNotifications(prev => {
          const existingNotification = prev.find(notif => notif.product.id === productId);
          if (existingNotification) {
            return prev;
          }

          const notificationId = `${productId}-${Date.now()}`;
          const newNotification: Notification = {
            id: notificationId,
            product: {
              id: product.id,
              name: product.name,
              price: parseFloat(product.price) || 0,
              image: typeof product.image === 'string' ? product.image : ''
            },
            timestamp: Date.now(),
            type: 'success',
            action: isNowSaved ? 'added' : 'removed'
          };

          setTimeout(() => {
            setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
          }, 5000);

          return [...prev, newNotification];
        });
      }
    } catch (error) {
      // Revert optimistic update on error
      setSavedProducts(prev => {
        const newSaved = new Set(prev);
        if (wasSaved) {
          newSaved.add(productId);
        } else {
          newSaved.delete(productId);
        }
        return newSaved;
      });

      // Show error notification
      setNotifications(prev => {
        const existingNotification = prev.find(notif => notif.product.id === productId);
        if (existingNotification) {
          return prev;
        }

        const notificationId = `${productId}-error-${Date.now()}`;
        const errorNotification: Notification = {
          id: notificationId,
          product: {
            id: product.id,
            name: product.name,
            price: parseFloat(product.price) || 0,
            image: typeof product.image === 'string' ? product.image : ''
          },
          timestamp: Date.now(),
          type: 'error'
        };

        setTimeout(() => {
          setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        }, 5000);

        return [...prev, errorNotification];
      });
    }
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isFilterDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest('.filter-dropdown')) {
          setIsFilterDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterDropdownOpen]);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validateForm = () => {
      if (!requestProductName.trim()) {
        alert('Product name is required');
        return false;
      }
      if (!requestDescription.trim()) {
        alert('Description is required');
        return false;
      }
      if (!requestProductOrigin && !requestProductOriginInput.trim()) {
        alert('Please select or type a product origin');
        return false;
      }
      return true;
    };

    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem('accessToken');

    try {
      setIsSubmitting(true);

      let minPrice = 0;
      let maxPrice = 1000;
      let currency = 'GBP';

      if (requestPriceRange) {
        const range = requestPriceRange.toLowerCase();

        if (range.includes('less than')) {
          const match = requestPriceRange.match(/less than (\d+)/i);
          if (match) {
            minPrice = 0;
            maxPrice = Number(match[1]);
          }
        } else if (range.includes('more than')) {
          const match = requestPriceRange.match(/more than (\d+)/i);
          if (match) {
            minPrice = Number(match[1]);
            maxPrice = 1000000; // Or whatever your maximum should be
          }
        } else {
          // Handle ranges like "10 - 50 GBP"
          const match = requestPriceRange.match(/(\d+)\s*-\s*(\d+)\s*(\w{3})?/i);
          if (match) {
            minPrice = Number(match[1]);
            maxPrice = Number(match[2]);
            if (match[3]) currency = match[3].toUpperCase();
          }
        }
      }

      const formData = {
        productName: requestProductName.trim(),
        description: requestDescription.trim(),
        origin: requestProductOrigin || requestProductOriginInput.trim(),
        sellerLocation: location,
        minPrice,
        maxPrice,
        currency,
        status: 'PENDING'
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit request');
      }
      const responseData = await response.json();

      // Reset form
      setRequestProductName('');
      setRequestProductOrigin('');
      setRequestProductOriginInput('');
      setrequestSellerLocation('');
      setRequestDescription('');
      setRequestPriceRange('');

      // Refresh requests list
      const refreshResponse = await fetch(`${process.env.REACT_APP_API_URL}/requests?limit=3`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (refreshResponse.ok) {
        const refreshResult = await refreshResponse.json();

        // Handle response format: { success: true, data: [...], pagination: {...} }
        let requestsArray: any[] = [];

        if (refreshResult.success && refreshResult.data) {
          if (Array.isArray(refreshResult.data)) {
            requestsArray = refreshResult.data;
          } else if (refreshResult.data.requests && Array.isArray(refreshResult.data.requests)) {
            requestsArray = refreshResult.data.requests;
          } else if (refreshResult.data.data && Array.isArray(refreshResult.data.data)) {
            requestsArray = refreshResult.data.data;
          }
        } else if (Array.isArray(refreshResult)) {
          requestsArray = refreshResult;
        } else if (refreshResult.data && Array.isArray(refreshResult.data)) {
          requestsArray = refreshResult.data;
        }

        setRequests(requestsArray);
      }

      setShowRequestModal(false);
      setShowConfirmationModal(true);

    } catch (error: any) {
      console.error('Error submitting request:', error);
      alert(error.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsSubmittingRequest(false);
    }
  };

  // Cleanup image URL on unmount or when image changes
  useEffect(() => {
    return () => {
      if (selectedImageUrl) {
        URL.revokeObjectURL(selectedImageUrl);
      }
    };
  }, [selectedImageUrl]);

  const displayedProducts = React.useMemo(() => {
    if (isSearchActive) {
      return searchResults;
    }

    let productsToShow: FrontendProduct[] = [];
    if (activeCategory === 'All') {
      productsToShow = Object.values(allProductsComputed).flat();
    } else {
      productsToShow = allProductsComputed[activeCategory] || [];
    }
    if (selectedCountry) {
      productsToShow = productsToShow.filter((product: FrontendProduct) =>
        getProductCountry(product.origin).name === selectedCountry
      );
    }
    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    return productsToShow.slice(startIndex, startIndex + itemsPerPage);
  }, [isSearchActive, searchResults, activeCategory, allProductsComputed, selectedCountry, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, selectedCountry, searchQuery, selectedPlaceOfOriginText, sellerLocation]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hidden file input for image selection */}
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageSelection}
        style={{ display: 'none' }}
      />

      {/* Search Section */}
      <div className="mt-4 sm:mt-6 mx-4 sm:mx-6" style={{ maxWidth: '1200px', margin: '0 auto', marginTop: '20px' }}>
        {/* Desktop Unified Search Bar */}
        <div className="hidden md:block relative">
          <div
            className="flex items-center mx-auto"
            style={{
              width: '900px',
              height: '58px',
              flexShrink: 0,
              borderRadius: '30px',
              border: '1px solid #E4E4E4',
              background: selectedImage ? '#F1F1F1' : (focusedSearchSection ? '#F4F4F4' : '#FFF'),
              boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
              fontFamily: 'Poppins, sans-serif',
              transition: 'background 0.2s ease'
            }}
          >
            {/* Product Section */}
            <div
              className="flex items-center px-4 flex-1 relative"
              style={{
                background: focusedSearchSection === 'product' ? '#FFF' : 'transparent',
                borderTopLeftRadius: '30px',
                borderBottomLeftRadius: '30px',
                borderTopRightRadius: focusedSearchSection === 'product' ? '30px' : '0',
                borderBottomRightRadius: focusedSearchSection === 'product' ? '30px' : '0',
                boxShadow: focusedSearchSection === 'product' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.2s ease',
                zIndex: focusedSearchSection === 'product' ? 10 : 1,
                height: '58px'
              }}
            >
              {/* Image Thumbnail */}
              {selectedImageUrl && (
                <img
                  src={selectedImageUrl}
                  alt="Selected product"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    marginRight: '12px',
                    flexShrink: 0
                  }}
                />
              )}

              <div className="flex flex-col justify-center flex-1">
                <label style={{ fontSize: '12px', color: '#888888', marginBottom: '2px', fontWeight: 600 }}>Product</label>
                <input
                  type="text"
                  placeholder={selectedImage ? "Wanna be more specific ?" : "Search a product"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  onFocus={() => {
                    setFocusedSearchSection('product');
                    if (searchHistory.length > 0) {
                      setShowSearchHistory(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setFocusedSearchSection(null);
                      setShowSearchHistory(false);
                    }, 200);
                  }}
                  className="border-0 p-0 focus:outline-none focus:ring-0 product-search-input"
                  style={{ fontSize: '11px', color: '#212121', background: 'transparent' }}
                />
              </div>
              <style>
                {`
                  .product-search-input::placeholder {
                    color: #888888;
                    font-weight: 600;
                  }
                  .product-search-input {
                    caret-color: #64B5F6;
                  }
                `}
              </style>
            </div>

            {/* Categories Section */}
            <div
              className="flex flex-col justify-center px-4 flex-1 relative"
              style={{
                background: focusedSearchSection === 'categories' ? '#FFF' : 'transparent',
                borderTopLeftRadius: focusedSearchSection === 'categories' ? '30px' : '0',
                borderBottomLeftRadius: focusedSearchSection === 'categories' ? '30px' : '0',
                borderTopRightRadius: focusedSearchSection === 'categories' ? '30px' : '0',
                borderBottomRightRadius: focusedSearchSection === 'categories' ? '30px' : '0',
                boxShadow: focusedSearchSection === 'categories' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.2s ease',
                zIndex: focusedSearchSection === 'categories' ? 10 : 1,
                height: '58px'
              }}
            >
              {/* Divider */}
              {!(focusedSearchSection === 'categories' || focusedSearchSection === 'placeOfOrigin') && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '12px',
                    bottom: '12px',
                    width: '1px',
                    backgroundColor: '#E4E4E4'
                  }}
                />
              )}
              <label style={{ fontSize: '12px', color: '#888888', marginBottom: '2px', fontWeight: 600 }}>Categories</label>
              <button
                onClick={() => {
                  setFocusedSearchSection('categories');
                  setShowCategoryDropdown(!showCategoryDropdown);
                }}
                onFocus={() => setFocusedSearchSection('categories')}
                onBlur={() => {
                  setTimeout(() => {
                    setFocusedSearchSection(null);
                    setShowCategoryDropdown(false);
                  }, 200);
                }}
                className="border-0 p-0 focus:outline-none text-left flex items-center justify-between w-full"
                style={{ fontSize: '11px', color: selectedCategoryText ? '#212121' : '#E9E9E9', background: 'transparent' }}
              >
                <span style={{ fontWeight: 600, color: '#888888' }}>{selectedCategoryText || 'Choose a category'}</span>
                <img
                  src={arrowDownIcon}
                  alt="Arrow"
                  className="w-3 h-3 ml-2 transition-transform"
                  style={{ transform: showCategoryDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
            </div>

            {/* Place of Origin Section */}
            <div
              className="flex flex-col justify-center px-4 flex-1 relative"
              style={{
                background: focusedSearchSection === 'placeOfOrigin' ? '#FFF' : 'transparent',
                borderTopLeftRadius: focusedSearchSection === 'placeOfOrigin' ? '30px' : '0',
                borderBottomLeftRadius: focusedSearchSection === 'placeOfOrigin' ? '30px' : '0',
                borderTopRightRadius: focusedSearchSection === 'placeOfOrigin' ? '30px' : '0',
                borderBottomRightRadius: focusedSearchSection === 'placeOfOrigin' ? '30px' : '0',
                boxShadow: focusedSearchSection === 'placeOfOrigin' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.2s ease',
                zIndex: focusedSearchSection === 'placeOfOrigin' ? 10 : 1,
                height: '58px'
              }}
            >
              {/* Divider */}
              {!(focusedSearchSection === 'placeOfOrigin' || focusedSearchSection === 'sellerLocation') && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '12px',
                    bottom: '12px',
                    width: '1px',
                    backgroundColor: '#E4E4E4'
                  }}
                />
              )}
              <label style={{ fontSize: '12px', color: '#888888', marginBottom: '2px', fontWeight: 600 }}>Place of Origin</label>
              <div className="relative flex items-center w-full">
                <style>
                  {`
                  .place-of-origin-input::placeholder {
                    color: #888888888888;
                    font-weight: 600;
                  }
                `}
                </style>
                <input
                  type="text"
                  placeholder="Type a country"

                  value={selectedPlaceOfOriginText || placeOfOriginInput}
                  onChange={(e) => {
                    setPlaceOfOriginInput(e.target.value);
                    setSelectedPlaceOfOriginText('');
                    setPlaceOfOrigin('');
                    if (e.target.value.trim()) {
                      setShowPlaceOfOriginDropdown(true);
                    }
                  }}
                  onFocus={() => {
                    setFocusedSearchSection('placeOfOrigin');
                    if (placeOfOriginInput.trim() || !selectedPlaceOfOriginText) {
                      setShowPlaceOfOriginDropdown(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setFocusedSearchSection(null);
                      setShowPlaceOfOriginDropdown(false);
                    }, 200);
                  }}
                  className="border-0 p-0 focus:outline-none focus:ring-0 flex-1 place-of-origin-input"
                  style={{ fontSize: '11px', color: (selectedPlaceOfOriginText || placeOfOriginInput) ? '#212121' : '#212121', background: 'transparent' }}
                />
                <img
                  src={arrowDownIcon}
                  alt="Arrow"
                  className="w-3 h-3 ml-2 transition-transform flex-shrink-0 cursor-pointer"
                  style={{ transform: showPlaceOfOriginDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  onClick={() => {
                    setShowPlaceOfOriginDropdown(!showPlaceOfOriginDropdown);
                    setFocusedSearchSection('placeOfOrigin');
                  }}
                />
              </div>
            </div>

            {/* Seller Location Section */}
            <div
              className="flex flex-col justify-center px-4 flex-1 relative"
              style={{
                background: focusedSearchSection === 'sellerLocation' ? '#FFF' : 'transparent',
                borderTopLeftRadius: focusedSearchSection === 'sellerLocation' ? '30px' : '0',
                borderBottomLeftRadius: focusedSearchSection === 'sellerLocation' ? '30px' : '0',
                borderTopRightRadius: focusedSearchSection === 'sellerLocation' ? '30px' : '0',
                borderBottomRightRadius: focusedSearchSection === 'sellerLocation' ? '30px' : '0',
                boxShadow: focusedSearchSection === 'sellerLocation' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.2s ease',
                zIndex: focusedSearchSection === 'sellerLocation' ? 10 : 1,
                height: '58px'
              }}
            >
              <label style={{ fontSize: '12px', color: '#888888', marginBottom: '2px', fontWeight: 600 }}>Seller Location</label>
              <input
                type="text"
                placeholder="Insert location"
                value={sellerLocation && UK_CITIES_PLAIN.includes(sellerLocation) ? formatCityDisplay(sellerLocation) : sellerLocation}
                onChange={(e) => {
                  const value = e.target.value;
                  const plain = getCityPlain(value);
                  setSellerLocation(plain);
                  if (value.trim()) {
                    setShowSellerLocationSuggestions(true);
                  } else {
                    setShowSellerLocationSuggestions(false);
                  }
                }}
                onFocus={() => {
                  setFocusedSearchSection('sellerLocation');
                  setShowSellerLocationSuggestions(true);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setFocusedSearchSection(null);
                    setShowSellerLocationSuggestions(false);
                  }, 200);
                }}
                className="border-0 p-0 focus:outline-none focus:ring-0"
                style={{ fontSize: '11px', color: '#888888', background: 'transparent' }}
              />
              {/* UK city suggestions dropdown (desktop) - like Requests buyer location */}
              {showSellerLocationSuggestions && focusedSearchSection === 'sellerLocation' && getFilteredSellerLocationSuggestions().length > 0 && (
                <div
                  className="absolute left-0 right-0 top-full mt-1 z-50 bg-white rounded-lg overflow-hidden"
                  style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    maxHeight: '180px',
                    overflowY: 'auto'
                  }}
                >
                  {getFilteredSellerLocationSuggestions().map((city, index) => (
                    <div
                      key={index}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSellerLocation(city);
                        setShowSellerLocationSuggestions(false);
                      }}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                      style={{ padding: '8px 12px' }}
                    >
                      <img
                        src={locationIcon}
                        alt="Location"
                        style={{
                          width: '14px',
                          height: '14px',
                          filter: 'brightness(0) saturate(100%) invert(73%) sepia(52%) saturate(1685%) hue-rotate(352deg) brightness(103%) contrast(95%)'
                        }}
                      />
                      <span style={{ color: '#6A6A6A', fontSize: '11px', fontFamily: 'Poppins, sans-serif' }}>
                        {formatCityDisplay(city)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Scan Icon or Clear Image Button */}
            {/* {selectedImage ? (
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setSelectedImageUrl(null);
                  setImageFormData(null);
                  if (selectedImageUrl) {
                    URL.revokeObjectURL(selectedImageUrl);
                  }
                }}
                className="flex items-center justify-center px-3 hover:opacity-70 transition-opacity"
                title="Clear image"
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#8A8A8A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
              </button>
            ) : (
              <button
                onClick={handleScan}
                className="flex items-center justify-center px-3 hover:opacity-70 transition-opacity"
                title="Scan QR code"
              >
                <img
                  src={scanIcon}
                  alt="Scan QR code"
                  style={{ width: '20px', height: '20px' }}
                />
              </button>
            )} */}

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="flex items-center justify-center rounded-full mr-2 transition-colors"
              style={{
                width: '90px',
                height: '42px',
                backgroundColor: '#F9A825'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}
            >
              <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Search History Dropdown */}
          {showSearchHistory && searchQuery.length > 0 && (
            <div
              className="absolute bg-white z-50"
              style={{
                width: '160px',
                left: 'calc(50% - 450px + 16px)',
                top: '50px',
                borderTopLeftRadius: '30px',
                borderTopRightRadius: '30px',
                borderBottomLeftRadius: '28px',
                borderBottomRightRadius: '28px',
                background: '#FFF',
                boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 pb-1">
                <h3 className="font-medium" style={{ fontSize: '12px', color: '#212121' }}>
                  Search history
                </h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="4" cy="10" r="1.5" />
                    <circle cx="10" cy="10" r="1.5" />
                    <circle cx="16" cy="10" r="1.5" />
                  </svg>
                </button>
              </div>

              {/* Search History Items */}
              <div className="py-1">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(item);
                      setShowSearchHistory(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="font-normal" style={{ fontSize: '12px', color: '#6A6A6A' }}>
                      {item.length > 16 ? item.substring(0, 16) + '...' : item}
                    </span>
                    <svg
                      className="w-3 h-3 flex-shrink-0 ml-1"
                      fill="#6A6A6A"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Dropdown */}
          {showCategoryDropdown && (
            <div
              className="absolute bg-white z-50"
              style={{
                width: '180px',
                left: 'calc(50% - 450px + 200px)',
                top: '54px',
                borderRadius: '28px',
                background: '#FFF',
                boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              {/* Category Items */}
              <div className="py-2">
                <button
                  onMouseDown={() => {
                    setSelectedCategoryText('');
                    setSelectedCategory('');
                    setActiveCategory('All'); // Sync activeCategory when clearing filter
                    setShowCategoryDropdown(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-gray-50 transition-colors"
                  style={{
                    backgroundColor: 'transparent',
                    color: !selectedCategoryText ? '#64B5F6' : '#6A6A6A',
                    fontSize: '11px'
                  }}
                >
                  All Categories
                </button>
                {['Beauty & Wellness', 'Books & Media', 'Fashion & Textiles', 'Food & Spices', 'Home & Decor'].map((category) => (
                  <button
                    key={category}
                    onMouseDown={() => {
                      setSelectedCategoryText(category);
                      setSelectedCategory(category);
                      setActiveCategory(category); // Sync activeCategory with dropdown selection
                      setShowCategoryDropdown(false);
                    }}
                    className="w-full text-left px-4 py-1.5 hover:bg-gray-50 transition-colors"
                    style={{
                      backgroundColor: 'transparent',
                      color: selectedCategoryText === category ? '#64B5F6' : '#6A6A6A',
                      fontSize: '11px'
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Place of Origin Dropdown */}
          {showPlaceOfOriginDropdown && (
            <div
              className="absolute bg-white z-50 place-origin-dropdown"
              style={{
                width: '180px',
                left: 'calc(50% - 450px + 395px)',
                top: '54px',
                borderRadius: '28px',
                background: '#FFF',
                boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                fontFamily: 'Poppins, sans-serif',
                maxHeight: '280px',
                overflowY: 'auto'
              }}
            >
              {/* Place of Origin Items */}
              <div className="py-2">
                <button
                  onMouseDown={() => {
                    setSelectedPlaceOfOriginText('');
                    setPlaceOfOrigin('');
                    setPlaceOfOriginInput('');
                    setIsSearchActive(false);
                    setSearchResults([]);
                    setShowPlaceOfOriginDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  style={{
                    backgroundColor: !selectedPlaceOfOriginText || selectedPlaceOfOriginText === 'Africa' ? '#F0F8FE' : 'transparent',
                    color: !selectedPlaceOfOriginText || selectedPlaceOfOriginText === 'Africa' ? '#64B5F6' : '#6A6A6A',
                    fontSize: '11px'
                  }}
                >
                  <img
                    src={globyIcon}
                    alt="Globe"
                    className="w-4 h-4"
                    style={{
                      filter: (!selectedPlaceOfOriginText || selectedPlaceOfOriginText === 'Africa')
                        ? 'none'
                        : 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(92%)'
                    }}
                  />
                  <span>Africa</span>
                </button>
                {countries
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .filter((country) => {
                    const searchTerm = placeOfOriginInput.toLowerCase().trim();
                    if (!searchTerm) return true;
                    return country.name.toLowerCase().includes(searchTerm);
                  })
                  .map((country) => (
                    <button
                      key={country.name}
                      onMouseDown={() => {
                        setSelectedPlaceOfOriginText(country.name);
                        setPlaceOfOrigin(country.name);
                        setPlaceOfOriginInput('');
                        setShowPlaceOfOriginDropdown(false);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      style={{
                        backgroundColor: 'transparent',
                        color: selectedPlaceOfOriginText === country.name ? '#64B5F6' : '#6A6A6A',
                        fontSize: '11px'
                      }}
                    >
                      <img
                        src={country.flag}
                        srcSet={`https://flagcdn.com/w40/${country.code}.png 2x`}
                        alt={`${country.name} flag`}
                        style={{ width: '16px', height: '16px', objectFit: 'cover', borderRadius: '50%' }}
                      />
                      <span>{country.name}</span>
                    </button>
                  ))}
              </div>
              <style>
                {`
                /* Hide scrollbar completely while keeping scroll functionality */
                .place-origin-dropdown {
                  scrollbar-width: none; /* Firefox */
                  -ms-overflow-style: none; /* IE and Edge */
                }
                .place-origin-dropdown::-webkit-scrollbar {
                  display: none; /* Chrome, Safari, Opera */
                }
              `}
              </style>
            </div>
          )}
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4">
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div
                className="flex items-center w-full px-4 py-3 pr-12"
                style={{
                  borderRadius: '30px',
                  border: '1px solid #E9E9E9',
                  backgroundColor: selectedImage ? '#F1F1F1' : '#FFF',
                  fontFamily: 'Poppins, sans-serif',
                  minHeight: '48px'
                }}
              >
                {/* Image Thumbnail */}
                {selectedImageUrl && (
                  <img
                    src={selectedImageUrl}
                    alt="Selected product"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      marginRight: '12px',
                      flexShrink: 0
                    }}
                  />
                )}
                <input
                  type="text"
                  placeholder={selectedImage ? "Wanna be more specific ?" : "What are you looking for today ?"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  onFocus={() => {
                    if (isMobile) {
                      setShowMobileSearchFlow(true);
                      setMobileSearchQuery(searchQuery);
                    } else {
                      setFocusedSearchSection('mobile-search');
                      if (searchHistory.length > 0) {
                        setShowSearchHistory(true);
                      }
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setFocusedSearchSection(null);
                      setShowSearchHistory(false);
                    }, 200);
                  }}
                  className="flex-1 focus:outline-none text-sm"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontFamily: 'Poppins, sans-serif',
                    color: '#212121',
                    caretColor: '#888888'
                  }}
                />
                <style>{`
                  .md\\:hidden input::placeholder {
                    color: #888888;
                    font-size: 12px;
                    font-weight: 600;
                  }
                `}</style>
                {/* {selectedImage ? (
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setSelectedImageUrl(null);
                      setImageFormData(null);
                      if (selectedImageUrl) {
                        URL.revokeObjectURL(selectedImageUrl);
                      }
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                    title="Clear image"
                  >
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: '#8A8A8A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={handleScan}
                    className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                    title="Scan image to search"
                  >
                    <img
                      src={scanIcon}
                      alt="Scan"
                      className="w-5 h-5"
                      style={{ opacity: 0.6 }}
                    />
                  </button>
                )} */}
              </div>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => {
                if (isMobile) {
                  setFilterPageOpenedFrom('home');
                  setShowMobileFilterPage(true);
                } else {
                  setIsMobileFilterOpen(!isMobileFilterOpen);
                }
              }}
              className="flex items-center justify-center relative flex-shrink-0"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '0.5px solid #E9E9E9',
                backgroundColor: '#FFF'
              }}
              aria-label="Filter"
            >
              {/* Filter Icon - Two horizontal lines with circles */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                {/* Top line with circle */}
                <line x1="3" y1="6" x2="17" y2="6" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="10" cy="6" r="2" fill="#FFF" stroke="#6A6A6A" strokeWidth="1.5" />

                {/* Bottom line with circle */}
                <line x1="3" y1="14" x2="17" y2="14" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="10" cy="14" r="2" fill="#FFF" stroke="#6A6A6A" strokeWidth="1.5" />
              </svg>

              {/* Red notification dot */}
              <div
                className="absolute"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#FF0000',
                  bottom: '2px',
                  right: '2px'
                }}
              />
            </button>
          </div>

          {/* Mobile Search History Dropdown */}
          {showSearchHistory && searchQuery.length > 0 && focusedSearchSection === 'mobile-search' && (
            <div
              className="mt-2 bg-white rounded-lg shadow-lg border border-gray-100"
              style={{
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="font-medium text-sm" style={{ color: '#212121' }}>
                  Search history
                </h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="4" cy="10" r="1.5" />
                    <circle cx="10" cy="10" r="1.5" />
                    <circle cx="16" cy="10" r="1.5" />
                  </svg>
                </button>
              </div>

              {/* Search History Items */}
              <div className="py-1">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(item);
                      setShowSearchHistory(false);
                      handleSearch();
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="font-normal text-sm" style={{ color: '#6A6A6A' }}>
                      {item.length > 25 ? item.substring(0, 25) + '...' : item}
                    </span>
                    <svg
                      className="w-4 h-4 flex-shrink-0 ml-2"
                      fill="#6A6A6A"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hero Banner - Auto Sliding */}
      <section className="text-white relative overflow-hidden mt-4 sm:mt-6 mx-4 sm:mx-20 md:mx-24 lg:mx-40 rounded-2xl mb-6 sm:mb-0" style={{ background: 'linear-gradient(to right, #F9A822, #E55325)', height: window.innerWidth < 640 ? '100px' : 'auto' }}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-1 md:py-1" style={{ height: window.innerWidth < 640 ? '100%' : 'auto' }}>
          <div className="flex flex-row items-center justify-between gap-1 sm:gap-4 md:gap-0">
            <div className="flex-1 text-left px-1 sm:px-2 md:pl-2">
              <button
                onClick={() => setActiveCategory(bannerSlides[currentSlide].category)}
                className="bg-white px-1.5 sm:px-3 md:px-4 py-0.5 sm:py-1 rounded text-[7px] sm:text-xs md:text-sm font-medium hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 touch-manipulation mb-1 sm:mb-2 md:mb-3"
                style={{ color: '#F9A822' }}
              >
                Explore {bannerSlides[currentSlide].category}
              </button>
              <div className="relative overflow-hidden min-h-[1.5rem] sm:min-h-[2rem] md:min-h-[2.5rem] lg:min-h-[3rem]">
                <h1
                  key={`title-${currentSlide}`}
                  className="text-[11px] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold mb-1 sm:mb-2 animate-fade-in-up leading-tight"
                >
                  {bannerSlides[currentSlide].title}
                </h1>
              </div>
              <div className="relative overflow-hidden min-h-[1.5rem] sm:min-h-[1.5rem] md:min-h-[2rem]">
                <p
                  key={`desc-${currentSlide}`}
                  className="text-orange-100 text-[8px] sm:text-xs md:text-sm lg:text-base mb-0 animate-fade-in-up animation-delay-100 leading-relaxed"
                >
                  {bannerSlides[currentSlide].description}
                </p>
              </div>
            </div>
            <div className="pr-1 sm:pr-2 relative flex-shrink-0">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  key={`img-${currentSlide}`}
                  src={bannerSlides[currentSlide].image}
                  alt={bannerSlides[currentSlide].title}
                  className="w-20 h-16 sm:w-48 sm:h-24 md:w-64 md:h-32 lg:w-80 lg:h-40 object-cover animate-slide-in-right"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                    maskComposite: 'intersect',
                    WebkitMaskComposite: 'source-in'
                  }}
                  loading="eager"
                  width="320"
                  height="192"
                />
              </div>
            </div>
          </div>

          {/* Slide Indicators - Hidden but functionality remains */}
          <div className="hidden">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                  ? 'bg-white w-4 sm:w-6'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="bg-white py-3 sm:py-4 md:py-6 mb-4 md:mb-0">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 relative">
          {/* Gray line background - full width at category bottom */}
          <div className="absolute bottom-0 left-[calc(-50vw+50%)] right-[calc(-50vw+50%)] bg-gray-200" style={{ height: window.innerWidth < 768 ? '0.5px' : '2px' }}></div>

          <div className="flex justify-start md:justify-center space-x-2 sm:space-x-4 md:space-x-8 overflow-x-auto scrollbar-hide relative">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setIsSearchActive(false);
                  setSearchQuery('');
                  // Clear dropdown filter state when clicking category tab
                  setSelectedCategoryText('');
                  setSelectedCategory('');
                }}
                className={`whitespace-nowrap pb-2 sm:pb-3 md:pb-4 px-0.5 sm:px-1 transition-colors flex-shrink-0 relative`}
                style={{
                  fontSize: window.innerWidth < 640 ? '13px' : '16px',
                  fontWeight: window.innerWidth < 640 ? '300' : 'normal',
                  fontFamily: 'Poppins, sans-serif',
                  color: activeCategory === category ? '#64B5F6' : '#BABABA'
                }}
              >
                {category}
                {activeCategory === category && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#64B5F6' }}></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Filter Buttons - Horizontal Scroll */}
      <section className="bg-white md:hidden" style={{ marginTop: '-8px', marginBottom: '-8px' }}>
        <div className="px-2">
          <div ref={homeCountryPickerRef} className="relative">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {/* More Options Button - opens scrollable country picker modal */}
              {/* <button
                type="button"
                onClick={() => {
                  const rect = homeCountryPickerRef.current?.getBoundingClientRect();
                  if (rect) {
                    setMobileCountryPickerPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
                    setMobileCountryPickerOpen(true);
                  }
                }}
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid #E9E9E9',
                  backgroundColor: mobileCountryPickerOpen ? '#F0F8FE' : '#FFF'
                }}
                aria-label="More options - filter by country of origin"
                aria-expanded={mobileCountryPickerOpen}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="3.5" cy="7" r="1.25" fill="#6A6A6A" />
                  <circle cx="7" cy="7" r="1.25" fill="#6A6A6A" />
                  <circle cx="10.5" cy="7" r="1.25" fill="#6A6A6A" />
                </svg>
              </button> */}

              {/* Africa Button */}
              <button
                onClick={() => setSelectedCountry('')}
                className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md"
                style={{
                  backgroundColor: !selectedCountry ? '#F0F8FE' : '#FAFAFA',
                  border: !selectedCountry ? '1px solid #CFE8FC' : 'none',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                <img
                  src={globyIcon}
                  alt="Globe"
                  className="w-3.5 h-3.5"
                  style={{
                    filter: selectedCountry ? 'grayscale(100%) brightness(0.7)' : 'none'
                  }}
                />
                <span
                  className="text-xs font-normal whitespace-nowrap"
                  style={{
                    color: !selectedCountry ? '#5BA5E0' : '#6A6A6A'
                  }}
                >
                  Africa
                </span>
              </button>

              {/* Country Buttons */}
              {africanCountries.map((country) => (
                <button
                  key={country.name}
                  onClick={() => setSelectedCountry(country.name)}
                  className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md"
                  style={{
                    backgroundColor: '#FAFAFA',
                    border: 'none',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  <img
                    src={country.flag}
                    alt={`${country.name} flag`}
                    className="w-3.5 h-3.5 object-cover rounded-full"
                  />
                  <span
                    className="text-xs font-normal whitespace-nowrap"
                    style={{ color: '#6A6A6A' }}
                  >
                    {country.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Button - Desktop Only */}
      <section className="bg-white pt-0 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="relative filter-dropdown hidden md:block">
              {renderCountryFilterButton('relative', 'top-filter')}
            </div>

            {/* Notifications - Centered */}
            <div className="flex-1 flex justify-center relative">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50 flex items-center rounded-xl px-4 py-3 shadow-lg animate-in slide-in-from-right duration-300"
                  style={{
                    backgroundColor: notification.type === 'success' ? '#F5FBFF' : '#FFFCF7',
                    border: notification.type === 'success' ? '1px solid #CFE8FC' : '1px solid #FCD79B',
                    width: '350px'
                  }}
                >
                  {/* Product Image */}
                  <div className="relative mr-3">
                    <img
                      src={notification.product.image}
                      alt={notification.product.name}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    {/* Bookmark Icon Badge */}
                    {notification.type === 'success' ? (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
                        <div className="w-3 h-3 rounded flex items-center justify-center" style={{ backgroundColor: '#64B5F6' }}>
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="#F9A825" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5v14l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">
                      {notification.type === 'success' ? (
                        notification.action === 'removed' ? (
                          <>
                            <span style={{ color: '#939393' }}>Removed from </span>
                            <Link to="/bookmarks" className="underline hover:opacity-70" style={{ color: '#64B5F6' }}>Bookmarks</Link>
                          </>
                        ) : (
                          <>
                            <span style={{ color: '#939393' }}>Added to </span>
                            <Link to="/bookmarks" className="underline hover:opacity-70" style={{ color: '#64B5F6' }}>Bookmarks</Link>
                          </>
                        )
                      ) : (
                        <>
                          <span style={{ color: '#939393' }}>Failed to add to </span>
                          <span style={{ color: '#F9A825' }}>Bookmarks</span>
                        </>
                      )}
                    </div>
                    <div className="text-xs truncate" style={{ color: '#939393' }}>
                      {notification.product.name} · ${notification.product.price}
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="ml-2 hover:opacity-70 transition-opacity"
                    style={{ color: '#6A6A6A' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Empty div to balance the layout */}
            <div className="w-0"></div>
          </div>
        </div>
      </section>

      {/* Filtered Products Section */}
      <section className="py-8" ref={productFeedRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Conditional Layout: Category Sections for "All" or Regular Grid for Specific Category */}
          {activeCategory === 'All' && !isSearchActive ? (
            // Category Sections Layout
            (() => {
              // Check if any category has products after country filter
              const hasAnyProducts = categories.filter(cat => cat !== 'All').some((category) => {
                const categoryProducts = (allProductsComputed[category as keyof typeof allProductsComputed] || []);
                const filteredProducts = selectedCountry
                  ? categoryProducts.filter(product => getProductCountry(product.origin).name === selectedCountry)
                  : categoryProducts;
                return filteredProducts.length > 0;
              });

              // If no products found and country filter is active, show no results state
              if (!hasAnyProducts && selectedCountry) {
                return (
                  <div>
                    {/* No Results State */}
                    <div className="text-center" style={{ padding: window.innerWidth < 640 ? '32px 16px' : '48px 16px' }}>
                      {/* Shopping Bag with Magnifying Glass Icon */}
                      <img
                        src={bagIcon}
                        alt="No products found"
                        className="mx-auto"
                        style={{
                          width: window.innerWidth < 640 ? '40px' : '60px',
                          height: window.innerWidth < 640 ? '40px' : '60px',
                          marginBottom: window.innerWidth < 640 ? '12px' : '16px'
                        }}
                      />

                      {/* Message */}
                      <p style={{
                        fontSize: window.innerWidth < 640 ? '12px' : '18px',
                        color: '#6A6A6A',
                        fontFamily: 'Poppins, sans-serif',
                        maxWidth: window.innerWidth < 640 ? '280px' : '500px',
                        margin: window.innerWidth < 640 ? '0 auto 12px' : '0 auto 16px',
                        lineHeight: '1.5'
                      }}>
                        Can't find what you're looking for? don't worry, just ask for it and we will bring it for you.
                      </p>

                      {/* Post a Request Button */}
                      <button
                        onClick={handleMakeRequestClick}
                        className="inline-flex items-center mx-auto"
                        style={{
                          display: 'flex',
                          padding: window.innerWidth < 640 ? '8px 16px' : '10px 20px',
                          alignItems: 'center',
                          gap: window.innerWidth < 640 ? '4px' : '6px',
                          borderRadius: '8px',
                          backgroundColor: '#F0F8FE',
                          color: '#64B5F6',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: window.innerWidth < 640 ? '11px' : '14px',
                          fontWeight: '500'
                        }}
                      >
                        <img src={draftsIcon} alt="Request" style={{ width: window.innerWidth < 640 ? '14px' : '20px', height: window.innerWidth < 640 ? '14px' : '20px' }} />
                        Post a request
                      </button>
                    </div>

                    {/* Other Products Near You Section */}
                    <div style={{ marginTop: window.innerWidth < 640 ? '32px' : '48px' }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: window.innerWidth < 640 ? '16px' : '24px' }}>
                        <h3 className="font-semibold text-gray-900" style={{
                          fontFamily: 'Faktum, sans-serif',
                          fontSize: window.innerWidth < 640 ? '14px' : '20px'
                        }}>
                          Other products near you
                        </h3>
                        <button className="font-medium hover:underline" style={{
                          color: '#64B5F6',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: window.innerWidth < 640 ? '10px' : '14px'
                        }}>
                          View more...
                        </button>
                      </div>

                      {/* Product Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 md:gap-6">
                        {Object.values(allProductsComputed).flat().slice(0, 6).map((product) => (
                          <div key={product.id} onClick={(e) => handleProductClick(e, product.id)} className="bg-white rounded-lg overflow-hidden transition-all duration-200 block group cursor-pointer">
                            {/* Product Image - Top */}
                            <div className="aspect-square relative overflow-hidden mb-1 sm:mb-2" style={{ borderRadius: window.innerWidth < 640 ? '10px' : '12px' }}>
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                style={{ borderRadius: window.innerWidth < 640 ? '10px' : '12px' }}
                                loading="lazy"
                                width="200"
                                height="200"
                              />

                              {/* Country Badge */}
                              <div className="absolute bg-white rounded-md shadow-sm" style={{
                                display: 'flex',
                                padding: window.innerWidth < 640 ? '1px 4px' : '2px 6px',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: window.innerWidth < 640 ? '2px' : '4px',
                                top: window.innerWidth < 640 ? '6px' : '8px',
                                left: window.innerWidth < 640 ? '6px' : '8px'
                              }}>
                                <img
                                  src={`https://flagcdn.com/w20/${getProductCountry(product.origin).code}.png`}
                                  alt={getProductCountry(product.origin).name}
                                  className="rounded-full"
                                  style={{
                                    width: window.innerWidth < 640 ? '10px' : '12px',
                                    height: window.innerWidth < 640 ? '10px' : '12px',
                                    objectFit: 'cover'
                                  }}
                                />
                                <span className="font-medium text-gray-800" style={{ fontSize: window.innerWidth < 640 ? '8px' : '12px' }}>
                                  {getProductCountry(product.origin).abbreviation}
                                </span>
                              </div>
                            </div>

                            {/* Product Content */}
                            <div className="flex flex-col" style={{ padding: window.innerWidth < 640 ? '0 6px 6px 6px' : '0 12px 12px 12px' }}>
                              {/* Price and Verified Badge Row */}
                              <div className="flex items-center justify-between" style={{ marginBottom: window.innerWidth < 640 ? '4px' : '4px' }}>
                                <div className="font-bold text-gray-900" style={{ fontSize: window.innerWidth < 640 ? '12px' : '16px' }}>
                                  {formatPriceDisplay(product.currency, product.price)}
                                </div>
                                {/* {product.verified ? (
                                  <div className="flex items-center text-green-600 bg-green-50 rounded" style={{
                                    display: 'flex',
                                    padding: window.innerWidth < 640 ? '1px 3px' : '1px 4px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '1px',
                                    fontSize: window.innerWidth < 640 ? '7px' : '9px'
                                  }}>
                                    <img src={verifyIcon} alt="Verified" style={{ width: window.innerWidth < 640 ? '6px' : '8px', height: window.innerWidth < 640 ? '6px' : '8px' }} />
                                    <span>Verified seller</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center text-gray-600 bg-gray-100 rounded" style={{
                                    display: 'flex',
                                    padding: window.innerWidth < 640 ? '1px 3px' : '1px 4px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '1px',
                                    fontSize: window.innerWidth < 640 ? '7px' : '9px'
                                  }}>
                                    <img src={unverifyIcon} alt="Unverified" style={{ width: window.innerWidth < 640 ? '6px' : '8px', height: window.innerWidth < 640 ? '6px' : '8px' }} />
                                    <span>Unverified Seller</span>
                                  </div>
                                )} */}
                              </div>

                              {/* Product Name */}
                              <h3 className="line-clamp-2 font-medium" style={{
                                fontSize: window.innerWidth < 640 ? '10px' : '13px',
                                color: '#212121',
                                marginBottom: window.innerWidth < 640 ? '4px' : '4px'
                              }}>
                                {product.name}
                              </h3>

                              {/* Location and Bookmark Row */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center text-gray-500 flex-1 min-w-0">
                                  <img src={locationIcon} alt="Location" className="flex-shrink-0" style={{
                                    width: window.innerWidth < 640 ? '8px' : '10px',
                                    height: window.innerWidth < 640 ? '8px' : '10px',
                                    marginRight: window.innerWidth < 640 ? '3px' : '4px'
                                  }} />
                                  <span className="truncate font-normal" style={{ fontSize: window.innerWidth < 640 ? '8px' : '10px' }}>{formatCityDisplay(product.location)}</span>
                                </div>
                                {/* Bookmark Button */}
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleSave(product.id);
                                  }}
                                  className="transition-colors touch-manipulation flex-shrink-0"
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '2px'
                                  }}
                                >
                                  <BookmarkIcon saved={savedProducts.has(product.id)} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Otherwise, render category sections
              return (
                <div className="space-y-8">
                  {categories.filter(cat => cat !== 'All').map((category) => {
                    const categoryProducts = (allProductsComputed[category as keyof typeof allProductsComputed] || []);
                    // Filter products by selected country
                    const filteredProducts = selectedCountry
                      ? categoryProducts.filter(product => getProductCountry(product.origin).name === selectedCountry)
                      : categoryProducts;
                    if (filteredProducts.length === 0) return null;

                    return (
                      <div key={category} className="mb-8">
                        {/* Category Header - Hidden on Mobile */}
                        {window.innerWidth >= 640 && (
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                              <h2 className="text-[20px] font-semibold text-gray-900">{category}</h2>
                              <svg className="w-5 h-5 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => scrollCategoryLeft(category)}
                                disabled={getCategoryPage(category) === 1}
                                className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Previous page"
                                style={{ fontWeight: getCategoryPage(category) > 1 ? 'bold' : 'normal' }}
                              >
                                <img
                                  src={getCategoryPage(category) > 1 ? blackArrowIcon : grayArrowIcon}
                                  alt="Previous"
                                  className="w-full h-full"
                                  style={{ transform: 'scaleX(-1)' }}
                                />
                              </button>
                              <button
                                onClick={() => scrollCategoryRight(category)}
                                disabled={getCategoryPage(category) >= Math.ceil(filteredProducts.length / productsPerPage)}
                                className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Next page"
                                style={{ fontWeight: getCategoryPage(category) < Math.ceil(filteredProducts.length / productsPerPage) ? 'bold' : 'normal' }}
                              >
                                <img
                                  src={getCategoryPage(category) < Math.ceil(filteredProducts.length / productsPerPage) ? blackArrowIcon : grayArrowIcon}
                                  alt="Next"
                                  className="w-full h-full"
                                />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Category Products - Paginated Grid */}
                        <div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 md:gap-6">
                            {(() => {
                              const currentPage = getCategoryPage(category);
                              const startIndex = (currentPage - 1) * productsPerPage;
                              const endIndex = startIndex + productsPerPage;
                              return filteredProducts.slice(startIndex, endIndex).map((product) => (
                                <div key={product.id} onClick={(e) => handleProductClick(e, product.id)} className="bg-white rounded-lg overflow-hidden transition-all duration-200 block group cursor-pointer">
                                  {/* Product Image - Top */}
                                  <div className="aspect-square relative overflow-hidden mb-1 sm:mb-2" style={{ borderRadius: window.innerWidth < 640 ? '10px' : '12px' }}>
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                      style={{ borderRadius: window.innerWidth < 640 ? '10px' : '12px' }}
                                      loading="lazy"
                                      width="200"
                                      height="200"
                                    />

                                    {/* Country Badge */}
                                    <div className="absolute bg-white rounded-md shadow-sm" style={{
                                      display: 'flex',
                                      padding: window.innerWidth < 640 ? '1px 4px' : '2px 6px',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      gap: window.innerWidth < 640 ? '2px' : '4px',
                                      top: window.innerWidth < 640 ? '6px' : '8px',
                                      left: window.innerWidth < 640 ? '6px' : '8px'
                                    }}>
                                      <img
                                        src={getProductCountry(product.origin).flag}
                                        alt={getProductCountry(product.origin).name}
                                        className="rounded-full"
                                        style={{
                                          width: window.innerWidth < 640 ? '10px' : '12px',
                                          height: window.innerWidth < 640 ? '10px' : '12px',
                                          objectFit: 'cover'
                                        }}
                                      />
                                      <span className="font-medium text-gray-800" style={{ fontSize: window.innerWidth < 640 ? '8px' : '12px' }}>
                                        {getProductCountry(product.origin).abbreviation}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Product Content */}
                                  <div className="flex flex-col" style={{ padding: window.innerWidth < 640 ? '0 6px 6px 6px' : '0 12px 12px 12px' }}>
                                    {/* Price and Verified Badge Row */}
                                    <div className="flex items-center justify-between" style={{ marginBottom: window.innerWidth < 640 ? '4px' : '4px' }}>
                                      <div className="font-bold text-gray-900" style={{ fontSize: window.innerWidth < 640 ? '12px' : '16px' }}>
                                        {formatPriceDisplay(product.currency, product.price)}
                                      </div>
                                      {/* {product.verified ? (
                                        <div className="flex items-center text-green-600 bg-green-50 rounded" style={{
                                          display: 'flex',
                                          padding: window.innerWidth < 640 ? '1px 3px' : '1px 4px',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          gap: '1px',
                                          fontSize: window.innerWidth < 640 ? '7px' : '9px'
                                        }}>
                                          <img src={verifyIcon} alt="Verified" style={{ width: window.innerWidth < 640 ? '6px' : '8px', height: window.innerWidth < 640 ? '6px' : '8px' }} />
                                          <span>Verified seller</span>
                                        </div>
                                      ) : (
                                        <div className="flex items-center text-gray-600 bg-gray-100 rounded" style={{
                                          display: 'flex',
                                          padding: window.innerWidth < 640 ? '1px 3px' : '1px 4px',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          gap: '1px',
                                          fontSize: window.innerWidth < 640 ? '7px' : '9px'
                                        }}>
                                          <img src={unverifyIcon} alt="Unverified" style={{ width: window.innerWidth < 640 ? '6px' : '8px', height: window.innerWidth < 640 ? '6px' : '8px' }} />
                                          <span>Unverified Seller</span>
                                        </div>
                                      )} */}
                                    </div>

                                    {/* Product Name */}
                                    <h3 className="line-clamp-2 font-medium" style={{
                                      fontSize: window.innerWidth < 640 ? '10px' : '13px',
                                      color: '#212121',
                                      marginBottom: window.innerWidth < 640 ? '4px' : '4px'
                                    }}>{product.name}</h3>

                                    {/* Location and Bookmark Row - Below Product Name */}
                                    <div className="flex items-center justify-between gap-2">
                                      {/* Location */}
                                      <div className="flex items-center text-gray-500 flex-1 min-w-0">
                                        <img src={locationIcon} alt="Location" className="flex-shrink-0" style={{
                                          width: window.innerWidth < 640 ? '8px' : '10px',
                                          height: window.innerWidth < 640 ? '8px' : '10px',
                                          marginRight: window.innerWidth < 640 ? '3px' : '4px'
                                        }} />
                                        <span className="truncate font-normal" style={{ fontSize: window.innerWidth < 640 ? '8px' : '10px' }}>{formatCityDisplay(product.location)}</span>
                                      </div>

                                      {/* Bookmark Button */}
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleSave(product.id);
                                        }}
                                        className="transition-colors touch-manipulation flex-shrink-0"
                                        title={savedProducts.has(product.id) ? 'Remove from saved' : 'Save product'}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          padding: '2px'
                                        }}
                                      >
                                        <BookmarkIcon saved={savedProducts.has(product.id)} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()
          ) : (
            // Regular Grid Layout for Specific Category or Search
            <>
              {/* For search results (isSearchActive), group by categories */}
              {isSearchActive && !shouldShowNoResultsState() ? (
                <div ref={searchResultsRef} className="space-y-8">
                  {(selectedCategoryText
                    ? [selectedCategoryText]
                    : categories.filter(cat => cat !== 'All')
                  ).map((category) => {
                    // Get products from this category that are in search results
                    const categoryProducts = (allProductsComputed[category as keyof typeof allProductsComputed] || []);
                    const filteredProducts = searchResults.filter(product =>
                      categoryProducts.some(cp => cp.id === product.id)
                    );

                    if (filteredProducts.length === 0) return null;

                    return (
                      <div key={category} className="mb-8">
                        {/* Category Header - Hidden on Mobile */}
                        {window.innerWidth >= 640 && (
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                              <h2 className="text-[20px] font-semibold text-gray-900">{category}</h2>
                              <svg className="w-5 h-5 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => scrollCategoryLeft(category)}
                                disabled={getCategoryPage(category) === 1}
                                className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Previous page"
                                style={{ fontWeight: getCategoryPage(category) > 1 ? 'bold' : 'normal' }}
                              >
                                <img
                                  src={getCategoryPage(category) > 1 ? blackArrowIcon : grayArrowIcon}
                                  alt="Previous"
                                  className="w-full h-full"
                                  style={{ transform: 'rotate(180deg)' }}
                                />
                              </button>
                              <span className="text-sm text-gray-600">
                                Page {getCategoryPage(category)} of {Math.ceil(filteredProducts.length / productsPerPage) || 1}
                              </span>
                              <button
                                onClick={() => scrollCategoryRight(category)}
                                disabled={getCategoryPage(category) >= Math.ceil(filteredProducts.length / productsPerPage)}
                                className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Next page"
                                style={{ fontWeight: getCategoryPage(category) < Math.ceil(filteredProducts.length / productsPerPage) ? 'bold' : 'normal' }}
                              >
                                <img
                                  src={getCategoryPage(category) < Math.ceil(filteredProducts.length / productsPerPage) ? blackArrowIcon : grayArrowIcon}
                                  alt="Next"
                                  className="w-full h-full"
                                />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Category Products - Paginated Grid */}
                        <div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 md:gap-6">
                            {(() => {
                              const currentPage = getCategoryPage(category);
                              const startIndex = (currentPage - 1) * productsPerPage;
                              const endIndex = startIndex + productsPerPage;
                              const productsToShow = filteredProducts.slice(startIndex, endIndex);
                              return <>{productsToShow.map((product) => (
                                <div key={product.id} onClick={(e) => handleProductClick(e, product.id)} className="bg-white rounded-lg overflow-hidden transition-all duration-200 block group cursor-pointer">
                                  {/* Product Image - Top */}
                                  <div className="aspect-square relative overflow-hidden mb-1 sm:mb-2" style={{ borderRadius: window.innerWidth < 640 ? '10px' : '12px' }}>
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                      style={{ borderRadius: window.innerWidth < 640 ? '10px' : '12px' }}
                                      loading="lazy"
                                      width="200"
                                      height="200"
                                    />

                                    {/* Country Badge */}
                                    <div className="absolute bg-white rounded-md shadow-sm" style={{
                                      display: 'flex',
                                      padding: window.innerWidth < 640 ? '1px 4px' : '2px 6px',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      gap: window.innerWidth < 640 ? '2px' : '4px',
                                      top: window.innerWidth < 640 ? '6px' : '8px',
                                      left: window.innerWidth < 640 ? '6px' : '8px'
                                    }}>
                                      <img
                                        src={getProductCountry(product.origin).flag}
                                        alt={getProductCountry(product.origin).name}
                                        className="rounded-full"
                                        style={{
                                          width: window.innerWidth < 640 ? '10px' : '12px',
                                          height: window.innerWidth < 640 ? '10px' : '12px',
                                          objectFit: 'cover'
                                        }}
                                      />
                                      <span className="font-medium text-gray-800" style={{ fontSize: window.innerWidth < 640 ? '8px' : '12px' }}>
                                        {getProductCountry(product.origin).abbreviation}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Product Content */}
                                  <div className="flex flex-col" style={{ padding: window.innerWidth < 640 ? '0 6px 6px 6px' : '0 12px 12px 12px' }}>
                                    {/* Price and Verified Badge Row */}
                                    <div className="flex items-center justify-between" style={{ marginBottom: window.innerWidth < 640 ? '4px' : '4px' }}>
                                      <div className="font-bold text-gray-900" style={{ fontSize: window.innerWidth < 640 ? '12px' : '16px' }}>
                                        {formatPriceDisplay(product.currency, product.price)}
                                      </div>
                                      {/* {product.verified ? (
                                        <div className="flex items-center text-green-600 bg-green-50 rounded" style={{
                                          display: 'flex',
                                          padding: window.innerWidth < 640 ? '1px 3px' : '1px 4px',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          gap: '1px',
                                          fontSize: window.innerWidth < 640 ? '7px' : '9px'
                                        }}>
                                          <img src={verifyIcon} alt="Verified" style={{ width: window.innerWidth < 640 ? '6px' : '8px', height: window.innerWidth < 640 ? '6px' : '8px' }} />
                                          <span>Verified seller</span>
                                        </div>
                                      ) : (
                                        <div className="flex items-center text-gray-600 bg-gray-100 rounded" style={{
                                          display: 'flex',
                                          padding: window.innerWidth < 640 ? '1px 3px' : '1px 4px',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          gap: '1px',
                                          fontSize: window.innerWidth < 640 ? '7px' : '9px'
                                        }}>
                                          <img src={unverifyIcon} alt="Unverified" style={{ width: window.innerWidth < 640 ? '6px' : '8px', height: window.innerWidth < 640 ? '6px' : '8px' }} />
                                          <span>Unverified Seller</span>
                                        </div>
                                      )} */}
                                    </div>

                                    {/* Product Name */}
                                    <h3 className="line-clamp-2 font-medium" style={{
                                      fontSize: window.innerWidth < 640 ? '10px' : '13px',
                                      color: '#212121',
                                      marginBottom: window.innerWidth < 640 ? '4px' : '4px'
                                    }}>{product.name}</h3>

                                    {/* Location and Bookmark Row - Below Product Name */}
                                    <div className="flex items-center justify-between">
                                      {/* Location */}
                                      <div className="flex items-center text-gray-500 flex-1">
                                        <img src={locationIcon} alt="Location" className="flex-shrink-0" style={{
                                          width: window.innerWidth < 640 ? '8px' : '10px',
                                          height: window.innerWidth < 640 ? '8px' : '10px',
                                          marginRight: window.innerWidth < 640 ? '3px' : '4px'
                                        }} />
                                        <span className="truncate font-normal" style={{ fontSize: window.innerWidth < 640 ? '8px' : '10px' }}>{formatCityDisplay(product.location)}</span>
                                      </div>

                                      {/* Bookmark Button */}
                                      <div style={{ marginLeft: window.innerWidth < 640 ? '4px' : '8px' }}>
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleSave(product.id);
                                          }}
                                          className="transition-colors touch-manipulation rounded"
                                          title={savedProducts.has(product.id) ? 'Remove from saved' : 'Save product'}
                                          style={{
                                            width: window.innerWidth < 640 ? '16px' : '20px',
                                            height: window.innerWidth < 640 ? '16px' : '20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: savedProducts.has(product.id) ? '#64B5F6' : 'transparent'
                                          }}
                                        >
                                          {savedProducts.has(product.id) ? (
                                            <svg
                                              style={{
                                                width: window.innerWidth < 640 ? '16px' : '20px',
                                                height: window.innerWidth < 640 ? '16px' : '20px',
                                                fill: 'white'
                                              }}
                                              viewBox="0 0 24 24"
                                            >
                                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                            </svg>
                                          ) : (
                                            <img src={bookmarkIcon} alt="Bookmark" style={{
                                              width: window.innerWidth < 640 ? '16px' : '20px',
                                              height: window.innerWidth < 640 ? '16px' : '20px',
                                              filter: 'grayscale(100%) opacity(0.5)'
                                            }} />
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}</>;
                            })()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <>
                  {/* Section Header - Hide when no search results */}
                  {!shouldShowNoResultsState() && (
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <h2 className="text-[20px] font-semibold text-gray-900">
                          {activeCategory}
                        </h2>
                        <svg className="w-5 h-5 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      {getProductsToDisplay().length > 0 && (
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={scrollProductsLeft}
                            className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                            aria-label="Scroll products left"
                          >
                            <img src={grayArrowIcon} alt="Previous" className="w-full h-full" />
                          </button>
                          <button
                            onClick={scrollProductsRight}
                            className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                            aria-label="Scroll products right"
                          >
                            <img src={blackArrowIcon} alt="Next" className="w-full h-full" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Products Grid */}
                  {shouldShowNoResultsState() ? (
                    <div>
                      {/* No Results State */}
                      <div className="text-center" style={{ padding: window.innerWidth < 640 ? '32px 16px' : '48px 16px' }}>
                        {/* Shopping Bag with Magnifying Glass Icon */}
                        <img
                          src={bagIcon}
                          alt="No products found"
                          className="mx-auto"
                          style={{
                            width: window.innerWidth < 640 ? '40px' : '60px',
                            height: window.innerWidth < 640 ? '40px' : '60px',
                            marginBottom: window.innerWidth < 640 ? '12px' : '16px'
                          }}
                        />

                        {/* Message */}
                        <p style={{
                          fontSize: window.innerWidth < 640 ? '12px' : '18px',
                          color: '#6A6A6A',
                          fontFamily: 'Poppins, sans-serif',
                          maxWidth: window.innerWidth < 640 ? '280px' : '500px',
                          margin: window.innerWidth < 640 ? '0 auto 12px' : '0 auto 16px',
                          lineHeight: '1.5'
                        }}>
                          Can't find what you're looking for? don't worry, just ask for it and we will bring it for you.
                        </p>

                        {/* Post a Request Button */}
                        <button
                          onClick={handleMakeRequestClick}
                          className="inline-flex items-center mx-auto"
                          style={{
                            display: 'flex',
                            padding: window.innerWidth < 640 ? '8px 16px' : '10px 20px',
                            alignItems: 'center',
                            gap: window.innerWidth < 640 ? '4px' : '6px',
                            borderRadius: '8px',
                            backgroundColor: '#F0F8FE',
                            color: '#64B5F6',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: window.innerWidth < 640 ? '11px' : '14px',
                            fontWeight: '500'
                          }}
                        >
                          <img src={draftsIcon} alt="Request" style={{ width: window.innerWidth < 640 ? '14px' : '20px', height: window.innerWidth < 640 ? '14px' : '20px' }} />
                          Post a request
                        </button>
                      </div>

                      {/* Other Products Near You Section */}
                      <div style={{ marginTop: window.innerWidth < 640 ? '32px' : '48px' }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: window.innerWidth < 640 ? '16px' : '24px' }}>
                          <h3 className="font-semibold text-gray-900" style={{
                            fontFamily: 'Faktum, sans-serif',
                            fontSize: window.innerWidth < 640 ? '14px' : '20px'
                          }}>
                            Other products near you
                          </h3>
                          <button className="font-medium hover:underline" style={{
                            color: '#64B5F6',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: window.innerWidth < 640 ? '10px' : '14px'
                          }}>
                            View more...
                          </button>
                        </div>

                        {/* Product Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 md:gap-6">
                          {Object.values(allProductsComputed).flat().slice(0, 6).map((product) => (
                            <div key={product.id} onClick={(e) => handleProductClick(e, product.id)} className="bg-white rounded-lg overflow-hidden transition-all duration-200 block group cursor-pointer">
                              {/* Product Image - Top */}
                              <div className="aspect-square relative overflow-hidden mb-1 sm:mb-2" style={{ borderRadius: window.innerWidth < 640 ? '10px' : '12px' }}>
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                  style={{ borderRadius: window.innerWidth < 640 ? '10px' : '12px' }}
                                  loading="lazy"
                                  width="200"
                                  height="200"
                                />

                                {/* Country Badge */}
                                <div className="absolute bg-white rounded-md shadow-sm" style={{
                                  display: 'flex',
                                  padding: window.innerWidth < 640 ? '1px 4px' : '2px 6px',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  gap: window.innerWidth < 640 ? '2px' : '4px',
                                  top: window.innerWidth < 640 ? '6px' : '8px',
                                  left: window.innerWidth < 640 ? '6px' : '8px'
                                }}>
                                  <img
                                    src={getProductCountry(product.origin).flag}
                                    alt={getProductCountry(product.origin).name}
                                    className="rounded-full"
                                    style={{
                                      width: window.innerWidth < 640 ? '10px' : '12px',
                                      height: window.innerWidth < 640 ? '10px' : '12px',
                                      objectFit: 'cover'
                                    }}
                                  />
                                  <span className="font-medium text-gray-800" style={{ fontSize: window.innerWidth < 640 ? '8px' : '12px' }}>
                                    {getProductCountry(product.origin).abbreviation}
                                  </span>
                                </div>
                              </div>

                              {/* Product Content */}
                              <div className="flex flex-col" style={{ padding: window.innerWidth < 640 ? '0 6px 6px 6px' : '0 12px 12px 12px' }}>
                                {/* Price and Verified Badge Row */}
                                <div className="flex items-center justify-between" style={{ marginBottom: window.innerWidth < 640 ? '4px' : '4px' }}>
                                  <div className="font-bold text-gray-900" style={{ fontSize: window.innerWidth < 640 ? '12px' : '16px' }}>
                                    {formatPriceDisplay(product.currency, product.price)}
                                  </div>
                                  {/* {product.verified ? (
                                <div className="flex items-center text-green-600 bg-green-50 rounded" style={{
                                  display: 'flex',
                                  padding: window.innerWidth < 640 ? '1px 3px' : '1px 4px',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  gap: '1px',
                                  fontSize: window.innerWidth < 640 ? '7px' : '9px'
                                }}>
                                  <img src={verifyIcon} alt="Verified" style={{ width: window.innerWidth < 640 ? '6px' : '8px', height: window.innerWidth < 640 ? '6px' : '8px' }} />
                                  <span>Verified seller</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-gray-600 bg-gray-100 rounded" style={{
                                  display: 'flex',
                                  padding: window.innerWidth < 640 ? '1px 3px' : '1px 4px',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  gap: '1px',
                                  fontSize: window.innerWidth < 640 ? '7px' : '9px'
                                }}>
                                  <img src={unverifyIcon} alt="Unverified" style={{ width: window.innerWidth < 640 ? '6px' : '8px', height: window.innerWidth < 640 ? '6px' : '8px' }} />
                                  <span>Unverified Seller</span>
                                </div>
                              )} */}
                                </div>

                                {/* Product Name */}
                                <h3 className="line-clamp-2 font-medium" style={{
                                  fontSize: window.innerWidth < 640 ? '10px' : '13px',
                                  color: '#212121',
                                  marginBottom: window.innerWidth < 640 ? '4px' : '4px'
                                }}>
                                  {product.name}
                                </h3>

                                {/* Location and Bookmark Row */}
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center text-gray-500 flex-1 min-w-0">
                                    <img src={locationIcon} alt="Location" className="flex-shrink-0" style={{
                                      width: window.innerWidth < 640 ? '8px' : '10px',
                                      height: window.innerWidth < 640 ? '8px' : '10px',
                                      marginRight: window.innerWidth < 640 ? '3px' : '4px'
                                    }} />
                                    <span className="truncate font-normal" style={{ fontSize: window.innerWidth < 640 ? '8px' : '10px' }}>{formatCityDisplay(product.location)}</span>
                                  </div>
                                  {/* Bookmark Button */}
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleSave(product.id);
                                    }}
                                    className="transition-colors touch-manipulation flex-shrink-0"
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      padding: '2px'
                                    }}
                                  >
                                    <BookmarkIcon saved={savedProducts.has(product.id)} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      ref={productGridRef}
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6 overflow-x-auto scrollbar-hide"
                    >
                      {getProductsToDisplay().map((product) => (
                        <div key={product.id} onClick={(e) => handleProductClick(e, product.id)} className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 block group cursor-pointer">
                          {/* Product Image - Top */}
                          <div className="aspect-square relative overflow-hidden rounded-xl mb-2">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 rounded-xl"
                              loading="lazy"
                              width="200"
                              height="200"
                            />

                            {/* Country Badge */}
                            <div className="absolute top-2 left-2 bg-white rounded-md shadow-sm" style={{ display: 'flex', padding: '2px 6px', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                              <img
                                src={getProductCountry(product.origin).flag}
                                alt={getProductCountry(product.origin).name}
                                className="w-3 h-3 object-cover rounded-full"
                              />
                              <span className="text-xs font-medium text-gray-800">
                                {getProductCountry(product.origin).abbreviation}
                              </span>
                            </div>
                          </div>

                          {/* Product Content */}
                          <div className="px-2 pb-2 sm:px-3 sm:pb-3 flex flex-col">
                            {/* Price and Verified Badge Row */}
                            <div className="flex items-center justify-between mb-1">
                              <div className="font-bold text-gray-900" style={{ fontSize: '16px' }}>
                                {formatPriceDisplay(product.currency, product.price)}
                              </div>
                              {/* {product.verified ? (
                            <div className="flex items-center text-green-600 bg-green-50 rounded" style={{ display: 'flex', padding: '1px 4px', justifyContent: 'center', alignItems: 'center', gap: '1px', fontSize: '9px' }}>
                              <img src={verifyIcon} alt="Verified" className="w-2 h-2" />
                              <span>Verified seller</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-gray-600 bg-gray-100 rounded" style={{ display: 'flex', padding: '1px 4px', justifyContent: 'center', alignItems: 'center', gap: '1px', fontSize: '9px' }}>
                              <img src={unverifyIcon} alt="Unverified" className="w-2 h-2" />
                              <span>Unverified Seller</span>
                            </div>
                          )} */}
                            </div>

                            {/* Product Name */}
                            <h3 className="mb-1 line-clamp-2 font-medium" style={{ fontSize: '13px', color: '#212121' }}>{product.name}</h3>

                            {/* Location and Bookmark Row - Below Product Name */}
                            <div className="flex items-center justify-between gap-2">
                              {/* Location */}
                              <div className="flex items-center text-gray-500 flex-1 min-w-0">
                                <img src={locationIcon} alt="Location" className="w-2.5 h-2.5 mr-1 flex-shrink-0" />
                                <span className="truncate font-normal" style={{ fontSize: '10px' }}>{formatCityDisplay(product.location)}</span>
                              </div>

                              {/* Bookmark Button */}
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleSave(product.id);
                                }}
                                className="transition-colors touch-manipulation flex-shrink-0"
                                title={savedProducts.has(product.id) ? 'Remove from saved' : 'Save product'}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  padding: '2px'
                                }}
                              >
                                <BookmarkIcon saved={savedProducts.has(product.id)} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* Pagination - Mobile Responsive - Hide when no search results */}
      {!shouldShowNoResultsState() && totalPages > 1 && (
        <section className="py-8 sm:py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {(() => {
              // Generate pagination numbers dynamically
              const paginationNumbers: number[] = [];

              if (totalPages <= 7) {
                // Show all pages if total is 7 or less
                for (let i = 1; i <= totalPages; i++) {
                  paginationNumbers.push(i);
                }
              } else {
                // Show pages around current page with ellipsis
                if (currentPage <= 4) {
                  // Show first 5 pages when near the start
                  for (let i = 1; i <= 5; i++) {
                    paginationNumbers.push(i);
                  }
                } else if (currentPage >= totalPages - 3) {
                  // Show last 5 pages when near the end
                  for (let i = totalPages - 4; i <= totalPages; i++) {
                    paginationNumbers.push(i);
                  }
                } else {
                  // Show current page and 2 pages on each side
                  for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    paginationNumbers.push(i);
                  }
                }
              }

              // Handle "Go to" functionality
              const handleGoToPage = () => {
                const pageNum = parseInt(goToPageInput);
                if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                  setCurrentPage(pageNum);
                  setGoToPageInput('');
                }
              };

              const handleGoToKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  handleGoToPage();
                }
              };

              return (
                <div className={`flex flex-col ${isMobile ? 'items-center gap-2' : 'lg:flex-row items-center gap-6'} mt-12 ${isMobile ? 'mb-8' : 'mb-16'} w-full`}>
                  <div className={`flex-1 flex justify-center w-full ${isMobile ? '' : ''}`}>
                    <div className={`flex items-center ${isMobile ? 'gap-6' : 'gap-6'}`} style={isMobile ? {} : { marginLeft: '80px' }}>
                      <button
                        aria-label="Previous page"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        style={{
                          width: isMobile ? '24px' : '32px',
                          height: isMobile ? '24px' : '32px',
                          borderRadius: '8px',
                          backgroundColor: '#F0F0F0',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                          opacity: currentPage === 1 ? 0.5 : 1
                        }}
                      >
                        <svg width={isMobile ? '12' : '16'} height={isMobile ? '12' : '16'} viewBox="0 0 24 24" fill="none" stroke="#8C8C8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                      </button>

                      <div className="flex items-center" style={{ gap: isMobile ? '24px' : '36px' }}>
                        {/* Show page 1 and ellipsis if first page is not in paginationNumbers */}
                        {totalPages > 7 && !paginationNumbers.includes(1) && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setCurrentPage(1);
                              }}
                              style={{
                                color: 1 === currentPage ? '#212121' : '#B0B0B0',
                                fontFamily: 'Bricolage Grotesque, sans-serif',
                                fontSize: isMobile ? '12px' : '16px',
                                cursor: 'pointer',
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                margin: 0
                              }}
                              aria-label="Go to page 1"
                            >
                              1
                            </button>
                            <span style={{ color: '#B0B0B0', fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: isMobile ? '12px' : '16px' }}>…</span>
                          </>
                        )}

                        {paginationNumbers.map((page) => (
                          <button
                            key={page}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCurrentPage(page);
                            }}
                            style={{
                              fontFamily: 'Bricolage Grotesque, sans-serif',
                              fontSize: isMobile ? '12px' : '16px',
                              color: page === currentPage ? '#212121' : '#B0B0B0',
                              cursor: 'pointer',
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              margin: 0
                            }}
                            aria-label={`Go to page ${page}`}
                          >
                            {page}
                          </button>
                        ))}

                        {/* Show ellipsis and last page if last page is not in paginationNumbers */}
                        {totalPages > 7 && !paginationNumbers.includes(totalPages) && (
                          <>
                            <span style={{ color: '#B0B0B0', fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: isMobile ? '12px' : '16px' }}>…</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setCurrentPage(totalPages);
                              }}
                              style={{
                                color: totalPages === currentPage ? '#212121' : '#B0B0B0',
                                fontFamily: 'Bricolage Grotesque, sans-serif',
                                fontSize: isMobile ? '12px' : '16px',
                                cursor: 'pointer',
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                margin: 0
                              }}
                              aria-label={`Go to page ${totalPages}`}
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </div>

                      <button
                        aria-label="Next page"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        style={{
                          width: isMobile ? '24px' : '32px',
                          height: isMobile ? '24px' : '32px',
                          borderRadius: '8px',
                          backgroundColor: '#F0F0F0',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                          opacity: currentPage === totalPages ? 0.5 : 1
                        }}
                      >
                        <svg width={isMobile ? '12' : '16'} height={isMobile ? '12' : '16'} viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 6l6 6-6 6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className={`flex items-center ${isMobile ? 'gap-3 justify-center' : 'gap-2'}`}>
                    <span style={{ color: '#939393', fontFamily: 'Poppins, sans-serif', fontSize: isMobile ? '11px' : '12px' }}>Go to :</span>
                    <input
                      type="text"
                      placeholder="e.g 40"
                      value={goToPageInput}
                      onChange={(e) => setGoToPageInput(e.target.value)}
                      onKeyPress={handleGoToKeyPress}
                      style={{
                        border: '1px solid #BABABA',
                        borderRadius: '8px',
                        padding: isMobile ? '5px 9px' : '6px 10px',
                        fontFamily: 'Bricolage Grotesque, sans-serif',
                        fontSize: isMobile ? '11px' : '12px',
                        color: goToPageInput ? '#212121' : '#D9D9D9',
                        width: isMobile ? '55px' : '64px',
                        textAlign: 'center'
                      }}
                    />
                    <button
                      onClick={handleGoToPage}
                      style={{
                        backgroundColor: '#212121',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        padding: '6px 14px',
                        fontFamily: 'Bricolage Grotesque, sans-serif',
                        fontSize: '12px',
                        cursor: 'pointer',
                        border: 'none'
                      }}
                    >
                      Go
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* Post a Request Card - Always Visible */}
      <section className="py-8 px-6 sm:px-8 lg:px-12" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                Can't find what you're looking for?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-2xl">
                Post a request and local sellers can message you if they have it.
              </p>
              <button
                onClick={handleMakeRequestClick}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-colors"
                style={{
                  background: 'linear-gradient(90deg, #E55325 0%, #F9A825 100%)',
                  minWidth: '200px'
                }}
              >
                Post a Request
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Buy & Sell Instantly Section */}
      <section className="pt-0 pb-16 px-6 sm:px-8 lg:px-16" style={{ fontFamily: 'Poppins, sans-serif', marginTop: '-32px' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-6 sm:mb-8">
            <div className="flex-1">
              <h2 className="mb-3 sm:mb-4" style={{ fontSize: window.innerWidth < 640 ? '20px' : '44px', fontWeight: '600', lineHeight: '1.2' }}>
                <span style={{ color: '#212121' }}>Buy & Sell </span>
                <span style={{
                  background: 'linear-gradient(90deg, #E55325 0%, #F9A825 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Instantly
                </span>
              </h2>
              <p style={{ fontSize: window.innerWidth < 640 ? '9px' : '16px', color: '#9C9C9C', maxWidth: window.innerWidth < 640 ? '220px' : '600px', lineHeight: '1.6' }}>
                Turn unmet needs into instant deals, discover what people are looking for, grab it, and sell it right where demand begins
              </p>
            </div>
            <div className="text-right">
              <div style={{
                fontSize: window.innerWidth < 640 ? '20px' : '44px',
                fontWeight: '600',
                background: 'linear-gradient(90deg, #E55325 0%, #F9A825 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Over {requests.length}
              </div>
              <div style={{ fontSize: window.innerWidth < 640 ? '10px' : '18px', color: '#9C9C9C', marginTop: '4px' }}>
                Request availables
              </div>
            </div>
          </div>

          {/* Filter Bar Section */}
          <div className={window.innerWidth < 640 ? "flex flex-col gap-5 mb-6 mt-8" : "flex items-center gap-4 mb-8 mt-20"}>
            {/* Buyer Location Search Bar - Top on Mobile */}
            <div style={{ width: window.innerWidth < 640 ? '100%' : '380px', marginLeft: window.innerWidth < 640 ? '0' : 'auto', order: window.innerWidth < 640 ? 1 : 3 }}>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Buyer location ?"
                  value={requestBuyerLocation}
                  onChange={(e) => setRequestBuyerLocation(e.target.value)}
                  className="w-full border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E4E4E4',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: window.innerWidth < 640 ? '10px' : '14px',
                    color: '#6A6A6A',
                    padding: window.innerWidth < 640 ? '6px 50px 6px 10px' : '10px 112px 10px 16px'
                  }}
                />
                <div
                  className="absolute right-2 flex items-center justify-center"
                  style={{
                    backgroundColor: '#F9A825',
                    height: window.innerWidth < 640 ? '20px' : '28px',
                    paddingLeft: window.innerWidth < 640 ? '10px' : '18px',
                    paddingRight: window.innerWidth < 640 ? '10px' : '18px',
                    borderRadius: '8px'
                  }}
                >
                  <img src={buyerIcon} alt="Search" style={{ width: window.innerWidth < 640 ? '12px' : '16px', height: window.innerWidth < 640 ? '12px' : '16px' }} />
                </div>
              </div>
            </div>

            {/* Filter and Price Buttons Row - Bottom on Mobile */}
            <div className={window.innerWidth < 640 ? "flex gap-2" : "contents"} style={{ order: window.innerWidth < 640 ? 2 : 1 }}>
              {renderCountryFilterButton('relative', 'buy-sell')}
              {renderPriceFilterButton('relative', 'buy-sell')}
            </div>
          </div>

          {/* Request Cards Section */}
          <div className="relative">
            {/* Fade effect on the right - Desktop only */}
            {window.innerWidth >= 640 && (
              <div
                className="absolute top-0 right-0 bottom-0 w-32 pointer-events-none z-10"
                style={{
                  background: 'linear-gradient(to left, white 0%, rgba(255, 255, 255, 0.8) 30%, transparent 100%)',
                  height: 'calc(100% - 4rem)'
                }}
              />
            )}
            <div
              ref={requestsScrollRef}
              className={isMobile ? "flex gap-4 mb-6 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6"}
              style={isMobile ? {
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              } : {}}
            >
              {isLoadingRequests ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : requestsError ? (
                <div className="col-span-full text-center py-12 text-red-500">
                  {requestsError}
                </div>
              ) : requests.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No requests found
                </div>
              ) : (
                requests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white hover:shadow-md transition-shadow cursor-pointer"
                    style={{
                      position: isMobile ? 'relative' : 'relative',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      height: 'auto',
                      width: isMobile ? '260px' : 'auto',
                      flexShrink: isMobile ? 0 : 'initial',
                      padding: isMobile ? '10px' : '16px',
                      borderRadius: '24px',
                      margin: isMobile ? '0 4px' : '0'
                    }}
                  >
                    {/* Product Name Label and Button - Desktop only */}
                    {!isMobile && (
                      <div className="flex items-center justify-between mb-2">
                        <span
                          style={{
                            fontSize: '10px',
                            color: '#BABABA',
                            border: '1px solid #E1E1E1',
                            borderRadius: '999px',
                            padding: '2px 8px',
                            fontFamily: 'Poppins, sans-serif'
                          }}
                        >
                          Request
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border"
                            style={{
                              backgroundColor: '#FFFFFF',
                              borderColor: '#F9A825',
                              color: '#F9A825',
                              fontWeight: 'normal',
                              fontSize: '11px',
                              fontFamily: 'Poppins, sans-serif',
                              height: '26px',
                              width: 'auto'
                            }}
                            onClick={() => navigate('/requests')}
                          >
                            <img src={requestIcon} alt="Request" style={{ width: '12px', height: '12px' }} />
                            View request
                          </button>
                          <button
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: '#F4F4F4',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <img
                              src={shareIcon}
                              alt="Share"
                              style={{
                                width: '16px',
                                height: '16px',
                                filter: 'brightness(0) saturate(100%) invert(73%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)'
                              }}
                            />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Product Name Label and Status Badge Only - Mobile */}
                    {isMobile && (
                      <div className="flex items-center justify-between mb-1" style={{ position: 'relative' }}>
                        <span
                          style={{
                            fontSize: '9px',
                            color: '#BABABA',
                            border: '1px solid #E1E1E1',
                            borderRadius: '999px',
                            padding: '2px 6px',
                            fontFamily: 'Poppins, sans-serif'
                          }}
                        >
                          Request
                        </span>
                        <button
                          className="rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: '#F4F4F4',
                            border: 'none',
                            cursor: 'pointer',
                            width: '24px',
                            height: '24px',
                            flexShrink: 0,
                            position: 'absolute',
                            right: 0
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <img
                            src={shareIcon}
                            alt="Share"
                            style={{
                              width: '12px',
                              height: '12px',
                              filter: 'brightness(0) saturate(100%) invert(73%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)'
                            }}
                          />
                        </button>
                      </div>
                    )}

                    {/* Product Title */}
                    <h3 className="mb-2 sm:mb-3" style={{ fontSize: isMobile ? '11px' : '14px', fontWeight: '500', color: '#212121' }}>
                      {request.productName || 'No title provided'}
                    </h3>

                    {/* Description */}
                    <p className="mb-3 sm:mb-4" style={{ fontSize: isMobile ? '7px' : '10px', color: '#6A6A6A', lineHeight: '1.5', fontWeight: 'normal' }}>
                      {request.description || 'No description available'}
                    </p>


                    {/* Tags and User Info Row - Desktop/Tablet */}
                    {!isMobile && (
                      <div className="flex items-end justify-between">
                        {/* Tags - Stacked Layout */}
                        <div className="flex flex-col gap-2">
                          {/* First Row - Location */}
                          <div
                            className="flex items-center gap-1.5 px-2.5 py-1"
                            style={{
                              backgroundColor: '#FFFFFF',
                              borderRadius: '999px',
                              width: 'fit-content',
                              border: '1px solid #E1E1E1'
                            }}
                          >
                            <img
                              src={locationIcon}
                              alt="Location"
                              className="w-3 h-3"
                              style={{ filter: 'brightness(0) saturate(100%) invert(70%) sepia(99%) saturate(1352%) hue-rotate(349deg) brightness(102%) contrast(97%)' }}
                            />
                            <span style={{ fontSize: '12px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>{formatCityDisplay(request.sellerLocation || '') || 'Location not specified'}</span>
                          </div>

                          {/* Second Row - Price and Country */}
                          <div className="flex gap-2">
                            {/* Price Tag */}
                            <div
                              className="flex items-center gap-1.5 px-2.5 py-1"
                              style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: '999px',
                                border: '1px solid #E1E1E1'
                              }}
                            >
                              <img
                                src={moneyIcon}
                                alt="Money"
                                className="w-3 h-3"
                                style={{ filter: 'brightness(0) saturate(100%) invert(64%) sepia(52%) saturate(555%) hue-rotate(176deg) brightness(97%) contrast(92%)' }}
                              />
                              <span style={{ fontSize: '12px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>{formatPriceRange(request.minPrice, request.maxPrice, request.currency)}</span>
                            </div>

                            {/* Country Tag */}
                            <div
                              className="flex items-center gap-1.5 px-2.5 py-1"
                              style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: '999px',
                                border: '1px solid #E1E1E1'
                              }}
                            >
                              {(() => {
                                const country = getProductCountry(request?.origin);
                                return (
                                  <>
                                    <img
                                      src={country.flag}
                                      alt={country.name}
                                      className="object-cover rounded-full"
                                      style={{ width: '16px', height: '16px' }}
                                    />
                                    <span style={{ fontSize: '12px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>{country.name}</span>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </div>

                        {/* User Info */}
                        <div className="flex flex-col items-center mt-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
                            style={{
                              backgroundColor: '#F7C9B0',
                              border: '2px solid #939393'
                            }}
                          >
                            {request && request.user && request.user.profileImage ? (
                              <img
                                src={request.user.profileImage}
                                alt={request.user.firstName || 'User'}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                              />
                            ) : (
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#8B5E3C" />
                                <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#8B5E3C" />
                              </svg>
                            )}
                          </div>
                          <div
                            className="flex items-center justify-center gap-0.5 px-1.5 py-0.5 border -mt-2"
                            style={{ borderColor: '#F4F4F4', backgroundColor: '#FFFFFF', borderRadius: '12px' }}
                          >
                            <svg className="w-2.5 h-2.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span style={{ fontSize: '10px', color: '#212121', fontWeight: '500' }}>{request.user.rating || 0.0}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tags - Mobile Only */}
                    {isMobile && (
                      <div className="flex flex-col gap-2 mb-3">
                        {/* First Row - Location */}
                        <div
                          className="flex items-center gap-1.5 px-2 py-0.5"
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '999px',
                            width: 'fit-content',
                            border: '1px solid #E1E1E1'
                          }}
                        >
                          <img
                            src={locationIcon}
                            alt="Location"
                            style={{
                              width: '9px',
                              height: '9px',
                              filter: 'brightness(0) saturate(100%) invert(70%) sepia(99%) saturate(1352%) hue-rotate(349deg) brightness(102%) contrast(97%)'
                            }}
                          />
                          <span style={{ fontSize: '8px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>{formatCityDisplay(request.sellerLocation || '') || 'Location not specified'}</span>
                        </div>

                        {/* Second Row - Price and Country */}
                        <div className="flex gap-2">
                          {/* Price Tag */}
                          <div
                            className="flex items-center gap-1.5 px-2 py-0.5"
                            style={{
                              backgroundColor: '#FFFFFF',
                              borderRadius: '999px',
                              border: '1px solid #E1E1E1'
                            }}
                          >
                            <img
                              src={moneyIcon}
                              alt="Money"
                              style={{
                                width: '9px',
                                height: '9px',
                                filter: 'brightness(0) saturate(100%) invert(64%) sepia(52%) saturate(555%) hue-rotate(176deg) brightness(97%) contrast(92%)'
                              }}
                            />
                            <span style={{ fontSize: '8px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>{formatPriceRange(request.minPrice, request.maxPrice, request.currency)}</span>
                          </div>

                          {/* Country Tag */}
                          <div
                            className="flex items-center gap-1.5 px-2 py-0.5"
                            style={{
                              backgroundColor: '#FFFFFF',
                              borderRadius: '999px',
                              border: '1px solid #E1E1E1'
                            }}
                          >
                            {(() => {
                              const country = getProductCountry(request?.origin);
                              return (
                                <>
                                  <img
                                    src={country.flag}
                                    alt={country.name}
                                    style={{
                                      width: '12px',
                                      height: '12px',
                                      objectFit: 'cover',
                                      borderRadius: '50%'
                                    }}
                                  />
                                  <span style={{ fontSize: '8px', color: '#64B5F6', fontWeight: '300' }}>{country.name}</span>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* User Profile Section - Mobile (New Layout) */}
                    {isMobile && (
                      <>
                        {/* Gray Divider */}
                        <div style={{ width: '100%', height: '0.5px', backgroundColor: '#E4E4E4', marginBottom: '8px' }}></div>

                        <div className="flex items-center justify-between">
                          {/* Left: Avatar and User Info */}
                          <div className="flex items-center gap-2">
                            <div
                              className="rounded-full flex items-center justify-center overflow-hidden"
                              style={{
                                backgroundColor: '#F7C9B0',
                                width: '24px',
                                height: '24px',
                                border: '2px solid #939393'
                              }}
                            >
                              {request && request.user && request.user.profileImage ? (
                                <img
                                  src={request.user.profileImage}
                                  alt={request.user.firstName || 'User'}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                />
                              ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#8B5E3C" />
                                  <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#8B5E3C" />
                                </svg>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span style={{ fontSize: '8px', color: '#212121', fontWeight: '500' }}>{request.user.firstName} {request.user.lastName}</span>
                              {/* Rating below name */}
                              <div className="flex items-center gap-0.5 mt-0.5">
                                <svg
                                  className="text-yellow-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  style={{ width: '8px', height: '8px' }}
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <svg
                                  className="text-yellow-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  style={{ width: '8px', height: '8px' }}
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <svg
                                  className="text-yellow-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  style={{ width: '8px', height: '8px' }}
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <svg
                                  className="text-yellow-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  style={{ width: '8px', height: '8px' }}
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <svg
                                  className="text-gray-300"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  style={{ width: '8px', height: '8px' }}
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span style={{ fontSize: '8px', color: '#212121', fontWeight: '500', marginLeft: '2px' }}>{request.user.rating || 0.0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Respond to the request button - Mobile only */}
                    {isMobile && (
                      <div className="w-full flex justify-center mt-3">
                        <button
                          className="flex items-center justify-center gap-1.5 mx-auto"
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #F9A825',
                            color: '#F9A825',
                            fontWeight: 'normal',
                            fontSize: '9px',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            width: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <img src={requestIcon} alt="Request" style={{ width: '12px', height: '12px' }} />
                          Manage the request
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Navigation Arrows - only show when there are requests */}
            {requests.length > 0 && (
              <div className="flex items-center justify-between gap-3 mt-6">
                {/* See all requests link */}
                <Link
                  to="/requests"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
                  style={{
                    color: '#64B5F6',
                    fontSize: window.innerWidth < 640 ? '12px' : '16px',
                    textDecoration: 'none',
                    marginLeft: '8px'
                  }}
                >
                  <span>See all requests</span>
                  <img
                    src={requestArrowIcon}
                    alt="Arrow"
                    style={{
                      width: window.innerWidth < 640 ? '12px' : '16px',
                      height: window.innerWidth < 640 ? '12px' : '16px',
                      filter: 'brightness(0) saturate(100%) invert(64%) sepia(52%) saturate(555%) hue-rotate(176deg) brightness(97%) contrast(92%)',
                      transform: 'scaleX(1.3)',
                      transformOrigin: 'center'
                    }}
                  />
                </Link>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => requestsScrollRef.current?.scrollBy({ left: -276, behavior: 'smooth' })}
                    disabled={requests.length <= 3}
                    className="rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      width: window.innerWidth < 640 ? '20px' : '24px',
                      height: window.innerWidth < 640 ? '20px' : '24px',
                      opacity: requests.length <= 3 ? 0.4 : 1,
                      cursor: requests.length <= 3 ? 'not-allowed' : 'pointer',
                      pointerEvents: requests.length <= 3 ? 'none' : 'auto'
                    }}
                    aria-label="Previous"
                  >
                    <img src={grayArrowIcon} alt="Previous" className="w-full h-full" />
                  </button>
                  <button
                    type="button"
                    onClick={() => requestsScrollRef.current?.scrollBy({ left: 276, behavior: 'smooth' })}
                    disabled={requests.length <= 3}
                    className="rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      width: window.innerWidth < 640 ? '20px' : '24px',
                      height: window.innerWidth < 640 ? '20px' : '24px',
                      opacity: requests.length <= 3 ? 0.4 : 1,
                      cursor: requests.length <= 3 ? 'not-allowed' : 'pointer',
                      pointerEvents: requests.length <= 3 ? 'none' : 'auto'
                    }}
                    aria-label="Next"
                  >
                    <img src={blackArrowIcon} alt="Next" className="w-full h-full" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Request Modal/Form - Mobile: Full Page, Desktop: Modal */}
      {showRequestModal && isMobile ? (
        // Mobile: Full Page Form
        <div className="fixed inset-0 bg-white z-50 flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {/* Header with Title and X Button */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#171717', fontFamily: 'Bricolage Grotesque, sans-serif', fontStyle: 'bold' }}>
              Do a request
            </h1>
            <button
              onClick={() => setShowRequestModal(false)}
              style={{ color: '#171717', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-4 pb-6">

            {/* Product Name Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '10px', color: '#6A6A6A', display: 'block', marginBottom: '4px' }}>
                Product name
              </label>
              <input
                type="text"
                value={requestProductName}
                onChange={(e) => setRequestProductName(e.target.value)}
                placeholder="Enter product name"
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid #E4E4E4',
                  fontSize: '10px',
                  fontFamily: 'Poppins, sans-serif',
                  outline: 'none'
                }}
              />
            </div>

            {/* Product Origin Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '10px', color: '#6A6A6A', display: 'block', marginBottom: '4px' }}>
                Product Origin
              </label>
              <div className="relative" ref={requestProductOriginDropdownRef}>
                <div className="relative flex items-center w-full">
                  <input
                    type="text"
                    placeholder="Type a country"
                    value={requestProductOrigin || requestProductOriginInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRequestProductOriginInput(value);
                      setRequestProductOrigin('');
                      if (value.trim()) {
                        setIsRequestProductOriginDropdownOpen(true);
                      }
                    }}
                    onFocus={() => {
                      if (requestProductOriginInput.trim() || !requestProductOrigin) {
                        setIsRequestProductOriginDropdownOpen(true);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        setIsRequestProductOriginDropdownOpen(false);
                      }, 200);
                    }}
                    className="w-full px-3 py-2.5 border rounded-lg focus:outline-none"
                    style={{
                      border: '1px solid #E4E4E4',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      minHeight: '32px',
                      padding: '6px 10px',
                      fontSize: '10px',
                      fontFamily: 'Poppins, sans-serif',
                      color: (requestProductOrigin || requestProductOriginInput) ? '#212121' : '#D9D9D9',
                      paddingRight: '32px'
                    }}
                  />
                  <img
                    src={arrowDownIcon}
                    alt="Arrow"
                    className="absolute right-3 w-3 h-3 transition-transform flex-shrink-0 cursor-pointer"
                    style={{
                      transform: isRequestProductOriginDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      pointerEvents: 'none'
                    }}
                  />
                </div>
                {isRequestProductOriginDropdownOpen && (
                  <div
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden"
                    style={{
                      maxHeight: '200px',
                      overflowY: 'auto',
                      borderRadius: '8px'
                    }}
                  >
                    <style>
                      {`
                        .request-origin-dropdown::-webkit-scrollbar {
                          width: 2px;
                        }
                        .request-origin-dropdown::-webkit-scrollbar-track {
                          background: transparent;
                        }
                        .request-origin-dropdown::-webkit-scrollbar-thumb {
                          background-color: #E4E4E4;
                          border-radius: 10px;
                        }
                      `}
                    </style>
                    <div className="request-origin-dropdown py-1">
                      <button
                        type="button"
                        onMouseDown={() => {
                          setRequestProductOrigin('');
                          setRequestProductOriginInput('');
                          setIsRequestProductOriginDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        style={{
                          backgroundColor: !requestProductOrigin && !requestProductOriginInput ? '#F0F8FE' : 'transparent',
                          color: !requestProductOrigin && !requestProductOriginInput ? '#64B5F6' : '#6A6A6A',
                          fontSize: '10px'
                        }}
                      >
                        <img
                          src={globyIcon}
                          alt="Globe"
                          className="w-3 h-3"
                          style={{
                            filter: (requestProductOrigin || requestProductOriginInput)
                              ? 'grayscale(100%) brightness(0.7)'
                              : 'none'
                          }}
                        />
                        <span>Africa</span>
                      </button>
                      {africanCountries
                        .filter((country) => {
                          const searchTerm = requestProductOriginInput.toLowerCase().trim();
                          if (!searchTerm) return true;
                          return country.name.toLowerCase().includes(searchTerm);
                        })
                        .map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onMouseDown={() => {
                              setRequestProductOrigin(country.name);
                              setRequestProductOriginInput('');
                              setIsRequestProductOriginDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 transition-colors flex items-center gap-2 relative hover:bg-gray-50"
                            style={{
                              color: requestProductOrigin === country.name ? '#64B5F6' : '#6A6A6A',
                              fontSize: '10px',
                              backgroundColor: requestProductOrigin === country.name ? '#F0F8FE' : 'transparent'
                            }}
                          >
                            <img
                              src={country.flag}
                              alt={country.name}
                              className="object-cover rounded-full"
                              style={{ width: '16px', height: '16px' }}
                            />
                            <span>{country.name}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '10px', color: '#6A6A6A', display: 'block', marginBottom: '4px' }}>
                Description
              </label>
              <textarea
                value={requestDescription}
                onChange={(e) => setRequestDescription(e.target.value)}
                placeholder="Add an description"
                rows={5}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid #E4E4E4',
                  fontSize: '9px',
                  fontFamily: 'Poppins, sans-serif',
                  outline: 'none',
                  resize: 'none',
                  color: requestDescription ? '#212121' : '#D9D9D9'
                }}
              />
            </div>

            {/* Location Section */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '10px', color: '#6A6A6A', display: 'block', marginBottom: '-2px' }}>
                Your location
              </label>
              <div className="relative location-dropdown-container" ref={locationDropdownRef}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <img src={locIcon} alt="Location" style={{ width: '12px', height: '12px' }} />
                    <input
                      type="text"
                      value={formatCityDisplay(location)}
                      readOnly
                      className="text-xs font-medium border-none focus:outline-none cursor-default"
                      style={{ color: '#64B5F6', backgroundColor: 'transparent', fontSize: '10px' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '8px',
                      backgroundColor: '#F0F8FE',
                      color: '#64B5F6',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '9px',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    Change location
                  </button>
                </div>
                {/* Location Dropdown */}
                {isLocationDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full max-w-xs bg-white rounded-lg shadow-lg border border-gray-200" style={{ top: '100%', left: 0 }}>
                    <div className="p-2 max-h-60 overflow-auto">
                      <div className="px-3 py-2 text-xs font-medium text-gray-500">United Kingdom</div>
                      {UK_CITIES_PLAIN.map((city) => (
                        <button
                          key={city}
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                          onClick={() => {
                            setLocation(city);
                            setIsLocationDropdownOpen(false);
                          }}
                          style={{ fontSize: '10px' }}
                        >
                          {formatCityDisplay(city)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price Range Section */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '13px', color: '#212121', marginBottom: '8px', fontWeight: '500' }}>
                How much would you like to pay for the product?
              </h3>
              <div className="flex gap-2" style={{ marginBottom: '6px', flexWrap: 'wrap' }}>
                {['Less than 10 GBP', '10 - 50 GBP', '50 - 100 GBP', '100 - 200 GBP'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setRequestPriceRange(range)}
                    style={{
                      width: 'calc(50% - 4px)',
                      padding: '6px 8px',
                      borderRadius: '8px',
                      border: `1px solid ${requestPriceRange === range ? 'transparent' : '#E4E4E4'}`,
                      backgroundColor: requestPriceRange === range ? '#F0F8FE' : '#FFF',
                      color: requestPriceRange === range ? '#64B5F6' : '#6A6A6A',
                      cursor: 'pointer',
                      fontSize: '9px',
                      fontFamily: 'Poppins, sans-serif',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {formatRequestPriceRangeLabel(range)}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setRequestPriceRange('More than 200 GBP')}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: '8px',
                  border: `1px solid ${requestPriceRange === 'More than 200 GBP' ? 'transparent' : '#E4E4E4'}`,
                  backgroundColor: requestPriceRange === 'More than 200 GBP' ? '#F0F8FE' : '#FFF',
                  color: requestPriceRange === 'More than 200 GBP' ? '#64B5F6' : '#6A6A6A',
                  cursor: 'pointer',
                  fontSize: '9px',
                  fontFamily: 'Poppins, sans-serif',
                  textAlign: 'center'
                }}
              >
                {formatRequestPriceRangeLabel('More than 200 GBP')}
              </button>
            </div>

            {/* Create Request Button */}
            <button
              style={{
                display: 'flex',
                width: '100%',
                height: '36px',
                padding: '8px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                flexShrink: 0,
                borderRadius: '8px',
                backgroundColor: '#F9A825',
                color: '#FFF',
                border: 'none',
                cursor: (isSubmittingRequest || isSubmitting) ? 'not-allowed' : 'pointer',
                marginTop: '20px',
                fontSize: '11px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '400',
                margin: '0 auto',
                opacity: (isSubmittingRequest || isSubmitting) ? 0.7 : 1
              }}
              onClick={(e) => {
                e.preventDefault();
                handleRequestSubmit(e as any);
              }}
              disabled={isSubmittingRequest || isSubmitting}
            >
              {(isSubmittingRequest || isSubmitting) ? 'Submitting...' : 'Create the request'}
            </button>
          </div>
        </div>
      ) : showRequestModal && !isMobile ? (
        // Desktop/Tablet: Modal Overlay
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#0000001A',
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setShowRequestModal(false)}
        >
          {/* Request Modal */}
          <div
            style={{
              width: '580px',
              height: 'auto',
              maxHeight: '90vh',
              flexShrink: 0,
              borderRadius: '30px',
              background: '#FFF',
              padding: '24px 32px',
              position: 'relative',
              fontFamily: 'Poppins, sans-serif',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', color: '#212121', fontWeight: '600' }}>
                Do a request
              </h2>
              <button
                onClick={() => setShowRequestModal(false)}
                style={{
                  width: '24px',
                  height: '24px',
                  color: '#212121',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            {/* Product Name Input */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#6A6A6A', display: 'block', marginBottom: '6px' }}>
                Product name
              </label>
              <input
                type="text"
                value={requestProductName}
                onChange={(e) => setRequestProductName(e.target.value)}
                placeholder="Enter product name"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E4E4E4',
                  fontSize: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  outline: 'none'
                }}
              />
            </div>

            {/* Product Origin Input */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#6A6A6A', display: 'block', marginBottom: '6px' }}>
                Product Origin
              </label>
              <div style={{ position: 'relative' }} ref={requestProductOriginDropdownRef}>
                <div className="relative flex items-center w-full">
                  <input
                    type="text"
                    placeholder="Type a country"
                    value={requestProductOrigin || requestProductOriginInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRequestProductOriginInput(value);
                      setRequestProductOrigin('');
                      if (value.trim()) {
                        setIsRequestProductOriginDropdownOpen(true);
                      }
                    }}
                    onFocus={() => {
                      if (requestProductOriginInput.trim() || !requestProductOrigin) {
                        setIsRequestProductOriginDropdownOpen(true);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        setIsRequestProductOriginDropdownOpen(false);
                      }, 200);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      paddingRight: '36px',
                      borderRadius: '8px',
                      border: '1px solid #E4E4E4',
                      fontSize: '12px',
                      fontFamily: 'Poppins, sans-serif',
                      outline: 'none',
                      color: (requestProductOrigin || requestProductOriginInput) ? '#212121' : '#D9D9D9'
                    }}
                  />
                  <img
                    src={arrowDownIcon}
                    alt="Arrow"
                    className="absolute right-3 w-3 h-3 transition-transform flex-shrink-0"
                    style={{
                      transform: isRequestProductOriginDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      pointerEvents: 'none'
                    }}
                  />
                </div>
                {isRequestProductOriginDropdownOpen && (
                  <div
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden"
                    style={{
                      maxHeight: '280px',
                      overflowY: 'auto',
                      borderRadius: '8px'
                    }}
                  >
                    <style>
                      {`
                        .request-origin-dropdown::-webkit-scrollbar {
                          width: 2px;
                        }
                        .request-origin-dropdown::-webkit-scrollbar-track {
                          background: transparent;
                        }
                        .request-origin-dropdown::-webkit-scrollbar-thumb {
                          background-color: #E4E4E4;
                          border-radius: 10px;
                        }
                      `}
                    </style>
                    <div className="request-origin-dropdown py-1">
                      <button
                        type="button"
                        onMouseDown={() => {
                          setRequestProductOrigin('');
                          setRequestProductOriginInput('');
                          setIsRequestProductOriginDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        style={{
                          backgroundColor: !requestProductOrigin && !requestProductOriginInput ? '#F0F8FE' : 'transparent',
                          color: !requestProductOrigin && !requestProductOriginInput ? '#64B5F6' : '#6A6A6A',
                          fontSize: '11px'
                        }}
                      >
                        <img
                          src={globyIcon}
                          alt="Globe"
                          className="w-4 h-4"
                          style={{
                            filter: (requestProductOrigin || requestProductOriginInput)
                              ? 'grayscale(100%) brightness(0.7)'
                              : 'none'
                          }}
                        />
                        <span>Africa</span>
                      </button>
                      {africanCountries
                        .filter((country) => {
                          const searchTerm = requestProductOriginInput.toLowerCase().trim();
                          if (!searchTerm) return true;
                          return country.name.toLowerCase().includes(searchTerm);
                        })
                        .map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onMouseDown={() => {
                              setRequestProductOrigin(country.name);
                              setRequestProductOriginInput('');
                              setIsRequestProductOriginDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 transition-colors flex items-center gap-2 relative hover:bg-gray-50"
                            style={{
                              color: requestProductOrigin === country.name ? '#64B5F6' : '#6A6A6A',
                              fontSize: '11px',
                              backgroundColor: requestProductOrigin === country.name ? '#F0F8FE' : 'transparent'
                            }}
                          >
                            <img
                              src={country.flag}
                              alt={country.name}
                              className="object-cover rounded-full"
                              style={{ width: '16px', height: '16px' }}
                            />
                            <span>{country.name}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description Input */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#6A6A6A', display: 'block', marginBottom: '6px' }}>
                Description
              </label>
              <textarea
                value={requestDescription}
                onChange={(e) => setRequestDescription(e.target.value)}
                placeholder="Add an description"
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E4E4E4',
                  fontSize: '11px',
                  fontFamily: 'Poppins, sans-serif',
                  outline: 'none',
                  resize: 'none',
                  color: requestDescription ? '#212121' : '#D9D9D9'
                }}
              />
            </div>

            {/* Location Section */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: '#6A6A6A', display: 'block', marginBottom: '-4px' }}>
                Your location
              </label>
              <div className="relative location-dropdown-container" ref={locationDropdownRef}>
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={formatCityDisplay(location)}
                    readOnly
                    className="text-xs font-medium border-none focus:outline-none cursor-default"
                    style={{ color: '#64B5F6', backgroundColor: 'transparent' }}
                  />
                  <button
                    type="button"
                    onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                    className="px-4 py-3 rounded-lg text-xs font-medium whitespace-nowrap"
                    style={{ backgroundColor: '#F0F8FE', color: '#64B5F6' }}
                  >
                    Change location
                  </button>
                </div>
                {/* Location Dropdown */}
                {isLocationDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full max-w-xs bg-white rounded-lg shadow-lg border border-gray-200" style={{ top: '100%', left: 0 }}>
                    <div className="p-2 max-h-60 overflow-auto">
                      <div className="px-3 py-2 text-xs font-medium text-gray-500">United Kingdom</div>
                      {UK_CITIES_PLAIN.map((city) => (
                        <button
                          key={city}
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                          onClick={() => {
                            setLocation(city);
                            setIsLocationDropdownOpen(false);
                          }}
                        >
                          {formatCityDisplay(city)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price Range Section */}
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', color: '#212121', marginBottom: '10px', fontWeight: '500' }}>
                How much would you like to pay for the product?
              </h3>
              <div className="flex gap-2" style={{ marginBottom: '8px', flexWrap: 'wrap' }}>
                {['Less than 10 GBP', '10 - 50 GBP', '50 - 100 GBP', '100 - 200 GBP'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setRequestPriceRange(range)}
                    style={{
                      width: '110px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: `1px solid ${requestPriceRange === range ? '#64B5F6' : '#E4E4E4'}`,
                      backgroundColor: requestPriceRange === range ? '#F0F8FE' : '#FFF',
                      color: requestPriceRange === range ? '#64B5F6' : '#6A6A6A',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontFamily: 'Poppins, sans-serif',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {formatRequestPriceRangeLabel(range)}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setRequestPriceRange('More than 200 GBP')}
                style={{
                  width: '228px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: `1px solid ${requestPriceRange === 'More than 200 GBP' ? '#64B5F6' : '#E4E4E4'}`,
                  backgroundColor: requestPriceRange === 'More than 200 GBP' ? '#F0F8FE' : '#FFF',
                  color: requestPriceRange === 'More than 200 GBP' ? '#64B5F6' : '#6A6A6A',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  textAlign: 'center'
                }}
              >
                {formatRequestPriceRangeLabel('More than 200 GBP')}
              </button>
            </div>

            {/* Create Request Button */}
            <button
              style={{
                display: 'flex',
                width: '480px',
                height: '40px',
                padding: '10px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                flexShrink: 0,
                borderRadius: '8px',
                backgroundColor: '#F9A825',
                color: '#FFF',
                border: 'none',
                cursor: (isSubmittingRequest || isSubmitting) ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '400',
                margin: '0 auto',
                opacity: (isSubmittingRequest || isSubmitting) ? 0.7 : 1
              }}
              onClick={(e) => {
                e.preventDefault();
                handleRequestSubmit(e as any);
              }}
              disabled={isSubmittingRequest || isSubmitting}
            >
              {(isSubmittingRequest || isSubmitting) ? 'Submitting...' : 'Create the request'}
            </button>
          </div>
        </div>
      ) : null}

      {/* Change Location Bottom Sheet - Mobile Only */}
      {showChangeLocationModal && isMobile && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
          onClick={() => {
            setShowChangeLocationModal(false);
            setChangeLocationQuery('');
            setHoveredLocationSuggestion(null);
          }}
        >
          <div
            style={{
              width: '100%',
              height: '500px',
              backgroundColor: '#FFF',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              fontFamily: 'Poppins, sans-serif',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with background */}
            <div className="flex items-center justify-between" style={{ padding: '16px 20px', backgroundColor: '#FAFAFA', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: 600, color: '#6A6A6A', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                Change location
              </h2>
              <button
                onClick={() => {
                  setShowChangeLocationModal(false);
                  setChangeLocationQuery('');
                  setHoveredLocationSuggestion(null);
                  setIsChangeLocationInputFocused(false);
                }}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#8A8A8A',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0
                }}
              >
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
              {/* Set your location label */}
              <label style={{ fontSize: '12px', color: '#6A6A6A', display: 'block', marginBottom: '8px' }}>
                Set your location
              </label>

              {/* Location Input */}
              <input
                type="text"
                value={changeLocationQuery}
                onChange={(e) => setChangeLocationQuery(e.target.value)}
                onFocus={() => setIsChangeLocationInputFocused(true)}
                onBlur={() => setIsChangeLocationInputFocused(false)}
                placeholder=""
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${isChangeLocationInputFocused ? '#64B5F6' : '#E9E9E9'}`,
                  fontSize: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  outline: 'none',
                  marginBottom: '16px'
                }}
              />

              {/* Location Suggestions List */}
              {changeLocationQuery.trim() && (
                <div style={{ marginBottom: '20px' }}>
                  {locationSuggestions
                    .filter(location =>
                      location.toLowerCase().includes(changeLocationQuery.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((location) => (
                      <button
                        key={location}
                        onClick={(e) => {
                          e.preventDefault();
                          setRequestUserLocation(location);
                          setShowChangeLocationModal(false);
                          setChangeLocationQuery('');
                          setHoveredLocationSuggestion(null);
                          setIsChangeLocationInputFocused(false);
                        }}
                        onMouseEnter={() => setHoveredLocationSuggestion(location)}
                        onMouseLeave={() => setHoveredLocationSuggestion(null)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          marginBottom: '4px',
                          backgroundColor: hoveredLocationSuggestion === location ? '#F0F8FE' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          textAlign: 'left',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        {/* Location Icon - Same as home page */}
                        <img
                          src={locationIcon}
                          alt="Location"
                          style={{
                            width: '14px',
                            height: '14px',
                            flexShrink: 0,
                            filter: 'brightness(0) saturate(100%) invert(73%) sepia(52%) saturate(1685%) hue-rotate(352deg) brightness(103%) contrast(95%)'
                          }}
                        />
                        <span style={{ fontSize: '12px', color: '#212121' }}>
                          {location}
                        </span>
                      </button>
                    ))}
                </div>
              )}

            </div>

            {/* Save the location Button */}
            <div style={{ padding: '20px', paddingTop: '0' }}>
              <button
                onClick={() => {
                  if (changeLocationQuery.trim()) {
                    const matchingLocation = locationSuggestions.find(loc =>
                      loc.toLowerCase().includes(changeLocationQuery.toLowerCase())
                    );
                    if (matchingLocation) {
                      setRequestUserLocation(matchingLocation);
                    }
                  }
                  setShowChangeLocationModal(false);
                  setChangeLocationQuery('');
                  setHoveredLocationSuggestion(null);
                  setIsChangeLocationInputFocused(false);
                }}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#F9A825',
                  color: '#FFF',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '400'
                }}
              >
                Save the location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        isMobile ? (
          // Mobile: Full Page Form
          <div className="fixed inset-0 bg-white z-50 flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {/* Header with Title and X Button */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#171717', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                Your request has been registered
              </h1>
              <button
                onClick={() => setShowConfirmationModal(false)}
                style={{ color: '#171717', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col items-center justify-center">
              {/* Verify Icon */}
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                <img src={verifyIcon} alt="Success" style={{ width: '50px', height: '50px' }} />
              </div>

              {/* Description */}
              <p style={{ fontSize: '10px', color: '#6A6A6A', marginBottom: '24px', lineHeight: '1.6', textAlign: 'center' }}>
                A seller will contact you soon. Continue exploring the platform.
              </p>

              {/* Close Button */}
              <button
                onClick={() => setShowConfirmationModal(false)}
                style={{
                  display: 'flex',
                  width: '100%',
                  height: '36px',
                  padding: '8px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  flexShrink: 0,
                  borderRadius: '8px',
                  backgroundColor: '#F9A825',
                  color: '#FFF',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '400',
                  margin: '0 auto'
                }}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          // Desktop/Tablet: Modal Overlay
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#0000001A',
              zIndex: 9998,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => setShowConfirmationModal(false)}
          >
            {/* Confirmation Modal Content */}
            <div
              style={{
                width: '520px',
                maxWidth: '520px',
                height: 'auto',
                borderRadius: '30px',
                background: '#FFF',
                padding: '32px 40px',
                position: 'relative',
                fontFamily: 'Poppins, sans-serif',
                textAlign: 'center'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Verify Icon */}
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                <img src={verifyIcon} alt="Success" style={{ width: '70px', height: '70px' }} />
              </div>

              {/* Success Message */}
              <h2 style={{ fontSize: '18px', color: '#212121', fontWeight: '500', marginBottom: '10px' }}>
                Your request has been registered
              </h2>

              {/* Description */}
              <p style={{ fontSize: '13px', color: '#6A6A6A', marginBottom: '24px', lineHeight: '1.6' }}>
                A seller will contact you soon. Continue exploring the platform.
              </p>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowConfirmationModal(false);
                  // navigate('/requests');
                }}
                style={{
                  display: 'flex',
                  width: '100%',
                  height: '40px',
                  padding: '10px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  flexShrink: 0,
                  borderRadius: '8px',
                  backgroundColor: '#F9A825',
                  color: '#FFF',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '400',
                  margin: '0 auto'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )
      )}

      {/* Mobile Filter Page */}
      {showMobileFilterPage && isMobile && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#171717', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              Filter
            </h1>
            <button
              onClick={() => {
                setShowMobileFilterPage(false);
                if (filterPageOpenedFrom === 'home' && !showMobileSearchFlow) {
                  setShowMobileSearchFlow(true);
                }
              }}
              style={{ color: '#171717', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Filter Fields */}
          <div className="px-4 space-y-4 pb-24">
            {/* Category Filter */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#6A6A6A', marginBottom: '8px', display: 'block' }}>
                Categories
              </label>
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="w-full px-3 py-2.5 border rounded-lg text-left flex items-center justify-between"
                  style={{
                    border: '1px solid #E9E9E9',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    minHeight: '44px'
                  }}
                >
                  <div className="flex items-center gap-2 flex-wrap flex-1">
                    {mobileFilterCategory ? (
                      <div
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded"
                        style={{
                          backgroundColor: '#F1F1F1',
                          borderRadius: '6px'
                        }}
                      >
                        <span style={{ fontSize: '12px', color: '#6A6A6A' }}>
                          {categories.find(c => c === mobileFilterCategory) || mobileFilterCategory}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMobileFilterCategory('');
                          }}
                          style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M9 3L3 9M3 3l6 6" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: '#D9D9D9', fontSize: '12px' }}>Search a category</span>
                    )}
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D9D9D9"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isCategoryDropdownOpen && (
                  <div
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden"
                    style={{ maxHeight: '200px', overflowY: 'auto' }}
                  >
                    {categories.filter(c => c !== 'All').map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setMobileFilterCategory(category);
                          setIsCategoryDropdownOpen(false);
                          setHoveredCategoryOption(null);
                        }}
                        onMouseEnter={() => setHoveredCategoryOption(category)}
                        onMouseLeave={() => setHoveredCategoryOption(null)}
                        className="w-full text-left px-3 py-2 transition-colors relative"
                        style={{
                          color: '#6A6A6A',
                          fontSize: '12px',
                          backgroundColor: hoveredCategoryOption === category ? '#F0F8FE' : 'transparent'
                        }}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Origin Filter */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#6A6A6A', marginBottom: '8px', display: 'block' }}>
                Product Origin
              </label>
              <div className="relative" ref={productOriginDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProductOriginDropdownOpen(!isProductOriginDropdownOpen)}
                  className="w-full px-3 py-2.5 border rounded-lg text-left flex items-center justify-between"
                  style={{
                    border: '1px solid #E9E9E9',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    minHeight: '44px'
                  }}
                >
                  <div className="flex items-center gap-2 flex-wrap flex-1">
                    {mobileFilterProductOrigin ? (
                      <div
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded"
                        style={{
                          backgroundColor: '#F1F1F1',
                          borderRadius: '6px'
                        }}
                      >
                        <span style={{ fontSize: '12px', color: '#6A6A6A' }}>
                          {mobileFilterProductOrigin}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMobileFilterProductOrigin('');
                          }}
                          style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M9 3L3 9M3 3l6 6" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: '#D9D9D9', fontSize: '12px' }}>Choose product origin</span>
                    )}
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D9D9D9"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isProductOriginDropdownOpen && (
                  <div
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden"
                    style={{ maxHeight: '200px', overflowY: 'auto' }}
                  >
                    {africanCountries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => {
                          setMobileFilterProductOrigin(country.name);
                          setIsProductOriginDropdownOpen(false);
                          setHoveredOriginOption(null);
                        }}
                        onMouseEnter={() => setHoveredOriginOption(country.name)}
                        onMouseLeave={() => setHoveredOriginOption(null)}
                        className="w-full text-left px-3 py-2 transition-colors flex items-center gap-2 relative"
                        style={{
                          color: '#6A6A6A',
                          fontSize: '12px',
                          backgroundColor: hoveredOriginOption === country.name ? '#F0F8FE' : 'transparent'
                        }}
                      >
                        <img src={country.flag} alt={country.name} style={{ width: '16px', height: '12px', borderRadius: '4px' }} />
                        <span>{country.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Seller Location Filter */}
            <div className="relative">
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#6A6A6A', marginBottom: '8px', display: 'block' }}>
                Seller location
              </label>
              <input
                type="text"
                value={mobileFilterSellerLocation}
                onChange={(e) => {
                  setMobileFilterSellerLocation(e.target.value);
                  if (e.target.value.trim()) {
                    setShowSellerLocationSuggestions(true);
                  } else {
                    setShowSellerLocationSuggestions(false);
                  }
                }}
                onFocus={() => {
                  if (mobileFilterSellerLocation.trim()) {
                    setShowSellerLocationSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setShowSellerLocationSuggestions(false);
                  }, 200);
                }}
                placeholder="Choose seller location"
                className="w-full px-3 py-2.5 border rounded-lg"
                style={{
                  border: '1px solid #E9E9E9',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  color: '#212121',
                  fontSize: '12px',
                  fontFamily: 'Poppins, sans-serif'
                }}
              />

              {/* Location Suggestions Dropdown */}
              {showSellerLocationSuggestions && getFilteredLocationSuggestions().length > 0 && (
                <div
                  className="absolute top-full left-0 right-0 mt-1 z-50 bg-white rounded-lg"
                  style={{
                    maxHeight: '180px',
                    overflowY: 'auto',
                    boxShadow: 'none',
                    border: 'none'
                  }}
                >
                  {getFilteredLocationSuggestions().map((city, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setMobileFilterSellerLocation(city);
                        setShowSellerLocationSuggestions(false);
                      }}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                      style={{
                        padding: '8px 12px'
                      }}
                    >
                      <img
                        src={locationIcon}
                        alt="Location"
                        style={{
                          width: '14px',
                          height: '14px',
                          filter: 'brightness(0) saturate(100%) invert(73%) sepia(52%) saturate(1685%) hue-rotate(352deg) brightness(103%) contrast(95%)'
                        }}
                      />
                      <span style={{ color: '#6A6A6A', fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>
                        {formatCityDisplay(city)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Apply Filter Button */}
          <div className="fixed bottom-0 left-0 right-0 px-4 pb-4 bg-white" style={{ borderTop: '1px solid #E9E9E9' }}>
            <button
              onClick={() => {
                if (!showMobileSearchFlow) {
                  setShowMobileSearchFlow(true);
                }
                setShowMobileFilterPage(false);
              }}
              className="w-full py-3 rounded-lg"
              style={{
                backgroundColor: (mobileFilterCategory || mobileFilterProductOrigin || mobileFilterSellerLocation) ? '#F9A825' : '#E9E9E9',
                color: (mobileFilterCategory || mobileFilterProductOrigin || mobileFilterSellerLocation) ? '#FFFFFF' : '#6A6A6A',
                border: 'none',
                fontSize: '14px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                cursor: 'pointer',
                borderRadius: '8px'
              }}
            >
              Apply filter
            </button>
          </div>
        </div>
      )}

      {/* Mobile Search Flow */}
      {showMobileSearchFlow && isMobile && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#171717', fontFamily: 'Bricolage Grotesque, sans-serif', fontStyle: 'bold' }}>
              Search a product
            </h1>
            <button
              onClick={() => {
                setShowMobileSearchFlow(false);
                setMobileSearchQuery('');
                setMobileSearchSubmitted(false);
                setMobileFilterCategory('');
                setMobileFilterProductOrigin('');
                setMobileFilterSellerLocation('');
              }}
              style={{ color: '#171717', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Search Bar and Filter Button */}
          <div className="px-4 pb-3 relative">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <div
                  className="flex items-center w-full px-4 py-3 pr-12"
                  style={{
                    borderRadius: '30px',
                    border: `1px solid ${isMobileSearchFocused ? '#B8DDFB' : '#E9E9E9'}`,
                    backgroundColor: selectedImage ? '#F1F1F1' : '#FFF',
                    fontFamily: 'Poppins, sans-serif',
                    minHeight: '44px'
                  }}
                >
                  {/* Image Thumbnail */}
                  {selectedImageUrl && (
                    <img
                      src={selectedImageUrl}
                      alt="Selected product"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        marginRight: '12px',
                        flexShrink: 0
                      }}
                    />
                  )}
                  <input
                    type="text"
                    placeholder={selectedImage ? "Wanna be more specific ?" : "What are you looking for today ?"}
                    value={mobileSearchQuery}
                    onChange={(e) => {
                      setMobileSearchQuery(e.target.value);
                      if (searchHistory.length > 0) {
                        setShowMobileSearchHistory(true);
                      } else {
                        setShowMobileSearchHistory(false);
                      }
                    }}
                    onFocus={() => {
                      setIsMobileSearchFocused(true);
                      if (searchHistory.length > 0) {
                        setShowMobileSearchHistory(true);
                      }
                    }}
                    onBlur={() => {
                      setIsMobileSearchFocused(false);
                      setTimeout(() => {
                        setShowMobileSearchHistory(false);
                      }, 200);
                    }}
                    className="flex-1 focus:outline-none"
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      fontFamily: 'Poppins, sans-serif',
                      color: '#212121',
                      caretColor: '#888888',
                      fontSize: '11px'
                    }}
                  />
                  <style>
                    {`
                      input[placeholder="What are you looking for today ?"]::placeholder,
                      input[placeholder="Wanna be more specific ?"]::placeholder {
                      font-size: 11px;
                      color: #888888;
                    }
                  `}
                  </style>
                  {mobileSearchQuery && !selectedImage && (
                    <button
                      onClick={() => {
                        setMobileSearchQuery('');
                        setMobileSearchSubmitted(false);
                        setShowMobileSearchHistory(false);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                    >
                      <img src={SDicon} alt="Clear" className="w-4 h-4" />
                    </button>
                  )}
                  {selectedImage ? (
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setSelectedImageUrl(null);
                        setImageFormData(null);
                        if (selectedImageUrl) {
                          URL.revokeObjectURL(selectedImageUrl);
                        }
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                      title="Clear image"
                    >
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: '#8A8A8A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={handleScan}
                      className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                      style={{ display: mobileSearchQuery ? 'none' : 'block' }}
                      title="Scan image to search"
                    >
                      <img
                        src={scanIcon}
                        alt="Scan"
                        className="w-5 h-5"
                        style={{ opacity: 0.6 }}
                      />
                    </button>
                  )}
                </div>

              </div>
              <button
                onClick={() => {
                  setFilterPageOpenedFrom('search');
                  setShowMobileSearchFlow(false);
                  setShowMobileFilterPage(true);
                }}
                className="flex items-center justify-center relative flex-shrink-0"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: '0.5px solid #E9E9E9',
                  backgroundColor: '#FFF'
                }}
                aria-label="Filter"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <line x1="3" y1="6" x2="17" y2="6" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="10" cy="6" r="2" fill="#FFF" stroke="#6A6A6A" strokeWidth="1.5" />
                  <line x1="3" y1="14" x2="17" y2="14" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="10" cy="14" r="2" fill="#FFF" stroke="#6A6A6A" strokeWidth="1.5" />
                </svg>
                {(mobileFilterCategory || mobileFilterProductOrigin || mobileFilterSellerLocation) && (
                  <div
                    className="absolute"
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#FF0000',
                      bottom: '2px',
                      right: '2px'
                    }}
                  />
                )}
              </button>
            </div>

            {/* Search History Dropdown - Only show when no filters applied */}
            {showMobileSearchHistory && searchHistory.length > 0 && !mobileFilterCategory && !mobileFilterProductOrigin && !mobileFilterSellerLocation && (
              <div
                className="mt-1 z-50 bg-white"
                style={{
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2.5">
                  <h3 className="font-medium text-sm" style={{ color: '#212121' }}>
                    Search history
                  </h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="4" cy="10" r="1.5" />
                      <circle cx="10" cy="10" r="1.5" />
                      <circle cx="16" cy="10" r="1.5" />
                    </svg>
                  </button>
                </div>

                {/* Search History Items */}
                <div>
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setMobileSearchQuery(item);
                        setShowMobileSearchHistory(false);
                        setMobileSearchSubmitted(true);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                      style={{
                        backgroundColor: 'transparent'
                      }}
                    >
                      <span className="font-normal text-sm" style={{ color: '#6A6A6A' }}>
                        {item.length > 25 ? item.substring(0, 25) + '...' : item}
                      </span>
                      <svg
                        className="w-3.5 h-3.5 flex-shrink-0 ml-2"
                        fill="none"
                        stroke="#6A6A6A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Active Filters Section */}
          {(mobileFilterCategory || mobileFilterProductOrigin || mobileFilterSellerLocation) && (
            <div className="px-4 pb-3">
              <p style={{ fontSize: '12px', color: '#B0B0B0', marginBottom: '8px' }}>Active filter :</p>
              <div className="flex flex-wrap gap-2">
                {mobileFilterCategory && (
                  <div
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded"
                    style={{
                      backgroundColor: '#F0F8FE',
                      borderRadius: '6px'
                    }}
                  >
                    <span style={{ fontSize: '12px', color: '#64B5F6' }}>
                      {mobileFilterCategory}
                    </span>
                    <button
                      onClick={() => setMobileFilterCategory('')}
                      style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M9 3L3 9M3 3l6 6" stroke="#64B5F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                )}
                {mobileFilterProductOrigin && (
                  <div
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded"
                    style={{
                      backgroundColor: '#F0F8FE',
                      borderRadius: '6px'
                    }}
                  >
                    <span style={{ fontSize: '12px', color: '#64B5F6' }}>
                      {mobileFilterProductOrigin}
                    </span>
                    <button
                      onClick={() => setMobileFilterProductOrigin('')}
                      style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M9 3L3 9M3 3l6 6" stroke="#64B5F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                )}
                {mobileFilterSellerLocation && (
                  <div
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded"
                    style={{
                      backgroundColor: '#F0F8FE',
                      borderRadius: '6px'
                    }}
                  >
                    <span style={{ fontSize: '12px', color: '#64B5F6' }}>
                      {mobileFilterSellerLocation}
                    </span>
                    <button
                      onClick={() => setMobileFilterSellerLocation('')}
                      style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M9 3L3 9M3 3l6 6" stroke="#64B5F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Search History Dropdown - Show below active filters when filters are applied */}
          {showMobileSearchHistory && searchHistory.length > 0 && (mobileFilterCategory || mobileFilterProductOrigin || mobileFilterSellerLocation) && (
            <div className="px-4 pb-3">
              <div
                className="bg-white"
                style={{
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2.5">
                  <h3 className="font-medium text-sm" style={{ color: '#212121' }}>
                    Search history
                  </h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="4" cy="10" r="1.5" />
                      <circle cx="10" cy="10" r="1.5" />
                      <circle cx="16" cy="10" r="1.5" />
                    </svg>
                  </button>
                </div>

                {/* Search History Items */}
                <div>
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setMobileSearchQuery(item);
                        setShowMobileSearchHistory(false);
                        setMobileSearchSubmitted(true);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                      style={{
                        backgroundColor: 'transparent'
                      }}
                    >
                      <span className="font-normal text-sm" style={{ color: '#6A6A6A' }}>
                        {item.length > 25 ? item.substring(0, 25) + '...' : item}
                      </span>
                      <svg
                        className="w-3.5 h-3.5 flex-shrink-0 ml-2"
                        fill="none"
                        stroke="#6A6A6A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Country Filter - Show when seller location is applied, but hide when no results */}
          {mobileFilterSellerLocation && mobileSearchSubmitted && (() => {
            // Check if there are search results
            let products = [];
            if (activeCategory === 'All') {
              products = Object.values(allProductsComputed).flat();
            } else {
              products = allProductsComputed[activeCategory as keyof typeof allProductsComputed] || [];
            }

            if (selectedCountry) {
              products = products.filter(product =>
                getProductCountry(product.origin).name === selectedCountry
              );
            }

            const getProductCategory = (productId: number): string => {
              for (const [category, categoryProducts] of Object.entries(allProductsComputed)) {
                if (categoryProducts.some(p => p.id === productId)) {
                  return category;
                }
              }
              return '';
            };

            const filteredProducts = products.filter(product => {
              const query = mobileSearchQuery.toLowerCase().trim();
              const productCategory = getProductCategory(product.id);
              const matchesSearch = product.name.toLowerCase().includes(query) ||
                productCategory.toLowerCase().includes(query) ||
                product.location.toLowerCase().includes(query);

              const matchesCategory = !mobileFilterCategory || productCategory === mobileFilterCategory;
              const matchesOrigin = !mobileFilterProductOrigin || getProductCountry(product.origin).name === mobileFilterProductOrigin;
              const matchesLocation = !mobileFilterSellerLocation || getCityPlain(product.location || '').toLowerCase().includes(mobileFilterSellerLocation.toLowerCase());

              return matchesSearch && matchesCategory && matchesOrigin && matchesLocation;
            });

            return filteredProducts.length > 0;
          })() && (
              <div className="px-4 pb-3">
                <div ref={mobileCountryPickerRef} className="relative">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {/* More Options Button - opens full country list */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!mobileCountryPickerOpen) {
                          const rect = mobileCountryPickerRef.current?.getBoundingClientRect();
                          if (rect) {
                            setMobileCountryPickerPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
                            setMobileCountryPickerOpen(true);
                          }
                        } else {
                          setMobileCountryPickerOpen(false);
                          setMobileCountryPickerPosition(null);
                        }
                      }}
                      className="flex-shrink-0 flex items-center justify-center"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: '1px solid #E9E9E9',
                        backgroundColor: mobileCountryPickerOpen ? '#F0F8FE' : '#FFF'
                      }}
                      aria-label="More options - filter by country of origin"
                      aria-expanded={mobileCountryPickerOpen}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="3.5" cy="7" r="1.25" fill="#6A6A6A" />
                        <circle cx="7" cy="7" r="1.25" fill="#6A6A6A" />
                        <circle cx="10.5" cy="7" r="1.25" fill="#6A6A6A" />
                      </svg>
                    </button>

                    {/* Africa Button */}
                    <button
                      onClick={() => setSelectedCountry('')}
                      className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md"
                      style={{
                        backgroundColor: !selectedCountry ? '#F0F8FE' : '#FAFAFA',
                        border: !selectedCountry ? '1px solid #CFE8FC' : 'none',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      <img
                        src={globyIcon}
                        alt="Globe"
                        className="w-3.5 h-3.5"
                        style={{
                          filter: selectedCountry ? 'grayscale(100%) brightness(0.7)' : 'none'
                        }}
                      />
                      <span
                        className="text-xs font-normal whitespace-nowrap"
                        style={{
                          color: !selectedCountry ? '#5BA5E0' : '#6A6A6A'
                        }}
                      >
                        Africa
                      </span>
                    </button>

                    {/* Country Buttons */}
                    {africanCountries.slice(0, 10).map((country) => (
                      <button
                        key={country.name}
                        onClick={() => setSelectedCountry(country.name)}
                        className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md"
                        style={{
                          backgroundColor: '#FAFAFA',
                          border: 'none',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        <img
                          src={country.flag}
                          alt={`${country.name} flag`}
                          className="w-3.5 h-3.5 object-cover rounded-full"
                        />
                        <span
                          className="text-xs font-normal whitespace-nowrap"
                          style={{
                            color: '#6A6A6A'
                          }}
                        >
                          {country.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          {/* Category and Country Filters - Show when no filters applied and search is submitted, but hide when no results */}
          {!mobileFilterCategory && !mobileFilterProductOrigin && !mobileFilterSellerLocation && mobileSearchSubmitted && (() => {
            // Check if there are search results
            let products = [];
            if (activeCategory === 'All') {
              products = Object.values(allProductsComputed).flat();
            } else {
              products = allProductsComputed[activeCategory as keyof typeof allProductsComputed] || [];
            }

            if (selectedCountry) {
              products = products.filter(product =>
                getProductCountry(product.origin).name === selectedCountry
              );
            }

            const getProductCategory = (productId: number): string => {
              for (const [category, categoryProducts] of Object.entries(allProductsComputed)) {
                if (categoryProducts.some(p => p.id === productId)) {
                  return category;
                }
              }
              return '';
            };

            const filteredProducts = products.filter(product => {
              const query = mobileSearchQuery.toLowerCase().trim();
              const productCategory = getProductCategory(product.id);
              const matchesSearch = product.name.toLowerCase().includes(query) ||
                productCategory.toLowerCase().includes(query) ||
                product.location.toLowerCase().includes(query);

              const matchesCategory = !mobileFilterCategory || productCategory === mobileFilterCategory;
              const matchesOrigin = !mobileFilterProductOrigin || getProductCountry(product.origin).name === mobileFilterProductOrigin;
              const matchesLocation = !mobileFilterSellerLocation || getCityPlain(product.location || '').toLowerCase().includes(mobileFilterSellerLocation.toLowerCase());

              return matchesSearch && matchesCategory && matchesOrigin && matchesLocation;
            });

            return filteredProducts.length > 0;
          })() && (
              <div className="px-4 pb-3 space-y-3">
                {/* Category Filter - Match Home Page */}
                <div className="flex justify-start space-x-2 overflow-x-auto scrollbar-hide relative">
                  <style>{`
                  .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                  }
                  .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                  }
                `}</style>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`whitespace-nowrap pb-2 px-0.5 transition-colors flex-shrink-0 relative`}
                      style={{
                        fontSize: '13px',
                        fontWeight: '300',
                        fontFamily: 'Poppins, sans-serif',
                        color: activeCategory === category ? '#64B5F6' : '#BABABA'
                      }}
                    >
                      {category}
                      {activeCategory === category && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#64B5F6' }}></div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Country Filter - Match Home Page Mobile Horizontal Scroll */}
                <div ref={mobileCountryPickerRef} className="relative">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {/* More Options Button - opens full country list */}
                    {/* <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!mobileCountryPickerOpen) {
                          const rect = mobileCountryPickerRef.current?.getBoundingClientRect();
                          if (rect) {
                            setMobileCountryPickerPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
                            setMobileCountryPickerOpen(true);
                          }
                        } else {
                          setMobileCountryPickerOpen(false);
                          setMobileCountryPickerPosition(null);
                        }
                      }}
                      className="flex-shrink-0 flex items-center justify-center"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: '1px solid #E9E9E9',
                        backgroundColor: mobileCountryPickerOpen ? '#F0F8FE' : '#FFF'
                      }}
                      aria-label="More options - filter by country of origin"
                      aria-expanded={mobileCountryPickerOpen}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="3.5" cy="7" r="1.25" fill="#6A6A6A" />
                        <circle cx="7" cy="7" r="1.25" fill="#6A6A6A" />
                        <circle cx="10.5" cy="7" r="1.25" fill="#6A6A6A" />
                      </svg>
                    </button> */}

                    {/* Africa Button */}
                    <button
                      onClick={() => setSelectedCountry('')}
                      className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md"
                      style={{
                        backgroundColor: !selectedCountry ? '#F0F8FE' : '#FAFAFA',
                        border: !selectedCountry ? '1px solid #CFE8FC' : 'none',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      <img
                        src={globyIcon}
                        alt="Globe"
                        className="w-3.5 h-3.5"
                        style={{
                          filter: selectedCountry ? 'grayscale(100%) brightness(0.7)' : 'none'
                        }}
                      />
                      <span
                        className="text-xs font-normal whitespace-nowrap"
                        style={{
                          color: !selectedCountry ? '#5BA5E0' : '#6A6A6A'
                        }}
                      >
                        Africa
                      </span>
                    </button>

                    {/* Country Buttons */}
                    {africanCountries.map((country) => (
                      <button
                        key={country.name}
                        onClick={() => setSelectedCountry(country.name)}
                        className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md"
                        style={{
                          backgroundColor: '#FAFAFA',
                          border: 'none',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        <img
                          src={country.flag}
                          alt={`${country.name} flag`}
                          className="w-3.5 h-3.5 object-cover rounded-full"
                        />
                        <span
                          className="text-xs font-normal whitespace-nowrap"
                          style={{
                            color: '#6A6A6A'
                          }}
                        >
                          {country.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          {/* Search Results or Empty State */}
          <div className="flex-1 overflow-y-auto px-4 pb-24">
            {mobileSearchSubmitted && (mobileSearchQuery.trim() !== '' || selectedImage) && (
              <>
                {(() => {
                  // Get all products
                  let products = [];
                  if (activeCategory === 'All') {
                    products = Object.values(allProductsComputed).flat();
                  } else {
                    products = allProductsComputed[activeCategory as keyof typeof allProductsComputed] || [];
                  }

                  // Apply country filter if selected
                  if (selectedCountry) {
                    products = products.filter(product =>
                      getProductCountry(product.origin).name === selectedCountry
                    );
                  }

                  // Helper function to get product category
                  const getProductCategory = (productId: number): string => {
                    for (const [category, categoryProducts] of Object.entries(allProductsComputed)) {
                      if (categoryProducts.some(p => p.id === productId)) {
                        return category;
                      }
                    }
                    return '';
                  };

                  // Filter by search query and mobile filters
                  const filteredProducts = products.filter(product => {
                    const query = mobileSearchQuery.toLowerCase().trim();
                    const productCategory = getProductCategory(product.id);

                    let matchesSearch = false;
                    if (selectedImage) {
                      // When API returns empty results, filteredProducts will be empty and no results state will show
                      if (mobileFilterCategory || mobileFilterProductOrigin || mobileFilterSellerLocation) {
                        // If filters are applied, show products matching those filters
                        matchesSearch = true;
                      } else {
                        matchesSearch = false; // Simulate no results for image search
                      }
                    } else {
                      // Text search
                      matchesSearch = product.name.toLowerCase().includes(query) ||
                        productCategory.toLowerCase().includes(query) ||
                        product.location.toLowerCase().includes(query);
                    }

                    const matchesCategory = !mobileFilterCategory || productCategory === mobileFilterCategory;
                    const matchesOrigin = !mobileFilterProductOrigin || getProductCountry(product.origin).name === mobileFilterProductOrigin;
                    const matchesLocation = !mobileFilterSellerLocation || getCityPlain(product.location || '').toLowerCase().includes(mobileFilterSellerLocation.toLowerCase());

                    return matchesSearch && matchesCategory && matchesOrigin && matchesLocation;
                  });

                  if (filteredProducts.length === 0) {
                    return (
                      <>
                        <div className="text-center" style={{ padding: '32px 16px' }}>
                          <img
                            src={bagIcon}
                            alt="No products found"
                            className="mx-auto"
                            style={{
                              width: '40px',
                              height: '40px',
                              marginBottom: '12px'
                            }}
                          />
                          <p style={{
                            fontSize: '12px',
                            color: '#6A6A6A',
                            fontFamily: 'Poppins, sans-serif',
                            maxWidth: '280px',
                            margin: '0 auto 12px',
                            lineHeight: '1.5'
                          }}>
                            {selectedImage
                              ? "We couldn't find similar products. Don't worry, just ask for it and we will bring it for you."
                              : "Can't find what you're looking for? don't worry, just ask for it and we will bring it for you."
                            }
                          </p>
                          <button
                            type="button"
                            onClick={handleMakeRequestClick}
                            className="inline-flex items-center mx-auto"
                            style={{
                              display: 'flex',
                              padding: '8px 16px',
                              alignItems: 'center',
                              gap: '4px',
                              borderRadius: '8px',
                              backgroundColor: '#F0F8FE',
                              color: '#64B5F6',
                              border: 'none',
                              cursor: 'pointer',
                              fontFamily: 'Poppins, sans-serif',
                              fontSize: '11px',
                              fontWeight: '500'
                            }}
                          >
                            <img src={draftsIcon} alt="Request" style={{ width: '14px', height: '14px' }} />
                            <span>Post a request</span>
                          </button>
                        </div>

                        {/* Other Products Near You Section */}
                        <div style={{ marginTop: '32px' }}>
                          <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                            <h3 className="font-semibold text-gray-900" style={{
                              fontFamily: 'Faktum, sans-serif',
                              fontSize: '14px'
                            }}>
                              Other products near you
                            </h3>
                            <button className="font-medium hover:underline" style={{
                              color: '#64B5F6',
                              fontFamily: 'Poppins, sans-serif',
                              fontSize: '10px'
                            }}>
                              View more...
                            </button>
                          </div>

                          {/* Product Cards */}
                          <div className="grid grid-cols-2 gap-3">
                            {Object.values(allProductsComputed).flat().slice(0, 6).map((product) => (
                              <div
                                key={product.id}
                                onClick={(e) => {
                                  handleProductClick(e, product.id);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="bg-white rounded-lg overflow-hidden transition-all duration-200 block group cursor-pointer"
                              >
                                {/* Product Image - Top */}
                                <div className="aspect-square relative overflow-hidden mb-1" style={{ borderRadius: '10px' }}>
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    style={{ borderRadius: '10px' }}
                                    loading="lazy"
                                    width="200"
                                    height="200"
                                  />

                                  {/* Country Badge */}
                                  <div className="absolute bg-white rounded-md shadow-sm" style={{
                                    display: 'flex',
                                    padding: '1px 4px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '2px',
                                    top: '6px',
                                    left: '6px'
                                  }}>
                                    <img
                                      src={`https://flagcdn.com/w20/${getProductCountry(product.origin).code}.png`}
                                      alt={getProductCountry(product.origin).name}
                                      className="rounded-full"
                                      style={{
                                        width: '10px',
                                        height: '10px',
                                        objectFit: 'cover'
                                      }}
                                    />
                                    <span className="font-medium text-gray-800" style={{ fontSize: '8px' }}>
                                      {getProductCountry(product.origin).abbreviation}
                                    </span>
                                  </div>
                                </div>

                                {/* Product Content */}
                                <div className="flex flex-col" style={{ padding: '0 6px 6px 6px' }}>
                                  {/* Price and Verified Badge Row */}
                                  <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                                    <div className="font-bold text-gray-900" style={{ fontSize: '12px' }}>
                                      {formatPriceDisplay(product.currency, product.price)}
                                    </div>
                                    {/* {product.verified ? (
                                      <div className="flex items-center text-green-600 bg-green-50 rounded" style={{
                                        display: 'flex',
                                        padding: '1px 3px',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '1px',
                                        fontSize: '7px'
                                      }}>
                                        <img src={verifyIcon} alt="Verified" style={{ width: '6px', height: '6px' }} />
                                        <span>Verified seller</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center text-gray-600 bg-gray-100 rounded" style={{
                                        display: 'flex',
                                        padding: '1px 3px',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '1px',
                                        fontSize: '7px'
                                      }}>
                                        <img src={unverifyIcon} alt="Unverified" style={{ width: '6px', height: '6px' }} />
                                        <span>Unverified Seller</span>
                                      </div>
                                    )} */}
                                  </div>

                                  {/* Product Name */}
                                  <h3 className="line-clamp-2 font-medium" style={{
                                    fontSize: '10px',
                                    color: '#212121',
                                    marginBottom: '4px'
                                  }}>
                                    {product.name}
                                  </h3>

                                  {/* Location and Bookmark Row */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-500 flex-1 min-w-0">
                                      <img src={locationIcon} alt="Location" className="flex-shrink-0" style={{
                                        width: '8px',
                                        height: '8px',
                                        marginRight: '3px'
                                      }} />
                                      <span className="truncate font-normal" style={{ fontSize: '8px' }}>{formatCityDisplay(product.location)}</span>
                                    </div>
                                    {/* Bookmark Button */}
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleSave(product.id);
                                      }}
                                      className="flex-shrink-0 transition-colors touch-manipulation"
                                      style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '2px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                    >
                                      <BookmarkIcon saved={savedProducts.has(product.id)} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  }

                  return (
                    <>
                      <div className="pb-3">
                        <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '16px', color: '#212121', fontWeight: 500 }}>
                          {selectedImage
                            ? <>Search results for similar products <span style={{ fontWeight: 400 }}>({filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'})</span></>
                            : <>Search results for "{mobileSearchQuery}" <span style={{ fontWeight: 400 }}>({filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'})</span></>
                          }
                        </h2>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {filteredProducts.map((product) => (
                          <Link
                            key={product.id}
                            to={`/product/${productUrlSlug({ slug: (product as any).slug, title: product.name, id: String(product.id) })}`}
                            onClick={() => window.scrollTo(0, 0)}
                            className="bg-white rounded-lg overflow-hidden transition-all duration-200 block"
                          >
                            {/* Product Image - Top */}
                            <div className="aspect-square relative overflow-hidden mb-1" style={{ borderRadius: '10px' }}>
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                style={{ borderRadius: '10px' }}
                                loading="lazy"
                              />

                              {/* Country Badge */}
                              <div className="absolute bg-white rounded-md shadow-sm" style={{
                                display: 'flex',
                                padding: '1px 4px',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '2px',
                                top: '6px',
                                left: '6px'
                              }}>
                                <img
                                  src={getProductCountry(product.origin).flag}
                                  alt={getProductCountry(product.origin).name}
                                  className="rounded-full"
                                  style={{
                                    width: '10px',
                                    height: '10px',
                                    objectFit: 'cover'
                                  }}
                                />
                                <span className="font-medium text-gray-800" style={{ fontSize: '8px' }}>
                                  {getProductCountry(product.origin).abbreviation}
                                </span>
                              </div>
                            </div>

                            {/* Product Content */}
                            <div className="flex flex-col" style={{ padding: '0 6px 6px 6px' }}>
                              {/* Price and Verified Badge Row */}
                              <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                                <div className="font-bold text-gray-900" style={{ fontSize: '12px' }}>
                                  {formatPriceDisplay(product.currency, product.price)}
                                </div>
                                {/* {product.verified ? (
                                  <div className="flex items-center text-green-600 bg-green-50 rounded" style={{
                                    display: 'flex',
                                    padding: '1px 3px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '1px',
                                    fontSize: '7px'
                                  }}>
                                    <img src={verifyIcon} alt="Verified" style={{ width: '6px', height: '6px' }} />
                                    <span>Verified seller</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center text-gray-600 bg-gray-100 rounded" style={{
                                    display: 'flex',
                                    padding: '1px 3px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '1px',
                                    fontSize: '7px'
                                  }}>
                                    <img src={unverifyIcon} alt="Unverified" style={{ width: '6px', height: '6px' }} />
                                    <span>Unverified Seller</span>
                                  </div>
                                )} */}
                              </div>

                              {/* Product Name */}
                              <h3 className="line-clamp-2 font-medium" style={{
                                fontSize: '10px',
                                color: '#212121',
                                marginBottom: '4px'
                              }}>{product.name}</h3>

                              {/* Location and Bookmark Row - Below Product Name */}
                              <div className="flex items-center justify-between gap-2">
                                {/* Location */}
                                <div className="flex items-center text-gray-500 flex-1 min-w-0">
                                  <img src={locationIcon} alt="Location" className="flex-shrink-0" style={{
                                    width: '8px',
                                    height: '8px',
                                    marginRight: '3px'
                                  }} />
                                  <span className="truncate font-normal" style={{ fontSize: '8px' }}>{formatCityDisplay(product.location)}</span>
                                </div>

                                {/* Bookmark Button */}
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSave(product.id);
                                  }}
                                  className="transition-colors touch-manipulation flex-shrink-0"
                                  title={savedProducts.has(product.id) ? 'Remove from saved' : 'Save product'}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '2px'
                                  }}
                                >
                                  <BookmarkIcon saved={savedProducts.has(product.id)} />
                                </button>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </div>

          {/* Bottom Search Button */}
          {(!mobileSearchSubmitted || (mobileSearchSubmitted && mobileSearchQuery.trim() === '' && !selectedImage)) && (
            <div className="fixed bottom-0 left-0 right-0 px-4 pb-4 bg-white" style={{ borderTop: '1px solid #E9E9E9' }}>
              <button
                type="button"
                className="w-full py-3 rounded-xl"
                style={{
                  backgroundColor: (mobileSearchQuery.trim() || selectedImage) ? '#F9A825' : '#D9D9D9',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '14px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (mobileSearchQuery.trim() || selectedImage) {
                    setMobileSearchSubmitted(true);
                    // Trigger search with image if available
                    if (selectedImage) {
                      handleSearch();
                    }
                  }
                }}
              >
                Search
              </button>
            </div>
          )}

          {/* Cookies Modal */}
          {showCookiesModal && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#0000001A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '20px',
                  maxWidth: '800px',
                  width: '90%',
                  position: 'relative'
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}
                >
                  <h2
                    style={{
                      color: '#212121',
                      fontSize: '16px',
                      fontWeight: 600,
                      margin: 0,
                      flex: 1
                    }}
                  >
                    Accept the use of cookies
                  </h2>
                  <button
                    onClick={async () => {
                      setShowCookiesModal(false);
                      localStorage.setItem('cookiesModalSeen', 'true');
                      // If user closes without choosing, default to 'essential' cookies
                      const currentPreference = localStorage.getItem('cookiesAccepted');
                      if (!currentPreference) {
                        await updateCookiePreferences('essential');
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#212121',
                      fontSize: '20px',
                      cursor: 'pointer',
                      padding: 0,
                      marginLeft: '16px',
                      lineHeight: 1,
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Content */}
                <div style={{ marginBottom: '16px' }}>
                  <p
                    style={{
                      color: '#9C9C9C',
                      fontSize: '12px',
                      lineHeight: '1.5',
                      margin: 0,
                      marginBottom: '12px'
                    }}
                  >
                    We use cookies to improve your browsing experience, serve personalized content and analyze our trafic.<br />
                    By clicking " Accept all cookies" you agree to the storing of cookies on your device.
                  </p>
                  <p
                    style={{
                      color: '#9C9C9C',
                      fontSize: '12px',
                      lineHeight: '1.5',
                      margin: 0
                    }}
                  >
                    You can customize your setting by clicking " Manage Preferences ". For more details see our{' '}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/cookies-policy');
                      }}
                      style={{
                        color: '#64B5F6',
                        textDecoration: 'underline'
                      }}
                    >
                      Cookies Policy
                    </a>
                  </p>
                </div>

                {/* Footer */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  {/* Left side - Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center'
                    }}
                  >
                    <button
                      onClick={async () => {
                        setShowCookiesModal(false);
                        localStorage.setItem('cookiesModalSeen', 'true');
                        await updateCookiePreferences('all');
                      }}
                      style={{
                        backgroundColor: '#F9A825',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontFamily: 'Poppins, sans-serif',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Accept all cookies
                    </button>
                    <button
                      onClick={() => {
                        setShowCookiesModal(false);
                        localStorage.setItem('cookiesModalSeen', 'true');
                        // TODO: Navigate to manage preferences page
                      }}
                      style={{
                        backgroundColor: '#F0F8FE',
                        color: '#64B5F6',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontFamily: 'Poppins, sans-serif',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Manage preferences
                    </button>
                  </div>

                  {/* Right side - Decline text */}
                  <button
                    onClick={async () => {
                      setShowCookiesModal(false);
                      localStorage.setItem('cookiesModalSeen', 'true');
                      await updateCookiePreferences('none');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6A6A6A',
                      fontSize: '12px',
                      cursor: 'pointer',
                      padding: 0,
                      fontFamily: 'Poppins, sans-serif',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Decline all cookies
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile country picker dropdown - rendered in portal so it's always visible on top */}
      {mobileCountryPickerOpen && mobileCountryPickerPosition && createPortal(
        <>
          <style>{`
            .country-picker-modal::-webkit-scrollbar { display: none; }
            .country-picker-modal { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
          {/* Backdrop - clicking outside closes the modal */}
          <div
            role="presentation"
            aria-hidden
            style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
            onClick={() => { setMobileCountryPickerOpen(false); setMobileCountryPickerPosition(null); }}
            onTouchEnd={() => { setMobileCountryPickerOpen(false); setMobileCountryPickerPosition(null); }}
          />
          <div
            ref={mobileCountryPickerPortalRef}
            className="country-picker-modal bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
            style={{
              position: 'fixed',
              top: mobileCountryPickerPosition.top,
              left: mobileCountryPickerPosition.left,
              width: mobileCountryPickerPosition.width,
              maxHeight: '240px',
              overflowY: 'auto',
              zIndex: 9999
            }}
          >
            {africanCountries.map((country) => (
              <button
                key={country.name}
                type="button"
                onClick={() => {
                  setSelectedCountry(country.name);
                  setMobileCountryPickerOpen(false);
                  setMobileCountryPickerPosition(null);
                }}
                className="w-full text-left px-3 py-2.5 flex items-center gap-2 transition-colors"
                style={{
                  color: '#6A6A6A',
                  fontSize: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  backgroundColor: selectedCountry === country.name ? '#F0F8FE' : '#FFF',
                  borderBottom: '1px solid #F5F5F5'
                }}
              >
                <img
                  src={country.flag}
                  alt=""
                  className="w-4 h-3 object-cover rounded"
                />
                <span>{country.name}</span>
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default Home;
