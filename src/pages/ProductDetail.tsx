import React, { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
// Import icons for reviews section
import likeIcon from '../assets/images/pre/like.svg';
import dislikeIcon from '../assets/images/pre/dislike.svg';
import grayArrowIcon from '../assets/images/pre/gray.svg';
import blackArrowIcon from '../assets/images/pre/black.svg';

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

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
  const [location, setLocation] = useState('');
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [isContactingSeller, setIsContactingSeller] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Reviews section state
  const [activeTab, setActiveTab] = useState<'reviews' | 'items'>('reviews');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('The most relevant');
  const [userRating, setUserRating] = useState(0);
  const [userReviewText, setUserReviewText] = useState('');
  const [reviewHelpfulness, setReviewHelpfulness] = useState<{[key: string]: 'yes' | 'no' | null}>({});
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  
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

  // Product images array - main image first, then thumbnail images
  const images = [mainImage, thumbnailImage1, thumbnailImage2, thumbnailImage3];

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

  // Mock product data (in real app, this would come from API based on id)
  const product = {
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
    if (location) searchParams.set('location', location);
    
    navigate(`/?${searchParams.toString()}`);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>

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
            
            {/* Right side - Share Button */}
            <button
              onClick={() => setShowShareModal(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              style={{ backgroundColor: '#F4F4F4', marginRight: '20px' }}
            >
              <img src={shareIcon} alt="Share" className="w-5 h-5" style={{ filter: 'brightness(0) saturate(100%) invert(73%) sepia(0%) saturate(0%)' }} />
            </button>
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
              className="absolute top-4 left-4 w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Action Buttons - Top Right */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
              
              <button 
                onClick={() => setIsSaved(!isSaved)}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                  isSaved ? 'bg-orange-500 text-white' : 'bg-white bg-opacity-90 text-gray-700'
                }`}
              >
                <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              
              <button className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
            
            {/* Navigation Arrows */}
            {selectedImageIndex > 0 && (
              <button
                onClick={() => setSelectedImageIndex(selectedImageIndex - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            {selectedImageIndex < images.length - 1 && (
              <button
                onClick={() => setSelectedImageIndex(selectedImageIndex + 1)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Image Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  selectedImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
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
              <div className="flex items-start mb-1.5">
                <h1 className="font-normal" style={{ fontSize: '18px', color: '#939393', whiteSpace: 'nowrap' }}>
                  poivre blanc
                </h1>
                <span className="font-light" style={{ fontSize: '11px', color: '#6A6A6A', marginLeft: '480px', whiteSpace: 'nowrap' }}>
                  Posted 2 days ago
                </span>
              </div>

              {/* Price */}
              <div className="mb-8" style={{ fontSize: '28px', color: '#212121', fontWeight: 600, fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                USD 31.7
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
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl transition-colors hover:opacity-80"
                  style={{ backgroundColor: '#F4F4F4', color: '#6A6A6A', fontSize: '13px', fontWeight: 500, width: 'fit-content' }}
                >
                  <img 
                    src={bookmarkIcon} 
                    alt="Bookmark" 
                    className="w-4 h-4"
                    style={{ filter: isSaved ? 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%)' : 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%)' }}
                  />
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
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Product Info */}
      <div className="lg:hidden px-4 py-6">
        {/* Price and Basic Info */}
        <div className="mb-4 border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            {/* Left side - Price, Product Name */}
            <div className="flex-1">
              <div className="text-2xl font-bold text-gray-900 mb-2">${product.price}</div>
              <h1 className="text-lg font-bold text-gray-900 mb-0">{product.name}</h1>
            </div>
            
            {/* Right side - Date, Category */}
            <div className="flex flex-col items-end text-right">
              <div className="text-xs text-black mb-1">Published 2 days ago</div>
              <div className="text-xs font-medium mb-4" style={{color: '#F9A825'}}>Category: Spices</div>
            </div>
          </div>
          
          {/* Location and Save Button Row */}
          <div className="flex items-center justify-between -mt-1 -ml-1">
            <div className="flex items-center text-gray-500 text-sm">
              <svg className="w-4 h-4 mr-1 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span className="whitespace-nowrap">{product.location}</span>
            </div>
            
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-lg border transition-colors ${
                isSaved 
                  ? 'border-orange-500 text-orange-500 bg-orange-50' 
                  : 'border-gray-300 text-gray-400 hover:border-gray-400'
              }`}
            >
              <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
          <p className="text-gray-600 leading-relaxed text-sm mb-3">
            {product.description}
          </p>
          <button 
            onClick={toggleAdditionalInfo}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center space-x-1"
          >
            <span>Additional information</span>
            <svg className={`w-4 h-4 transition-transform ${showAdditionalInfo ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Additional Information Section - Mobile */}
          {showAdditionalInfo && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Additional Product Information</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Origin:</span>
                  <span>Kerala, India (Malabar Coast)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Processing Method:</span>
                  <span>Retting process</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Shelf Life:</span>
                  <span>2-3 years when stored properly</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Storage:</span>
                  <span>Cool, dry place away from sunlight</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Package Weight:</span>
                  <span>100g</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Organic:</span>
                  <span>Yes, certified organic</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Seller Profile */}
        <div 
          className="mb-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-3 -mx-3"
          onClick={() => navigate(`/seller/${product.seller.name.toLowerCase().replace(/\s+/g, '-')}`)}
        >
          <div className="flex items-center space-x-3 mb-2">
            <img
              src={product.seller.avatar}
              alt={product.seller.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-medium text-gray-900">{product.seller.name}</div>
              {product.seller.verified && (
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Verified Seller
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
      
      {/* Mobile Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <button
          onClick={handleContactSeller}
          className="w-full text-white py-4 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          style={{backgroundColor: '#F9A825'}}
          onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'}
          onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.456L3 21l2.456-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
          </svg>
          <span>Chat with seller</span>
        </button>
      </div>

      {/* Reviews and Ratings Section */}
      <div className="bg-white mt-16">
        {/* Tab Navigation */}
        <div className="border-b" style={{ borderColor: '#E5E5E5' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex">
              <button 
                onClick={() => setActiveTab('reviews')}
                className="px-4 py-1 text-sm font-medium border-b-2 transition-colors"
                style={{
                  color: activeTab === 'reviews' ? '#64B5F6' : '#BABABA',
                  borderColor: activeTab === 'reviews' ? '#64B5F6' : 'transparent'
                }}
              >
                Reviews and Ratings
              </button>
              <button 
                onClick={() => setActiveTab('items')}
                className="px-4 py-1 text-sm font-medium ml-8 border-b-2 transition-colors"
                style={{
                  color: activeTab === 'items' ? '#64B5F6' : '#BABABA',
                  borderColor: activeTab === 'items' ? '#64B5F6' : 'transparent'
                }}
              >
                Seller Items
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-4 mt-8">
          
          {/* Reviews Content */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN - Reviews List */}
            <div className="lg:col-span-2">
              {/* Filter Dropdown */}
              <div className="relative mb-4 pb-3" ref={filterDropdownRef}>
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
              <div className="space-y-4">
                {/* Review 1 - Samine Herald */}
                <div className="pb-6">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Samine Herald</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[1,2,3,4,5].map((star) => (
                              <svg key={star} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm font-medium" style={{ color: '#939393' }}>5.0</span>
                        </div>
                        <span className="text-xs" style={{ color: '#939393' }}>Posted on 2 Jan 2025</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#B0B0B0' }}>
                    Outstanding quality! This product exceeded all my expectations. The white pepper has an amazing aroma and rich flavor that's perfect for my cooking. The packaging was beautiful and it arrived in perfect condition ahead of schedule.
                  </p>
                  
                  {/* Helpfulness Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs" style={{ color: '#212121' }}>Was this review helpful to you?</span>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setReviewHelpfulness(prev => ({ ...prev, review1: prev.review1 === 'yes' ? null : 'yes' }))}
                          className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full transition-colors"
                          style={{ 
                            border: '1px solid #E1E1E1',
                            color: '#6A6A6A',
                            backgroundColor: reviewHelpfulness.review1 === 'yes' ? '#F0F0F0' : 'white'
                          }}
                        >
                          <img src={likeIcon} alt="Like" className="w-3.5 h-3.5" />
                          <span className="text-xs">Yes</span>
                        </button>
                        <button 
                          onClick={() => setReviewHelpfulness(prev => ({ ...prev, review1: prev.review1 === 'no' ? null : 'no' }))}
                          className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full transition-colors"
                          style={{ 
                            border: '1px solid #E1E1E1',
                            color: '#6A6A6A',
                            backgroundColor: reviewHelpfulness.review1 === 'no' ? '#F0F0F0' : 'white'
                          }}
                        >
                          <img src={dislikeIcon} alt="Dislike" className="w-3.5 h-3.5" />
                          <span className="text-xs">No</span>
                        </button>
                      </div>
                    </div>
                    <button 
                      className="text-xs hover:underline"
                      style={{ color: '#64B5F6' }}
                    >
                      View the discussion (1)
                    </button>
                  </div>
                </div>

                {/* Review 2 - Kael Otto */}
                <div className="pb-6">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Kael Otto</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[1,2,3,4,5].map((star) => (
                              <svg key={star} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm font-medium" style={{ color: '#939393' }}>5.0</span>
                        </div>
                        <span className="text-xs" style={{ color: '#939393' }}>Posted on 12 Dec 2024</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#B0B0B0' }}>
                    Amazing product! The quality exceeded my expectations. The white pepper has such a distinct, mild heat that enhances every dish. Fast shipping and the item was exactly as described. Highly recommend for authentic African spices!
                  </p>
                  
                  {/* Helpfulness Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs" style={{ color: '#212121' }}>Was this review helpful to you?</span>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setReviewHelpfulness(prev => ({ ...prev, review2: prev.review2 === 'yes' ? null : 'yes' }))}
                          className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full transition-colors"
                          style={{ 
                            border: '1px solid #E1E1E1',
                            color: '#6A6A6A',
                            backgroundColor: reviewHelpfulness.review2 === 'yes' ? '#F0F0F0' : 'white'
                          }}
                        >
                          <img src={likeIcon} alt="Like" className="w-3.5 h-3.5" />
                          <span className="text-xs">Yes</span>
                        </button>
                        <button 
                          onClick={() => setReviewHelpfulness(prev => ({ ...prev, review2: prev.review2 === 'no' ? null : 'no' }))}
                          className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full transition-colors"
                          style={{ 
                            border: '1px solid #E1E1E1',
                            color: '#6A6A6A',
                            backgroundColor: reviewHelpfulness.review2 === 'no' ? '#F0F0F0' : 'white'
                          }}
                        >
                          <img src={dislikeIcon} alt="Dislike" className="w-3.5 h-3.5" />
                          <span className="text-xs">No</span>
                        </button>
                      </div>
                    </div>
                    <button 
                      className="text-xs hover:underline"
                      style={{ color: '#64B5F6' }}
                    >
                      View the discussion (3)
                    </button>
                  </div>
                </div>

                {/* Review 3 - Alex Johnson */}
                <div className="pb-6">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Alex Johnson</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
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
                          <span className="text-sm font-medium" style={{ color: '#939393' }}>2.1</span>
                        </div>
                        <span className="text-xs" style={{ color: '#939393' }}>Posted on 8 Nov 2024</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#B0B0B0' }}>
                    The product was okay, but not exactly what I expected. The flavor wasn't as strong as I hoped for and the quantity seemed less than advertised. Shipping took longer than anticipated. It's decent but there are better options available.
                  </p>
                  
                  {/* Helpfulness Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs" style={{ color: '#212121' }}>Was this review helpful to you?</span>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setReviewHelpfulness(prev => ({ ...prev, review3: prev.review3 === 'yes' ? null : 'yes' }))}
                          className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full transition-colors"
                          style={{ 
                            border: '1px solid #E1E1E1',
                            color: '#6A6A6A',
                            backgroundColor: reviewHelpfulness.review3 === 'yes' ? '#F0F0F0' : 'white'
                          }}
                        >
                          <img src={likeIcon} alt="Like" className="w-3.5 h-3.5" />
                          <span className="text-xs">Yes</span>
                        </button>
                        <button 
                          onClick={() => setReviewHelpfulness(prev => ({ ...prev, review3: prev.review3 === 'no' ? null : 'no' }))}
                          className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full transition-colors"
                          style={{ 
                            border: '1px solid #E1E1E1',
                            color: '#6A6A6A',
                            backgroundColor: reviewHelpfulness.review3 === 'no' ? '#F0F0F0' : 'white'
                          }}
                        >
                          <img src={dislikeIcon} alt="Dislike" className="w-3.5 h-3.5" />
                          <span className="text-xs">No</span>
                        </button>
                      </div>
                    </div>
                    <button 
                      className="text-xs hover:underline"
                      style={{ color: '#64B5F6' }}
                    >
                      View the discussion (2)
                    </button>
                  </div>
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
            <div className="lg:col-span-1">
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

              {/* Give Your Opinion Section */}
              <div className="pt-24 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Give your opinion</h3>
                <p className="text-xs mb-6" style={{ color: '#B0B0B0' }}>Share your opinion about this product and help others learn a bit more about it.</p>
                
                {/* Star Rating Input */}
                <div className="flex items-center justify-center space-x-1 mb-6">
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
                
                {/* Review Text Input */}
                <div className="flex items-start space-x-3 mb-4 pl-8">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <style dangerouslySetInnerHTML={{__html: `
                    .custom-placeholder::placeholder {
                      color: #D9D9D9;
                      opacity: 1;
                    }
                  `}} />
                  <textarea
                    value={userReviewText}
                    onChange={(e) => setUserReviewText(e.target.value)}
                    placeholder="What do you think of this product?"
                    className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none custom-placeholder"
                    style={{ 
                      border: 'none',
                      minHeight: '80px',
                      color: '#6A6A6A',
                      backgroundColor: 'transparent'
                    }}
                  />
                </div>
                
                {/* Post Review Button */}
                <div className="pl-8">
                  <button 
                    className="w-full py-2.5 rounded-lg font-medium transition-all mt-6"
                    style={{ 
                      backgroundColor: userRating > 0 ? '#FBBC05' : '#F4F4F4',
                      color: userRating > 0 ? 'white' : '#6A6A6A'
                    }}
                  >
                    Post the review
                  </button>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Seller Items Content */}
          {activeTab === 'items' && (
            <div>
              <h2 className="text-2xl font-medium text-gray-900 mb-6" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                {product.seller.name} items
              </h2>
              
              {/* Product Grid - Showing other products from this seller */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-5 md:gap-6">
                <p className="col-span-full text-center text-gray-500 py-8">
                  Other products from this seller will be displayed here
                </p>
              </div>
            </div>
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
              className="bg-white rounded-2xl shadow-xl relative max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
              style={{ padding: '32px 24px', marginTop: '40px' }}
            >
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
                Share this product with your loved ones
              </h3>

              {/* Description */}
              <p className="text-xs text-center mb-6" style={{ color: '#B0B0B0' }}>
                Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!
              </p>

              {/* Copy Link Section */}
              <div className="flex items-center gap-3 mb-6">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/product/${product.id}`}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium focus:outline-none"
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
                <p className="text-sm mb-4" style={{ color: '#6A6A6A' }}>Share to</p>
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
                    <img src={tgIcon} alt="Telegram" className="w-10 h-10" />
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

      {/* Add spacing before footer */}
      <div className="pb-32"></div>
    </div>
  );
};

export default ProductDetail;
