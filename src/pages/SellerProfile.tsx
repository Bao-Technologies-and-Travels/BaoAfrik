import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import sellerAvatar from '../assets/images/logos/avatar.png';
import defaultCoverImage from '../assets/images/logos/8.png';
import arrowLeftIcon from '../assets/images/pre/arrow-left.svg';
import verifyIcon from '../assets/images/pre/verify.svg';
import basketIcon from '../assets/images/pre/basket.png';
import logoIcon from '../assets/images/logos/ba-brand-icon-colored.png';
import whatsappIcon from '../assets/images/pre/zap.svg';
import instagramIcon from '../assets/images/pre/ig.svg';
import facebookIcon from '../assets/images/pre/fb.svg';
import locationIcon from '../assets/images/pre/PL.svg';
import profileIcon from '../assets/images/pre/profile.svg';
import likeIcon from '../assets/images/pre/like.svg';
import dislikeIcon from '../assets/images/pre/dislike.svg';
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

const SellerProfile: React.FC = () => {
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
  const [expandedDiscussions, setExpandedDiscussions] = useState<string[]>([]);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('The most relevant');
  const [userRating, setUserRating] = useState(0);
  const [userReviewText, setUserReviewText] = useState('');
  const [reviewHelpfulness, setReviewHelpfulness] = useState<{[key: string]: 'yes' | 'no' | null}>({});
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const { sellerId } = useParams<{ sellerId: string }>();

  // Filter options
  const filterOptions = [
    'The most relevant',
    'Newest first',
    'Oldest first',
    'Highest rating',
    'Lowest rating'
  ];

  // Function to handle filter selection
  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setFilterDropdownOpen(false);
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
            <span 
              className="hover:text-gray-700 cursor-pointer" 
              style={{ color: '#BABABA' }}
              onClick={() => navigate(-1)}
            >
              Product ID
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
            
            {/* Chat Button - Positioned at right side of cover */}
            <div className="absolute right-0 bottom-[-62px]">
              <div className="flex items-center space-x-3">
                <button 
                  className="hover:opacity-90 transition-opacity"
                  style={{
                    display: 'flex',
                    height: '40px',
                    padding: '8px 20px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: '#F9A825',
                    color: 'white',
                    borderRadius: '12px',
                    fontWeight: '400',
                    fontSize: '14px'
                  }}
                >
                  <span>Message the seller</span>
                  <img src={basketIcon} alt="Cart" className="w-5 h-5" style={{ filter: 'brightness(0) invert(1)' }} />
                </button>
                <button 
                  className="hover:bg-gray-50 transition-colors"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'white',
                    border: '1px solid #F9A825',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <div className="flex space-x-1">
                    <div 
                      style={{
                        width: '5px',
                        height: '5px',
                        backgroundColor: 'white',
                        border: '1.5px solid #F9A825',
                        borderRadius: '50%'
                      }}
                    ></div>
                    <div 
                      style={{
                        width: '5px',
                        height: '5px',
                        backgroundColor: 'white',
                        border: '1.5px solid #F9A825',
                        borderRadius: '50%'
                      }}
                    ></div>
                    <div 
                      style={{
                        width: '5px',
                        height: '5px',
                        backgroundColor: 'white',
                        border: '1.5px solid #F9A825',
                        borderRadius: '50%'
                      }}
                    ></div>
                  </div>
                </button>
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
                src={seller.avatar}
                alt={seller.name}
                className="w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover"
              />
            </div>
          </div>
          
          {/* Verified Badge - Moved Down */}
          <div className="absolute right-4 md:right-6 top-2">
            {seller.isVerified && (
              <div className="inline-flex items-center space-x-1 px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg text-xs md:text-sm whitespace-nowrap" style={{ backgroundColor: '#EDFBF0' }}>
                <img src={verifyIcon} alt="Verified" className="w-2.5 h-2.5 md:w-3 md:h-3" />
                <span className="font-medium" style={{ color: '#45C55B' }}>Verified Seller</span>
              </div>
            )}
          </div>
          
          {/* Name and Info - Below Avatar */}
          <div className="pt-10 md:pt-12">
            <h1 className="text-base md:text-lg font-semibold text-gray-900 mb-2">{seller.name}</h1>
            
            {/* Location, Member Info, and Rating */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex flex-col space-y-1">
                {/* Location */}
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>London, United Kingdom</span>
                </div>
                
                {/* Member Info */}
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Member since 2025</span>
                </div>
              </div>
              
              {/* Rating - Right Side */}
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-lg font-semibold text-gray-900">4.3</span>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-500">Reviews (456)</span>
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
      <div className="lg:hidden bg-white px-4 md:px-6 py-3 md:py-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">Bio</h3>
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          {seller.bio}
        </p>
      </div>

      {/* Reviews and Ratings Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <div className="flex">
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2 text-sm lg:text-base font-medium border-b-2 ${
                  activeTab === 'reviews' 
                    ? 'text-gray-900 border-gray-900' 
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                Reviews and Ratings
              </button>
              <button 
                onClick={() => setActiveTab('items')}
                className={`px-4 py-2 text-sm lg:text-base font-medium ml-8 border-b-2 ${
                  activeTab === 'items' 
                    ? 'text-gray-900 border-gray-900' 
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                Seller Items
              </button>
            </div>
          </div>

          {/* Reviews Content */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT COLUMN - Reviews List */}
              <div className="lg:col-span-2">
                {/* Filter Dropdown */}
                <div className="relative mb-6 py-3" ref={filterDropdownRef}>
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
                      <line x1="3" y1="6" x2="17" y2="6" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="10" cy="6" r="2" fill="#FFF" stroke="#6A6A6A" strokeWidth="1.5"/>
                      
                      {/* Bottom line with circle */}
                      <line x1="3" y1="14" x2="17" y2="14" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="10" cy="14" r="2" fill="#FFF" stroke="#6A6A6A" strokeWidth="1.5"/>
                    </svg>
                    <span className="text-sm">{selectedFilter}</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {filterDropdownOpen && (
                    <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                      {filterOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleFilterSelect(option)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                            selectedFilter === option ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                          } ${option === filterOptions[0] ? 'rounded-t-lg' : ''} ${
                            option === filterOptions[filterOptions.length - 1] ? 'rounded-b-lg' : ''
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Review Cards */}
                <div className="space-y-6">
                  {/* Review 1 - Samine Herald */}
                  <div className="border-b pb-6" style={{ borderColor: '#F5F5F5' }}>
                    <div className="flex items-start space-x-3 mb-3">
                      <img
                        src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=48&h=48&fit=crop&crop=face"
                        alt="Samine Herald"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">Samine Herald</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-gray-900">5.0</span>
                            <div className="flex items-center">
                              {[1,2,3,4,5].map((star) => (
                                <svg key={star} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                              ))}
                            </div>
                          </div>
                          <span className="text-xs" style={{ color: '#939393' }}>Posted on 2 Jan 2025</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: '#B0B0B0' }}>
                      Outstanding experience! This seller goes above and beyond to ensure customer satisfaction. The product was beautifully packaged and arrived ahead of schedule. Great attention to detail and very responsive to messages.
                    </p>
                    
                    {/* Helpfulness Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm" style={{ color: '#6A6A6A' }}>Was this review helpful to you?</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setReviewHelpfulness(prev => ({ ...prev, review1: prev.review1 === 'yes' ? null : 'yes' }))}
                            className="flex items-center space-x-1 px-3 py-1 rounded-full transition-colors"
                            style={{ 
                              border: '1px solid #E1E1E1',
                              color: '#6A6A6A',
                              backgroundColor: reviewHelpfulness.review1 === 'yes' ? '#F0F0F0' : 'white'
                            }}
                          >
                            <img src={likeIcon} alt="Like" className="w-4 h-4" />
                            <span className="text-sm">Yes</span>
                          </button>
                          <button
                            onClick={() => setReviewHelpfulness(prev => ({ ...prev, review1: prev.review1 === 'no' ? null : 'no' }))}
                            className="flex items-center space-x-1 px-3 py-1 rounded-full transition-colors"
                            style={{ 
                              border: '1px solid #E1E1E1',
                              color: '#6A6A6A',
                              backgroundColor: reviewHelpfulness.review1 === 'no' ? '#F0F0F0' : 'white'
                            }}
                          >
                            <img src={dislikeIcon} alt="Dislike" className="w-4 h-4" />
                            <span className="text-sm">No</span>
                          </button>
                        </div>
                      </div>
                      <button 
                        className="text-sm hover:underline"
                        style={{ color: '#64B5F6' }}
                      >
                        View the discussion (1)
                      </button>
                    </div>
                  </div>

                  {/* Review 2 - Kael Otto */}
                  <div className="border-b pb-6" style={{ borderColor: '#F5F5F5' }}>
                    <div className="flex items-start space-x-3 mb-3">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face"
                        alt="Kael Otto"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">Kael Otto</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-gray-900">5.0</span>
                            <div className="flex items-center">
                              {[1,2,3,4,5].map((star) => (
                                <svg key={star} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                              ))}
                            </div>
                          </div>
                          <span className="text-xs" style={{ color: '#939393' }}>Posted on 12 Dec 2024</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: '#B0B0B0' }}>
                      Amazing seller! The product quality exceeded my expectations. Fast shipping and excellent communication throughout the process. The item was exactly as described and arrived in perfect condition.
                    </p>
                    
                    {/* Helpfulness Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm" style={{ color: '#6A6A6A' }}>Was this review helpful to you?</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setReviewHelpfulness(prev => ({ ...prev, review2: prev.review2 === 'yes' ? null : 'yes' }))}
                            className="flex items-center space-x-1 px-3 py-1 rounded-full transition-colors"
                            style={{ 
                              border: '1px solid #E1E1E1',
                              color: '#6A6A6A',
                              backgroundColor: reviewHelpfulness.review2 === 'yes' ? '#F0F0F0' : 'white'
                            }}
                          >
                            <img src={likeIcon} alt="Like" className="w-4 h-4" />
                            <span className="text-sm">Yes</span>
                          </button>
                          <button
                            onClick={() => setReviewHelpfulness(prev => ({ ...prev, review2: prev.review2 === 'no' ? null : 'no' }))}
                            className="flex items-center space-x-1 px-3 py-1 rounded-full transition-colors"
                            style={{ 
                              border: '1px solid #E1E1E1',
                              color: '#6A6A6A',
                              backgroundColor: reviewHelpfulness.review2 === 'no' ? '#F0F0F0' : 'white'
                            }}
                          >
                            <img src={dislikeIcon} alt="Dislike" className="w-4 h-4" />
                            <span className="text-sm">No</span>
                          </button>
                        </div>
                      </div>
                      <button 
                        className="text-sm hover:underline"
                        style={{ color: '#64B5F6' }}
                      >
                        View the discussion (3)
                      </button>
                    </div>
                  </div>

                  {/* Review 3 - Alex Johnson */}
                  <div className="border-b pb-6" style={{ borderColor: '#F5F5F5' }}>
                    <div className="flex items-start space-x-3 mb-3">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face"
                        alt="Alex Johnson"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">Alex Johnson</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-gray-900">2.1</span>
                            <div className="flex items-center">
                              {[1,2].map((star) => (
                                <svg key={star} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                              ))}
                              {[1,2,3].map((star) => (
                                <svg key={`empty-${star}`} className="w-3.5 h-3.5 text-gray-300 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                              ))}
                            </div>
                          </div>
                          <span className="text-xs" style={{ color: '#939393' }}>Posted on 8 Nov 2024</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: '#B0B0B0' }}>
                      The product was okay, but not exactly what I expected. Shipping took longer than anticipated. Communication could have been better.
                    </p>
                    
                    {/* Helpfulness Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm" style={{ color: '#6A6A6A' }}>Was this review helpful to you?</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setReviewHelpfulness(prev => ({ ...prev, review3: prev.review3 === 'yes' ? null : 'yes' }))}
                            className="flex items-center space-x-1 px-3 py-1 rounded-full transition-colors"
                            style={{ 
                              border: '1px solid #E1E1E1',
                              color: '#6A6A6A',
                              backgroundColor: reviewHelpfulness.review3 === 'yes' ? '#F0F0F0' : 'white'
                            }}
                          >
                            <img src={likeIcon} alt="Like" className="w-4 h-4" />
                            <span className="text-sm">Yes</span>
                          </button>
                          <button
                            onClick={() => setReviewHelpfulness(prev => ({ ...prev, review3: prev.review3 === 'no' ? null : 'no' }))}
                            className="flex items-center space-x-1 px-3 py-1 rounded-full transition-colors"
                            style={{ 
                              border: '1px solid #E1E1E1',
                              color: '#6A6A6A',
                              backgroundColor: reviewHelpfulness.review3 === 'no' ? '#F0F0F0' : 'white'
                            }}
                          >
                            <img src={dislikeIcon} alt="Dislike" className="w-4 h-4" />
                            <span className="text-sm">No</span>
                          </button>
                        </div>
                      </div>
                      <button 
                        className="text-sm hover:underline"
                        style={{ color: '#64B5F6' }}
                      >
                        View the discussion (2)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <span className="text-sm text-gray-600">1 - 4 out of 23</span>
                  <div className="flex items-center space-x-2">
                    <button 
                      disabled
                      className="w-10 h-10 rounded-full flex items-center justify-center border transition-colors disabled:cursor-not-allowed"
                      style={{ 
                        borderColor: '#E5E5E5',
                        backgroundColor: 'white'
                      }}
                    >
                      <svg className="w-5 h-5" style={{ color: '#BABABA' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:opacity-90"
                      style={{ 
                        backgroundColor: '#212121'
                      }}
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - Rating Summary & Give Your Opinion */}
              <div className="lg:col-span-1">
                {/* Overall Rating Summary */}
                <div className="mb-8">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="text-4xl font-bold text-gray-900">4.3</div>
                    <svg className="w-8 h-8 text-yellow-400 fill-current mt-1" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">Review & Rates (456)</div>
                  
                  {/* Rating Bars */}
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{width: '70%'}}></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{width: '60%'}}></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{width: '40%'}}></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{width: '20%'}}></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{width: '10%'}}></div>
                    </div>
                  </div>
                </div>

                {/* Give Your Opinion Section */}
                <div className="border-t pt-6" style={{ borderColor: '#E5E5E5' }}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Give your opinion</h3>
                  <p className="text-sm text-gray-600 mb-4">Share your opinion about this user and help others learn a bit more about them.</p>
                  
                  {/* Star Rating Input */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[1,2,3,4,5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="focus:outline-none hover:scale-110 transition-transform"
                      >
                        <svg 
                          className={`w-8 h-8 ${userRating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'} stroke-current`} 
                          viewBox="0 0 24 24"
                          style={{ strokeWidth: '1.5' }}
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </button>
                    ))}
                  </div>
                  
                  {/* Review Text Input */}
                  <div className="flex items-start space-x-3 mb-4">
                    <img
                      src={sellerAvatar}
                      alt="Your avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <textarea
                      value={userReviewText}
                      onChange={(e) => setUserReviewText(e.target.value)}
                      placeholder="Que pensez vous de cet article?"
                      className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      style={{ borderColor: '#E5E5E5', minHeight: '80px' }}
                    />
                  </div>
                  
                  {/* Post Review Button */}
                  <button 
                    className="w-full py-2.5 rounded-lg font-medium text-white transition-colors"
                    style={{ backgroundColor: '#F9A825' }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}
                  >
                    Post the review
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Seller Items Content */}
          {activeTab === 'items' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {/* Product 1 - African Textiles */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="aspect-square bg-gray-100 relative">
                  <img src={pre1} alt="African Textiles" className="w-full h-full object-cover" />
                  
                  {/* Country Badge */}
                  <div className="absolute top-2 left-2 bg-white rounded-md px-2 py-1 flex items-center space-x-1 shadow-sm">
                    <img 
                      src={getProductCountry(1).flag} 
                      alt={getProductCountry(1).name}
                      className="w-3 h-2 object-cover rounded-sm"
                    />
                    <span className="text-xs font-medium text-gray-800">
                      {getProductCountry(1).abbreviation}
                    </span>
                </div>
                </div>
                <div className="p-3 pb-2">
                  {/* Price and Verified Badge Row */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-semibold text-gray-900">$13.9</span>
                    <div className="flex items-center text-xs text-green-600 px-0.5 sm:px-1 py-0.5 bg-green-50 rounded whitespace-nowrap">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mr-0.5 sm:mr-1 flex-shrink-0"></div>
                      <span className="text-xs sm:text-xs">Verified Seller</span>
                    </div>
                  </div>
                  
                  {/* Product Name */}
                      <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">African Textiles</h3>
                  
                  {/* Location and Bookmark Row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 flex items-center text-xs text-gray-500">
                      <svg className="w-2.5 h-2.5 mr-1 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      <span className="truncate font-normal max-w-[60px] sm:max-w-none">London | United Kingdom</span>
                    </div>
                    
                    {/* Bookmark Button */}
                    <div className="ml-4">
                      <button 
                        onClick={() => {
                          const newSet = new Set(wishlistProducts);
                          if (newSet.has('textiles-1')) {
                            newSet.delete('textiles-1');
                          } else {
                            newSet.add('textiles-1');
                          }
                          setWishlistProducts(newSet);
                        }}
                        className={`p-2 transition-colors touch-manipulation ${
                          wishlistProducts.has('textiles-1') 
                            ? 'text-orange-500 hover:text-orange-600' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title={wishlistProducts.has('textiles-1') ? 'Remove from saved' : 'Save product'}
                      >
                        <div className="relative">
                          <svg className="w-6 h-6" fill={wishlistProducts.has('textiles-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                          {!wishlistProducts.has('textiles-1') && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-bold">+</span>
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product 2 - Fresh Tomatoes */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="aspect-square bg-gray-100 relative">
                  <img src={pre2} alt="Fresh Tomatoes" className="w-full h-full object-cover" />
                  
                  {/* Country Badge */}
                  <div className="absolute top-2 left-2 bg-white rounded-md px-2 py-1 flex items-center space-x-1 shadow-sm">
                    <img 
                      src={getProductCountry(2).flag} 
                      alt={getProductCountry(2).name}
                      className="w-3 h-2 object-cover rounded-sm"
                    />
                    <span className="text-xs font-medium text-gray-800">
                      {getProductCountry(2).abbreviation}
                    </span>
                </div>
                </div>
                <div className="p-3 pb-2">
                  {/* Price and Verified Badge Row */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-semibold text-gray-900">$45</span>
                    <div className="flex items-center text-xs text-green-600 px-0.5 sm:px-1 py-0.5 bg-green-50 rounded whitespace-nowrap">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mr-0.5 sm:mr-1 flex-shrink-0"></div>
                      <span className="text-xs sm:text-xs">Verified Seller</span>
                    </div>
                  </div>
                  
                  {/* Product Name */}
                      <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">Fresh Tomatoes</h3>
                  
                  {/* Location and Bookmark Row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 flex items-center text-xs text-gray-500">
                      <svg className="w-2.5 h-2.5 mr-1 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      <span className="truncate font-normal max-w-[60px] sm:max-w-none">London | United Kingdom</span>
                    </div>
                    
                    {/* Bookmark Button */}
                    <div className="ml-4">
                      <button 
                        onClick={() => {
                          const newSet = new Set(wishlistProducts);
                          if (newSet.has('tomatoes-1')) {
                            newSet.delete('tomatoes-1');
                          } else {
                            newSet.add('tomatoes-1');
                          }
                          setWishlistProducts(newSet);
                        }}
                        className={`p-2 transition-colors touch-manipulation ${
                          wishlistProducts.has('tomatoes-1') 
                            ? 'text-orange-500 hover:text-orange-600' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title={wishlistProducts.has('tomatoes-1') ? 'Remove from saved' : 'Save product'}
                      >
                        <div className="relative">
                          <svg className="w-6 h-6" fill={wishlistProducts.has('tomatoes-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                          {!wishlistProducts.has('tomatoes-1') && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-bold">+</span>
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product 3 - Dried Shrimp */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="aspect-square bg-gray-100 relative">
                  <img src={pre3} alt="Dried Shrimp" className="w-full h-full object-cover" />
                  
                  {/* Country Badge */}
                  <div className="absolute top-2 left-2 bg-white rounded-md px-2 py-1 flex items-center space-x-1 shadow-sm">
                    <img 
                      src={getProductCountry(3).flag} 
                      alt={getProductCountry(3).name}
                      className="w-3 h-2 object-cover rounded-sm"
                    />
                    <span className="text-xs font-medium text-gray-800">
                      {getProductCountry(3).abbreviation}
                    </span>
                </div>
                </div>
                <div className="p-3 pb-2">
                  {/* Price and Verified Badge Row */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-semibold text-gray-900">$8.09</span>
                    <div className="flex items-center text-xs text-green-600 px-0.5 sm:px-1 py-0.5 bg-green-50 rounded whitespace-nowrap">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mr-0.5 sm:mr-1 flex-shrink-0"></div>
                      <span className="text-xs sm:text-xs">Verified Seller</span>
                    </div>
                  </div>
                  
                  {/* Product Name */}
                      <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">Dried Shrimp</h3>
                  
                  {/* Location and Bookmark Row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 flex items-center text-xs text-gray-500">
                      <svg className="w-2.5 h-2.5 mr-1 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      <span className="truncate font-normal max-w-[60px] sm:max-w-none">London | United Kingdom</span>
                    </div>
                    
                    {/* Bookmark Button */}
                    <div className="ml-4">
                      <button 
                        onClick={() => {
                          const newSet = new Set(wishlistProducts);
                          if (newSet.has('shrimp-1')) {
                            newSet.delete('shrimp-1');
                          } else {
                            newSet.add('shrimp-1');
                          }
                          setWishlistProducts(newSet);
                        }}
                        className={`p-2 transition-colors touch-manipulation ${
                          wishlistProducts.has('shrimp-1') 
                            ? 'text-orange-500 hover:text-orange-600' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title={wishlistProducts.has('shrimp-1') ? 'Remove from saved' : 'Save product'}
                      >
                        <div className="relative">
                          <svg className="w-6 h-6" fill={wishlistProducts.has('shrimp-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                          {!wishlistProducts.has('shrimp-1') && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-bold">+</span>
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product 4 - Ndolé Leaves */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="aspect-square bg-gray-100 relative">
                  <img src={pre4} alt="Ndolé Leaves" className="w-full h-full object-cover" />
                  
                  {/* Country Badge */}
                  <div className="absolute top-2 left-2 bg-white rounded-md px-2 py-1 flex items-center space-x-1 shadow-sm">
                    <img 
                      src={getProductCountry(4).flag} 
                      alt={getProductCountry(4).name}
                      className="w-3 h-2 object-cover rounded-sm"
                    />
                    <span className="text-xs font-medium text-gray-800">
                      {getProductCountry(4).abbreviation}
                    </span>
                </div>
                </div>
                <div className="p-3 pb-2">
                  {/* Price and Verified Badge Row */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-semibold text-gray-900">$11.5</span>
                    <div className="flex items-center text-xs text-green-600 px-0.5 sm:px-1 py-0.5 bg-green-50 rounded whitespace-nowrap">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mr-0.5 sm:mr-1 flex-shrink-0"></div>
                      <span className="text-xs sm:text-xs">Verified Seller</span>
                    </div>
                  </div>
                  
                  {/* Product Name */}
                      <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">Ndolé Leaves</h3>
                  
                  {/* Location and Bookmark Row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 flex items-center text-xs text-gray-500">
                      <svg className="w-2.5 h-2.5 mr-1 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      <span className="truncate font-normal max-w-[60px] sm:max-w-none">London | United Kingdom</span>
                    </div>
                    
                    {/* Bookmark Button */}
                    <div className="ml-4">
                      <button 
                        onClick={() => {
                          const newSet = new Set(wishlistProducts);
                          if (newSet.has('ndole-1')) {
                            newSet.delete('ndole-1');
                          } else {
                            newSet.add('ndole-1');
                          }
                          setWishlistProducts(newSet);
                        }}
                        className={`p-2 transition-colors touch-manipulation ${
                          wishlistProducts.has('ndole-1') 
                            ? 'text-orange-500 hover:text-orange-600' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title={wishlistProducts.has('ndole-1') ? 'Remove from saved' : 'Save product'}
                      >
                        <div className="relative">
                          <svg className="w-6 h-6" fill={wishlistProducts.has('ndole-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                          {!wishlistProducts.has('ndole-1') && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-bold">+</span>
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product 5 - Plantain Chips */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="aspect-square bg-gray-100 relative">
                  <img src={pre5} alt="Plantain Chips" className="w-full h-full object-cover" />
                  
                  {/* Country Badge */}
                  <div className="absolute top-2 left-2 bg-white rounded-md px-2 py-1 flex items-center space-x-1 shadow-sm">
                    <img 
                      src={getProductCountry(5).flag} 
                      alt={getProductCountry(5).name}
                      className="w-3 h-2 object-cover rounded-sm"
                    />
                    <span className="text-xs font-medium text-gray-800">
                      {getProductCountry(5).abbreviation}
                    </span>
                </div>
                </div>
                <div className="p-3 pb-2">
                  {/* Price and Verified Badge Row */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-semibold text-gray-900">$6.50</span>
                    <div className="flex items-center text-xs text-green-600 px-0.5 sm:px-1 py-0.5 bg-green-50 rounded whitespace-nowrap">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mr-0.5 sm:mr-1 flex-shrink-0"></div>
                      <span className="text-xs sm:text-xs">Verified Seller</span>
                    </div>
                  </div>
                  
                  {/* Product Name */}
                      <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">Plantain Chips</h3>
                  
                  {/* Location and Bookmark Row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 flex items-center text-xs text-gray-500">
                      <svg className="w-2.5 h-2.5 mr-1 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      <span className="truncate font-normal max-w-[60px] sm:max-w-none">London | United Kingdom</span>
                    </div>
                    
                    {/* Bookmark Button */}
                    <div className="ml-4">
                      <button 
                        onClick={() => {
                          const newSet = new Set(wishlistProducts);
                          if (newSet.has('plantain-1')) {
                            newSet.delete('plantain-1');
                          } else {
                            newSet.add('plantain-1');
                          }
                          setWishlistProducts(newSet);
                        }}
                        className={`p-2 transition-colors touch-manipulation ${
                          wishlistProducts.has('plantain-1') 
                            ? 'text-orange-500 hover:text-orange-600' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title={wishlistProducts.has('plantain-1') ? 'Remove from saved' : 'Save product'}
                      >
                        <div className="relative">
                          <svg className="w-6 h-6" fill={wishlistProducts.has('plantain-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                          {!wishlistProducts.has('plantain-1') && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-bold">+</span>
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product 6 - Yam Flour */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="aspect-square bg-gray-100 relative">
                  <img src={pre6} alt="Yam Flour" className="w-full h-full object-cover" />
                  
                  {/* Country Badge */}
                  <div className="absolute top-2 left-2 bg-white rounded-md px-2 py-1 flex items-center space-x-1 shadow-sm">
                    <img 
                      src={getProductCountry(6).flag} 
                      alt={getProductCountry(6).name}
                      className="w-3 h-2 object-cover rounded-sm"
                    />
                    <span className="text-xs font-medium text-gray-800">
                      {getProductCountry(6).abbreviation}
                    </span>
                </div>
                </div>
                <div className="p-3 pb-2">
                  {/* Price and Verified Badge Row */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-semibold text-gray-900">$9.75</span>
                    <div className="flex items-center text-xs text-green-600 px-0.5 sm:px-1 py-0.5 bg-green-50 rounded whitespace-nowrap">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mr-0.5 sm:mr-1 flex-shrink-0"></div>
                      <span className="text-xs sm:text-xs">Verified Seller</span>
                    </div>
                  </div>
                  
                  {/* Product Name */}
                      <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">Yam Flour</h3>
                  
                  {/* Location and Bookmark Row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 flex items-center text-xs text-gray-500">
                      <svg className="w-2.5 h-2.5 mr-1 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      <span className="truncate font-normal max-w-[60px] sm:max-w-none">London | United Kingdom</span>
                    </div>
                    
                    {/* Bookmark Button */}
                    <div className="ml-4">
                      <button 
                        onClick={() => {
                          const newSet = new Set(wishlistProducts);
                          if (newSet.has('yam-1')) {
                            newSet.delete('yam-1');
                          } else {
                            newSet.add('yam-1');
                          }
                          setWishlistProducts(newSet);
                        }}
                        className={`p-2 transition-colors touch-manipulation ${
                          wishlistProducts.has('yam-1') 
                            ? 'text-orange-500 hover:text-orange-600' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title={wishlistProducts.has('yam-1') ? 'Remove from saved' : 'Save product'}
                      >
                        <div className="relative">
                          <svg className="w-6 h-6" fill={wishlistProducts.has('yam-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                          {!wishlistProducts.has('yam-1') && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-bold">+</span>
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product 7 - Palm Oil */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="aspect-square bg-gray-100 relative">
                  <img src={pre7} alt="Palm Oil" className="w-full h-full object-cover" />
                  
                  {/* Country Badge */}
                  <div className="absolute top-2 left-2 bg-white rounded-md px-2 py-1 flex items-center space-x-1 shadow-sm">
                    <img 
                      src={getProductCountry(7).flag} 
                      alt={getProductCountry(7).name}
                      className="w-3 h-2 object-cover rounded-sm"
                    />
                    <span className="text-xs font-medium text-gray-800">
                      {getProductCountry(7).abbreviation}
                    </span>
                </div>
                </div>
                <div className="p-3 pb-2">
                  {/* Price and Verified Badge Row */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-semibold text-gray-900">$15.20</span>
                    <div className="flex items-center text-xs text-green-600 px-0.5 sm:px-1 py-0.5 bg-green-50 rounded whitespace-nowrap">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mr-0.5 sm:mr-1 flex-shrink-0"></div>
                      <span className="text-xs sm:text-xs">Verified Seller</span>
                    </div>
                  </div>
                  
                  {/* Product Name */}
                      <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">Palm Oil</h3>
                  
                  {/* Location and Bookmark Row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 flex items-center text-xs text-gray-500">
                      <svg className="w-2.5 h-2.5 mr-1 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      <span className="truncate font-normal max-w-[60px] sm:max-w-none">London | United Kingdom</span>
                    </div>
                    
                    {/* Bookmark Button */}
                    <div className="ml-4">
                      <button 
                        onClick={() => {
                          const newSet = new Set(wishlistProducts);
                          if (newSet.has('palm-1')) {
                            newSet.delete('palm-1');
                          } else {
                            newSet.add('palm-1');
                          }
                          setWishlistProducts(newSet);
                        }}
                        className={`p-2 transition-colors touch-manipulation ${
                          wishlistProducts.has('palm-1') 
                            ? 'text-orange-500 hover:text-orange-600' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title={wishlistProducts.has('palm-1') ? 'Remove from saved' : 'Save product'}
                      >
                        <div className="relative">
                          <svg className="w-6 h-6" fill={wishlistProducts.has('palm-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                          {!wishlistProducts.has('palm-1') && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-bold">+</span>
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product 8 - African Spices */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="aspect-square bg-gray-100 relative">
                  <img src={pre8} alt="African Spices" className="w-full h-full object-cover" />
                  
                  {/* Country Badge */}
                  <div className="absolute top-2 left-2 bg-white rounded-md px-2 py-1 flex items-center space-x-1 shadow-sm">
                    <img 
                      src={getProductCountry(8).flag} 
                      alt={getProductCountry(8).name}
                      className="w-3 h-2 object-cover rounded-sm"
                    />
                    <span className="text-xs font-medium text-gray-800">
                      {getProductCountry(8).abbreviation}
                    </span>
                </div>
                </div>
                <div className="p-3 pb-2">
                  {/* Price and Verified Badge Row */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-semibold text-gray-900">$22.00</span>
                    <div className="flex items-center text-xs text-green-600 px-0.5 sm:px-1 py-0.5 bg-green-50 rounded whitespace-nowrap">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mr-0.5 sm:mr-1 flex-shrink-0"></div>
                      <span className="text-xs sm:text-xs">Verified Seller</span>
                    </div>
                  </div>
                  
                  {/* Product Name */}
                      <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">African Spices</h3>
                  
                  {/* Location and Bookmark Row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 flex items-center text-xs text-gray-500">
                      <svg className="w-2.5 h-2.5 mr-1 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      <span className="truncate font-normal max-w-[60px] sm:max-w-none">London | United Kingdom</span>
                    </div>
                    
                    {/* Bookmark Button */}
                    <div className="ml-4">
                      <button 
                        onClick={() => {
                          const newSet = new Set(wishlistProducts);
                          if (newSet.has('spices-1')) {
                            newSet.delete('spices-1');
                          } else {
                            newSet.add('spices-1');
                          }
                          setWishlistProducts(newSet);
                        }}
                        className={`p-2 transition-colors touch-manipulation ${
                          wishlistProducts.has('spices-1') 
                            ? 'text-orange-500 hover:text-orange-600' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title={wishlistProducts.has('spices-1') ? 'Remove from saved' : 'Save product'}
                      >
                        <div className="relative">
                          <svg className="w-6 h-6" fill={wishlistProducts.has('spices-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                          {!wishlistProducts.has('spices-1') && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-bold">+</span>
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            style={{backgroundColor: '#F9A825'}}
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
            style={{borderColor: '#F9A825', borderWidth: '1px'}}
          >
            <div className="flex space-x-1">
              <div className="w-1 h-1 rounded-full" style={{backgroundColor: '#F9A825'}}></div>
              <div className="w-1 h-1 rounded-full" style={{backgroundColor: '#F9A825'}}></div>
              <div className="w-1 h-1 rounded-full" style={{backgroundColor: '#F9A825'}}></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
