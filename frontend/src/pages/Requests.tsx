import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

import arrowLeftIcon from '../assets/images/pre/arrow-left.svg';
import earthIcon from '../assets/images/pre/earth.svg';
import arrowDownIcon from '../assets/images/pre/arrow-down.svg';
import buyerIcon from '../assets/images/pre/buyer.svg';
import locationIcon from '../assets/images/pre/PL.svg';
import moneyIcon from '../assets/images/pre/money.svg';
import bellIcon from '../assets/images/pre/bm.svg';
import bagIcon from '../assets/images/pre/bag.svg';
import closeIcon from '../assets/images/pre/CLose.svg';
import basketIcon from '../assets/images/pre/basket.png';
import globyIcon from '../assets/images/pre/globy.svg';
import emptyRequestIcon from '../assets/images/pre/emptysearch.svg';
import requestArrowIcon from '../assets/images/pre/requestarrow.svg';
import grayArrowIcon from '../assets/images/pre/gray.svg';
import blackArrowIcon from '../assets/images/pre/black.svg';
import searchNormalIcon from '../assets/images/pre/search-normal.svg';
import backArrowIcon from '../assets/images/pre/back arrow.svg';
import SDicon from '../assets/images/pre/SDicon.svg';
import requestIcon from '../assets/images/pre/request.svg';
import shareIcon from '../assets/images/pre/Share.svg';

// Import social media icons for share modal
import fbIcon from '../assets/images/pre/FB1.svg';
import igIcon from '../assets/images/pre/IG1.svg';
import xIcon from '../assets/images/pre/x.svg';
import tgIcon from '../assets/images/pre/tg.svg';
import zapIcon from '../assets/images/pre/zap1.svg';

import { apiClient } from '../services';
import { getProductCountry, countries as africanCountriesList } from '../utils/countryHelpers';
import { getCurrencyDisplaySymbol } from '../utils/currency';
import { UK_CITIES_PLAIN, formatCityDisplay, getCityPlain } from '../utils/ukCities';
import { format } from 'date-fns';

interface ProductRequest {
  id: string;
  productName: string;
  description: string;
  origin: string;
  sellerLocation: string;
  minPrice: number | null;
  maxPrice: number | null;
  currency: string;
  status: 'PENDING' | 'FULFILLED' | 'CANCELLED' | string;
  createdAt: string;
  userId: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    rating?: number;
  };
}

