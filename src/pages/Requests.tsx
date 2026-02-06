import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import arrowLeftIcon from '../assets/images/pre/arrow-left.svg';
import earthIcon from '../assets/images/pre/earth.svg';
import arrowDownIcon from '../assets/images/pre/arrow-down.svg';
import buyerIcon from '../assets/images/pre/buyer.svg';
import locationIcon from '../assets/images/pre/PL.svg';
import moneyIcon from '../assets/images/pre/money.svg';
import bellIcon from '../assets/images/pre/bm.svg';
import shareIcon from '../assets/images/pre/Share.svg';
import requestIcon from '../assets/images/pre/request.svg';
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
import LocationAutocomplete from '../components/LocationAutocomplete';

const Requests: React.FC = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 48;
  const paginationNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [moreOptionsOpenFor, setMoreOptionsOpenFor] = useState<string | null>(null);
  const moreOptionsRef = useRef<HTMLDivElement>(null);
  const [selectedCard, setSelectedCard] = useState<{ title: string; country: string; flag: string; location: string; description: string } | null>(null);
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
    { label: 'Less than 10 USD', value: 'less-than-10' },
    { label: '10 ~ 50 USD', value: '10-50' },
    { label: '50 ~ 100 USD', value: '50-100' },
    { label: '100 ~ 200 USD', value: '100-200' },
    { label: 'More than 200 USD', value: 'more-than-200' }
  ];

  const africanCountries = [
    { name: 'Algeria', code: 'dz', flag: 'https://flagcdn.com/w20/dz.png' },
    { name: 'Angola', code: 'ao', flag: 'https://flagcdn.com/w20/ao.png' },
    { name: 'Benin', code: 'bj', flag: 'https://flagcdn.com/w20/bj.png' },
    { name: 'Burkina Faso', code: 'bf', flag: 'https://flagcdn.com/w20/bf.png' },
    { name: 'Cameroon', code: 'cm', flag: 'https://flagcdn.com/w20/cm.png' },
    { name: 'Chad', code: 'td', flag: 'https://flagcdn.com/w20/td.png' },
    { name: 'Congo', code: 'cg', flag: 'https://flagcdn.com/w20/cg.png' },
    { name: 'Egypt', code: 'eg', flag: 'https://flagcdn.com/w20/eg.png' },
    { name: 'Equatorial Guinea', code: 'gq', flag: 'https://flagcdn.com/w20/gq.png' },
    { name: 'Ethiopia', code: 'et', flag: 'https://flagcdn.com/w20/et.png' },
    { name: 'Gabon', code: 'ga', flag: 'https://flagcdn.com/w20/ga.png' },
    { name: 'Ghana', code: 'gh', flag: 'https://flagcdn.com/w20/gh.png' },
    { name: 'Ivory Coast', code: 'ci', flag: 'https://flagcdn.com/w20/ci.png' },
    { name: 'Kenya', code: 'ke', flag: 'https://flagcdn.com/w20/ke.png' },
    { name: 'Mali', code: 'ml', flag: 'https://flagcdn.com/w20/ml.png' },
    { name: 'Morocco', code: 'ma', flag: 'https://flagcdn.com/w20/ma.png' },
    { name: 'Niger', code: 'ne', flag: 'https://flagcdn.com/w20/ne.png' },
    { name: 'Nigeria', code: 'ng', flag: 'https://flagcdn.com/w20/ng.png' },
    { name: 'Senegal', code: 'sn', flag: 'https://flagcdn.com/w20/sn.png' },
    { name: 'South Africa', code: 'za', flag: 'https://flagcdn.com/w20/za.png' },
    { name: 'Tanzania', code: 'tz', flag: 'https://flagcdn.com/w20/tz.png' },
    { name: 'Tunisia', code: 'tn', flag: 'https://flagcdn.com/w20/tn.png' },
    { name: 'Uganda', code: 'ug', flag: 'https://flagcdn.com/w20/ug.png' },
    { name: 'Zambia', code: 'zm', flag: 'https://flagcdn.com/w20/zm.png' }
  ];

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
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target as Node)) {
        setMoreOptionsOpenFor(null);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setOpenFilterDropdown(null);
      }
      if (priceDropdownRef.current && !priceDropdownRef.current.contains(event.target as Node)) {
        setOpenPriceDropdown(null);
      }
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter location suggestions based on search query
  const getFilteredSuggestions = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return locationSuggestions.filter(location => 
      location.toLowerCase().startsWith(query) || 
      location.toLowerCase().includes(query)
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

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      setShowSearchSuggestions(true);
    } else {
      setShowSearchSuggestions(false);
      setIsSearchActive(false);
    }
  };

  const renderPagination = () => (
    <div className={`flex flex-col ${isMobile ? 'items-center gap-2' : 'lg:flex-row items-center gap-6'} mt-12 ${isMobile ? 'mb-8' : 'mb-16'} w-full`}>
      <div className={`flex-1 flex justify-center w-full ${isMobile ? '' : ''}`}>
        <div className={`flex items-center ${isMobile ? 'gap-4' : 'gap-4'}`} style={isMobile ? {} : { marginLeft: '80px' }}>
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

          <div className="flex items-center" style={{ gap: isMobile ? '12px' : '24px' }}>
            {paginationNumbers.map((page) => (
              <span
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontSize: isMobile ? '12px' : '16px',
                  color: page === currentPage ? '#212121' : '#B0B0B0',
                  cursor: 'pointer'
                }}
              >
                {page}
              </span>
            ))}

            <span style={{ color: '#B0B0B0', fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: isMobile ? '12px' : '16px' }}>…</span>
            <span 
              onClick={() => setCurrentPage(totalPages)}
              style={{ 
                color: '#B0B0B0', 
                fontFamily: 'Bricolage Grotesque, sans-serif', 
                fontSize: isMobile ? '12px' : '16px',
                cursor: 'pointer'
              }}
            >
              {totalPages}
            </span>
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

      {/* Go to section */}
      <div className={`flex items-center ${isMobile ? 'gap-3 justify-center' : 'gap-2'}`}>
        <span style={{ color: '#939393', fontFamily: 'Poppins, sans-serif', fontSize: isMobile ? '11px' : '12px' }}>Go to :</span>
        <input
          type="text"
          placeholder="e.g 40"
          style={{
            border: '1px solid #BABABA',
            borderRadius: '8px',
            padding: isMobile ? '5px 9px' : '6px 10px',
            fontFamily: 'Bricolage Grotesque, sans-serif',
            fontSize: isMobile ? '11px' : '12px',
            color: '#D9D9D9',
            width: isMobile ? '55px' : '64px',
            textAlign: 'center'
          }}
        />
        <button
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

  // Get all cards for filtering
  const getAllCards = () => {
    return [
      { title: 'Premium Coffee Beans', country: 'Ethiopia', flag: 'https://flagcdn.com/w20/et.png', location: 'New York, USA', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 75 },
      { title: 'Traditional Kente Fabric', country: 'Ghana', flag: 'https://flagcdn.com/w20/gh.png', location: 'Paris, France', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 45 },
      { title: 'Shea Butter Products', country: 'Nigeria', flag: 'https://flagcdn.com/w20/ng.png', location: 'Toronto, Canada', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 25 },
      { title: 'African Black Soap', country: 'Ghana', flag: 'https://flagcdn.com/w20/gh.png', location: 'Berlin, Germany', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 8 },
      { title: 'Baobab Powder', country: 'Senegal', flag: 'https://flagcdn.com/w20/sn.png', location: 'Sydney, Australia', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 150 },
      { title: 'Moroccan Argan Oil', country: 'Morocco', flag: 'https://flagcdn.com/w20/ma.png', location: 'Dubai, UAE', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 250 }
    ];
  };

  // Get filtered cards
  const getFilteredCards = () => {
    let filtered = getAllCards();
    
    // Apply search filter
    if (isSearchActive && searchQuery.trim()) {
      filtered = filtered.filter(card => 
        card.location.toLowerCase().includes(searchQuery.toLowerCase())
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
        switch(selectedPrice) {
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
      <div ref={sectionId === 'default' ? priceDropdownRef : null} style={{ position, zIndex: 20 }}>
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
                <path d="M9 3L3 9M3 3L9 9" stroke="#64B5F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
      <div ref={sectionId === 'default' ? filterDropdownRef : null} style={{ position, zIndex: 20 }}>
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
                <path d="M9 3L3 9M3 3L9 9" stroke="#64B5F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

  const renderRequestCard = (isPending: boolean = false, cardId: string = '', productData?: { title: string; country: string; flag: string; location: string; isPending?: boolean; description?: string }) => {
    const defaultProduct = {
      title: 'Snails from South Africa',
      country: 'South Africa',
      flag: 'https://flagcdn.com/w20/za.png',
      location: 'London, United Kingdom',
      description: 'Premium white pepper sourced from the fertile soils of Africa. Known for it'
    };
    const product = productData || defaultProduct;
    const cardIsPending = productData?.isPending !== undefined ? productData.isPending : isPending;
    
    // Different product images based on card index
    const productImages = [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=200&fit=crop', // Coffee beans
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=200&fit=crop', // Fabric/textile
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=200&fit=crop', // Shea butter
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=200&fit=crop', // Bread/bakery
      'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=400&h=200&fit=crop', // Spices
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop', // Food plate
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop', // Herbs
      'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&h=200&fit=crop', // Fruits
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=200&fit=crop'  // Nuts
    ];
    
    // Extract index from cardId to get different images
    const cardIndex = parseInt(cardId.replace(/\D/g, '')) || 0;
    const productImage = productImages[cardIndex % productImages.length];
    
    return (
    <div 
      className="cursor-pointer"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return;
        }
        setSelectedCard({
          title: product.title,
          country: product.country,
          flag: product.flag,
          location: product.location,
          description: product.description || 'Premium white pepper sourced from the fertile soils of Africa. Known for it'
        });
        setShowRequestModal(true);
      }}
      style={{ 
        backgroundColor: '#FFFFFF',
        border: '1px solid #E4E4E4',
        borderRadius: '14px',
        boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
        padding: '10px',
        width: isMobile ? '240px' : 'auto',
        flexShrink: isMobile ? 0 : 'initial',
        margin: isMobile ? '0 4px' : '0'
      }}
    >
      {/* Image Section with Status Badge and More Button */}
      <div style={{ position: 'relative', marginBottom: '10px' }}>
        <img 
          src={productImage}
          alt={product.title}
          style={{
            width: '100%',
            height: isMobile ? '120px' : '130px',
            objectFit: 'cover',
            borderRadius: '8px'
          }}
        />
        
        {/* Status Badge Row with More Options */}
        <div 
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            right: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Status Badge */}
          <div 
            style={{
              padding: '3px 10px',
              borderRadius: '6px',
              backgroundColor: cardIsPending ? '#F4F4F4' : '#F9FCFF',
              color: cardIsPending ? '#6A6A6A' : '#64B5F6',
              fontSize: '10px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500
            }}
          >
            {cardIsPending ? 'Pending' : 'Ongoing'}
          </div>
          
          {/* More Options Button */}
          <div style={{ position: 'relative' }} ref={moreOptionsRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMoreOptionsOpenFor(moreOptionsOpenFor === cardId ? null : cardId);
              }}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0'
              }}
            >
              {/* Inner circle with white border */}
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '1px solid #FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <circle cx="4" cy="8" r="1" fill="#FFFFFF"/>
                  <circle cx="8" cy="8" r="1" fill="#FFFFFF"/>
                  <circle cx="12" cy="8" r="1" fill="#FFFFFF"/>
                </svg>
              </div>
            </button>
            
            {/* More Options Dropdown */}
            {moreOptionsOpenFor === cardId && (
              <div
                style={{
                  position: 'absolute',
                  top: '34px',
                  right: '0px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E9E9E9',
                  boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                  padding: '8px',
                  minWidth: '180px',
                  zIndex: 1000
                }}
              >
                {/* Share the request */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setMoreOptionsOpenFor(null); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '12px',
                    color: '#939393',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9F9F9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <img 
                    src={shareIcon} 
                    alt="Share" 
                    style={{ 
                      width: '14px', 
                      height: '14px',
                      filter: 'brightness(0) saturate(100%) invert(63%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(93%) contrast(89%)'
                    }} 
                  />
                  Share the request
                </button>
                
                {/* Close */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setMoreOptionsOpenFor(null); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#FAFAFA',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '12px',
                    color: '#939393',
                    marginTop: '4px'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#939393" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Fade Effect at Bottom of Image */}
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50px',
            background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 40%, rgba(255,255,255,0) 100%)',
            borderRadius: '0 0 8px 8px'
          }}
        />
      </div>
      
      {/* Title */}
      <h3 style={{ 
        fontSize: isMobile ? '12px' : '13px', 
        fontWeight: 600, 
        color: '#212121',
        marginBottom: '6px',
        fontFamily: 'Bricolage Grotesque, sans-serif'
      }}>
        {product.title}
      </h3>
      
      {/* Price Range and Location Row */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px',
        marginBottom: '4px',
        flexWrap: 'wrap'
      }}>
        {/* Price Range */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <img src={moneyIcon} alt="Price" style={{ width: '10px', height: '10px', opacity: 0.6 }} />
          <span style={{ fontSize: '10px', color: '#757575', fontFamily: 'Poppins, sans-serif' }}>50 ~ 100 £</span>
        </div>
        
        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <img src={locationIcon} alt="Location" style={{ width: '10px', height: '10px', opacity: 0.6 }} />
          <span style={{ 
            fontSize: '10px', 
            color: '#757575', 
            fontFamily: 'Poppins, sans-serif'
          }}>
            London, United Kingdom
          </span>
        </div>
      </div>
      
      {/* Country of Origin */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '4px',
        marginBottom: '8px'
      }}>
        <img 
          src={product.flag} 
          alt={product.country}
          style={{ width: '14px', height: '14px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <span style={{ fontSize: '10px', color: '#757575', fontFamily: 'Poppins, sans-serif' }}>
          {product.country}
        </span>
      </div>
      
      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: '#E4E4E4', marginBottom: '8px' }} />
      
      {/* Description */}
      <p style={{ 
        fontSize: '10px', 
        color: '#757575', 
        lineHeight: '1.4',
        marginBottom: '10px',
        fontFamily: 'Poppins, sans-serif'
      }}>
        {product.description} ... <span style={{ color: '#64B5F6', cursor: 'pointer' }}>See more</span>
      </p>
      
      {/* Bottom Row: Profile and Buttons */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between'
      }}>
        {/* Profile with Rating */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* Avatar with border ring */}
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '2px solid #E4E4E4',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: '#D4A574',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <span style={{ fontSize: '14px' }}>👩🏾</span>
            </div>
          </div>
          {/* Rating badge - attached to bottom of avatar */}
          <div style={{ 
            position: 'absolute',
            bottom: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', 
            alignItems: 'center', 
            gap: '2px',
            backgroundColor: '#FFFFFF',
            padding: '1px 4px',
            borderRadius: '8px',
            border: '1px solid #F4F4F4',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <svg width="8" height="8" viewBox="0 0 20 20" fill="#F9A825">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span style={{ fontSize: '8px', color: '#212121', fontWeight: 500 }}>4.3</span>
          </div>
        </div>
        
        {/* Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* View Button */}
          <button
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              padding: '5px 8px',
              borderRadius: '6px',
              border: '1px solid #E4E4E4',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              fontSize: '9px',
              color: '#757575',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            view
          </button>
          
          {/* Contact Requester Button */}
          <button
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              padding: '5px 8px',
              borderRadius: '6px',
              border: '1px solid #F9A825',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              fontSize: '9px',
              color: '#F9A825',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            <img src={requestIcon} alt="Contact" style={{ width: '10px', height: '10px' }} />
            Contact requester
          </button>
        </div>
      </div>
    </div>
    );
  };

  // Mobile Search View
  if (showMobileSearch && isMobile) {
    const mobileSearchFiltered = mobileSearchSubmitted ? getAllCards().filter(card => {
      const query = mobileSearchQuery.toLowerCase().trim();
      return (
        card.title.toLowerCase().includes(query) ||
        card.location.toLowerCase().includes(query) ||
        card.country.toLowerCase().includes(query) ||
        (card.description && card.description.toLowerCase().includes(query))
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
              placeholder="Buyer location ?"
              autoFocus
            />
            <style>{`
              input[placeholder="Buyer location ?"]::placeholder {
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
              {mobileSearchSuggestions.map((location, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setMobileSearchQuery(location);
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
                    {location}
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
          {isNoResults && (
            <div className="text-center" style={{ padding: '48px 16px', marginTop: '32px', marginBottom: '48px' }}>
              {/* Empty Request Icon */}
              <img 
                src={emptyRequestIcon} 
                alt="No requests found" 
                className="mx-auto" 
                style={{ 
                  width: '40px', 
                  height: '40px',
                  marginBottom: '12px'
                }}
              />
              
              {/* Title */}
              <h3 style={{ 
                fontSize: '16px', 
                color: '#D9D9D9', 
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                No results
              </h3>
              
              {/* Description */}
              <p style={{ 
                fontSize: '12px', 
                color: '#B0B0B0', 
                fontFamily: 'Poppins, sans-serif', 
                maxWidth: '280px', 
                margin: '0 auto',
                marginBottom: '16px',
                lineHeight: '1.5'
              }}>
                We found nothing for your search, sorry. Please continue browsing the platform to discover more wonders.
              </p>
              
              {/* View available items link */}
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-80"
                style={{ 
                  color: '#64B5F6',
                  fontSize: '11px',
                  textDecoration: 'none',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                <span>View available items</span>
                <img 
                  src={requestArrowIcon} 
                  alt="Arrow" 
                  style={{ 
                    width: '10px',
                    height: '10px',
                    filter: 'brightness(0) saturate(100%) invert(64%) sepia(52%) saturate(555%) hue-rotate(176deg) brightness(97%) contrast(92%)'
                  }}
                />
              </Link>
            </div>
          )}

          {hasSearchResults && (
            <div className="grid grid-cols-1 gap-4">
              {mobileSearchFiltered.map((product, index) => (
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
      {/* Mobile Top Bar */}
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
                    <div className="flex-1" style={{ minWidth: 0 }}>
                      <LocationAutocomplete
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Type area or city"
                        inputStyle={{ 
                          backgroundColor: '#FFFFFF',
                          borderColor: isSearchFocused ? '#CFE8FC' : '#E4E4E4',
                          borderWidth: isSearchFocused ? 2 : 1,
                          fontSize: isMobile ? '10px' : '14px',
                          paddingLeft: '36px',
                          paddingRight: '44px',
                          padding: isMobile ? '6px 44px 6px 36px' : '10px 44px 10px 36px'
                        }}
                      />
                    </div>
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
                  <div className="flex-1" style={{ minWidth: 0 }}>
                    <LocationAutocomplete
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder="Type area or city"
                      inputStyle={{ 
                        backgroundColor: '#FFFFFF',
                        borderColor: isSearchFocused ? '#CFE8FC' : '#E4E4E4',
                        fontSize: isMobile ? '10px' : '14px',
                        paddingLeft: '36px',
                        paddingRight: '44px',
                        padding: isMobile ? '6px 44px 6px 36px' : '10px 44px 10px 36px'
                      }}
                    />
                  </div>
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
                    <div className="flex-1" style={{ minWidth: 0 }}>
                      <LocationAutocomplete
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Type area or city"
                        inputStyle={{ 
                          backgroundColor: '#FFFFFF',
                          borderColor: isSearchFocused ? '#CFE8FC' : '#E4E4E4',
                          borderWidth: isSearchFocused ? 2 : 1,
                          fontSize: isMobile ? '10px' : '14px',
                          paddingLeft: '36px',
                          paddingRight: '44px',
                          padding: isMobile ? '6px 44px 6px 36px' : '10px 44px 10px 36px'
                        }}
                      />
                    </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                  {getFilteredCards().map((product: { title: string; country: string; flag: string; location: string; description?: string; price: number }, index: number) => (
                    <div key={`search-${index}`}>
                      {renderRequestCard(false, `search-${index}`, product)}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Empty State */}
                  <div className="text-center" style={{ padding: isMobile ? '48px 16px' : '64px 16px', marginTop: isMobile ? '32px' : '48px', marginBottom: isMobile ? '48px' : '64px' }}>
                    {/* Empty Request Icon */}
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
                    
                    {/* Title */}
                    <h3 style={{ 
                      fontSize: isMobile ? '16px' : '20px', 
                      color: '#D9D9D9', 
                      fontFamily: 'Bricolage Grotesque, sans-serif',
                      fontWeight: '500',
                      marginBottom: isMobile ? '8px' : '12px'
                    }}>
                      No results
                    </h3>
                    
                    {/* Description */}
                    <p style={{ 
                      fontSize: isMobile ? '12px' : '16px', 
                      color: '#B0B0B0', 
                      fontFamily: 'Poppins, sans-serif', 
                      maxWidth: isMobile ? '280px' : '500px', 
                      margin: '0 auto',
                      marginBottom: isMobile ? '16px' : '20px',
                      lineHeight: '1.5'
                    }}>
                      We found nothing for your search, sorry. Please continue browsing the platform to discover more wonders.
                    </p>
                    
                    {/* View available items link */}
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
                  </div>

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                      {getAllCards().slice(0, 4).map((product, index) => (
                        <div key={`near-empty-${index}`}>
                          {renderRequestCard(false, `near-empty-${index}`, product)}
                        </div>
                      ))}
                    </div>
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
                      <div className="flex-1" style={{ minWidth: 0 }}>
                        <LocationAutocomplete
                          value={searchQuery}
                          onChange={setSearchQuery}
                          placeholder="Type area or city"
                          inputStyle={{ 
                            backgroundColor: '#FFFFFF',
                            borderColor: isSearchFocused ? '#CFE8FC' : '#E4E4E4',
                            fontSize: isMobile ? '10px' : '14px',
                            paddingLeft: '36px',
                            paddingRight: '44px',
                            padding: isMobile ? '6px 44px 6px 36px' : '10px 44px 10px 36px'
                          }}
                        />
                      </div>
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
                    </div>
                  </div>
                )}
              </div>

              {/* Check if no results */}
              {getFilteredCount() === 0 && (selectedCountry || selectedPrice) ? (
                <>
                  {/* Empty State */}
                  <div className="text-center" style={{ padding: isMobile ? '48px 16px' : '64px 16px', marginTop: isMobile ? '32px' : '48px', marginBottom: isMobile ? '48px' : '64px' }}>
                    {/* Empty Request Icon */}
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
                    
                    {/* Title */}
                    <h3 style={{ 
                      fontSize: isMobile ? '16px' : '20px', 
                      color: '#D9D9D9', 
                      fontFamily: 'Bricolage Grotesque, sans-serif',
                      fontWeight: '500',
                      marginBottom: isMobile ? '8px' : '12px'
                    }}>
                      No results
                    </h3>
                    
                    {/* Description */}
                    <p style={{ 
                      fontSize: isMobile ? '12px' : '16px', 
                      color: '#B0B0B0', 
                      fontFamily: 'Poppins, sans-serif', 
                      maxWidth: isMobile ? '280px' : '500px', 
                      margin: '0 auto',
                      marginBottom: isMobile ? '16px' : '20px',
                      lineHeight: '1.5'
                    }}>
                      We found nothing for your search, sorry. Please continue browsing the platform to discover more wonders.
                    </p>
                    
                    {/* View available items link */}
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
                  </div>

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
                        className={isMobile ? "flex gap-6 mb-2 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6"}
                        style={isMobile ? { 
                          padding: '12px 0 8px 0',
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none',
                          WebkitOverflowScrolling: 'touch'
                        } : {}}
                      >
                        {[
                          { title: 'Premium Coffee Beans', country: 'Ethiopia', flag: 'https://flagcdn.com/w20/et.png', location: 'New York, USA', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!' },
                          { title: 'Traditional Kente Fabric', country: 'Ghana', flag: 'https://flagcdn.com/w20/gh.png', location: 'Paris, France', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!' },
                          { title: 'Shea Butter Products', country: 'Nigeria', flag: 'https://flagcdn.com/w20/ng.png', location: 'Toronto, Canada', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!' },
                          { title: 'Organic Palm Oil', country: 'Cameroon', flag: 'https://flagcdn.com/w20/cm.png', location: 'London, UK', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!' }
                        ].map((product, index) => (
                          <React.Fragment key={index}>
                            {renderRequestCard(false, `near-empty-${index}`, product)}
                          </React.Fragment>
                        ))}
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
                      className={isMobile ? "flex gap-4 mb-2 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6"}
                      style={isMobile ? { 
                        padding: '12px 0 8px 0',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                      } : {}}
                    >
                      {[
                        { title: 'Premium Coffee Beans', country: 'Ethiopia', flag: 'https://flagcdn.com/w20/et.png', location: 'New York, USA', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 75 },
                        { title: 'Traditional Kente Fabric', country: 'Ghana', flag: 'https://flagcdn.com/w20/gh.png', location: 'Paris, France', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 45 },
                        { title: 'Shea Butter Products', country: 'Nigeria', flag: 'https://flagcdn.com/w20/ng.png', location: 'Toronto, Canada', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 25 },
                        { title: 'African Black Soap', country: 'Ghana', flag: 'https://flagcdn.com/w20/gh.png', location: 'Berlin, Germany', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 8 },
                        { title: 'Baobab Powder', country: 'Senegal', flag: 'https://flagcdn.com/w20/sn.png', location: 'Sydney, Australia', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 150 },
                        { title: 'Moroccan Argan Oil', country: 'Morocco', flag: 'https://flagcdn.com/w20/ma.png', location: 'Dubai, UAE', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 250 }
                      ]
                        .filter(card => {
                          if (selectedCountry && card.country !== selectedCountry) return false;
                          if (selectedPrice) {
                            const price = card.price || 0;
                            switch(selectedPrice) {
                              case 'less-than-10': return price < 10;
                              case '10-50': return price >= 10 && price <= 50;
                              case '50-100': return price >= 50 && price <= 100;
                              case '100-200': return price >= 100 && price <= 200;
                              case 'more-than-200': return price > 200;
                              default: return true;
                            }
                          }
                          return true;
                        })
                        .map((product, index) => (
                          <React.Fragment key={index}>
                            {renderRequestCard(false, `filtered-${index}`, product)}
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
                className={isMobile ? "flex gap-4 mb-2 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6"}
                style={isMobile ? { 
                  padding: '12px 0 8px 0',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                } : {}}
              >
                {[
                  { title: 'Premium Coffee Beans', country: 'Ethiopia', flag: 'https://flagcdn.com/w20/et.png', location: 'New York, USA', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 75 },
                  { title: 'Traditional Kente Fabric', country: 'Ghana', flag: 'https://flagcdn.com/w20/gh.png', location: 'Paris, France', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 45 },
                  { title: 'Shea Butter Products', country: 'Nigeria', flag: 'https://flagcdn.com/w20/ng.png', location: 'Toronto, Canada', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 25 },
                  { title: 'Organic Palm Oil', country: 'Cameroon', flag: 'https://flagcdn.com/w20/cm.png', location: 'London, UK', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 35 }
                ].map((product, index) => (
                  <React.Fragment key={index}>
                    {renderRequestCard(false, `near-${index}`, product)}
                  </React.Fragment>
                ))}
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
                className={isMobile ? "flex gap-4 mb-2 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6"}
                style={isMobile ? { 
                  padding: '12px 0 8px 0',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                } : {}}
              >
                {[
                  { title: 'African Black Soap', country: 'Ghana', flag: 'https://flagcdn.com/w20/gh.png', location: 'Berlin, Germany', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 8 },
                  { title: 'Baobab Powder', country: 'Senegal', flag: 'https://flagcdn.com/w20/sn.png', location: 'Sydney, Australia', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 150 },
                  { title: 'Moroccan Argan Oil', country: 'Morocco', flag: 'https://flagcdn.com/w20/ma.png', location: 'Dubai, UAE', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 250 },
                  { title: 'Hibiscus Flower Tea', country: 'Egypt', flag: 'https://flagcdn.com/w20/eg.png', location: 'Amsterdam, NL', description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 18 }
                ].map((product, index) => (
                  <React.Fragment key={index}>
                    {renderRequestCard(true, `pending-${index}`, product)}
                  </React.Fragment>
                ))}
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
                className={isMobile ? "flex gap-4 mb-2 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6"}
                style={isMobile ? { 
                  padding: '12px 0 8px 0',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                } : {}}
              >
                {[
                  { title: 'Premium Coffee Beans', country: 'Ethiopia', flag: 'https://flagcdn.com/w20/et.png', location: 'New York, USA', isPending: false, description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 75 },
                  { title: 'African Black Soap', country: 'Ghana', flag: 'https://flagcdn.com/w20/gh.png', location: 'Berlin, Germany', isPending: true, description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 8 },
                  { title: 'Traditional Kente Fabric', country: 'Ghana', flag: 'https://flagcdn.com/w20/gh.png', location: 'Paris, France', isPending: false, description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 45 },
                  { title: 'Baobab Powder', country: 'Senegal', flag: 'https://flagcdn.com/w20/sn.png', location: 'Sydney, Australia', isPending: true, description: 'Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!', price: 150 }
                ].map((product, index) => (
                  <React.Fragment key={index}>
                    {renderRequestCard(product.isPending || false, `all-${index}`, { ...product, isPending: product.isPending })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination */}
          {renderPagination()}
            </>
          )}
        </div>
      </section>

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
            <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
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
                    {selectedCard.title}
                  </h2>

                  {/* Description */}
                  <p 
                    className="text-xs text-center mb-5"
                    style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif', lineHeight: '1.5' }}
                  >
                    {selectedCard.description}
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
                      <span style={{ fontSize: '12px', color: '#64B5F6', fontWeight: 400 }}>{selectedCard.location}</span>
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
                        <span style={{ fontSize: '12px', color: '#64B5F6', fontWeight: 400 }}>50 ~ 100 USD</span>
                      </div>

                      {/* Country Badge */}
                      <div 
                        className="flex items-center gap-1.5 px-3 py-1.5"
                        style={{ backgroundColor: '#F0F8FE', borderRadius: '6px' }}
                      >
                        <img 
                          src={selectedCard.flag} 
                          alt={selectedCard.country}
                          className="w-4 h-4 object-cover rounded-full"
                        />
                        <span style={{ fontSize: '12px', color: '#64B5F6', fontWeight: 400 }}>{selectedCard.country}</span>
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
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#8B5E3C"/>
                          <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#8B5E3C"/>
                        </svg>
                      </div>

                      {/* Name and Rating */}
                      <div className="flex flex-col">
                        <span style={{ fontSize: '13px', color: '#212121', fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                          Nadine MABE
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
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
                                fill={star === 5 ? '#B0B0B0' : '#F9A825'}
                                style={{ strokeLinejoin: 'round', strokeLinecap: 'round' }}
                              />
                            </svg>
                          ))}
                          <span style={{ fontSize: '11px', color: '#6A6A6A', fontFamily: 'Poppins, sans-serif', marginLeft: '4px' }}>
                            4.3
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Message Buyer Button - Below ratings */}
                    <button
                      className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg w-full"
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
                        // Handle message buyer action
                        console.log('Message buyer clicked');
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
              // Desktop: Side-by-side layout modal
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.08)',
                    maxWidth: '680px',
                    width: '100%',
                    display: 'flex',
                    overflow: 'hidden'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Left Side - Image with padding */}
                  <div style={{ 
                    width: '300px', 
                    flexShrink: 0,
                    padding: '12px',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      borderRadius: '14px',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src="https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&h=500&fit=crop"
                        alt={selectedCard.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          minHeight: '380px'
                        }}
                      />
                      
                      {/* Ongoing Badge - matching card style */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#F9FCFF',
                        color: '#64B5F6',
                        fontSize: '10px',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500
                      }}>
                        Ongoing
                      </div>
                      
                      {/* Image Carousel Dots - product detail style */}
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        padding: '6px 10px',
                        borderRadius: '12px'
                      }}>
                        <div style={{ width: '18px', height: '5px', borderRadius: '3px', backgroundColor: '#FFFFFF' }} />
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.5)' }} />
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.5)' }} />
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.5)' }} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Side - Content */}
                  <div style={{ 
                    flex: 1, 
                    padding: '20px 24px 20px 12px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Header with Title and Close */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <h2 style={{ 
                        fontSize: '16px', 
                        fontWeight: 600, 
                        color: '#212121',
                        fontFamily: 'Bricolage Grotesque, sans-serif',
                        margin: 0
                      }}>
                        {selectedCard.title}
                      </h2>
                      <button
                        onClick={() => {
                          setShowRequestModal(false);
                          setSelectedCard(null);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                    
                    {/* Price */}
                    <div style={{ marginBottom: '2px' }}>
                      <span style={{ 
                        fontSize: '24px', 
                        fontWeight: 600, 
                        color: '#212121',
                        fontFamily: 'Bricolage Grotesque, sans-serif'
                      }}>
                        50 ~ 100 £
                      </span>
                    </div>
                    
                    {/* Avg payment subtitle */}
                    <p style={{ 
                      fontSize: '10px', 
                      color: '#939393', 
                      fontFamily: 'Poppins, sans-serif',
                      marginBottom: '14px',
                      margin: '0 0 14px 0'
                    }}>
                      Avg payment by requester
                    </p>
                    
                    {/* Location and Origin Row */}
                    <div style={{ display: 'flex', gap: '28px', marginBottom: '14px' }}>
                      {/* Requester Location */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#939393" strokeWidth="1.5">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          <span style={{ fontSize: '10px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
                            Requester location
                          </span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#212121', fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                          London, United Kingdom
                        </span>
                      </div>
                      
                      {/* Product Origin */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#939393" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="2" y1="12" x2="22" y2="12"/>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                          </svg>
                          <span style={{ fontSize: '10px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
                            Product Origin
                          </span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#212121', fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                          {selectedCard.country}
                        </span>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                      {/* Category Tag */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        padding: '4px 10px',
                        border: '1px solid #E4E4E4',
                        borderRadius: '16px'
                      }}>
                        <span style={{ fontSize: '12px' }}>🌶️</span>
                        <span style={{ fontSize: '10px', color: '#212121', fontFamily: 'Poppins, sans-serif' }}>Spices</span>
                      </div>
                      
                      {/* Available Tag */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        padding: '4px 10px',
                        border: '1px solid #E4E4E4',
                        borderRadius: '16px'
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="1.5">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <span style={{ fontSize: '10px', color: '#212121', fontFamily: 'Poppins, sans-serif' }}>Available : 1 KG</span>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div style={{ marginBottom: '14px' }}>
                      <h4 style={{ 
                        fontSize: '12px', 
                        fontWeight: 600, 
                        color: '#212121',
                        fontFamily: 'Bricolage Grotesque, sans-serif',
                        marginBottom: '6px',
                        margin: '0 0 6px 0'
                      }}>
                        Description
                      </h4>
                      <p style={{ 
                        fontSize: '11px', 
                        color: '#757575', 
                        fontFamily: 'Poppins, sans-serif',
                        lineHeight: '1.5',
                        margin: 0
                      }}>
                        Lorem ipsum dolor sit amet consectetur. Quisque netus non tincidunt duis faucibus odio sagittis lectus nibh. Magnis ut consequat magnis nullam integer.
                      </p>
                    </div>
                    
                    {/* Divider */}
                    <div style={{ height: '1px', backgroundColor: '#E9E9E9', marginBottom: '12px' }} />
                    
                    {/* Profile Section */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      {/* Avatar and Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: '#D4A574',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}>
                          <span style={{ fontSize: '18px' }}>👩🏾</span>
                        </div>
                        <div>
                          <span style={{ 
                            fontSize: '12px', 
                            color: '#212121', 
                            fontFamily: 'Poppins, sans-serif', 
                            fontWeight: 500,
                            display: 'block'
                          }}>
                            Nadine MABE
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg key={star} width="10" height="10" viewBox="0 0 20 20" fill={star === 5 ? '#D9D9D9' : '#F9A825'}>
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span style={{ fontSize: '10px', color: '#6A6A6A', fontFamily: 'Poppins, sans-serif', marginLeft: '3px' }}>
                              4.3
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* See user profile */}
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        border: '1px solid #E4E4E4',
                        borderRadius: '8px',
                        backgroundColor: '#FFFFFF',
                        cursor: 'pointer',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '10px',
                        color: '#212121'
                      }}>
                        See user profile
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                          <polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </button>
                    </div>
                    
                    {/* Bottom Buttons */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                      {/* Message Buyer Button */}
                      <button
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '10px 16px',
                          borderRadius: '10px',
                          backgroundColor: '#F9A825',
                          color: '#FFFFFF',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '12px',
                          fontWeight: 500,
                          border: 'none',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          console.log('Message buyer clicked');
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        Message Buyer
                      </button>
                      
                      {/* Share Button */}
                      <button
                        style={{
                          width: '42px',
                          height: '42px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '10px',
                          border: '1px solid #E4E4E4',
                          backgroundColor: '#FFFFFF',
                          cursor: 'pointer'
                        }}
                      >
                        <img 
                          src={shareIcon} 
                          alt="Share" 
                          style={{ width: '16px', height: '16px', opacity: 0.6 }}
                        />
                      </button>
                    </div>
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

