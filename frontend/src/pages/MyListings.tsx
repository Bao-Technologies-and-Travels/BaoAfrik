import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import ErrorBoundary from './ErrorBoundary';

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

// Import product images 
import a1 from '../assets/images/pre/a1.png';
import a2 from '../assets/images/pre/a2.png';
import a3 from '../assets/images/pre/a3.png';
import a4 from '../assets/images/pre/a4.png';

type ViewMode = 'list' | 'grid';
type ListingStatus = 'DRAFT' | 'PUBLISHED' | 'SOLD' | 'active' | 'inactive';

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number
    };
}

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    quantity: number;
    category: string;
    origin: string;
    location: string;
    status: 'DRAFT' | 'PUBLISHED' | 'SOLD' | 'EXPIRED' | 'DELETED';
    images: Array<{ url: string; isprimary: boolean }>;
    averageRating?: number;
    reviewCount?: number;
    viewCount?: number;
    likeCount?: number;
    saveCount?: number;
    createdAt: string;
    updatedAt: string;
    expiresAt?: string;
    publishedAt?: string;
    sellerId: string;
}

interface PaginatedProducts {
    products: Product[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

interface Listing {
    id: string;
    title: string;
    image: string;
    status: ListingStatus;
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

// const initialDraftListings: DraftListing[] = [
//     {
//         id: 'd1',
//         title: 'African Wristband',
//         price: '65.8',
//         currency: 'USD',
//         image: a1,
//         description: 'Warm pepper notes with a mellow finish, the kind of spice you sprinkle on everything once it hits your pantry.',
//         country: 'Cameroon',
//         flag: 'https://flagcdn.com/w20/cm.png'
//     },
//     {
//         id: 'd2',
//         title: 'African Comb',
//         price: '65.8',
//         currency: 'USD',
//         image: a2,
//         description: "Hand-carved teeth that glide through curls without tugging, and a handle that still feels like grandma's favorite comb.",
//         country: 'Ghana',
//         flag: 'https://flagcdn.com/w20/gh.png'
//     },
//     {
//         id: 'd3',
//         title: 'African Wristband',
//         price: '65.8',
//         currency: 'USD',
//         image: a3,
//         description: 'Layered beads that catch the light and instantly make any everyday outfit feel like market day back home.',
//         country: 'Benin',
//         flag: 'https://flagcdn.com/w20/bj.png'
//     },
//     {
//         id: 'd4',
//         title: 'Bitter Cola',
//         price: 'N/A',
//         currency: 'USD',
//         image: a4,
//         description: 'Earthy bitter kola with that citrusy snap—great for chewing, steeping, or tossing into house bitters.',
//         country: 'Nigeria',
//         flag: 'https://flagcdn.com/w20/ng.png'
//     }
// ];

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
    const { user } = useAuth();
    const { addToast } = useToast();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'drafts' | 'published' | 'sold'>('all');
    const [stats, setStats] = useState({
        total: 0,
        drafts: 0,
        published: 0,
        sold: 0
    });

    const [confirmationDialog, setConfirmationDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        confirmText?: string;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        confirmText: 'Delete'
    });

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
    const [draftListings, setDraftListings] = useState<DraftListing[]>([]);
    // const draftSeedRef = useRef(JSON.stringify(initialDraftListings));
    // const currentDraftSeed = JSON.stringify(initialDraftListings);
    const [moreOptionsOpenFor, setMoreOptionsOpenFor] = useState<string | null>(null);
    const moreOptionsRef = useRef<HTMLDivElement | null>(null);
    const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);
    const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [listings, setListings] = useState<Listing[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
    const [error, setError] = useState<string | null>(null);
    const [showScrollToTop, setShowScrollToTop] = useState(false);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
        fetchMyListings(newPage, itemsPerPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollToTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // fetch listings with pagination
    useEffect(() => {
        setCurrentPage(1);
        fetchMyListings(1, itemsPerPage);
    }, [activeTab, , itemsPerPage]);

    const fetchMyListings = async (page: number = 1, limit: number = itemsPerPage) => {
        if (!user) return;
        setLoading(true);

        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');

            let status = '';
            if (activeTab === 'drafts') status = 'DRAFT';
            if (activeTab === 'published') status = 'PUBLISHED';
            if (activeTab === 'sold') status = 'SOLD';

            const cacheKey = `listings-${activeTab}-${page}`;
            const cachedData = sessionStorage.getItem(cacheKey);
            const now = new Date().getTime();

            if (cachedData) {
                const { data, timestamp } = JSON.parse(cachedData);
                if (now - timestamp < 5 * 60 * 1000) { // 5 mins cache
                    processApiResponse(data);
                    return;
                }
            }

            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(status && { status })
            });

            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/products/my-products?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch listings');
            }

