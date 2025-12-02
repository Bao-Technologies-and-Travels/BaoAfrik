import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import bagIcon from '../assets/images/pre/bag.svg';
import listIcon from '../assets/images/pre/list.svg';
import gridIcon from '../assets/images/pre/grid.svg';
import lilLogo from '../assets/images/pre/lil.png';
import arrowLeftIcon from '../assets/images/pre/arrow-left.svg';
import draftsIcon from '../assets/images/pre/drafts.svg';
import trashIcon from '../assets/images/pre/trash.svg';
import filterIcon from '../assets/images/pre/filter.png';
import arrowDownIcon from '../assets/images/pre/arrow-down.svg';
import activeIcon from '../assets/images/pre/active.svg';
import inactiveIcon from '../assets/images/pre/inactive.svg';
import pencilIcon from '../assets/images/pre/pencil.svg';
import moneyIcon from '../assets/images/pre/money.svg';
import bulletIcon from '../assets/images/pre/bullet.svg';
import chartIcon from '../assets/images/pre/chart.svg';
import mainieIcon from '../assets/images/pre/mainie.svg';
import redtrashIcon from '../assets/images/pre/redtrash.svg';
import verityIcon from '../assets/images/pre/verity.svg';
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
  category?: string;
}

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
    description: "Hand-carved teeth that glide through curls without tugging, and a handle that still feels like grandma's favorite comb.",
    country: 'Ghana',
    flag: 'https://flagcdn.com/w20/gh.png'
  },
  {
    id: 'd3',
    title: 'African Wristband',
    price: '65.8',
    currency: 'USD',
    image: a3,
    description: 'Layered beads that catch the light and instantly make any everyday outfit feel like market day back home.',
    country: 'Benin',
    flag: 'https://flagcdn.com/w20/bj.png'
  },
  {
    id: 'd4',
    title: 'Bitter Cola',
    price: 'N/A',
    currency: 'USD',
    image: a4,
    description: 'Earthy bitter kola with that citrusy snap—great for chewing, steeping, or tossing into house bitters.',
    country: 'Nigeria',
    flag: 'https://flagcdn.com/w20/ng.png'
  }
];

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

const renderCountryBadge = (label: string, flagUrl: string) => (
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
      style={{
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        objectFit: 'cover'
      }}
    />
    <span style={{ color: '#939393', fontWeight: 300 }}>{label}</span>
  </span>
);

const buildDraftPrefillPayload = (draft: DraftListing) => {
  const payload: Record<string, string> = {};
  if (draft.title) payload.title = draft.title;
  if (draft.price && draft.price.toLowerCase() !== 'n/a') {
    payload.price = draft.price;
    if (draft.currency) payload.currency = draft.currency;
  }
  if (draft.description) payload.description = draft.description;
  if (draft.country) payload.country = draft.country;
  if (draft.image) payload.image = draft.image;
  return payload;
};

