import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import sellerAvatar from '../assets/images/logos/avatar.png';
import defaultCoverImage from '../assets/images/logos/8.png';
import arrowLeftIcon from '../assets/images/pre/arrow-left.svg';
import backArrowIcon from '../assets/images/pre/back arrow.svg';
import verifyIcon from '../assets/images/pre/verify.svg';
import basketIcon from '../assets/images/pre/basket.png';
import logoIcon from '../assets/images/logos/ba-brand-icon-colored.png';
import pencilIcon from '../assets/images/pre/pencil.svg';
import contactIcon from '../assets/images/pre/contact.svg';
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
// Import product images from pre folder
import pre1 from '../assets/images/pre/1.png';
import pre2 from '../assets/images/pre/2.png';
import pre3 from '../assets/images/pre/3.png';
import pre4 from '../assets/images/pre/4.png';
import pre5 from '../assets/images/pre/5.png';
import pre6 from '../assets/images/pre/6.png';
import pre7 from '../assets/images/pre/7.png';
import pre8 from '../assets/images/pre/8.png';

// Country mapping for products
const getProductCountry = (productId: number) => {
  const countryMap: { [key: number]: { name: string; code: string; flag: string; abbreviation: string } } = {
    1: { name: 'Cameroon', code: 'cm', flag: 'https://flagcdn.com/w20/cm.png', abbreviation: 'CMR' },
    2: { name: 'Chad', code: 'td', flag: 'https://flagcdn.com/w20/td.png', abbreviation: 'TCD' },
    3: { name: 'Ivory Coast', code: 'ci', flag: 'https://flagcdn.com/w20/ci.png', abbreviation: 'CIV' },
    4: { name: 'Nigeria', code: 'ng', flag: 'https://flagcdn.com/w20/ng.png', abbreviation: 'NGR' },
    5: { name: 'Ghana', code: 'gh', flag: 'https://flagcdn.com/w20/gh.png', abbreviation: 'GHA' },
    6: { name: 'Kenya', code: 'ke', flag: 'https://flagcdn.com/w20/ke.png', abbreviation: 'KEN' },
    7: { name: 'South Africa', code: 'za', flag: 'https://flagcdn.com/w20/za.png', abbreviation: 'ZAF' },
    8: { name: 'Egypt', code: 'eg', flag: 'https://flagcdn.com/w20/eg.png', abbreviation: 'EGY' },
    9: { name: 'Morocco', code: 'ma', flag: 'https://flagcdn.com/w20/ma.png', abbreviation: 'MAR' },
    10: { name: 'Ethiopia', code: 'et', flag: 'https://flagcdn.com/w20/et.png', abbreviation: 'ETH' },
    11: { name: 'Tanzania', code: 'tz', flag: 'https://flagcdn.com/w20/tz.png', abbreviation: 'TZA' },
    12: { name: 'Uganda', code: 'ug', flag: 'https://flagcdn.com/w20/ug.png', abbreviation: 'UGA' },
    13: { name: 'Senegal', code: 'sn', flag: 'https://flagcdn.com/w20/sn.png', abbreviation: 'SEN' },
    14: { name: 'Mali', code: 'ml', flag: 'https://flagcdn.com/w20/ml.png', abbreviation: 'MLI' },
    15: { name: 'Burkina Faso', code: 'bf', flag: 'https://flagcdn.com/w20/bf.png', abbreviation: 'BFA' },
    16: { name: 'Niger', code: 'ne', flag: 'https://flagcdn.com/w20/ne.png', abbreviation: 'NER' },
    17: { name: 'Sudan', code: 'sd', flag: 'https://flagcdn.com/w20/sd.png', abbreviation: 'SDN' },
    18: { name: 'Algeria', code: 'dz', flag: 'https://flagcdn.com/w20/dz.png', abbreviation: 'DZA' },
    19: { name: 'Tunisia', code: 'tn', flag: 'https://flagcdn.com/w20/tn.png', abbreviation: 'TUN' },
    20: { name: 'Libya', code: 'ly', flag: 'https://flagcdn.com/w20/ly.png', abbreviation: 'LBY' }
  };
  return countryMap[productId] || { name: 'Nigeria', code: 'ng', flag: 'https://flagcdn.com/w20/ng.png', abbreviation: 'NGR' };
};