            const result: ApiResponse<PaginatedProducts> = await response.json();

            if (result.success && result.data) {
                sessionStorage.setItem(cacheKey, JSON.stringify({
                    data: result.data,
                    timestamp: now
                }));

                processApiResponse(result.data);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to load listings';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // fetch drafts on mount
      useEffect(() => {
        let mounted = true;
    
        const fetchDrafts = async () => {
          try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.REACT_APP_API_URL}/products?status=DRAFT`, {
              headers: { Authorization: `Bearer ${token}` }
            });
    
            if (!res.ok) return;
    
            const json = await res.json();
            if (!mounted || !json.success) return;
    
            // trasform API products to DraftListing format
            const drafts: DraftListing[] = (json.data.products || []).map((product: any) => ({
              id: product.id,
              title: product.title || 'Undefined',
              price: product.price?.toString() || 'N/A',
              currency: product.currency || 'USD',
              image: product.images?.[0]?.url || a1,
              description: product.description || '',
              country: product.origin || 'Cameroon',
              flag: `https://flagcdn.com/w20/${getCountryFlagCode(product.origin)}.png`
            }));
    
            setDraftListings(drafts);
          } catch (e) {
            console.warn('Failed to load drafts', e);
          }
        };
    
        fetchDrafts();
        return () => { mounted = false; };
      }, []);
    
      const getCountryFlagCode = (countryName?: string): string => {
        if (!countryName) return 'cm';
        const countryMap: Record<string, string> = {
          'cameroon': 'cm',
          'nigeria': 'ng',
          'ghana': 'gh',
          'kenya': 'ke',
          'benin': 'bj',
          'egypt': 'eg',
          'morocco': 'ma',
          'ethiopia': 'et',
          'south africa': 'za',
          'tunisia': 'tn',
          'algeria': 'dz',
        };
        return countryMap[countryName.toLowerCase()] || 'cm';
      };

    const processApiResponse = (data: PaginatedProducts) => {
        const mappedListings: Listing[] = data.products.map((product: Product) => ({
            id: product.id,
            title: product.title,
            image: product.images?.[0].url || '',
            status: product.status === 'PUBLISHED' ? 'active' : 'inactive',
            rating: product.averageRating || 0,
            reviews: product.reviewCount || 0,
            price: product.price?.toString() || '0',
            currency: product.currency || 'USD',
            createdAt: new Date(product.createdAt).getTime(),
            priceValue: product.price || 0,
            messages: 0,
            category: product.category || 'Uncategorized',
            daysLeft: product.expiresAt
                ? Math.ceil((new Date(product.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                : undefined
        }));

        setListings(mappedListings);
        setProducts(data.products);

        setCurrentPage(data.pagination.page);
        setTotalPages(data.pagination.totalPages);

        setStats({
            total: data.pagination.total,
            drafts: data.products.filter((p: Product) => p.status === 'DRAFT').length,
            published: data.products.filter((p: Product) => p.status === 'PUBLISHED').length,
            sold: data.products.filter((p: Product) => p.status === 'SOLD').length
        });
    }

    const handleEditProduct = (productId: string) => {
        navigate(`/edit-listing/${productId}`);
    };

    const showDeleteConfirmation = (productId: string, productTitle: string) => {
        setConfirmationDialog({
            isOpen: true,
            title: 'Delete Listing',
            message: `Are you sure you want to delete "${productTitle}"? This action cannot be undone.`,
            onConfirm: () => {
                handleDeleteProduct(productId);
                closeConfirmationDialog()
            },
            confirmText: 'Delete'
        });
    };

    const handleDeleteProduct = async (productId: string) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Remove from local state
                setProducts(prev => prev.filter(p => p.id !== productId));
                // Close confirmation dialog
                setConfirmationDialog(prev => ({ ...prev, isOpen: false }));

                // Show success message
                addToast({
                    type: "success",
                    title: 'Action Completed',
                    message: "Listing deleted successfully",
                    duration: 2000
                });
            } else {
                throw new Error('Failed to delete listing');
            }
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Action Failed',
                message: "Failed to delete listing. Please try again",
                duration: 2000
            });
        }
    };

    const handlePublishProduct = async (productId: string) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'PUBLISHED' })
            });

            if (response.ok) {
                // Update local state
                setProducts(prev => prev.map(p =>
                    p.id === productId ? { ...p, status: 'PUBLISHED' } : p
                ));
                addToast({
                    type: "success",
                    title: 'Action Completed',
                    message: "Listing published successfully",
                    duration: 2000
                });
            } else {
                throw new Error('Failed to publish listing');
            }
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Action Failed',
                message: "Failed to publish listing",
                duration: 2000
            });
        }
    };

    const showPublishConfirmation = (productId: string, productTitle: string) => {
        setConfirmationDialog({
            isOpen: true,
            title: 'Publish Listing',
            message: `Are you sure you want to publish "${productTitle}"? Once published, it will be visible to all users.`,
            onConfirm: () => {
                handlePublishProduct(productId);
                closeConfirmationDialog()
            },
            confirmText: 'Publish'
        });
    };

    const closeConfirmationDialog = () => {
        setConfirmationDialog(prev => ({ ...prev, isOpen: false }));
    };

    const getStatusBadge = (status: ListingStatus) => {
        const baseClass = "px-2 py-1 rounded-full text-xs font-medium";

        switch (status) {
            case 'DRAFT':
            case 'inactive':
                return (
                    <span className={`${baseClass} bg-yellow-100 text-yellow-800`}>
                        Draft
                    </span>
                );
            case 'PUBLISHED':
            case 'active':
                return (
                    <span className={`${baseClass} bg-green-100 text-green-800`}>
                        Published
                    </span>
                );
            case 'SOLD':
                return (
                    <span className={`${baseClass} bg-gray-100 text-gray-800`}>
                        Sold
                    </span>
                );
            default:
                return (
                    <span className={`${baseClass} bg-gray-100 text-gray-800`}>
                        {status}
                    </span>
                );
        }
    };

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(price);
    };

    const trimmedSearchQuery = searchQuery.trim();

    const filteredListings = useMemo(() => {
        let filtered = listings;

        if (trimmedSearchQuery) {
            const query = trimmedSearchQuery.toLowerCase();
            filtered = filtered?.filter((listing) =>
                listing.title.toLowerCase().includes(query)
            );
        }

        if (statusFilter !== 'All Status') {
            filtered = filtered?.filter((listing) => {
                if (statusFilter === 'Active') return listing.status === 'active' && typeof listing.daysLeft !== 'number';
                if (statusFilter === 'Inactive') return listing.status === 'inactive';
                if (statusFilter === 'Days left') return typeof listing.daysLeft === 'number';
                return true;
            });
        }

        return filtered;
    }, [listings, searchQuery, statusFilter]);

    const sortedListings = useMemo(() => {
        const sorted = [...filteredListings || []];
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
    const totalListings = listings?.length;
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

    const handleDeleteClick = (listing: Listing) => {
        setListingToDelete(listing);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteClose = () => {
        setIsDeleteModalOpen(false);
        setListingToDelete(null);
        setIsDeleting(false);
    };

    const handleConfirmDelete = async () => {
        if (!listingToDelete) return;

        setIsDeleting(true);

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${listingToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            setListings(prev => prev.filter(item => item.id !== listingToDelete.id));

            setStats(prev => ({
                ...prev,
                total: prev.total - 1,
                [listingToDelete.status === 'DRAFT' ? 'drafts' :
                    listingToDelete.status === 'PUBLISHED' ? 'published' : 'sold']:
                    Math.max(0, prev[listingToDelete.status === 'DRAFT' ? 'drafts' :
                        listingToDelete.status === 'PUBLISHED' ? 'published' : 'sold'] - 1)
            }));

            addToast({
                type: 'success',
                title: 'Success',
                message: 'Listing deleted successfully',
                duration: 2000
            });

            handleDeleteClose();

        } catch (error) {
            addToast({
                type: 'error',
                title: 'Error',
                message: 'Failed to delete product. Please try again',
                duration: 2000
            });
        } finally {
            setIsDeleting(false);
        }
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
            if (moreOptionsRef.current && !moreOptionsRef.current.contains(target)) {
                setMoreOptionsOpenFor(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // useEffect(() => {
    //     if (draftSeedRef.current !== currentDraftSeed) {
    //         draftSeedRef.current = currentDraftSeed;
    //         setDraftListings(initialDraftListings);
    //     }
    // }, [currentDraftSeed]);

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
                    height: '100px',
                    minWidth: 0
                }}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', color: '#1E1E1E', fontSize: '15px' }}>
                        <span className="truncate">{draft.title}</span>
                        <span style={{ color: '#B0B0B0', flexShrink: 0 }}>·</span>
                        <span style={{ color: '#B0B0B0', flexShrink: 0 }}>
                            {draft.currency} {draft.price}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 flexShrink: 0">
                        <button
                            type="button"
                            className="inline-flex items-center gap-1 px-2 py-1 whitespace-nowrap"
                            style={{
                                backgroundColor: '#F4F4F4',
                                color: '#939393',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontFamily: 'Poppins, sans-serif',
                                flexShrink: 0
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
                                backgroundColor: '#FFE9E9',
                                flexShrink: 0
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
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        wordBreak: 'break-word'
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
                        {draftListings.length === 0 ? (
                            // Empty state
                            <div className="flex flex-col items-center justify-center py-12" style={{ color: '#BABABA' }}>
                                <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p style={{ fontSize: '14px' }}>No drafts yet. Start creating a new listing!</p>
                            </div>
                        ) : (
                            // Drafts list
                            <div
                                className="drafts-scroll flex-1"
                                style={{
                                    overflowY: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '14px',
                                    paddingRight: '8px'
                                }}
                            >
                                {draftListings.map((draft) => renderDraftCard(draft))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

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
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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
                                onClick={() => handleEditProduct(listing.id)}
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
                                            top: '0',
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
                                                e.stopPropagation();
                                                setListingToDelete(listing);
                                                setIsDeleteModalOpen(true);
                                                setMoreOptionsOpenFor(null);
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
                                            <img
                                                src={trashIcon}
                                                alt="Delete"
                                                style={{

                                                    width: '16px',
                                                    height: '16px',
                                                    filter: 'brightness(0) saturate(100%) invert(53%) sepia(46%) saturate(3205%) hue-rotate(332deg) brightness(103%) contrast(102%)'
                                                }} />
                                            <span style={{
                                                color: '#FF5151',
                                                fontSize: '13px',
                                                fontFamily: 'Poppins, sans-serif'
                                            }}>
                                                Delete the listing
                                            </span>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
            {sortedListings.map((listing) => (
                <div
                    key={listing.id}
                    className="bg-white rounded-lg overflow-hidden"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleListingNavigation(listing)}
                >
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
                                                e.stopPropagation();
                                                handleDeleteClick(listing);
                                                setMoreOptionsOpenFor(null);
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
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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

    const renderPagination = () => {
        return (
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    Previous
                </button>

                <div className="flex space-x-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }

                        return (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-4 py-2 rounded ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                        <span className="px-4 py-2">...</span>
                    )}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                        >
                            {totalPages}
                        </button>
                    )}
                </div>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    Next
                </button>
            </div>
        );
    };

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

    if (loading && listings.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your listings...</p>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
                        <p className="mb-6">We're having trouble loading your listings. Please try again later.</p>
                        <button
                            onClick={() => {
                                // Clear cache for current page
                                const cacheKey = `listings-${activeTab}-${currentPage}`;
                                sessionStorage.removeItem(cacheKey);
                                fetchMyListings(currentPage, itemsPerPage);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                            disabled={loading}
                        >
                            <svg
                                className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            {loading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </div>
            }
        >
            <>
                {/* <Header /> */}
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
                                                {draftListings.length}
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

                        {isSearchActive && filteredListings?.length > 0 && (
                            <div className="max-w-6xl mx-auto w-full pl-0 pr-0">
                                <div className="pl-0 lg:pl-0 lg:-ml-16 mt-4 mb-2">
                                    <p
                                        style={{
                                            color: '#212121',
                                            fontFamily: 'Bricolage Grotesque, sans-serif',
                                            fontSize: '16px'
                                        }}
                                    >
                                        Search results for “ {trimmedSearchQuery} “ ({filteredListings?.length}{' '}
                                        {filteredListings?.length === 1 ? 'item' : 'items'})
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="max-w-6xl mx-auto w-full pl-0 pr-0 mt-4 mb-6">
                            <div className="pl-0 lg:pl-0 lg:-ml-16">
                                {shouldShowEmptyState ? renderEmptyState() : viewMode === 'grid' ? renderListingsGrid() : renderListingsList()}
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

                    {showScrollToTop && (
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="fixed bottom-8 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300"
                            aria-label="Scroll to top"
                            style={{ backgroundColor: 'red', padding: '20px' }}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                                ></path>
                            </svg>
                        </button>
                    )}

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
                {renderDraftsModal()}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && listingToDelete && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                handleDeleteClose();
                            }
                        }}
                    >
                        <div
                            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Delete Listing
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete "{listingToDelete.title}"? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleDeleteClose}
                                    disabled={isDeleting}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (listingToDelete) {
                                            handleConfirmDelete();
                                        }
                                    }}
                                    disabled={isDeleting}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center"
                                >
                                    {isDeleting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Deleting...
                                        </>
                                    ) : 'Delete'}
                                </button>
                            </div>
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
        </ErrorBoundary>

    );
};

export default MyListings;