const MyListings: React.FC = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
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
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);
  const [draftListings, setDraftListings] = useState<DraftListing[]>(initialDraftListings);
  const draftSeedRef = useRef(JSON.stringify(initialDraftListings));
  const currentDraftSeed = JSON.stringify(initialDraftListings);
  const [moreOptionsOpenFor, setMoreOptionsOpenFor] = useState<string | null>(null);
  const moreOptionsRef = useRef<HTMLDivElement | null>(null);
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
  const [isMobilePlusModalOpen, setIsMobilePlusModalOpen] = useState(false);
  const [mobileSortSecondaryOpen, setMobileSortSecondaryOpen] = useState(false);
  const [mobileSortTertiaryOpen, setMobileSortTertiaryOpen] = useState(false);
  const [mobileSelectedPrimaryKey, setMobileSelectedPrimaryKey] = useState<string | null>(null);
  const [mobileSelectedSecondaryKey, setMobileSelectedSecondaryKey] = useState<string | null>(null);
  const mobilePlusModalRef = useRef<HTMLDivElement | null>(null);

  // Mock data - replace with actual data from backend
  const initialListings: Listing[] = [
    { id: '1', title: 'Bonga from Togo', image: a1, status: 'active', rating: 4.8, reviews: 88, price: '678', currency: 'USD', createdAt: 1690000000000, priceValue: 678, messages: 42, category: 'Food & Spicy' },
    { id: '2', title: 'Coconut Oil Ghana', image: a2, status: 'active', rating: 4.5, reviews: 120, price: '45', currency: 'USD', createdAt: 1690500000000, priceValue: 45, messages: 27, category: 'Food & Spicy' },
    { id: '3', title: 'Pepper from Benin', image: a3, status: 'inactive', rating: 4.2, reviews: 56, price: '32', currency: 'USD', createdAt: 1689500000000, priceValue: 32, messages: 12, category: 'Food & Spicy' },
    { id: '4', title: 'Shrimps from Lome', image: a4, status: 'active', rating: 4.9, reviews: 200, price: '67.8', currency: 'USD', daysLeft: 12, createdAt: 1691000000000, priceValue: 67.8, messages: 51, category: 'Food & Spicy' },
    { id: '5', title: 'Kinky hair Lagos', image: a5, status: 'active', rating: 4.7, reviews: 150, price: '25', currency: 'USD', createdAt: 1690800000000, priceValue: 25, messages: 19, category: 'Beauty & Wellness' },
    { id: '6', title: 'Gold neck Accra', image: a6, status: 'active', rating: 4.6, reviews: 95, price: '38', currency: 'USD', daysLeft: 11, createdAt: 1690200000000, priceValue: 38, messages: 33, category: 'Fashion & Textiles' },
    { id: '7', title: 'Baobab nuts Kano', image: a7, status: 'inactive', rating: 4.3, reviews: 78, price: '42', currency: 'USD', createdAt: 1689000000000, priceValue: 42, messages: 8, category: 'Food & Spicy' },
    { id: '8', title: 'Cowrie bracelets', image: a8, status: 'active', rating: 4.8, reviews: 165, price: '55', currency: 'USD', createdAt: 1690400000000, priceValue: 55, messages: 23, category: 'Fashion & Textiles' },
    { id: '9', title: 'Ebony tribal masks', image: a9, status: 'active', rating: 4.9, reviews: 210, price: '89', currency: 'USD', createdAt: 1689800000000, priceValue: 89, messages: 60, category: 'Home & Decor' },
    { id: '10', title: 'River pepper Addis', image: a10, status: 'active', rating: 4.7, reviews: 140, price: '72', currency: 'USD', createdAt: 1690600000000, priceValue: 72, messages: 31, category: 'Food & Spicy' },
    { id: '11', title: 'Desert salt Dakar', image: a11, status: 'active', rating: 4.6, reviews: 110, price: '48', currency: 'USD', createdAt: 1689300000000, priceValue: 48, messages: 17, category: 'Food & Spicy' },
    { id: '12', title: 'Market mix Cairo', image: a12, status: 'inactive', rating: 4.4, reviews: 85, price: '35', currency: 'USD', createdAt: 1689700000000, priceValue: 35, messages: 14, category: 'Food & Spicy' },
  ];
  const [listings, setListings] = useState<Listing[]>(initialListings);

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

  const handleDraftEdit = (draft: DraftListing) => {
    const prefillData = buildDraftPrefillPayload(draft);
    navigate('/create-listing', { state: { draft: prefillData } });
    setIsDraftsModalOpen(false);
  };

  const handleDraftDelete = (draftId: string) => {
    setDraftListings((prev) => prev.filter((draft) => draft.id !== draftId));
  };

  const handleListingNavigation = (listing: Listing) => {
    navigate(`/product/${listing.id}`, {
      state: {
        fromMyListings: true,
        listing,
        sellerVerified: false
      }
    });
  };

  const handleDeleteClick = (listing: Listing, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    // Close dropdown and set delete state immediately
    setMoreOptionsOpenFor(null);
    setListingToDelete(listing);
    setIsDeleteSuccess(false);
  };

  const handleConfirmDelete = () => {
    if (listingToDelete) {
      setIsDeleteSuccess(true);
    }
  };

  const handleDeleteClose = () => {
    if (isDeleteSuccess && listingToDelete) {
      // Actually delete the listing
      setListings((prev) => prev.filter((listing) => listing.id !== listingToDelete.id));
    }
    setListingToDelete(null);
    setIsDeleteSuccess(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const element = target as Element;
      
      // Check if click is on a delete button - if so, don't close dropdown (let delete handler manage it)
      const clickedButton = element.closest('button');
      if (clickedButton) {
        const deleteIcon = clickedButton.querySelector('img[alt="Delete"]');
        const deleteText = Array.from(clickedButton.querySelectorAll('span')).find(
          span => span.textContent?.includes('Delete the listing')
        );
        if (deleteIcon || deleteText) {
          return; // Let the delete button's onClick handler manage the state
        }
      }
      
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(target)) {
        setIsStatusDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(target)) {
        setIsSortDropdownOpen(false);
        setHoveredSecondarySort(null);
      }
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(target)) {
        setMoreOptionsOpenFor(null);
      }
      if (mobilePlusModalRef.current && !mobilePlusModalRef.current.contains(target)) {
        setIsMobilePlusModalOpen(false);
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

  useEffect(() => {
    if (draftSeedRef.current !== currentDraftSeed) {
      draftSeedRef.current = currentDraftSeed;
      setDraftListings(initialDraftListings);
    }
  }, [currentDraftSeed]);

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

  const renderDraftCard = (draft: DraftListing) => (
    <div
      key={draft.id}
      className="flex items-center gap-4"
      style={{
        border: '1px solid #E9E9E9',
        borderRadius: '14px',
        padding: '14px 18px',
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
              onClick={() => handleDraftEdit(draft)}
            >
              <img src={pencilIcon} alt="Edit" className="w-3 h-3" />
              Edit
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
          {renderCountryBadge(draft.country, draft.flag)}
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

  const renderDraftsModal = () => {
    if (!isDraftsModalOpen) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
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
            <div>
              <h2
                style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  color: '#1E1E1E',
                  fontSize: '18px'
                }}
              >
                Drafts ({draftListings.length})
              </h2>
            </div>
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

  const renderEmptyState = () => (
    <div className={`text-center ${isMobile ? 'py-8 px-4' : 'py-6'}`}>
      <img
        src={bagIcon}
        alt="Empty listings"
        className="mx-auto mb-4"
        style={{ width: isMobile ? '32px' : '40px', height: isMobile ? '32px' : '40px' }}
      />
      <div style={{ maxWidth: isMobile ? '100%' : '360px' }} className="mx-auto space-y-3">
        <p
          className={`${isMobile ? 'text-xs' : 'text-xs sm:text-sm'} leading-relaxed`}
          style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}
        >
          {isSearchNoResultsState
            ? "We couldn't find any listings that match your search. Try adjusting your keywords or filters."
            : "You don't have any listings yet. Start showcasing your products to millions of buyers!"}
        </p>
        <button
          onClick={handlePrimaryCta}
          className={`inline-flex items-center justify-center gap-2 ${isMobile ? 'px-4 py-2' : 'px-5 py-2.5'} rounded-lg font-normal transition-colors ${isMobile ? 'text-xs' : 'text-sm'}`}
          style={{
            backgroundColor: '#64B5F6',
            color: '#FFFFFF',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          {primaryButtonLabel}
          <svg
            className={isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}
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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const renderListingsList = () => (
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
          gridTemplateColumns: '2fr 1fr 1fr 1.2fr 1fr 1fr 1fr',
          gap: '16px',
          padding: '16px 20px'
        }}
      >
        {/* Column 1: Product Name */}
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
        {/* Column 2: Creation date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>Creation date</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 0L7.4641 3.5H0.535898L4 0Z" stroke="#939393" strokeWidth="1" fill="none" />
            </svg>
            <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L0.535898 0.5H7.4641L4 4Z" stroke="#939393" strokeWidth="1" fill="none" />
            </svg>
          </div>
        </div>
        {/* Column 3: Price */}
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
        {/* Column 4: Reviews & Rates */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>Reviews & Rates</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 0L7.4641 3.5H0.535898L4 0Z" stroke="#939393" strokeWidth="1" fill="none" />
            </svg>
            <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L0.535898 0.5H7.4641L4 4Z" stroke="#939393" strokeWidth="1" fill="none" />
            </svg>
          </div>
        </div>
        {/* Column 5: Engagements */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>Engagements</span>
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
      {sortedListings.map((listing, index) => (
        <div key={listing.id}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1.2fr 1fr 1fr 1fr',
              gap: '16px',
              padding: '14px 20px',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => handleListingNavigation(listing)}
          >
            {/* Column 1: Product Name & Category */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={listing.image}
                alt={listing.title}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '6px',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: '#6A6A6A', fontSize: '13px', fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                  {listing.title}
                </span>
                <span style={{ color: '#939393', fontSize: '11px', fontFamily: 'Poppins, sans-serif' }}>
                  {listing.category || 'Food & Spicy'}
                </span>
              </div>
            </div>

            {/* Column 2: Creation date */}
            <div>
              <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Poppins, sans-serif' }}>
                {formatDate(listing.createdAt)}
              </span>
            </div>

            {/* Column 3: Price */}
            <div>
              <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                {listing.price} {listing.currency}
              </span>
            </div>

            {/* Column 4: Reviews & Rates */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#FBBC05" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span style={{ color: '#939393', fontSize: '11px', fontFamily: 'Poppins, sans-serif' }}>
                {listing.rating}
              </span>
              <span style={{ color: '#B0B0B0', fontSize: '11px', fontFamily: 'Poppins, sans-serif' }}>
                ({listing.reviews} Reviews)
              </span>
            </div>

            {/* Column 5: Engagements */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                {listing.messages}
              </span>
              <img src={mainieIcon} alt="Engagements" style={{ width: '14px', height: '14px' }} />
            </div>

            {/* Column 6: Status */}
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

            {/* Column 7: Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
              <button
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <img src={pencilIcon} alt="Edit" style={{ width: '14px', height: '14px', filter: 'brightness(0) saturate(100%) invert(70%)' }} />
              </button>
              <button
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
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
                    setMoreOptionsOpenFor(moreOptionsOpenFor === listing.id ? null : listing.id);
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="3" cy="6" r="1.2" fill="#B0B0B0" />
                    <circle cx="6" cy="6" r="1.2" fill="#B0B0B0" />
                    <circle cx="9" cy="6" r="1.2" fill="#B0B0B0" />
                  </svg>
                </button>
                {moreOptionsOpenFor === listing.id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '32px',
                      right: '0',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E9E9E9',
                      boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                      padding: '8px',
                      minWidth: '180px',
                      zIndex: 1000
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        handleDeleteClick(listing, e);
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        borderRadius: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFF5F5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <img src={trashIcon} alt="Delete" style={{ width: '16px', height: '16px', filter: 'brightness(0) saturate(100%) invert(53%) sepia(46%) saturate(3205%) hue-rotate(332deg) brightness(103%) contrast(102%)' }} />
                      <span style={{ color: '#FF5151', fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>Delete the listing</span>
                    </button>
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
                        gap: '10px',
                        padding: '10px 12px',
                        border: 'none',
                        background: '#FAFAFA',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        marginTop: '4px'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                      <span style={{ color: '#B0B0B0', fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>Close</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {index < sortedListings.length - 1 && (
            <hr style={{ 
              height: '1px', 
              backgroundColor: '#E4E4E4', 
              margin: '0 20px',
              border: 'none',
              padding: 0,
              width: 'auto'
            }} />
          )}
        </div>
      ))}
    </div>
  );

  const renderListingsGrid = () => (
    <div className={`grid ${isMobile ? 'grid-cols-2 px-4' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'} ${isMobile ? 'gap-3' : 'gap-4 sm:gap-6 md:gap-8'}`}>
      {sortedListings.map((listing) => (
        <div
          key={listing.id}
          className="bg-white rounded-lg overflow-hidden"
          style={{ cursor: 'pointer' }}
          onClick={() => handleListingNavigation(listing)}
        >
          {/* Product Image */}
          <div className={`aspect-square relative overflow-hidden mb-1 sm:mb-2`} style={{ borderRadius: '12px', ...(isMobile ? { padding: '2px' } : {}) }}>
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-full object-cover"
              style={{ borderRadius: '12px', ...(isMobile ? { transform: 'scaleX(1.0) scaleY(0.92)' } : {}) }}
            />
          </div>

          {/* Product Content */}
          <div className="px-2 sm:px-3 pb-2 sm:pb-3">
            {/* Status Badge and More Options */}
            <div className="flex items-center justify-between mb-2" onClick={(e) => e.stopPropagation()}>
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
                   setMoreOptionsOpenFor(moreOptionsOpenFor === listing.id ? null : listing.id);
                 }}
               >
                 <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <circle cx="3" cy="6" r="1.2" fill="#B0B0B0" />
                   <circle cx="6" cy="6" r="1.2" fill="#B0B0B0" />
                   <circle cx="9" cy="6" r="1.2" fill="#B0B0B0" />
                 </svg>
               </button>
               {moreOptionsOpenFor === listing.id && (
                 <div
                   style={{
                     position: 'absolute',
                     top: '26px',
                     right: 0,
                     backgroundColor: '#FFFFFF',
                     borderRadius: '12px',
                     border: '1px solid #E9E9E9',
                     boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                     padding: '6px',
                     minWidth: '150px',
                     zIndex: 1000
                   }}
                 >
                   <button
                     type="button"
                     onClick={(e) => {
                       handleDeleteClick(listing, e);
                     }}
                     onMouseDown={(e) => {
                       e.stopPropagation();
                     }}
                     style={{
                       width: '100%',
                       display: 'flex',
                       alignItems: 'center',
                       gap: '8px',
                       padding: '8px 10px',
                       border: 'none',
                       background: 'transparent',
                       cursor: 'pointer',
                       borderRadius: '6px'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.backgroundColor = '#FFF5F5';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.backgroundColor = 'transparent';
                     }}
                   >
                     <img src={trashIcon} alt="Delete" style={{ width: '16px', height: '16px', filter: 'brightness(0) saturate(100%) invert(53%) sepia(46%) saturate(3205%) hue-rotate(332deg) brightness(103%) contrast(102%)' }} />
                     <span style={{ color: '#FF5151', fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>Delete the listing</span>
                   </button>
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
                      gap: '8px',
                      padding: '8px 10px',
                       border: 'none',
                       background: '#FAFAFA',
                       cursor: 'pointer',
                      borderRadius: '6px',
                       marginTop: '4px'
                     }}
                   >
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                       <path d="M18 6L6 18M6 6l12 12" />
                     </svg>
                     <span style={{ color: '#B0B0B0', fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>Close</span>
                   </button>
                 </div>
               )}
             </div>
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
                {listing.price} {listing.currency}
              </span>
              <button
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: '#F4F4F4',
                  color: '#939393',
                  fontSize: '10px',
                  fontFamily: 'Poppins, sans-serif'
                }}
                onClick={(e) => e.stopPropagation()}
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
    <div className={`flex flex-col ${isMobile ? 'items-center gap-4' : 'lg:flex-row items-center gap-6'} mt-12 ${isMobile ? 'mb-16' : 'mb-32'} w-full`}>
      <div className={`flex-1 flex justify-center w-full ${isMobile ? '' : ''}`}>
        <div className={`flex items-center gap-4 ${isMobile ? '' : ''}`} style={isMobile ? {} : { marginLeft: '80px' }}>
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

      {/* Go to section - directly under pagination on mobile */}
      <div className={`flex items-center gap-2 ${isMobile ? 'justify-center' : ''}`}>
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
                <span style={{ color: '#4D4D4D' }}>My listings</span>
              </nav>

              {/* Mobile Title - Only visible on mobile, below header */}
              {isMobile && (
                <div className="lg:hidden pt-8 px-4">
                  <h1
                    className="text-base font-semibold"
                    style={{ color: '#171717', fontFamily: 'Bricolage Grotesque, sans-serif' }}
                  >
                    Manage your listings
                  </h1>
                </div>
              )}

              {/* Desktop Title - Hidden on mobile */}
              <div className="hidden lg:block">
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

        {/* Mobile All Listings Bar - Only visible on mobile when listings exist */}
        {isMobile && !shouldShowEmptyState && !isSearchNoResultsState && (
          <div className="lg:hidden px-4 mt-0 mb-4">
            <div className="flex items-center justify-between">
              {/* All listings text or status filter badge */}
              {statusFilter === 'All Status' ? (
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
              ) : (
                <button
                  type="button"
                  onClick={clearStatusFilter}
                  className="inline-flex items-center justify-between gap-2 px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: statusFilter === 'Active' ? '#EDFBF0' : statusFilter === 'Inactive' ? '#FFF5F5' : '#FEF6E9',
                    fontFamily: 'Poppins, sans-serif',
                    color: statusFilter === 'Active' ? '#70E183' : statusFilter === 'Inactive' ? '#FF5151' : '#FAB951',
                    fontSize: '13px',
                    minHeight: '28px'
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    {statusFilter === 'Active' && <img src={activeIcon} alt="active" className="w-3 h-3" />}
                    {statusFilter === 'Inactive' && <img src={inactiveIcon} alt="inactive" className="w-3 h-3" />}
                    {statusFilter === 'Days left' && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#FAB951" />
                        <path d="M12 7v5l3 2" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    <span>{statusFilter}</span>
                  </span>
                  <span
                    role="button"
                    aria-label="Clear status filter"
                    className="text-base leading-none cursor-pointer"
                    style={{ lineHeight: 1 }}
                  >
                    ×
                  </span>
                </button>
              )}
              <div ref={mobilePlusModalRef} className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMobilePlusModalOpen(!isMobilePlusModalOpen);
                  }}
                  className="flex items-center justify-center"
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#64B5F6',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  aria-label="Add listing"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5v14M5 12h14" stroke="#F0F8FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Mobile Plus Modal - Hidden when tertiary or secondary sort modal is open */}
                {isMobilePlusModalOpen && !mobileSortTertiaryOpen && !mobileSortSecondaryOpen && (
                  <div
                    className="absolute bottom-0 right-0 z-50"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E9E9E9',
                      boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                      padding: '8px',
                      minWidth: '160px',
                      transform: 'translateY(68px)'
                    }}
                  >
                    {/* Sort by option */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMobileSortSecondaryOpen(!mobileSortSecondaryOpen);
                        if (!mobileSortSecondaryOpen) {
                          setIsStatusDropdownOpen(false);
                          setIsDraftsModalOpen(false);
                        }
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded transition-colors"
                      style={{ 
                        color: mobileSortSecondaryOpen ? '#64B5F6' : '#939393', 
                        fontFamily: 'Poppins, sans-serif', 
                        fontSize: '13px',
                        backgroundColor: mobileSortSecondaryOpen ? '#F0F8FE' : 'transparent',
                        borderRadius: '8px'
                      }}
                      onMouseEnter={(e) => {
                        if (!mobileSortSecondaryOpen) {
                          e.currentTarget.style.backgroundColor = '#FAFAFA';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!mobileSortSecondaryOpen) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <img 
                        src={filterIcon} 
                        alt="Sort" 
                        className="w-4 h-4" 
                        style={{ 
                          filter: mobileSortSecondaryOpen 
                            ? 'brightness(0) saturate(100%) invert(60%) sepia(89%) saturate(1726%) hue-rotate(183deg) brightness(97%) contrast(92%)'
                            : 'brightness(0) saturate(100%) invert(46%) sepia(4%) saturate(18%) hue-rotate(355deg) brightness(96%) contrast(91%)'
                        }} 
                      />
                      <span>Sort by</span>
                    </button>

                    {/* Sort Secondary Dropdown - appears to the left when Sort by is clicked, moves to primary position when tertiary opens */}
                    {mobileSortSecondaryOpen && (
                      <div
                        className="absolute z-50"
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '12px',
                          border: '1px solid #E9E9E9',
                          boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                          padding: '6px',
                          minWidth: '140px',
                          ...(mobileSortTertiaryOpen ? {
                            bottom: '0',
                            right: '0',
                            transform: 'translateY(68px)'
                          } : {
                            top: '0',
                            right: 'calc(100% + 8px)'
                          })
                        }}
                      >
                        {sortOptions.map((option) => {
                          const renderIcon = () => {
                            if (option.key === 'date') {
                              return (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#939393" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M12 6v6l4 2" />
                                </svg>
                              );
                            }
                            if (option.icon) {
                              return <img src={option.icon} alt={option.label} className="w-3.5 h-3.5" />;
                            }
                            return null;
                          };

                          return (
                            <button
                              key={option.key}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMobileSelectedPrimaryKey(option.key);
                                setMobileSortTertiaryOpen(true);
                              }}
                              className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded transition-colors"
                              style={{
                                color: '#939393',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '12px',
                                backgroundColor: 'transparent',
                                borderRadius: '8px'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#FAFAFA';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <span className="flex items-center gap-2">
                                {renderIcon()}
                                <span>{option.label}</span>
                              </span>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Tertiary Sort Modal - replaces primary modal position when secondary option clicked */}
                    {mobileSortTertiaryOpen && mobileSelectedPrimaryKey && (
                      <div
                        className="absolute bottom-0 right-0 z-50"
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '12px',
                          border: '1px solid #E9E9E9',
                          boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                          padding: '8px',
                          minWidth: '160px',
                          transform: 'translateY(68px)'
                        }}
                      >
                        {/* Back button at top right */}
                        <div className="flex items-center justify-end mb-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMobileSortTertiaryOpen(false);
                              setMobileSelectedPrimaryKey(null);
                              setMobileSelectedSecondaryKey(null);
                            }}
                            className="flex items-center gap-1 px-2 py-1"
                            style={{ color: '#939393', fontFamily: 'Poppins, sans-serif', fontSize: '12px' }}
                          >
                            <span>Back</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>

                        {/* Tertiary options */}
                        {(() => {
                          const primaryOption = sortOptions.find(opt => opt.key === mobileSelectedPrimaryKey);
                          if (!primaryOption) return null;

                          return primaryOption.children.map((child) => {
                            if (child.value) {
                              // Simple option - applies sort directly
                              return (
                                <button
                                  key={child.key}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (child.value) {
                                      setSelectedSort({ label: `${primaryOption.label}: ${child.label}`, value: child.value });
                                      setMobileSortTertiaryOpen(false);
                                      setMobileSortSecondaryOpen(false);
                                      setIsMobilePlusModalOpen(false);
                                      setMobileSelectedPrimaryKey(null);
                                    }
                                  }}
                                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors"
                                  style={{
                                    color: '#939393',
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '12px',
                                    backgroundColor: 'transparent',
                                    borderRadius: '8px'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#FAFAFA';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <span>{child.label}</span>
                                </button>
                              );
                            } else if (child.subChildren) {
                              // Has sub-children - opens another level
                              return (
                                <button
                                  key={child.key}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMobileSelectedSecondaryKey(child.key);
                                  }}
                                  className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded transition-colors"
                                  style={{
                                    color: '#939393',
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '12px',
                                    backgroundColor: 'transparent',
                                    borderRadius: '8px'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#FAFAFA';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <span>{child.label}</span>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              );
                            }
                            return null;
                          });
                        })()}

                        {/* Fourth level dropdown for Reviews/Messages - appears to the left */}
                        {mobileSelectedSecondaryKey && (() => {
                          const primaryOption = sortOptions.find(opt => opt.key === mobileSelectedPrimaryKey);
                          const secondaryOption = primaryOption?.children.find(c => c.key === mobileSelectedSecondaryKey);
                          return secondaryOption?.subChildren ? (
                            <div
                              className="absolute top-0 right-full mr-2 z-50"
                              style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: '12px',
                                border: '1px solid #E9E9E9',
                                boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                                padding: '6px',
                                minWidth: '120px'
                              }}
                            >
                              {secondaryOption.subChildren.map((subChild) => (
                                <button
                                  key={subChild.key}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (subChild.value && primaryOption) {
                                      setSelectedSort({ 
                                        label: `${primaryOption.label}: ${secondaryOption.label}: ${subChild.label}`, 
                                        value: subChild.value 
                                      });
                                      setMobileSortTertiaryOpen(false);
                                      setMobileSortSecondaryOpen(false);
                                      setIsMobilePlusModalOpen(false);
                                      setMobileSelectedPrimaryKey(null);
                                      setMobileSelectedSecondaryKey(null);
                                    }
                                  }}
                                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors"
                                  style={{
                                    color: '#939393',
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '12px',
                                    backgroundColor: 'transparent',
                                    borderRadius: '8px'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#FAFAFA';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <span>{subChild.label}</span>
                                </button>
                              ))}
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}

                    {/* All Status option */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsStatusDropdownOpen(!isStatusDropdownOpen);
                        if (!isStatusDropdownOpen) {
                          setIsSortDropdownOpen(false);
                          setIsDraftsModalOpen(false);
                        }
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded transition-colors"
                      style={{ 
                        color: isStatusDropdownOpen ? '#64B5F6' : '#939393', 
                        fontFamily: 'Poppins, sans-serif', 
                        fontSize: '13px',
                        backgroundColor: isStatusDropdownOpen ? '#F0F8FE' : 'transparent',
                        borderRadius: '8px'
                      }}
                      onMouseEnter={(e) => {
                        if (!isStatusDropdownOpen) {
                          e.currentTarget.style.backgroundColor = '#FAFAFA';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isStatusDropdownOpen) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <img 
                        src={statusIcon} 
                        alt="Status" 
                        className="w-4 h-4"
                        style={{
                          filter: isStatusDropdownOpen
                            ? 'brightness(0) saturate(100%) invert(60%) sepia(89%) saturate(1726%) hue-rotate(183deg) brightness(97%) contrast(92%)'
                            : 'none'
                        }}
                      />
                      <span>All Status</span>
                    </button>

                    {/* Status Dropdown - appears to the left of plus modal */}
                    {isStatusDropdownOpen && (
                      <div
                        className="absolute top-0 right-full mr-2 z-50"
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '12px',
                          border: '1px solid #E9E9E9',
                          boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                          padding: '6px',
                          minWidth: '120px'
                        }}
                      >
                        {statusOptions.map((status) => {
                          const styles = badgeStyles(status);
                          return (
                            <button
                              key={status}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusSelect(status);
                                setIsStatusDropdownOpen(false);
                                setIsMobilePlusModalOpen(false);
                              }}
                              className="w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors"
                              style={{
                                color: styles.color,
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '12px',
                                backgroundColor: 'transparent',
                                borderRadius: '8px'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#FAFAFA';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              {styles.icon}
                              <span>{status}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Drafts option */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDraftsModalOpen(!isDraftsModalOpen);
                        if (!isDraftsModalOpen) {
                          setIsSortDropdownOpen(false);
                          setIsStatusDropdownOpen(false);
                        }
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded transition-colors"
                      style={{ 
                        color: isDraftsModalOpen ? '#64B5F6' : '#939393', 
                        fontFamily: 'Poppins, sans-serif', 
                        fontSize: '13px',
                        backgroundColor: isDraftsModalOpen ? '#F0F8FE' : 'transparent',
                        borderRadius: '8px'
                      }}
                      onMouseEnter={(e) => {
                        if (!isDraftsModalOpen) {
                          e.currentTarget.style.backgroundColor = '#FAFAFA';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isDraftsModalOpen) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <img 
                        src={draftsIcon} 
                        alt="Drafts" 
                        className="w-4 h-4" 
                        style={{ 
                          filter: isDraftsModalOpen
                            ? 'brightness(0) saturate(100%) invert(60%) sepia(89%) saturate(1726%) hue-rotate(183deg) brightness(97%) contrast(92%)'
                            : 'brightness(0) saturate(100%) invert(46%) sepia(4%) saturate(18%) hue-rotate(355deg) brightness(96%) contrast(91%)'
                        }} 
                      />
                      <span>Drafts</span>
                      <span
                        className="px-2 py-0.5 rounded-full font-medium ml-auto"
                        style={{
                          backgroundColor: '#F4F4F4',
                          color: '#939393',
                          fontSize: '11px',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        {draftCount}
                      </span>
                    </button>

                    {/* Close option */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMobilePlusModalOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded transition-colors"
                      style={{ 
                        backgroundColor: '#FAFAFA',
                        color: '#B0B0B0', 
                        fontFamily: 'Poppins, sans-serif', 
                        fontSize: '13px',
                        borderRadius: '8px'
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="#B0B0B0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      <span>Close</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filters and Action Buttons Bar - Desktop only */}
        {!isMobile && (!shouldShowEmptyState && !isSearchNoResultsState) && (
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
                    onClick={() => setIsDraftsModalOpen(true)}
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
              {shouldShowEmptyState ? renderEmptyState() : (isMobile ? renderListingsGrid() : (viewMode === 'grid' ? renderListingsGrid() : renderListingsList()))}
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
            {/* Desktop Footer - Hidden on mobile */}
            <div className="hidden lg:flex flex-row items-center justify-between text-xs" style={{ color: '#BABABA' }}>
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

            {/* Mobile Footer - Two lines, only visible on mobile, second line fits on one line */}
            <div className="lg:hidden flex flex-col items-center text-xs space-y-2" style={{ color: '#BABABA' }}>
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
      {renderDraftsModal()}

      {/* Delete Confirmation Modal */}
      {listingToDelete && (
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
            zIndex: 10000
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleDeleteClose();
            }
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '30px',
              boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
              padding: '30px',
              paddingBottom: '15px',
              maxWidth: '420px',
              width: '90%',
              minHeight: '320px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleDeleteClose}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="#BABABA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '12px' }}>
              <img
                src={isDeleteSuccess ? verityIcon : redtrashIcon}
                alt={isDeleteSuccess ? 'Success' : 'Delete'}
                style={{ width: '80px', height: '80px' }}
              />
            </div>

            {/* Text */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <p
                style={{
                  color: '#212121',
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  margin: 0
                }}
              >
                {isDeleteSuccess
                  ? `The item "${listingToDelete.title}" has been successfully removed.`
                  : (
                    <>
                      The item "{listingToDelete.title}" will be<br />
                      permanently deleted, do you<br />
                      wish to continue ?
                    </>
                  )}
              </p>
            </div>

            {/* Buttons */}
            {isDeleteSuccess ? (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={handleDeleteClose}
                  style={{
                    backgroundColor: '#F9A825',
                    borderRadius: '12px',
                    border: 'none',
                    padding: '10px 140px',
                    cursor: 'pointer',
                    color: '#FFFFFF',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontWeight: 300
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={handleDeleteClose}
                  style={{
                    backgroundColor: '#F1F1F1',
                    borderRadius: '12px',
                    border: 'none',
                    padding: '10px 28px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6A6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                  <span style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  style={{
                    backgroundColor: '#FF5151',
                    borderRadius: '12px',
                    border: 'none',
                    padding: '10px 28px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <img src={trashIcon} alt="Delete" style={{ width: '16px', height: '16px', filter: 'brightness(0) invert(1)' }} />
                  <span style={{ color: '#FFFFFF', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>Yes, Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>
        {`
          .drafts-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .drafts-scroll::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </>
  );
};

export default MyListings;