const Requests: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ProductRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ProductRequest[]>([]);
  const [nearYouRequests, setNearYouRequests] = useState<ProductRequest[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
  const [goToPage, setGoToPage] = useState<number>(1);
  const [isManagingRequest, setIsManagingRequest] = useState(false);
  const [moreOptionsOpenFor, setMoreOptionsOpenFor] = useState<string | null>(null);
  const moreOptionsRef = useRef<HTMLDivElement>(null);
  const [selectedCard, setSelectedCard] = useState<ProductRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [openFilterDropdown, setOpenFilterDropdown] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const [openPriceDropdown, setOpenPriceDropdown] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState('');
  const priceDropdownRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [mobileSearchSubmitted, setMobileSearchSubmitted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentRequestForShare, setCurrentRequestForShare] = useState<ProductRequest | null>(null);

  // UK cities for buyer location filter (plain city names – store plain, display with formatCityDisplay)
  const locationSuggestions = UK_CITIES_PLAIN;

  const priceOptions = [
    { label: 'All', value: '' },
    { label: 'Less than 10', value: 'less-than-10' },
    { label: '10 ~ 50', value: '10-50' },
    { label: '50 ~ 100', value: '50-100' },
    { label: '100 ~ 200', value: '100-200' },
    { label: 'More than 200', value: 'more-than-200' }
  ];

  // Use all African countries from countryHelpers
  const africanCountries = africanCountriesList.map(country => ({
    name: country.name,
    code: country.code,
    flag: country.flag
  }));

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // fetch requests
  useEffect(() => {
    fetchMyRequests();
  }, []);

  useEffect(() => {
    setFilteredRequests(paginate(requests, currentPage, 9));
    setTotalPages(Math.max(1, Math.ceil(requests.length / 9)));
    // Filter by backend status 'PENDING' (uppercase)
    setPendingRequests(
      requests.filter((r) => r.status && (r.status.toUpperCase() === 'PENDING' || r.status.toLowerCase() === 'pending'))
    );
    if (user && user.location) {
      setNearYouRequests(
        requests.filter(
          (r) =>
            user && user.location && r.sellerLocation &&
            r.sellerLocation.toLowerCase().includes(user.location.toLowerCase())
        )
      );
    } else {
      setNearYouRequests([]);
    }
  }, [requests, currentPage, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check for more options dropdown
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(target)) {
        setMoreOptionsOpenFor(null);
      }

      // Check for country filter dropdowns (all instances)
      const countryDropdowns = document.querySelectorAll('[data-country-dropdown]');
      let isInsideCountryDropdown = false;
      countryDropdowns.forEach(dropdown => {
        if (dropdown.contains(target)) {
          isInsideCountryDropdown = true;
        }
      });
      if (!isInsideCountryDropdown && openFilterDropdown) {
        setOpenFilterDropdown(null);
      }

      // Check for price filter dropdowns (all instances)
      const priceDropdowns = document.querySelectorAll('[data-price-dropdown]');
      let isInsidePriceDropdown = false;
      priceDropdowns.forEach(dropdown => {
        if (dropdown.contains(target)) {
          isInsidePriceDropdown = true;
        }
      });
      if (!isInsidePriceDropdown && openPriceDropdown) {
        setOpenPriceDropdown(null);
      }

      // Check for search suggestions dropdown
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(target)) {
        setShowSearchSuggestions(false);
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openFilterDropdown, openPriceDropdown]);

  // Filter location suggestions based on search query (return plain city names)
  const getFilteredSuggestions = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return locationSuggestions.filter((loc) =>
      loc.toLowerCase().startsWith(query) ||
      loc.toLowerCase().includes(query) ||
      formatCityDisplay(loc).toLowerCase().includes(query)
    ).slice(0, 6);
  };

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearchActive(true);
      setShowSearchSuggestions(false);
      setIsSearchFocused(false);
    }
  };

  // Handle search input change (store plain city name)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(getCityPlain(value));
    if (value.trim()) {
      setShowSearchSuggestions(true);
    } else {
      setShowSearchSuggestions(false);
      setIsSearchActive(false);
    }
  };

  const handleShareClick = (e: React.MouseEvent, request: ProductRequest) => {
    e.stopPropagation();
    setCurrentRequestForShare(request);
    setShowShareModal(true);
  };

  function paginate(array: ProductRequest[], page: number, pageSize: number) {
    const start = (page - 1) * pageSize;
    return array.slice(start, start + pageSize);
  }

  const handleManageRequest = async (request: ProductRequest) => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }

      if (user && request.userId === user.id) {
        navigate('/my-requests');
        return;
      }

      setIsManagingRequest(true);
      const token = localStorage.getItem('accessToken');

      // Create product data from request
      const productData = {
        id: request.id,
        name: request.productName,
        description: request.description,
        origin: request.origin,
        sellerLocation: request.sellerLocation,
        price: request.minPrice || 0,
        currency: request.currency || 'GBP',
        isRequest: true,
        requestData: {
          minPrice: request.minPrice,
          maxPrice: request.maxPrice,
          status: request.status
        },
        seller: request.user ? {
          id: request.user.id,
          email: request.user.email,
          name: `${request.user.firstName} ${request.user.lastName}`.trim(),
          profileImage: request.user.profileImage
        } : null
      };

      // Start a conversation with the request creator using the contact-request endpoint
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/chat/contact-request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            requestId: request.id,
            message: `Hi, I have this product you requested for: ${request.productName}`,
            productData: productData
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to start conversation');
      }

      // Navigate to messages with the new conversation
      navigate('/messages', {
        state: {
          conversationId: result.data.conversation.id,
          productData: productData,
          preFilledMessage: `Hi, I have this product you requested for: ${request.productName}`,
          isProductInquiry: true,
          shouldOpenConversation: true
        },
        replace: false
      });

    } catch (error: any) {
      console.error('Error managing request:', error);
      // Show error toast or alert
      alert(error.message || 'Failed to manage request. Please try again.');
    } finally {
      setIsManagingRequest(false);
    }
  };

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<any>('/requests');
      // Handle response: apiClient returns { success: true, data: [...] } or { success: true, data: { data: [...], pagination: {...} } }
      if (response.success && response.data) {
        if (Array.isArray(response.data)) {
          setRequests(response.data);
        } else if (Array.isArray(response.data.data)) {
          // Handle paginated response
          setRequests(response.data.data);
          if (response.data.pagination) {
            setTotalPages(response.data.pagination.totalPages || 1);
          }
        } else {
          setRequests([]);
        }
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setRequestToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!requestToDelete) return;

    try {
      await apiClient.delete(`/requests/${requestToDelete}`);
      setRequests(requests.filter(req => req.id !== requestToDelete));
      setShowDeleteModal(false);
      setRequestToDelete(null);
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => {
    if (!showDeleteModal) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Delete Request</h3>
          <p className="mb-6">Are you sure you want to delete this request? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setRequestToDelete(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                confirmDelete();
                setShowDeleteModal(false);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Get all cards for filtering - transforms backend requests to card format
  const getAllCards = () => {
    return requests.map(req => {
      const country = getProductCountry(req.origin);
      return {
        title: req.productName,
        country: country.name,
        flag: country.flag,
        location: req.sellerLocation || 'Location not specified',
        description: req.description || '',
        price: req.minPrice || 0,
        request: req // Keep reference to original request
      };
    });
  };

  // Get filtered cards based on search, country, and price filters
  const getFilteredCards = () => {
    let filtered = getAllCards();

    // Apply search filter (compare location as plain city)
    if (isSearchActive && searchQuery.trim()) {
      const query = getCityPlain(searchQuery).toLowerCase().trim();
      const searchLower = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(card =>
        getCityPlain(card.location || '').toLowerCase().includes(query) ||
        card.title.toLowerCase().includes(searchLower) ||
        card.country.toLowerCase().includes(searchLower) ||
        (card.description && card.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply country filter
    if (selectedCountry) {
      filtered = filtered.filter(card => card.country === selectedCountry);
    }

    // Apply price filter
    if (selectedPrice) {
      filtered = filtered.filter(card => {
        const price = card.price || 0;
        switch (selectedPrice) {
          case 'less-than-10': return price < 10;
          case '10-50': return price >= 10 && price <= 50;
          case '50-100': return price >= 50 && price <= 100;
          case '100-200': return price >= 100 && price <= 200;
          case 'more-than-200': return price > 200;
          default: return true;
        }
      });
    }

    return filtered;
  };

  // Get total filtered count
  const getFilteredCount = () => {
    return getFilteredCards().length;
  };

  // Render price filter button with dropdown
  const renderPriceFilterButton = (position: 'relative' | 'absolute' = 'relative', sectionId: string = 'default') => {
    const isOpen = openPriceDropdown === sectionId;
    const selectedPriceOption = priceOptions.find(opt => opt.value === selectedPrice);

    return (
      <div
        ref={sectionId === 'default' ? priceDropdownRef : null}
        data-price-dropdown
        style={{ position, zIndex: 20 }}
      >
        {selectedPrice ? (
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
              {selectedPriceOption?.label || selectedPrice}
            </span>
            <button
              onClick={() => setSelectedPrice('')}
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
              borderColor: '#E4E4E4',
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
        {isOpen && !selectedPrice && (
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
                    setSelectedPrice(option.value);
                    setOpenPriceDropdown(null);
                  }}
                  style={{
                    color: selectedPrice === option.value ? '#64B5F6' : '#B0B0B0',
                    fontSize: isMobile ? '10px' : '12px',
                    padding: isMobile ? '6px 10px' : '8px 12px'
                  }}
                  className="w-full text-left hover:bg-gray-50 transition-colors relative"
                >
                  {selectedPrice === option.value && (
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
    const selectedCountryData = selectedCountry ? africanCountries.find(c => c.name === selectedCountry) : null;
    const isOpen = openFilterDropdown === sectionId;

    return (
      <div
        ref={sectionId === 'default' ? filterDropdownRef : null}
        data-country-dropdown
        style={{ position, zIndex: 20 }}
      >
        {selectedCountry ? (
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
              {selectedCountry}
            </span>
            <button
              onClick={() => setSelectedCountry('')}
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
              borderColor: '#E4E4E4',
              padding: isMobile ? '5px 7px' : '7px 10px',
              borderRadius: '8px',
              fontFamily: 'Poppins, sans-serif',
              gap: isMobile ? '4px' : '6px'
            }}
          >
            {!isMobile && <span style={{ color: '#BABABA', fontSize: '14px', fontWeight: 'normal' }}>Filter :</span>}
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
        {isOpen && !selectedCountry && (
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
                  setSelectedCountry('');
                  setOpenFilterDropdown(null);
                }}
                style={{
                  backgroundColor: !selectedCountry ? '#F0F8FE' : 'transparent',
                  color: !selectedCountry ? '#64B5F6' : '#BABABA',
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
                      filter: selectedCountry ? 'grayscale(100%) brightness(0.7)' : 'none'
                    }}
                  />
                  <span>Africa</span>
                </div>
              </button>
              {africanCountries.map((country) => (
                <button
                  key={country.name}
                  onClick={() => {
                    setSelectedCountry(country.name);
                    setOpenFilterDropdown(null);
                  }}
                  style={{
                    backgroundColor: selectedCountry === country.name ? '#F0F8FE' : 'transparent',
                    color: selectedCountry === country.name ? '#64B5F6' : '#BABABA',
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

  const renderPagination = () => {
    // Generate pagination numbers
    const paginationNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        paginationNumbers.push(i);
      }
    } else if (currentPage <= 3) {
      paginationNumbers.push(1, 2, 3, 4, 5);
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) {
        paginationNumbers.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        paginationNumbers.push(i);
      }
    }

    // Pagination Component
    const Pagination = () => {
      const pageNumbers = [];
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`px-3 py-2 border-t border-b border-gray-300 text-sm font-medium ${currentPage === number
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      );
    };

    if (loading && requests.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div className={`flex flex-col ${isMobile ? 'items-center gap-4' : 'lg:flex-row items-center gap-6'} mt-12 ${isMobile ? 'mb-16' : 'mb-32'} w-full`}>
        <div className={`flex-1 flex justify-center w-full`}>
          <div className={`flex items-center gap-4`} style={isMobile ? {} : { marginLeft: '80px' }}>
            <button
              aria-label="Previous page"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                width: '28px',
                height: '28px',
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C8C8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="flex items-center" style={{ gap: '24px' }}>
              {paginationNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    fontFamily: 'Bricolage Grotesque, sans-serif',
                    fontSize: '14px',
                    color: page === currentPage ? '#212121' : '#B0B0B0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {page}
                </button>
              ))}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span style={{ color: '#B0B0B0' }}>…</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    style={{
                      fontFamily: 'Bricolage Grotesque, sans-serif',
                      fontSize: '14px',
                      color: '#B0B0B0',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              aria-label="Next page"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                width: '28px',
                height: '28px',
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={currentPage === totalPages ? '#8C8C8C' : '#212121'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Go to section - directly under pagination on mobile */}
        <div className={`flex items-center gap-2 ${isMobile ? 'justify-center' : ''}`}>
          <span style={{ color: '#939393', fontFamily: 'Poppins, sans-serif', fontSize: '12px' }}>Go to :</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={goToPage}
            onChange={(e) => setGoToPage(parseInt(e.target.value) || 1)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const page = Math.min(Math.max(1, goToPage), totalPages);
                handlePageChange(page);
                setGoToPage(page);
              }
            }}
            placeholder="e.g 40"
            style={{
              border: '1px solid #BABABA',
              borderRadius: '8px',
              padding: '6px 10px',
              fontFamily: 'Bricolage Grotesque, sans-serif',
              fontSize: '12px',
              color: '#212121',
              width: '64px',
              textAlign: 'center'
            }}
          />
          <button
            onClick={() => {
              const page = Math.min(Math.max(1, goToPage), totalPages);
              handlePageChange(page);
              setGoToPage(page);
            }}
            style={{
              backgroundColor: '#212121',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '6px 14px',
              fontFamily: 'Bricolage Grotesque, sans-serif',
              fontSize: '12px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Go
          </button>
        </div>
      </div>
    );
  };

  /** Centralized empty state when no requests are found in any section */
  const renderRequestsEmptyState = (options: {
    title: string;
    description: string;
    showViewLink?: boolean;
    wrapperClassName?: string;
    wrapperStyle?: React.CSSProperties;
  }) => {
    const { title, description, showViewLink = false, wrapperClassName = '', wrapperStyle } = options;
    const defaultStyle: React.CSSProperties = {
      padding: isMobile ? '48px 16px' : '64px 16px',
      marginTop: isMobile ? '32px' : '48px',
      marginBottom: isMobile ? '48px' : '64px'
    };
    return (
      <div
        className={`text-center ${wrapperClassName}`.trim()}
        style={{ ...defaultStyle, ...wrapperStyle }}
      >
        <img
          src={emptyRequestIcon}
          alt="No requests found"
          className="mx-auto"
          style={{
            width: isMobile ? '40px' : '60px',
            height: isMobile ? '40px' : '60px',
            marginBottom: isMobile ? '12px' : '16px'
          }}
        />
        <h3 style={{
          fontSize: isMobile ? '16px' : '20px',
          color: '#D9D9D9',
          fontFamily: 'Bricolage Grotesque, sans-serif',
          fontWeight: '500',
          marginBottom: isMobile ? '8px' : '12px'
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: isMobile ? '12px' : '16px',
          color: '#B0B0B0',
          fontFamily: 'Poppins, sans-serif',
          maxWidth: isMobile ? '280px' : '500px',
          margin: '0 auto',
          marginBottom: showViewLink ? (isMobile ? '16px' : '20px') : 0,
          lineHeight: '1.5'
        }}>
          {description}
        </p>
        {showViewLink && (
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-80"
            style={{
              color: '#64B5F6',
              fontSize: isMobile ? '11px' : '13px',
              textDecoration: 'none',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            <span>View available items</span>
            <img
              src={requestArrowIcon}
              alt="Arrow"
              style={{
                width: isMobile ? '10px' : '12px',
                height: isMobile ? '10px' : '12px',
                filter: 'brightness(0) saturate(100%) invert(64%) sepia(52%) saturate(555%) hue-rotate(176deg) brightness(97%) contrast(92%)'
              }}
            />
          </Link>
        )}
      </div>
    );
  };

  const renderRequestCard = (isPending: boolean = false, cardId: string = '', productData?: { title: string; country: string; flag: string; location: string; isPending?: boolean; description?: string; price?: number; request?: ProductRequest }) => {
    // Check if the current user is the owner of this request
    const isCurrentUserOwner = (req: ProductRequest | undefined) => {
      return user && req && req.userId === user.id;
    };

    // Helper function to get status display text (aligned with MyRequests: pending, completed, ongoing, expired)
    const getStatusDisplay = (status: string | undefined): string => {
      if (!status) return 'Pending';
      const statusUpper = status.toUpperCase();
      switch (statusUpper) {
        case 'PENDING':
          return 'Pending';
        case 'ONGOING':
          return 'Ongoing';
        case 'FULFILLED':
          return 'Completed';
        case 'REJECTED':
          return 'Expired';
        case 'CANCELLED':
          return 'Cancelled';
        default:
          return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      }
    };

    // Handle both card format (from getAllCards/getFilteredCards) and direct ProductRequest
    let req: ProductRequest | undefined;
    let cardIsPending: boolean;

    if (productData?.request) {
      // Card format with request property
      req = productData.request;
      cardIsPending = productData.isPending !== undefined ? productData.isPending : (req?.status?.toUpperCase() === 'PENDING');
    } else if (productData) {
      // Card format - need to find the request from requests array
      req = requests.find(r => r.productName === productData.title);
      cardIsPending = productData.isPending !== undefined ? productData.isPending : (req?.status?.toUpperCase() === 'PENDING');
    } else {
      // Direct ProductRequest (legacy format)
      req = undefined;
      cardIsPending = isPending;
    }

    const country = req ? getProductCountry(req.origin) : (productData ? { name: productData.country, flag: productData.flag } : { name: '', flag: '' });
    const requestStatus = req?.status || 'PENDING';
    const statusDisplay = getStatusDisplay(requestStatus);

    return (
      <div
        className="bg-white hover:shadow-md transition-shadow cursor-pointer"
        onClick={(e) => {
          // Prevent modal from opening when clicking on buttons inside the card
          if ((e.target as HTMLElement).closest('button')) {
            return;
          }
          if (req) {
            setSelectedCard(req);
            setShowRequestModal(true);
          } else if (productData?.request) {
            setSelectedCard(productData.request);
            setShowRequestModal(true);
          }
        }}
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
            {isCurrentUserOwner(req) ? (
              // Owner's view: Manage Request button + Share icon
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (req) {
                      handleManageRequest(req);
                    }
                  }}
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
                >
                  <img
                    src={requestIcon}
                    alt="Manage"
                    style={{
                      width: '12px',
                      height: '12px'
                    }}
                  />
                  <span>Manage Request</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (req) {
                      handleShareClick(e, req);
                    }
                  }}
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
            ) : (
              // Other users' requests: Status badge + More options modal
              <div className="flex items-center gap-2">
                <div
                  className="px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: '#F4F4F4',
                    fontSize: '10px',
                    color: '#6A6A6A',
                    fontWeight: 'normal',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  {statusDisplay}
                </div>
                <div style={{ position: 'relative' }} ref={moreOptionsRef}>
                  <button
                    type="button"
                    className="w-5 h-5 rounded-full border flex items-center justify-center"
                    style={{
                      borderColor: '#B0B0B0',
                      borderWidth: '1.5px',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      padding: 0
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMoreOptionsOpenFor(moreOptionsOpenFor === cardId ? null : cardId);
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="3" cy="6" r="1.2" fill="#B0B0B0" />
                      <circle cx="6" cy="6" r="1.2" fill="#B0B0B0" />
                      <circle cx="9" cy="6" r="1.2" fill="#B0B0B0" />
                    </svg>
                  </button>
                  {moreOptionsOpenFor === cardId && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '26px',
                        right: 0,
                        backgroundColor: '#FFFFFF',
                        borderRadius: isMobile ? '12px' : '16px',
                        border: '1px solid #E9E9E9',
                        boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                        padding: isMobile ? '6px' : '8px',
                        minWidth: isMobile ? '150px' : '200px',
                        zIndex: 10000,
                        isolation: 'isolate'
                      }}
                    >
                      {/* Manage request */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMoreOptionsOpenFor(null);
                          if (req) {
                            handleManageRequest(req);
                          }
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: isMobile ? '8px' : '10px',
                          padding: isMobile ? '6px 10px' : '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: isMobile ? '11px' : '13px',
                          color: '#939393'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <img
                          src={requestIcon}
                          alt="Request"
                          style={{
                            width: isMobile ? '14px' : '18px',
                            height: isMobile ? '14px' : '18px',
                            filter: 'brightness(0) saturate(100%) invert(73%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)'
                          }}
                        />
                        <span>Manage request</span>
                      </button>

                      {/* Share the request */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMoreOptionsOpenFor(null);
                          if (req) {
                            handleShareClick(e, req);
                          }
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: isMobile ? '8px' : '10px',
                          padding: isMobile ? '6px 10px' : '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: isMobile ? '11px' : '13px',
                          color: '#939393',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <img
                          src={shareIcon}
                          alt="Share"
                          style={{
                            width: isMobile ? '14px' : '18px',
                            height: isMobile ? '14px' : '18px',
                            filter: 'brightness(0) saturate(100%) invert(73%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)'
                          }}
                        />
                        <span style={{ whiteSpace: 'nowrap' }}>Share the request</span>
                      </button>

                      {/* Close */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMoreOptionsOpenFor(null);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: isMobile ? '8px' : '10px',
                          padding: isMobile ? '6px 10px' : '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: '#FAFAFA',
                          cursor: 'pointer',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: isMobile ? '11px' : '13px',
                          color: '#939393'
                        }}
                      >
                        <svg width={isMobile ? '14' : '18'} height={isMobile ? '14' : '18'} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4L4 12M4 4L12 12" stroke="#939393" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Close</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Product Name Label and Status Badge - Mobile */}
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
            {isCurrentUserOwner(req) ? (
              // Owner's view: Manage Request button + Share icon
              <div className="flex items-center gap-2" style={{ position: 'absolute', right: 0 }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (req) {
                      handleManageRequest(req);
                    }
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-lg border"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#F9A825',
                    color: '#F9A825',
                    fontWeight: 'normal',
                    fontSize: '9px',
                    fontFamily: 'Poppins, sans-serif',
                    height: '22px',
                    width: 'auto'
                  }}
                >
                  <img
                    src={requestIcon}
                    alt="Manage"
                    style={{
                      width: '10px',
                      height: '10px'
                    }}
                  />
                  <span>Manage</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (req) {
                      handleShareClick(e, req);
                    }
                  }}
                  className="rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: '#F4F4F4',
                    border: 'none',
                    cursor: 'pointer',
                    width: '24px',
                    height: '24px',
                    flexShrink: 0
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
            ) : (
              // Other users' requests: Status badge + More options modal
              <div className="flex items-center gap-2" style={{ position: 'absolute', right: 0, alignItems: 'center' }}>
                <div
                  className="px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: '#F4F4F4',
                    fontSize: '10px',
                    color: '#6A6A6A',
                    fontWeight: 'normal',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  {statusDisplay}
                </div>
                <div style={{ position: 'relative' }} ref={moreOptionsRef}>
                  <button
                    type="button"
                    className="w-5 h-5 rounded-full border flex items-center justify-center"
                    style={{
                      borderColor: '#B0B0B0',
                      borderWidth: '1.5px',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      padding: 0
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMoreOptionsOpenFor(moreOptionsOpenFor === cardId ? null : cardId);
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="3" cy="6" r="1.2" fill="#B0B0B0" />
                      <circle cx="6" cy="6" r="1.2" fill="#B0B0B0" />
                      <circle cx="9" cy="6" r="1.2" fill="#B0B0B0" />
                    </svg>
                  </button>
                  {moreOptionsOpenFor === cardId && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '26px',
                        right: 0,
                        backgroundColor: '#FFFFFF',
                        borderRadius: isMobile ? '12px' : '16px',
                        border: '1px solid #E9E9E9',
                        boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                        padding: isMobile ? '6px' : '8px',
                        minWidth: isMobile ? '150px' : '200px',
                        zIndex: 10000,
                        isolation: 'isolate'
                      }}
                    >
                      {/* Manage request */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMoreOptionsOpenFor(null);
                          if (req) {
                            handleManageRequest(req);
                          }
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: isMobile ? '8px' : '10px',
                          padding: isMobile ? '6px 10px' : '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: isMobile ? '11px' : '13px',
                          color: '#939393'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <img
                          src={requestIcon}
                          alt="Request"
                          style={{
                            width: isMobile ? '14px' : '18px',
                            height: isMobile ? '14px' : '18px',
                            filter: 'brightness(0) saturate(100%) invert(73%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)'
                          }}
                        />
                        <span>Manage request</span>
                      </button>

                      {/* Share the request */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMoreOptionsOpenFor(null);
                          if (req) {
                            handleShareClick(e, req);
                          }
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: isMobile ? '8px' : '10px',
                          padding: isMobile ? '6px 10px' : '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: isMobile ? '11px' : '13px',
                          color: '#939393',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <img
                          src={shareIcon}
                          alt="Share"
                          style={{
                            width: isMobile ? '14px' : '18px',
                            height: isMobile ? '14px' : '18px',
                            filter: 'brightness(0) saturate(100%) invert(73%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)'
                          }}
                        />
                        <span style={{ whiteSpace: 'nowrap' }}>Share the request</span>
                      </button>

                      {/* Close */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMoreOptionsOpenFor(null);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: isMobile ? '8px' : '10px',
                          padding: isMobile ? '6px 10px' : '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: '#FAFAFA',
                          cursor: 'pointer',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: isMobile ? '11px' : '13px',
                          color: '#939393'
                        }}
                      >
                        <svg width={isMobile ? '14' : '18'} height={isMobile ? '14' : '18'} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4L4 12M4 4L12 12" stroke="#939393" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Close</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Product Title */}
        <h3 className="mb-2 sm:mb-3" style={{ fontSize: isMobile ? '11px' : '14px', fontWeight: '500', color: '#212121' }}>
          {req ? req.productName : (productData ? productData.title : '')}
        </h3>

        {/* Description */}
        <p className="mb-3 sm:mb-4" style={{ fontSize: isMobile ? '7px' : '10px', color: '#6A6A6A', lineHeight: '1.5', fontWeight: 'normal' }}>
          {req ? req.description : (productData ? productData.description : '')}
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
                <span style={{ fontSize: '12px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
                  {req ? formatCityDisplay(req.sellerLocation) : (productData ? formatCityDisplay(productData.location) : '')}
                </span>
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
                  <span style={{ fontSize: '12px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
                    {req ? formatPriceRange(req.minPrice, req.maxPrice, req.currency) : (productData && productData.price !== undefined ? `${productData.price}` : '')}
                  </span>
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
                  <img
                    src={country.flag}
                    alt={country.name}
                    className="object-cover rounded-full"
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '12px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>{country.name}</span>
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
                {req && req.user && req.user.profileImage ? (
                  <img
                    src={req.user.profileImage}
                    alt={req.user.firstName || 'User'}
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
                <span style={{ fontSize: '10px', color: '#212121', fontWeight: '500' }}>{req?.user?.rating}</span>
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
              <span style={{ fontSize: '8px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
                {req ? formatCityDisplay(req.sellerLocation) : (productData ? formatCityDisplay(productData.location) : '')}
              </span>
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
                <span style={{ fontSize: '8px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
                  {req ? formatPriceRange(req.minPrice, req.maxPrice, req.currency) : (productData && productData.price !== undefined ? `${productData.price}` : '')}
                </span>
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
                <img
                  src={country.flag}
                  alt={country.name}
                  className="rounded-full"
                  style={{
                    width: '11px',
                    height: '11px',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
                <span style={{ fontSize: '8px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>{country.name}</span>
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
                  {req && req.user && req.user.profileImage ? (
                    <img
                      src={req.user.profileImage}
                      alt={req.user.firstName || 'User'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                    />
                  ) : (
                    <svg
                      style={{ width: '14px', height: '14px' }}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#8B5E3C" />
                      <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#8B5E3C" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col">
                  <span style={{ fontSize: '8px', color: '#212121', fontWeight: '500' }}>
                    {req && req.user ? `${req.user.firstName ?? ''} ${req.user.lastName ?? ''}` : 'User'}
                  </span>
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
                    <span style={{ fontSize: '8px', color: '#212121', fontWeight: '500', marginLeft: '2px' }}>{req?.user?.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Manage the request button - Mobile only (replaces Respond to request) */}
        {isMobile && !cardIsPending && isCurrentUserOwner(req) && (
          <div className="w-full flex justify-center mt-3">
            <button
              className="flex items-center justify-center gap-1.5 mx-auto"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#F9A825',
                border: '1px solid #F9A825',
                color: '#F9A825',
                fontWeight: 'normal',
                fontSize: '9px',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: isManagingRequest ? 'not-allowed' : 'pointer',
                width: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isManagingRequest ? 0.7 : 1
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!isManagingRequest && req) {
                  handleManageRequest(req);
                }
              }}
              disabled={isManagingRequest}
            >
              {isManagingRequest ? (
                <>
                  <svg className="animate-spin h-3 w-3 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <img src={requestIcon} alt="Request" style={{ width: '12px', height: '12px' }} />
                  Manage the request
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  // Mobile Search View
  if (showMobileSearch && isMobile) {
    const mobileSearchFiltered = mobileSearchSubmitted ? getAllCards().filter((card: { title: string; country: string; flag: string; location: string; description?: string; price: number; request?: ProductRequest }) => {
      const query = getCityPlain(mobileSearchQuery).toLowerCase().trim();
      const searchLower = mobileSearchQuery.toLowerCase().trim();
      return (
        card.title.toLowerCase().includes(searchLower) ||
        getCityPlain(card.location || '').toLowerCase().includes(query) ||
        card.country.toLowerCase().includes(searchLower) ||
        (card.description && card.description.toLowerCase().includes(searchLower))
      );
    }) : [];

    const hasSearchResults = mobileSearchSubmitted && mobileSearchQuery.trim() !== '' && mobileSearchFiltered.length > 0;
    const isNoResults = mobileSearchSubmitted && mobileSearchQuery.trim() !== '' && mobileSearchFiltered.length === 0;
    const showSearchButton = !mobileSearchSubmitted || (mobileSearchSubmitted && mobileSearchFiltered.length === 0 && mobileSearchQuery.trim() === '');

    // Filter location suggestions for mobile search
    const getMobileSearchSuggestions = () => {
      if (!mobileSearchQuery.trim()) return [];
      const query = mobileSearchQuery.toLowerCase();
      return locationSuggestions.filter(location =>
        location.toLowerCase().startsWith(query) ||
        location.toLowerCase().includes(query)
      ).slice(0, 6);
    };

    const mobileSearchSuggestions = getMobileSearchSuggestions();
    const showMobileSuggestions = !mobileSearchSubmitted && mobileSearchQuery.trim() !== '' && mobileSearchSuggestions.length > 0;

    return (
      <div className="bg-white min-h-screen flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {/* Search Bar at Top */}
        <div className="px-4 pt-4 pb-3" style={{ position: 'relative' }}>
          <div
            className="flex items-center gap-3 px-3 py-2 bg-white relative"
            style={{
              border: `1px solid ${mobileSearchQuery ? '#97CDF9' : '#E4E4E4'}`,
              borderRadius: '12px'
            }}
          >
            <button
              type="button"
              onClick={() => {
                setShowMobileSearch(false);
                setMobileSearchQuery('');
                setMobileSearchSubmitted(false);
              }}
              className="flex-shrink-0"
            >
              <img src={backArrowIcon} alt="Back" className="w-4 h-4" />
            </button>
            <img
              src={locationIcon}
              alt="Location"
              className="flex-shrink-0"
              style={{
                width: '16px',
                height: '16px',
                filter: 'brightness(0) saturate(100%) invert(85.1%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)',
                opacity: 1
              }}
            />
            <input
              type="text"
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              className="flex-1 outline-none"
              style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#212121', paddingLeft: '0' }}
              placeholder="Buyer location"
              autoFocus
            />
            <style>{`
              input[placeholder="Buyer location"]::placeholder {
                color: #D9D9D9 !important;
              }
            `}</style>
            {mobileSearchQuery && (
              <button
                type="button"
                onClick={() => {
                  setMobileSearchQuery('');
                  setMobileSearchSubmitted(false);
                }}
                className="flex-shrink-0"
              >
                <img src={SDicon} alt="Clear" className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location Suggestions Dropdown */}
          {showMobileSuggestions && (
            <div
              className="absolute top-full left-4 right-4 mt-1 z-50"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                maxHeight: '180px',
                overflowY: 'auto',
                marginTop: '4px'
              }}
            >
              {mobileSearchSuggestions.map((city, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setMobileSearchQuery(city);
                    setMobileSearchSubmitted(true);
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

        {/* Search Results Title */}
        {hasSearchResults && (
          <div className="px-4 pb-3">
            <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '16px', color: '#212121', fontWeight: 600 }}>
              Search results for "{mobileSearchQuery}" <span style={{ fontWeight: 400 }}>({mobileSearchFiltered.length} {mobileSearchFiltered.length === 1 ? 'request' : 'requests'})</span>
            </h2>
          </div>
        )}

        {/* Search Results or Empty State */}
        <div className="flex-1 overflow-y-auto px-4 pb-24">
          {isNoResults && renderRequestsEmptyState({
            title: 'No results',
            description: 'We found nothing for your search, sorry. Please continue browsing the platform to discover more wonders.',
            showViewLink: true,
            wrapperStyle: { padding: '48px 16px', marginTop: '32px', marginBottom: '48px' }
          })}

          {hasSearchResults && (
            <div className="grid grid-cols-1 gap-4">
              {mobileSearchFiltered.map((product: { title: string; country: string; flag: string; location: string; description?: string; price: number; request?: ProductRequest }, index: number) => (
                <React.Fragment key={index}>
                  {renderRequestCard(false, `mobile-search-${index}`, product)}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Search Button */}
        {showSearchButton && (
          <div className="fixed bottom-0 left-0 right-0 px-4 pb-4 bg-white" style={{ boxShadow: 'none', border: 'none', borderTop: 'none' }}>
            <button
              type="button"
              className="w-full py-3 rounded-xl"
              style={{
                backgroundColor: mobileSearchQuery.trim() ? '#F9A825' : '#D9D9D9',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '14px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                cursor: mobileSearchQuery.trim() ? 'pointer' : 'not-allowed',
                boxShadow: 'none'
              }}
              onClick={() => {
                if (mobileSearchQuery.trim()) {
                  setMobileSearchSubmitted(true);
                }
              }}
            >
              Search
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {isMobile && (
        <div className="lg:hidden fixed top-4 left-4 right-4 z-50 flex items-center justify-between mb-16">
          <button
            type="button"
            onClick={() => navigate(-1)}
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
              onClick={() => setShowMobileSearch(true)}
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
      )}

      {/* Breadcrumbs */}
      <div className="hidden lg:block bg-white" style={{ paddingTop: '24px', paddingBottom: '0px', marginBottom: '-48px' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16" style={{ paddingLeft: '0px' }}>
          <nav className="flex items-center space-x-2" style={{ fontSize: '13px', marginLeft: '0px' }}>
            <img
              src={arrowLeftIcon}
              alt="Back"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              style={{ width: '14px', height: '14px' }}
              onClick={() => navigate('/')}
            />
            <Link to="/" className="hover:opacity-80 transition-opacity" style={{ color: '#BABABA' }}>
              Homepage
            </Link>
            <span style={{ color: '#BABABA', fontSize: '17px', lineHeight: 1 }}>·</span>
            <span
              className="hover:opacity-80 transition-opacity cursor-pointer"
              style={{ color: '#BABABA' }}
              onClick={() => navigate('/', { state: { openMenu: true } })}
            >
              Menu
            </span>
            <span style={{ color: '#BABABA', fontSize: '17px', lineHeight: 1 }}>·</span>
            <span className="font-medium" style={{ color: '#212121' }}>
              Requests
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 px-6 sm:px-8 lg:px-16" style={{ paddingBottom: isMobile ? '32px' : '48px', paddingTop: isMobile ? '40px' : '64px' }}>
        <div className="max-w-7xl mx-auto">

          {/* Header Section */}
          <div className={isMobile ? "flex flex-col items-center mb-6 sm:mb-8" : "flex items-start justify-between mb-6 sm:mb-8"} style={isMobile ? { marginTop: '40px' } : {}}>
            <div className={isMobile ? "flex-1 text-center" : "flex-1"}>
              <h2 className="mb-3 sm:mb-4" style={{ fontSize: isMobile ? '20px' : '44px', fontWeight: '500', lineHeight: '1.2', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
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
              <p style={{ fontSize: isMobile ? '11px' : '16px', color: '#9C9C9C', maxWidth: isMobile ? '280px' : '600px', lineHeight: '1.6', margin: isMobile ? '0 auto' : '0' }}>
                Turn unmet needs into instant deals, discover what people are looking for, grab it, and sell it right where demand begins
              </p>
            </div>

            {/* Search Bar or Over 400 requests available - Hidden on mobile */}
            {!isMobile && (
              <>
                {isSearchActive ? (
                  // When search is active: show "Over 400 requests available"
                  <div className="text-right" style={{ width: isMobile ? '100%' : '380px', marginTop: isMobile ? '16px' : '0' }}>
                    <div style={{
                      fontSize: isMobile ? '20px' : '44px',
                      fontWeight: '600',
                      background: 'linear-gradient(90deg, #E55325 0%, #F9A825 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      Over 400
                    </div>
                    <div style={{ fontSize: isMobile ? '10px' : '18px', color: '#9C9C9C', marginTop: '4px' }}>
                      Request availables
                    </div>
                  </div>
                ) : (selectedCountry || selectedPrice) ? (
                  // When filters are applied, show search bar in header (only if there are results)
                  getFilteredCount() === 0 ? (
                    // No results: show "Over 400 requests available"
                    <div className="text-right" style={{ width: isMobile ? '100%' : '380px', marginTop: isMobile ? '16px' : '0' }}>
                      <div style={{
                        fontSize: isMobile ? '20px' : '44px',
                        fontWeight: '600',
                        background: 'linear-gradient(90deg, #E55325 0%, #F9A825 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        Over 400
                      </div>
                      <div style={{ fontSize: isMobile ? '10px' : '18px', color: '#9C9C9C', marginTop: '4px' }}>
                        Request availables
                      </div>
                    </div>
                  ) : (
                    // Has results: show search bar in header
                    <div style={{ width: isMobile ? '100%' : '380px', marginTop: isMobile ? '16px' : '0' }}>
                      <div className="relative flex items-center" ref={searchDropdownRef}>
                        <img
                          src={locationIcon}
                          alt="Location"
                          className="absolute left-3 z-10"
                          style={{
                            width: '16px',
                            height: '16px',
                            filter: 'brightness(0) saturate(100%) invert(73%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)'
                          }}
                        />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          onFocus={() => {
                            setIsSearchFocused(true);
                            if (searchQuery.trim()) {
                              setShowSearchSuggestions(true);
                            }
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSearch();
                            }
                          }}
                          placeholder="Buyer location"
                          className="w-full border rounded-lg focus:outline-none pl-10"
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderColor: isSearchFocused ? '#CFE8FC' : '#E4E4E4',
                            borderWidth: isSearchFocused ? '2px' : '1px',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: isMobile ? '10px' : '14px',
                            color: searchQuery ? '#212121' : '#D9D9D9',
                            padding: isMobile ? '6px 50px 6px 32px' : '10px 112px 10px 40px'
                          }}
                        />
                        <button
                          onClick={handleSearch}
                          className="absolute right-2 flex items-center justify-center cursor-pointer"
                          style={{
                            backgroundColor: '#F9A825',
                            height: isMobile ? '20px' : '28px',
                            paddingLeft: isMobile ? '10px' : '18px',
                            paddingRight: isMobile ? '10px' : '18px',
                            borderRadius: '8px',
                            border: 'none'
                          }}
                        >
                          <img src={buyerIcon} alt="Search" style={{ width: isMobile ? '12px' : '16px', height: isMobile ? '12px' : '16px' }} />
                        </button>
                        {/* Suggestions Dropdown */}
                        {showSearchSuggestions && getFilteredSuggestions().length > 0 && (
                          <>
                            <style>{`
                          .search-suggestions-dropdown::-webkit-scrollbar {
                            display: none;
                          }
                          .search-suggestions-dropdown {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                          }
                        `}</style>
                            <div
                              className="search-suggestions-dropdown absolute top-full left-0 right-0 mt-1 z-50"
                              style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                maxHeight: '180px',
                                overflowY: 'auto'
                              }}
                            >
                              {getFilteredSuggestions().map((city, index) => (
                                <div
                                  key={index}
                                  onClick={() => {
                                    setSearchQuery(city);
                                    setShowSearchSuggestions(false);
                                    handleSearch();
                                  }}
                                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                                  style={{
                                    padding: isMobile ? '6px 10px' : '8px 12px'
                                  }}
                                >
                                  <img
                                    src={locationIcon}
                                    alt="Location"
                                    style={{
                                      width: isMobile ? '12px' : '14px',
                                      height: isMobile ? '12px' : '14px',
                                      filter: 'brightness(0) saturate(100%) invert(73%) sepia(52%) saturate(1685%) hue-rotate(352deg) brightness(103%) contrast(95%)'
                                    }}
                                  />
                                  <span style={{ color: '#6A6A6A', fontSize: isMobile ? '9px' : '13px', fontFamily: 'Poppins, sans-serif' }}>
                                    {formatCityDisplay(city)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )
                ) : (
                  // No filters: show search bar normally
                  <div style={{ width: isMobile ? '100%' : '380px', marginTop: isMobile ? '16px' : '0' }}>
                    <div className="relative flex items-center" ref={searchDropdownRef}>
                      <img
                        src={locationIcon}
                        alt="Location"
                        className="absolute left-3 z-10"
                        style={{
                          width: '16px',
                          height: '16px',
                          filter: 'brightness(0) saturate(100%) invert(73%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)'
                        }}
                      />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => {
                          setIsSearchFocused(true);
                          if (searchQuery.trim()) {
                            setShowSearchSuggestions(true);
                          }
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSearch();
                          }
                        }}
                        placeholder="Buyer location"
                        className="w-full border rounded-lg focus:outline-none pl-10"
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderColor: isSearchFocused ? '#CFE8FC' : '#E4E4E4',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: isMobile ? '10px' : '14px',
                          color: searchQuery ? '#212121' : '#D9D9D9',
                          padding: isMobile ? '6px 50px 6px 32px' : '10px 112px 10px 40px'
                        }}
                      />
                      <button
                        onClick={handleSearch}
                        className="absolute right-2 flex items-center justify-center cursor-pointer"
                        style={{
                          backgroundColor: '#F9A825',
                          height: isMobile ? '20px' : '28px',
                          paddingLeft: isMobile ? '10px' : '18px',
                          paddingRight: isMobile ? '10px' : '18px',
                          borderRadius: '8px',
                          border: 'none'
                        }}
                      >
                        <img src={buyerIcon} alt="Search" style={{ width: isMobile ? '12px' : '16px', height: isMobile ? '12px' : '16px' }} />
                      </button>
                      {/* Suggestions Dropdown */}
                      {showSearchSuggestions && getFilteredSuggestions().length > 0 && (
                        <div
                          className="absolute top-full left-0 right-0 mt-1 z-50"
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            maxHeight: '200px',
                            overflowY: 'auto'
                          }}
                        >
                          {getFilteredSuggestions().map((city, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                setSearchQuery(city);
                                setShowSearchSuggestions(false);
                                handleSearch();
                              }}
                              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50"
                            >
                              <img
                                src={locationIcon}
                                alt="Location"
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  filter: 'brightness(0) saturate(100%) invert(60%) sepia(95%) saturate(2000%) hue-rotate(0deg) brightness(1) contrast(1)'
                                }}
                              />
                              <span style={{ color: '#6A6A6A', fontSize: isMobile ? '10px' : '14px', fontFamily: 'Poppins, sans-serif' }}>
                                {formatCityDisplay(city)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Search Results View */}
          {isSearchActive && searchQuery.trim() ? (
            <>
              {/* Filter Bar */}
              <div className={isMobile ? "flex flex-col gap-4 mb-3" : "flex items-center justify-between mb-6"}>
                {/* Left: Filters */}
                <div className="flex items-center gap-2">
                  {renderCountryFilterButton('relative', 'search')}
                  {renderPriceFilterButton('relative', 'search')}
                </div>

                {/* Right: Search Bar */}
                <div style={{ width: isMobile ? '100%' : '380px', marginLeft: isMobile ? '0' : 'auto' }}>
                  <div className="relative flex items-center" ref={searchDropdownRef}>
                    <img
                      src={locationIcon}
                      alt="Location"
                      className="absolute left-3 z-10"
                      style={{
                        width: '16px',
                        height: '16px',
                        filter: 'brightness(0) saturate(100%) invert(73%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)'
                      }}
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() => {
                        setIsSearchFocused(true);
                        if (searchQuery.trim()) {
                          setShowSearchSuggestions(true);
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                      placeholder="Buyer location"
                      className="w-full border rounded-lg focus:outline-none pl-10"
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderColor: isSearchFocused ? '#CFE8FC' : '#E4E4E4',
                        borderWidth: isSearchFocused ? '2px' : '1px',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: isMobile ? '10px' : '14px',
                        color: searchQuery ? '#212121' : '#D9D9D9',
                        padding: isMobile ? '6px 50px 6px 32px' : '10px 112px 10px 40px'
                      }}
                    />
                    <button
                      onClick={handleSearch}
                      className="absolute right-2 flex items-center justify-center cursor-pointer"
                      style={{
                        backgroundColor: '#F9A825',
                        height: isMobile ? '20px' : '28px',
                        paddingLeft: isMobile ? '10px' : '18px',
                        paddingRight: isMobile ? '10px' : '18px',
                        borderRadius: '8px',
                        border: 'none'
                      }}
                    >
                      <img src={buyerIcon} alt="Search" style={{ width: isMobile ? '12px' : '16px', height: isMobile ? '12px' : '16px' }} />
                    </button>
                    {/* Suggestions Dropdown */}
                    {showSearchSuggestions && getFilteredSuggestions().length > 0 && (
                      <>
                        <style>{`
                          .search-suggestions-dropdown::-webkit-scrollbar {
                            display: none;
                          }
                          .search-suggestions-dropdown {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                          }
                        `}</style>
                        <div
                          className="search-suggestions-dropdown absolute top-full left-0 right-0 mt-1 z-50"
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            maxHeight: '180px',
                            overflowY: 'auto'
                          }}
                        >
                          {getFilteredSuggestions().map((city, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                setSearchQuery(city);
                                setShowSearchSuggestions(false);
                                handleSearch();
                              }}
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                              style={{
                                padding: isMobile ? '6px 10px' : '8px 12px'
                              }}
                            >
                              <img
                                src={locationIcon}
                                alt="Location"
                                style={{
                                  width: isMobile ? '12px' : '14px',
                                  height: isMobile ? '12px' : '14px',
                                  filter: 'brightness(0) saturate(100%) invert(73%) sepia(52%) saturate(1685%) hue-rotate(352deg) brightness(103%) contrast(95%)'
                                }}
                              />
                              <span style={{ color: '#6A6A6A', fontSize: isMobile ? '9px' : '13px', fontFamily: 'Poppins, sans-serif' }}>
                                {formatCityDisplay(city)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Search Results Title */}
              <div className="mb-6">
                <h3 style={{
                  fontSize: isMobile ? '14px' : '18px',
                  fontWeight: '500',
                  color: '#000000',
                  fontFamily: 'Bricolage Grotesque, sans-serif'
                }}>
                  Results for "{searchQuery}" ({getFilteredCards().length} requests)
                </h3>
              </div>

              {/* Search Results Cards */}
              {getFilteredCards().length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {getFilteredCards().map((product: { title: string; country: string; flag: string; location: string; description?: string; price: number }, index: number) => (
                    <div key={`search-${index}`}>
                      {renderRequestCard(false, `search-${index}`, product)}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {renderRequestsEmptyState({
                    title: 'No results',
                    description: 'We found nothing for your search, sorry. Please continue browsing the platform to discover more wonders.',
                    showViewLink: true
                  })}

                  {/* Requests near you Section */}
                  <div className="mb-12">
                    {isMobile ? (
                      <>
                        <h3 style={{
                          fontFamily: 'Bricolage Grotesque, sans-serif',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#000000',
                          marginBottom: '4px'
                        }}>
                          Requests near you
                        </h3>
                        <div className="flex items-center justify-end mb-6">
                          <div className="flex items-center gap-2">
                            <button
                              className="rounded-full flex items-center justify-center transition-all duration-200"
                              style={{
                                width: '16px',
                                height: '16px'
                              }}
                              aria-label="Previous"
                            >
                              <img src={grayArrowIcon} alt="Previous" className="w-full h-full" />
                            </button>
                            <button
                              className="rounded-full flex items-center justify-center transition-all duration-200"
                              style={{
                                width: '16px',
                                height: '16px'
                              }}
                              aria-label="Next"
                            >
                              <img src={blackArrowIcon} alt="Next" className="w-full h-full" />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between mb-6">
                        <h3 style={{
                          fontFamily: 'Bricolage Grotesque, sans-serif',
                          fontSize: '18px',
                          fontWeight: '500',
                          color: '#000000'
                        }}>
                          Requests near you
                        </h3>
                        <div className="flex items-center gap-3">
                          <button
                            className="rounded-full flex items-center justify-center transition-all duration-200"
                            style={{
                              width: '24px',
                              height: '24px'
                            }}
                            aria-label="Previous"
                          >
                            <img src={grayArrowIcon} alt="Previous" className="w-full h-full" />
                          </button>
                          <button
                            className="rounded-full flex items-center justify-center transition-all duration-200"
                            style={{
                              width: '24px',
                              height: '24px'
                            }}
                            aria-label="Next"
                          >
                            <img src={blackArrowIcon} alt="Next" className="w-full h-full" />
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Cards grid */}
                    {nearYouRequests.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {nearYouRequests.map((req, index) => {
                          const country = getProductCountry(req.origin);
                          const cardData = {
                            title: req.productName,
                            country: country.name,
                            flag: country.flag,
                            location: req.sellerLocation || 'Location not specified',
                            description: req.description || '',
                            price: req.minPrice || 0,
                            request: req
                          };
                          return (
                            <div key={`near-${req.id}`}>
                              {renderRequestCard(false, `near-${index}`, cardData)}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      renderRequestsEmptyState({
                        title: 'No requests around you',
                        description: 'Explore other requests from different locations'
                      })
                    )}
                  </div>
                </>
              )}

              {/* Pagination - Only show when there are results */}
              {getFilteredCards().length > 0 && renderPagination()}
            </>
          ) : (selectedCountry || selectedPrice) ? (
            <>
              {/* Filter Bar */}
              <div className={isMobile ? "flex flex-col gap-4 mb-3" : "flex items-center justify-between mb-6"}>
                {/* Left: Filters */}
                <div className="flex items-center gap-2">
                  {renderCountryFilterButton('relative', 'filtered')}
                  {renderPriceFilterButton('relative', 'filtered')}
                </div>

                {/* Right: Search Bar - Only show when no results (Desktop only) */}
                {getFilteredCount() === 0 && !isMobile && (
                  <div style={{ width: isMobile ? '100%' : '380px', marginLeft: isMobile ? '0' : 'auto' }}>
                    <div className="relative flex items-center" ref={searchDropdownRef}>
                      <img
                        src={locationIcon}
                        alt="Location"
                        className="absolute left-3 z-10"
                        style={{
                          width: '16px',
                          height: '16px',
                          filter: 'brightness(0) saturate(100%) invert(73%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)'
                        }}
                      />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => {
                          setIsSearchFocused(true);
                          if (searchQuery.trim()) {
                            setShowSearchSuggestions(true);
                          }
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSearch();
                          }
                        }}
                        placeholder="Buyer location"
                        className="w-full border rounded-lg focus:outline-none pl-10"
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderColor: isSearchFocused ? '#CFE8FC' : '#E4E4E4',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: isMobile ? '10px' : '14px',
                          color: searchQuery ? '#212121' : '#D9D9D9',
                          padding: isMobile ? '6px 50px 6px 32px' : '10px 112px 10px 40px'
                        }}
                      />
                      <button
                        onClick={handleSearch}
                        className="absolute right-2 flex items-center justify-center cursor-pointer"
                        style={{
                          backgroundColor: '#F9A825',
                          height: isMobile ? '20px' : '28px',
                          paddingLeft: isMobile ? '10px' : '18px',
                          paddingRight: isMobile ? '10px' : '18px',
                          borderRadius: '8px',
                          border: 'none'
                        }}
                      >
                        <img src={buyerIcon} alt="Search" style={{ width: isMobile ? '12px' : '16px', height: isMobile ? '12px' : '16px' }} />
                      </button>
                      {/* Suggestions Dropdown */}
                      {showSearchSuggestions && getFilteredSuggestions().length > 0 && (
                        <div
                          className="absolute top-full left-0 right-0 mt-1 z-50"
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            maxHeight: '200px',
                            overflowY: 'auto'
                          }}
                        >
                          {getFilteredSuggestions().map((city, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                setSearchQuery(city);
                                setShowSearchSuggestions(false);
                                handleSearch();
                              }}
                              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50"
                            >
                              <img
                                src={locationIcon}
                                alt="Location"
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  filter: 'brightness(0) saturate(100%) invert(60%) sepia(95%) saturate(2000%) hue-rotate(0deg) brightness(1) contrast(1)'
                                }}
                              />
                              <span style={{ color: '#6A6A6A', fontSize: isMobile ? '10px' : '14px', fontFamily: 'Poppins, sans-serif' }}>
                                {formatCityDisplay(city)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Check if no results */}
              {getFilteredCount() === 0 && (selectedCountry || selectedPrice) ? (
                <>
                  {renderRequestsEmptyState({
                    title: 'No results',
                    description: 'We found nothing for your search, sorry. Please continue browsing the platform to discover more wonders.',
                    showViewLink: true
                  })}

                  {/* Requests near you Section */}
                  <div className="mb-12">
                    {isMobile ? (
                      <div className="flex items-center justify-between mb-6">
                        <h3 style={{
                          fontFamily: 'Bricolage Grotesque, sans-serif',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#000000'
                        }}>
                          Requests near you
                        </h3>
                        <div className="flex items-center gap-2">
                          <button
                            className="rounded-full flex items-center justify-center transition-all duration-200"
                            style={{
                              width: '16px',
                              height: '16px'
                            }}
                            aria-label="Previous"
                          >
                            <img src={grayArrowIcon} alt="Previous" className="w-full h-full" />
                          </button>
                          <button
                            className="rounded-full flex items-center justify-center transition-all duration-200"
                            style={{
                              width: '16px',
                              height: '16px'
                            }}
                            aria-label="Next"
                          >
                            <img src={blackArrowIcon} alt="Next" className="w-full h-full" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mb-6">
                        <h3 style={{
                          fontFamily: 'Bricolage Grotesque, sans-serif',
                          fontSize: '18px',
                          fontWeight: '500',
                          color: '#000000'
                        }}>
                          Requests near you
                        </h3>
                        <div className="flex items-center gap-3">
                          <button
                            className="rounded-full flex items-center justify-center transition-all duration-200"
                            style={{
                              width: '24px',
                              height: '24px'
                            }}
                            aria-label="Previous"
                          >
                            <img src={grayArrowIcon} alt="Previous" className="w-full h-full" />
                          </button>
                          <button
                            className="rounded-full flex items-center justify-center transition-all duration-200"
                            style={{
                              width: '24px',
                              height: '24px'
                            }}
                            aria-label="Next"
                          >
                            <img src={blackArrowIcon} alt="Next" className="w-full h-full" />
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="relative">
                      {!isMobile && (
                        <div
                          className="absolute top-0 right-0 bottom-0 w-32 pointer-events-none z-10"
                          style={{
                            background: 'linear-gradient(to left, white 0%, rgba(255, 255, 255, 0.8) 30%, transparent 100%)',
                            height: '100%'
                          }}
                        />
                      )}
                      <div
                        className={isMobile ? "flex gap-6 mb-2 overflow-x-auto scrollbar-hide" : "col-span-full"}
                        style={isMobile ? {
                          padding: '12px 0 8px 0',
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none',
                          WebkitOverflowScrolling: 'touch'
                        } : {}}
                      >
                        {nearYouRequests.length > 0 ? (
                          nearYouRequests.map((req, index) => {
                            const country = getProductCountry(req.origin);
                            const cardData = {
                              title: req.productName,
                              country: country.name,
                              flag: country.flag,
                              location: req.sellerLocation || 'Location not specified',
                              description: req.description || '',
                              price: req.minPrice || 0,
                              request: req
                            };
                            return (
                              <React.Fragment key={`near-${req.id}`}>
                                {renderRequestCard(false, `near-${index}`, cardData)}
                              </React.Fragment>
                            );
                          })
                        ) : (
                          renderRequestsEmptyState({
                            title: 'No requests around you',
                            description: 'Explore other requests from different locations',
                            wrapperClassName: 'col-span-full',
                            wrapperStyle: { padding: isMobile ? '48px 16px' : '64px 16px' }
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Filtered Title */}
                  <h3
                    className="mb-6"
                    style={{
                      fontFamily: 'Bricolage Grotesque, sans-serif',
                      fontSize: isMobile ? '16px' : '20px',
                      fontWeight: '500',
                      color: '#000000'
                    }}
                  >
                    {selectedCountry ? `Request from ${selectedCountry}` : 'Requests'}{selectedPrice ? ` - ${priceOptions.find(opt => opt.value === selectedPrice)?.label || ''}` : ''} ({getFilteredCount()} requests)
                  </h3>

                  {/* Filtered Cards */}
                  <div className="relative">
                    {!isMobile && (
                      <div
                        className="absolute top-0 right-0 bottom-0 w-32 pointer-events-none z-10"
                        style={{
                          background: 'linear-gradient(to left, white 0%, rgba(255, 255, 255, 0.8) 30%, transparent 100%)',
                          height: '100%'
                        }}
                      />
                    )}
                    <div
                      className={isMobile ? "flex gap-4 mb-2 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6"}
                      style={isMobile ? {
                        padding: '12px 0 8px 0',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                      } : {}}
                    >
                      {getFilteredCards().map((card: { title: string; country: string; flag: string; location: string; description?: string; price: number; request?: ProductRequest }, index: number) => (
                        <React.Fragment key={`filtered-${card.request?.id || index}`}>
                          {renderRequestCard(false, `filtered-${index}`, card)}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {/* Requests near you Section */}
              <div className="mb-12">
                {isMobile ? (
                  <>
                    <h3 style={{
                      fontFamily: 'Bricolage Grotesque, sans-serif',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#000000',
                      marginBottom: '4px'
                    }}>
                      Requests near you
                    </h3>
                    <div className={`flex items-center justify-between ${isMobile ? 'mb-0' : 'mb-6'}`}>
                      <div className="flex items-center gap-2" style={{ marginLeft: isMobile ? '-12px' : '0' }}>
                        {renderCountryFilterButton('relative', 'filtered')}
                        {renderPriceFilterButton('relative', 'filtered')}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="rounded-full flex items-center justify-center transition-all duration-200"
                          style={{
                            width: '16px',
                            height: '16px'
                          }}
                          aria-label="Previous"
                        >
                          <img src={grayArrowIcon} alt="Previous" className="w-full h-full" />
                        </button>
                        <button
                          className="rounded-full flex items-center justify-center transition-all duration-200"
                          style={{
                            width: '16px',
                            height: '16px'
                          }}
                          aria-label="Next"
                        >
                          <img src={blackArrowIcon} alt="Next" className="w-full h-full" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={`flex items-center justify-between ${isMobile ? 'mb-0' : 'mb-6'}`}>
                    <h3 style={{
                      fontFamily: 'Bricolage Grotesque, sans-serif',
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#000000'
                    }}>
                      Requests near you
                    </h3>
                    <div className="flex items-center gap-2">
                      {renderCountryFilterButton('relative', 'filtered')}
                      {renderPriceFilterButton('relative', 'filtered')}
                    </div>
                  </div>
                )}
                <div className="relative">
                  {/* Fade effect on the right - Desktop only */}
                  {!isMobile && (
                    <div
                      className="absolute top-0 right-0 bottom-0 w-32 pointer-events-none z-10"
                      style={{
                        background: 'linear-gradient(to left, white 0%, rgba(255, 255, 255, 0.8) 30%, transparent 100%)',
                        height: '100%'
                      }}
                    />
                  )}
                  <div
                    className={isMobile ? "flex gap-4 mb-2 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6"}
                    style={isMobile ? {
                      padding: '12px 0 8px 0',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch'
                    } : {}}
                  >
                    {nearYouRequests.length > 0 ? (
                      nearYouRequests.map((req, index) => {
                        const country = getProductCountry(req.origin);
                        const cardData = {
                          title: req.productName,
                          country: country.name,
                          flag: country.flag,
                          location: req.sellerLocation || 'Location not specified',
                          description: req.description || '',
                          price: req.minPrice || 0,
                          request: req
                        };
                        return (
                          <React.Fragment key={`near-${req.id}`}>
                            {renderRequestCard(false, `near-${index}`, cardData)}
                          </React.Fragment>
                        );
                      })
                    ) : (
                      renderRequestsEmptyState({
                        title: 'No requests around you',
                        description: 'Explore other requests from different locations',
                        wrapperClassName: 'col-span-full',
                        wrapperStyle: { padding: isMobile ? '48px 16px' : '64px 16px' }
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Pending requests Section */}
              <div className="mb-12">
                {isMobile ? (
                  <>
                    <h3 style={{
                      fontFamily: 'Bricolage Grotesque, sans-serif',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#000000',
                      marginBottom: '4px'
                    }}>
                      Pending requests
                    </h3>
                    <div className={`flex items-center justify-between ${isMobile ? 'mb-0' : 'mb-6'}`}>
                      <div className="flex items-center gap-2" style={{ marginLeft: isMobile ? '-8px' : '0' }}>
                        {renderCountryFilterButton('relative', 'pending')}
                        {renderPriceFilterButton('relative', 'pending')}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="rounded-full flex items-center justify-center transition-all duration-200"
                          style={{
                            width: '16px',
                            height: '16px'
                          }}
                          aria-label="Previous"
                        >
                          <img src={grayArrowIcon} alt="Previous" className="w-full h-full" />
                        </button>
                        <button
                          className="rounded-full flex items-center justify-center transition-all duration-200"
                          style={{
                            width: '16px',
                            height: '16px'
                          }}
                          aria-label="Next"
                        >
                          <img src={blackArrowIcon} alt="Next" className="w-full h-full" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={`flex items-center justify-between ${isMobile ? 'mb-0' : 'mb-6'}`}>
                    <h3 style={{
                      fontFamily: 'Bricolage Grotesque, sans-serif',
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#000000'
                    }}>
                      Pending requests
                    </h3>
                    <div className="flex items-center gap-2">
                      {renderCountryFilterButton('relative', 'pending')}
                      {renderPriceFilterButton('relative', 'pending')}
                    </div>
                  </div>
                )}
                <div className="relative">
                  {/* Fade effect on the right - Desktop only */}
                  {!isMobile && (
                    <div
                      className="absolute top-0 right-0 bottom-0 w-32 pointer-events-none z-10"
                      style={{
                        background: 'linear-gradient(to left, white 0%, rgba(255, 255, 255, 0.8) 30%, transparent 100%)',
                        height: '100%'
                      }}
                    />
                  )}
                  <div
                    className={isMobile ? "flex gap-4 mb-2 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6"}
                    style={isMobile ? {
                      padding: '12px 0 8px 0',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch'
                    } : {}}
                  >
                    {pendingRequests.length > 0 ? (
                      pendingRequests.map((req, index) => {
                        const country = getProductCountry(req.origin);
                        const cardData = {
                          title: req.productName,
                          country: country.name,
                          flag: country.flag,
                          location: req.sellerLocation || 'Location not specified',
                          description: req.description || '',
                          price: req.minPrice || 0,
                          isPending: true,
                          request: req
                        };
                        return (
                          <React.Fragment key={`pending-${req.id}`}>
                            {renderRequestCard(true, `pending-${index}`, cardData)}
                          </React.Fragment>
                        );
                      })
                    ) : (
                      renderRequestsEmptyState({
                        title: 'No pending requests',
                        description: 'All requests have been processed',
                        wrapperClassName: 'col-span-full',
                        wrapperStyle: { padding: isMobile ? '48px 16px' : '64px 16px' }
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* All requests Section */}
              <div className="mb-12">
                {isMobile ? (
                  <>
                    <h3 style={{
                      fontFamily: 'Bricolage Grotesque, sans-serif',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#000000',
                      marginBottom: '4px'
                    }}>
                      All requests
                    </h3>
                    <div className={`flex items-center justify-between ${isMobile ? 'mb-0' : 'mb-6'}`}>
                      <div className="flex items-center gap-2" style={{ marginLeft: isMobile ? '-8px' : '0' }}>
                        {renderCountryFilterButton('relative', 'all')}
                        {renderPriceFilterButton('relative', 'all')}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="rounded-full flex items-center justify-center transition-all duration-200"
                          style={{
                            width: '16px',
                            height: '16px'
                          }}
                          aria-label="Previous"
                        >
                          <img src={grayArrowIcon} alt="Previous" className="w-full h-full" />
                        </button>
                        <button
                          className="rounded-full flex items-center justify-center transition-all duration-200"
                          style={{
                            width: '16px',
                            height: '16px'
                          }}
                          aria-label="Next"
                        >
                          <img src={blackArrowIcon} alt="Next" className="w-full h-full" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={`flex items-center justify-between ${isMobile ? 'mb-0' : 'mb-6'}`}>
                    <h3 style={{
                      fontFamily: 'Bricolage Grotesque, sans-serif',
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#000000'
                    }}>
                      All requests
                    </h3>
                    <div className="flex items-center gap-2">
                      {renderCountryFilterButton('relative', 'all')}
                      {renderPriceFilterButton('relative', 'all')}
                    </div>
                  </div>
                )}
                <div className="relative">
                  {/* Fade effect on the right - Desktop only */}
                  {!isMobile && (
                    <div
                      className="absolute top-0 right-0 bottom-0 w-32 pointer-events-none z-10"
                      style={{
                        background: 'linear-gradient(to left, white 0%, rgba(255, 255, 255, 0.8) 30%, transparent 100%)',
                        height: '100%'
                      }}
                    />
                  )}
                  <div
                    className={isMobile ? "flex gap-4 mb-2 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6"}
                    style={isMobile ? {
                      padding: '12px 0 8px 0',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch'
                    } : {}}
                  >
                    {requests.length > 0 ? (
                      requests.map((req, index) => {
                        const country = getProductCountry(req.origin);
                        const isPending = req.status ? (req.status.toUpperCase() === 'PENDING' || req.status.toLowerCase() === 'pending') : false;
                        const cardData = {
                          title: req.productName,
                          country: country.name,
                          flag: country.flag,
                          location: req.sellerLocation || 'Location not specified',
                          description: req.description || '',
                          price: req.minPrice || 0,
                          isPending: isPending,
                          request: req
                        };
                        return (
                          <React.Fragment key={`all-${req.id}`}>
                            {renderRequestCard(isPending, `all-${index}`, cardData)}
                          </React.Fragment>
                        );
                      })
                    ) : (
                      renderRequestsEmptyState({
                        title: 'No requests found',
                        description: 'Be the first to create a request',
                        wrapperStyle: { padding: isMobile ? '48px 16px' : '64px 16px' }
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </div>
      </section>

      {showShareModal && currentRequestForShare && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
            onClick={() => setShowShareModal(false)}
          />

          {/* Share Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="bg-white rounded-2xl shadow-xl relative max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
              style={{ padding: '32px 24px' }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {/* Heading */}
              <h3 className="text-xl font-semibold text-center mb-3 mt-4" style={{ color: '#212121', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                Share this request
              </h3>
              {/* Description */}
              <p className="text-xs text-center mb-6" style={{ color: '#B0B0B0' }}>
                Spread the word! Share this request with others who might be able to help.
              </p>
              {/* Copy Link Section */}
              <div className="flex items-center gap-3 mb-6">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/requests/${currentRequestForShare.id}`}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium focus:outline-none"
                  style={{ backgroundColor: '#F4F4F4', color: '#6A6A6A', border: 'none' }}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/requests/${currentRequestForShare.id}`);
                    // Show a toast or alert that link was copied
                    alert('Link copied to clipboard!');
                  }}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#000000' }}
                >
                  Copy link
                </button>
              </div>
              {/* Share To Section */}
              <div>
                <p className="text-sm mb-4 text-center" style={{ color: '#6A6A6A' }}>Share to</p>
                <div className="flex items-center justify-center space-x-6">
                  <button
                    className="flex flex-col items-center space-y-2"
                    onClick={() => {
                      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/requests/${currentRequestForShare.id}`)}`;
                      window.open(url, '_blank', 'width=600,height=500');
                    }}
                  >
                    <img src={fbIcon} alt="Facebook" className="w-10 h-10" />
                    <span className="text-xs" style={{ color: '#B0B0B0' }}>Facebook</span>
                  </button>
                  <button
                    className="flex flex-col items-center space-y-2"
                    onClick={() => {
                      const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(`${window.location.origin}/requests/${currentRequestForShare.id}`)}&text=${encodeURIComponent(`Check out this request: ${currentRequestForShare.productName}`)}`;
                      window.open(url, '_blank', 'width=600,height=500');
                    }}
                  >
                    <img src={xIcon} alt="X" className="w-10 h-10" />
                    <span className="text-xs" style={{ color: '#B0B0B0' }}>X</span>
                  </button>
                  <button
                    className="flex flex-col items-center space-y-2"
                    onClick={() => {
                      const url = `https://wa.me/?text=${encodeURIComponent(`Check out this request: ${currentRequestForShare.productName} - ${window.location.origin}/requests/${currentRequestForShare.id}`)}`;
                      window.open(url, '_blank', 'width=600,height=500');
                    }}
                  >
                    <img src={zapIcon} alt="WhatsApp" className="w-10 h-10" />
                    <span className="text-xs" style={{ color: '#B0B0B0' }}>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Request Detail Modal */}
      {showRequestModal && selectedCard && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: '#0000001A' }}
            onClick={() => {
              setShowRequestModal(false);
              setSelectedCard(null);
            }}
          />

          {/* Modal */}
          {isMobile ? (
            // Mobile: Bottom sheet with original form
            <div
              className="fixed inset-0 z-50 flex items-end justify-center p-4"
              onClick={() => {
                setShowRequestModal(false);
                setSelectedCard(null);
              }}
            >
              <div
                className="bg-white relative w-full"
                style={{
                  borderRadius: '30px',
                  boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                  maxWidth: '420px',
                  maxHeight: '90vh',
                  overflowY: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="pt-8 px-5 pb-8 relative">
                  {/* Close Button */}
                  <button
                    onClick={() => {
                      setShowRequestModal(false);
                      setSelectedCard(null);
                    }}
                    className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center"
                  >
                    <img
                      src={closeIcon}
                      alt="Close"
                      className="w-4 h-4"
                    />
                  </button>

                  {/* Request Badge - Centered */}
                  <div className="flex justify-center mb-3">
                    <span
                      style={{
                        fontSize: '10px',
                        color: '#BABABA',
                        border: '1.5px solid #E1E1E1',
                        borderRadius: '999px',
                        padding: '2px 12px',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      Request
                    </span>
                  </div>

                  {/* Product Name */}
                  <h2
                    className="text-lg text-center mb-2"
                    style={{ color: '#212121', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600 }}
                  >
                    {selectedCard.productName}
                  </h2>

                  {/* Description */}
                  <p
                    className="text-xs text-center mb-5"
                    style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif', lineHeight: '1.5' }}
                  >
                    {selectedCard.description || 'No description provided'}
                  </p>

                  {/* Three Badges - Centered */}
                  <div className="flex flex-col items-center gap-2 mb-5">
                    {/* Location Badge */}
                    <div
                      className="flex items-center justify-center gap-1 px-2 py-1"
                      style={{ backgroundColor: '#F0F8FE', borderRadius: '6px', width: 'fit-content' }}
                    >
                      <img
                        src={locationIcon}
                        alt="Location"
                        className="w-3 h-3"
                        style={{ filter: 'brightness(0) saturate(100%) invert(64%) sepia(52%) saturate(555%) hue-rotate(176deg) brightness(97%) contrast(92%)' }}
                      />
                      <span style={{ fontSize: '12px', color: '#64B5F6', fontWeight: 400 }}>
                        {formatCityDisplay(selectedCard.sellerLocation || '') || 'Location not specified'}
                      </span>
                    </div>

                    {/* Price and Country Badges */}
                    <div className="flex gap-2 justify-center">
                      {/* Price Badge */}
                      <div
                        className="flex items-center gap-1.5 px-3 py-1.5"
                        style={{ backgroundColor: '#F0F8FE', borderRadius: '6px' }}
                      >
                        <img
                          src={moneyIcon}
                          alt="Money"
                          className="w-3 h-3"
                          style={{ filter: 'brightness(0) saturate(100%) invert(64%) sepia(52%) saturate(555%) hue-rotate(176deg) brightness(97%) contrast(92%)' }}
                        />
                        <span style={{ fontSize: '12px', color: '#64B5F6', fontWeight: 400 }}>
                          {formatPriceRange(selectedCard.minPrice, selectedCard.maxPrice, selectedCard.currency)}
                        </span>
                      </div>

                      {/* Country Badge */}
                      <div
                        className="flex items-center gap-1.5 px-3 py-1.5"
                        style={{ backgroundColor: '#F0F8FE', borderRadius: '6px' }}
                      >
                        {(() => {
                          const country = getProductCountry(selectedCard.origin);
                          return (
                            <>
                              <img
                                src={country.flag}
                                alt={country.name}
                                className="w-4 h-4 object-cover rounded-full"
                              />
                              <span style={{ fontSize: '12px', color: '#64B5F6', fontWeight: 400 }}>{country.name}</span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Gray Divider */}
                  <div style={{ width: '100%', height: '1px', backgroundColor: '#E9E9E9', marginBottom: '12px' }}></div>

                  {/* Seller Info Section */}
                  <div className="flex flex-col">
                    {/* Avatar and Info */}
                    <div className="flex items-center gap-2.5 mb-3">
                      {/* Avatar */}
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: '#F7C9B0', border: '2px solid #939393' }}
                      >
                        {selectedCard.user && selectedCard.user.profileImage ? (
                          <img
                            src={selectedCard.user.profileImage}
                            alt={selectedCard.user.firstName || 'User'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                          />
                        ) : (
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#8B5E3C" />
                            <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#8B5E3C" />
                          </svg>
                        )}
                      </div>

                      {/* Name and Rating */}
                      <div className="flex flex-col">
                        <span style={{ fontSize: '13px', color: '#212121', fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                          {selectedCard.user ? `${selectedCard.user.firstName || ''} ${selectedCard.user.lastName || ''}`.trim() || 'User' : 'User'}
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const rating = selectedCard.user?.rating || 0;
                            const filledStars = Math.floor(rating);
                            const hasHalfStar = rating % 1 >= 0.5;
                            const isFilled = star <= filledStars || (star === filledStars + 1 && hasHalfStar);
                            return (
                              <svg
                                key={star}
                                width="11"
                                height="11"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6 0L7.5 4.5L12 4.5L8.25 7.5L9.75 12L6 9L2.25 12L3.75 7.5L0 4.5L4.5 4.5L6 0Z"
                                  fill={isFilled ? '#F9A825' : '#B0B0B0'}
                                  style={{ strokeLinejoin: 'round', strokeLinecap: 'round' }}
                                />
                              </svg>
                            );
                          })}
                          <span style={{ fontSize: '11px', color: '#6A6A6A', fontFamily: 'Poppins, sans-serif', marginLeft: '4px' }}>
                            {selectedCard.user?.rating ? selectedCard.user.rating.toFixed(1) : '0.0'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Message Buyer / Manage Request Button - Below ratings */}
                    <button
                      className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg w-full"
                      style={{
                        backgroundColor: '#F9A825',
                        color: '#FFFFFF',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '12px',
                        fontWeight: 400,
                        border: 'none',
                        cursor: isManagingRequest ? 'not-allowed' : 'pointer',
                        height: 'auto',
                        opacity: isManagingRequest ? 0.7 : 1
                      }}
                      onClick={() => {
                        if (!isManagingRequest && selectedCard) {
                          handleManageRequest(selectedCard);
                          setShowRequestModal(false);
                          setSelectedCard(null);
                        }
                      }}
                      disabled={isManagingRequest}
                    >
                      {isManagingRequest ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          {!user || (selectedCard && selectedCard.userId !== user.id) ? (
                            <>
                              <img
                                src={basketIcon}
                                alt="Cart"
                                className="w-4 h-4"
                                style={{ filter: 'brightness(0) invert(1)' }}
                              />
                              <span>Message Buyer</span>
                            </>
                          ) : (
                            <>
                              <img
                                src={requestIcon}
                                alt="Manage"
                                className="w-4 h-4"
                                style={{ filter: 'brightness(0) invert(1)' }}
                              />
                              <span>Manage Request</span>
                            </>
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Drag Indicator at far bottom */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  paddingBottom: '8px',
                  paddingTop: '4px'
                }}>
                  <div style={{
                    width: '80px',
                    height: '4px',
                    backgroundColor: '#D9D9D9',
                    borderRadius: '2px'
                  }} />
                </div>
              </div>
            </div>
          ) : (
            // Desktop: Centered modal
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => {
                setShowRequestModal(false);
                setSelectedCard(null);
              }}
            >
              <div
                className="bg-white rounded-[30px] pt-8 sm:pt-10 px-5 sm:px-6 relative max-w-sm w-full pb-8"
                style={{ boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setSelectedCard(null);
                  }}
                  className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center"
                >
                  <img
                    src={closeIcon}
                    alt="Close"
                    className="w-4 h-4"
                  />
                </button>

                {/* Request Badge - Centered */}
                <div className="flex justify-center mb-3">
                  <span
                    style={{
                      fontSize: '10px',
                      color: '#BABABA',
                      border: '1.5px solid #E1E1E1',
                      borderRadius: '999px',
                      padding: '2px 12px',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    Request
                  </span>
                </div>

                {/* Product Name */}
                <h2
                  className="text-lg text-center mb-2"
                  style={{ color: '#212121', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600 }}
                >
                  {selectedCard.productName}
                </h2>

                {/* Description */}
                <p
                  className="text-xs text-center mb-5"
                  style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif', lineHeight: '1.5' }}
                >
                  {selectedCard.description || 'No description provided'}
                </p>

                {/* Three Badges - Centered */}
                <div className="flex flex-col items-center gap-2 mb-5">
                  {/* Location Badge */}
                  <div
                    className="flex items-center justify-center gap-1 px-2 py-1"
                    style={{ backgroundColor: '#F0F8FE', borderRadius: '6px', width: 'fit-content' }}
                  >
                    <img
                      src={locationIcon}
                      alt="Location"
                      className="w-3 h-3"
                      style={{ filter: 'brightness(0) saturate(100%) invert(64%) sepia(52%) saturate(555%) hue-rotate(176deg) brightness(97%) contrast(92%)' }}
                    />
                    <span style={{ fontSize: '12px', color: '#64B5F6', fontWeight: 400 }}>
                      {formatCityDisplay(selectedCard.sellerLocation || '') || 'Location not specified'}
                    </span>
                  </div>

                  {/* Price and Country Badges */}
                  <div className="flex gap-2 justify-center">
                    {/* Price Badge */}
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5"
                      style={{ backgroundColor: '#F0F8FE', borderRadius: '6px' }}
                    >
                      <img
                        src={moneyIcon}
                        alt="Money"
                        className="w-3 h-3"
                        style={{ filter: 'brightness(0) saturate(100%) invert(64%) sepia(52%) saturate(555%) hue-rotate(176deg) brightness(97%) contrast(92%)' }}
                      />
                      <span style={{ fontSize: '12px', color: '#64B5F6', fontWeight: 400 }}>
                        {formatPriceRange(selectedCard.minPrice, selectedCard.maxPrice, selectedCard.currency)}
                      </span>
                    </div>

                    {/* Country Badge */}
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5"
                      style={{ backgroundColor: '#F0F8FE', borderRadius: '6px' }}
                    >
                      {(() => {
                        const country = getProductCountry(selectedCard.origin);
                        return (
                          <>
                            <img
                              src={country.flag}
                              alt={country.name}
                              className="w-4 h-4 object-cover rounded-full"
                            />
                            <span style={{ fontSize: '12px', color: '#64B5F6', fontWeight: 400 }}>{country.name}</span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Gray Divider */}
                <div style={{ width: '100%', height: '1px', backgroundColor: '#E9E9E9', marginBottom: '12px' }}></div>

                {/* Seller Info Section */}
                <div className="flex items-center justify-between">
                  {/* Avatar and Info */}
                  <div className="flex items-center gap-2.5">
                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: '#F7C9B0', border: '2px solid #939393' }}
                    >
                      {selectedCard.user && selectedCard.user.profileImage ? (
                        <img
                          src={selectedCard.user.profileImage}
                          alt={selectedCard.user.firstName || 'User'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                        />
                      ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#8B5E3C" />
                          <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#8B5E3C" />
                        </svg>
                      )}
                    </div>

                    {/* Name and Rating */}
                    <div className="flex flex-col">
                      <span style={{ fontSize: '13px', color: '#212121', fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                        {selectedCard.user ? `${selectedCard.user.firstName || ''} ${selectedCard.user.lastName || ''}`.trim() || 'User' : 'User'}
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const rating = selectedCard.user?.rating || 0;
                          const filledStars = Math.floor(rating);
                          const hasHalfStar = rating % 1 >= 0.5;
                          const isFilled = star <= filledStars || (star === filledStars + 1 && hasHalfStar);
                          return (
                            <svg
                              key={star}
                              width="11"
                              height="11"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6 0L7.5 4.5L12 4.5L8.25 7.5L9.75 12L6 9L2.25 12L3.75 7.5L0 4.5L4.5 4.5L6 0Z"
                                fill={isFilled ? '#F9A825' : '#B0B0B0'}
                                style={{ strokeLinejoin: 'round', strokeLinecap: 'round' }}
                              />
                            </svg>
                          );
                        })}
                        <span style={{ fontSize: '11px', color: '#6A6A6A', fontFamily: 'Poppins, sans-serif', marginLeft: '4px' }}>
                          {selectedCard.user?.rating ? selectedCard.user.rating.toFixed(1) : '0.0'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message Buyer / Manage Request Button */}
                  {!user || (selectedCard && selectedCard.userId !== user.id) ? (
                    <button
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                      style={{
                        backgroundColor: '#F9A825',
                        color: '#FFFFFF',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '12px',
                        fontWeight: 400,
                        border: 'none',
                        cursor: 'pointer',
                        height: 'auto'
                      }}
                      onClick={() => {
                        if (selectedCard) {
                          handleManageRequest(selectedCard);
                          setShowRequestModal(false);
                          setSelectedCard(null);
                        }
                      }}
                    >
                      <img
                        src={basketIcon}
                        alt="Cart"
                        className="w-4 h-4"
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                      <span>Message Buyer</span>
                    </button>
                  ) : (
                    <button
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                      style={{
                        backgroundColor: '#F9A825',
                        color: '#FFFFFF',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '12px',
                        fontWeight: 400,
                        border: 'none',
                        cursor: 'pointer',
                        height: 'auto'
                      }}
                      onClick={() => {
                        if (selectedCard) {
                          handleManageRequest(selectedCard);
                          setShowRequestModal(false);
                          setSelectedCard(null);
                        }
                      }}
                    >
                      <img
                        src={requestIcon}
                        alt="Manage"
                        className="w-4 h-4"
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                      <span>Manage Request</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Requests;