const UserAccount: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabFromUrl = searchParams.get('tab') as 'reviews' | 'items' | null;
  const [activeTab, setActiveTab] = useState<'reviews' | 'items'>(tabFromUrl || 'reviews');
  const [sharedProducts, setSharedProducts] = useState<Set<string>>(new Set());
  const [wishlistProducts, setWishlistProducts] = useState<Set<string>>(new Set());

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
      if (giveOpinionModalRef.current && !giveOpinionModalRef.current.contains(event.target as Node)) {
        // Don't close on overlay click for mobile modal
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

  const [likes, setLikes] = useState({ review1: 5, review2: 5, review3: 5 });
  const [likedReviews, setLikedReviews] = useState<string[]>([]);
  const [expandedDiscussions, setExpandedDiscussions] = useState<{[key: string]: boolean}>({});
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('The most relevant');
  const [userRating, setUserRating] = useState(0);
  const [userReviewText, setUserReviewText] = useState('');
  const [isReviewPosted, setIsReviewPosted] = useState(false);
  const [postedReview, setPostedReview] = useState<{rating: number; text: string; date: string} | null>(null);
  const [showGiveOpinionModal, setShowGiveOpinionModal] = useState(false);
  const [reviewHelpfulness, setReviewHelpfulness] = useState<{[key: string]: 'yes' | 'no' | null}>({});
  const [reviewHelpfulCounts, setReviewHelpfulCounts] = useState<{[key: string]: {yes: number; no: number}}>({
    review1: { yes: 27, no: 2 },
    review2: { yes: 15, no: 3 },
    review3: { yes: 8, no: 12 }
  });
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const optionsModalRef = useRef<HTMLDivElement>(null);
  const giveOpinionModalRef = useRef<HTMLDivElement>(null);
  const { sellerId } = useParams<{ sellerId: string }>();

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

  const handleHelpfulnessClick = (itemId: string, choice: 'yes' | 'no') => {
    setReviewHelpfulness(prevSelection => {
      const currentSelection = prevSelection[itemId];
      const nextSelection = currentSelection === choice ? null : choice;

      if (currentSelection !== choice) {
        setReviewHelpfulCounts(prevCounts => {
          const existing = prevCounts[itemId] || { yes: 0, no: 0 };
          return {
            ...prevCounts,
            [itemId]: {
              ...existing,
              [choice]: existing[choice] + 1
            }
          };
        });
      }

      return { ...prevSelection, [itemId]: nextSelection };
    });
  };

  const renderHelpfulnessControls = (
    itemId: string,
    questionText = 'Was this review helpful to you?',
    alignment: 'left' | 'right' = 'left',
    fullWidth = false
  ) => {
    const selection = reviewHelpfulness[itemId];
    const counts = reviewHelpfulCounts[itemId] || { yes: 0, no: 0 };

    return (
      <div
        className={`flex items-center ${fullWidth ? 'w-full' : ''} ${alignment === 'right' ? 'justify-end' : 'justify-start'}`}
        style={{ gap: '10px' }}
      >
        {!selection && (
          <span style={{ fontSize: '10px', color: '#212121' }}>
            {questionText}
          </span>
        )}
        <div className="flex items-center" style={{ gap: '6px' }}>
          <button
            onClick={() => handleHelpfulnessClick(itemId, 'yes')}
            className="flex items-center rounded-full transition-colors"
            style={{
              border: `1px solid ${selection === 'yes' ? '#F0F8FE' : '#E1E1E1'}`,
              backgroundColor: selection === 'yes' ? '#F0F8FE' : 'white',
              padding: '3px 8px',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '10px', color: selection === 'yes' ? '#64B5F6' : '#6A6A6A' }}>
              {selection ? counts.yes : 'Yes'}
            </span>
            <img
              src={likeIcon}
              alt="Like"
              className="w-2.5 h-2.5"
              style={{
                filter: selection === 'yes'
                  ? 'brightness(0) saturate(100%) invert(60%) sepia(89%) saturate(1726%) hue-rotate(183deg) brightness(97%) contrast(92%)'
                  : 'none'
              }}
            />
          </button>
          <button
            onClick={() => handleHelpfulnessClick(itemId, 'no')}
            className="flex items-center rounded-full transition-colors"
            style={{
              border: `1px solid ${selection === 'no' ? '#F0F8FE' : '#E1E1E1'}`,
              backgroundColor: selection === 'no' ? '#F0F8FE' : 'white',
              padding: '3px 8px',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '10px', color: selection === 'no' ? '#64B5F6' : '#6A6A6A' }}>
              {selection ? counts.no : 'No'}
            </span>
            <img
              src={dislikeIcon}
              alt="Dislike"
              className="w-2.5 h-2.5"
              style={{
                filter: selection === 'no'
                  ? 'brightness(0) saturate(100%) invert(60%) sepia(89%) saturate(1726%) hue-rotate(183deg) brightness(97%) contrast(92%)'
                  : 'none'
              }}
            />
          </button>
        </div>
      </div>
    );
  };

  // Mock seller data - in real app this would come from API
  const seller = {
    id: sellerId || '1',
    name: 'Joaquin EDIMO',
    avatar: sellerAvatar,
    coverPhoto: defaultCoverImage, // Can be updated when seller uploads cover photo
    isVerified: true,
    bio: 'Passionate farmer and entrepreneur with over 15 years of experience in sustainable agriculture. Specializing in organic produce and traditional farming methods. Committed to providing fresh, high-quality products directly from farm to table.',
    location: 'London, United Kingdom',
    memberSince: 'Depuis 2025',
    rating: 4.3,
    totalReviews: 456,
    reviews: [
      {
        id: 1,
        reviewerName: 'Miles KENEDY',
        reviewerAvatar: sellerAvatar,
        rating: 5,
        date: 'Publié le 04 Août 2025',
        comment: 'Lorem ipsum dolor sit amet consectetur. Lobortis velit magna sit turpis mi dignissim. Tellus pharetra eu dui et nit. Imperdiet adipiscing dictum morbi quam. Vivamus in vitae diam eget eget sed mi commodo. Id ornare diam ultrices facilisis vitae. Dignissim suscipit bibendum.',
        helpful: 5
      },
      {
        id: 2,
        reviewerName: 'Samine Herald',
        reviewerAvatar: sellerAvatar,
        rating: 4,
        date: 'Publié le 04 Août 2025',
        comment: 'Lorem ipsum dolor sit amet consectetur. Lobortis velit magna sit turpis mi dignissim. Tellus pharetra eu dui et nit. Imperdiet adipiscing dictum morbi quam. Vivamus in vitae diam eget eget sed mi commodo. Id ornare diam ultrices facilisis vitae. Dignissim suscipit bibendum.',
        helpful: 5
      },
      {
        id: 3,
        reviewerName: 'Samine Herald',
        reviewerAvatar: sellerAvatar,
        rating: 4,
        date: 'Publié le 04 Août 2025',
        comment: 'Lorem ipsum dolor sit amet consectetur. Lobortis velit magna sit turpis mi dignissim. Tellus pharetra eu dui et nit. Imperdiet adipiscing dictum morbi quam. Vivamus in vitae diam eget eget sed mi commodo. Id ornare diam ultrices facilisis vitae. Dignissim suscipit bibendum.',
        helpful: 5
      }
    ]
  };

  const reviewDiscussionData: {[key: string]: Array<{id: string; author: string; role?: string; date: string; text: string; isOwner?: boolean; avatar?: string}>} = {
    review1: [
      {
        id: 'user-review1-comment1',
        author: seller.name,
        role: 'Profile Owner',
        date: '2 Jan 2025',
        text: 'Thank you for your feedback, Miles! We always strive to provide the best service.',
        isOwner: true,
        avatar: seller.avatar
      }
    ],
    review2: [
      {
        id: 'user-review2-comment1',
        author: seller.name,
        role: 'Profile Owner',
        date: '4 Aug 2025',
        text: 'I appreciate your review, Samine. Your feedback helps us improve.',
        isOwner: true,
        avatar: seller.avatar
      },
      {
        id: 'user-review2-comment2',
        author: 'Miles KENEDY',
        date: '5 Aug 2025',
        text: 'Great response time!',
        avatar: sellerAvatar
      },
      {
        id: 'user-review2-comment3',
        author: 'Alex Johnson',
        date: '6 Aug 2025',
        text: 'I had a similar experience.',
        avatar: sellerAvatar
      }
    ],
    review3: [
      {
        id: 'user-review3-comment1',
        author: seller.name,
        role: 'Profile Owner',
        date: '4 Aug 2025',
        text: 'Thanks for sharing, Samine. We will work on improving those areas.',
        isOwner: true,
        avatar: seller.avatar
      },
      {
        id: 'user-review3-comment2',
        author: 'Kael Otto',
        date: '5 Aug 2025',
        text: 'I agree with your points.',
        avatar: sellerAvatar
      }
    ]
  };

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

  if (!seller) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Seller not found</h2>
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
      <div className="hidden lg:block">
        <Header />
      </div>

      {/* Gray Divider below Header */}
      <div className="hidden lg:block" style={{ width: '100%', height: '1px', backgroundColor: '#E9E9E9' }}></div>

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
                src={seller.avatar}
                alt={seller.name}
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
                  <Link 
                    to="/settings"
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
                    fontSize: '14px',
                    textDecoration: 'none'
                  }}
                >
                  <span>Edit your profile</span>
                      </Link>
            </div>
          </div>
          
          {/* Name and Status - Positioned next to avatar */}
            <div className="absolute left-40 bottom-[-65px]">
              <h1 className="text-base font-semibold text-gray-900 mb-1.5">{seller.name}</h1>
            {seller.isVerified && (
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
            src={seller.coverPhoto || defaultCoverImage}
            alt="Cover Photo"
            className="w-full h-full object-cover"
          />
          
          {/* Back Button - Top Left */}
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white flex items-center justify-center"
            style={{ boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}
            aria-label="Back"
          >
            <img src={backArrowIcon} alt="Back" className="w-3.5 h-3.5" />
          </button>

          {/* More Options Button - Top Right */}
          <button 
            onClick={() => setShowOptionsModal(true)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center"
            style={{ boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)', zIndex: 10 }}
            aria-label="More options"
          >
            <svg width="14" height="4" viewBox="0 0 24 4" fill="none">
              <circle cx="4" cy="2" r="2" fill="#171717" />
              <circle cx="12" cy="2" r="2" fill="#171717" />
              <circle cx="20" cy="2" r="2" fill="#171717" />
            </svg>
          </button>

          {/* Mobile Options Modal */}
          {showOptionsModal && (
              <div 
                ref={optionsModalRef}
                className="absolute z-20"
                style={{
                  display: 'inline-flex',
                  padding: '6px 4px',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  gap: '4px',
                  borderRadius: '10px',
                  background: '#FFF',
                  boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                  top: '56px',
                  right: '16px',
                  minWidth: '180px'
                }}
              >
                <button 
                  className="flex items-center w-full hover:bg-gray-50 rounded transition-colors"
                  style={{ gap: '6px', padding: '6px 10px' }}
                  onClick={() => {
                    setShowOptionsModal(false);
                    setShowShareModal(true);
                  }}
                >
                  <img src={shareIcon} alt="Share" className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap" style={{ fontSize: '11px', color: '#939393' }}>Share the profile</span>
                </button>
                <button 
                  className="flex items-center w-full hover:bg-gray-50 rounded transition-colors"
                  style={{ gap: '6px', padding: '6px 10px' }}
                  onClick={() => {
                    // Handle report action
                    setShowOptionsModal(false);
                  }}
                >
                  <img src={warningIcon} alt="Report" className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap" style={{ fontSize: '11px', color: '#939393' }}>Report the profile</span>
                </button>
              </div>
          )}
        </div>
        
        {/* Profile Content Overlay */}
        <div className="px-4 md:px-6 pb-6 relative">
          {/* Profile Avatar - Positioned like desktop */}
          <div className="absolute left-4 md:left-6 -top-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white lg:border-4">
              <img
                src={seller.avatar}
                alt={seller.name}
                className="w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover"
              />
            </div>
          </div>

          {/* Edit Profile Button - Far Right of Profile Icon */}
          <div className="absolute right-4 md:right-6 top-2">
            <Link 
              to="/settings"
              className="hover:opacity-90 transition-opacity"
              style={{
                display: 'flex',
                height: '28px',
                padding: '4px 12px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#F0F8FE',
                color: '#64B5F6',
                borderRadius: '8px',
                fontWeight: '400',
                fontSize: '11px',
                textDecoration: 'none'
              }}
            >
              <span>Edit your profile</span>
            </Link>
          </div>
          
          {/* Name and Info - Below Avatar */}
          <div className="pt-10 md:pt-12">
            <div className="flex items-center gap-1.5 mb-2">
              <h1 className="text-sm md:text-base font-semibold text-gray-900">{seller.name}</h1>
              {seller.isVerified && (
                <div className="inline-flex items-center space-x-0.5 px-1 py-0.5 rounded-md whitespace-nowrap" style={{ backgroundColor: '#EDFBF0', fontSize: '10px' }}>
                  <img src={verifyIcon} alt="Verified" className="w-2 h-2" />
                  <span className="font-medium" style={{ color: '#45C55B' }}>Verified Seller</span>
                </div>
              )}
            </div>
            
            {/* Member Info and Location with Rating */}
            <div className="flex items-start justify-between" style={{ marginBottom: '16px', marginTop: '14px' }}>
              <div className="flex flex-col" style={{ gap: '12px' }}>
                {/* Member Info */}
                <div className="flex items-center space-x-1.5" style={{ fontSize: '12px', color: '#B0B0B0' }}>
                  <img src={profileIcon} alt="Profile" className="w-3.5 h-3.5" />
                  <span>Member since 2025</span>
                </div>
                
                {/* Location */}
                <div className="flex items-center space-x-1.5" style={{ fontSize: '12px', color: '#B0B0B0' }}>
                  <img src={locationIcon} alt="Location" className="w-3.5 h-3.5" />
                  <span style={{ color: '#64B5F6' }}>London, United Kingdom</span>
                </div>

                {/* Social Media Icons */}
                <div className="flex items-center" style={{ gap: '14px', marginTop: '4px', marginLeft: '8px' }}>
                  <a href="#" className="hover:opacity-80 transition-opacity">
                    <img src={whatsappIcon} alt="WhatsApp" className="w-4 h-4" style={{ filter: 'brightness(0) saturate(100%) invert(61%) sepia(45%) saturate(820%) hue-rotate(175deg) brightness(92%) contrast(92%)' }} />
                  </a>
                  <a href="#" className="hover:opacity-80 transition-opacity">
                    <img src={instagramIcon} alt="Instagram" className="w-4 h-4" style={{ filter: 'brightness(0) saturate(100%) invert(61%) sepia(45%) saturate(820%) hue-rotate(175deg) brightness(92%) contrast(92%)' }} />
                  </a>
                  <a href="#" className="hover:opacity-80 transition-opacity">
                    <img src={facebookIcon} alt="Facebook" className="w-4 h-4" style={{ filter: 'brightness(0) saturate(100%) invert(61%) sepia(45%) saturate(820%) hue-rotate(175deg) brightness(92%) contrast(92%)' }} />
                  </a>
                </div>
              </div>

              {/* Rating - Far Right */}
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>4.3</span>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-sm" style={{ color: '#B0B0B0' }}>Reviews (456)</span>
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
                {seller.bio}
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
                  <span className="text-sm" style={{ color: '#64B5F6' }}>London, United Kingdom</span>
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
                  <span className="text-sm" style={{ color: '#6A6A6A' }}>May 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile and Tablet Bio Section */}
      <div className="lg:hidden bg-white px-4 md:px-6 pb-3 md:pb-4" style={{ paddingTop: '0', marginTop: '-16px' }}>
        <h3 className="text-base font-semibold mb-1" style={{ color: '#6A6A6A' }}>Bio</h3>
        <p className="leading-relaxed text-sm" style={{ color: '#B0B0B0' }}>
          Passionate farmer and entrepreneur specializing in organic produce and traditional farming methods.
        </p>
      </div>

      {/* Reviews and Ratings Section */}
      <div className="bg-white">
        {/* Mobile Title */}
        <div className="lg:hidden px-4 md:px-6 pt-3 pb-2">
          <h2 className="text-xl font-semibold" style={{ color: '#000000', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Reviews and ratings
          </h2>
        </div>

        {/* Desktop Title */}
        <div className="hidden lg:block max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-semibold pl-4" style={{ color: '#000000', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Reviews and ratings
          </h2>
        </div>

        {/* Mobile Rating Summary - Right after title */}
        <div className="lg:hidden px-4 md:px-6 bg-white" style={{ paddingTop: '12px', paddingBottom: '2px' }}>
          {/* Always show ratings */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="text-4xl font-semibold text-gray-900" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>4.3</div>
              <svg className="w-7 h-7 text-yellow-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <button 
              onClick={() => setShowGiveOpinionModal(true)}
              className="px-4 py-2 rounded-md text-xs font-medium"
              style={{ color: '#64B5F6', backgroundColor: '#F0F8FE', borderRadius: '6px' }}
            >
              Give feedback
            </button>
          </div>
          <div className="text-sm mb-4" style={{ color: '#6A6A6A' }}>Review & Rates (456)</div>
          
          {/* Rating Bars */}
          <div className="space-y-2" style={{ marginBottom: isReviewPosted ? '16px' : '0' }}>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="bg-yellow-400 h-1 rounded-full" style={{width: '70%'}}></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="bg-yellow-400 h-1 rounded-full" style={{width: '60%'}}></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="bg-yellow-400 h-1 rounded-full" style={{width: '40%'}}></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="bg-yellow-400 h-1 rounded-full" style={{width: '20%'}}></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="bg-yellow-400 h-1 rounded-full" style={{width: '10%'}}></div>
            </div>
          </div>
          
          {/* Thank you message and posted review - shown below ratings when posted */}
          {isReviewPosted && (
            <>
              {/* Thank You Message */}
              <div className="text-center mb-4">
                <p className="text-lg font-medium" style={{ color: '#939393' }}>
                  Thank you for your feedback. 😊
                </p>
              </div>
              
              {/* Posted Review Card */}
              <div className="border rounded-2xl p-4" style={{ borderColor: '#E1E1E1' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start" style={{ gap: '10px' }}>
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center" style={{ flexShrink: 0 }}>
                      <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    <div>
                      {/* Name */}
                      <h4 className="font-semibold mb-1" style={{ color: '#0E0E0E', fontSize: '13px' }}>You</h4>
                      
                      {/* Star Rating */}
                      <div className="flex items-center" style={{ gap: '6px' }}>
                        <div className="flex items-center">
                          {[1,2,3,4,5].map((star) => (
                            <svg 
                              key={star} 
                              className="w-3 h-3 fill-current" 
                              style={{ color: star <= (postedReview?.rating || 0) ? '#FBBC05' : '#E9E9E9' }}
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          ))}
                        </div>
                        <span style={{ fontSize: '11px', color: '#939393' }}>{postedReview?.rating}.0</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Edit Button and Date */}
                  <div className="flex flex-col items-end" style={{ gap: '4px' }}>
                    <button 
                      onClick={() => {
                        setIsReviewPosted(false);
                      }}
                      className="flex items-center border rounded-lg transition-colors hover:bg-gray-50"
                      style={{ padding: '3px 8px', borderColor: '#D9D9D9', gap: '4px' }}
                    >
                      <img src={pencilIcon} alt="Edit" className="w-2.5 h-2.5" />
                      <span style={{ fontSize: '10px', color: '#6A6A6A' }}>Edit</span>
                    </button>
                    <span style={{ fontSize: '9px', color: '#B0B0B0' }}>{postedReview?.date}</span>
                  </div>
                </div>
                
                {/* Review Text */}
                <p className="leading-relaxed" style={{ fontSize: '11px', color: '#939393' }}>
                  {postedReview?.text}
                </p>
              </div>
            </>
          )}
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-4 mt-8">

          {/* Reviews Content */}
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT COLUMN - Reviews List */}
              <div className="lg:col-span-2">
          {/* Filter Dropdown */}
                <div className="relative pb-3 lg:mb-3" style={{ marginBottom: '2px' }} ref={filterDropdownRef}>
            <button 
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                    className="flex items-center hover:opacity-80 transition-opacity"
                    style={{ color: '#939393' }}
                  >
                    {/* Filter Icon - Same as mobile search bar */}
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 20 20" 
                      fill="none"
                      className="mr-1.5 lg:mr-2 lg:w-5 lg:h-5"
                    >
                      {/* Top line with circle */}
                      <line x1="3" y1="6" x2="17" y2="6" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="10" cy="6" r="2" fill="#FFF" stroke="#6A6A6A" strokeWidth="1.5"/>
                      
                      {/* Bottom line with circle */}
                      <line x1="3" y1="14" x2="17" y2="14" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="10" cy="14" r="2" fill="#FFF" stroke="#6A6A6A" strokeWidth="1.5"/>
              </svg>
                    <span className="text-xs lg:text-sm">{selectedFilter}</span>
            </button>
            
            {/* Dropdown Menu */}
            {filterDropdownOpen && (
              <div className="absolute top-8 left-0 bg-white border border-gray-200 shadow-lg z-10 lg:p-2" style={{ borderRadius: '8px', padding: '4px', minWidth: '200px', width: 'calc(100vw - 32px)', maxWidth: '240px' }}>
                {filterOptions.map((option, index) => {
                  const isSelected = selectedFilter === option.label;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleFilterSelect(option.id)}
                      className="w-full text-left transition-colors flex items-start lg:px-3 lg:py-3 lg:space-x-3"
                      style={{
                        backgroundColor: isSelected ? '#F0F8FE' : 'transparent',
                        borderRadius: isSelected ? '6px' : '0',
                        marginBottom: index < filterOptions.length - 1 ? '2px' : '0',
                        padding: '6px 8px',
                        gap: '8px'
                      }}
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0" style={{ marginTop: '1px' }}>
                        {option.icon === 'star' ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isSelected ? '#64B5F6' : '#212121'} strokeWidth="2" className="lg:w-[18px] lg:h-[18px]">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isSelected ? '#64B5F6' : '#212121'} strokeWidth="2" className="lg:w-[18px] lg:h-[18px]">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2"/>
                          </svg>
                        )}
                </div>
                      
                      {/* Text */}
                      <div className="flex-1">
                        <div className="font-medium lg:text-sm lg:mb-0.5" style={{ fontSize: '11px', marginBottom: '1px', color: isSelected ? '#64B5F6' : '#212121' }}>
                          {option.label}
              </div>
                        <div className="lg:text-xs" style={{ fontSize: '9px', color: '#939393' }}>
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
                  {/* Review 1 - Samine Herald */}
                  <div className="pb-4 lg:pb-6">
                    <div className="flex items-start mb-2 lg:mb-3 lg:space-x-3" style={{ gap: '10px' }}>
                      <div className="w-9 h-9 lg:w-12 lg:h-12 rounded-full bg-gray-200 flex items-center justify-center" style={{ flexShrink: 0 }}>
                        <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                <div className="flex-1" style={{ minWidth: 0 }}>
                        <h4 className="text-gray-900 mb-1 lg:mb-2 lg:font-semibold" style={{ fontSize: '13px', fontWeight: '600' }}>Samine Herald</h4>
                    <div className="flex items-center justify-between" style={{ gap: '8px' }}>
                  <div className="flex items-center lg:space-x-2" style={{ gap: '6px' }}>
                      <div className="flex items-center">
                              {[1,2,3,4,5].map((star) => (
                                <svg key={star} className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                    </div>
                            <span className="text-xs lg:text-sm lg:font-medium" style={{ fontWeight: '500', color: '#939393' }}>5.0</span>
                  </div>
                          <span className="text-[10px] lg:text-xs" style={{ color: '#939393', whiteSpace: 'nowrap' }}>Posted on 2 Jan 2025</span>
                    </div>
                  </div>
              </div>
                    <p className="leading-relaxed mb-3 lg:mb-4 text-xs lg:text-sm" style={{ color: '#B0B0B0' }}>
                      Outstanding experience! This seller goes above and beyond to ensure customer satisfaction. The product was beautifully packaged and arrived ahead of schedule. Great attention to detail and very responsive to messages.
              </p>
                    
                    {/* Helpfulness Section */}
              <div className="flex items-center justify-between flex-wrap" style={{ gap: '10px' }}>
                      {renderHelpfulnessControls('review1')}
                      <button 
                        className="hover:underline"
                        style={{ fontSize: '11px', color: '#64B5F6' }}
                        onClick={() => handleDiscussionToggle('review1')}
                      >
                        {expandedDiscussions.review1 ? 'View less' : `View the discussion (${reviewDiscussionData.review1?.length || 0})`}
                      </button>
                    </div>
            </div>
                    {expandedDiscussions.review1 && reviewDiscussionData.review1 && (
                      <div className="mt-3" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {reviewDiscussionData.review1.map((comment) => (
                          <div key={comment.id} className="flex" style={{ gap: '10px' }}>
                            <div className="w-px self-stretch" style={{ backgroundColor: '#E1E1E1' }} />
                            <div className="flex-1" style={{ paddingLeft: '12px' }}>
                              <div className="flex items-start" style={{ gap: '10px' }}>
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden" style={{ flexShrink: 0 }}>
                                  {comment.avatar ? (
                                    <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />
                                  ) : (
                                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1" style={{ minWidth: 0 }}>
                                  <div className="flex items-center justify-between" style={{ gap: '8px', marginBottom: '4px' }}>
                  <div className="flex items-center" style={{ gap: '6px' }}>
                                      <span className="text-gray-900" style={{ fontSize: '12px', fontWeight: '600' }}>{comment.author}</span>
                                      {comment.isOwner && (
                                        <span style={{ fontSize: '9px', fontWeight: '500', padding: '2px 6px', backgroundColor: '#F0F8FE', color: '#64B5F6', borderRadius: '4px' }}>
                                          {comment.role || 'Profile Owner'}
                                        </span>
                                      )}
                    </div>
                                    <span style={{ fontSize: '10px', color: '#939393', whiteSpace: 'nowrap' }}>{comment.date}</span>
                  </div>
                                  <p className="leading-relaxed" style={{ fontSize: '11px', color: '#939393' }}>{comment.text}</p>
                </div>
              </div>
                              <div style={{ marginTop: '10px', paddingLeft: '38px' }}>
                                {renderHelpfulnessControls(comment.id, 'Was this review helpful to you?')}
            </div>
          </div>
                          </div>
                ))}
              </div>
            )}

                  {/* Review 2 - Kael Otto */}
                  <div className="pb-4 lg:pb-6">
                    <div className="flex items-start mb-2 lg:mb-3 lg:space-x-3" style={{ gap: '10px' }}>
                      <div className="w-9 h-9 lg:w-12 lg:h-12 rounded-full bg-gray-200 flex items-center justify-center" style={{ flexShrink: 0 }}>
                        <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                <div className="flex-1" style={{ minWidth: 0 }}>
                        <h4 className="text-gray-900 mb-1 lg:mb-2 lg:font-semibold" style={{ fontSize: '13px', fontWeight: '600' }}>Kael Otto</h4>
                    <div className="flex items-center justify-between" style={{ gap: '8px' }}>
                          <div className="flex items-center lg:space-x-2" style={{ gap: '6px' }}>
                      <div className="flex items-center">
                              {[1,2,3,4,5].map((star) => (
                                <svg key={star} className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                            <span className="text-xs lg:text-sm lg:font-medium" style={{ fontWeight: '500', color: '#939393' }}>5.0</span>
                    </div>
                          <span className="text-[10px] lg:text-xs" style={{ color: '#939393', whiteSpace: 'nowrap' }}>Posted on 12 Dec 2024</span>
                  </div>
                </div>
              </div>
                    <p className="leading-relaxed mb-3 lg:mb-4 text-xs lg:text-sm" style={{ color: '#B0B0B0' }}>
                      Amazing seller! The product quality exceeded my expectations. Fast shipping and excellent communication throughout the process. The item was exactly as described and arrived in perfect condition.
              </p>
                    
                    {/* Helpfulness Section */}
              <div className="flex items-center justify-between flex-wrap" style={{ gap: '10px' }}>
                      {renderHelpfulnessControls('review2')}
                    <button 
                        className="hover:underline"
                        style={{ fontSize: '11px', color: '#64B5F6' }}
                        onClick={() => handleDiscussionToggle('review2')}
                      >
                        {expandedDiscussions.review2 ? 'View less' : `View the discussion (${reviewDiscussionData.review2?.length || 0})`}
                    </button>
                  </div>
            </div>
                    {expandedDiscussions.review2 && reviewDiscussionData.review2 && (
                      <div className="mt-3" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {reviewDiscussionData.review2.map((comment) => (
                          <div key={comment.id} className="flex" style={{ gap: '10px' }}>
                            <div className="w-px self-stretch" style={{ backgroundColor: '#E1E1E1' }} />
                            <div className="flex-1" style={{ paddingLeft: '12px' }}>
                      <div className="flex items-start" style={{ gap: '10px' }}>
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden" style={{ flexShrink: 0 }}>
                                  {comment.avatar ? (
                                    <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />
                                  ) : (
                                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1" style={{ minWidth: 0 }}>
                                  <div className="flex items-center justify-between" style={{ gap: '8px', marginBottom: '4px' }}>
                          <div className="flex items-center" style={{ gap: '6px' }}>
                                      <span className="text-gray-900" style={{ fontSize: '12px', fontWeight: '600' }}>{comment.author}</span>
                                      {comment.isOwner && (
                                        <span style={{ fontSize: '9px', fontWeight: '500', padding: '2px 6px', backgroundColor: '#F0F8FE', color: '#64B5F6', borderRadius: '4px' }}>
                                          {comment.role || 'Profile Owner'}
                                        </span>
                                      )}
                            </div>
                                    <span style={{ fontSize: '10px', color: '#939393', whiteSpace: 'nowrap' }}>{comment.date}</span>
                          </div>
                                  <p className="leading-relaxed" style={{ fontSize: '11px', color: '#939393' }}>{comment.text}</p>
                        </div>
                            </div>
                              <div style={{ marginTop: '10px', paddingLeft: '38px' }}>
                                {renderHelpfulnessControls(comment.id, 'Was this review helpful to you?')}
                      </div>
                    </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Review 3 - Alex Johnson */}
                  <div className="pb-4 lg:pb-6">
                    <div className="flex items-start mb-2 lg:mb-3 lg:space-x-3" style={{ gap: '10px' }}>
                      <div className="w-9 h-9 lg:w-12 lg:h-12 rounded-full bg-gray-200 flex items-center justify-center" style={{ flexShrink: 0 }}>
                        <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                <div className="flex-1" style={{ minWidth: 0 }}>
                        <h4 className="text-gray-900 mb-1 lg:mb-2 lg:font-semibold" style={{ fontSize: '13px', fontWeight: '600' }}>Alex Johnson</h4>
                    <div className="flex items-center justify-between" style={{ gap: '8px' }}>
                          <div className="flex items-center lg:space-x-2" style={{ gap: '6px' }}>
                      <div className="flex items-center">
                              {[1,2].map((star) => (
                                <svg key={star} className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                              ))}
                              {[1,2,3].map((star) => (
                                <svg key={`empty-${star}`} className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-gray-300 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                            <span className="text-xs lg:text-sm lg:font-medium" style={{ fontWeight: '500', color: '#939393' }}>2.1</span>
                    </div>
                          <span className="text-[10px] lg:text-xs" style={{ color: '#939393', whiteSpace: 'nowrap' }}>Posted on 8 Nov 2024</span>
                  </div>
                </div>
              </div>
                    <p className="leading-relaxed mb-3 lg:mb-4 text-xs lg:text-sm" style={{ color: '#B0B0B0' }}>
                      The product was okay, but not exactly what I expected. Shipping took longer than anticipated. Communication could have been better.
              </p>
                    
                    {/* Helpfulness Section */}
              <div className="flex items-center justify-between flex-wrap" style={{ gap: '10px' }}>
                      {renderHelpfulnessControls('review3')}
                    <button 
                        className="hover:underline"
                        style={{ fontSize: '11px', color: '#64B5F6' }}
                        onClick={() => handleDiscussionToggle('review3')}
                      >
                        {expandedDiscussions.review3 ? 'View less' : `View the discussion (${reviewDiscussionData.review3?.length || 0})`}
                    </button>
                  </div>
            </div>
                    {expandedDiscussions.review3 && reviewDiscussionData.review3 && (
                      <div className="mt-3" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {reviewDiscussionData.review3.map((comment) => (
                          <div key={comment.id} className="flex" style={{ gap: '10px' }}>
                            <div className="w-px self-stretch" style={{ backgroundColor: '#E1E1E1' }} />
                            <div className="flex-1" style={{ paddingLeft: '12px' }}>
                      <div className="flex items-start" style={{ gap: '10px' }}>
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden" style={{ flexShrink: 0 }}>
                                  {comment.avatar ? (
                                    <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />
                                  ) : (
                                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                        <div className="flex-1" style={{ minWidth: 0 }}>
                                  <div className="flex items-center justify-between" style={{ gap: '8px', marginBottom: '4px' }}>
                          <div className="flex items-center" style={{ gap: '6px' }}>
                                      <span className="text-gray-900" style={{ fontSize: '12px', fontWeight: '600' }}>{comment.author}</span>
                                      {comment.isOwner && (
                                        <span style={{ fontSize: '9px', fontWeight: '500', padding: '2px 6px', backgroundColor: '#F0F8FE', color: '#64B5F6', borderRadius: '4px' }}>
                                          {comment.role || 'Profile Owner'}
                                        </span>
                                      )}
                          </div>
                                    <span style={{ fontSize: '10px', color: '#939393', whiteSpace: 'nowrap' }}>{comment.date}</span>
                        </div>
                                  <p className="leading-relaxed" style={{ fontSize: '11px', color: '#939393' }}>{comment.text}</p>
                      </div>
                          </div>
                              <div style={{ marginTop: '10px', paddingLeft: '38px' }}>
                                {renderHelpfulnessControls(comment.id, 'Was this review helpful to you?')}
                        </div>
                      </div>
                          </div>
                        ))}
                    </div>
                  )}
                          </div>

                {/* Pagination */}
                <div className="border-t pt-6 mt-6" style={{ borderColor: '#E5E5E5' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: '#BABABA' }}>1 - 4 out of 23</span>
                    <div className="flex items-center space-x-1">
                      <button 
                        disabled
                        className="transition-opacity disabled:cursor-not-allowed hover:opacity-80"
                      >
                        <img src={grayArrowIcon} alt="Previous" style={{ width: '20px', height: '20px' }} />
                      </button>
                      <button 
                        className="transition-opacity hover:opacity-80"
                      >
                        <img src={blackArrowIcon} alt="Next" style={{ width: '20px', height: '20px' }} />
                      </button>
                        </div>
                      </div>
                    </div>
            </div>

              {/* RIGHT COLUMN - Rating Summary & Give Your Opinion */}
              <div className="hidden lg:block lg:col-span-1">
                {/* Overall Rating Summary */}
                <div className="mb-8 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <div className="text-4xl font-semibold text-gray-900" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>4.3</div>
                    <svg className="w-7 h-7 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
          </div>
                  <div className="text-sm mb-8" style={{ color: '#6A6A6A' }}>Review & Rates (456)</div>
                  
                  {/* Rating Bars */}
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-yellow-400 h-1 rounded-full" style={{width: '70%'}}></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-yellow-400 h-1 rounded-full" style={{width: '60%'}}></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-yellow-400 h-1 rounded-full" style={{width: '40%'}}></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-yellow-400 h-1 rounded-full" style={{width: '20%'}}></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-yellow-400 h-1 rounded-full" style={{width: '10%'}}></div>
                    </div>
                  </div>
                </div>

          </div>
                    </div>
                  </div>
        </div>
      </div>
      
      {/* Spacer before footer */}
      <div className="pb-16"></div>


      {/* Mobile Give Opinion Modal */}
      {showGiveOpinionModal && (
        <>
          {/* Overlay */}
          <div 
            className="lg:hidden fixed inset-0 z-50"
            style={{ backgroundColor: '#0000001A' }}
            onClick={() => setShowGiveOpinionModal(false)}
          />
          
          {/* Modal */}
          <div className="lg:hidden fixed inset-x-0 z-50 flex items-end justify-center" style={{ top: '15%', bottom: '0' }}>
            <div 
              ref={giveOpinionModalRef}
              className="bg-white w-full max-w-full relative"
              style={{ borderRadius: '30px', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Handle */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full" style={{ backgroundColor: '#E1E1E1' }}></div>
              
              {/* Content */}
              <div className="px-5 pb-8 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Give your opinion</h3>
                <p className="text-xs mb-6 text-center" style={{ color: '#B0B0B0' }}>Share your opinion about this user and help others learn a bit more about them.</p>
                
                {/* Star Rating */}
                <div className="flex items-center justify-center space-x-1 mb-2">
                  {[1,2,3,4,5].map((star) => (
                    <button 
                      key={star}
                      onClick={() => setUserRating(star)}
                      className="focus:outline-none hover:scale-110 transition-transform"
                    >
                      <svg 
                        className="w-7 h-7" 
                        viewBox="0 0 24 24"
                        fill={userRating >= star ? '#FBBC05' : 'none'}
                        stroke={userRating >= star ? '#FBBC05' : '#E9E9E9'}
                        strokeWidth="1.5"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </button>
                  ))}
                </div>
                
                <div className="text-center mb-6" style={{ color: userRating > 0 ? '#64B5F6' : '#D9D9D9', fontSize: '10px' }}>
                  {userRating > 0 ? `${userRating}.0` : 'give a note'}
                </div>
                
                {/* Review Text Input */}
                <textarea
                  value={userReviewText}
                  onChange={(e) => setUserReviewText(e.target.value)}
                  placeholder="What do you think about this seller?"
                  className="w-full border rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-1"
                  style={{ borderColor: '#E1E1E1', minHeight: '120px', color: '#212121' }}
                />
                
                {/* Submit Button */}
                <button 
                  onClick={() => {
                    if (userRating > 0 && userReviewText.trim()) {
                      const today = new Date();
                      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      const dateStr = `${today.getDate()} ${months[today.getMonth()]}, ${today.getFullYear()}`;
                      setPostedReview({
                        rating: userRating,
                        text: userReviewText,
                        date: dateStr
                      });
                      setIsReviewPosted(true);
                      setShowGiveOpinionModal(false);
                    }
                  }}
                  className="w-full py-3 mt-4 font-normal text-white transition-colors"
                  style={{ backgroundColor: '#F9A825', borderRadius: '12px' }}
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Share Profile Modal */}
      {showShareModal && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-50"
            style={{ backgroundColor: '#0000001A' }}
            onClick={() => setShowShareModal(false)}
          />
          
          {/* Desktop Share Modal */}
          <div className="hidden lg:block fixed inset-0 z-50">
            <div className="flex items-center justify-center h-full px-4">
              <div 
                className="bg-white rounded-2xl shadow-xl relative max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
                style={{ padding: '32px 24px', marginTop: '40px' }}
              >
              {/* Profile Picture - Half Outside Modal */}
              <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '-40px' }}>
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  <img
                    src={seller.avatar}
                    alt={seller.name}
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
          </div>

          {/* Mobile Bottom Sheet */}
          <div className="lg:hidden fixed inset-x-0 z-50 flex items-end justify-center px-4" style={{ top: '10%', bottom: '0' }}>
            <div 
              className="bg-white w-full max-w-full relative"
              style={{ borderRadius: '30px', maxHeight: '90vh', overflowY: 'auto', marginBottom: '16px' }}
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Content */}
              <div className="px-4 pb-6 pt-6">
                {/* Profile Picture */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                    <img
                      src={seller.avatar}
                      alt={seller.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowShareModal(false)}
                  className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Heading */}
                <h3 className="font-semibold text-center mb-2" style={{ fontSize: '17px', color: '#212121', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                  Share this profile with your network
                </h3>

                {/* Description */}
                <p className="text-center mb-5" style={{ fontSize: '11px', color: '#B0B0B0' }}>
                  Increase visibility by showcasing this profile to connect with more buyers or potential clients.
                </p>

                {/* Link Field with Copy Button */}
                <div className="flex items-center mb-5" style={{ gap: '6px' }}>
                  <input
                    type="text"
                    value={`baoafrik.com/user-profil`}
                    readOnly
                    className="flex-1 rounded-lg"
                    style={{ backgroundColor: '#F4F4F4', color: '#6A6A6A', border: 'none', padding: '8px 10px', fontSize: '11px' }}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                    }}
                    className="rounded-lg font-medium text-white transition-colors hover:opacity-90"
                    style={{ backgroundColor: '#000000', padding: '8px 12px', fontSize: '11px' }}
                  >
                    Copy link
                  </button>
                </div>

                {/* Share To Section */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3" style={{ fontSize: '12px' }}>Share to</h4>
                  <div className="flex items-center justify-center" style={{ gap: '16px' }}>
                    <button className="flex flex-col items-center" style={{ gap: '6px' }}>
                      <img src={fbIcon} alt="Facebook" className="w-9 h-9" />
                      <span style={{ fontSize: '10px', color: '#B0B0B0' }}>Facebook</span>
                    </button>
                    <button className="flex flex-col items-center" style={{ gap: '6px' }}>
                      <img src={igIcon} alt="Instagram" className="w-9 h-9" />
                      <span style={{ fontSize: '10px', color: '#B0B0B0' }}>Instagram</span>
                    </button>
                    <button className="flex flex-col items-center" style={{ gap: '6px' }}>
                      <img src={xIcon} alt="X" className="w-9 h-9" />
                      <span style={{ fontSize: '10px', color: '#B0B0B0' }}>X</span>
                    </button>
                    <button className="flex flex-col items-center" style={{ gap: '6px' }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0088cc' }}>
                        <img src={tgIcon} alt="Telegram" className="w-5 h-5" style={{ filter: 'brightness(0) invert(1)' }} />
                      </div>
                      <span style={{ fontSize: '10px', color: '#B0B0B0' }}>Telegram</span>
                    </button>
                    <button className="flex flex-col items-center" style={{ gap: '6px' }}>
                      <img src={zapIcon} alt="WhatsApp" className="w-9 h-9" />
                      <span style={{ fontSize: '10px', color: '#B0B0B0' }}>Whatsapp</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Drag Handle - Bottom */}
              <div className="flex justify-center py-4">
                <div className="w-20 rounded-full" style={{ backgroundColor: '#E1E1E1', height: '3px' }}></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserAccount; 
