import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import sellerAvatar from '../assets/images/logos/avatar.png';
import defaultCoverImage from '../assets/images/logos/8.png';
import arrowLeftIcon from '../assets/images/pre/arrow-left.svg';
import verifyIcon from '../assets/images/pre/verify.svg';
import logoIcon from '../assets/images/logos/ba-brand-icon-colored.png';
import whatsappIcon from '../assets/images/pre/zap.svg';
import instagramIcon from '../assets/images/pre/ig.svg';
import facebookIcon from '../assets/images/pre/fb.svg';
import locationIcon from '../assets/images/pre/PL.svg';
import profileIcon from '../assets/images/pre/profile.svg';
import likeIcon from '../assets/images/pre/like.svg';
import dislikeIcon from '../assets/images/pre/dislike.svg';
import grayArrowIcon from '../assets/images/pre/gray.svg';
import blackArrowIcon from '../assets/images/pre/black.svg';
import bookmarkIcon from '../assets/images/pre/bm.svg';
import shareIcon from '../assets/images/pre/Share.svg';
import warningIcon from '../assets/images/pre/warning.svg';
import fbIcon from '../assets/images/pre/FB1.svg';
import igIcon from '../assets/images/pre/IG1.svg';
import xIcon from '../assets/images/pre/x.svg';
import tgIcon from '../assets/images/pre/tg.svg';
import zapIcon from '../assets/images/pre/zap1.svg';

// Interfaces for API responses
interface UserProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  bio: string | null;
  location: string | null;
  isVerifiedSeller: boolean;
  createdAt: string;
  rating: number;
  totalReviews: number;
}

interface ReviewUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
}

interface SellerReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  productId: string;
  productTitle: string;
  user: ReviewUser;
  helpfulYesCount: number;
  helpfulNoCount: number;
}

interface SellerReviewsSummary {
  reviews: SellerReview[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [rating: number]: number };
  totalPages: number;
  currentPage: number;
}

