import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import listIcon from '../assets/images/pre/list.svg';
import gridIcon from '../assets/images/pre/grid.svg';
import arrowLeftIcon from '../assets/images/pre/arrow-left.svg';
import trashIcon from '../assets/images/pre/trash.svg';
import filterIcon from '../assets/images/pre/filter.png';
import arrowDownIcon from '../assets/images/pre/arrow-down.svg';
import moneyIcon from '../assets/images/pre/money.svg';
import bulletIcon from '../assets/images/pre/bullet.svg';
import searchNormalIcon from '../assets/images/pre/search-normal.svg';
import backArrowIcon from '../assets/images/pre/back arrow.svg';
import statusIcon from '../assets/images/pre/status.svg';

// Import product images
import a1 from '../assets/images/pre/a1.png';
import a2 from '../assets/images/pre/a2.png';
import a3 from '../assets/images/pre/a3.png';
import a4 from '../assets/images/pre/a4.png';
import a5 from '../assets/images/pre/a5.png';
import a6 from '../assets/images/pre/a6.png';

type ViewMode = 'list' | 'grid';

interface Request {
  id: string;
  title: string;
  createdAt: number;
  location: string;
  locationFlag: string;
  origin: string;
  originFlag: string;
  price: string;
  status: 'ongoing' | 'pending' | 'completed' | 'expired';
}

const statusOptions = ['Ongoing', 'Pending', 'Completed', 'Expired'] as const;
type StatusFilter = 'All Status' | (typeof statusOptions)[number];
type SortValue =
  | 'date_recent'
  | 'date_older'
  | 'name_az'
  | 'name_za'
  | 'price_high_low'
  | 'price_low_high';

interface SortOption {
  key: string;
  label: string;
  icon: string | null;
  children: Array<{
    key: string;
    label: string;
    value?: SortValue;
  }>;
}

const sortOptions: SortOption[] = [
  {
    key: 'date',
    label: 'Date of creation',
    icon: null,
    children: [
      { key: 'date_recent', label: 'Recent', value: 'date_recent' },
      { key: 'date_older', label: 'Older', value: 'date_older' }
    ]
  },
  {
    key: 'name',
    label: 'Name',
    icon: bulletIcon,
    children: [
      { key: 'name_az', label: 'A - Z', value: 'name_az' },
      { key: 'name_za', label: 'Z - A', value: 'name_za' }
    ]
  },
  {
    key: 'price',
    label: 'Price',
    icon: moneyIcon,
    children: [
      { key: 'price_high_low', label: 'More expensive', value: 'price_high_low' },
      { key: 'price_low_high', label: 'Cheaper', value: 'price_low_high' }
    ]
  }
];

