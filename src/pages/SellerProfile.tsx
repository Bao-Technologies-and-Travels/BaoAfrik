import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import sellerAvatar from '../assets/images/logos/avatar.png';
import defaultCoverImage from '../assets/images/logos/8.png';
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
  const [selectedFilter, setSelectedFilter] = useState('Most Relevant');
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const { sellerId } = useParams<{ sellerId: string }>();

  // Filter options
  const filterOptions = [
    'Most Relevant',
    'Newest First',
    'Oldest First',
    'Highest Rating',
    'Lowest Rating'
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
    <div className="min-h-screen bg-white">



      {/* Cover Page Section - Desktop */}
      <div className="hidden lg:block px-2 py-4 relative">
        <div className="w-full">
          <div className="bg-orange-100 h-64 rounded-2xl relative overflow-hidden w-full">
            {/* Cover Image */}
            <img
              src={seller.coverPhoto || defaultCoverImage}
              alt="Cover Photo"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Profile Avatar - Half in cover, positioned for left alignment */}
          <div className="absolute left-8 bottom-[-80px]">
            <div className="w-40 h-40 bg-blue-100 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
              <img
                src={seller.avatar}
                alt={seller.name}
                className="w-36 h-36 rounded-xl object-cover"
              />
            </div>
          </div>
          
          {/* Chat Button - Positioned at right side of cover */}
          <div className="absolute right-8 bottom-[-60px]">
            <div className="flex items-center space-x-3">
              <button className="bg-orange-400 text-white px-8 xl:px-12 py-3 rounded-lg hover:bg-orange-500 transition-colors font-medium flex items-center space-x-2">
                <span>Chat with seller</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Name and Status - Positioned next to avatar */}
          <div className="absolute left-52 bottom-[-70px]">
            <h1 className="text-xl text-gray-900 mb-2">{seller.name}</h1>
            {seller.isVerified && (
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-2 py-1 rounded-md">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium">Verified Seller</span>
              </div>
            )}
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
          <div className="absolute left-4 md:left-6 -top-10">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-100 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
              <img
                src={seller.avatar}
                alt={seller.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover"
              />
            </div>
          </div>
          
          {/* Verified Badge - Moved Down */}
          <div className="absolute right-4 md:right-6 top-2">
            {seller.isVerified && (
              <div className="inline-flex items-center space-x-1 bg-green-100 text-green-700 px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg text-xs md:text-sm whitespace-nowrap">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-green-500 rounded-full"></div>
                <span className="font-medium">Verified Seller</span>
              </div>
            )}
          </div>
          
          {/* Name and Info - Below Avatar */}
          <div className="pt-12 md:pt-14">
            <h1 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{seller.name}</h1>
            
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
            <div className="xl:col-span-2">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Bio</h3>
              <p className="text-gray-600 leading-relaxed text-base">
                {seller.bio}
              </p>
            </div>

            {/* Info Section - Location and Membership */}
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Reviews & Ratings</h2>
                <div className="flex items-center space-x-2 text-gray-600">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>London, United Kingdom</span>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Member</h4>
                <div className="flex items-center space-x-2 text-gray-600">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Since 2025</span>
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
            <>
          {/* Rating Summary */}
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl font-bold text-gray-900">4.3</div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
              <div className="flex-1 ml-8">
                {/* Rating Bars */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{width: '70%'}}></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{width: '60%'}}></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{width: '40%'}}></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{width: '20%'}}></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{width: '10%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="-mt-4 text-sm text-gray-600">Reviews (456)</div>
          </div>

          {/* Filter Dropdown */}
          <div className="relative mb-6" ref={filterDropdownRef}>
            <button 
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className="flex items-center text-gray-600 text-sm hover:text-gray-800 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                <circle cx="8" cy="6" r="2" fill="currentColor" />
                <circle cx="16" cy="10" r="2" fill="currentColor" />
                <circle cx="12" cy="14" r="2" fill="currentColor" />
              </svg>
              <span>{selectedFilter}</span>
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
            {/* Review 1 */}
            <div className="border-b border-gray-100 pb-6">
              <div className="flex items-start space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                  alt="Miles Kennedy"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="mb-2">
                    <h4 className="font-medium text-gray-900 mb-1">Miles Kennedy</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {[1,2,3,4].map((star) => (
                          <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 lg:text-sm">
                        <span className="lg:hidden">15/07/2025</span>
                        <span className="hidden lg:inline">Published on 15, Jul 2025</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3 mt-2">
                Amazing seller! The product quality exceeded my expectations. Fast shipping and excellent communication throughout the process. The item was exactly as described and arrived in perfect condition. Highly recommend this seller to anyone looking for quality products and reliable service.
              </p>
              <div className="flex items-center justify-between">
                    <button 
                      onClick={() => {
                        const isLiked = likedReviews.includes('review1');
                        if (isLiked) {
                          setLikes(prev => ({ ...prev, review1: prev.review1 - 1 }));
                          setLikedReviews(prev => prev.filter(id => id !== 'review1'));
                        } else {
                          setLikes(prev => ({ ...prev, review1: prev.review1 + 1 }));
                          setLikedReviews(prev => [...prev, 'review1']);
                        }
                      }}
                      className={`flex items-center space-x-2 transition-colors px-3 py-1 rounded-lg ${
                        likedReviews.includes('review1') ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:text-red-500 bg-blue-50 hover:bg-blue-100'
                      }`}
                    >
                      <svg className="w-4 h-4" fill={likedReviews.includes('review1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-sm">{likes.review1}</span>
                    </button>
                    <button 
                      onClick={() => {
                        const isExpanded = expandedDiscussions.includes('review1');
                        if (isExpanded) {
                          setExpandedDiscussions(prev => prev.filter(id => id !== 'review1'));
                        } else {
                          setExpandedDiscussions(prev => [...prev, 'review1']);
                        }
                      }}
                      className="text-blue-500 text-sm hover:underline"
                    >
                      {expandedDiscussions.includes('review1') ? 'Hide discussion (2)' : 'View discussion (2)'}
                    </button>
                  </div>
                  {expandedDiscussions.includes('review1') && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-3">
                      <div className="flex items-start space-x-3">
                        <img
                          src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
                          alt="Sarah Wilson"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">Sarah Wilson</span>
                            <span className="text-xs text-gray-500">2 days ago</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">I completely agree! This seller is amazing. Had a similar experience with my order.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
                          alt="Miles Kennedy"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">Miles Kennedy</span>
                            <span className="text-xs text-gray-500">1 day ago</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">@Sarah Wilson Thanks! Really appreciate the positive feedback. This seller deserves all the praise!</p>
                        </div>
                      </div>
                    </div>
                  )}
            </div>

            {/* Review 2 */}
            <div className="border-b border-gray-100 pb-6">
              <div className="flex items-start space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=40&h=40&fit=crop&crop=face"
                  alt="Samine Herald"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="mb-2">
                    <h4 className="font-medium text-gray-900 mb-1">Samine Herald</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {[1,2,3,4].map((star) => (
                          <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 lg:text-sm">
                        <span className="lg:hidden">22/06/2025</span>
                        <span className="hidden lg:inline">Published on 22, Jun 2025</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3 mt-2">
                Outstanding experience! This seller goes above and beyond to ensure customer satisfaction. The product was beautifully packaged and arrived ahead of schedule. Great attention to detail and very responsive to messages. Will definitely purchase from this seller again!
              </p>
              <div className="flex items-center justify-between">
                    <button 
                      onClick={() => {
                        const isLiked = likedReviews.includes('review2');
                        if (isLiked) {
                          setLikes(prev => ({ ...prev, review2: prev.review2 - 1 }));
                          setLikedReviews(prev => prev.filter(id => id !== 'review2'));
                        } else {
                          setLikes(prev => ({ ...prev, review2: prev.review2 + 1 }));
                          setLikedReviews(prev => [...prev, 'review2']);
                        }
                      }}
                      className={`flex items-center space-x-2 transition-colors px-3 py-1 rounded-lg ${
                        likedReviews.includes('review2') ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:text-red-500 bg-blue-50 hover:bg-blue-100'
                      }`}
                    >
                      <svg className="w-4 h-4" fill={likedReviews.includes('review2') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-sm">{likes.review2}</span>
                    </button>
                    <button 
                      onClick={() => {
                        const isExpanded = expandedDiscussions.includes('review2');
                        if (isExpanded) {
                          setExpandedDiscussions(prev => prev.filter(id => id !== 'review2'));
                        } else {
                          setExpandedDiscussions(prev => [...prev, 'review2']);
                        }
                      }}
                      className="text-blue-500 text-sm hover:underline"
                    >
                      {expandedDiscussions.includes('review2') ? 'Hide discussion (2)' : 'View discussion (2)'}
                    </button>
                  </div>
                  {expandedDiscussions.includes('review2') && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-3">
                      <div className="flex items-start space-x-3">
                        <img
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                          alt="Alex Thompson"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">Alex Thompson</span>
                            <span className="text-xs text-gray-500">3 days ago</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">How was the packaging? I'm considering ordering from this seller too.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <img
                          src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=32&h=32&fit=crop&crop=face"
                          alt="Samine Herald"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">Samine Herald</span>
                            <span className="text-xs text-gray-500">2 days ago</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">@Alex Thompson The packaging was excellent! Very professional and secure. Definitely recommend!</p>
                        </div>
                      </div>
                    </div>
                  )}
            </div>

            {/* Review 3 */}
            <div className="border-b border-gray-100 pb-6">
              <div className="flex items-start space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                  alt="David Johnson"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="mb-2">
                    <h4 className="font-medium text-gray-900 mb-1">David Johnson</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {[1,2,3,4].map((star) => (
                          <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 lg:text-sm">
                        <span className="lg:hidden">10/05/2025</span>
                        <span className="hidden lg:inline">Published on 10, May 2025</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3 mt-2">
                Fantastic seller with top-notch products! The quality is exceptional and the price was very reasonable. Quick delivery and the item was exactly what I was looking for. Professional packaging and great customer service. This seller truly cares about their customers' experience.
              </p>
              <div className="flex items-center justify-between">
                    <button 
                      onClick={() => {
                        const isLiked = likedReviews.includes('review3');
                        if (isLiked) {
                          setLikes(prev => ({ ...prev, review3: prev.review3 - 1 }));
                          setLikedReviews(prev => prev.filter(id => id !== 'review3'));
                        } else {
                          setLikes(prev => ({ ...prev, review3: prev.review3 + 1 }));
                          setLikedReviews(prev => [...prev, 'review3']);
                        }
                      }}
                      className={`flex items-center space-x-2 transition-colors px-3 py-1 rounded-lg ${
                        likedReviews.includes('review3') ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:text-red-500 bg-blue-50 hover:bg-blue-100'
                      }`}
                    >
                      <svg className="w-4 h-4" fill={likedReviews.includes('review3') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-sm">{likes.review3}</span>
                    </button>
                    <button 
                      onClick={() => {
                        const isExpanded = expandedDiscussions.includes('review3');
                        if (isExpanded) {
                          setExpandedDiscussions(prev => prev.filter(id => id !== 'review3'));
                        } else {
                          setExpandedDiscussions(prev => [...prev, 'review3']);
                        }
                      }}
                      className="text-blue-500 text-sm hover:underline"
                    >
                      {expandedDiscussions.includes('review3') ? 'Hide discussion (2)' : 'View discussion (2)'}
                    </button>
                  </div>
                  {expandedDiscussions.includes('review3') && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-3">
                      <div className="flex items-start space-x-3">
                        <img
                          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face"
                          alt="Emma Davis"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">Emma Davis</span>
                            <span className="text-xs text-gray-500">1 day ago</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">What was the delivery time? I need something urgently.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <img
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                          alt="David Johnson"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">David Johnson</span>
                            <span className="text-xs text-gray-500">1 day ago</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">@Emma Davis It arrived 2 days earlier than expected! Very fast shipping.</p>
                        </div>
                      </div>
                    </div>
                  )}
            </div>
          </div>

          {/* View More Reviews Button */}
          <div className="text-center mt-8">
            <button 
              onClick={() => navigate('/reviews')}
              className="text-blue-500 hover:underline transition-colors bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100"
            >
              View more reviews (453)
            </button>
          </div>
            </>
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
