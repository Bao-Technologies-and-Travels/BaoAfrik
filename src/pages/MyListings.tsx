import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import bagIcon from '../assets/images/pre/bag.svg';
import listIcon from '../assets/images/pre/list.svg';
import gridIcon from '../assets/images/pre/grid.svg';
import lilLogo from '../assets/images/pre/lil.png';
import arrowLeftIcon from '../assets/images/pre/arrow-left.svg';
import draftsIcon from '../assets/images/pre/drafts.svg';
import filterIcon from '../assets/images/pre/filter.png';
import arrowDownIcon from '../assets/images/pre/arrow-down.svg';
import activeIcon from '../assets/images/pre/active.svg';
import inactiveIcon from '../assets/images/pre/inactive.svg';
import pencilIcon from '../assets/images/pre/pencil.svg';
import moneyIcon from '../assets/images/pre/money.svg';
import bulletIcon from '../assets/images/pre/bullet.svg';
import chartIcon from '../assets/images/pre/chart.svg';

// Import product images
import a1 from '../assets/images/pre/a1.png';
import a2 from '../assets/images/pre/a2.png';
import a3 from '../assets/images/pre/a3.png';
import a4 from '../assets/images/pre/a4.png';
import a5 from '../assets/images/pre/a5.png';
import a6 from '../assets/images/pre/a6.png';
import a7 from '../assets/images/pre/a7.png';
import a8 from '../assets/images/pre/a8.png';
import a9 from '../assets/images/pre/a9.png';
import a10 from '../assets/images/pre/a10.png';
import a11 from '../assets/images/pre/a11.png';
import a12 from '../assets/images/pre/a12.png';

type ViewMode = 'list' | 'grid';

interface Listing {
  id: string;
  title: string;
  image: string;
  status: 'active' | 'inactive';
  rating: number;
  reviews: number;
  price: string;
  currency: string;
  daysLeft?: number;
  createdAt: number;
  priceValue: number;
  messages: number;
}

const statusOptions = ['Active', 'Inactive', 'Days left'] as const;
type StatusFilter = 'All Status' | (typeof statusOptions)[number];
type SortValue =
  | 'date_recent'
  | 'date_older'
  | 'name_az'
  | 'name_za'
  | 'price_high_low'
  | 'price_low_high'
  | 'reviews_more'
  | 'reviews_less'
  | 'messages_more'
  | 'messages_less';

interface SortOption {
  key: string;
  label: string;
  icon: string | null;
  children: Array<{
    key: string;
    label: string;
    value?: SortValue;
    subChildren?: Array<{ key: string; label: string; value: SortValue }>;
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
  },
  {
    key: 'commitments',
    label: 'Commitments',
    icon: chartIcon,
    children: [
      {
        key: 'reviews',
        label: 'Reviews and rates',
        subChildren: [
          { key: 'reviews_more', label: 'More reviews', value: 'reviews_more' },
          { key: 'reviews_less', label: 'Fewer reviews', value: 'reviews_less' }
        ]
      },
      {
        key: 'messages',
        label: 'Messages',
        subChildren: [
          { key: 'messages_more', label: 'More messages', value: 'messages_more' },
          { key: 'messages_less', label: 'Fewer messages', value: 'messages_less' }
        ]
      }
    ]
  }
];

const getParentKeyByValue = (value: SortValue): string | null => {
  for (const option of sortOptions) {
    for (const child of option.children) {
      if (child.value === value) return option.key;
      if (child.subChildren) {
        for (const sub of child.subChildren) {
          if (sub.value === value) return option.key;
        }
      }
    }
  }
  return null;
};

const getSortSelectionDetails = (value: SortValue) => {
  for (const option of sortOptions) {
    for (const child of option.children) {
      if (child.value === value) {
        return {
          primary: option,
          secondaryLabel: child.label,
          tertiaryLabel: null as string | null
        };
      }
      if (child.subChildren) {
        for (const sub of child.subChildren) {
          if (sub.value === value) {
            return {
              primary: option,
              secondaryLabel: child.label,
              tertiaryLabel: sub.label
            };
          }
        }
      }
    }
  }
  return null;
};

