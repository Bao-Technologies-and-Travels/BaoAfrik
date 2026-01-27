import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { getProductCountry, countries } from '../utils/countryHelpers';

import listIcon from '../assets/images/pre/list.svg';
import gridIcon from '../assets/images/pre/grid.svg';
import arrowLeftIcon from '../assets/images/pre/arrow-left.svg';
import trashIcon from '../assets/images/pre/trash.svg';
import filterIcon from '../assets/images/pre/filter.png';
import moneyIcon from '../assets/images/pre/money.svg';
import bulletIcon from '../assets/images/pre/bullet.svg';
import searchNormalIcon from '../assets/images/pre/search-normal.svg';
import backArrowIcon from '../assets/images/pre/back arrow.svg';
import lilLogo from '../assets/images/pre/lil.png';
import locationIcon from '../assets/images/pre/PL.svg';
import closeIcon from '../assets/images/pre/CLose.svg';
import redtrashIcon from '../assets/images/pre/redtrash.svg';
import verityIcon from '../assets/images/pre/verity.svg';
import bagIcon from '../assets/images/pre/bag.svg';
import draftsIcon from '../assets/images/pre/drafts.svg';
import grayArrowIcon from '../assets/images/pre/gray.svg';
import blackArrowIcon from '../assets/images/pre/black.svg';
import SDicon from '../assets/images/pre/SDicon.svg';
import globyIcon from '../assets/images/pre/globy.svg';
import locIcon from '../assets/images/pre/Loc.svg';
import arrowDownIcon from '../assets/images/pre/arrow-down.svg';

type ViewMode = 'list' | 'grid';

interface Request {
    id: string;
    productName: string;
    createdAt: number | string;
    sellerLocation: string;
    origin: string;
    minPrice?: number | null;
    maxPrice?: number | null;
    currency: string;
    status: 'ongoing' | 'pending' | 'completed' | 'expired';
    description?: string;
}

// Helper function to map backend status to frontend status
const mapBackendStatusToFrontend = (backendStatus: string): Request['status'] => {
    const statusMap: Record<string, Request['status']> = {
        'PENDING': 'pending',
        'FULFILLED': 'completed',
        'REJECTED': 'expired',
        'ONGOING': 'ongoing'
    };
    return statusMap[backendStatus.toUpperCase()] || 'pending';
};

// Helper function to map frontend status to backend status
const mapFrontendStatusToBackend = (frontendStatus: Request['status']): string => {
    const statusMap: Record<Request['status'], string> = {
        'pending': 'PENDING',
        'completed': 'FULFILLED',
        'expired': 'REJECTED',
        'ongoing': 'ONGOING'
    };
    return statusMap[frontendStatus] || 'PENDING';
};

// Helper function to format price range
const formatPriceRange = (minPrice?: number | null, maxPrice?: number | null, currency?: string | null): string => {
    const min = minPrice ?? 0;
    const max = maxPrice ?? 1000;
    const curr = (currency || 'USD').toUpperCase();

    const currencySymbols: Record<string, string> = {
        'USD': '$',
        'GBP': '£',
        'CAD': 'C$',
        'EUR': '€',
    };

    const symbol = currencySymbols[curr] || curr;

    if (min === 0 && max >= 1000000) {
        return `Any price ${curr}`;
    } else if (min === 0) {
        return `Less than ${symbol}${max}`;
    } else if (max >= 1000000) {
        return `More than ${symbol}${min}`;
    } else {
        return `${symbol}${min} - ${symbol}${max} ${curr}`;
    }
};

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

const getParentKeyByValue = (value: SortValue): string | null => {
    for (const option of sortOptions) {
        for (const child of option.children) {
            if (child.value === value) return option.key;
        }
    }
    return null;
};