const UserAccount: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabFromUrl = searchParams.get('tab') as 'reviews' | 'items' | null;
  const [activeTab, setActiveTab] = useState<'reviews' | 'items'>(tabFromUrl || 'reviews');
  const [sharedProducts, setSharedProducts] = useState<Set<string>>(new Set());
  const [wishlistProducts, setWishlistProducts] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  // Profile and reviews state from backend
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [reviewsSummary, setReviewsSummary] = useState<SellerReviewsSummary | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  const API_BASE = process.env.REACT_APP_API_URL;

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setFilterDropdownOpen(false);
      }
      if (optionsModalRef.current && !optionsModalRef.current.contains(event.target as Node)) {
        setShowOptionsModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleShareProduct = (productId: string) => {
    const newSet = new Set(sharedProducts);
    if (newSet.has(productId)) {
      newSet.delete(productId);
    } else {
      newSet.add(productId);
      // Simulate sharing functionality
      if (navigator.share) {
        navigator.share({
          title: 'BaoAfrik Product',
          text: 'Check out this product on BaoAfrik!',
          url: window.location.href
        }).catch(console.error);
      } else {
        // Fallback for browsers without Web Share API
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('Product link copied to clipboard!');
        }).catch(() => {
          alert('Product shared!');
        });
      }
    }
    setSharedProducts(newSet);
  };

  const [expandedDiscussions, setExpandedDiscussions] = useState<{ [key: string]: boolean }>({});
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('The most relevant');
  const [userRating, setUserRating] = useState(0);
  const [userReviewText, setUserReviewText] = useState('');
  const [reviewHelpfulness, setReviewHelpfulness] = useState<{ [key: string]: 'yes' | 'no' | null }>({});
  const [reviewHelpfulCounts, setReviewHelpfulCounts] = useState<{ [key: string]: { yes: number; no: number } }>({});
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const optionsModalRef = useRef<HTMLDivElement>(null);
  const { sellerId } = useParams<{ sellerId: string }>();

  // Determine the user ID to fetch - either from URL param or current user
  const profileUserId = sellerId || user?.id;

  // Fetch user profile from backend
  const loadUserProfile = useCallback(async () => {
    if (!profileUserId) return;

    try {
      setIsLoadingProfile(true);
      const response = await fetch(`${API_BASE}/products/user/${profileUserId}/profile`);

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setUserProfile(result.data);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [profileUserId, API_BASE]);

  // Fetch seller reviews from backend
  const loadSellerReviews = useCallback(async (page: number = 1) => {
    if (!profileUserId) return;

    try {
      setIsLoadingReviews(true);
      const token = localStorage.getItem('accessToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_BASE}/products/user/${profileUserId}/reviews?page=${page}&limit=${reviewsPerPage}`,
        { headers }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setReviewsSummary(result.data);

          // Initialize helpfulness counts from backend data
          const counts: { [key: string]: { yes: number; no: number } } = {};
          result.data.reviews.forEach((review: SellerReview) => {
            counts[review.id] = {
              yes: review.helpfulYesCount,
              no: review.helpfulNoCount
            };
          });
          setReviewHelpfulCounts(counts);
        }
      }
    } catch (error) {
      console.error('Error loading seller reviews:', error);
    } finally {
      setIsLoadingReviews(false);
    }
  }, [profileUserId, API_BASE, reviewsPerPage]);

  // Load profile and reviews on mount
  useEffect(() => {
    loadUserProfile();
    loadSellerReviews(currentPage);
  }, [loadUserProfile, loadSellerReviews, currentPage]);

  // Handle review helpfulness vote
  const handleHelpfulnessVote = async (reviewId: string, isHelpful: boolean) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // User not logged in - could show a login prompt
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/products/reviews/${reviewId}/helpfulness`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isHelpful })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          // Update local state with new counts
          setReviewHelpfulCounts(prev => ({
            ...prev,
            [reviewId]: {
              yes: result.data.helpfulYesCount,
              no: result.data.helpfulNoCount
            }
          }));
          setReviewHelpfulness(prev => ({
            ...prev,
            [reviewId]: result.data.userVote
          }));
        }
      }
    } catch (error) {
      console.error('Error voting on review helpfulness:', error);
    }
  };

  // Filter options
  const filterOptions = [
    { id: 'relevant', label: 'The most relevant', description: 'Show most engaging reviews first', icon: 'star' },
    { id: 'newest', label: 'Newest', description: 'Show newest reviews first', icon: 'clock' }
  ];

  // Function to handle filter selection
  const handleFilterSelect = (filterId: string) => {
    const filter = filterOptions.find(f => f.id === filterId);
    if (filter) {
      setSelectedFilter(filter.label);
    }
    setFilterDropdownOpen(false);
  };

  const handleDiscussionToggle = (reviewId: string) => {
    setExpandedDiscussions(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Computed seller data from backend or current user
  const sellerName = userProfile
    ? `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'User'
    : user
      ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'
      : 'User';

  const sellerAvatar2 = userProfile?.profileImage || user?.profileImage || sellerAvatar;
  const sellerBio = userProfile?.bio || user?.bio || '';
  const sellerLocation = userProfile?.location || user?.location || '';
  const sellerRating = reviewsSummary?.averageRating || userProfile?.rating || 0;
  const sellerTotalReviews = reviewsSummary?.totalReviews || userProfile?.totalReviews || 0;
  const sellerMemberSince = userProfile?.createdAt || user?.createdAt;
  const isVerifiedSeller = userProfile?.isVerifiedSeller || user?.isVerifiedSeller || false;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  // Format date for display
  const formatReviewDate = (isoDate: string) => {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatMemberSinceDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  // Show loading state or not found
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userProfile && !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User not found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go back to home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Header />

      {/* Gray Divider below Header */}
      <div style={{ width: '100%', height: '1px', backgroundColor: '#E9E9E9' }}></div>

      {/* Cover Page Section - Desktop */}
      <div className="hidden lg:block py-4 relative" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs mb-4">
            <img
              src={arrowLeftIcon}
              alt="Back"
              className="w-4 h-4 cursor-pointer"
              onClick={() => navigate('/')}
            />
            <span
              className="hover:text-gray-700 cursor-pointer"
              style={{ color: '#BABABA' }}
              onClick={() => navigate('/')}
            >
              Homepage
            </span>
            <span style={{ color: '#BABABA' }}>·</span>
            <span className="font-medium" style={{ color: '#4D4D4D' }}>User Profil ID</span>
          </nav>

          {/* Cover Image Container */}
          <div className="relative">
            <div className="h-64 rounded-2xl relative overflow-hidden" style={{ backgroundColor: '#FEF6E9' }}>
              {/* Decorative Logo Watermark */}
              <div className="absolute" style={{ left: '50%', top: '15%', transform: 'translate(-50%, -50%)', width: '150%', height: '170%' }}>
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: `url(${logoIcon}) no-repeat center`,
                    backgroundSize: 'contain',
                    opacity: '0.5',
                    filter: 'brightness(0) invert(1) brightness(2)'
                  }}
                />
              </div>
            </div>

            {/* Profile Avatar - Half in cover, positioned for left alignment */}
            <div className="absolute left-6 bottom-[-68px]">
              <div className="w-28 h-28 bg-blue-100 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                <img
                  src={sellerAvatar2}
                  alt={sellerName}
                  className="w-24 h-24 rounded-xl object-cover"
                />
              </div>
            </div>

            {/* Action Buttons - Positioned at right side of cover */}
            <div className="absolute right-0 bottom-[-62px]">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="hover:opacity-90 transition-opacity"
                  style={{
                    display: 'flex',
                    width: '40px',
                    height: '40px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    border: 'none'
                  }}
                >
                  <img src={shareIcon} alt="Share" className="w-8 h-8" />
                </button>
                <button
                  className="hover:opacity-90 transition-opacity"
                  style={{
                    display: 'flex',
                    height: '40px',
                    padding: '8px 20px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: '#F0F8FE',
                    color: '#64B5F6',
                    borderRadius: '12px',
                    fontWeight: '400',
                    fontSize: '14px'
                  }}
                  onClick={() => navigate('/settings')}
                >
                  <span>Edit your profile</span>
                </button>
              </div>
            </div>

            {/* Name and Status - Positioned next to avatar */}
            <div className="absolute left-40 bottom-[-65px]">
              <h1 className="text-base font-semibold text-gray-900 mb-1.5">{sellerName}</h1>
              {isVerifiedSeller && (
                <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md" style={{ backgroundColor: '#EDFBF0' }}>
                  <img src={verifyIcon} alt="Verified" className="w-2.5 h-2.5" />
                  <span className="text-xs" style={{ color: '#45C55B', fontWeight: '300' }}>Verified Seller</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile and Tablet Profile Section */}
      <div className="lg:hidden relative">
        {/* Cover Photo Background */}
        <div className="bg-orange-100 h-32 md:h-40 relative overflow-hidden">
          <img
            src={defaultCoverImage}
            alt="Cover Photo"
            className="w-full h-full object-cover"
          />

          {/* Back Button - Top Left */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full border border-gray-300 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Profile Content Overlay */}
        <div className="px-4 md:px-6 pb-6 relative">
          {/* Profile Avatar - Positioned like desktop */}
          <div className="absolute left-4 md:left-6 -top-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
              <img
                src={sellerAvatar2}
                alt={sellerName}
                className="w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover"
              />
            </div>
          </div>

          {/* Verified Badge - Moved Down */}
          <div className="absolute right-4 md:right-6 top-2">
            {isVerifiedSeller && (
              <div className="inline-flex items-center space-x-1 px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg text-xs md:text-sm whitespace-nowrap" style={{ backgroundColor: '#EDFBF0' }}>
                <img src={verifyIcon} alt="Verified" className="w-2.5 h-2.5 md:w-3 md:h-3" />
                <span className="font-medium" style={{ color: '#45C55B' }}>Verified Seller</span>
              </div>
            )}
          </div>

          {/* Name and Info - Below Avatar */}
          <div className="pt-10 md:pt-12">
            <h1 className="text-base md:text-lg font-semibold text-gray-900 mb-2">{sellerName}</h1>

            {/* Location, Member Info, and Rating */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex flex-col space-y-1">
                {/* Location */}
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{sellerLocation || 'Location not set'}</span>
                </div>

                {/* Member Info */}
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Member since {formatMemberSinceDate(sellerMemberSince)}</span>
                </div>
              </div>

              {/* Rating - Right Side */}
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-lg font-semibold text-gray-900">{sellerRating.toFixed(1)}</span>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-500">Reviews ({sellerTotalReviews})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Section - Desktop Only */}
      <div className="hidden lg:block bg-white pt-24">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Profile Header */}
          <div className="mb-0">
          </div>

          {/* Bio and Info Sections - Responsive grid layout */}
          <div className="mb-4 grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-16">
            {/* Bio Section */}
            <div className="xl:col-span-2 pl-8">
              <h3 className="text-xl font-semibold mb-1.5" style={{ color: '#6A6A6A' }}>Bio</h3>
              <p className="leading-relaxed text-sm" style={{ color: '#B0B0B0' }}>
                {sellerBio || 'No bio available.'}
              </p>

              {/* Social Media Icons */}
              <div className="flex items-center space-x-8 mt-6">
                <a href="#" className="hover:opacity-80 transition-opacity">
                  <img src={whatsappIcon} alt="WhatsApp" className="w-6 h-6" style={{ filter: 'brightness(0) saturate(100%) invert(61%) sepia(45%) saturate(820%) hue-rotate(175deg) brightness(92%) contrast(92%)' }} />
                </a>
                <a href="#" className="hover:opacity-80 transition-opacity">
                  <img src={instagramIcon} alt="Instagram" className="w-6 h-6" style={{ filter: 'brightness(0) saturate(100%) invert(61%) sepia(45%) saturate(820%) hue-rotate(175deg) brightness(92%) contrast(92%)' }} />
                </a>
                <a href="#" className="hover:opacity-80 transition-opacity">
                  <img src={facebookIcon} alt="Facebook" className="w-6 h-6" style={{ filter: 'brightness(0) saturate(100%) invert(61%) sepia(45%) saturate(820%) hue-rotate(175deg) brightness(92%) contrast(92%)' }} />
                </a>
              </div>
            </div>

            {/* Info Section - Location and Membership */}
            <div className="space-y-4 pl-32">
              {/* Location */}
              <div>
                <h4 className="text-base font-semibold mb-3" style={{ color: '#6A6A6A' }}>Location</h4>
                <div className="flex items-center space-x-2">
                  <img src={locationIcon} alt="Location" className="w-4 h-4" />
                  <span className="text-sm" style={{ color: '#64B5F6' }}>{sellerLocation || 'Location not set'}</span>
                </div>
              </div>

              {/* Useful link */}
              <div>
                <h4 className="text-base font-semibold mb-3" style={{ color: '#6A6A6A' }}>Useful link</h4>
                <div className="flex items-center space-x-2">
                  <img src={locationIcon} alt="Link" className="w-4 h-4" />
                  <span className="text-sm" style={{ color: '#64B5F6' }}>user-randomlink.com</span>
                </div>
              </div>

              {/* Member Since */}
              <div>
                <h4 className="text-base font-semibold mb-3" style={{ color: '#6A6A6A' }}>Member Since</h4>
                <div className="flex items-center space-x-2">
                  <img src={profileIcon} alt="Profile" className="w-4 h-4" />
                  <span className="text-sm" style={{ color: '#6A6A6A' }}>{formatMemberSinceDate(sellerMemberSince)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile and Tablet Bio Section */}
      <div className="lg:hidden bg-white px-4 md:px-6 py-3 md:py-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">Bio</h3>
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          {sellerBio || 'No bio available.'}
        </p>
      </div>

      {/* Reviews and Ratings Section */}
      <div className="bg-white" style={{ marginTop: '-16px' }}>
        <div className="max-w-7xl mx-auto px-6 pb-8">
          {/* Section Heading */}
          <h2 className="text-3xl font-semibold mb-8 pl-4" style={{ color: '#000000', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Reviews and ratings
          </h2>

          {/* Reviews Content */}
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT COLUMN - Reviews List */}
              <div className="lg:col-span-2">
                {/* Filter Dropdown */}
                <div className="relative mb-6 pb-3" ref={filterDropdownRef}>
                  <button
                    onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                    className="flex items-center hover:opacity-80 transition-opacity"
                    style={{ color: '#939393' }}
                  >
                    {/* Filter Icon - Same as mobile search bar */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="mr-2"
                    >
                      {/* Top line with circle */}
                      <line x1="3" y1="6" x2="17" y2="6" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="10" cy="6" r="2" fill="#FFF" stroke="#6A6A6A" strokeWidth="1.5" />

                      {/* Bottom line with circle */}
                      <line x1="3" y1="14" x2="17" y2="14" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="10" cy="14" r="2" fill="#FFF" stroke="#6A6A6A" strokeWidth="1.5" />
                    </svg>
                    <span className="text-sm">{selectedFilter}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {filterDropdownOpen && (
                    <div className="absolute top-8 left-0 bg-white border border-gray-200 shadow-lg z-10 p-2" style={{ borderRadius: '12px', minWidth: '280px' }}>
                      {filterOptions.map((option, index) => {
                        const isSelected = selectedFilter === option.label;
                        return (
                          <button
                            key={option.id}
                            onClick={() => handleFilterSelect(option.id)}
                            className="w-full text-left px-3 py-3 transition-colors flex items-start space-x-3"
                            style={{
                              backgroundColor: isSelected ? '#F0F8FE' : 'transparent',
                              borderRadius: isSelected ? '10px' : '0',
                              marginBottom: index < filterOptions.length - 1 ? '4px' : '0'
                            }}
                          >
                            {/* Icon */}
                            <div className="flex-shrink-0 mt-0.5">
                              {option.icon === 'star' ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isSelected ? '#64B5F6' : '#212121'} strokeWidth="2">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                              ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isSelected ? '#64B5F6' : '#212121'} strokeWidth="2">
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M12 6v6l4 2" />
                                </svg>
                              )}
                            </div>

                            {/* Text */}
                            <div className="flex-1">
                              <div className="text-sm font-medium mb-0.5" style={{ color: isSelected ? '#64B5F6' : '#212121' }}>
                                {option.label}
                              </div>
                              <div className="text-xs" style={{ color: '#939393' }}>
                                {option.description}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Review Cards */}
                <div className="space-y-4">
                  {isLoadingReviews ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading reviews...</p>
                    </div>
                  ) : reviewsSummary?.reviews && reviewsSummary.reviews.length > 0 ? (
                    reviewsSummary.reviews.map((review) => {
                      const reviewerName = `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() || 'Anonymous';
                      const counts = reviewHelpfulCounts[review.id] || { yes: review.helpfulYesCount, no: review.helpfulNoCount };
                      const userVote = reviewHelpfulness[review.id];

                      return (
                        <div key={review.id} className="pb-6">
                          <div className="flex items-start space-x-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              {review.user.profileImage ? (
                                <img src={review.user.profileImage} alt={reviewerName} className="w-full h-full object-cover" />
                              ) : (
                                <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">{reviewerName}</h4>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <svg
                                        key={star}
                                        className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                      </svg>
                                    ))}
                                  </div>
                                  <span className="text-sm font-medium" style={{ color: '#939393' }}>{review.rating.toFixed(1)}</span>
                                </div>
                                <span className="text-xs" style={{ color: '#939393' }}>Posted on {formatReviewDate(review.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm leading-relaxed mb-4" style={{ color: '#B0B0B0' }}>
                            {review.comment || 'No comment provided.'}
                          </p>

                          {/* Helpfulness Section */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {!userVote && (
                                <span className="text-xs" style={{ color: '#212121' }}>Was this review helpful to you?</span>
                              )}
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleHelpfulnessVote(review.id, true)}
                                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full transition-colors"
                                  style={{
                                    border: `1px solid ${userVote === 'yes' ? '#F0F8FE' : '#E1E1E1'}`,
                                    backgroundColor: userVote === 'yes' ? '#F0F8FE' : 'white'
                                  }}
                                >
                                  <span className="text-xs" style={{ color: userVote === 'yes' ? '#64B5F6' : '#6A6A6A' }}>
                                    {userVote ? counts.yes : 'Yes'}
                                  </span>
                                  <img
                                    src={likeIcon}
                                    alt="Like"
                                    className="w-3.5 h-3.5"
                                    style={{
                                      filter: userVote === 'yes'
                                        ? 'brightness(0) saturate(100%) invert(60%) sepia(89%) saturate(1726%) hue-rotate(183deg) brightness(97%) contrast(92%)'
                                        : 'none'
                                    }}
                                  />
                                </button>
                                <button
                                  onClick={() => handleHelpfulnessVote(review.id, false)}
                                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full transition-colors"
                                  style={{
                                    border: `1px solid ${userVote === 'no' ? '#F0F8FE' : '#E1E1E1'}`,
                                    backgroundColor: userVote === 'no' ? '#F0F8FE' : 'white'
                                  }}
                                >
                                  <span className="text-xs" style={{ color: userVote === 'no' ? '#64B5F6' : '#6A6A6A' }}>
                                    {userVote ? counts.no : 'No'}
                                  </span>
                                  <img
                                    src={dislikeIcon}
                                    alt="Dislike"
                                    className="w-3.5 h-3.5"
                                    style={{
                                      filter: userVote === 'no'
                                        ? 'brightness(0) saturate(100%) invert(60%) sepia(89%) saturate(1726%) hue-rotate(183deg) brightness(97%) contrast(92%)'
                                        : 'none'
                                    }}
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No reviews yet.</p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {reviewsSummary && reviewsSummary.totalReviews > 0 && (
                  <div className="border-t pt-6 mt-6" style={{ borderColor: '#E5E5E5' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: '#BABABA' }}>
                        {((currentPage - 1) * reviewsPerPage) + 1} - {Math.min(currentPage * reviewsPerPage, reviewsSummary.totalReviews)} out of {reviewsSummary.totalReviews}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          className="transition-opacity disabled:cursor-not-allowed hover:opacity-80"
                        >
                          <img src={currentPage === 1 ? grayArrowIcon : blackArrowIcon} alt="Previous" style={{ width: '20px', height: '20px', transform: 'rotate(180deg)' }} />
                        </button>
                        <button
                          disabled={currentPage >= (reviewsSummary.totalPages || 1)}
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          className="transition-opacity disabled:cursor-not-allowed hover:opacity-80"
                        >
                          <img src={currentPage >= (reviewsSummary.totalPages || 1) ? grayArrowIcon : blackArrowIcon} alt="Next" style={{ width: '20px', height: '20px' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN - Rating Summary & Give Your Opinion */}
              <div className="lg:col-span-1">
                {/* Overall Rating Summary */}
                <div className="mb-8 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <div className="text-4xl font-semibold text-gray-900" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>{sellerRating.toFixed(1)}</div>
                    <svg className="w-7 h-7 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div className="text-sm mb-8" style={{ color: '#6A6A6A' }}>Review & Rates ({sellerTotalReviews})</div>

                  {/* Rating Bars */}
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviewsSummary?.ratingDistribution?.[rating] || 0;
                      const percentage = sellerTotalReviews > 0 ? (count / sellerTotalReviews) * 100 : 0;
                      return (
                        <div key={rating} className="flex items-center space-x-2">
                          <span className="text-xs w-3" style={{ color: '#939393' }}>{rating}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-1">
                            <div className="bg-yellow-400 h-1 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span className="text-xs w-6 text-right" style={{ color: '#939393' }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer before footer */}
      <div className="pb-16"></div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
        <div className="flex items-center space-x-3">
          {/* Chat with seller button */}
          <button
            className="flex-1 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
            style={{ backgroundColor: '#F9A825' }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}
          >
            <span>Chat with seller</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          {/* Three dots menu button */}
          <button
            className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors bg-white"
            style={{ borderColor: '#F9A825', borderWidth: '1px' }}
          >
            <div className="flex space-x-1">
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#F9A825' }}></div>
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#F9A825' }}></div>
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#F9A825' }}></div>
            </div>
          </button>
        </div>
      </div>

      {/* Share Profile Modal */}
      {showShareModal && (
        <>
          {/* Focused Overlay */}
          <div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: '#0000001A' }}
            onClick={() => setShowShareModal(false)}
          />

          {/* Share Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="bg-white rounded-2xl shadow-xl relative max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
              style={{ padding: '32px 24px', marginTop: '40px' }}
            >
              {/* Profile Picture - Half Outside Modal */}
              <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '-40px' }}>
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  <img
                    src={sellerAvatar2}
                    alt={sellerName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
              </div>

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
              <h3 className="text-xl font-semibold text-center mb-3 mt-8" style={{ color: '#212121', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                Share this profile with your network
              </h3>

              {/* Description */}
              <p className="text-xs text-center mb-6" style={{ color: '#B0B0B0' }}>
                Increase visibility by showcasing this profile to connect with more buyers or potential clients.
              </p>

              {/* Link Field with Copy Button */}
              <div className="flex items-center space-x-2 mb-6">
                <input
                  type="text"
                  value={`baoafrik.com/user-profile-id?`}
                  readOnly
                  className="flex-1 px-3 py-2.5 rounded-lg text-sm"
                  style={{ backgroundColor: '#F4F4F4', color: '#6A6A6A', border: 'none' }}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#000000' }}
                >
                  Copy link
                </button>
              </div>

              {/* Share To Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Share to</h4>
                <div className="flex items-center justify-center space-x-6">
                  <button className="flex flex-col items-center space-y-2">
                    <img src={fbIcon} alt="Facebook" className="w-10 h-10" />
                    <span className="text-xs" style={{ color: '#B0B0B0' }}>Facebook</span>
                  </button>
                  <button className="flex flex-col items-center space-y-2">
                    <img src={igIcon} alt="Instagram" className="w-10 h-10" />
                    <span className="text-xs" style={{ color: '#B0B0B0' }}>Instagram</span>
                  </button>
                  <button className="flex flex-col items-center space-y-2">
                    <img src={xIcon} alt="X" className="w-10 h-10" />
                    <span className="text-xs" style={{ color: '#B0B0B0' }}>X</span>
                  </button>
                  <button className="flex flex-col items-center space-y-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0088cc' }}>
                      <img src={tgIcon} alt="Telegram" className="w-6 h-6" />
                    </div>
                    <span className="text-xs" style={{ color: '#B0B0B0' }}>Telegram</span>
                  </button>
                  <button className="flex flex-col items-center space-y-2">
                    <img src={zapIcon} alt="WhatsApp" className="w-10 h-10" />
                    <span className="text-xs" style={{ color: '#B0B0B0' }}>Whatsapp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserAccount; 