const renderSortIcon = (option: SortOption, isSelected: boolean) => {
  const color = isSelected ? '#64B5F6' : '#939393';
  if (option.icon && option.key !== 'date') {
    return (
      <img
        src={option.icon}
        alt={option.label}
        className="w-4 h-4"
        style={{
          filter: isSelected
            ? 'brightness(0) saturate(100%) invert(65%) sepia(33%) saturate(417%) hue-rotate(176deg) brightness(96%) contrast(96%)'
            : 'grayscale(100%) opacity(0.5)'
        }}
      />
    );
  }
  if (option.key === 'date') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
        <path d="M12 7v5l3 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return null;
};

const MyListings: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All Status');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement | null>(null);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [hoveredPrimarySort, setHoveredPrimarySort] = useState<string | null>(null);
  const [hoveredSecondarySort, setHoveredSecondarySort] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<{ label: string; value: SortValue } | null>(null);
  const sortDropdownRef = useRef<HTMLDivElement | null>(null);

  // Mock data - replace with actual data from backend
  const listings = useMemo<Listing[]>(() => [
    { id: '1', title: 'Bonga from Togo', image: a1, status: 'active', rating: 4.8, reviews: 88, price: 'USD 678', currency: 'USD', createdAt: 1690000000000, priceValue: 678, messages: 42 },
    { id: '2', title: 'Coconut Oil Ghana', image: a2, status: 'active', rating: 4.5, reviews: 120, price: 'USD 45', currency: 'USD', createdAt: 1690500000000, priceValue: 45, messages: 27 },
    { id: '3', title: 'Pepper from Benin', image: a3, status: 'inactive', rating: 4.2, reviews: 56, price: 'USD 32', currency: 'USD', createdAt: 1689500000000, priceValue: 32, messages: 12 },
    { id: '4', title: 'Shrimps from Lome', image: a4, status: 'active', rating: 4.9, reviews: 200, price: 'USD 67.8', currency: 'USD', daysLeft: 12, createdAt: 1691000000000, priceValue: 67.8, messages: 51 },
    { id: '5', title: 'Kinky hair Lagos', image: a5, status: 'active', rating: 4.7, reviews: 150, price: 'USD 25', currency: 'USD', createdAt: 1690800000000, priceValue: 25, messages: 19 },
    { id: '6', title: 'Gold neck Accra', image: a6, status: 'active', rating: 4.6, reviews: 95, price: 'USD 38', currency: 'USD', daysLeft: 11, createdAt: 1690200000000, priceValue: 38, messages: 33 },
    { id: '7', title: 'Baobab nuts Kano', image: a7, status: 'inactive', rating: 4.3, reviews: 78, price: 'USD 42', currency: 'USD', createdAt: 1689000000000, priceValue: 42, messages: 8 },
    { id: '8', title: 'Cowrie bracelets', image: a8, status: 'active', rating: 4.8, reviews: 165, price: 'USD 55', currency: 'USD', createdAt: 1690400000000, priceValue: 55, messages: 23 },
    { id: '9', title: 'Ebony tribal masks', image: a9, status: 'active', rating: 4.9, reviews: 210, price: 'USD 89', currency: 'USD', createdAt: 1689800000000, priceValue: 89, messages: 60 },
    { id: '10', title: 'River pepper Addis', image: a10, status: 'active', rating: 4.7, reviews: 140, price: 'USD 72', currency: 'USD', createdAt: 1690600000000, priceValue: 72, messages: 31 },
    { id: '11', title: 'Desert salt Dakar', image: a11, status: 'active', rating: 4.6, reviews: 110, price: 'USD 48', currency: 'USD', createdAt: 1689300000000, priceValue: 48, messages: 17 },
    { id: '12', title: 'Market mix Cairo', image: a12, status: 'inactive', rating: 4.4, reviews: 85, price: 'USD 35', currency: 'USD', createdAt: 1689700000000, priceValue: 35, messages: 14 },
  ], []);

  const trimmedSearchQuery = searchQuery.trim();

  const filteredListings = useMemo(() => {
    let filtered = listings;

    if (trimmedSearchQuery) {
      const query = trimmedSearchQuery.toLowerCase();
      filtered = filtered.filter((listing) =>
        listing.title.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'All Status') {
      filtered = filtered.filter((listing) => {
        if (statusFilter === 'Active') return listing.status === 'active' && typeof listing.daysLeft !== 'number';
        if (statusFilter === 'Inactive') return listing.status === 'inactive';
        if (statusFilter === 'Days left') return typeof listing.daysLeft === 'number';
        return true;
      });
    }

    return filtered;
  }, [listings, searchQuery, statusFilter]);

  const sortedListings = useMemo(() => {
    const sorted = [...filteredListings];
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
          sorted.sort((a, b) => b.priceValue - a.priceValue);
          break;
        case 'price_low_high':
          sorted.sort((a, b) => a.priceValue - b.priceValue);
          break;
        case 'reviews_more':
          sorted.sort((a, b) => b.reviews - a.reviews);
          break;
        case 'reviews_less':
          sorted.sort((a, b) => a.reviews - b.reviews);
          break;
        case 'messages_more':
          sorted.sort((a, b) => b.messages - a.messages);
          break;
        case 'messages_less':
          sorted.sort((a, b) => a.messages - b.messages);
          break;
        default:
          break;
      }
    }
    return sorted;
  }, [filteredListings, selectedSort]);

  const hasResults = sortedListings.length > 0;
  const isSearchActive = trimmedSearchQuery.length > 0;
  const shouldShowEmptyState = !hasResults;
  const isSearchNoResultsState = shouldShowEmptyState && isSearchActive;
  const totalListings = listings.length;
  const draftCount = 3;
  const currentPage = 1;
  const totalPages = 48;
  const paginationNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handlePrimaryCta = () => {
    if (isSearchNoResultsState) {
      setSearchQuery('');
      return;
    }
    navigate('/create-listing');
  };

  const primaryButtonLabel = 'Add listing';

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
    setHoveredPrimarySort(null);
    setHoveredSecondarySort(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(target)) {
        setIsStatusDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(target)) {
        setIsSortDropdownOpen(false);
        setHoveredSecondarySort(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSecondaryKeyByValue = (value: SortValue): string | null => {
    for (const option of sortOptions) {
      for (const child of option.children) {
        if (child.value === value) return child.key;
        if (child.subChildren) {
          for (const sub of child.subChildren) {
            if (sub.value === value) return child.key;
          }
        }
      }
    }
    return null;
  };

  const selectedPrimaryKey = selectedSort ? getParentKeyByValue(selectedSort.value) : null;
  const selectedSecondaryKey = selectedSort ? getSecondaryKeyByValue(selectedSort.value) : null;
  const selectedSortDetails = selectedSort ? getSortSelectionDetails(selectedSort.value) : null;
  const resolvedPrimaryKey = hoveredPrimarySort ?? selectedPrimaryKey ?? sortOptions[0].key;
  const resolvedPrimaryIndex = sortOptions.findIndex((option) => option.key === resolvedPrimaryKey);
  const secondaryOptions = sortOptions[resolvedPrimaryIndex]?.children ?? sortOptions[0].children;
  const resolvedSecondaryKey = hoveredSecondarySort ?? selectedSecondaryKey ?? secondaryOptions[0]?.key ?? null;
  const resolvedSecondaryIndex = secondaryOptions.findIndex((child) => child.key === resolvedSecondaryKey);
  const secondaryPanelWidths: Record<string, number> = {
    date: 95,
    name: 90,
    price: 150,
    commitments: 180
  };
  const secondaryPanelWidth = secondaryPanelWidths[resolvedPrimaryKey] ?? 130;
  const tertiaryPanelLeft = 210 + secondaryPanelWidth + 12;

  const renderEmptyState = () => (
    <div className="text-center py-6">
      <img
        src={bagIcon}
        alt="Empty listings"
        className="mx-auto mb-4"
        style={{ width: '40px', height: '40px' }}
      />
      <div style={{ maxWidth: '360px' }} className="mx-auto space-y-3">
        <p
          className="text-xs sm:text-sm leading-relaxed"
          style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}
        >
          {isSearchNoResultsState
            ? "We couldn't find any listings that match your search. Try adjusting your keywords or filters."
            : "You don't have any listings yet. Start showcasing your products to millions of buyers!"}
        </p>
        <button
          onClick={handlePrimaryCta}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-normal transition-colors text-sm"
          style={{
            backgroundColor: '#64B5F6',
            color: '#FFFFFF',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          {primaryButtonLabel}
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  );

  const renderListingsGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
      {sortedListings.map((listing) => (
        <div key={listing.id} className="bg-white rounded-lg overflow-hidden">
          {/* Product Image */}
          <div className="aspect-square relative overflow-hidden mb-1 sm:mb-2" style={{ borderRadius: '12px' }}>
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-full object-cover"
              style={{ borderRadius: '12px' }}
            />
          </div>

          {/* Product Content */}
          <div className="px-2 sm:px-3 pb-2 sm:pb-3">
            {/* Status Badge and More Options */}
            <div className="flex items-center justify-between mb-2">
              {/* Status Badge */}
              <div>
                {listing.daysLeft ? (
                  <div
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: '#FEF6E9',
                      fontSize: '10px'
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" fill="#FAB951" />
                      <path d="M12 7v5l3 2" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span
                      style={{
                        color: '#FAB951',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      {listing.daysLeft} Day left
                    </span>
                  </div>
                ) : (
                  <div
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: listing.status === 'active' ? '#EDFBF0' : '#FFF5F5',
                      fontSize: '10px'
                    }}
                  >
                    <img
                      src={listing.status === 'active' ? activeIcon : inactiveIcon}
                      alt={listing.status}
                      className="w-3 h-3"
                    />
                    <span
                      style={{
                        color: listing.status === 'active' ? '#70E183' : '#FF5151',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      {listing.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                )}
              </div>

              {/* More Options Button */}
              <button
                className="w-5 h-5 rounded-full border flex items-center justify-center"
                style={{
                  borderColor: '#B0B0B0',
                  borderWidth: '1.5px',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="3" cy="6" r="1.2" fill="#B0B0B0" />
                  <circle cx="6" cy="6" r="1.2" fill="#B0B0B0" />
                  <circle cx="9" cy="6" r="1.2" fill="#B0B0B0" />
                </svg>
              </button>
            </div>

            {/* Product Name */}
            <h3
              className="font-medium mb-1 text-[12px] truncate"
              style={{
                color: '#212121',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              {listing.title}
            </h3>

            {/* Ratings */}
            <div className="flex items-center gap-1 mb-2" style={{ alignItems: 'center' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#FBBC05" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginTop: '1px' }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span style={{ color: '#939393', fontSize: '10px', fontFamily: 'Poppins, sans-serif', lineHeight: '1.2' }}>
                {listing.rating}
              </span>
              <span style={{ color: '#B0B0B0', fontSize: '10px', fontFamily: 'Poppins, sans-serif', lineHeight: '1.2' }}>
                ({listing.reviews} Reviews)
              </span>
            </div>

            {/* Price and Edit Button */}
            <div className="flex items-center justify-between">
              <span
                className="font-semibold"
                style={{
                  color: '#212121',
                  fontSize: '14px',
                  fontFamily: 'Bricolage Grotesque, sans-serif'
                }}
              >
                {listing.currency} {listing.price}
              </span>
              <button
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: '#F4F4F4',
                  color: '#939393',
                  fontSize: '10px',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                <img src={pencilIcon} alt="Edit" className="w-2.5 h-2.5" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPagination = () => (
    <div className="flex flex-col lg:flex-row items-center gap-6 mt-12 mb-32 w-full">
      <div className="flex-1 flex justify-center w-full">
        <div className="flex items-center gap-4" style={{ marginLeft: '80px' }}>
          <button
            aria-label="Previous page"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: '#F0F0F0',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C8C8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="flex items-center" style={{ gap: '24px' }}>
            {paginationNumbers.map((page) => (
              <span
                key={page}
                style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontSize: '14px',
                  color: page === currentPage ? '#212121' : '#B0B0B0'
                }}
              >
                {page}
              </span>
            ))}

            <span style={{ color: '#B0B0B0', fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '14px' }}>…</span>
            <span style={{ color: '#B0B0B0', fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '14px' }}>{totalPages}</span>
          </div>

          <button
            aria-label="Next page"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: '#F0F0F0',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span style={{ color: '#939393', fontFamily: 'Poppins, sans-serif', fontSize: '12px' }}>Go to :</span>
        <input
          type="text"
          placeholder="e.g 40"
          style={{
            border: '1px solid #BABABA',
            borderRadius: '8px',
            padding: '6px 10px',
            fontFamily: 'Bricolage Grotesque, sans-serif',
            fontSize: '12px',
            color: '#D9D9D9',
            width: '64px',
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
            fontSize: '12px'
          }}
        >
          Go
        </button>
      </div>
    </div>
  );

  const badgeStyles = (filter: Exclude<StatusFilter, 'All Status'>) => {
    if (filter === 'Active') {
      return {
        bg: '#EDFBF0',
        color: '#70E183',
        icon: <img src={activeIcon} alt="active" className="w-3 h-3" />
      };
    }
    if (filter === 'Inactive') {
      return {
        bg: '#FFF5F5',
        color: '#FF5151',
        icon: <img src={inactiveIcon} alt="inactive" className="w-3 h-3" />
      };
    }
    return {
      bg: '#FEF6E9',
      color: '#FAB951',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#FAB951" />
          <path d="M12 7v5l3 2" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    };
  };

  const breadcrumbStyle = { color: '#9C9C9C', fontFamily: 'Poppins, sans-serif' };
  const toggleIconFilters = {
    active: 'brightness(0) saturate(100%) invert(64%) sepia(21%) saturate(900%) hue-rotate(173deg) brightness(96%) contrast(96%)',
    inactive: 'brightness(0) saturate(100%) invert(84%) sepia(9%) saturate(644%) hue-rotate(177deg) brightness(104%) contrast(91%)'
  };

  return (
    <>
      <Header />
      <div className="bg-white min-h-screen flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="flex-1">
          <div className="max-w-6xl mx-auto w-full pl-0 pr-0 py-8 flex flex-col lg:flex-row lg:justify-between gap-8">
            <div className="flex-1 lg:pl-0 lg:-ml-16">
              <nav className="flex items-center space-x-2 text-xs sm:text-sm mb-8" style={breadcrumbStyle}>
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
                <span style={{ color: '#4D4D4D' }}>My listings</span>
              </nav>

              <div>
                <h1
                  className="text-base sm:text-lg font-semibold"
                  style={{ color: '#1E1E1E', fontFamily: 'Bricolage Grotesque, sans-serif' }}
                >
                  Manage your listings
                </h1>
                <p
                  className="text-[11px] sm:text-xs mt-2 max-w-3xl leading-relaxed"
                  style={{ color: '#9C9C9C', fontFamily: 'Poppins, sans-serif' }}
                >
                  Manage product listings easily. Add items, update details, and track metrics
                  <span className="block">
                    to improve sales. Start by adding a listing or auditing inventory.
                  </span>
                </p>
              </div>
            </div>

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
          </div>

        {/* Filters and Action Buttons Bar */}
        {(!shouldShowEmptyState && !isSearchNoResultsState) && (
            <div className="max-w-6xl mx-auto w-full pl-0 pr-0 mt-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pl-0 lg:pl-0 lg:-ml-16 w-full">
                {/* Left Side - Filters */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* All Listings Badge */}
                  {!isSearchActive && (
                    <div className="flex items-center gap-2">
                      <span style={{ color: '#B0B0B0', fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>
                        All listings
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
                        {totalListings}
                      </span>
                    </div>
                  )}

                {/* Sort By Filter */}
                <div className="relative" ref={sortDropdownRef}>
                  {selectedSortDetails ? (
                    <button
                      type="button"
                      onClick={() => setIsSortDropdownOpen((prev) => !prev)}
                      className="inline-flex items-center justify-between gap-3 px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: '#F0F8FE',
                        fontFamily: 'Poppins, sans-serif',
                        color: '#64B5F6',
                        minHeight: '30px'
                      }}
                    >
                      <span className="flex items-center gap-1 text-[11px] sm:text-xs" style={{ color: '#64B5F6' }}>
                        <span className="flex items-center gap-1">
                          {renderSortIcon(selectedSortDetails.primary, true)}
                          <span style={{ fontWeight: 500 }}>{selectedSortDetails.primary.label}</span>
                        </span>
                        <span>:</span>
                        <span style={{ fontWeight: 500 }}>{selectedSortDetails.secondaryLabel}</span>
                        {selectedSortDetails.tertiaryLabel && (
                          <>
                            <span>:</span>
                            <span style={{ fontWeight: 500 }}>{selectedSortDetails.tertiaryLabel}</span>
                          </>
                        )}
                      </span>
                      <span
                        role="button"
                        aria-label="Clear sort selection"
                        onClick={(event) => clearSelectedSort(event)}
                        className="text-base leading-none cursor-pointer"
                        style={{ color: '#64B5F6', lineHeight: 1 }}
                      >
                        ×
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsSortDropdownOpen((prev) => !prev)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: isSortDropdownOpen ? '#F0F8FE' : '#FAFAFA',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      <img
                        src={filterIcon}
                        alt="Filter"
                        className="w-4 h-4"
                        style={{
                          filter: 'brightness(0) saturate(100%) invert(70%)'
                        }}
                      />
                      <span
                        style={{
                          color: '#939393',
                          fontSize: '13px'
                        }}
                      >
                        Sort by
                      </span>
                      <img
                        src={arrowDownIcon}
                        alt="Arrow"
                        className="w-3 h-3"
                        style={{
                          filter: 'brightness(0) saturate(100%) invert(40%)'
                        }}
                      />
                    </button>
                  )}

                  {isSortDropdownOpen && (
                    <>
                      <div
                        className="absolute mt-2 z-30"
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '12px',
                          border: '1px solid #E9E9E9',
                          boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                          padding: '8px',
                          minWidth: '200px'
                        }}
                      >
                        {sortOptions.map((option) => {
                          const isSelected = option.key === selectedPrimaryKey;
                          const isHovered = option.key === hoveredPrimarySort;
                          const backgroundColor = isSelected ? '#F0F8FE' : isHovered ? '#FAFAFA' : 'transparent';
                          const textColor = isSelected ? '#64B5F6' : '#939393';
                          return (
                            <button
                              key={option.key}
                              type="button"
                              onMouseEnter={() => {
                                setHoveredPrimarySort(option.key);
                                setHoveredSecondarySort(null);
                              }}
                              onClick={() => {
                                setHoveredPrimarySort(option.key);
                                setHoveredSecondarySort(null);
                              }}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors"
                              style={{
                                backgroundColor,
                                color: textColor,
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '13px'
                              }}
                            >
                              <span className="flex items-center gap-2">
                                {renderSortIcon(option, isSelected)}
                                {option.label}
                              </span>
                              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M2 2l3 4-3 4"
                                  stroke={isSelected ? '#64B5F6' : '#939393'}
                                  strokeWidth="1.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => setIsSortDropdownOpen(false)}
                          className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg"
                          style={{
                            backgroundColor: '#F8F8F8',
                            color: '#939393',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '13px'
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#939393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                          Close
                        </button>
                      </div>

                      <div
                        className="absolute mt-2 z-40"
                        style={{
                          left: '210px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '12px',
                          border: '1px solid #E9E9E9',
                          boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                          width: `${secondaryPanelWidth}px`,
                          minWidth: `${secondaryPanelWidth}px`,
                          maxWidth: `${secondaryPanelWidth}px`,
                          padding: '6px 10px',
                          top:
                            (hoveredPrimarySort
                              ? sortOptions.findIndex((option) => option.key === hoveredPrimarySort) * 40
                              : selectedPrimaryKey
                              ? sortOptions.findIndex((option) => option.key === selectedPrimaryKey) * 40
                              : 0) + 8
                        }}
                      >
                        {(sortOptions.find((option) => option.key === (hoveredPrimarySort ?? selectedPrimaryKey)) ?? sortOptions[0]).children.map((child) => {
                          const hasSub = Array.isArray(child.subChildren);
                          const isSelected = child.key === selectedSecondaryKey && !hasSub && selectedPrimaryKey === (hoveredPrimarySort ?? selectedPrimaryKey);
                          const isHovered = child.key === hoveredSecondarySort;
                          const backgroundColor = isSelected ? '#F0F8FE' : isHovered ? '#FAFAFA' : 'transparent';
                          const textColor = isSelected ? '#64B5F6' : '#939393';
                          return (
                            <button
                              key={child.key}
                              type="button"
                              onMouseEnter={() => setHoveredSecondarySort(child.key)}
                              onClick={() => {
                                if (!hasSub && child.value) {
                                  setSelectedSort({ label: child.label, value: child.value });
                                  setIsSortDropdownOpen(false);
                                }
                              }}
                              className="w-full flex items-center px-3 py-1.5 rounded-lg transition-colors"
                              style={{
                                backgroundColor,
                                color: textColor,
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '12px',
                                whiteSpace: 'nowrap',
                                justifyContent: hasSub ? 'space-between' : 'flex-start',
                                alignItems: 'center',
                                columnGap: hasSub ? '16px' : '0'
                              }}
                            >
                              <span>{child.label}</span>
                              {hasSub ? (
                                <svg
                                  width="8"
                                  height="12"
                                  viewBox="0 0 8 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  style={{ flexShrink: 0 }}
                                >
                                  <path d="M2 2l3 4-3 4" stroke={child.key === hoveredSecondarySort ? '#64B5F6' : '#939393'} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>

                      {(sortOptions.find((option) => option.key === (hoveredPrimarySort ?? selectedPrimaryKey)) ?? sortOptions[0]).children
                        .filter((child) => child.subChildren && child.key === hoveredSecondarySort)
                        .map((child) => (
                          <div
                            key={child.key}
                            className="absolute mt-2 z-50"
                            style={{
                              left: `${tertiaryPanelLeft}px`,
                              backgroundColor: '#FFFFFF',
                              borderRadius: '12px',
                              border: '1px solid #E9E9E9',
                              boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                              minWidth: '120px',
                              maxWidth: '150px',
                              width: 'fit-content',
                              padding: '4px 6px',
                              top:
                                (hoveredPrimarySort
                                  ? sortOptions.findIndex((option) => option.key === hoveredPrimarySort) * 40
                                  : selectedPrimaryKey
                                  ? sortOptions.findIndex((option) => option.key === selectedPrimaryKey) * 40
                                  : 0) +
                                (sortOptions.find((option) => option.key === (hoveredPrimarySort ?? selectedPrimaryKey)) ?? sortOptions[0]).children.findIndex((c) => c.key === hoveredSecondarySort) *
                                  36 +
                                8
                            }}
                          >
                            {child.subChildren?.map((sub) => {
                              const isSelected = selectedSort?.value === sub.value;
                              return (
                                <button
                                  key={sub.key}
                                  type="button"
                                  onClick={() => {
                                    setSelectedSort({ label: sub.label, value: sub.value });
                                    setIsSortDropdownOpen(false);
                                  }}
                                  className="w-full text-left px-3 py-1.5 rounded-lg transition-colors"
                                  style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '12px',
                                    color: isSelected ? '#64B5F6' : '#939393',
                                    backgroundColor: isSelected ? '#F0F8FE' : 'transparent',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {sub.label}
                                </button>
                              );
                            })}
                          </div>
                        ))}
                    </>
                  )}
                </div>

                  {/* Status Filter */}
                  <div className="relative" ref={statusDropdownRef}>
                    {statusFilter === 'All Status' ? (
                      <button
                        type="button"
                        onClick={toggleStatusDropdown}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                        style={{
                          backgroundColor: '#FAFAFA',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        <span style={{ color: '#939393', fontSize: '13px' }}>{statusFilter}</span>
                        <img src={arrowDownIcon} alt="Arrow" className="w-3 h-3" style={{ filter: 'brightness(0) saturate(100%) invert(60%)' }} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={toggleStatusDropdown}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: badgeStyles(statusFilter).bg,
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        {badgeStyles(statusFilter).icon}
                        <span
                          style={{
                            color: badgeStyles(statusFilter).color,
                            fontSize: '11px'
                          }}
                        >
                          {statusFilter}
                        </span>
                        <span
                          style={{
                            color: badgeStyles(statusFilter).color,
                            fontSize: '12px',
                            lineHeight: 1,
                            marginLeft: '4px'
                          }}
                          onClick={(event) => {
                            event.stopPropagation();
                            clearStatusFilter();
                          }}
                        >
                          ×
                        </span>
                      </button>
                    )}

                    {isStatusDropdownOpen && (
                      <div
                        className="absolute right-0 mt-2 bg-white z-10"
                        style={{
                          borderRadius: '10px',
                          border: '1px solid #E9E9E9',
                          boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                          minWidth: '160px'
                        }}
                      >
                        {statusOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleStatusSelect(option)}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors"
                            style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#212121' }}
                          >
                            {option === 'Active' && (
                              <div className="flex items-center gap-1">
                                <img src={activeIcon} alt="Active" className="w-3 h-3" />
                                <span style={{ color: '#70E183' }}>Active</span>
                              </div>
                            )}
                            {option === 'Inactive' && (
                              <div className="flex items-center gap-1">
                                <img src={inactiveIcon} alt="Inactive" className="w-3 h-3" />
                                <span style={{ color: '#FF5151' }}>Inactive</span>
                              </div>
                            )}
                            {option === 'Days left' && (
                              <div className="flex items-center gap-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                  <circle cx="12" cy="12" r="10" stroke="#FAB951" strokeWidth="1.5" />
                                  <path d="M12 7v5l3 2" stroke="#FAB951" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span style={{ color: '#FAB951' }}>Days left</span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side - Action Buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto sm:self-center lg:ml-auto lg:pr-0 lg:-mr-14">
                  {/* Drafts Button */}
                  <button
                    className="flex items-center space-x-2 px-3 py-1 rounded-xl border"
                    style={{
                      backgroundColor: '#F0F8FE',
                      borderColor: '#CFE8FC',
                      borderRadius: '8px',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    <img src={draftsIcon} alt="Drafts" className="w-4 h-4" />
                    <span className="font-medium text-xs" style={{ color: '#64B5F6' }}>
                      Drafts
                    </span>
                    <span
                      className="px-2.5 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: '#CFE8FC', color: '#64B5F6', fontSize: '0.72rem' }}
                    >
                      {draftCount}
                    </span>
                  </button>

                  {/* Add Listing Button */}
                  <button
                    onClick={handlePrimaryCta}
                    className="inline-flex items-center justify-center gap-2 px-5 py-1 rounded-xl font-normal transition-colors text-sm"
                    style={{
                      backgroundColor: '#64B5F6',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    Add listing
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {isSearchActive && filteredListings.length > 0 && (
            <div className="max-w-6xl mx-auto w-full pl-0 pr-0">
              <div className="pl-0 lg:pl-0 lg:-ml-16 mt-4 mb-2">
                <p
                  style={{
                    color: '#212121',
                    fontFamily: 'Bricolage Grotesque, sans-serif',
                    fontSize: '16px'
                  }}
                >
                  Search results for “ {trimmedSearchQuery} “ ({filteredListings.length}{' '}
                  {filteredListings.length === 1 ? 'item' : 'items'})
                </p>
              </div>
            </div>
          )}

          <div className="max-w-6xl mx-auto w-full pl-0 pr-0 mt-4 mb-6">
            <div className="pl-0 lg:pl-0 lg:-ml-16">
              {shouldShowEmptyState ? renderEmptyState() : renderListingsGrid()}
            </div>
          </div>
      {(!shouldShowEmptyState && !isSearchNoResultsState) && (
            <div className="max-w-6xl mx-auto w-full pl-0 pr-0">
              <div className="pl-0 lg:pl-0 lg:-ml-16">
                {renderPagination()}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-white">
          <div className="px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs space-y-3 sm:space-y-0" style={{ color: '#BABABA' }}>
              <div className="flex items-center space-x-1.5">
                <img src={lilLogo} alt="Bao Afrik" className="w-5 h-5" />
                <span>©</span>
                <span className="text-[11px]">All rights reserved</span>
              </div>
              <div className="flex items-center space-x-3 text-[11px]">
                <Link to="/contact" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Contact Us</Link>
                <span style={{ color: '#BABABA' }}>|</span>
                <Link to="/terms" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Terms and conditions of use</Link>
                <span style={{ color: '#BABABA' }}>|</span>
                <Link to="/privacy" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Privacy policies</Link>
                <span style={{ color: '#BABABA' }}>|</span>
                <Link to="/cookies" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Cookies</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MyListings;