const MyRequests: React.FC = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All Status');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement | null>(null);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<{ label: string; value: SortValue } | null>(null);
  const sortDropdownRef = useRef<HTMLDivElement | null>(null);
  const [moreOptionsOpenFor, setMoreOptionsOpenFor] = useState<string | null>(null);
  const moreOptionsRef = useRef<HTMLDivElement | null>(null);

  // Mock data - replace with actual data from backend
  const initialRequests: Request[] = [
    { id: '1', title: 'Snails from South Africa', createdAt: 1726560000000, location: 'London, United Kingdom', locationFlag: 'https://flagcdn.com/w20/gb.png', origin: 'South Africa', originFlag: 'https://flagcdn.com/w20/za.png', price: '50 - 100 USD', status: 'ongoing' },
    { id: '2', title: 'Artisanal Cheeses', createdAt: 1726560000000, location: 'London, United Kingdom', locationFlag: 'https://flagcdn.com/w20/gb.png', origin: 'Cameroon', originFlag: 'https://flagcdn.com/w20/cm.png', price: '40 - 90 USD', status: 'pending' },
    { id: '3', title: 'Mushrooms of the East', createdAt: 1726560000000, location: 'London, United Kingdom', locationFlag: 'https://flagcdn.com/w20/gb.png', origin: 'Ivory Coast', originFlag: 'https://flagcdn.com/w20/ci.png', price: '15 - 45 USD', status: 'completed' },
    { id: '4', title: 'Craft Beers', createdAt: 1726560000000, location: 'London, United Kingdom', locationFlag: 'https://flagcdn.com/w20/gb.png', origin: 'Benin', originFlag: 'https://flagcdn.com/w20/bj.png', price: '30 - 60 USD', status: 'expired' },
    { id: '5', title: 'Exotic Fruits', createdAt: 1726560000000, location: 'London, United Kingdom', locationFlag: 'https://flagcdn.com/w20/gb.png', origin: 'Nigeria', originFlag: 'https://flagcdn.com/w20/ng.png', price: '25 - 50 USD', status: 'ongoing' },
    { id: '6', title: 'Rare Spices', createdAt: 1726560000000, location: 'London, United Kingdom', locationFlag: 'https://flagcdn.com/w20/gb.png', origin: 'Morocco', originFlag: 'https://flagcdn.com/w20/ma.png', price: '35 - 70 USD', status: 'pending' },
  ];
  const [requests, setRequests] = useState<Request[]>(initialRequests);

  const trimmedSearchQuery = searchQuery.trim();

  const filteredRequests = useMemo(() => {
    let filtered = requests;

    if (trimmedSearchQuery) {
      const query = trimmedSearchQuery.toLowerCase();
      filtered = filtered.filter((request) =>
        request.title.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'All Status') {
      filtered = filtered.filter((request) => {
        const statusMap: Record<string, string> = {
          'Ongoing': 'ongoing',
          'Pending': 'pending',
          'Completed': 'completed',
          'Expired': 'expired'
        };
        return request.status === statusMap[statusFilter];
      });
    }

    return filtered;
  }, [requests, searchQuery, statusFilter]);

  const sortedRequests = useMemo(() => {
    const sorted = [...filteredRequests];
    if (selectedSort) {
      switch (selectedSort.value) {
        case 'date_recent':
          sorted.sort((a, b) => b.createdAt - a.createdAt);
          break;
        case 'date_older':
          sorted.sort((a, b) => a.createdAt - b.createdAt);
          break;
        case 'name_az':
          sorted.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'name_za':
          sorted.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'price_high_low':
          // Extract first number from price range for sorting
          sorted.sort((a, b) => {
            const aPrice = parseInt(a.price.match(/\d+/)?.[0] || '0');
            const bPrice = parseInt(b.price.match(/\d+/)?.[0] || '0');
            return bPrice - aPrice;
          });
          break;
        case 'price_low_high':
          sorted.sort((a, b) => {
            const aPrice = parseInt(a.price.match(/\d+/)?.[0] || '0');
            const bPrice = parseInt(b.price.match(/\d+/)?.[0] || '0');
            return aPrice - bPrice;
          });
          break;
        default:
          break;
      }
    }
    return sorted;
  }, [filteredRequests, selectedSort]);

  const hasResults = sortedRequests.length > 0;
  const isSearchActive = trimmedSearchQuery.length > 0;
  const shouldShowEmptyState = !hasResults;
  const isSearchNoResultsState = shouldShowEmptyState && isSearchActive;
  const totalRequests = requests.length;

  const toggleStatusDropdown = () => setIsStatusDropdownOpen((prev) => !prev);
  const handleStatusSelect = (option: StatusFilter) => {
    setStatusFilter(option);
    setIsStatusDropdownOpen(false);
  };
  const clearStatusFilter = () => setStatusFilter('All Status');
  const clearSelectedSort = (event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setSelectedSort(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(target)) {
        setIsStatusDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(target)) {
        setIsSortDropdownOpen(false);
      }
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(target)) {
        setMoreOptionsOpenFor(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day} / ${month} / ${year}`;
  };

  const renderStatusBadge = (status: Request['status']) => {
    const statusConfig = {
      ongoing: { text: 'Ongoing', textColor: '#64B5F6', bgColor: '#F0F8FE' },
      pending: { text: 'Pending', textColor: '#6A6A6A', bgColor: '#F4F4F4' },
      completed: { text: 'Completed', textColor: '#4CD964', bgColor: '#EDFBF0' },
      expired: { text: 'Expired', textColor: '#FF5151', bgColor: '#FFE9E9' }
    };

    const config = statusConfig[status];
    
    // Pending status should not have a dropdown arrow (based on Requests page)
    const showArrow = status !== 'pending';
    
    // For pending, the badge should be simpler (no arrow)
    if (status === 'pending') {
      return (
        <div
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md"
          style={{
            backgroundColor: config.bgColor,
            fontSize: '10px'
          }}
        >
          <span
            style={{
              color: config.textColor,
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            {config.text}
          </span>
        </div>
      );
    }
    return (
      <div
        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full"
        style={{
          backgroundColor: config.bgColor,
          fontSize: '10px'
        }}
      >
        <span
          style={{
            color: config.textColor,
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          {config.text}
        </span>
        {showArrow && (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 3L4 5L6 3" stroke={config.textColor} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    );
  };

  const renderRequestsList = () => (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E4E4E4',
        borderRadius: '30px',
        overflow: 'hidden'
      }}
    >
      {/* Table Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 0.5fr',
          gap: '16px',
          padding: '16px 20px'
        }}
      >
        {/* Column 1: Creation date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 400 }}>Creation date</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 0L7.4641 3.5H0.535898L4 0Z" stroke="#939393" strokeWidth="1" fill="none" />
            </svg>
            <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L0.535898 0.5H7.4641L4 4Z" stroke="#939393" strokeWidth="1" fill="none" />
            </svg>
          </div>
        </div>
        {/* Column 2: Product Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>Product Name</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 0L7.4641 3.5H0.535898L4 0Z" stroke="#939393" strokeWidth="1" fill="none" />
            </svg>
            <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L0.535898 0.5H7.4641L4 4Z" stroke="#939393" strokeWidth="1" fill="none" />
            </svg>
          </div>
        </div>
        {/* Column 3: Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>Location</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 0L7.4641 3.5H0.535898L4 0Z" stroke="#939393" strokeWidth="1" fill="none" />
            </svg>
            <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L0.535898 0.5H7.4641L4 4Z" stroke="#939393" strokeWidth="1" fill="none" />
            </svg>
          </div>
        </div>
        {/* Column 4: Origin Of Product */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>Origin Of Product</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 0L7.4641 3.5H0.535898L4 0Z" stroke="#939393" strokeWidth="1" fill="none" />
            </svg>
            <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L0.535898 0.5H7.4641L4 4Z" stroke="#939393" strokeWidth="1" fill="none" />
            </svg>
          </div>
        </div>
        {/* Column 5: Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>Price</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 0L7.4641 3.5H0.535898L4 0Z" stroke="#939393" strokeWidth="1" fill="none" />
            </svg>
            <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L0.535898 0.5H7.4641L4 4Z" stroke="#939393" strokeWidth="1" fill="none" />
            </svg>
          </div>
        </div>
        {/* Column 6: Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>Status</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 0L7.4641 3.5H0.535898L4 0Z" stroke="#939393" strokeWidth="1" fill="none" />
            </svg>
            <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L0.535898 0.5H7.4641L4 4Z" stroke="#939393" strokeWidth="1" fill="none" />
            </svg>
          </div>
        </div>
        {/* Column 7: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>Actions</span>
        </div>
      </div>
      {/* Header Divider */}
      <div style={{ height: '1px', backgroundColor: '#E4E4E4', margin: '0 20px' }} />

      {/* Table Rows */}
      {sortedRequests.map((request, index) => (
        <div key={request.id}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 0.5fr',
              gap: '16px',
              padding: '14px 20px',
              alignItems: 'center'
            }}
          >
            {/* Column 1: Creation date */}
            <div>
              <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                {formatDate(request.createdAt)}
              </span>
            </div>

            {/* Column 2: Product Name */}
            <div>
              <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Poppins, sans-serif' }}>
                {request.title}
              </span>
            </div>

            {/* Column 3: Location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <img
                src={request.locationFlag}
                alt={request.location}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Poppins, sans-serif' }}>
                {request.location}
              </span>
            </div>

            {/* Column 4: Origin Of Product */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <img
                src={request.originFlag}
                alt={request.origin}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Poppins, sans-serif' }}>
                {request.origin}
              </span>
            </div>

            {/* Column 5: Price */}
            <div>
              <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Poppins, sans-serif' }}>
                {request.price}
              </span>
            </div>

            {/* Column 6: Status */}
            <div>
              {renderStatusBadge(request.status)}
            </div>

            {/* Column 7: More Options */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
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
                    setMoreOptionsOpenFor(moreOptionsOpenFor === request.id ? null : request.id);
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="3" cy="6" r="1.2" fill="#B0B0B0" />
                    <circle cx="6" cy="6" r="1.2" fill="#B0B0B0" />
                    <circle cx="9" cy="6" r="1.2" fill="#B0B0B0" />
                  </svg>
                </button>
                {moreOptionsOpenFor === request.id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '26px',
                      right: 0,
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E9E9E9',
                      boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                      padding: isMobile ? '4px' : '6px',
                      minWidth: isMobile ? '130px' : '150px',
                      zIndex: 1000
                    }}
                  >
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
                        gap: isMobile ? '6px' : '8px',
                        padding: isMobile ? '6px 8px' : '8px 10px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        borderRadius: '6px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FAFAFA';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <img src={trashIcon} alt="Delete" style={{ width: isMobile ? '14px' : '16px', height: isMobile ? '14px' : '16px', flexShrink: 0, filter: 'brightness(0) saturate(100%) invert(53%) sepia(46%) saturate(3205%) hue-rotate(332deg) brightness(103%) contrast(102%)' }} />
                      <span style={{ color: '#939393', fontSize: isMobile ? '12px' : '13px', fontFamily: 'Poppins, sans-serif', lineHeight: 1, whiteSpace: 'nowrap' }}>Delete the request</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {index < sortedRequests.length - 1 && (
            <div style={{ height: '1px', backgroundColor: '#E4E4E4', margin: '0 20px' }} />
          )}
        </div>
      ))}
    </div>
  );

  const breadcrumbStyle: React.CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '13px',
    color: '#BABABA'
  };

  const toggleIconFilters = {
    active: 'brightness(0) saturate(100%) invert(60%) sepia(89%) saturate(1726%) hue-rotate(183deg) brightness(97%) contrast(92%)',
    inactive: 'brightness(0) saturate(100%) invert(46%) sepia(4%) saturate(18%) hue-rotate(355deg) brightness(96%) contrast(91%)'
  };

  return (
    <>
      {/* Header - Hidden on mobile */}
      {!isMobile && <Header />}
      <div className="bg-white min-h-screen flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {/* Mobile Header - Only visible on mobile, always shown */}
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

        <div className="flex-1">
          <div className="max-w-6xl mx-auto w-full pl-0 pr-0 py-8 flex flex-col lg:flex-row lg:justify-between gap-8">
            <div className="flex-1 lg:pl-0 lg:-ml-16">
              {/* Desktop Breadcrumb - Hidden on mobile */}
              <nav className="hidden lg:flex items-center space-x-2 text-xs sm:text-sm mb-8" style={breadcrumbStyle}>
                <img
                  src={arrowLeftIcon}
                  alt="Back"
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => navigate('/')}
                />
                <span
                  className="hover:text-[#64B5F6] cursor-pointer"
                  onClick={() => navigate('/')}
                >
                  Homepage
                </span>
                <span style={{ color: '#BABABA' }}>·</span>
                <span>Menu</span>
                <span style={{ color: '#BABABA' }}>·</span>
                <span style={{ color: '#4D4D4D' }}>My requests</span>
              </nav>

              {/* Mobile Title - Only visible on mobile, below header */}
              {isMobile && (
                <div className="lg:hidden pt-8 px-4">
                  <h1
                    className="text-base font-semibold"
                    style={{ color: '#171717', fontFamily: 'Bricolage Grotesque, sans-serif' }}
                  >
                    Manage your requests
                  </h1>
                </div>
              )}

              {/* Desktop Title - Hidden on mobile */}
              <div className="hidden lg:block">
                <h1
                  className="text-base sm:text-lg font-semibold"
                  style={{ color: '#1E1E1E', fontFamily: 'Bricolage Grotesque, sans-serif' }}
                >
                  Manage your requests
                </h1>
                <p
                  className="text-[11px] sm:text-xs mt-2 max-w-3xl leading-relaxed"
                  style={{ color: '#9C9C9C', fontFamily: 'Poppins, sans-serif' }}
                >
                  Here, you can view and manage all your requests. Whether they are ongoing, pending or completed, you have full control over your sourcing process.
                </p>
              </div>
            </div>

            {/* Search and View Toggle - Hidden on mobile */}
            {!isMobile && (
            <div className="w-full lg:w-80 flex flex-col items-end gap-3 lg:pr-0 lg:-mr-0">
              <div
                className="inline-flex items-center border mb-4 overflow-hidden"
                style={{ borderColor: '#B8DDFB', backgroundColor: '#FFFFFF', borderRadius: '8px' }}
              >
                {(['list', 'grid'] as ViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    className="flex items-center justify-center px-3 py-2 transition-colors flex-1"
                    style={{
                      backgroundColor: viewMode === mode ? '#CFE8FC' : 'transparent'
                    }}
                  >
                    <img
                      src={mode === 'list' ? listIcon : gridIcon}
                      alt={`${mode} view`}
                      style={{
                        filter: viewMode === mode ? toggleIconFilters.active : toggleIconFilters.inactive
                      }}
                    />
                  </button>
                ))}
              </div>

              <div className="w-[90%]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search a listing ?"
                  style={{
                    backgroundColor: isSearchFocused ? '#FFFFFF' : '#F1F1F1',
                    color: '#1E1E1E',
                    borderRadius: '8px',
                    border: isSearchFocused ? '1px solid #CFE8FC' : '1px solid transparent',
                    caretColor: '#64B5F6',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '13px',
                    transition: 'all 0.2s ease'
                  }}
                  className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CFE8FC] placeholder-[#B2B2B2]"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
            </div>
            )}
          </div>

          {/* Filters and Sort - Desktop */}
          {!isMobile && (
            <div className="max-w-6xl mx-auto w-full px-0 mb-6">
              <div className="flex items-center gap-4">
                {/* All requests badge */}
                <div className="flex items-center gap-2">
                  <span style={{ color: '#B0B0B0', fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>
                    All requests
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: '#F1F1F1',
                      color: '#939393',
                      fontSize: '12px',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    {totalRequests}
                  </span>
                </div>

                {/* Sort by dropdown */}
                <div ref={sortDropdownRef} style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 border rounded-lg"
                    style={{
                      backgroundColor: '#FAFAFA',
                      borderColor: '#E4E4E4',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '13px',
                      color: '#939393'
                    }}
                  >
                    <img src={filterIcon} alt="Filter" className="w-4 h-4" />
                    <span>Sort by</span>
                    <img src={arrowDownIcon} alt="Arrow" className="w-3 h-3" />
                  </button>
                  {isSortDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: '8px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #E9E9E9',
                        boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                        padding: '8px',
                        minWidth: '200px',
                        zIndex: 100
                      }}
                    >
                      {sortOptions.map((option) => (
                        <div key={option.key}>
                          <div
                            style={{
                              padding: '8px 12px',
                              color: '#939393',
                              fontSize: '12px',
                              fontFamily: 'Poppins, sans-serif',
                              fontWeight: 500
                            }}
                          >
                            {option.label}
                          </div>
                          {option.children.map((child) => (
                            <button
                              key={child.key}
                              type="button"
                              onClick={() => {
                                if (child.value) {
                                  setSelectedSort({ label: `${option.label}: ${child.label}`, value: child.value });
                                  setIsSortDropdownOpen(false);
                                }
                              }}
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '6px 12px 6px 24px',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                color: '#939393',
                                fontSize: '12px',
                                fontFamily: 'Poppins, sans-serif'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#FAFAFA';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              {child.label}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* All Status dropdown */}
                <div ref={statusDropdownRef} style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={toggleStatusDropdown}
                    className="flex items-center gap-2 px-3 py-1.5 border rounded-lg"
                    style={{
                      backgroundColor: '#FAFAFA',
                      borderColor: '#E4E4E4',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '13px',
                      color: '#939393'
                    }}
                  >
                    <img src={statusIcon} alt="Status" className="w-4 h-4" />
                    <span>All Status</span>
                    <img src={arrowDownIcon} alt="Arrow" className="w-3 h-3" />
                  </button>
                  {isStatusDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: '8px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #E9E9E9',
                        boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                        padding: '8px',
                        minWidth: '150px',
                        zIndex: 100
                      }}
                    >
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleStatusSelect(status)}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 12px',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: '#939393',
                            fontSize: '12px',
                            fontFamily: 'Poppins, sans-serif',
                            borderRadius: '8px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#FAFAFA';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="max-w-6xl mx-auto w-full px-0">
            {shouldShowEmptyState ? (
              <div className="text-center py-16">
                <p style={{ color: '#9C9C9C', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>
                  {isSearchNoResultsState
                    ? "We couldn't find any requests that match your search. Try adjusting your keywords or filters."
                    : "You don't have any requests yet."}
                </p>
              </div>
            ) : (
              viewMode === 'list' ? renderRequestsList() : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedRequests.map((request) => (
                    <div key={request.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E4E4', borderRadius: '12px', padding: '16px' }}>
                      <h3 style={{ color: '#6A6A6A', fontSize: '14px', fontFamily: 'Poppins, sans-serif', marginBottom: '8px' }}>{request.title}</h3>
                      <p style={{ color: '#939393', fontSize: '12px', fontFamily: 'Poppins, sans-serif' }}>{request.price}</p>
                      {renderStatusBadge(request.status)}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyRequests;

