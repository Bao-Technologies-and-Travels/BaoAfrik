import React, { useState } from 'react';
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
              className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity -ml-6"
              style={{ backgroundColor: '#F4F4F4' }}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="flex-1 max-w-xl">
              {/* Product Name and Posted Date */}
              <div className="flex items-center justify-between mb-1.5">
                <h1 className="font-normal flex-1" style={{ fontSize: '18px', color: '#939393' }}>
                  Ginger Essential Oil
                </h1>
                <span className="font-light ml-4" style={{ fontSize: '11px', color: '#6A6A6A' }}>
                  Posted 2 days ago
                </span>
              </div>

              {/* Price */}
              <div className="mb-8" style={{ fontSize: '28px', color: '#212121', fontWeight: 600, fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                USD 31.7
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 mb-8">
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
              <p className="font-light leading-relaxed mb-0.5 text-sm" style={{ color: '#B0B0B0' }}>
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
              <div className="flex items-center justify-between p-4 rounded-xl -ml-2">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden">
                    <img
                      src={product.seller.avatar}
                      alt={product.seller.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Seller Info */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-medium text-sm" style={{ color: '#212121' }}>
                        {product.seller.name}
                      </span>
                      {product.seller.verified ? (
                        <img src={verifyIcon} alt="Verified" className="w-3.5 h-3.5" />
                      ) : (
                        <img src={unverifyIcon} alt="Unverified" className="w-3.5 h-3.5" />
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors hover:opacity-80"
                  style={{ backgroundColor: '#F4F4F4', color: '#6A6A6A', fontSize: '12px', fontWeight: 500 }}
                >
                  <span>See seller profile</span>
                  <img src={spIcon} alt="Arrow" className="w-3 h-3" />
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

      {/* Other Seller Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          {/* Tab Navigation */}
          <div className="flex justify-center border-b border-gray-200 relative">
            <button className="px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base text-gray-900 font-medium border-b-2 border-gray-900">
              Other seller products
            </button>
            <button 
              onClick={() => navigate(`/seller/${product.seller.name.toLowerCase().replace(/\s+/g, '-')}?tab=reviews`)}
              className="px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base text-gray-500 font-medium hover:text-gray-700 transition-colors"
            >
              Reviews and ratings
            </button>
            {/* Carousel Navigation */}
            <div className="hidden lg:flex absolute right-0 top-1/2 transform -translate-y-1/2 items-center space-x-2">
              <button 
                onClick={handleOtherProductsPrev}
                className="p-2 rounded-full border border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={handleOtherProductsNext}
                className="p-2 rounded-full border border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
          {/* Product 1 - African Textiles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              <img src={africanTextileImage} alt="African Textiles" className="w-full h-full object-cover" />
              
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
                <div className="flex items-center text-xs text-green-600 px-0.5 sm:px-1 py-0.5 bg-green-50 rounded">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mr-0.5 sm:mr-1"></div>
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
              <img src={pre3} alt="Fresh Tomatoes" className="w-full h-full object-cover" />
              
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
                <span className="text-base font-semibold text-gray-900">$45</span>
                <div className="flex items-center text-xs text-green-600 px-0.5 sm:px-1 py-0.5 bg-green-50 rounded">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mr-0.5 sm:mr-1"></div>
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
              <img src={pre4} alt="Dried Shrimp" className="w-full h-full object-cover" />
              
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
                <span className="text-base font-semibold text-gray-900">$8.09</span>
                <div className="flex items-center text-xs text-green-600 px-0.5 sm:px-1 py-0.5 bg-green-50 rounded">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mr-0.5 sm:mr-1"></div>
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

          {/* Product 4 - Ndolè Leaves */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              <img src={pre5} alt="Ndolè Leaves" className="w-full h-full object-cover" />
              
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
                <span className="text-base font-semibold text-gray-900">$11.5</span>
                <div className="flex items-center text-xs text-green-600 px-0.5 sm:px-1 py-0.5 bg-green-50 rounded">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mr-0.5 sm:mr-1"></div>
                  <span className="text-xs sm:text-xs">Verified Seller</span>
                </div>
              </div>
              
              {/* Product Name */}
                  <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">Ndolè Leaves</h3>
              
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
        </div>
      </div>

      {/* Recommended Articles Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm lg:text-xl font-semibold text-gray-900">Articles that might interest you</h2>
          <div className="flex items-center space-x-1 lg:space-x-2">
            <button 
              onClick={handleRecommendedPrev}
              className="p-1 lg:p-2 rounded-full border border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
            >
              <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={handleRecommendedNext}
              className="p-1 lg:p-2 rounded-full border border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
            >
              <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {/* Product 1 - Handwoven Basket */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              <img src={basketImage} alt="Handwoven Basket" className="w-full h-full object-cover" />
              
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
                <span className="text-base font-semibold text-gray-900">$13.9</span>
                <div className="flex items-center text-xs text-green-600 px-0.5 sm:px-1 py-0.5 bg-green-50 rounded">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mr-0.5 sm:mr-1"></div>
                  <span className="text-xs sm:text-xs">Verified Seller</span>
                </div>
              </div>
              
              {/* Product Name */}
                  <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">Handwoven Basket</h3>
              
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
                      if (newSet.has('basket-1')) {
                        newSet.delete('basket-1');
                      } else {
                        newSet.add('basket-1');
                      }
                      setWishlistProducts(newSet);
                    }}
                    className={`p-2 transition-colors touch-manipulation ${
                      wishlistProducts.has('basket-1') 
                        ? 'text-orange-500 hover:text-orange-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={wishlistProducts.has('basket-1') ? 'Remove from saved' : 'Save product'}
                  >
                    <div className="relative">
                      <svg className="w-6 h-6" fill={wishlistProducts.has('basket-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                      {!wishlistProducts.has('basket-1') && (
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

          {/* Product 2 - Wooden Combs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              <img src={woodenCombImage} alt="Wooden Combs" className="w-full h-full object-cover" />
              
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
                <span className="text-base font-semibold text-gray-900">$45</span>
                <div className="flex items-center text-xs text-green-600 px-0.5 sm:px-1 py-0.5 bg-green-50 rounded">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mr-0.5 sm:mr-1"></div>
                  <span className="text-xs sm:text-xs">Verified Seller</span>
                </div>
              </div>
              
              {/* Product Name */}
                  <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">Wooden Combs</h3>
              
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
                      if (newSet.has('combs-1')) {
                        newSet.delete('combs-1');
                      } else {
                        newSet.add('combs-1');
                      }
                      setWishlistProducts(newSet);
                    }}
                    className={`p-2 transition-colors touch-manipulation ${
                      wishlistProducts.has('combs-1') 
                        ? 'text-orange-500 hover:text-orange-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={wishlistProducts.has('combs-1') ? 'Remove from saved' : 'Save product'}
                  >
                    <div className="relative">
                      <svg className="w-6 h-6" fill={wishlistProducts.has('combs-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                      {!wishlistProducts.has('combs-1') && (
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

          {/* Product 3 - White Beans */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              <img src={pre1} alt="White Beans" className="w-full h-full object-cover" />
              
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
                <span className="text-base font-semibold text-gray-900">$8.09</span>
                <div className="flex items-center text-xs text-green-600 px-0.5 sm:px-1 py-0.5 bg-green-50 rounded">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mr-0.5 sm:mr-1"></div>
                  <span className="text-xs sm:text-xs">Verified Seller</span>
                </div>
              </div>
              
              {/* Product Name */}
                  <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">White Beans</h3>
              
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
                      if (newSet.has('beans-1')) {
                        newSet.delete('beans-1');
                      } else {
                        newSet.add('beans-1');
                      }
                      setWishlistProducts(newSet);
                    }}
                    className={`p-2 transition-colors touch-manipulation ${
                      wishlistProducts.has('beans-1') 
                        ? 'text-orange-500 hover:text-orange-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={wishlistProducts.has('beans-1') ? 'Remove from saved' : 'Save product'}
                  >
                    <div className="relative">
                      <svg className="w-6 h-6" fill={wishlistProducts.has('beans-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                      {!wishlistProducts.has('beans-1') && (
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

          {/* Product 4 - Cassava Flour */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              <img src={pre6} alt="Cassava Flour" className="w-full h-full object-cover" />
              
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
                <span className="text-base font-semibold text-gray-900">$11.5</span>
                <div className="flex items-center text-xs text-green-600 px-0.5 sm:px-1 py-0.5 bg-green-50 rounded">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mr-0.5 sm:mr-1"></div>
                  <span className="text-xs sm:text-xs">Verified Seller</span>
                </div>
              </div>
              
              {/* Product Name */}
                  <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">Cassava Flour</h3>
              
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
                      if (newSet.has('cassava-1')) {
                        newSet.delete('cassava-1');
                      } else {
                        newSet.add('cassava-1');
                      }
                      setWishlistProducts(newSet);
                    }}
                    className={`p-2 transition-colors touch-manipulation ${
                      wishlistProducts.has('cassava-1') 
                        ? 'text-orange-500 hover:text-orange-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={wishlistProducts.has('cassava-1') ? 'Remove from saved' : 'Save product'}
                  >
                    <div className="relative">
                      <svg className="w-6 h-6" fill={wishlistProducts.has('cassava-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                      {!wishlistProducts.has('cassava-1') && (
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
              {/* Product Image - Half Outside Modal */}
              <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '-40px' }}>
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  <img
                    src={images[selectedImageIndex]}
                    alt={product.name}
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
                Share this product with your loved ones
              </h3>

              {/* Description */}
              <p className="text-xs text-center mb-6" style={{ color: '#B0B0B0' }}>
                Spread the joy! This innovative product is sure to bring smiles to your friends and family. Share the excitement today!
              </p>

              {/* Link Field with Copy Button */}
              <div className="flex items-center space-x-2 mb-6">
                <input
                  type="text"
                  value={`baoafrik.com/product-id?`}
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

      {/* Add spacing before footer */}
      <div className="pb-32"></div>
    </div>
  );
};

export default ProductDetail;
