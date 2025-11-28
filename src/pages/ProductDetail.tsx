import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Import product images
import mainImage from '../assets/images/logos/0.png'; // New main white pepper image
import africanTextileImage from '../assets/images/logos/Fashion.png';
import basketImage from '../assets/images/logos/culture.png';
import woodenCombImage from '../assets/images/logos/decor.png';
import thumbnailImage1 from '../assets/images/logos/1.png';
import thumbnailImage2 from '../assets/images/logos/2.png';
import thumbnailImage3 from '../assets/images/logos/3.png';
import sellerAvatar from '../assets/images/logos/avatar.png';

// Import new product images from pre folder
import pre1 from '../assets/images/pre/1.png';
import pre2 from '../assets/images/pre/2.png';
import pre3 from '../assets/images/pre/3.png';
import pre4 from '../assets/images/pre/4.png';
import pre5 from '../assets/images/pre/5.png';
import pre6 from '../assets/images/pre/6.png';

// Import share icon and arrow icon
import shareIcon from '../assets/images/pre/Share.svg';
import arrowLeftIcon from '../assets/images/pre/arrow-left.svg';
import backArrowIcon from '../assets/images/pre/back arrow.svg';
// Import social media icons for share modal
import fbIcon from '../assets/images/pre/FB1.svg';
import igIcon from '../assets/images/pre/IG1.svg';
import xIcon from '../assets/images/pre/x.svg';
import tgIcon from '../assets/images/pre/tg.svg';
import zapIcon from '../assets/images/pre/zap1.svg';
// Import icons for product detail
import basketIcon from '../assets/images/pre/basket.png';
import locIcon from '../assets/images/pre/Loc.svg';
import verifyIcon from '../assets/images/pre/verify.svg';
import unverifyIcon from '../assets/images/pre/unverify.svg';
import pepperIcon from '../assets/images/pre/pepper.svg';
import bookmarkIcon from '../assets/images/pre/bm.svg';
import spIcon from '../assets/images/pre/sp.svg';
import availableIcon from '../assets/images/pre/av.svg';
import trashIcon from '../assets/images/pre/trash.svg';
import activeIcon from '../assets/images/pre/active.svg';
import inactiveIcon from '../assets/images/pre/inactive.svg';
import repostIcon from '../assets/images/pre/repost.svg';
import renewIcon from '../assets/images/pre/renew.svg';
// Import icons for reviews section
import likeIcon from '../assets/images/pre/like.svg';
import dislikeIcon from '../assets/images/pre/dislike.svg';
import grayArrowIcon from '../assets/images/pre/gray.svg';
import blackArrowIcon from '../assets/images/pre/black.svg';
import locationIcon from '../assets/images/pre/PL.svg';
import pencilIcon from '../assets/images/pre/pencil.svg';

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

interface OwnerListingState {
  fromMyListings?: boolean;
  listing?: {
    id: string;
    title: string;
    price: string;
    currency: string;
    status: 'active' | 'inactive';
    daysLeft?: number;
    createdAt: number;
    messages?: number;
  };
}