const getSecondaryKeyByValue = (value: SortValue): string | null => {
    for (const option of sortOptions) {
        for (const child of option.children) {
            if (child.value === value) return child.key;
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

const badgeStyles = (filter: Exclude<StatusFilter, 'All Status'>) => {
    if (filter === 'Ongoing') {
        return {
            bg: '#F0F8FE',
            color: '#64B5F6',
            icon: null
        };
    }
    if (filter === 'Pending') {
        return {
            bg: '#F4F4F4',
            color: '#6A6A6A',
            icon: null
        };
    }
    if (filter === 'Completed') {
        return {
            bg: '#EDFBF0',
            color: '#4CD964',
            icon: null
        };
    }
    if (filter === 'Expired') {
        return {
            bg: '#FFE9E9',
            color: '#FF5151',
            icon: null
        };
    }
    return {
        bg: '#F4F4F4',
        color: '#939393',
        icon: null
    };
};

const MyRequests: React.FC = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { user } = useAuth();
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
    const [moreOptionsOpenFor, setMoreOptionsOpenFor] = useState<string | null>(null);
    const moreOptionsRef = useRef<HTMLDivElement | null>(null);
    const [statusModalOpenFor, setStatusModalOpenFor] = useState<string | null>(null);
    const [viewRequestModalOpen, setViewRequestModalOpen] = useState(false);
    const [selectedRequestForView, setSelectedRequestForView] = useState<Request | null>(null);
    const [requestToDelete, setRequestToDelete] = useState<Request | null>(null);
    const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
    const [deleteReason, setDeleteReason] = useState<string>('');
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [mobileSearchQuery, setMobileSearchQuery] = useState('');
    const [mobileSearchSubmitted, setMobileSearchSubmitted] = useState(false);
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoadingRequests, setIsLoadingRequests] = useState(true);
    
    // Request modal state
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestProductName, setRequestProductName] = useState('');
    const [requestProductOrigin, setRequestProductOrigin] = useState('');
    const [requestProductOriginInput, setRequestProductOriginInput] = useState('');
    const [requestDescription, setRequestDescription] = useState('');
    const [requestPriceRange, setRequestPriceRange] = useState('');
    const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
    const [location, setLocation] = useState('London |  United Kingdom');
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
    const [isRequestProductOriginDropdownOpen, setIsRequestProductOriginDropdownOpen] = useState(false);
    const requestProductOriginDropdownRef = useRef<HTMLDivElement>(null);
    const locationDropdownRef = useRef<HTMLDivElement>(null);
    
    // UK cities for location dropdown
    const ukCities = [
        'London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds',
        'Sheffield', 'Edinburgh', 'Glasgow', 'Bristol', 'Cardiff',
        'Newcastle', 'Nottingham', 'Leicester', 'Southampton', 'Belfast'
    ];
    
    // African countries for origin dropdown
    const africanCountries = countries
        .map(c => ({ name: c.name, code: c.code, flag: c.flag }))
        .sort((a, b) => a.name.localeCompare(b.name));

    // Handle "Make a Request" button click - check authentication
    const handleMakeRequestClick = () => {
        if (!user) {
            addToast({
                type: 'info',
                title: 'Login Required',
                message: 'Please log in to make a request',
                duration: 3000
            });
            return;
        }
        setShowRequestModal(true);
    };
    
    // Handle request form submission
    const handleRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validateForm = () => {
            if (!requestProductName.trim()) {
                addToast({
                    type: 'error',
                    title: 'Validation Error',
                    message: 'Product name is required',
                    duration: 3000
                });
                return false;
            }
            if (!requestDescription.trim()) {
                addToast({
                    type: 'error',
                    title: 'Validation Error',
                    message: 'Description is required',
                    duration: 3000
                });
                return false;
            }
            if (!requestProductOrigin && !requestProductOriginInput.trim()) {
                addToast({
                    type: 'error',
                    title: 'Validation Error',
                    message: 'Please select or type a product origin',
                    duration: 3000
                });
                return false;
            }
            return true;
        };

        if (!validateForm()) {
            return;
        }

        const token = localStorage.getItem('accessToken');

        try {
            setIsSubmittingRequest(true);

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
                        maxPrice = 1000000;
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

            // Reset form
            setRequestProductName('');
            setRequestProductOrigin('');
            setRequestProductOriginInput('');
            setRequestDescription('');
            setRequestPriceRange('');

            // Refresh requests list
            const userStr = localStorage.getItem('user');
            const currentUser = userStr ? JSON.parse(userStr) : null;
            if (currentUser && currentUser.id) {
                const refreshResponse = await fetch(`${process.env.REACT_APP_API_URL}/requests?userId=${currentUser.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (refreshResponse.ok) {
                    const refreshResult = await refreshResponse.json();
                    let requestsArray: Request[] = [];
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
            }

            setShowRequestModal(false);
            addToast({
                type: 'success',
                title: 'Success',
                message: 'Request created successfully',
                duration: 3000
            });

        } catch (error: any) {
            console.error('Error submitting request:', error);
            addToast({
                type: 'error',
                title: 'Error',
                message: error.message || 'Failed to submit request. Please try again.',
                duration: 3000
            });
        } finally {
            setIsSubmittingRequest(false);
        }
    };

    // Fetch requests from backend
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setIsLoadingRequests(true);
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    addToast({
                        type: 'error',
                        title: 'Authentication Required',
                        message: 'Please log in to view your requests',
                        duration: 3000
                    });
                    navigate('/login');
                    return;
                }

                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;
                if (!user || !user.id) {
                    addToast({
                        type: 'error',
                        title: 'User Not Found',
                        message: 'Unable to identify user',
                        duration: 3000
                    });
                    return;
                }

                // Fetch only the current user's requests
                const response = await fetch(`${process.env.REACT_APP_API_URL}/requests?userId=${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch requests');
                }

                const result = await response.json();

                // Handle both response formats: { success: true, data: [...] } or { data: [...] }
                let requestsArray: any[] = [];

                if (result.success && result.data && Array.isArray(result.data)) {
                    requestsArray = result.data;
                } else if (result.data && Array.isArray(result.data)) {
                    requestsArray = result.data;
                } else if (result.data?.data && Array.isArray(result.data.data)) {
                    // Handle nested paginated response
                    requestsArray = result.data.data;
                }

                if (requestsArray.length > 0 || result.success !== false) {
                    const mappedRequests: Request[] = requestsArray.map((req: any) => {
                        const createdAt = req.createdAt ? new Date(req.createdAt).getTime() : Date.now();
                        return {
                            id: req.id,
                            productName: req.productName || '',
                            createdAt,
                            sellerLocation: req.sellerLocation || '',
                            origin: req.origin || '',
                            minPrice: req.minPrice,
                            maxPrice: req.maxPrice,
                            currency: req.currency || 'USD',
                            status: mapBackendStatusToFrontend(req.status || 'PENDING'),
                            description: req.description || ''
                        };
                    });
                    setRequests(mappedRequests);
                } else {
                    // No requests found
                    setRequests([]);
                }
            } catch (error: any) {
                console.error('Error fetching requests:', error);
                addToast({
                    type: 'error',
                    title: 'Failed to Load Requests',
                    message: error.message || 'Unable to fetch your requests. Please try again later.',
                    duration: 3000
                });
            } finally {
                setIsLoadingRequests(false);
            }
        };

        fetchRequests();
    }, [navigate, addToast]);

    const trimmedSearchQuery = searchQuery.trim();

    const filteredRequests = useMemo(() => {
        let filtered = requests;

        if (trimmedSearchQuery) {
            const query = trimmedSearchQuery.toLowerCase();
            filtered = filtered.filter((request) =>
                request.productName.toLowerCase().includes(query) ||
                (request.description && request.description.toLowerCase().includes(query))
            );
        }

        if (statusFilter !== 'All Status') {
            filtered = filtered.filter((request) => {
                const statusMap: Record<string, Request['status']> = {
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
                    sorted.sort((a, b) => {
                        const aTime = typeof a.createdAt === 'number' ? a.createdAt : new Date(a.createdAt).getTime();
                        const bTime = typeof b.createdAt === 'number' ? b.createdAt : new Date(b.createdAt).getTime();
                        return bTime - aTime;
                    });
                    break;
                case 'date_older':
                    sorted.sort((a, b) => {
                        const aTime = typeof a.createdAt === 'number' ? a.createdAt : new Date(a.createdAt).getTime();
                        const bTime = typeof b.createdAt === 'number' ? b.createdAt : new Date(b.createdAt).getTime();
                        return aTime - bTime;
                    });
                    break;
                case 'name_az':
                    sorted.sort((a, b) => a.productName.localeCompare(b.productName));
                    break;
                case 'name_za':
                    sorted.sort((a, b) => b.productName.localeCompare(a.productName));
                    break;
                case 'price_high_low':
                    sorted.sort((a, b) => {
                        const aPrice = a.maxPrice ?? a.minPrice ?? 0;
                        const bPrice = b.maxPrice ?? b.minPrice ?? 0;
                        return bPrice - aPrice;
                    });
                    break;
                case 'price_low_high':
                    sorted.sort((a, b) => {
                        const aPrice = a.minPrice ?? a.maxPrice ?? 0;
                        const bPrice = b.minPrice ?? b.maxPrice ?? 0;
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
        setHoveredPrimarySort(null);
        setHoveredSecondarySort(null);
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
        price: 150
    };
    const secondaryPanelWidth = secondaryPanelWidths[resolvedPrimaryKey] ?? 130;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

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
            // Check if click is outside any status modal
            if (statusModalOpenFor) {
                const statusBadgeElement = document.querySelector(`[data-status-badge-id="${statusModalOpenFor}"]`);
                const statusModalElement = statusBadgeElement?.querySelector('[data-status-modal="true"]');
                // Check if click is inside the status badge container or its modal dropdown
                const isInsideStatusBadge = statusBadgeElement && statusBadgeElement.contains(target);
                const isInsideModal = statusModalElement && statusModalElement.contains(target);
                // Check if the clicked button is inside the status modal
                const clickedButton = target.closest('button');
                const isButtonInModal = clickedButton && statusModalElement && statusModalElement.contains(clickedButton);
                // Only close if click is outside AND not on a button inside the modal
                if (!isInsideStatusBadge && !isInsideModal && !isButtonInModal) {
                    setStatusModalOpenFor(null);
                }
            }
        };

        const handleClickOutsideDelayed = (event: MouseEvent) => {
            setTimeout(() => {
                handleClickOutside(event);
            }, 0);
        };
        document.addEventListener('click', handleClickOutsideDelayed);
        return () => document.removeEventListener('click', handleClickOutsideDelayed);
    }, [statusModalOpenFor]);

    // mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const formatDate = (timestamp: number | string) => {
        const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day} / ${month} / ${year}`;
    };

    const handleStatusChange = async (requestId: string, newStatus: Request['status']) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                addToast({
                    type: 'error',
                    title: 'Authentication Required',
                    message: 'Please log in to update request status',
                    duration: 3000
                });
                return;
            }

            const backendStatus = mapFrontendStatusToBackend(newStatus);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/requests/${requestId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: backendStatus })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || errorData.message || 'Failed to update request status';

                // Log detailed error for debugging
                console.error('Status update error:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorData,
                    requestId,
                    backendStatus
                });

                throw new Error(errorMessage);
            }

            const result = await response.json();
            const updatedRequest = result.data || result;

            // Update local state
            setRequests((prev) =>
                prev.map((request) =>
                    request.id === requestId ? {
                        ...request,
                        status: mapBackendStatusToFrontend(updatedRequest.status || backendStatus)
                    } : request
                )
            );
            setStatusModalOpenFor(null);

            addToast({
                type: 'success',
                title: 'Status Updated',
                message: 'Request status has been updated successfully',
                duration: 2000
            });
        } catch (error: any) {
            console.error('Error updating request status:', error);
            addToast({
                type: 'error',
                title: 'Update Failed',
                message: error.message || 'Failed to update request status. Please try again.',
                duration: 3000
            });
        }
    };

    const handleConfirmDelete = async () => {
        if (!requestToDelete) return;

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                addToast({
                    type: 'error',
                    title: 'Authentication Required',
                    message: 'Please log in to delete requests',
                    duration: 3000
                });
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/requests/${requestToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || errorData.message || 'Failed to delete request';
                throw new Error(errorMessage);
            }

            setIsDeleteSuccess(true);
            // Update local state
            setRequests((prev) => prev.filter((request) => request.id !== requestToDelete.id));

            addToast({
                type: 'success',
                title: 'Request Deleted',
                message: 'Request has been deleted successfully',
                duration: 2000
            });
        } catch (error: any) {
            console.error('Error deleting request:', error);
            addToast({
                type: 'error',
                title: 'Delete Failed',
                message: error.message || 'Failed to delete request. Please try again.',
                duration: 3000
            });
        }
    };

    const handleDeleteClose = () => {
        setRequestToDelete(null);
        setIsDeleteSuccess(false);
        setDeleteReason('');
    };

    const renderStatusBadge = (requestId: string) => {
        const request = requests.find(r => r.id === requestId);
        if (!request) return null;

        const statusConfig = {
            ongoing: { text: 'Ongoing', textColor: '#64B5F6', bgColor: '#F0F8FE' },
            pending: { text: 'Pending', textColor: '#6A6A6A', bgColor: '#F4F4F4' },
            completed: { text: 'Completed', textColor: '#4CD964', bgColor: '#EDFBF0' },
            expired: { text: 'Expired', textColor: '#FF5151', bgColor: '#FFE9E9' }
        };

        const config = statusConfig[request.status] || statusConfig.pending;
        const isModalOpen = statusModalOpenFor === requestId;

        return (
            <div style={{ position: 'relative' }} className="status-modal-container">
                <div
                    className="inline-flex items-center gap-1 px-2.5 rounded-full"
                    style={{
                        backgroundColor: config.bgColor,
                        fontSize: '10px',
                        borderRadius: '8px',
                        paddingTop: '4px',
                        paddingBottom: '6px',
                        height: '24px'
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
                    <button
                        type="button"
                        className="status-modal-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setStatusModalOpenFor(isModalOpen ? null : requestId);
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 3L4 5L6 3" stroke={config.textColor} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                {isModalOpen && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '32px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #E9E9E9',
                            boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                            padding: '4px',
                            width: '100px',
                            zIndex: 1000,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px'
                        }}
                    >
                        {(['ongoing', 'pending', 'completed', 'expired'] as Request['status'][]).map((optionStatus) => {
                            const optionConfig = statusConfig[optionStatus];
                            const currentRequest = requests.find(r => r.id === requestId);
                            const isSelected = currentRequest?.status === optionStatus;
                            return (
                                <button
                                    key={optionStatus}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusChange(requestId, optionStatus);
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '4px 8px',
                                        borderRadius: isSelected ? '6px' : '0',
                                        backgroundColor: isSelected ? optionConfig.bgColor : 'transparent',
                                        border: 'none',
                                        color: optionConfig.textColor,
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '12px',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.backgroundColor = '#FAFAFA';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    {optionConfig.text}
                                </button>
                            );
                        })}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setStatusModalOpenFor(null);
                            }}
                            style={{
                                width: '100%',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                backgroundColor: '#FAFAFA',
                                border: 'none',
                                color: '#B0B0B0',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '12px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                marginTop: '2px'
                            }}
                        >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                            <span style={{ color: '#B0B0B0' }}>Close</span>
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const formatDateForGrid = (timestamp: number | string) => {
        const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day}-${month}-${year}`;
    };

    const renderGridCard = (request: Request) => {
        const statusConfig = {
            ongoing: { text: 'Ongoing', textColor: '#64B5F6', bgColor: '#F0F8FE' },
            pending: { text: 'Pending', textColor: '#6A6A6A', bgColor: '#F4F4F4' },
            completed: { text: 'Completed', textColor: '#4CD964', bgColor: '#EDFBF0' },
            expired: { text: 'Expired', textColor: '#FF5151', bgColor: '#FFE9E9' }
        };

        const config = statusConfig[request.status] || statusConfig.pending;
        const isStatusModalOpen = statusModalOpenFor === request.id;
        const isMoreOptionsOpen = moreOptionsOpenFor === request.id;

        return (
            <div
                key={request.id}
                className="bg-white hover:shadow-md transition-shadow"
                style={{
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    height: 'auto',
                    width: isMobile ? '260px' : 'auto',
                    flexShrink: isMobile ? 0 : 'initial',
                    padding: isMobile ? '10px' : '16px',
                    borderRadius: '24px',
                    position: 'relative'
                }}
            >
                {/* Request Badge and Status Badge - Desktop only */}
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
                        <div className="flex items-center gap-2" style={{ position: 'relative' }}>
                            {/* Status Badge with Arrow */}
                            <div style={{ position: 'relative' }}>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setStatusModalOpenFor(isStatusModalOpen ? null : request.id);
                                    }}
                                    className="inline-flex items-center gap-1 px-2.5"
                                    style={{
                                        backgroundColor: config.bgColor,
                                        fontSize: '10px',
                                        borderRadius: '8px',
                                        paddingTop: '4px',
                                        paddingBottom: '6px',
                                        height: '24px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontFamily: 'Poppins, sans-serif'
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
                                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 3L4 5L6 3" stroke={config.textColor} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                {/* Status Modal */}
                                {isStatusModalOpen && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '32px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            backgroundColor: '#FFFFFF',
                                            borderRadius: '12px',
                                            border: '1px solid #E9E9E9',
                                            boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                                            padding: '4px',
                                            width: '100px',
                                            zIndex: 10000,
                                            isolation: 'isolate',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '2px'
                                        }}
                                    >
                                        {(['ongoing', 'pending', 'completed', 'expired'] as Request['status'][]).map((optionStatus) => {
                                            const optionConfig = statusConfig[optionStatus];
                                            const currentRequest = requests.find(r => r.id === request.id);
                                            const isSelected = currentRequest?.status === optionStatus;
                                            return (
                                                <button
                                                    key={optionStatus}
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusChange(request.id, optionStatus);
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '4px 8px',
                                                        borderRadius: isSelected ? '6px' : '0',
                                                        backgroundColor: isSelected ? optionConfig.bgColor : 'transparent',
                                                        border: 'none',
                                                        color: optionConfig.textColor,
                                                        fontFamily: 'Poppins, sans-serif',
                                                        fontSize: '12px',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!isSelected) {
                                                            e.currentTarget.style.backgroundColor = '#FAFAFA';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (!isSelected) {
                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                        }
                                                    }}
                                                >
                                                    {optionConfig.text}
                                                </button>
                                            );
                                        })}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setStatusModalOpenFor(null);
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                backgroundColor: '#FAFAFA',
                                                border: 'none',
                                                color: '#B0B0B0',
                                                fontFamily: 'Poppins, sans-serif',
                                                fontSize: '12px',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                marginTop: '2px'
                                            }}
                                        >
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 6L6 18M6 6l12 12" />
                                            </svg>
                                            <span style={{ color: '#B0B0B0' }}>Close</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* More Options Button */}
                            <div style={{ position: 'relative' }}>
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
                                        setMoreOptionsOpenFor(isMoreOptionsOpen ? null : request.id);
                                    }}
                                >
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="3" cy="6" r="1.2" fill="#B0B0B0" />
                                        <circle cx="6" cy="6" r="1.2" fill="#B0B0B0" />
                                        <circle cx="9" cy="6" r="1.2" fill="#B0B0B0" />
                                    </svg>
                                </button>
                                {isMoreOptionsOpen && (
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
                                            zIndex: 10000,
                                            isolation: 'isolate'
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedRequestForView(request);
                                                setViewRequestModalOpen(true);
                                                setMoreOptionsOpenFor(null);
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
                                                e.currentTarget.style.backgroundColor = '#FAFAFA';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#939393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                            <span style={{ color: '#939393', fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>View the request</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setRequestToDelete(request);
                                                setIsDeleteSuccess(false);
                                                setDeleteReason('');
                                                setMoreOptionsOpenFor(null);
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
                                            <span style={{ color: '#FF5151', fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>Delete request</span>
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
                )}

                {/* Request Badge, Status Badge and More Options - Mobile */}
                {isMobile && (
                    <div className="flex items-center justify-between mb-1">
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
                        <div className="flex items-center gap-2" style={{ position: 'relative' }}>
                            {/* Status Badge with Arrow */}
                            <div style={{ position: 'relative' }} className="status-modal-container">
                                <div
                                    className="inline-flex items-center gap-1 px-2 rounded-full"
                                    style={{
                                        backgroundColor: config.bgColor,
                                        fontSize: '9px',
                                        borderRadius: '8px',
                                        paddingTop: '3px',
                                        paddingBottom: '4px',
                                        height: '20px'
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
                                    <button
                                        type="button"
                                        className="status-modal-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setStatusModalOpenFor(isStatusModalOpen ? null : request.id);
                                        }}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <svg width="6" height="6" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 3L4 5L6 3" stroke={config.textColor} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                                {/* Status Modal */}
                                {isStatusModalOpen && (
                                    <div
                                        className="status-modal-dropdown"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                            position: 'absolute',
                                            top: '28px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            backgroundColor: '#FFFFFF',
                                            borderRadius: isMobile ? '12px' : '12px',
                                            border: '1px solid #E9E9E9',
                                            boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                                            padding: isMobile ? '3px' : '4px',
                                            width: isMobile ? '80px' : '90px',
                                            zIndex: 10000,
                                            isolation: 'isolate',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '2px'
                                        }}
                                    >
                                        {(['ongoing', 'pending', 'completed', 'expired'] as Request['status'][]).map((optionStatus) => {
                                            const optionConfig = statusConfig[optionStatus];
                                            const currentRequest = requests.find(r => r.id === request.id);
                                            const isSelected = currentRequest?.status === optionStatus;
                                            return (
                                                <button
                                                    key={optionStatus}
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleStatusChange(request.id, optionStatus);
                                                        setStatusModalOpenFor(null);
                                                    }}
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: isMobile ? '3px 6px' : '4px 8px',
                                                        borderRadius: isSelected ? '6px' : '0',
                                                        backgroundColor: isSelected ? optionConfig.bgColor : 'transparent',
                                                        border: 'none',
                                                        color: optionConfig.textColor,
                                                        fontFamily: 'Poppins, sans-serif',
                                                        fontSize: isMobile ? '10px' : '11px',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    {optionConfig.text}
                                                </button>
                                            );
                                        })}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setStatusModalOpenFor(null);
                                            }}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: isMobile ? '3px 6px' : '4px 8px',
                                                borderRadius: '6px',
                                                backgroundColor: '#FAFAFA',
                                                border: 'none',
                                                color: '#B0B0B0',
                                                fontFamily: 'Poppins, sans-serif',
                                                fontSize: isMobile ? '10px' : '11px',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                marginTop: '2px'
                                            }}
                                        >
                                            <svg width={isMobile ? "7" : "8"} height={isMobile ? "7" : "8"} viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 6L6 18M6 6l12 12" />
                                            </svg>
                                            <span style={{ color: '#B0B0B0' }}>Close</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* More Options Button */}
                            <div style={{ position: 'relative' }} ref={moreOptionsRef}>
                                <button
                                    type="button"
                                    className="w-4 h-4 rounded-full border flex items-center justify-center"
                                    style={{
                                        borderColor: '#B0B0B0',
                                        borderWidth: '1.5px',
                                        backgroundColor: '#FFFFFF',
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMoreOptionsOpenFor(isMoreOptionsOpen ? null : request.id);
                                    }}
                                >
                                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="3" cy="6" r="1" fill="#B0B0B0" />
                                        <circle cx="6" cy="6" r="1" fill="#B0B0B0" />
                                        <circle cx="9" cy="6" r="1" fill="#B0B0B0" />
                                    </svg>
                                </button>
                                {isMoreOptionsOpen && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '28px',
                                            right: '0',
                                            backgroundColor: '#FFFFFF',
                                            borderRadius: '12px',
                                            border: '1px solid #E9E9E9',
                                            boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                                            padding: isMobile ? '4px' : '6px',
                                            minWidth: isMobile ? '130px' : '150px',
                                            zIndex: 10000,
                                            isolation: 'isolate'
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedRequestForView(request);
                                                setViewRequestModalOpen(true);
                                                setMoreOptionsOpenFor(null);
                                            }}
                                            onMouseDown={(e) => {
                                                e.stopPropagation();
                                            }}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: isMobile ? '6px' : '10px',
                                                padding: isMobile ? '6px 8px' : '10px 12px',
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                borderRadius: '8px'
                                            }}
                                            onMouseEnter={!isMobile ? (e) => {
                                                e.currentTarget.style.backgroundColor = '#FAFAFA';
                                            } : undefined}
                                            onMouseLeave={!isMobile ? (e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            } : undefined}
                                        >
                                            <svg width={isMobile ? "12" : "16"} height={isMobile ? "12" : "16"} viewBox="0 0 24 24" fill="none" stroke="#939393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                            <span style={{ color: '#939393', fontSize: isMobile ? '11px' : '13px', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap' }}>View the request</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setRequestToDelete(request);
                                                setIsDeleteSuccess(false);
                                                setDeleteReason('');
                                                setMoreOptionsOpenFor(null);
                                            }}
                                            onMouseDown={(e) => {
                                                e.stopPropagation();
                                            }}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: isMobile ? '6px' : '10px',
                                                padding: isMobile ? '6px 8px' : '10px 12px',
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                borderRadius: '8px'
                                            }}
                                            onMouseEnter={!isMobile ? (e) => {
                                                e.currentTarget.style.backgroundColor = '#FFF5F5';
                                            } : undefined}
                                            onMouseLeave={!isMobile ? (e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            } : undefined}
                                        >
                                            <img src={trashIcon} alt="Delete" style={{ width: isMobile ? '12px' : '16px', height: isMobile ? '12px' : '16px', filter: 'brightness(0) saturate(100%) invert(53%) sepia(46%) saturate(3205%) hue-rotate(332deg) brightness(103%) contrast(102%)' }} />
                                            <span style={{ color: '#FF5151', fontSize: isMobile ? '11px' : '13px', fontFamily: 'Poppins, sans-serif' }}>Delete request</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMoreOptionsOpenFor(null);
                                            }}
                                            onMouseDown={(e) => {
                                                e.stopPropagation();
                                            }}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: isMobile ? '6px' : '10px',
                                                padding: isMobile ? '6px 8px' : '10px 12px',
                                                border: 'none',
                                                background: '#FAFAFA',
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                                marginTop: '4px'
                                            }}
                                        >
                                            <svg width={isMobile ? "12" : "16"} height={isMobile ? "12" : "16"} viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 6L6 18M6 6l12 12" />
                                            </svg>
                                            <span style={{ color: '#B0B0B0', fontSize: isMobile ? '11px' : '13px', fontFamily: 'Poppins, sans-serif' }}>Close</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Product Title */}
                <h3 className="mb-2 sm:mb-3" style={{ fontSize: isMobile ? '11px' : '14px', fontWeight: '500', color: '#212121' }}>
                    {request.productName}
                </h3>

                {/* Creation Date */}
                <div className="flex items-center gap-1.5 mb-2 sm:mb-3">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="#939393" strokeWidth="1.5" />
                        <path d="M12 7v5l3 2" stroke="#939393" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: isMobile ? '9px' : '12px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
                        Creation date: {formatDateForGrid(request.createdAt)}
                    </span>
                </div>

                {/* Description */}
                {request.description && (
                    <p className="mb-3 sm:mb-4" style={{ fontSize: isMobile ? '7px' : '10px', color: '#6A6A6A', lineHeight: '1.5', fontWeight: 'normal' }}>
                        {request.description}
                    </p>
                )}

                {/* Tags and Status Badge Row - Desktop/Tablet */}
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
                                <span style={{ fontSize: '12px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>{request.sellerLocation}</span>
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
                                    <span style={{ fontSize: '12px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>{formatPriceRange(request.minPrice, request.maxPrice, request.currency).replace(' - ', ' ~ ')}</span>
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
                                    {request.origin && (() => {
                                        const country = getProductCountry(request.origin);
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
                            <span style={{ fontSize: '8px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>{request.sellerLocation}</span>
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
                                <span style={{ fontSize: '8px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>{formatPriceRange(request.minPrice, request.maxPrice, request.currency).replace(' - ', ' ~ ')}</span>
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
                                {request.origin && (() => {
                                    const country = getProductCountry(request.origin);
                                    return (
                                        <>
                                            <img
                                                src={country.flag}
                                                alt={country.name}
                                                className="object-cover rounded-full"
                                                style={{ width: '12px', height: '12px' }}
                                            />
                                            <span style={{ fontSize: '8px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>{country.name}</span>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderRequestsGrid = () => {
        // Group requests by status
        const ongoingRequests = sortedRequests.filter(r => r.status === 'ongoing');
        const pendingRequests = sortedRequests.filter(r => r.status === 'pending');
        const completedRequests = sortedRequests.filter(r => r.status === 'completed');
        const expiredRequests = sortedRequests.filter(r => r.status === 'expired');

        return (
            <div>
                {/* Ongoing requests Section */}
                {ongoingRequests.length > 0 && (
                    <div className="mb-12">
                        <div className={`flex items-center justify-between mb-6 ${isMobile ? 'px-4' : ''}`}>
                            <h3 style={{
                                fontFamily: 'Bricolage Grotesque, sans-serif',
                                fontSize: isMobile ? '14px' : '18px',
                                fontWeight: '500',
                                color: '#000000'
                            }}>
                                Ongoing requests {'>'}
                            </h3>
                            <div className={`flex items-center gap-3 ${isMobile ? 'ml-auto' : ''}`} style={isMobile ? { marginRight: '-8px' } : {}}>
                                <button
                                    className="rounded-full flex items-center justify-center transition-all duration-200"
                                    style={{
                                        width: isMobile ? '16px' : '20px',
                                        height: isMobile ? '16px' : '20px'
                                    }}
                                    aria-label="Previous"
                                >
                                    <img src={grayArrowIcon} alt="Previous" className="w-full h-full" />
                                </button>
                                <button
                                    className="rounded-full flex items-center justify-center transition-all duration-200"
                                    style={{
                                        width: isMobile ? '16px' : '20px',
                                        height: isMobile ? '16px' : '20px'
                                    }}
                                    aria-label="Next"
                                >
                                    <img src={blackArrowIcon} alt="Next" className="w-full h-full" />
                                </button>
                            </div>
                        </div>
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
                                className={isMobile ? "flex gap-4 mb-6 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6"}
                                style={isMobile ? {
                                    paddingLeft: '16px',
                                    paddingRight: '16px',
                                    paddingTop: '8px',
                                    paddingBottom: '8px',
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                    WebkitOverflowScrolling: 'touch'
                                } : {}}
                            >
                                {ongoingRequests.slice(0, 3).map((request) => renderGridCard(request))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Pending requests Section */}
                {pendingRequests.length > 0 && (
                    <div className="mb-12">
                        <div className={`flex items-center justify-between mb-6 ${isMobile ? 'px-4' : ''}`}>
                            <h3 style={{
                                fontFamily: 'Bricolage Grotesque, sans-serif',
                                fontSize: isMobile ? '14px' : '18px',
                                fontWeight: '500',
                                color: '#000000'
                            }}>
                                Pending requests {'>'}
                            </h3>
                            <div className={`flex items-center gap-3 ${isMobile ? 'ml-auto' : ''}`} style={isMobile ? { marginRight: '-8px' } : {}}>
                                <button
                                    className="rounded-full flex items-center justify-center transition-all duration-200"
                                    style={{
                                        width: isMobile ? '16px' : '20px',
                                        height: isMobile ? '16px' : '20px'
                                    }}
                                    aria-label="Previous"
                                >
                                    <img src={grayArrowIcon} alt="Previous" className="w-full h-full" />
                                </button>
                                <button
                                    className="rounded-full flex items-center justify-center transition-all duration-200"
                                    style={{
                                        width: isMobile ? '16px' : '20px',
                                        height: isMobile ? '16px' : '20px'
                                    }}
                                    aria-label="Next"
                                >
                                    <img src={blackArrowIcon} alt="Next" className="w-full h-full" />
                                </button>
                            </div>
                        </div>
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
                                className={isMobile ? "flex gap-4 mb-6 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6"}
                                style={isMobile ? {
                                    paddingLeft: '16px',
                                    paddingRight: '16px',
                                    paddingTop: '8px',
                                    paddingBottom: '8px',
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                    WebkitOverflowScrolling: 'touch'
                                } : {}}
                            >
                                {pendingRequests.slice(0, 3).map((request) => renderGridCard(request))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Completed requests Section (First Row) */}
                {completedRequests.length > 0 && (
                    <div className="mb-12">
                        <div className={`flex items-center justify-between mb-6 ${isMobile ? 'px-4' : ''}`}>
                            <h3 style={{
                                fontFamily: 'Bricolage Grotesque, sans-serif',
                                fontSize: isMobile ? '14px' : '18px',
                                fontWeight: '500',
                                color: '#000000'
                            }}>
                                Completed requests {'>'}
                            </h3>
                            <div className={`flex items-center gap-3 ${isMobile ? 'ml-auto' : ''}`} style={isMobile ? { marginRight: '-8px' } : {}}>
                                <button
                                    className="rounded-full flex items-center justify-center transition-all duration-200"
                                    style={{
                                        width: isMobile ? '16px' : '20px',
                                        height: isMobile ? '16px' : '20px'
                                    }}
                                    aria-label="Previous"
                                >
                                    <img src={grayArrowIcon} alt="Previous" className="w-full h-full" />
                                </button>
                                <button
                                    className="rounded-full flex items-center justify-center transition-all duration-200"
                                    style={{
                                        width: isMobile ? '16px' : '20px',
                                        height: isMobile ? '16px' : '20px'
                                    }}
                                    aria-label="Next"
                                >
                                    <img src={blackArrowIcon} alt="Next" className="w-full h-full" />
                                </button>
                            </div>
                        </div>
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
                                className={isMobile ? "flex gap-4 mb-6 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6"}
                                style={isMobile ? {
                                    paddingLeft: '16px',
                                    paddingRight: '16px',
                                    paddingTop: '8px',
                                    paddingBottom: '8px',
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                    WebkitOverflowScrolling: 'touch'
                                } : {}}
                            >
                                {completedRequests.slice(0, 3).map((request) => renderGridCard(request))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Expired requests Section */}
                {expiredRequests.length > 0 && (
                    <div className="mb-12">
                        <div className={`flex items-center justify-between mb-6 ${isMobile ? 'px-4' : ''}`}>
                            <h3 style={{
                                fontFamily: 'Bricolage Grotesque, sans-serif',
                                fontSize: isMobile ? '14px' : '18px',
                                fontWeight: '500',
                                color: '#000000'
                            }}>
                                Expired requests {'>'}
                            </h3>
                            <div className={`flex items-center gap-3 ${isMobile ? 'ml-auto' : ''}`} style={isMobile ? { marginRight: '-8px' } : {}}>
                                <button
                                    className="rounded-full flex items-center justify-center transition-all duration-200"
                                    style={{
                                        width: isMobile ? '16px' : '20px',
                                        height: isMobile ? '16px' : '20px'
                                    }}
                                    aria-label="Previous"
                                >
                                    <img src={grayArrowIcon} alt="Previous" className="w-full h-full" />
                                </button>
                                <button
                                    className="rounded-full flex items-center justify-center transition-all duration-200"
                                    style={{
                                        width: isMobile ? '16px' : '20px',
                                        height: isMobile ? '16px' : '20px'
                                    }}
                                    aria-label="Next"
                                >
                                    <img src={blackArrowIcon} alt="Next" className="w-full h-full" />
                                </button>
                            </div>
                        </div>
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
                                className={isMobile ? "flex gap-4 mb-6 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6"}
                                style={isMobile ? {
                                    paddingLeft: '16px',
                                    paddingRight: '16px',
                                    paddingTop: '8px',
                                    paddingBottom: '8px',
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                    WebkitOverflowScrolling: 'touch'
                                } : {}}
                            >
                                {expiredRequests.slice(0, 3).map((request) => renderGridCard(request))}
                            </div>
                        </div>
                    </div>
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
                overflow: 'visible'
            }}
        >
            {/* Table Header */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 2fr 1.5fr 1.5fr 1.2fr 1.2fr 0.6fr',
                    gap: '6px',
                    padding: '16px 16px 16px 0px'
                }}
            >
                {/* Column 1: Creation date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                    <span style={{ color: '#B0B0B0', fontSize: '12px', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 400 }}>Creation date</span>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                    <span style={{ color: '#B0B0B0', fontSize: '12px', fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>Product Name</span>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                    <span style={{ color: '#B0B0B0', fontSize: '12px', fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>Location</span>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                    <span style={{ color: '#B0B0B0', fontSize: '12px', fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>Origin Of Product</span>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                    <span style={{ color: '#B0B0B0', fontSize: '12px', fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>Price</span>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                    <span style={{ color: '#B0B0B0', fontSize: '12px', fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>Status</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 0L7.4641 3.5H0.535898L4 0Z" stroke="#939393" strokeWidth="1" fill="none" />
                        </svg>
                        <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4L0.535898 0.5H7.4641L4 4Z" stroke="#939393" strokeWidth="1" fill="none" />
                        </svg>
                    </div>
                </div>
                {/* Column 7: More Options - No title */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                </div>
            </div>
            {/* Header Divider */}
            <div style={{ height: '1px', backgroundColor: '#E4E4E4', margin: '0 16px 0 0px' }} />

            {/* Table Rows */}
            {sortedRequests.map((request, index) => (
                <div key={request.id}>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1.5fr 2fr 1.5fr 1.5fr 1.2fr 1.2fr 0.6fr',
                            gap: '6px',
                            padding: '14px 16px 14px 0px',
                            alignItems: 'center'
                        }}
                    >
                        {/* Column 1: Creation date */}
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                                {formatDate(request.createdAt)}
                            </span>
                        </div>

                        {/* Column 2: Product Name */}
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Poppins, sans-serif' }}>
                                {request.productName}
                            </span>
                        </div>

                        {/* Column 3: Location */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                            {request.sellerLocation && (() => {
                                const country = getProductCountry(request.sellerLocation);
                                return (
                                    <>
                                        {country.flag ? (
                                            <img
                                                src={country.flag}
                                                alt={country.name || 'Location'}
                                                style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                    flexShrink: 0
                                                }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '16px',
                                                height: '16px',
                                                borderRadius: '50%',
                                                backgroundColor: '#F4F4F4',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <span style={{ fontSize: '8px', color: '#B0B0B0' }}>?</span>
                                            </div>
                                        )}
                                        <span
                                            style={{
                                                color: '#939393',
                                                fontSize: '12px',
                                                fontFamily: 'Poppins, sans-serif',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: '120px'
                                            }}
                                        >
                                            {request.sellerLocation}
                                        </span>
                                    </>
                                );
                            })()}
                        </div>

                        {/* Column 4: Origin Of Product */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                            {request.origin && (() => {
                                const country = getProductCountry(request.origin);
                                return (
                                    <>
                                        <img
                                            src={country.flag}
                                            alt={country.name}
                                            style={{
                                                width: '16px',
                                                height: '16px',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                flexShrink: 0
                                            }}
                                        />
                                        <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Poppins, sans-serif' }}>
                                            {country.name}
                                        </span>
                                    </>
                                );
                            })()}
                        </div>

                        {/* Column 5: Price */}
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ color: '#939393', fontSize: '12px', fontFamily: 'Poppins, sans-serif' }}>
                                {formatPriceRange(request.minPrice, request.maxPrice, request.currency).replace(' - ', ' ~ ')}
                            </span>
                        </div>

                        {/* Column 6: Status */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {renderStatusBadge(request.id)}
                        </div>

                        {/* Column 7: More Options */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingLeft: '8px' }} onClick={(e) => e.stopPropagation()}>
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
                                            top: '32px',
                                            right: '0',
                                            backgroundColor: '#FFFFFF',
                                            borderRadius: '12px',
                                            border: '1px solid #E9E9E9',
                                            boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                                            padding: '8px',
                                            minWidth: '180px',
                                            zIndex: 10000,
                                            isolation: 'isolate'
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedRequestForView(request);
                                                setViewRequestModalOpen(true);
                                                setMoreOptionsOpenFor(null);
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
                                                e.currentTarget.style.backgroundColor = '#FAFAFA';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#939393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                            <span style={{ color: '#939393', fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>View the request</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setRequestToDelete(request);
                                                setIsDeleteSuccess(false);
                                                setDeleteReason('');
                                                setMoreOptionsOpenFor(null);
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
                                            <span style={{ color: '#FF5151', fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>Delete request</span>
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
                    {index < sortedRequests.length - 1 && (
                        <div style={{ height: '1px', backgroundColor: '#E4E4E4', margin: '0 16px 0 0px' }} />
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
        inactive: 'brightness(0) saturate(100%) invert(73%) sepia(52%) saturate(1685%) hue-rotate(176deg) brightness(103%) contrast(95%)'
    };

    // Mobile Search View
    if (showMobileSearch && isMobile) {
        const mobileSearchFiltered = mobileSearchSubmitted ? requests.filter(request => {
            const query = mobileSearchQuery.toLowerCase().trim();
            return (
                request.productName.toLowerCase().includes(query) ||
                request.sellerLocation.toLowerCase().includes(query) ||
                (request.origin && request.origin.toLowerCase().includes(query)) ||
                (request.description && request.description.toLowerCase().includes(query))
            );
        }) : [];

        const hasSearchResults = mobileSearchSubmitted && mobileSearchQuery.trim() !== '' && mobileSearchFiltered.length > 0;
        const isNoResults = mobileSearchSubmitted && mobileSearchQuery.trim() !== '' && mobileSearchFiltered.length === 0;
        const showSearchButton = !mobileSearchSubmitted || (mobileSearchSubmitted && mobileSearchFiltered.length === 0 && mobileSearchQuery.trim() === '');

        return (
            <div className="bg-white min-h-screen flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {/* Search Bar at Top */}
                <div className="px-4 pt-4 pb-3">
                    <div
                        className="flex items-center gap-3 px-3 py-2 bg-white"
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
                        <input
                            type="text"
                            value={mobileSearchQuery}
                            onChange={(e) => setMobileSearchQuery(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && mobileSearchQuery.trim()) {
                                    setMobileSearchSubmitted(true);
                                }
                            }}
                            className="flex-1 outline-none"
                            style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#212121' }}
                            placeholder="Search requests..."
                            autoFocus
                        />
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
                        <div className="flex flex-col items-center justify-center" style={{ paddingTop: '140px' }}>
                            <img src={bagIcon} alt="No requests" style={{ width: '50px', height: '50px', marginBottom: '14px', opacity: 0.3 }} />
                            <p style={{ color: '#939393', fontSize: '11px', textAlign: 'center', marginBottom: '14px', lineHeight: '1.5' }}>
                                No requests found. Please try adjusting<br />your search criteria.
                            </p>
                        </div>
                    )}

                    {hasSearchResults && (
                        <div className="grid grid-cols-1 gap-4">
                            {mobileSearchFiltered.map((request) => renderGridCard(request))}
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
                    {!isMobile && totalRequests > 0 && (
                        <div className="max-w-6xl mx-auto w-full pl-0 pr-0 mt-6 mb-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pl-0 lg:pl-0 lg:-ml-16 w-full">
                                {/* Left Side - Filters */}
                                <div className="flex items-center gap-3 flex-wrap">
                                    {/* All Requests Badge */}
                                    {!isSearchActive && (
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
                                                    {secondaryOptions.map((child) => {
                                                        const isSelected = child.key === selectedSecondaryKey && selectedPrimaryKey === (hoveredPrimarySort ?? selectedPrimaryKey);
                                                        const isHovered = child.key === hoveredSecondarySort;
                                                        const backgroundColor = isSelected ? '#F0F8FE' : isHovered ? '#FAFAFA' : 'transparent';
                                                        const textColor = isSelected ? '#64B5F6' : '#939393';
                                                        return (
                                                            <button
                                                                key={child.key}
                                                                type="button"
                                                                onMouseEnter={() => setHoveredSecondarySort(child.key)}
                                                                onClick={() => {
                                                                    if (child.value) {
                                                                        setSelectedSort({ label: `${sortOptions.find(o => o.key === (hoveredPrimarySort ?? selectedPrimaryKey))?.label}: ${child.label}`, value: child.value });
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
                                                                    justifyContent: 'flex-start',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <span>{child.label}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
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
                                                        {option === 'Ongoing' && (
                                                            <div className="flex items-center gap-1">
                                                                <span style={{ color: '#64B5F6' }}>Ongoing</span>
                                                            </div>
                                                        )}
                                                        {option === 'Pending' && (
                                                            <div className="flex items-center gap-1">
                                                                <span style={{ color: '#6A6A6A' }}>Pending</span>
                                                            </div>
                                                        )}
                                                        {option === 'Completed' && (
                                                            <div className="flex items-center gap-1">
                                                                <span style={{ color: '#4CD964' }}>Completed</span>
                                                            </div>
                                                        )}
                                                        {option === 'Expired' && (
                                                            <div className="flex items-center gap-1">
                                                                <span style={{ color: '#FF5151' }}>Expired</span>
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="max-w-[78rem] mx-auto w-full pl-0 pr-0">
                        <div className="lg:-ml-8 w-full">
                            {isLoadingRequests ? (
                                <div className="text-center" style={{ padding: isMobile ? '32px 16px' : '48px 16px' }}>
                                    <p style={{
                                        fontSize: isMobile ? '12px' : '18px',
                                        color: '#6A6A6A',
                                        fontFamily: 'Poppins, sans-serif',
                                    }}>
                                        Loading your requests...
                                    </p>
                                </div>
                            ) : shouldShowEmptyState ? (
                                <div className="text-center" style={{ padding: isMobile ? '32px 16px' : '48px 16px' }}>
                                    {/* Shopping Bag with Magnifying Glass Icon */}
                                    <img
                                        src={bagIcon}
                                        alt="No requests found"
                                        className="mx-auto"
                                        style={{
                                            width: isMobile ? '40px' : '60px',
                                            height: isMobile ? '40px' : '60px',
                                            marginBottom: isMobile ? '12px' : '16px'
                                        }}
                                    />

                                    {/* Message */}
                                    <p style={{
                                        fontSize: isMobile ? '12px' : '18px',
                                        color: '#6A6A6A',
                                        fontFamily: 'Poppins, sans-serif',
                                        maxWidth: isMobile ? '280px' : '500px',
                                        margin: isMobile ? '0 auto 12px' : '0 auto 16px',
                                        lineHeight: '1.5'
                                    }}>
                                        Can't find what you're looking for? don't worry, just ask for it and we will bring it for you.
                                    </p>

                                    {/* Make a Request Button */}
                                    <button
                                        onClick={handleMakeRequestClick}
                                        className="inline-flex items-center mx-auto"
                                        style={{
                                            display: 'flex',
                                            padding: isMobile ? '8px 16px' : '10px 20px',
                                            alignItems: 'center',
                                            gap: isMobile ? '4px' : '6px',
                                            borderRadius: '8px',
                                            backgroundColor: '#F0F8FE',
                                            color: '#64B5F6',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: isMobile ? '11px' : '14px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        <img src={draftsIcon} alt="Request" style={{ width: isMobile ? '14px' : '20px', height: isMobile ? '14px' : '20px' }} />
                                        <span>Make a request</span>
                                    </button>
                                </div>
                            ) : (
                                isMobile ? renderRequestsGrid() : (viewMode === 'list' ? renderRequestsList() : renderRequestsGrid())
                            )}
                        </div>
                    </div>
                </div>

                {/* View Request Modal */}
                {viewRequestModalOpen && selectedRequestForView && (
                    <>
                        {/* Overlay */}
                        <div
                            className="fixed inset-0 z-50"
                            style={{ backgroundColor: '#0000001A' }}
                            onClick={() => {
                                setViewRequestModalOpen(false);
                                setSelectedRequestForView(null);
                            }}
                        />
                        {isMobile ? (
                            // Mobile: Bottom sheet
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
                                                setViewRequestModalOpen(false);
                                                setSelectedRequestForView(null);
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
                                            {selectedRequestForView.productName}
                                        </h2>

                                        {/* Description */}
                                        {selectedRequestForView.description && (
                                            <p
                                                className="text-xs text-center mb-5"
                                                style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif', lineHeight: '1.5' }}
                                            >
                                                {selectedRequestForView.description}
                                            </p>
                                        )}

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
                                                <span style={{ fontSize: '12px', color: '#64B5F6', fontWeight: 400 }}>{selectedRequestForView.sellerLocation}</span>
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
                                                    <span style={{ fontSize: '12px', color: '#64B5F6', fontWeight: 400 }}>{formatPriceRange(selectedRequestForView.minPrice, selectedRequestForView.maxPrice, selectedRequestForView.currency).replace(' - ', ' ~ ')}</span>
                                                </div>

                                                {/* Country Badge */}
                                                {selectedRequestForView.origin && (() => {
                                                    const country = getProductCountry(selectedRequestForView.origin);
                                                    return (
                                                        <div
                                                            className="flex items-center gap-1.5 px-3 py-1.5"
                                                            style={{ backgroundColor: '#F0F8FE', borderRadius: '6px' }}
                                                        >
                                                            <img
                                                                src={country.flag}
                                                                alt={country.name}
                                                                className="w-4 h-4 object-cover rounded-full"
                                                            />
                                                            <span style={{ fontSize: '12px', color: '#64B5F6', fontWeight: 400 }}>{country.name}</span>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>

                                        {/* Footer Buttons */}
                                        <div style={{ display: 'flex', gap: isMobile ? '12px' : '8px', justifyContent: isMobile ? 'center' : 'space-between', marginTop: 'auto', paddingTop: '20px', paddingBottom: '20px' }}>
                                            {/* Delete Button */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setRequestToDelete(selectedRequestForView);
                                                    setIsDeleteSuccess(false);
                                                    setDeleteReason('');
                                                    setViewRequestModalOpen(false);
                                                    setSelectedRequestForView(null);
                                                }}
                                                style={{
                                                    backgroundColor: '#FFFFFF',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: isMobile ? '6px' : '8px',
                                                    padding: isMobile ? '5px 16px' : '8px 16px'
                                                }}
                                            >
                                                <img src={trashIcon} alt="Delete" style={{ width: isMobile ? '12px' : '16px', height: isMobile ? '12px' : '16px', filter: 'brightness(0) saturate(100%) invert(53%) sepia(46%) saturate(3205%) hue-rotate(332deg) brightness(103%) contrast(102%)' }} />
                                                <span style={{ color: '#FF5151', fontFamily: 'Poppins, sans-serif', fontSize: isMobile ? '11px' : '14px' }}>Delete the request</span>
                                            </button>

                                            {/* Close Button */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setViewRequestModalOpen(false);
                                                    setSelectedRequestForView(null);
                                                }}
                                                style={{
                                                    backgroundColor: '#212121',
                                                    borderRadius: isMobile ? '10px' : '12px',
                                                    border: 'none',
                                                    padding: isMobile ? '5px 20px' : '8px 40px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: isMobile ? '6px' : '8px'
                                                }}
                                            >
                                                <svg width={isMobile ? "12" : "16"} height={isMobile ? "12" : "16"} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M18 6L6 18M6 6l12 12" />
                                                </svg>
                                                <span style={{ color: '#FFFFFF', fontFamily: 'Poppins, sans-serif', fontSize: isMobile ? '11px' : '14px' }}>Close</span>
                                            </button>
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
                            </div>
                        ) : (
                            // Desktop: Centered modal
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                                        onClick={() => {
                                            setViewRequestModalOpen(false);
                                            setSelectedRequestForView(null);
                                        }}
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
                                        {selectedRequestForView.productName}
                                    </h2>

                                    {/* Description */}
                                    {selectedRequestForView.description && (
                                        <p
                                            className="text-xs text-center mb-5"
                                            style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif', lineHeight: '1.5' }}
                                        >
                                            {selectedRequestForView.description}
                                        </p>
                                    )}

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
                                            <span style={{ fontSize: '12px', color: '#64B5F6', fontWeight: 400 }}>{selectedRequestForView.sellerLocation}</span>
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
                                                <span style={{ fontSize: '12px', color: '#64B5F6', fontWeight: 400 }}>{formatPriceRange(selectedRequestForView.minPrice, selectedRequestForView.maxPrice, selectedRequestForView.currency).replace(' - ', ' ~ ')}</span>
                                            </div>

                                            {/* Country Badge */}
                                            {selectedRequestForView.origin && (() => {
                                                const country = getProductCountry(selectedRequestForView.origin);
                                                return (
                                                    <div
                                                        className="flex items-center gap-1.5 px-3 py-1.5"
                                                        style={{ backgroundColor: '#F0F8FE', borderRadius: '6px' }}
                                                    >
                                                        <img
                                                            src={country.flag}
                                                            alt={country.name}
                                                            className="w-4 h-4 object-cover rounded-full"
                                                        />
                                                        <span style={{ fontSize: '12px', color: '#64B5F6', fontWeight: 400 }}>{country.name}</span>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {/* Footer Buttons */}
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '20px', paddingBottom: '20px' }}>
                                        {/* Delete Button */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setRequestToDelete(selectedRequestForView);
                                                setIsDeleteSuccess(false);
                                                setDeleteReason('');
                                                setViewRequestModalOpen(false);
                                                setSelectedRequestForView(null);
                                            }}
                                            style={{
                                                backgroundColor: '#FFFFFF',
                                                border: 'none',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '8px 16px'
                                            }}
                                        >
                                            <img src={trashIcon} alt="Delete" style={{ width: '16px', height: '16px', filter: 'brightness(0) saturate(100%) invert(53%) sepia(46%) saturate(3205%) hue-rotate(332deg) brightness(103%) contrast(102%)' }} />
                                            <span style={{ color: '#FF5151', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>Delete the request</span>
                                        </button>

                                        {/* Close Button */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setViewRequestModalOpen(false);
                                                setSelectedRequestForView(null);
                                            }}
                                            style={{
                                                backgroundColor: '#212121',
                                                borderRadius: '12px',
                                                border: 'none',
                                                padding: '8px 40px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 6L6 18M6 6l12 12" />
                                            </svg>
                                            <span style={{ color: '#FFFFFF', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>Close</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Delete Confirmation Modal */}
                {requestToDelete && (
                    <>
                        {/* Overlay */}
                        <div
                            className="fixed inset-0 z-50"
                            style={{ backgroundColor: '#0000001A' }}
                            onClick={handleDeleteClose}
                        />
                        {isMobile ? (
                            // Mobile: Bottom sheet
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
                                            type="button"
                                            onClick={handleDeleteClose}
                                            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18 6L6 18M6 6l12 12" stroke="#BABABA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>

                                        {isDeleteSuccess ? (
                                            <>
                                                {/* Success Icon */}
                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '12px' }}>
                                                    <img
                                                        src={verityIcon}
                                                        alt="Success"
                                                        style={{ width: '80px', height: '80px' }}
                                                    />
                                                </div>

                                                {/* Success Text */}
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
                                                        The request "{requestToDelete.productName}" has been successfully removed.
                                                    </p>
                                                </div>

                                                {/* Close Button */}
                                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                                    <button
                                                        type="button"
                                                        onClick={handleDeleteClose}
                                                        style={{
                                                            backgroundColor: '#F9A825',
                                                            borderRadius: '12px',
                                                            border: 'none',
                                                            padding: isMobile ? '8px 120px' : '10px 140px',
                                                            cursor: 'pointer',
                                                            color: '#FFFFFF',
                                                            fontFamily: 'Poppins, sans-serif',
                                                            fontSize: isMobile ? '13px' : '14px',
                                                            fontWeight: 300
                                                        }}
                                                    >
                                                        Close
                                                    </button>
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
                                            </>
                                        ) : (
                                            <>
                                                {/* Delete Icon */}
                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '12px' }}>
                                                    <img
                                                        src={redtrashIcon}
                                                        alt="Delete"
                                                        style={{ width: '80px', height: '80px' }}
                                                    />
                                                </div>

                                                {/* Title */}
                                                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                                    <p
                                                        style={{
                                                            color: '#212121',
                                                            fontFamily: 'Bricolage Grotesque, sans-serif',
                                                            fontSize: '16px',
                                                            lineHeight: '1.5',
                                                            margin: 0,
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        Why did you delete your request?
                                                    </p>
                                                </div>

                                                {/* Radio Options */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                                                    <label
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '12px',
                                                            cursor: 'pointer',
                                                            padding: '8px',
                                                            borderRadius: '8px',
                                                            backgroundColor: deleteReason === 'got' ? '#F0F8FE' : 'transparent',
                                                            transition: 'background-color 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (deleteReason !== 'got') {
                                                                e.currentTarget.style.backgroundColor = '#FAFAFA';
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (deleteReason !== 'got') {
                                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                            }
                                                        }}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="deleteReason"
                                                            value="got"
                                                            checked={deleteReason === 'got'}
                                                            onChange={(e) => setDeleteReason(e.target.value)}
                                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                                        />
                                                        <span style={{ color: '#939393', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>
                                                            I got what I was looking for
                                                        </span>
                                                    </label>
                                                    <label
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '12px',
                                                            cursor: 'pointer',
                                                            padding: '8px',
                                                            borderRadius: '8px',
                                                            backgroundColor: deleteReason === 'not_got' ? '#F0F8FE' : 'transparent',
                                                            transition: 'background-color 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (deleteReason !== 'not_got') {
                                                                e.currentTarget.style.backgroundColor = '#FAFAFA';
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (deleteReason !== 'not_got') {
                                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                            }
                                                        }}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="deleteReason"
                                                            value="not_got"
                                                            checked={deleteReason === 'not_got'}
                                                            onChange={(e) => setDeleteReason(e.target.value)}
                                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                                        />
                                                        <span style={{ color: '#939393', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>
                                                            I didn't get what I was looking for
                                                        </span>
                                                    </label>
                                                    <label
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '12px',
                                                            cursor: 'pointer',
                                                            padding: '8px',
                                                            borderRadius: '8px',
                                                            backgroundColor: deleteReason === 'other' ? '#F0F8FE' : 'transparent',
                                                            transition: 'background-color 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (deleteReason !== 'other') {
                                                                e.currentTarget.style.backgroundColor = '#FAFAFA';
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (deleteReason !== 'other') {
                                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                            }
                                                        }}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="deleteReason"
                                                            value="other"
                                                            checked={deleteReason === 'other'}
                                                            onChange={(e) => setDeleteReason(e.target.value)}
                                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                                        />
                                                        <span style={{ color: '#939393', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>
                                                            Other
                                                        </span>
                                                    </label>
                                                </div>

                                                {/* Buttons */}
                                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
                                                    <button
                                                        type="button"
                                                        onClick={handleDeleteClose}
                                                        style={{
                                                            backgroundColor: '#F1F1F1',
                                                            borderRadius: '12px',
                                                            border: 'none',
                                                            padding: isMobile ? '6px 40px' : '8px 48px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px'
                                                        }}
                                                    >
                                                        <svg width={isMobile ? "14" : "16"} height={isMobile ? "14" : "16"} viewBox="0 0 24 24" fill="none" stroke="#6A6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M18 6L6 18M6 6l12 12" />
                                                        </svg>
                                                        <span style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif', fontSize: isMobile ? '13px' : '14px' }}>Cancel</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleConfirmDelete}
                                                        disabled={!deleteReason}
                                                        style={{
                                                            backgroundColor: deleteReason ? '#FF5151' : '#FFB3B3',
                                                            borderRadius: '12px',
                                                            border: 'none',
                                                            padding: isMobile ? '6px 40px' : '8px 48px',
                                                            cursor: deleteReason ? 'pointer' : 'not-allowed',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            opacity: deleteReason ? 1 : 0.6
                                                        }}
                                                    >
                                                        <img src={trashIcon} alt="Delete" style={{ width: isMobile ? '14px' : '16px', height: isMobile ? '14px' : '16px', filter: 'brightness(0) invert(1)' }} />
                                                        <span style={{ color: '#FFFFFF', fontFamily: 'Poppins, sans-serif', fontSize: isMobile ? '13px' : '14px' }}>Delete</span>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Desktop: Centered modal
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                <div
                                    style={{
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: '30px',
                                        boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                                        padding: '30px',
                                        paddingBottom: '15px',
                                        maxWidth: '420px',
                                        width: '90%',
                                        minHeight: isDeleteSuccess ? '320px' : '400px',
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

                                    {isDeleteSuccess ? (
                                        <>
                                            {/* Success Icon */}
                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '12px' }}>
                                                <img
                                                    src={verityIcon}
                                                    alt="Success"
                                                    style={{ width: '80px', height: '80px' }}
                                                />
                                            </div>

                                            {/* Success Text */}
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
                                                    The request "{requestToDelete.productName}" has been successfully removed.
                                                </p>
                                            </div>

                                            {/* Close Button */}
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
                                        </>
                                    ) : (
                                        <>
                                            {/* Delete Icon */}
                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '12px' }}>
                                                <img
                                                    src={redtrashIcon}
                                                    alt="Delete"
                                                    style={{ width: '80px', height: '80px' }}
                                                />
                                            </div>

                                            {/* Title */}
                                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                                <p
                                                    style={{
                                                        color: '#212121',
                                                        fontFamily: 'Bricolage Grotesque, sans-serif',
                                                        fontSize: '16px',
                                                        lineHeight: '1.5',
                                                        margin: 0,
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    Why did you delete your request?
                                                </p>
                                            </div>

                                            {/* Radio Options */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                                                <label
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px',
                                                        cursor: 'pointer',
                                                        padding: '8px',
                                                        borderRadius: '8px',
                                                        backgroundColor: deleteReason === 'got' ? '#F0F8FE' : 'transparent',
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (deleteReason !== 'got') {
                                                            e.currentTarget.style.backgroundColor = '#FAFAFA';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (deleteReason !== 'got') {
                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                        }
                                                    }}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="deleteReason"
                                                        value="got"
                                                        checked={deleteReason === 'got'}
                                                        onChange={(e) => setDeleteReason(e.target.value)}
                                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                                    />
                                                    <span style={{ color: '#939393', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>
                                                        I got what I was looking for
                                                    </span>
                                                </label>
                                                <label
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px',
                                                        cursor: 'pointer',
                                                        padding: '8px',
                                                        borderRadius: '8px',
                                                        backgroundColor: deleteReason === 'not_got' ? '#F0F8FE' : 'transparent',
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (deleteReason !== 'not_got') {
                                                            e.currentTarget.style.backgroundColor = '#FAFAFA';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (deleteReason !== 'not_got') {
                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                        }
                                                    }}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="deleteReason"
                                                        value="not_got"
                                                        checked={deleteReason === 'not_got'}
                                                        onChange={(e) => setDeleteReason(e.target.value)}
                                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                                    />
                                                    <span style={{ color: '#939393', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>
                                                        I didn't get what I was looking for
                                                    </span>
                                                </label>
                                                <label
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px',
                                                        cursor: 'pointer',
                                                        padding: '8px',
                                                        borderRadius: '8px',
                                                        backgroundColor: deleteReason === 'other' ? '#F0F8FE' : 'transparent',
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (deleteReason !== 'other') {
                                                            e.currentTarget.style.backgroundColor = '#FAFAFA';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (deleteReason !== 'other') {
                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                        }
                                                    }}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="deleteReason"
                                                        value="other"
                                                        checked={deleteReason === 'other'}
                                                        onChange={(e) => setDeleteReason(e.target.value)}
                                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                                    />
                                                    <span style={{ color: '#939393', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>
                                                        Other
                                                    </span>
                                                </label>
                                            </div>

                                            {/* Buttons */}
                                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
                                                <button
                                                    type="button"
                                                    onClick={handleDeleteClose}
                                                    style={{
                                                        backgroundColor: '#F1F1F1',
                                                        borderRadius: '12px',
                                                        border: 'none',
                                                        padding: '8px 48px',
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
                                                    disabled={!deleteReason}
                                                    style={{
                                                        backgroundColor: deleteReason ? '#FF5151' : '#FFB3B3',
                                                        borderRadius: '12px',
                                                        border: 'none',
                                                        padding: '8px 48px',
                                                        cursor: deleteReason ? 'pointer' : 'not-allowed',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        opacity: deleteReason ? 1 : 0.6
                                                    }}
                                                >
                                                    <img src={trashIcon} alt="Delete" style={{ width: '16px', height: '16px', filter: 'brightness(0) invert(1)' }} />
                                                    <span style={{ color: '#FFFFFF', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>Delete</span>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Request Modal */}
                {showRequestModal && isMobile ? (
                    // Mobile: Full Page Form
                    <div className="fixed inset-0 bg-white z-50 flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {/* Header with Title and X Button */}
                        <div className="flex items-center justify-between px-4 pt-4 pb-3">
                            <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#171717', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
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
                                                value={location}
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
                                                {ukCities.map((city) => (
                                                    <button
                                                        key={city}
                                                        type="button"
                                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                                                        onClick={() => {
                                                            setLocation(`${city} | United Kingdom`);
                                                            setIsLocationDropdownOpen(false);
                                                        }}
                                                        style={{ fontSize: '10px' }}
                                                    >
                                                        {city}
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
                                            {range}
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
                                    More than 200 GBP
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
                                    cursor: isSubmittingRequest ? 'not-allowed' : 'pointer',
                                    marginTop: '20px',
                                    fontSize: '11px',
                                    fontFamily: 'Poppins, sans-serif',
                                    fontWeight: '400',
                                    margin: '0 auto',
                                    opacity: isSubmittingRequest ? 0.7 : 1
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleRequestSubmit(e as any);
                                }}
                                disabled={isSubmittingRequest}
                            >
                                {isSubmittingRequest ? 'Submitting...' : 'Create the request'}
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
                                            value={location}
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
                                                {ukCities.map((city) => (
                                                    <button
                                                        key={city}
                                                        type="button"
                                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                                                        onClick={() => {
                                                            setLocation(`${city} | United Kingdom`);
                                                            setIsLocationDropdownOpen(false);
                                                        }}
                                                    >
                                                        {city}
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
                                            {range}
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
                                    More than 200 GBP
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
                                    cursor: isSubmittingRequest ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontFamily: 'Poppins, sans-serif',
                                    fontWeight: '400',
                                    margin: '0 auto',
                                    opacity: isSubmittingRequest ? 0.7 : 1
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleRequestSubmit(e as any);
                                }}
                                disabled={isSubmittingRequest}
                            >
                                {isSubmittingRequest ? 'Submitting...' : 'Create the request'}
                            </button>
                        </div>
                    </div>
                ) : null}

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
        </>
    );
};

export default MyRequests;