const formatOwnerDate = (timestamp?: number) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const renderStatusBadge = (status?: 'active' | 'inactive', daysLeft?: number) => {
  if (typeof daysLeft === 'number') {
    return (
      <div
        style={{
          backgroundColor: '#FEF6E9',
          color: '#FAB951',
          fontSize: '11px',
          borderRadius: '999px',
          padding: '4px 10px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'Poppins, sans-serif'
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#FAB951" />
          <path d="M12 7v5l3 2" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {daysLeft} Day left
      </div>
    );
  }

  if (!status) return null;

  const isActive = status === 'active';
  return (
    <div
      style={{
        backgroundColor: isActive ? '#EDFBF0' : '#FFF5F5',
        color: isActive ? '#70E183' : '#FF5151',
        fontSize: '11px',
        borderRadius: '999px',
        padding: '4px 10px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      <img src={isActive ? activeIcon : inactiveIcon} alt={status} className="w-3 h-3" />
      {isActive ? 'Active' : 'Inactive'}
    </div>
  );
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const routerLocation = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [sharedProducts, setSharedProducts] = useState<Set<string>>(new Set());
  const [wishlistProducts, setWishlistProducts] = useState<Set<string>>(new Set());
  const [currentOtherProductsIndex, setCurrentOtherProductsIndex] = useState(0);
  const [currentRecommendedIndex, setCurrentRecommendedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [isContactingSeller, setIsContactingSeller] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showGiveOpinionModal, setShowGiveOpinionModal] = useState(false);
  const [showMessagesDropdown, setShowMessagesDropdown] = useState(false);
  const messagesDropdownRef = useRef<HTMLDivElement>(null);
  const ownerViewState = routerLocation.state as OwnerListingState | null;
  const ownerListing = ownerViewState?.listing;
  const isOwnerView = Boolean(ownerViewState?.fromMyListings && ownerListing);
  
  // Reviews section state
  const [activeTab, setActiveTab] = useState<'reviews' | 'items'>('reviews');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('The most relevant');
  const [userRating, setUserRating] = useState(0);
  const [userReviewText, setUserReviewText] = useState('');
  const [reviewHelpfulness, setReviewHelpfulness] = useState<{[key: string]: 'yes' | 'no' | null}>({});
  const [reviewHelpfulCounts, setReviewHelpfulCounts] = useState<{[key: string]: {yes: number; no: number}}>({
    review1: { yes: 27, no: 2 },
    review2: { yes: 15, no: 3 },
    review3: { yes: 8, no: 12 }
  });
  const [expandedDiscussions, setExpandedDiscussions] = useState<{[key: string]: boolean}>({});
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const [isReviewPosted, setIsReviewPosted] = useState(false);
  const [postedReview, setPostedReview] = useState<{rating: number; text: string; date: string} | null>(null);
  
  // Click outside handler for messages dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (messagesDropdownRef.current && !messagesDropdownRef.current.contains(event.target as Node)) {
        setShowMessagesDropdown(false);
      }
    };

    if (showMessagesDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMessagesDropdown]);

  // Mock recent messages data
  const recentMessages = ownerListing?.messages ? [
    {
      id: '1',
      name: 'Nadine MABE',
      avatar: sellerAvatar,
      rating: 4.3,
      messageState: 'new' as 'new' | 'read' | 'you',
      messagePreview: 'New message',
      timestamp: 'Today, 10:52'
    },
    {
      id: '2',
      name: 'Loïc ABENA',
      avatar: sellerAvatar,
      rating: 4.3,
      messageState: 'read' as 'new' | 'read' | 'you',
      messagePreview: 'Hello, I am interested by this item is...',
      timestamp: 'Today, 10:52'
    },
    {
      id: '3',
      name: 'Ryan MUBOU',
      avatar: sellerAvatar,
      rating: 4.3,
      messageState: 'you' as 'new' | 'read' | 'you',
      messagePreview: 'Where should I deliver to please...',
      timestamp: 'Today, 10:52'
    },
    {
      id: '4',
      name: 'Aïssatou WABE',
      avatar: sellerAvatar,
      rating: 4.3,
      messageState: 'you' as 'new' | 'read' | 'you',
      messagePreview: 'Where should I deliver to please...',
      timestamp: 'Today, 10:52'
    }
  ].slice(0, Math.min(ownerListing.messages, 4)) : [];
  
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
          d="M14.0166 1.6665H5.98327C4.20827 1.6665 2.7666 3.1165 2.7666 4.88317V16.6248C2.7666 18.1248 3.8416 18.7582 5.15827 18.0332L9.22493 15.7748C9.65827 15.5332 10.3583 15.5332 10.7833 15.7748L14.8499 18.0332C16.1666 18.7665 17.2416 18.1332 17.2416 16.6248V4.88317C17.2333 3.1165 15.7916 1.6665 14.0166 1.6665Z"
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

  const renderHelpfulnessControls = (
    itemId: string,
    questionText = 'Was this review helpful to you?',
    alignment: 'left' | 'right' = 'left',
    fullWidth = false
  ) => {
    const selection = reviewHelpfulness[itemId];
    const counts = reviewHelpfulCounts[itemId] || { yes: 0, no: 0 };
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

    return (
      <div
        className={`flex items-center ${isMobile ? 'space-x-2' : 'space-x-3'} ${fullWidth ? 'w-full' : ''} ${alignment === 'right' ? 'justify-end' : 'justify-start'}`}
      >
        {!selection && (
          <span className={isMobile ? 'text-[10px]' : 'text-xs'} style={{ color: '#212121' }}>
            {questionText}
          </span>
        )}
        <div className={`flex items-center ${isMobile ? 'space-x-1.5' : 'space-x-2'}`}>
          <button
            onClick={() => handleHelpfulnessClick(itemId, 'yes')}
            className={`flex items-center ${isMobile ? 'space-x-1 px-2 py-0.5' : 'space-x-1.5 px-2.5 py-1'} rounded-full transition-colors`}
            style={{
              border: `1px solid ${selection === 'yes' ? '#F0F8FE' : '#E1E1E1'}`,
              backgroundColor: selection === 'yes' ? '#F0F8FE' : 'white'
            }}
          >
            <span className={isMobile ? 'text-[10px]' : 'text-xs'} style={{ color: selection === 'yes' ? '#64B5F6' : '#6A6A6A' }}>
              {selection ? counts.yes : 'Yes'}
            </span>
            <img
              src={likeIcon}
              alt="Like"
              className={isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}
              style={{
                filter: selection === 'yes'
                  ? 'brightness(0) saturate(100%) invert(60%) sepia(89%) saturate(1726%) hue-rotate(183deg) brightness(97%) contrast(92%)'
                  : 'none'
              }}
            />
          </button>
          <button
            onClick={() => handleHelpfulnessClick(itemId, 'no')}
            className={`flex items-center ${isMobile ? 'space-x-1 px-2 py-0.5' : 'space-x-1.5 px-2.5 py-1'} rounded-full transition-colors`}
            style={{
              border: `1px solid ${selection === 'no' ? '#F0F8FE' : '#E1E1E1'}`,
              backgroundColor: selection === 'no' ? '#F0F8FE' : 'white'
            }}
          >
            <span className={isMobile ? 'text-[10px]' : 'text-xs'} style={{ color: selection === 'no' ? '#64B5F6' : '#6A6A6A' }}>
              {selection ? counts.no : 'No'}
            </span>
            <img
              src={dislikeIcon}
              alt="Dislike"
              className={isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}
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

  // Product images array - main image first, then thumbnail images
  const images = [mainImage, thumbnailImage1, thumbnailImage2, thumbnailImage3];

  // Auto-slide images on mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 1024; // lg breakpoint
    if (!isMobile) return;
    
    const interval = setInterval(() => {
      setSelectedImageIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    
    return () => clearInterval(interval);
  }, [images.length]);

  // Hide global header on mobile while on this page
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window.innerWidth >= 1024) {
      return;
    }

    const headerEl = document.querySelector('header') as HTMLElement | null;
    if (!headerEl) {
      return;
    }

    const previousDisplay = headerEl.style.display;
    headerEl.style.display = 'none';

    return () => {
      headerEl.style.display = previousDisplay;
    };
  }, []);

  // Share product handler
  const handleShareProduct = async (productId: string) => {
    const newSet = new Set(sharedProducts);
    if (newSet.has(productId)) {
      newSet.delete(productId);
    } else {
      newSet.add(productId);
      
      // Share functionality
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
          // You could show a toast notification here
          console.log('Product link copied to clipboard!');
        }
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
    setSharedProducts(newSet);
  };

  const sellerVerifiedFromState = (routerLocation.state as { sellerVerified?: boolean } | null)?.sellerVerified;

  // Mock product data (in real app, this would come from API based on id)
  const defaultProduct = {
    id: id || '12890',
    name: 'White pepper',
    price: 31.7,
    location: 'London | United Kingdom',
    category: 'Spices',
    publishedDate: 'Published 2 days ago',
    description: 'White pepper is a spice produced from the dried seed of the pepper plant. It consists of the seed only, with the darker-colored skin removed through a retting process.',
    seller: {
      name: 'Ngozi Mbeki',
      avatar: sellerAvatar,
      rating: 4.8,
      reviewCount: 124,
      verified: true,
      location: 'London, United Kingdom',
      joinDate: 'June 2018',
      description: 'Passionate about discovering unique products and always on the lookout for great deals. I enjoy exploring new brands, trying out innovative items, and supporting businesses that deliver quality and creativity.',
      website: 'user-randomlink.com'
    }
  };

  const product = {
    ...defaultProduct,
    seller: {
      ...defaultProduct.seller,
      verified: sellerVerifiedFromState ?? defaultProduct.seller.verified
    }
  };

  const displayName = ownerListing?.title ?? product.name;
  const displayPrice = ownerListing ? `${ownerListing.price} ${ownerListing.currency}` : `USD ${product.price}`;
  const defaultDateLabel = product.publishedDate ?? 'Mon, 21 Dec 2024';
  const displayDateLabel = ownerListing?.createdAt ? formatOwnerDate(ownerListing.createdAt) : defaultDateLabel;

  const reviewDiscussionData: {[key: string]: Array<{id: string; author: string; role?: string; date: string; text: string; isOwner?: boolean; avatar?: string}>} = {
    review1: [
      {
        id: 'review1-comment1',
        author: product.seller.name,
        role: 'Product Owner',
        date: '2 Jan 2025',
        text: 'I am glad the flavor worked well for your dishes, Samine. Each batch is sourced carefully so you can count on the same aroma every time.',
        isOwner: true,
        avatar: product.seller.avatar
      }
    ],
    review2: [
      {
        id: 'review2-comment1',
        author: 'Ibrahim Kalu',
        date: '13 Dec 2024',
        text: 'Thanks for the detailed feedback, Kael! I also noticed the aroma lingers nicely when simmered slowly.',
        avatar: sellerAvatar
      },
      {
        id: 'review2-comment2',
        author: product.seller.name,
        role: 'Product Owner',
        date: '13 Dec 2024',
        text: 'Happy you enjoyed it, Kael. Feel free to reach out if you ever need larger quantities for your kitchen.',
        isOwner: true,
        avatar: product.seller.avatar
      },
      {
        id: 'review2-comment3',
        author: 'Ada Ifeoma',
        date: '14 Dec 2024',
        text: 'Totally agree—shipping was quick for me too. Perfect for soups!',
        avatar: sellerAvatar
      }
    ],
    review3: [
      {
        id: 'review3-comment1',
        author: product.seller.name,
        role: 'Product Owner',
        date: '9 Nov 2024',
        text: 'Thanks for sharing, Alex. I can offer a bolder batch next time—send me a message and I will make it right.',
        isOwner: true,
        avatar: product.seller.avatar
      },
      {
        id: 'review3-comment2',
        author: 'Chinedu Bassey',
        date: '10 Nov 2024',
        text: 'I had a stronger flavor experience, maybe try it freshly ground. It made a difference for me.',
        avatar: sellerAvatar
      }
    ]
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // In a real app, this would save to user's saved items
    console.log(isSaved ? 'Product removed from saved items' : 'Product saved to saved items');
  };

  const handleShare = async () => {
    setIsShared(!isShared);
    
    if (!isShared) {
      // Share functionality
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
          console.log('Product link copied to clipboard!');
        }
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const toggleAdditionalInfo = () => {
    setShowAdditionalInfo(!showAdditionalInfo);
  };

  const handleContactSeller = () => {
    setIsContactingSeller(true);
    
    // Simulate loading time
    setTimeout(() => {
      const productData = {
        id: product.id,
        name: product.name,
        price: product.price,
        location: product.location,
        category: product.category,
        description: product.description,
        image: images[selectedImageIndex],
        seller: {
          name: product.seller.name,
          avatar: product.seller.avatar,
          rating: product.seller.rating,
          location: product.seller.location,
          joinDate: product.seller.joinDate,
          description: product.seller.description,
          website: product.seller.website
        }
      };
      
      navigate('/messages', { 
        state: { 
          productData,
          preFilledMessage: "Hello, I am interested by this item, is it still available please ?"
        } 
      });
    }, 1500); // 1.5 second loading time
  };


  const handleWishlist = (productId: string) => {
    setWishlistProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleOtherProductsNext = () => {
    setCurrentOtherProductsIndex(prev => (prev + 1) % 4);
  };

  const handleOtherProductsPrev = () => {
    setCurrentOtherProductsIndex(prev => (prev - 1 + 4) % 4);
  };

  const handleRecommendedNext = () => {
    setCurrentRecommendedIndex(prev => (prev + 1) % 4);
  };

  const handleRecommendedPrev = () => {
    setCurrentRecommendedIndex(prev => (prev - 1 + 4) % 4);
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (searchQuery) searchParams.set('q', searchQuery);
    if (selectedCategory) searchParams.set('category', selectedCategory);
    if (locationFilter) searchParams.set('location', locationFilter);
    
    navigate(`/?${searchParams.toString()}`);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-white lg:bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* Desktop Breadcrumb - Hidden on Mobile */}
      <div className="hidden lg:block bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between -ml-4">
            {/* Left side - Breadcrumb */}
            <div className="flex items-center space-x-2" style={{ fontSize: '13px' }}>
              {/* Back Arrow Icon */}
              <img 
                src={arrowLeftIcon} 
                alt="Back" 
                className="cursor-pointer hover:opacity-80 transition-opacity" 
                style={{ width: '14px', height: '14px' }}
                onClick={() => navigate('/')}
              />
              
              {/* Homepage text */}
              <Link to="/" className="hover:opacity-80 transition-opacity" style={{ color: '#BABABA' }}>
                Homepage
              </Link>
              
              {/* Dot separator */}
              <span style={{ color: '#BABABA', fontSize: '17px', lineHeight: 1 }}>·</span>
              
              {/* Product ID text */}
              <span className="font-medium" style={{ color: '#212121' }}>
                Product ID
              </span>
            </div>
            
            {/* Right side - Owner Actions / Share */}
            {isOwnerView ? (
              <div className="flex items-center gap-2" style={{ marginRight: '20px', position: 'relative', left: '32px' }}>
                <button
                  type="button"
                  className="flex items-center justify-center"
                  style={{ backgroundColor: '#FFE9E9', width: '40px', height: '32px', borderRadius: '12px' }}
                >
                  <img src={trashIcon} alt="Delete listing" className="w-4 h-4" style={{ filter: 'brightness(0) saturate(100%) invert(53%) sepia(46%) saturate(3205%) hue-rotate(332deg) brightness(103%) contrast(102%)' }} />
                </button>
                {ownerListing?.status === 'active' ? (
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                    style={{ backgroundColor: '#F4F4F4', color: '#939393', fontSize: '13px' }}
                    onClick={() => navigate('/create-listing', { state: { draft: ownerListing ?? null } })}
                  >
                    <img src={pencilIcon} alt="Edit listing" className="w-4 h-4" style={{ filter: 'brightness(0) saturate(100%) invert(46%) sepia(4%) saturate(18%) hue-rotate(355deg) brightness(96%) contrast(91%)' }} />
                    Edit listing
                  </button>
                ) : (
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                    style={{ backgroundColor: '#F0F8FE', color: '#64B5F6', fontSize: '13px' }}
                    onClick={() => {
                      // Handle repost functionality
                      console.log('Repost listing');
                    }}
                  >
                    <img src={repostIcon} alt="Repost" className="w-4 h-4" style={{ filter: 'brightness(0) saturate(100%) invert(60%) sepia(89%) saturate(1726%) hue-rotate(183deg) brightness(97%) contrast(92%)' }} />
                    Repost
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowShareModal(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                style={{ backgroundColor: '#F4F4F4', marginRight: '20px' }}
              >
                <img src={shareIcon} alt="Share" className="w-5 h-5" style={{ filter: 'brightness(0) saturate(100%) invert(73%) sepia(0%) saturate(0%)' }} />
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Full-Screen Image Gallery */}
      <div className="lg:hidden relative">
        <div className="relative h-80 bg-gray-100">
          <img
            src={images[selectedImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="eager"
          />
          
          {/* Overlay Controls */}
          <div className="absolute inset-0">
            {/* Back Arrow - Top Left */}
            <button
              onClick={() => navigate('/')}
              className="absolute top-4 left-4 w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg z-10"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Action Button - Top Right */}
            <div className="absolute top-4 right-4 z-10">
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="5" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="19" cy="12" r="1.5" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Thumbnail Slider - Center Top of Image */}
          <div className="absolute top-64 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full z-10" style={{ backgroundColor: '#21212199' }}>
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className="transition-all rounded-full"
                style={{
                  width: selectedImageIndex === index ? '16px' : '6px',
                  height: '6px',
                  backgroundColor: selectedImageIndex === index ? '#FFFFFF' : '#B0B0B0'
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-12">
            {/* Left Side - Image Gallery */}
            <div className="flex-shrink-0">
              {/* Main Image */}
              <div className="relative w-[450px] h-[450px] rounded-[40px] overflow-hidden bg-gray-100 mb-4">
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                
                {/* Image Slider Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: '#21212199' }}>
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className="transition-all rounded-full"
                      style={{
                        width: selectedImageIndex === index ? '16px' : '6px',
                        height: '6px',
                        backgroundColor: selectedImageIndex === index ? '#FFFFFF' : '#B0B0B0'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-3 ml-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-[56px] h-[56px] rounded-lg overflow-hidden ${
                      selectedImageIndex === index ? 'border-2' : ''
                    }`}
                    style={selectedImageIndex === index ? { borderColor: '#9E9E9E' } : {}}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {selectedImageIndex === index && (
                      <>
                        {/* White overlay */}
                        <div className="absolute inset-0" style={{ backgroundColor: '#FFFFFF99' }}></div>
                        {/* Check icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center border-2 border-white" style={{ backgroundColor: '#F9A825' }}>
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      </>
                    )}
                  </button>
                ))}
              </div>
              </div>

            {/* Right Side - Product Info */}
            <div className="flex-1 max-w-3xl">
              {/* Product Name and Posted Date */}
              <div className="flex items-center justify-between mb-1.5">
                <h1 className="font-normal" style={{ fontSize: '18px', color: '#939393' }}>
                  {displayName}
                </h1>
                {isOwnerView && renderStatusBadge(ownerListing?.status, ownerListing?.daysLeft)}
              </div>
              
              {/* Price and posted date */}
              <div className="flex items-center justify-between mb-8">
                <div style={{ fontSize: '28px', color: '#212121', fontWeight: 600, fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                  {displayPrice}
                </div>
                <span className="font-light" style={{ fontSize: '12px', color: '#6A6A6A', whiteSpace: 'nowrap' }}>
                  {displayDateLabel}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 mb-10">
                {/* Contact Seller Button */}
                  <button 
                  onClick={handleContactSeller}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#F9A825', fontSize: '13px', fontWeight: 500, width: 'fit-content' }}
                  disabled={isContactingSeller}
                >
                  <img src={basketIcon} alt="Cart" className="w-4 h-4" style={{ filter: 'brightness(0) invert(1)' }} />
                  <span>{isContactingSeller ? 'Connecting...' : 'Contact Seller'}</span>
                  </button>

                {/* Save for Later Button */}
                  <button 
                  onClick={handleSave}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl transition-colors hover:opacity-80 relative"
                  style={{ 
                    backgroundColor: isSaved ? '#F0F8FE' : '#F4F4F4', 
                    color: isSaved ? '#64B5F6' : '#6A6A6A', 
                    fontSize: '13px', 
                    fontWeight: 500, 
                    width: 'fit-content' 
                  }}
                >
                  <BookmarkIcon saved={isSaved} />
                  <span>Save for later</span>
                  </button>
                </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 mb-6 text-xs">
                <img src={locIcon} alt="Location" className="w-3 h-3" style={{ filter: 'brightness(0) saturate(100%) invert(73%) sepia(52%) saturate(1685%) hue-rotate(352deg) brightness(103%) contrast(95%)' }} />
                <span className="font-light" style={{ color: '#939393' }}>
                  {product.location}
                </span>
              </div>

              {/* Badges */}
              <div className="flex gap-2.5 mb-4">
                {/* Country Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border text-xs" style={{ borderColor: '#E1E1E1' }}>
                  <img 
                    src="https://flagcdn.com/w20/cm.png" 
                    alt="Cameroon flag" 
                    className="w-3.5 h-3.5 rounded-full object-cover"
                  />
                  <span className="font-light" style={{ color: '#939393' }}>Cameroun</span>
              </div>
                
                {/* Category Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border text-xs" style={{ borderColor: '#E1E1E1' }}>
                  <img src={pepperIcon} alt="Pepper" className="w-3 h-3" />
                  <span className="font-light" style={{ color: '#939393' }}>Spices</span>
            </div>

                {/* Availability Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border text-xs" style={{ borderColor: '#E1E1E1' }}>
                  <img src={availableIcon} alt="Available" className="w-3 h-3" />
                  <span className="font-light" style={{ color: '#939393' }}>Available : 1</span>
                </div>
              </div>
              
              {/* Description */}
              <p className="font-light leading-relaxed text-sm" style={{ color: '#B0B0B0', marginBottom: '2px' }}>
                Premium white pepper sourced from the fertile soils of Africa. Known for its mild aromatic heat and rich flavour, it adds an authentic touch of home to your dishes, perfect for the diaspora seeking a taste of tradition.
              </p>

              {/* Read More Link */}
              <button 
                onClick={toggleAdditionalInfo}
                className="font-medium mb-6 hover:underline text-sm"
                style={{ color: '#64B5F6', textDecoration: 'none' }}
              >
                Read more
              </button>

              {/* Messages Received Component - Only show for active listings */}
              {isOwnerView && ownerListing?.status === 'active' && ownerListing?.messages && ownerListing.messages > 0 && (
                <div ref={messagesDropdownRef} className="relative">
                  <div 
                    className="flex items-center gap-2 px-3 rounded-full cursor-pointer hover:opacity-90 transition-opacity mb-2"
                    style={{ 
                      backgroundColor: showMessagesDropdown ? '#F0F8FE' : '#F8FCFF', 
                      border: `1px solid #F0F8FE`,
                      width: 'fit-content',
                      paddingTop: '1px',
                      paddingBottom: '1px'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMessagesDropdown(!showMessagesDropdown);
                    }}
                  >
                    {/* Avatars */}
                    <div className="flex items-center" style={{ marginRight: '6px' }}>
                      {[1, 2, 3, 4].slice(0, Math.min(ownerListing.messages, 4)).map((_, index) => {
                        const avatarColors = ['#E3F2FD', '#F3E5F5', '#FFF3E0', '#E8F5E9'];
                        return (
                          <div
                            key={index}
                            className="rounded-full overflow-hidden border-2 border-white flex items-center justify-center"
                            style={{
                              width: '24px',
                              height: '24px',
                              marginLeft: index > 0 ? '-6px' : '0',
                              zIndex: 4 - index,
                              backgroundColor: avatarColors[index % avatarColors.length]
                            }}
                          >
                            <img
                              src={sellerAvatar}
                              alt={`Buyer ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Text */}
                    <span 
                      className="text-xs font-normal"
                      style={{ 
                        color: showMessagesDropdown ? '#64B5F6' : '#939393', 
                        fontFamily: 'Poppins, sans-serif' 
                      }}
                    >
                      {ownerListing.messages} Message{ownerListing.messages !== 1 ? 's' : ''} received for this product
                    </span>
                    
                    {/* Arrow Icon */}
                    <img
                      src={backArrowIcon}
                      alt="Arrow"
                      className="flex-shrink-0"
                      style={{ 
                        width: '14px', 
                        height: '14px', 
                        marginLeft: '6px',
                        transform: 'scaleX(-1)',
                        filter: showMessagesDropdown ? 'brightness(0) saturate(100%) invert(60%) sepia(89%) saturate(1726%) hue-rotate(183deg) brightness(97%) contrast(92%)' : 'none'
                      }}
                    />
                  </div>

                  {/* Dropdown */}
                  {showMessagesDropdown && recentMessages.length > 0 && (
                    <div
                      className="absolute top-full left-0 mt-2 z-50"
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                        padding: '12px',
                        minWidth: '400px',
                        maxWidth: '500px'
                      }}
                    >
                      {recentMessages.map((message, index) => {
                        const avatarColors = ['#E3F2FD', '#F3E5F5', '#FFF3E0', '#E8F5E9'];
                        return (
                          <div
                            key={message.id}
                            className="cursor-pointer mb-2 last:mb-0 hover:opacity-90 transition-opacity"
                            style={{
                              border: '1px solid #E9E9E9',
                              borderRadius: '14px',
                              padding: '12px'
                            }}
                            onClick={() => {
                              navigate(`/messages?productId=${ownerListing.id}&conversationId=${message.id}`);
                              setShowMessagesDropdown(false);
                            }}
                          >
                            <div className="flex items-start gap-3">
                              {/* Avatar */}
                              <div
                                className="rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  border: '2px solid #939393',
                                  backgroundColor: avatarColors[index % avatarColors.length]
                                }}
                              >
                                <img
                                  src={message.avatar}
                                  alt={message.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                {/* Name and Rating */}
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span
                                    className="font-medium text-sm"
                                    style={{ color: '#212121', fontFamily: 'Poppins, sans-serif' }}
                                  >
                                    {message.name}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <svg
                                        key={i}
                                        className="w-3 h-3"
                                        viewBox="0 0 24 24"
                                        fill={i < Math.floor(message.rating) ? '#FBBC05' : 'none'}
                                        stroke={i < Math.floor(message.rating) ? '#FBBC05' : '#E0E0E0'}
                                        strokeWidth="1"
                                      >
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                      </svg>
                                    ))}
                                    <span className="text-xs" style={{ color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
                                      {message.rating}
                                    </span>
                                  </div>
                                </div>

                                {/* Message State with Timestamp */}
                                <div className="flex items-center justify-between gap-2" style={{ marginTop: '2px' }}>
                                  <div className="flex items-center gap-1 flex-1 min-w-0">
                                    {message.messageState === 'new' ? (
                                      <span style={{ color: '#64B5F6', fontSize: '11px', fontFamily: 'Poppins, sans-serif' }}>
                                        {message.messagePreview}
                                      </span>
                                    ) : message.messageState === 'you' ? (
                                      <>
                                        <span
                                          className="px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0"
                                          style={{
                                            backgroundColor: '#E3F2FD',
                                            color: '#64B5F6',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '10px'
                                          }}
                                        >
                                          You
                                        </span>
                                        <span style={{ color: '#939393', fontSize: '11px', fontFamily: 'Poppins, sans-serif' }}>
                                          {message.messagePreview}
                                        </span>
                                      </>
                                    ) : (
                                      <span style={{ color: '#939393', fontSize: '11px', fontFamily: 'Poppins, sans-serif' }}>
                                        {message.messagePreview}
                                      </span>
                                    )}
                                  </div>
                                  {/* Timestamp */}
                                  <span
                                    className="text-xs flex-shrink-0"
                                    style={{ 
                                      color: '#BBBBBB', 
                                      fontFamily: 'Bricolage Grotesque, sans-serif' 
                                    }}
                                  >
                                    {message.timestamp}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Seller Profile Section */}
              <div className="flex items-start p-4 rounded-xl -ml-2 w-full">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-gray-100 border-2 overflow-hidden flex-shrink-0" style={{ borderColor: '#BDBDBD' }}>
                    <img
                      src={product.seller.avatar}
                      alt={product.seller.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Seller Info */}
                    <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm" style={{ color: '#212121' }}>
                        {product.seller.name}
                      </span>
                      {product.seller.verified ? (
                        <div className="flex items-center bg-green-50 rounded" style={{ padding: '1px 4px', gap: '1px', fontSize: '9px', color: '#45C55B' }}>
                          <img src={verifyIcon} alt="Verified" className="w-2 h-2" />
                          <span>Verified seller</span>
                    </div>
                      ) : (
                        <div className="flex items-center text-gray-600 bg-gray-100 rounded" style={{ padding: '1px 4px', gap: '1px', fontSize: '9px' }}>
                          <img src={unverifyIcon} alt="Unverified" className="w-2 h-2" />
                          <span>Unverified Seller</span>
                    </div>
                  )}
                    </div>
                    <div className="flex items-center gap-0.5">
                      {/* Rating Stars */}
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4"
                          fill={i < Math.floor(product.seller.rating) ? '#F9A825' : '#E9E9E9'}
                          stroke="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                  </svg>
                      ))}
                      <span className="ml-1 text-xs font-light" style={{ color: '#939393' }}>
                        {product.seller.rating}
                      </span>
                </div>
                </div>
              </div>

                {/* See Seller Profile Button */}
              <button 
                  onClick={() => navigate(`/seller/${product.seller.name.toLowerCase().replace(/\s+/g, '-')}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors hover:opacity-80 flex-shrink-0 ml-auto"
                  style={{ backgroundColor: '#F4F4F4', color: '#6A6A6A', fontSize: '12px', fontWeight: 500, marginTop: '12px' }}
              >
                  <span>See seller profile</span>
                  <img src={spIcon} alt="Arrow" className="w-4 h-4" />
              </button>
              </div>

              {/* Warning Badge for Inactive Listings */}
              {isOwnerView && ownerListing?.status === 'inactive' && (
                <div
                  className="flex items-start gap-3 p-2.5 mt-2"
                  style={{
                    backgroundColor: '#FFFAFA',
                    border: '1px solid #FFE9E9',
                    borderRadius: '14px'
                  }}
                >
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 rounded-full flex items-center justify-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      border: '2px solid #FFFFFF',
                      backgroundColor: '#FFFAFA'
                    }}
                  >
                    <img
                      src={renewIcon}
                      alt="Warning"
                      className="w-6 h-6"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {/* Main Message */}
                    <p
                      className="font-medium mb-0.5"
                      style={{
                        color: '#FF6E6E',
                        fontSize: '14px',
                        fontFamily: 'Bricolage Grotesque, sans-serif'
                      }}
                    >
                      Your listing has been removed from our marketplace.
                    </p>

                    {/* Description */}
                    <p
                      className="text-xs"
                      style={{
                        color: '#939393',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      The time for your product to appear on our marketplace has expired. You can{' '}
                      <button
                        onClick={() => {
                          // Handle repost functionality
                          console.log('Repost listing');
                        }}
                        className="underline"
                        style={{ color: '#6A6A6A' }}
                      >
                        repost it
                      </button>
                      {' '}or{' '}
                      <button
                        onClick={() => {
                          // Handle remove functionality
                          console.log('Remove listing');
                        }}
                        className="underline"
                        style={{ color: '#6A6A6A' }}
                      >
                        remove it.
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Product Info */}
      <div className="lg:hidden -mt-10 pb-4 relative z-10" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="bg-white rounded-t-3xl p-5 mx-0 pt-6" style={{ boxShadow: 'none' }}>
          {/* Gray Pill-Shaped Line at Top Center */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full" style={{ backgroundColor: '#E1E1E1' }}></div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-normal capitalize" style={{ fontSize: '16px', color: '#939393' }}>
                poivre blanc
              </p>
              <div className="mt-1" style={{ fontSize: '26px', color: '#212121', fontWeight: 600, fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                USD {product.price}
              </div>
            </div>
            <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleSave}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#F4F4F4' }}
              >
                <BookmarkIcon saved={isSaved} />
                  </button>
                  <button 
                onClick={() => setShowShareModal(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#F4F4F4' }}
              >
                <img
                  src={shareIcon}
                  alt="Share"
                  className="w-4 h-4"
                  style={{ filter: 'brightness(0) saturate(100%) invert(74%) sepia(3%) saturate(524%) hue-rotate(182deg) brightness(90%) contrast(90%)' }}
                />
                  </button>
                </div>
              </div>

          <div className="flex items-center justify-between text-xs mt-4">
            <div className="flex items-center gap-1.5" style={{ color: '#939393' }}>
              <img
                src={locIcon}
                alt="Location"
                className="w-3 h-3"
                style={{ filter: 'brightness(0) saturate(100%) invert(73%) sepia(52%) saturate(1685%) hue-rotate(352deg) brightness(103%) contrast(95%)' }}
              />
              <span className="font-light">{product.location}</span>
            </div>
            <div className="flex items-center gap-1" style={{ color: '#B0B0B0' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 7v5l3 1.5M12 21a9 9 0 100-18 9 9 0 000 18z"
                  stroke="#B0B0B0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-light">2 days ago</span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-5 mb-4 text-xs">
            {/* Country Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border" style={{ borderColor: '#E1E1E1' }}>
              <img
                src="https://flagcdn.com/w20/cm.png"
                alt="Cameroon flag"
                className="w-3.5 h-3.5 rounded-full object-cover"
              />
              <span className="font-light" style={{ color: '#939393' }}>Cameroun</span>
            </div>
            
            {/* Category Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border" style={{ borderColor: '#E1E1E1' }}>
              <img src={pepperIcon} alt="Pepper" className="w-3 h-3" />
              <span className="font-light" style={{ color: '#939393' }}>Spices</span>
            </div>

            {/* Availability Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border" style={{ borderColor: '#E1E1E1' }}>
              <img src={availableIcon} alt="Available" className="w-3 h-3" />
              <span className="font-light" style={{ color: '#939393' }}>Available : 1</span>
            </div>
          </div>

          {/* Description */}
          <p className="font-light leading-relaxed text-sm" style={{ color: '#B0B0B0', marginBottom: '2px' }}>
            Premium white pepper sourced from the fertile soils of Africa. Known for its mild aromatic heat and rich flavour, it adds an authentic touch of home to your dishes, perfect for the diaspora seeking a taste of tradition.
          </p>

          {/* Read More Link */}
                <button 
                  onClick={toggleAdditionalInfo}
            className="font-medium mb-6 hover:underline text-sm"
            style={{ color: '#64B5F6', textDecoration: 'none' }}
                >
            Read more
                </button>

                {/* Messages Received Component - Mobile - Only show for active listings */}
                {isOwnerView && ownerListing?.status === 'active' && ownerListing?.messages && ownerListing.messages > 0 && (
                  <div ref={messagesDropdownRef} className="relative">
                    <div 
                      className="flex items-center gap-2 px-3 rounded-full cursor-pointer hover:opacity-90 transition-opacity mt-2"
                      style={{ 
                        backgroundColor: showMessagesDropdown ? '#F0F8FE' : '#F8FCFF', 
                        border: `1px solid #F0F8FE`,
                        width: 'fit-content',
                        paddingTop: '1px',
                        paddingBottom: '1px'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMessagesDropdown(!showMessagesDropdown);
                      }}
                    >
                      {/* Avatars */}
                      <div className="flex items-center" style={{ marginRight: '6px' }}>
                        {[1, 2, 3, 4].slice(0, Math.min(ownerListing.messages, 4)).map((_, index) => {
                          const avatarColors = ['#E3F2FD', '#F3E5F5', '#FFF3E0', '#E8F5E9'];
                          return (
                            <div
                              key={index}
                              className="rounded-full overflow-hidden border-2 border-white flex items-center justify-center"
                              style={{
                                width: '24px',
                                height: '24px',
                                marginLeft: index > 0 ? '-6px' : '0',
                                zIndex: 4 - index,
                                backgroundColor: avatarColors[index % avatarColors.length]
                              }}
                            >
                              <img
                                src={sellerAvatar}
                                alt={`Buyer ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Text */}
                      <span 
                        className="text-xs font-normal"
                        style={{ 
                          color: showMessagesDropdown ? '#64B5F6' : '#939393', 
                          fontFamily: 'Poppins, sans-serif' 
                        }}
                      >
                        {ownerListing.messages} Message{ownerListing.messages !== 1 ? 's' : ''} received for this product
                      </span>
                      
                      {/* Arrow Icon */}
                      <img
                        src={backArrowIcon}
                        alt="Arrow"
                        className="flex-shrink-0"
                        style={{ 
                          width: '14px', 
                          height: '14px', 
                          marginLeft: '6px',
                          transform: 'scaleX(-1)',
                          filter: showMessagesDropdown ? 'brightness(0) saturate(100%) invert(60%) sepia(89%) saturate(1726%) hue-rotate(183deg) brightness(97%) contrast(92%)' : 'none'
                        }}
                      />
                    </div>

                    {/* Dropdown - Mobile */}
                    {showMessagesDropdown && recentMessages.length > 0 && (
                      <div
                        className="absolute top-full left-0 mt-2 z-50"
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '20px',
                          boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                          padding: '12px',
                          minWidth: '300px',
                          maxWidth: '90vw'
                        }}
                      >
                         {recentMessages.map((message, index) => {
                           const avatarColors = ['#E3F2FD', '#F3E5F5', '#FFF3E0', '#E8F5E9'];
                           return (
                             <div
                               key={message.id}
                               className="cursor-pointer mb-2 last:mb-0 hover:opacity-90 transition-opacity"
                               style={{
                                 border: '1px solid #E9E9E9',
                                 borderRadius: '14px',
                                 padding: '12px'
                               }}
                               onClick={() => {
                                 navigate(`/messages?productId=${ownerListing.id}&conversationId=${message.id}`);
                                 setShowMessagesDropdown(false);
                               }}
                             >
                               <div className="flex items-start gap-3">
                                 {/* Avatar */}
                                 <div
                                   className="rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                                   style={{
                                     width: '40px',
                                     height: '40px',
                                     border: '2px solid #939393',
                                     backgroundColor: avatarColors[index % avatarColors.length]
                                   }}
                                 >
                                   <img
                                     src={message.avatar}
                                     alt={message.name}
                                     className="w-full h-full object-cover"
                                   />
                                 </div>

                                 {/* Content */}
                                 <div className="flex-1 min-w-0">
                                   {/* Name and Rating */}
                                   <div className="flex items-center gap-2 mb-0.5">
                                     <span
                                       className="font-medium text-sm"
                                       style={{ color: '#212121', fontFamily: 'Poppins, sans-serif' }}
                                     >
                                       {message.name}
                                     </span>
                                     <div className="flex items-center gap-1">
                                       {[...Array(5)].map((_, i) => (
                                         <svg
                                           key={i}
                                           className="w-3 h-3"
                                           viewBox="0 0 24 24"
                                           fill={i < Math.floor(message.rating) ? '#FBBC05' : 'none'}
                                           stroke={i < Math.floor(message.rating) ? '#FBBC05' : '#E0E0E0'}
                                           strokeWidth="1"
                                         >
                                           <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                         </svg>
                                       ))}
                                       <span className="text-xs" style={{ color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
                                         {message.rating}
                                       </span>
                                     </div>
                                   </div>

                                   {/* Message State with Timestamp */}
                                   <div className="flex items-center justify-between gap-2" style={{ marginTop: '2px' }}>
                                     <div className="flex items-center gap-1 flex-1 min-w-0">
                                       {message.messageState === 'new' ? (
                                         <span style={{ color: '#64B5F6', fontSize: '11px', fontFamily: 'Poppins, sans-serif' }}>
                                           {message.messagePreview}
                                         </span>
                                       ) : message.messageState === 'you' ? (
                                         <>
                                           <span
                                             className="px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0"
                                             style={{
                                               backgroundColor: '#E3F2FD',
                                               color: '#64B5F6',
                                               fontFamily: 'Poppins, sans-serif',
                                               fontSize: '10px'
                                             }}
                                           >
                                             You
                                           </span>
                                           <span style={{ color: '#939393', fontSize: '11px', fontFamily: 'Poppins, sans-serif' }}>
                                             {message.messagePreview}
                                           </span>
                                         </>
                                       ) : (
                                         <span style={{ color: '#939393', fontSize: '11px', fontFamily: 'Poppins, sans-serif' }}>
                                           {message.messagePreview}
                                         </span>
                                       )}
                                     </div>
                                     {/* Timestamp */}
                                     <span
                                       className="text-xs flex-shrink-0"
                                       style={{ 
                                         color: '#BBBBBB', 
                                         fontFamily: 'Bricolage Grotesque, sans-serif' 
                                       }}
                                     >
                                       {message.timestamp}
                                     </span>
                                   </div>
                                 </div>
                               </div>
                             </div>
                           );
                         })}
                      </div>
                    )}
                  </div>
                )}
                
                {showAdditionalInfo && (
            <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm text-gray-600 space-y-2">
                      <div className="flex justify-between">
                <span className="font-medium text-gray-800">Origin</span>
                        <span>Kerala, India (Malabar Coast)</span>
                      </div>
                      <div className="flex justify-between">
                <span className="font-medium text-gray-800">Processing</span>
                        <span>Retting process</span>
                      </div>
                      <div className="flex justify-between">
                <span className="font-medium text-gray-800">Shelf Life</span>
                <span>2-3 years</span>
                    </div>
                  </div>
                )}

          {/* Seller Profile Section - Mobile */}
          <div className="mt-1 mb-0">
                <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-100 border overflow-hidden flex-shrink-0" style={{ borderColor: '#E0E0E0' }}>
                    <img
                      src={product.seller.avatar}
                      alt={product.seller.name}
                    className="w-full h-full object-cover"
                    />
                    </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-medium text-sm" style={{ color: '#212121' }}>
                    {product.seller.name}
                  </span>
                  {product.seller.verified ? (
                    <div className="inline-flex items-center gap-1 bg-green-50 rounded-full mt-1" style={{ padding: '2px 6px', fontSize: '10px', color: '#45C55B' }}>
                      <img src={verifyIcon} alt="Verified" className="w-3 h-3" />
                      <span>Verified Seller</span>
                  </div>
                  ) : (
                    <div className="inline-flex items-center text-gray-600 bg-gray-100 rounded-full mt-1" style={{ padding: '2px 6px', fontSize: '10px' }}>
                      <img src={unverifyIcon} alt="Unverified" className="w-3 h-3 mr-1" />
                      <span>Unverified Seller</span>
                    </div>
                  )}
                </div>
              </div>
              <button 
                onClick={() => navigate(`/seller/${product.seller.name.toLowerCase().replace(/\s+/g, '-')}`)}
                className="flex items-center gap-1 px-3 py-1 rounded-full transition-colors hover:opacity-80 flex-shrink-0"
                style={{ backgroundColor: '#F4F4F4', color: '#6A6A6A', fontSize: '11px', fontWeight: 500 }}
              >
                <span>See seller profile</span>
                <img src={spIcon} alt="Arrow" className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
                </div>
              </div>


      {/* Mobile Sticky Action Bar */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 z-50"
        style={{ boxShadow: '0 -6px 18px rgba(0, 0, 0, 0.05)' }}
      >
              <button 
                onClick={handleContactSeller}
          className="w-full text-white py-3 px-6 rounded-xl font-normal transition-colors duration-200 flex items-center justify-center space-x-2"
          style={{backgroundColor: '#F9A825', borderRadius: '12px'}}
                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}
              >
          <span>Chat with seller</span>
          <img src={basketIcon} alt="Chat" className="w-4 h-4" style={{ filter: 'brightness(0) invert(1)' }} />
              </button>
            </div>

      {/* Reviews and Ratings Section */}
      <div className="bg-white mt-1 lg:mt-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {/* Tab Navigation */}
        {product.seller.verified ? (
          <div className="border-b" style={{ borderColor: '#E5E5E5' }}>
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex">
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className="px-4 py-1 text-sm font-medium border-b-2 transition-colors"
                  style={{
                    color: activeTab === 'reviews' ? '#64B5F6' : '#BABABA',
                    borderColor: activeTab === 'reviews' ? '#64B5F6' : 'transparent',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  Reviews and Ratings
            </button>
            <button 
                  onClick={() => setActiveTab('items')}
                  className="px-4 py-1 text-sm font-medium ml-8 border-b-2 transition-colors"
                  style={{
                    color: activeTab === 'items' ? '#64B5F6' : '#BABABA',
                    borderColor: activeTab === 'items' ? '#64B5F6' : 'transparent',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  Seller Items
            </button>
          </div>
        </div>
      </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6 pb-4">
            <h2 className="text-xl lg:text-3xl font-semibold text-left lg:text-left" style={{ color: '#000000', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              Reviews and ratings
            </h2>
            </div>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 mt-4">
          
          {/* Reviews Content */}
          {(activeTab === 'reviews' || !product.seller.verified) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
            {/* LEFT COLUMN - Reviews List */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              {/* Filter Dropdown */}
              <div className="relative mb-2 lg:mb-4 pb-3" ref={filterDropdownRef}>
              <button 
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                  className="flex items-center hover:opacity-80 transition-opacity"
                  style={{ color: '#939393' }}
                >
                  {/* Filter Icon */}
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 20 20" 
                    fill="none"
                    className="mr-2"
                  >
                    <line x1="3" y1="6" x2="17" y2="6" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="10" cy="6" r="2" fill="#FFF" stroke="#6A6A6A" strokeWidth="1.5"/>
                    <line x1="3" y1="14" x2="17" y2="14" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="10" cy="14" r="2" fill="#FFF" stroke="#6A6A6A" strokeWidth="1.5"/>
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
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
                            ) : (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isSelected ? '#64B5F6' : '#212121'} strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 6v6l4 2"/>
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
                {/* Review 1 - Samine Herald */}
                <div className="pb-6">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-[22px] h-[22px] lg:w-6 lg:h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2 text-[13px] lg:text-sm">Samine Herald</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[1,2,3,4,5].map((star) => (
                              <svg key={star} className="w-3 lg:w-3.5 h-3 lg:h-3.5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs lg:text-sm font-medium" style={{ color: '#939393' }}>5.0</span>
                        </div>
                        <span className="text-[10px] lg:text-xs" style={{ color: '#939393' }}>Posted on 2 Jan 2025</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs lg:text-sm leading-relaxed mb-4" style={{ color: '#B0B0B0' }}>
                    Outstanding quality! This product exceeded all my expectations. The white pepper has an amazing aroma and rich flavor that's perfect for my cooking. The packaging was beautiful and it arrived in perfect condition ahead of schedule.
                  </p>
                  
                  {/* Helpfulness Section */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    {renderHelpfulnessControls('review1')}
          <button 
                      className="text-xs hover:underline"
                      style={{ color: '#64B5F6' }}
                      onClick={() => handleDiscussionToggle('review1')}
          >
                      {expandedDiscussions.review1 ? 'View less' : `View the discussion (${reviewDiscussionData.review1?.length || 0})`}
          </button>
                </div>
                  {expandedDiscussions.review1 && reviewDiscussionData.review1 && (
                    <div className="mt-4 space-y-3 lg:space-y-4">
                      {reviewDiscussionData.review1.map((comment) => (
                        <div key={comment.id} className="flex space-x-2 lg:space-x-3">
                          <div className="w-px self-stretch" style={{ backgroundColor: '#E1E1E1' }} />
                          <div className="flex-1 pl-3 lg:pl-4">
                            <div className="flex items-start space-x-2 lg:space-x-3">
                              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {comment.avatar ? (
                                  <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />
                                ) : (
                                  <svg className="w-3 h-3 lg:w-4 lg:h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                  </svg>
                                )}
                </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center space-x-1.5 lg:space-x-2 flex-1 min-w-0">
                                    <span className="text-xs lg:text-sm font-medium lg:font-semibold text-gray-900 truncate">{comment.author}</span>
                                    {comment.isOwner && (
                                      <span className="text-[9px] lg:text-[10px] font-medium px-1.5 lg:px-2 py-0.5 flex-shrink-0" style={{ backgroundColor: '#F0F8FE', color: '#64B5F6', borderRadius: '4px' }}>
                                        {comment.role || 'Product Owner'}
                                      </span>
                                    )}
                </div>
                                  <span className="text-[10px] lg:text-xs flex-shrink-0" style={{ color: '#939393' }}>{comment.date}</span>
                </div>
                                <p className="text-xs lg:text-sm leading-relaxed mt-1" style={{ color: '#939393' }}>{comment.text}</p>
                </div>
                </div>
                            <div className="mt-2 lg:mt-3 pl-10 lg:pl-12">
                              {renderHelpfulnessControls(comment.id, 'Was this review helpful to you?')}
              </div>
                          </div>
                        </div>
                      ))}
            </div>
          )}
        </div>
        
                {/* Review 2 - Kael Otto */}
                <div className="pb-6">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-[22px] h-[22px] lg:w-6 lg:h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2 text-[13px] lg:text-sm">Kael Otto</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[1,2,3,4,5].map((star) => (
                              <svg key={star} className="w-3 lg:w-3.5 h-3 lg:h-3.5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs lg:text-sm font-medium" style={{ color: '#939393' }}>5.0</span>
                        </div>
                        <span className="text-[10px] lg:text-xs" style={{ color: '#939393' }}>Posted on 12 Dec 2024</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs lg:text-sm leading-relaxed mb-4" style={{ color: '#B0B0B0' }}>
                    Amazing product! The quality exceeded my expectations. The white pepper has such a distinct, mild heat that enhances every dish. Fast shipping and the item was exactly as described. Highly recommend for authentic African spices!
                  </p>
                  
                  {/* Helpfulness Section */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    {renderHelpfulnessControls('review2')}
                  <button 
                      className="text-xs hover:underline"
                      style={{ color: '#64B5F6' }}
                      onClick={() => handleDiscussionToggle('review2')}
                  >
                      {expandedDiscussions.review2 ? 'View less' : `View the discussion (${reviewDiscussionData.review2?.length || 0})`}
                  </button>
                </div>
                  {expandedDiscussions.review2 && reviewDiscussionData.review2 && (
                    <div className="mt-4 space-y-3 lg:space-y-4">
                      {reviewDiscussionData.review2.map((comment) => (
                        <div key={comment.id} className="flex space-x-2 lg:space-x-3">
                          <div className="w-px self-stretch" style={{ backgroundColor: '#E1E1E1' }} />
                          <div className="flex-1 pl-3 lg:pl-4">
                            <div className="flex items-start space-x-2 lg:space-x-3">
                              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {comment.avatar ? (
                                  <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />
                                ) : (
                                  <svg className="w-3 h-3 lg:w-4 lg:h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                  </svg>
              )}
            </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center space-x-1.5 lg:space-x-2 flex-1 min-w-0">
                                    <span className="text-xs lg:text-sm font-medium lg:font-semibold text-gray-900 truncate">{comment.author}</span>
                                    {comment.isOwner && (
                                      <span className="text-[9px] lg:text-[10px] font-medium px-1.5 lg:px-2 py-0.5 flex-shrink-0" style={{ backgroundColor: '#F0F8FE', color: '#64B5F6', borderRadius: '4px' }}>
                                        {comment.role || 'Product Owner'}
                                      </span>
                                    )}
          </div>
                                  <span className="text-[10px] lg:text-xs flex-shrink-0" style={{ color: '#939393' }}>{comment.date}</span>
          </div>
                                <p className="text-xs lg:text-sm leading-relaxed mt-1" style={{ color: '#939393' }}>{comment.text}</p>
            </div>
                </div>
                            <div className="mt-2 lg:mt-3 pl-10 lg:pl-12">
                              {renderHelpfulnessControls(comment.id, 'Was this review helpful to you?')}
              </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
        </div>
        
                {/* Review 3 - Alex Johnson */}
                <div className="pb-6">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-[22px] h-[22px] lg:w-6 lg:h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
      </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2 text-[13px] lg:text-sm">Alex Johnson</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[1,2].map((star) => (
                              <svg key={star} className="w-3 lg:w-3.5 h-3 lg:h-3.5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            ))}
                            {[1,2,3].map((star) => (
                              <svg key={`empty-${star}`} className="w-3 lg:w-3.5 h-3 lg:h-3.5 text-gray-300 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs lg:text-sm font-medium" style={{ color: '#939393' }}>2.1</span>
                        </div>
                        <span className="text-[10px] lg:text-xs" style={{ color: '#939393' }}>Posted on 8 Nov 2024</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs lg:text-sm leading-relaxed mb-4" style={{ color: '#B0B0B0' }}>
                    The product was okay, but not exactly what I expected. The flavor wasn't as strong as I hoped for and the quantity seemed less than advertised. Shipping took longer than anticipated. It's decent but there are better options available.
                  </p>
                  
                  {/* Helpfulness Section */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    {renderHelpfulnessControls('review3')}
        <button
                      className="text-xs hover:underline"
                      style={{ color: '#64B5F6' }}
                      onClick={() => handleDiscussionToggle('review3')}
                    >
                      {expandedDiscussions.review3 ? 'View less' : `View the discussion (${reviewDiscussionData.review3?.length || 0})`}
        </button>
                  </div>
                  {expandedDiscussions.review3 && reviewDiscussionData.review3 && (
                    <div className="mt-4 space-y-3 lg:space-y-4">
                      {reviewDiscussionData.review3.map((comment) => (
                        <div key={comment.id} className="flex space-x-2 lg:space-x-3">
                          <div className="w-px self-stretch" style={{ backgroundColor: '#E1E1E1' }} />
                          <div className="flex-1 pl-3 lg:pl-4">
                            <div className="flex items-start space-x-2 lg:space-x-3">
                              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {comment.avatar ? (
                                  <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />
                                ) : (
                                  <svg className="w-3 h-3 lg:w-4 lg:h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center space-x-1.5 lg:space-x-2 flex-1 min-w-0">
                                    <span className="text-xs lg:text-sm font-medium lg:font-semibold text-gray-900 truncate">{comment.author}</span>
                                    {comment.isOwner && (
                                      <span className="text-[9px] lg:text-[10px] font-medium px-1.5 lg:px-2 py-0.5 flex-shrink-0" style={{ backgroundColor: '#F0F8FE', color: '#64B5F6', borderRadius: '4px' }}>
                                        {comment.role || 'Product Owner'}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] lg:text-xs flex-shrink-0" style={{ color: '#939393' }}>{comment.date}</span>
                                </div>
                                <p className="text-xs lg:text-sm leading-relaxed mt-1" style={{ color: '#939393' }}>{comment.text}</p>
                              </div>
                            </div>
                            <div className="mt-2 lg:mt-3 pl-10 lg:pl-12">
                              {renderHelpfulnessControls(comment.id, 'Was this review helpful to you?')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
            <div className="lg:col-span-1 order-1 lg:order-2 w-full">
              {/* Overall Rating Summary */}
              <div className="mb-6 text-left lg:text-center">
                <div className="flex items-center justify-between lg:justify-center space-x-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="text-4xl font-semibold text-gray-900" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>4.3</div>
                    <svg className="w-7 h-7 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  {!isReviewPosted && (
                    <div className="lg:hidden">
              <button 
                        onClick={() => setShowGiveOpinionModal(true)}
                        className="px-4 py-2 rounded-md text-xs font-medium"
                        style={{ color: '#64B5F6', backgroundColor: '#F0F8FE', borderRadius: '6px' }}
              >
                        Give feedback
              </button>
            </div>
                  )}
          </div>
                <div className="text-sm mb-4" style={{ color: '#6A6A6A' }}>Review & Rates (456)</div>
                
                {/* Rating Bars */}
                <div className="space-y-2 mb-2 lg:mb-0">
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
              
              {/* Mobile Posted Review - Below Ratings Bar */}
              {isReviewPosted && postedReview && (
                <div className="lg:hidden mt-6">
                  <div className="border rounded-3xl text-left" style={{ borderColor: '#E1E1E1' }}>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-2.5">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                          </div>

                          <div>
                            {/* Name */}
                            <h4 className="font-semibold text-gray-900 mb-1.5" style={{ fontSize: '13px' }}>You</h4>
                            
                            {/* Star Rating */}
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {[1,2,3,4,5].map((star) => (
                                  <svg 
                                    key={star}
                                    className="w-3 h-3" 
                                    fill={star <= postedReview.rating ? '#F9A825' : '#E9E9E9'}
                                    stroke="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs font-medium" style={{ color: '#939393' }}>{postedReview.rating}.0</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Edit Button and Date */}
                        <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                          <button 
                            onClick={() => {
                              setShowGiveOpinionModal(true);
                              setIsReviewPosted(false);
                            }}
                            className="flex items-center space-x-1.5 px-2.5 py-1 border rounded-lg transition-colors hover:bg-gray-50"
                            style={{ borderColor: '#D9D9D9' }}
                          >
                            <img src={pencilIcon} alt="Edit" className="w-3 h-3" />
                            <span className="text-xs" style={{ color: '#6A6A6A' }}>Edit</span>
                          </button>
                          <span className="text-[10px]" style={{ color: '#939393' }}>{postedReview.date}</span>
                        </div>
                      </div>
                      
                      {/* Review Text */}
                      <p className="text-xs leading-relaxed mb-0" style={{ color: '#B0B0B0', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {postedReview.text}
                  </p>
                </div>
                  </div>
                </div>
              )}

              {/* Give Your Opinion Section */}
              <div className="pt-24 text-center hidden lg:block">
                {!isReviewPosted ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Give your opinion</h3>
                    <p className="text-xs mb-6" style={{ color: '#B0B0B0' }}>Share your opinion about this product and help others learn a bit more about it.</p>
                    
                    {/* Star Rating Input */}
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
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path 
                              d="M12 2.5l2.5 6.5h7l-5.5 4.5 2 7-6-4.5-6 4.5 2-7-5.5-4.5h7z"
                              stroke={userRating >= star ? '#FBBC05' : '#E9E9E9'}
                            />
                    </svg>
                  </button>
                      ))}
                    </div>
                    
                    {/* Give a note text/rating */}
                    <div className="text-center mb-6" style={{ 
                      color: userRating > 0 ? '#64B5F6' : (userReviewText.length > 0 ? '#64B5F6' : '#D9D9D9'), 
                      fontSize: '10px' 
                    }}>
                      {userRating > 0 ? `${userRating}.0` : 'give a note'}
                    </div>
                    
                    {/* Review Text Input */}
                    <div className="flex items-center space-x-3 mb-4 pl-8">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 self-start mt-2">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <style dangerouslySetInnerHTML={{__html: `
                        .custom-placeholder::placeholder {
                          color: #D9D9D9;
                          opacity: 1;
                        }
                        .custom-placeholder::-webkit-scrollbar {
                          display: none;
                        }
                        .custom-placeholder {
                          -ms-overflow-style: none;
                          scrollbar-width: none;
                        }
                      `}} />
                      <textarea
                        value={userReviewText}
                        onChange={(e) => {
                          if (e.target.value.length <= 1000) {
                            setUserReviewText(e.target.value);
                          }
                        }}
                        placeholder="What do you think of this product?"
                        className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none custom-placeholder"
                        style={{ 
                          border: 'none',
                          minHeight: '80px',
                          color: '#939393',
                          backgroundColor: 'transparent'
                        }}
                        maxLength={1000}
                      />
                    </div>
                    
                    {/* Post Review Button */}
                    <div className="pl-8 relative mt-4">
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
                          }
                    }}
                        className="w-full py-2.5 rounded-lg font-medium transition-all mt-12 relative"
                        style={{ 
                          backgroundColor: userRating > 0 ? '#FBBC05' : '#F4F4F4',
                          color: userRating > 0 ? 'white' : '#6A6A6A'
                        }}
                        disabled={userRating === 0}
                      >
                        Post the review
                        {/* Character Counter */}
                        {userReviewText.length > 0 && (
                          <div 
                            className="absolute"
                            style={{ 
                              top: '-26px', 
                              right: '0', 
                              color: '#64B5F6', 
                              fontSize: '12px' 
                            }}
                          >
                            {userReviewText.length}/1000
                          </div>
                        )}
                  </button>
                </div>
                  </>
                ) : (
                  <>
                    {/* Thank You State */}
                    <div className="mb-6 text-center">
                      <h3 className="text-2xl font-semibold" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', color: '#939393' }}>
                        Thank you for your<br/>feedback. 😊
                      </h3>
              </div>
                    
                    {/* Posted Review Card */}
                    <div className="border rounded-3xl text-left mx-auto" style={{ borderColor: '#E1E1E1', maxWidth: '500px' }}>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
          </div>

                            <div>
                              {/* Name */}
                              <h4 className="font-semibold mb-1" style={{ color: '#0E0E0E', fontSize: '14px' }}>You</h4>
                              
                              {/* Star Rating */}
                              <div className="flex items-center space-x-2">
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
                                <span className="text-xs" style={{ color: '#939393' }}>{postedReview?.rating}.0</span>
                </div>
              </div>
                </div>
                          
                          {/* Edit Button and Date */}
                          <div className="flex flex-col items-end space-y-1.5 flex-shrink-0">
                  <button 
                              onClick={() => {
                                setIsReviewPosted(false);
                                // Keep the rating and text so user can edit
                              }}
                              className="flex items-center space-x-1.5 px-2.5 py-1 border rounded-lg transition-colors hover:bg-gray-50"
                              style={{ borderColor: '#D9D9D9' }}
                  >
                              <img src={pencilIcon} alt="Edit" className="w-3 h-3" />
                              <span className="text-xs" style={{ color: '#6A6A6A' }}>Edit</span>
                  </button>
                            <span className="text-[10px] whitespace-nowrap" style={{ color: '#B0B0B0' }}>{postedReview?.date}</span>
                          </div>
                        </div>
                        
                          {/* Review Text - Spans full width below */}
                          <p className="text-sm leading-relaxed" style={{ color: '#939393', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                            {postedReview?.text}
                          </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
          </div>
          </div>
          )}
          
          {/* You May Also Like Section - Below Reviews */}
          {activeTab === 'reviews' && (
            <div className="mt-12">
              <h2 className="text-2xl font-medium text-gray-900 mb-6" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                You may also like
              </h2>
              
              {/* Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-5 md:gap-6">
                {/* Product cards 1-12 */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((productNum) => (
                  <Link key={productNum} to={`/product/${productNum}`} className="bg-white rounded-lg overflow-hidden transition-all duration-200 block group">
                    <div className="aspect-square relative overflow-hidden mb-1 sm:mb-2" style={{ borderRadius: '12px' }}>
                      <img 
                        src={[pre1, pre2, pre3, pre4, pre5, pre6][productNum % 6]} 
                        alt={`Product ${productNum}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        style={{ borderRadius: '12px' }}
                      />
                      <div className="absolute bg-white rounded-md shadow-sm" style={{ 
                        display: 'flex', 
                        padding: '2px 6px', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '4px',
                        top: '8px',
                        left: '8px'
                      }}>
                        <img 
                          src={getProductCountry(productNum).flag} 
                          alt={getProductCountry(productNum).name}
                          style={{ 
                            width: '14px',
                            height: '14px',
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                        />
                        <span className="font-medium text-gray-800" style={{ fontSize: '12px' }}>
                          {getProductCountry(productNum).abbreviation}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col" style={{ padding: '0 10px 10px 10px' }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: '3px' }}>
                        <div className="font-semibold text-gray-900" style={{ fontSize: '14px', lineHeight: '1.2' }}>
                          USD 31.7
              </div>
                        <div className="flex items-center text-green-600 bg-green-50 rounded" style={{ 
                          display: 'flex', 
                          padding: '1px 3px', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: '1px', 
                          fontSize: '8px' 
                        }}>
                          <img src={verifyIcon} alt="Verified" style={{ width: '7px', height: '7px' }} />
                          <span>Verified seller</span>
                        </div>
                      </div>
                      <h3 className="line-clamp-2 font-medium" style={{ 
                        fontSize: '12px', 
                        color: '#212121',
                        marginBottom: '3px',
                        lineHeight: '1.3'
                      }}>Product Name</h3>
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center text-gray-500 flex-1 min-w-0">
                          <img src={locationIcon} alt="Location" className="flex-shrink-0" style={{ 
                            width: '9px',
                            height: '9px',
                            marginRight: '3px'
                          }} />
                          <span className="truncate font-normal" style={{ fontSize: '9px' }}>London, United Kingdom</span>
                        </div>
                        <div className="flex-shrink-0" style={{ marginLeft: '4px' }}>
                  <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                      const newSet = new Set(wishlistProducts);
                              if (newSet.has(`reviews-product-${productNum}`)) {
                                newSet.delete(`reviews-product-${productNum}`);
                      } else {
                                newSet.add(`reviews-product-${productNum}`);
                      }
                      setWishlistProducts(newSet);
                    }}
                            className="transition-colors touch-manipulation"
                            style={{ 
                              width: window.innerWidth < 1024 ? '18px' : '20px', 
                              height: window.innerWidth < 1024 ? '18px' : '20px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              padding: '2px'
                            }}
                  >
                            <img src={bookmarkIcon} alt="Bookmark" style={{
                              width: window.innerWidth < 1024 ? '16px' : '20px',
                              height: window.innerWidth < 1024 ? '16px' : '20px',
                              filter: wishlistProducts.has(`reviews-product-${productNum}`) ? 'none' : 'grayscale(100%) opacity(0.6)'
                            }} />
                  </button>
                </div>
              </div>
            </div>
                  </Link>
                ))}
          </div>
        </div>
          )}

          {/* Seller Items Content */}
          {product.seller.verified && activeTab === 'items' && (
            <>
              {/* Section 1: Seller Items */}
              <div className="mb-12">
                {/* Title with Navigation Arrows */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-medium text-gray-900" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                    {product.seller.name} items
                  </h2>
                  <div className="hidden lg:flex items-center gap-3">
            <button 
                      className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                      aria-label="Previous"
            >
                      <img src={grayArrowIcon} alt="Previous" className="w-full h-full" />
            </button>
            <button 
                      className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                      style={{ filter: 'brightness(0) saturate(100%) invert(30%)' }}
                      aria-label="Next"
            >
                      <img src={grayArrowIcon} alt="Next" className="w-full h-full rotate-180" />
            </button>
            </div>
                </div>

        {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-5 md:gap-6">
                  {/* Product 1 */}
                  <Link to={`/product/1`} className="bg-white rounded-lg overflow-hidden transition-all duration-200 block group">
                    <div className="aspect-square relative overflow-hidden mb-1 sm:mb-2" style={{ borderRadius: '12px' }}>
                      <img 
                        src={pre1} 
                        alt="White Pepper"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        style={{ borderRadius: '12px' }}
                      />
                      <div className="absolute bg-white rounded-md shadow-sm" style={{ 
                        display: 'flex', 
                        padding: '2px 6px', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '4px',
                        top: '8px',
                        left: '8px'
                      }}>
                        <img 
                          src={getProductCountry(1).flag} 
                          alt={getProductCountry(1).name}
                          style={{ 
                            width: '14px',
                            height: '14px',
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                        />
                        <span className="font-medium text-gray-800" style={{ fontSize: '12px' }}>
                          {getProductCountry(1).abbreviation}
                        </span>
              </div>
                </div>
                    <div className="flex flex-col" style={{ padding: '0 10px 10px 10px' }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: '3px' }}>
                        <div className="font-semibold text-gray-900" style={{ fontSize: '14px', lineHeight: '1.2' }}>
                          USD 31.7
              </div>
                        <div className="flex items-center text-green-600 bg-green-50 rounded" style={{ 
                          display: 'flex', 
                          padding: '1px 3px', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: '1px', 
                          fontSize: '8px' 
                        }}>
                          <img src={verifyIcon} alt="Verified" style={{ width: '7px', height: '7px' }} />
                          <span>Verified seller</span>
                </div>
                      </div>
                      <h3 className="line-clamp-2 font-medium" style={{ 
                        fontSize: '12px', 
                        color: '#212121',
                        marginBottom: '3px',
                        lineHeight: '1.3'
                      }}>White Pepper</h3>
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center text-gray-500 flex-1 min-w-0">
                          <img src={locationIcon} alt="Location" className="flex-shrink-0" style={{ 
                            width: '9px',
                            height: '9px',
                            marginRight: '3px'
                          }} />
                          <span className="truncate font-normal" style={{ fontSize: '9px' }}>London, United Kingdom</span>
                        </div>
                        <div className="flex-shrink-0" style={{ marginLeft: '4px' }}>
                  <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const newSet = new Set(wishlistProducts);
                              if (newSet.has('product-1')) {
                                newSet.delete('product-1');
                              } else {
                                newSet.add('product-1');
                              }
                              setWishlistProducts(newSet);
                            }}
                            className="transition-colors touch-manipulation"
                            style={{ 
                              width: window.innerWidth < 1024 ? '18px' : '20px', 
                              height: window.innerWidth < 1024 ? '18px' : '20px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              padding: '2px'
                            }}
                          >
                            <img src={bookmarkIcon} alt="Bookmark" style={{
                              width: window.innerWidth < 1024 ? '16px' : '20px',
                              height: window.innerWidth < 1024 ? '16px' : '20px',
                              filter: wishlistProducts.has('product-1') ? 'none' : 'grayscale(100%) opacity(0.6)'
                            }} />
                  </button>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Product 2 */}
                  <Link to={`/product/2`} className="bg-white rounded-lg overflow-hidden transition-all duration-200 block group">
                    <div className="aspect-square relative overflow-hidden mb-1 sm:mb-2" style={{ borderRadius: '12px' }}>
                      <img 
                        src={pre2} 
                        alt="Chickpeas"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        style={{ borderRadius: '12px' }}
                      />
                      <div className="absolute bg-white rounded-md shadow-sm" style={{ 
                        display: 'flex', 
                        padding: '2px 6px', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '4px',
                        top: '8px',
                        left: '8px'
                      }}>
                        <img 
                          src={getProductCountry(2).flag} 
                          alt={getProductCountry(2).name}
                          style={{ 
                            width: '14px',
                            height: '14px',
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                        />
                        <span className="font-medium text-gray-800" style={{ fontSize: '12px' }}>
                          {getProductCountry(2).abbreviation}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col" style={{ padding: '0 10px 10px 10px' }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: '3px' }}>
                        <div className="font-semibold text-gray-900" style={{ fontSize: '14px', lineHeight: '1.2' }}>
                          USD 31.7
                        </div>
                        <div className="flex items-center text-green-600 bg-green-50 rounded" style={{ 
                          display: 'flex', 
                          padding: '1px 3px', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: '1px', 
                          fontSize: '8px' 
                        }}>
                          <img src={verifyIcon} alt="Verified" style={{ width: '7px', height: '7px' }} />
                          <span>Verified seller</span>
                        </div>
                      </div>
                      <h3 className="line-clamp-2 font-medium" style={{ 
                        fontSize: '12px', 
                        color: '#212121',
                        marginBottom: '3px',
                        lineHeight: '1.3'
                      }}>Chickpeas</h3>
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center text-gray-500 flex-1 min-w-0">
                          <img src={locationIcon} alt="Location" className="flex-shrink-0" style={{ 
                            width: '9px',
                            height: '9px',
                            marginRight: '3px'
                          }} />
                          <span className="truncate font-normal" style={{ fontSize: '9px' }}>London, United Kingdom</span>
                        </div>
                        <div className="flex-shrink-0" style={{ marginLeft: '4px' }}>
                  <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                      const newSet = new Set(wishlistProducts);
                              if (newSet.has('product-2')) {
                                newSet.delete('product-2');
                      } else {
                                newSet.add('product-2');
                      }
                      setWishlistProducts(newSet);
                    }}
                            className="transition-colors touch-manipulation"
                            style={{ 
                              width: window.innerWidth < 1024 ? '18px' : '20px', 
                              height: window.innerWidth < 1024 ? '18px' : '20px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              padding: '2px'
                            }}
                          >
                            <img src={bookmarkIcon} alt="Bookmark" style={{
                              width: window.innerWidth < 1024 ? '16px' : '20px',
                              height: window.innerWidth < 1024 ? '16px' : '20px',
                              filter: wishlistProducts.has('product-2') ? 'none' : 'grayscale(100%) opacity(0.6)'
                            }} />
                  </button>
                </div>
              </div>
            </div>
                  </Link>

                  {/* Product 3 */}
                  <Link to={`/product/3`} className="bg-white rounded-lg overflow-hidden transition-all duration-200 block group">
                    <div className="aspect-square relative overflow-hidden mb-1 sm:mb-2" style={{ borderRadius: '12px' }}>
                      <img 
                        src={pre3} 
                        alt="Cherry Tomatoes"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        style={{ borderRadius: '12px' }}
                      />
                      <div className="absolute bg-white rounded-md shadow-sm" style={{ 
                        display: 'flex', 
                        padding: '2px 6px', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '4px',
                        top: '8px',
                        left: '8px'
                      }}>
                        <img 
                          src={getProductCountry(3).flag} 
                          alt={getProductCountry(3).name}
                          style={{ 
                            width: '14px',
                            height: '14px',
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                        />
                        <span className="font-medium text-gray-800" style={{ fontSize: '12px' }}>
                          {getProductCountry(3).abbreviation}
                        </span>
            </div>
                </div>
                    <div className="flex flex-col" style={{ padding: '0 10px 10px 10px' }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: '3px' }}>
                        <div className="font-semibold text-gray-900" style={{ fontSize: '14px', lineHeight: '1.2' }}>
                          USD 31.7
              </div>
                        <div className="flex items-center text-green-600 bg-green-50 rounded" style={{ 
                          display: 'flex', 
                          padding: '1px 3px', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: '1px', 
                          fontSize: '8px' 
                        }}>
                          <img src={verifyIcon} alt="Verified" style={{ width: '7px', height: '7px' }} />
                          <span>Verified seller</span>
                </div>
                      </div>
                      <h3 className="line-clamp-2 font-medium" style={{ 
                        fontSize: '12px', 
                        color: '#212121',
                        marginBottom: '3px',
                        lineHeight: '1.3'
                      }}>Cherry Tomatoes</h3>
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center text-gray-500 flex-1 min-w-0">
                          <img src={locationIcon} alt="Location" className="flex-shrink-0" style={{ 
                            width: '9px',
                            height: '9px',
                            marginRight: '3px'
                          }} />
                          <span className="truncate font-normal" style={{ fontSize: '9px' }}>London, United Kingdom</span>
                        </div>
                        <div className="flex-shrink-0" style={{ marginLeft: '4px' }}>
                  <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const newSet = new Set(wishlistProducts);
                              if (newSet.has('product-3')) {
                                newSet.delete('product-3');
                              } else {
                                newSet.add('product-3');
                              }
                              setWishlistProducts(newSet);
                            }}
                            className="transition-colors touch-manipulation"
                            style={{ 
                              width: window.innerWidth < 1024 ? '18px' : '20px', 
                              height: window.innerWidth < 1024 ? '18px' : '20px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              padding: '2px'
                            }}
                          >
                            <img src={bookmarkIcon} alt="Bookmark" style={{
                              width: window.innerWidth < 1024 ? '16px' : '20px',
                              height: window.innerWidth < 1024 ? '16px' : '20px',
                              filter: wishlistProducts.has('product-3') ? 'none' : 'grayscale(100%) opacity(0.6)'
                            }} />
                  </button>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Product 4 */}
                  <Link to={`/product/4`} className="bg-white rounded-lg overflow-hidden transition-all duration-200 block group">
                    <div className="aspect-square relative overflow-hidden mb-1 sm:mb-2" style={{ borderRadius: '12px' }}>
                      <img 
                        src={pre4} 
                        alt="Dried Shrimp"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        style={{ borderRadius: '12px' }}
                      />
                      <div className="absolute bg-white rounded-md shadow-sm" style={{ 
                        display: 'flex', 
                        padding: '2px 6px', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '4px',
                        top: '8px',
                        left: '8px'
                      }}>
                        <img 
                          src={getProductCountry(4).flag} 
                          alt={getProductCountry(4).name}
                          style={{ 
                            width: '14px',
                            height: '14px',
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                        />
                        <span className="font-medium text-gray-800" style={{ fontSize: '12px' }}>
                          {getProductCountry(4).abbreviation}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col" style={{ padding: '0 10px 10px 10px' }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: '3px' }}>
                        <div className="font-semibold text-gray-900" style={{ fontSize: '14px', lineHeight: '1.2' }}>
                          USD 31.7
                        </div>
                        <div className="flex items-center text-green-600 bg-green-50 rounded" style={{ 
                          display: 'flex', 
                          padding: '1px 3px', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: '1px', 
                          fontSize: '8px' 
                        }}>
                          <img src={verifyIcon} alt="Verified" style={{ width: '7px', height: '7px' }} />
                          <span>Verified seller</span>
                        </div>
                      </div>
                      <h3 className="line-clamp-2 font-medium" style={{ 
                        fontSize: '12px', 
                        color: '#212121',
                        marginBottom: '3px',
                        lineHeight: '1.3'
                      }}>Dried Shrimp</h3>
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center text-gray-500 flex-1 min-w-0">
                          <img src={locationIcon} alt="Location" className="flex-shrink-0" style={{ 
                            width: '9px',
                            height: '9px',
                            marginRight: '3px'
                          }} />
                          <span className="truncate font-normal" style={{ fontSize: '9px' }}>London, United Kingdom</span>
                        </div>
                        <div className="flex-shrink-0" style={{ marginLeft: '4px' }}>
                  <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                      const newSet = new Set(wishlistProducts);
                              if (newSet.has('product-4')) {
                                newSet.delete('product-4');
                      } else {
                                newSet.add('product-4');
                      }
                      setWishlistProducts(newSet);
                    }}
                            className="transition-colors touch-manipulation"
                            style={{ 
                              width: window.innerWidth < 1024 ? '18px' : '20px', 
                              height: window.innerWidth < 1024 ? '18px' : '20px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              padding: '2px'
                            }}
                  >
                            <img src={bookmarkIcon} alt="Bookmark" style={{
                              width: window.innerWidth < 1024 ? '16px' : '20px',
                              height: window.innerWidth < 1024 ? '16px' : '20px',
                              filter: wishlistProducts.has('product-4') ? 'none' : 'grayscale(100%) opacity(0.6)'
                            }} />
                  </button>
                </div>
              </div>
            </div>
                  </Link>

                  {/* Product 5 */}
                  <Link to={`/product/5`} className="bg-white rounded-lg overflow-hidden transition-all duration-200 block group">
                    <div className="aspect-square relative overflow-hidden mb-1 sm:mb-2" style={{ borderRadius: '12px' }}>
                      <img 
                        src={pre5} 
                        alt="Green Vegetables"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        style={{ borderRadius: '12px' }}
                      />
                      <div className="absolute bg-white rounded-md shadow-sm" style={{ 
                        display: 'flex', 
                        padding: '2px 6px', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '4px',
                        top: '8px',
                        left: '8px'
                      }}>
                        <img 
                          src={getProductCountry(5).flag} 
                          alt={getProductCountry(5).name}
                          style={{ 
                            width: '14px',
                            height: '14px',
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                        />
                        <span className="font-medium text-gray-800" style={{ fontSize: '12px' }}>
                          {getProductCountry(5).abbreviation}
                        </span>
          </div>
        </div>
                    <div className="flex flex-col" style={{ padding: '0 10px 10px 10px' }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: '3px' }}>
                        <div className="font-semibold text-gray-900" style={{ fontSize: '14px', lineHeight: '1.2' }}>
                          USD 31.7
      </div>
                        <div className="flex items-center text-green-600 bg-green-50 rounded" style={{ 
                          display: 'flex', 
                          padding: '1px 3px', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: '1px', 
                          fontSize: '8px' 
                        }}>
                          <img src={verifyIcon} alt="Verified" style={{ width: '7px', height: '7px' }} />
                          <span>Verified seller</span>
                </div>
                      </div>
                      <h3 className="line-clamp-2 font-medium" style={{ 
                        fontSize: '12px', 
                        color: '#212121',
                        marginBottom: '3px',
                        lineHeight: '1.3'
                      }}>Green Vegetables</h3>
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center text-gray-500 flex-1 min-w-0">
                          <img src={locationIcon} alt="Location" className="flex-shrink-0" style={{ 
                            width: '9px',
                            height: '9px',
                            marginRight: '3px'
                          }} />
                          <span className="truncate font-normal" style={{ fontSize: '9px' }}>London, United Kingdom</span>
                        </div>
                        <div className="flex-shrink-0" style={{ marginLeft: '4px' }}>
            <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const newSet = new Set(wishlistProducts);
                              if (newSet.has('product-5')) {
                                newSet.delete('product-5');
                              } else {
                                newSet.add('product-5');
                              }
                              setWishlistProducts(newSet);
                            }}
                            className="transition-colors touch-manipulation"
                            style={{ 
                              width: window.innerWidth < 1024 ? '18px' : '20px', 
                              height: window.innerWidth < 1024 ? '18px' : '20px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              padding: '2px'
                            }}
                          >
                            <img src={bookmarkIcon} alt="Bookmark" style={{
                              width: window.innerWidth < 1024 ? '16px' : '20px',
                              height: window.innerWidth < 1024 ? '16px' : '20px',
                              filter: wishlistProducts.has('product-5') ? 'none' : 'grayscale(100%) opacity(0.6)'
                            }} />
            </button>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Product 6 */}
                  <Link to={`/product/6`} className="bg-white rounded-lg overflow-hidden transition-all duration-200 block group">
                    <div className="aspect-square relative overflow-hidden mb-1 sm:mb-2" style={{ borderRadius: '12px' }}>
                      <img 
                        src={pre6} 
                        alt="Yam and Yam Flour"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        style={{ borderRadius: '12px' }}
                      />
                      <div className="absolute bg-white rounded-md shadow-sm" style={{ 
                        display: 'flex', 
                        padding: '2px 6px', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '4px',
                        top: '8px',
                        left: '8px'
                      }}>
                        <img 
                          src={getProductCountry(6).flag} 
                          alt={getProductCountry(6).name}
                          style={{ 
                            width: '14px',
                            height: '14px',
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                        />
                        <span className="font-medium text-gray-800" style={{ fontSize: '12px' }}>
                          {getProductCountry(6).abbreviation}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col" style={{ padding: '0 10px 10px 10px' }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: '3px' }}>
                        <div className="font-semibold text-gray-900" style={{ fontSize: '14px', lineHeight: '1.2' }}>
                          USD 31.7
                        </div>
                        <div className="flex items-center text-green-600 bg-green-50 rounded" style={{ 
                          display: 'flex', 
                          padding: '1px 3px', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: '1px', 
                          fontSize: '8px' 
                        }}>
                          <img src={verifyIcon} alt="Verified" style={{ width: '7px', height: '7px' }} />
                          <span>Verified seller</span>
                        </div>
                      </div>
                      <h3 className="line-clamp-2 font-medium" style={{ 
                        fontSize: '12px', 
                        color: '#212121',
                        marginBottom: '3px',
                        lineHeight: '1.3'
                      }}>Yam and Yam Flour</h3>
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center text-gray-500 flex-1 min-w-0">
                          <img src={locationIcon} alt="Location" className="flex-shrink-0" style={{ 
                            width: '9px',
                            height: '9px',
                            marginRight: '3px'
                          }} />
                          <span className="truncate font-normal" style={{ fontSize: '9px' }}>London, United Kingdom</span>
                        </div>
                        <div className="flex-shrink-0" style={{ marginLeft: '4px' }}>
            <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                      const newSet = new Set(wishlistProducts);
                              if (newSet.has('product-6')) {
                                newSet.delete('product-6');
                      } else {
                                newSet.add('product-6');
                      }
                      setWishlistProducts(newSet);
                    }}
                            className="transition-colors touch-manipulation"
                            style={{ 
                              width: window.innerWidth < 1024 ? '18px' : '20px', 
                              height: window.innerWidth < 1024 ? '18px' : '20px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              padding: '2px'
                            }}
                  >
                            <img src={bookmarkIcon} alt="Bookmark" style={{
                              width: window.innerWidth < 1024 ? '16px' : '20px',
                              height: window.innerWidth < 1024 ? '16px' : '20px',
                              filter: wishlistProducts.has('product-6') ? 'none' : 'grayscale(100%) opacity(0.6)'
                            }} />
            </button>
                </div>
              </div>
                    </div>
                  </Link>
          </div>
        </div>

              {/* Section 2: You May Also Like */}
              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-6" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                  You may also like
                </h2>

        {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-5 md:gap-6">
                  {/* Recommended Product 1 */}
                  <Link to={`/product/7`} className="bg-white rounded-lg overflow-hidden transition-all duration-200 block group">
                    <div className="aspect-square relative overflow-hidden mb-1 sm:mb-2" style={{ borderRadius: '12px' }}>
                      <img 
                        src={pre1} 
                        alt="White Pepper"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        style={{ borderRadius: '12px' }}
                      />
                      <div className="absolute bg-white rounded-md shadow-sm" style={{ 
                        display: 'flex', 
                        padding: '2px 6px', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '4px',
                        top: '8px',
                        left: '8px'
                      }}>
                        <img 
                          src={getProductCountry(1).flag} 
                          alt={getProductCountry(1).name}
                          style={{ 
                            width: '14px',
                            height: '14px',
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                        />
                        <span className="font-medium text-gray-800" style={{ fontSize: '12px' }}>
                          {getProductCountry(1).abbreviation}
                        </span>
            </div>
                </div>
                    <div className="flex flex-col" style={{ padding: '0 10px 10px 10px' }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: '3px' }}>
                        <div className="font-semibold text-gray-900" style={{ fontSize: '14px', lineHeight: '1.2' }}>
                          USD 31.7
              </div>
                        <div className="flex items-center text-green-600 bg-green-50 rounded" style={{ 
                          display: 'flex', 
                          padding: '1px 3px', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: '1px', 
                          fontSize: '8px' 
                        }}>
                          <img src={verifyIcon} alt="Verified" style={{ width: '7px', height: '7px' }} />
                          <span>Verified seller</span>
                </div>
                      </div>
                      <h3 className="line-clamp-2 font-medium" style={{ 
                        fontSize: '12px', 
                        color: '#212121',
                        marginBottom: '3px',
                        lineHeight: '1.3'
                      }}>White Pepper</h3>
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center text-gray-500 flex-1 min-w-0">
                          <img src={locationIcon} alt="Location" className="flex-shrink-0" style={{ 
                            width: '9px',
                            height: '9px',
                            marginRight: '3px'
                          }} />
                          <span className="truncate font-normal" style={{ fontSize: '9px' }}>London, United Kingdom</span>
                        </div>
                        <div className="flex-shrink-0" style={{ marginLeft: '4px' }}>
                  <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                      const newSet = new Set(wishlistProducts);
                              if (newSet.has('recommended-1')) {
                                newSet.delete('recommended-1');
                      } else {
                                newSet.add('recommended-1');
                      }
                      setWishlistProducts(newSet);
                    }}
                            className="transition-colors touch-manipulation"
                            style={{ 
                              width: window.innerWidth < 1024 ? '18px' : '20px', 
                              height: window.innerWidth < 1024 ? '18px' : '20px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              padding: '2px'
                            }}
                          >
                            <img src={bookmarkIcon} alt="Bookmark" style={{
                              width: window.innerWidth < 1024 ? '16px' : '20px',
                              height: window.innerWidth < 1024 ? '16px' : '20px',
                              filter: wishlistProducts.has('recommended-1') ? 'none' : 'grayscale(100%) opacity(0.6)'
                            }} />
                  </button>
                </div>
              </div>
            </div>
                  </Link>

                  {/* Recommended Products 2-12 - Similar structure */}
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <Link key={num} to={`/product/${num + 7}`} className="bg-white rounded-lg overflow-hidden transition-all duration-200 block group">
                      <div className="aspect-square relative overflow-hidden mb-1 sm:mb-2" style={{ borderRadius: '12px' }}>
                        <img 
                          src={[pre2, pre3, pre4, pre5, pre6, pre1, pre2, pre3, pre4, pre5, pre6][(num - 2) % 11]} 
                          alt={`Product ${num}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          style={{ borderRadius: '12px' }}
                        />
                        <div className="absolute bg-white rounded-md shadow-sm" style={{ 
                          display: 'flex', 
                          padding: '2px 6px', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: '4px',
                          top: '8px',
                          left: '8px'
                        }}>
                          <img 
                            src={getProductCountry(num).flag} 
                            alt={getProductCountry(num).name}
                            style={{ 
                              width: '14px',
                              height: '14px',
                              objectFit: 'cover',
                              borderRadius: '50%'
                            }}
                          />
                          <span className="font-medium text-gray-800" style={{ fontSize: '12px' }}>
                            {getProductCountry(num).abbreviation}
                          </span>
            </div>
                </div>
                      <div className="flex flex-col" style={{ padding: '0 10px 10px 10px' }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: '3px' }}>
                        <div className="font-semibold text-gray-900" style={{ fontSize: '14px', lineHeight: '1.2' }}>
                            USD 31.7
              </div>
                        <div className="flex items-center text-green-600 bg-green-50 rounded" style={{ 
                          display: 'flex', 
                          padding: '1px 3px', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: '1px', 
                          fontSize: '8px' 
                        }}>
                          <img src={verifyIcon} alt="Verified" style={{ width: '7px', height: '7px' }} />
                            <span>Verified seller</span>
                </div>
                        </div>
                        <h3 className="line-clamp-2 font-medium" style={{ 
                          fontSize: '12px', 
                          color: '#212121',
                          marginBottom: '3px',
                          lineHeight: '1.3'
                        }}>Product Name</h3>
                        <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-500 flex-1 min-w-0">
                          <img src={locationIcon} alt="Location" className="flex-shrink-0" style={{ 
                            width: '9px',
                            height: '9px',
                            marginRight: '3px'
                          }} />
                          <span className="truncate font-normal" style={{ fontSize: '9px' }}>London, United Kingdom</span>
                        </div>
                          <div style={{ marginLeft: '4px' }}>
                  <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                      const newSet = new Set(wishlistProducts);
                                if (newSet.has(`recommended-${num}`)) {
                                  newSet.delete(`recommended-${num}`);
                      } else {
                                  newSet.add(`recommended-${num}`);
                      }
                      setWishlistProducts(newSet);
                    }}
                              className="transition-colors touch-manipulation"
                              style={{ 
                                width: window.innerWidth < 1024 ? '18px' : '20px', 
                                height: window.innerWidth < 1024 ? '18px' : '20px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                padding: '2px'
                            }}
                            >
                              <img src={bookmarkIcon} alt="Bookmark" style={{
                                width: window.innerWidth < 1024 ? '16px' : '20px',
                                height: window.innerWidth < 1024 ? '16px' : '20px',
                                filter: wishlistProducts.has(`recommended-${num}`) ? 'none' : 'grayscale(100%) opacity(0.6)'
                              }} />
                  </button>
                </div>
              </div>
            </div>
                    </Link>
                  ))}
          </div>
            </div>
            </>
          )}
                </div>
              </div>

      {/* Share Modal */}
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
              className="bg-white shadow-xl relative max-w-md w-full p-5 mt-5 lg:rounded-2xl lg:px-6 lg:py-8 lg:mt-10"
              style={{ borderRadius: '30px' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - At Top */}
                  <button 
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 lg:top-4 lg:right-4 w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                  >
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

              {/* Product Picture - Half Outside Modal */}
              <div className="absolute left-1/2 -translate-x-1/2 lg:-top-10" style={{ top: '-20px' }}>
                <div className="w-14 h-14 lg:w-20 lg:h-20 bg-blue-100 rounded-full flex items-center justify-center shadow-lg border-4 border-white overflow-hidden">
                  <img
                    src={images[selectedImageIndex]}
                    alt={product.name}
                    className="w-10 h-10 lg:w-16 lg:h-16 rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Heading */}
              <h3 className="text-base lg:text-xl font-semibold text-center mb-3 mt-6 lg:mt-8" style={{ color: '#212121', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                Share this product with your loved ones
              </h3>

              {/* Description */}
              <p className="text-[11px] lg:text-xs text-center mb-4 lg:mb-6" style={{ color: '#B0B0B0' }}>
                Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!
              </p>

              {/* Copy Link Section */}
              <div className="flex items-center gap-2 mb-4 lg:mb-6">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/product/${product.id}`}
                  className="flex-1 px-3 py-2 lg:px-4 lg:py-2.5 rounded-lg text-xs lg:text-sm font-medium focus:outline-none"
                  style={{ backgroundColor: '#F4F4F4', color: '#6A6A6A', border: 'none' }}
                />
                  <button 
                    onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    }}
                  className="px-3 py-2 lg:px-4 lg:py-2.5 rounded-lg text-xs lg:text-sm font-medium text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#000000' }}
                >
                  Copy link
                  </button>
                </div>

              {/* Share To Section */}
              <div>
                <p className="text-xs lg:text-sm mb-3" style={{ color: '#6A6A6A' }}>Share to</p>
                <div className="flex items-center justify-center space-x-4 lg:space-x-6">
                  <button className="flex flex-col items-center space-y-1.5 lg:space-y-2">
                    <img src={fbIcon} alt="Facebook" className="w-8 h-8 lg:w-10 lg:h-10" />
                    <span className="text-[10px] lg:text-xs" style={{ color: '#B0B0B0' }}>Facebook</span>
                  </button>
                  <button className="flex flex-col items-center space-y-1.5 lg:space-y-2">
                    <img src={igIcon} alt="Instagram" className="w-8 h-8 lg:w-10 lg:h-10" />
                    <span className="text-[10px] lg:text-xs" style={{ color: '#B0B0B0' }}>Instagram</span>
                  </button>
                  <button className="flex flex-col items-center space-y-1.5 lg:space-y-2">
                    <img src={xIcon} alt="X" className="w-8 h-8 lg:w-10 lg:h-10" />
                    <span className="text-[10px] lg:text-xs" style={{ color: '#B0B0B0' }}>X</span>
                  </button>
                  <button className="flex flex-col items-center space-y-1.5 lg:space-y-2">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0088cc' }}>
                      <img src={tgIcon} alt="Telegram" className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
                    <span className="text-[10px] lg:text-xs" style={{ color: '#B0B0B0' }}>Telegram</span>
                  </button>
                  <button className="flex flex-col items-center space-y-1.5 lg:space-y-2">
                    <img src={zapIcon} alt="WhatsApp" className="w-8 h-8 lg:w-10 lg:h-10" />
                    <span className="text-[10px] lg:text-xs" style={{ color: '#B0B0B0' }}>Whatsapp</span>
                  </button>
            </div>
          </div>
            </div>
                </div>
        </>
      )}

      {/* Mobile Give Your Opinion Modal */}
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
              className="bg-white w-full max-w-full relative"
              style={{ borderRadius: '30px', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gray Pill-Shaped Line at Bottom */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full" style={{ backgroundColor: '#E1E1E1' }}></div>
              
              {/* Top Section - Pill Shape with X */}
              {!isReviewPosted && (
                <div className="flex items-center justify-between px-5 pt-5 pb-3 relative">
                  <button
                    onClick={() => setShowGiveOpinionModal(false)}
                    className="w-6 h-6 flex items-center justify-center absolute right-5"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#BABABA' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border mx-auto" style={{ borderColor: '#E1E1E1', backgroundColor: 'white' }}>
                    <span className="text-[10px]" style={{ color: '#B0B0B0' }}>Reviews & Ratings</span>
              </div>
                </div>
              )}
              
              {/* X Button for Feedback State */}
              {isReviewPosted && (
                <div className="flex items-center justify-end px-5 pt-5 pb-3">
                  <button
                    onClick={() => setShowGiveOpinionModal(false)}
                    className="w-6 h-6 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#BABABA' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="px-5 pb-8">
                {!isReviewPosted ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Give your opinion</h3>
                    <p className="text-xs mb-6 text-center" style={{ color: '#B0B0B0' }}>Share your opinion about this product and help others learn a bit more about it.</p>
                    
                    {/* Star Rating Input */}
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
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path 
                              d="M12 2.5l2.5 6.5h7l-5.5 4.5 2 7-6-4.5-6 4.5 2-7-5.5-4.5h7z"
                              stroke={userRating >= star ? '#FBBC05' : '#E9E9E9'}
                            />
                    </svg>
                  </button>
                      ))}
                    </div>
                    
                    {/* Give a note text/rating */}
                    <div className="text-center mb-6" style={{ 
                      color: userRating > 0 ? '#64B5F6' : (userReviewText.length > 0 ? '#64B5F6' : '#D9D9D9'), 
                      fontSize: '10px' 
                    }}>
                      {userRating > 0 ? `${userRating}.0` : 'give a note'}
                    </div>
                    
                    {/* Review Text Input */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 self-start mt-2">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <textarea
                        value={userReviewText}
                        onChange={(e) => {
                          if (e.target.value.length <= 1000) {
                            setUserReviewText(e.target.value);
                          }
                        }}
                        placeholder="What do you think of this product?"
                        className="flex-1 rounded-lg px-3 text-sm focus:outline-none resize-none"
                        style={{ 
                          border: 'none',
                          minHeight: '80px',
                          paddingTop: '12px',
                          paddingBottom: '12px',
                          color: '#939393',
                          backgroundColor: 'transparent',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                        maxLength={1000}
                      />
                    </div>
                    
                    {/* Post Review Button */}
                    <div className="relative mt-4">
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
                          }
                    }}
                        className="w-full py-2.5 font-normal transition-all relative"
                        style={{ 
                          backgroundColor: userRating > 0 ? '#FBBC05' : '#F4F4F4',
                          color: userRating > 0 ? 'white' : '#6A6A6A',
                          borderRadius: '12px'
                        }}
                        disabled={userRating === 0}
                      >
                        Post the review
                        {/* Character Counter - Top Left */}
                        {userReviewText.length > 0 && (
                          <div 
                            className="absolute"
                            style={{ 
                              top: '-26px', 
                              left: '0', 
                              color: '#64B5F6', 
                              fontSize: '12px' 
                            }}
                          >
                            {userReviewText.length}/1000
                          </div>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Thank You State */}
                    <div className="mb-6 text-center">
                      <h3 className="text-xl font-semibold" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', color: '#212121' }}>
                        Thank you for your<br/>feedback. 😊
                      </h3>
                    </div>
                    
                    {/* Posted Review Card */}
                    <div className="border rounded-3xl text-left mx-auto mb-4" style={{ borderColor: '#E1E1E1', maxWidth: '500px' }}>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                            </div>

                            <div>
                              {/* Name */}
                              <h4 className="font-semibold mb-1" style={{ color: '#0E0E0E', fontSize: '14px' }}>You</h4>
                              
                              {/* Star Rating */}
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                  {[1,2,3,4,5].map((star) => (
                                    <svg 
                                      key={star}
                                      className="w-3.5 h-3.5" 
                                      fill={star <= postedReview!.rating ? '#F9A825' : '#E9E9E9'}
                                      stroke="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-sm font-medium" style={{ color: '#939393' }}>{postedReview!.rating}.0</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Edit Button and Date */}
                          <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                            <button 
                              onClick={() => {
                                setIsReviewPosted(false);
                              }}
                              className="flex items-center space-x-1.5 px-2.5 py-1 border rounded-lg transition-colors hover:bg-gray-50"
                              style={{ borderColor: '#D9D9D9' }}
                            >
                              <img src={pencilIcon} alt="Edit" className="w-3 h-3" />
                              <span className="text-xs" style={{ color: '#6A6A6A' }}>Edit</span>
                  </button>
                            <span className="text-[10px]" style={{ color: '#939393' }}>{postedReview!.date}</span>
                </div>
              </div>
                        
                        {/* Review Text */}
                        <p className="text-sm leading-relaxed" style={{ color: '#939393', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                          {postedReview!.text}
                        </p>
            </div>
          </div>
                    
                    {/* Close Button */}
                    <button
                      onClick={() => {
                        setShowGiveOpinionModal(false);
                        // Don't reset state - keep the review posted so it shows below ratings
                      }}
                      className="w-full py-3 font-normal text-white transition-colors"
                      style={{ backgroundColor: '#F9A825', borderRadius: '12px' }}
                    >
                      Close
                    </button>
                  </>
                )}
        </div>
      </div>
      </div>
        </>
      )}

      {/* Add spacing before footer */}
      <div className="pb-4 lg:pb-32">
        {/* Mobile Footer Divider - Just above footer logo */}
        <div className="lg:hidden border-t pt-1 mb-1" style={{ borderColor: '#E5E5E5' }}></div>
      </div>
    </div>
  );
};

export default ProductDetail;
