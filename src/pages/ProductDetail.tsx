import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Import product images
import mainImage from '../assets/images/logos/0.png'; // New main white pepper image
import africanTextileImage from '../assets/images/logos/Fashion.png';
import tomatoImage from '../assets/images/logos/Frame 29 (2).png';
import driedShrimpImage from '../assets/images/logos/Frame 29 (3).png';
import ndoleImage from '../assets/images/logos/Frame 29 (4).png';
import basketImage from '../assets/images/logos/culture.png';
import woodenCombImage from '../assets/images/logos/decor.png';
import whiteBeansImage from '../assets/images/logos/Frame 29 (1).png';
import cassavaFlourImage from '../assets/images/logos/Frame 29 (5).png';
import thumbnailImage1 from '../assets/images/logos/1.png';
import thumbnailImage2 from '../assets/images/logos/2.png';
import thumbnailImage3 from '../assets/images/logos/3.png';
import sellerAvatar from '../assets/images/logos/avatar.png';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [wishlistProducts, setWishlistProducts] = useState<Set<string>>(new Set());
  const [currentOtherProductsIndex, setCurrentOtherProductsIndex] = useState(0);
  const [currentRecommendedIndex, setCurrentRecommendedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [location, setLocation] = useState('');
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  // Product images array - main image first, then thumbnail images
  const images = [mainImage, thumbnailImage1, thumbnailImage2, thumbnailImage3];

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
      verified: true
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // In a real app, this would save to user's saved items
    console.log(isSaved ? 'Product removed from saved items' : 'Product saved to saved items');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // In a real app, this would update the user's liked items
    console.log(isLiked ? 'Product unliked' : 'Product liked');
  };

  const toggleAdditionalInfo = () => {
    setShowAdditionalInfo(!showAdditionalInfo);
  };

  const handleContactSeller = () => {
    console.log('Contact seller clicked');
    // TODO: Implement messaging functionality
  };

  const handleLikeProduct = (productId: string) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
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
    <div className="min-h-screen bg-white">
      {/* Desktop Search Section - Hidden on Mobile */}
      <section className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="flex-1 pl-4 pr-10 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="">All Categories</option>
              <option value="Food & Spices">Food & Spices</option>
              <option value="Fashion & Textiles">Fashion & Textiles</option>
              <option value="Beauty & Wellness">Beauty & Wellness</option>
              <option value="Home & Decor">Home & Decor</option>
              <option value="Books & Media">Books & Media</option>
            </select>
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button 
              onClick={handleSearch}
              className="text-white px-6 py-3 rounded-full transition-colors font-medium whitespace-nowrap"
              style={{backgroundColor: '#F9A825'}}
              onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Desktop Breadcrumb - Hidden on Mobile */}
      <div className="hidden lg:block bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center space-x-3 text-base text-gray-400">
            <Link to="/" className="hover:text-gray-600 font-medium">Home</Link>
            <span className="text-gray-300">/</span>
            <Link to="/" className="hover:text-gray-600 font-medium">Spices</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-semibold">Product-{product.id}</span>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex gap-12">
            <div className="flex gap-6">
              <div className="flex flex-col space-y-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="w-[500px] h-[500px] rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>

            {/* Desktop Right Column - Product Info */}
            <div className="flex-1 max-w-lg">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* Price with Published Date and Category */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-3xl font-bold text-gray-900">${product.price}</div>
                <div className="flex flex-col items-end space-y-1">
                  <span className="text-sm text-gray-500">{product.publishedDate}</span>
                  <span className="text-sm font-medium" style={{color: '#F9A825'}}>Category: {product.category}</span>
                </div>
              </div>
              
              {/* Location with Save and Like Buttons */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-600">{product.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleSave}
                    className={`p-2 rounded-full transition-colors ${
                      isSaved 
                        ? 'text-orange-500 bg-orange-50' 
                        : 'text-gray-400 hover:text-orange-500'
                    }`}
                    title={isSaved ? 'Remove from saved' : 'Save product'}
                  >
                    <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                  <button 
                    onClick={handleLike}
                    className={`p-2 rounded-full transition-colors ${
                      isLiked 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                    title={isLiked ? 'Unlike product' : 'Like product'}
                  >
                    <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Description - Reduced */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed mb-3">White pepper is a spice produced from the dried seed of the pepper plant. It consists of the seed only, with the darker-colored skin removed through a retting process.</p>
                <button 
                  onClick={toggleAdditionalInfo}
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center space-x-1"
                >
                  <span>Additional information</span>
                  <svg className={`w-4 h-4 transition-transform ${showAdditionalInfo ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Additional Information Section */}
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

              {/* Seller Info */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div className="text-sm font-medium text-gray-500 mb-3">Seller profile</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.seller.avatar}
                      alt={product.seller.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{product.seller.name}</div>
                    </div>
                  </div>
                  {product.seller.verified && (
                    <div className="flex items-center text-xs text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Verified Seller
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Seller Button - Below Seller Profile */}
              <button 
                onClick={handleContactSeller}
                className="w-full flex items-center justify-center space-x-2 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                style={{backgroundColor: '#F9A825'}}
                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span>Contact Seller</span>
              </button>
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
        <div className="bg-gray-50 rounded-lg p-4 mb-3">
          <div className="text-sm font-medium text-gray-500 mb-3">Seller profile</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={product.seller.avatar}
                alt={product.seller.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-medium text-gray-900">{product.seller.name}</div>
              </div>
            </div>
            {product.seller.verified && (
              <div className="flex items-center text-xs text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Verified Seller
              </div>
            )}
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
            <button className="px-6 py-3 text-gray-900 font-medium border-b-2 border-gray-900">
              Other seller products
            </button>
            <button className="px-6 py-3 text-gray-500 font-medium hover:text-gray-700">
              Reviews and ratings
            </button>
            {/* Carousel Navigation */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
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
            <div className="aspect-square bg-gray-100">
              <img src={africanTextileImage} alt="African Textiles" className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-900">$13.9</span>
                <div className="flex items-center text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Verified Seller
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">African Textiles</h3>
                  <p className="text-xs text-gray-500 flex items-center truncate">
                    <svg className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate">London | United Kingdom</span>
                  </p>
                </div>
                <div className="hidden lg:flex items-center space-x-2 ml-2 flex-shrink-0">
                  <button 
                    onClick={() => handleLikeProduct('textiles-1')}
                    className={`p-2 rounded-full transition-colors ${
                      likedProducts.has('textiles-1') 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                    title={likedProducts.has('textiles-1') ? 'Unlike product' : 'Like product'}
                  >
                    <svg className="w-4 h-4" fill={likedProducts.has('textiles-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
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
                    className={`p-2 rounded-full transition-colors ${
                      wishlistProducts.has('textiles-1') 
                        ? 'text-orange-500 bg-orange-50' 
                        : 'text-gray-400 hover:text-orange-500'
                    }`}
                    title={wishlistProducts.has('textiles-1') ? 'Remove from saved' : 'Save product'}
                  >
                    <svg className="w-4 h-4" fill={wishlistProducts.has('textiles-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product 2 - Fresh Tomatoes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-gray-100">
              <img src={tomatoImage} alt="Fresh Tomatoes" className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-900">$45</span>
                <div className="flex items-center text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Verified Seller
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">Fresh Tomatoes</h3>
                  <p className="text-xs text-gray-500 flex items-center truncate">
                    <svg className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate">London | United Kingdom</span>
                  </p>
                </div>
                <div className="hidden lg:flex items-center space-x-2 ml-2 flex-shrink-0">
                  <button 
                    onClick={() => handleLikeProduct('tomatoes-1')}
                    className={`p-2 rounded-full transition-colors ${
                      likedProducts.has('tomatoes-1') 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                    title={likedProducts.has('tomatoes-1') ? 'Unlike product' : 'Like product'}
                  >
                    <svg className="w-3 h-3" fill={likedProducts.has('tomatoes-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
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
                    className={`p-2 rounded-full transition-colors ${
                      wishlistProducts.has('tomatoes-1') 
                        ? 'text-orange-500 bg-orange-50' 
                        : 'text-gray-400 hover:text-orange-500'
                    }`}
                    title={wishlistProducts.has('tomatoes-1') ? 'Remove from saved' : 'Save product'}
                  >
                    <svg className="w-3 h-3" fill={wishlistProducts.has('tomatoes-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product 3 - Dried Shrimp */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-gray-100">
              <img src={driedShrimpImage} alt="Dried Shrimp" className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-900">$8.09</span>
                <div className="flex items-center text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Verified Seller
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">Dried Shrimp</h3>
                  <p className="text-xs text-gray-500 flex items-center truncate">
                    <svg className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate">London | United Kingdom</span>
                  </p>
                </div>
                <div className="hidden lg:flex items-center space-x-2 ml-2 flex-shrink-0">
                  <button 
                    onClick={() => handleLikeProduct('shrimp-1')}
                    className={`p-2 rounded-full transition-colors ${
                      likedProducts.has('shrimp-1') 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                    title={likedProducts.has('shrimp-1') ? 'Unlike product' : 'Like product'}
                  >
                    <svg className="w-3 h-3" fill={likedProducts.has('shrimp-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
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
                    className={`p-2 rounded-full transition-colors ${
                      wishlistProducts.has('shrimp-1') 
                        ? 'text-orange-500 bg-orange-50' 
                        : 'text-gray-400 hover:text-orange-500'
                    }`}
                    title={wishlistProducts.has('shrimp-1') ? 'Remove from saved' : 'Save product'}
                  >
                    <svg className="w-3 h-3" fill={wishlistProducts.has('shrimp-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product 4 - Ndolè Leaves */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-gray-100">
              <img src={ndoleImage} alt="Ndolè Leaves" className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-900">$11.5</span>
                <div className="flex items-center text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Verified Seller
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">Ndolè Leaves</h3>
                  <p className="text-xs text-gray-500 flex items-center truncate">
                    <svg className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate">London | United Kingdom</span>
                  </p>
                </div>
                <div className="hidden lg:flex items-center space-x-2 ml-2 flex-shrink-0">
                  <button 
                    onClick={() => handleLikeProduct('ndole-1')}
                    className={`p-2 rounded-full transition-colors ${
                      likedProducts.has('ndole-1') 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                    title={likedProducts.has('ndole-1') ? 'Unlike product' : 'Like product'}
                  >
                    <svg className="w-3 h-3" fill={likedProducts.has('ndole-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
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
                    className={`p-2 rounded-full transition-colors ${
                      wishlistProducts.has('ndole-1') 
                        ? 'text-orange-500 bg-orange-50' 
                        : 'text-gray-400 hover:text-orange-500'
                    }`}
                    title={wishlistProducts.has('ndole-1') ? 'Remove from saved' : 'Save product'}
                  >
                    <svg className="w-3 h-3" fill={wishlistProducts.has('ndole-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
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
          <h2 className="text-base lg:text-xl font-semibold text-gray-900">Articles that might interest you</h2>
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
            <div className="aspect-square bg-gray-100">
              <img src={basketImage} alt="Handwoven Basket" className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-900">$13.9</span>
                <div className="flex items-center text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Verified Seller
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">Handwoven Basket</h3>
                  <p className="text-xs text-gray-500 flex items-center truncate">
                    <svg className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate">London | United Kingdom</span>
                  </p>
                </div>
                <div className="hidden lg:flex items-center space-x-2 ml-2 flex-shrink-0">
                  <button 
                    onClick={() => handleLikeProduct('basket-1')}
                    className={`p-2 rounded-full transition-colors ${
                      likedProducts.has('basket-1') 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                    title={likedProducts.has('basket-1') ? 'Unlike product' : 'Like product'}
                  >
                    <svg className="w-3 h-3" fill={likedProducts.has('basket-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
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
                    className={`p-2 rounded-full transition-colors ${
                      wishlistProducts.has('basket-1') 
                        ? 'text-orange-500 bg-orange-50' 
                        : 'text-gray-400 hover:text-orange-500'
                    }`}
                    title={wishlistProducts.has('basket-1') ? 'Remove from saved' : 'Save product'}
                  >
                    <svg className="w-3 h-3" fill={wishlistProducts.has('basket-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product 2 - Wooden Combs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-gray-100">
              <img src={woodenCombImage} alt="Wooden Combs" className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-900">$45</span>
                <div className="flex items-center text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Verified Seller
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">Wooden Combs</h3>
                  <p className="text-xs text-gray-500 flex items-center truncate">
                    <svg className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate">London | United Kingdom</span>
                  </p>
                </div>
                <div className="hidden lg:flex items-center space-x-2 ml-2 flex-shrink-0">
                  <button 
                    onClick={() => handleLikeProduct('combs-1')}
                    className={`p-2 rounded-full transition-colors ${
                      likedProducts.has('combs-1') 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                    title={likedProducts.has('combs-1') ? 'Unlike product' : 'Like product'}
                  >
                    <svg className="w-3 h-3" fill={likedProducts.has('combs-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
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
                    className={`p-2 rounded-full transition-colors ${
                      wishlistProducts.has('combs-1') 
                        ? 'text-orange-500 bg-orange-50' 
                        : 'text-gray-400 hover:text-orange-500'
                    }`}
                    title={wishlistProducts.has('combs-1') ? 'Remove from saved' : 'Save product'}
                  >
                    <svg className="w-3 h-3" fill={wishlistProducts.has('combs-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product 3 - White Beans */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-gray-100">
              <img src={whiteBeansImage} alt="White Beans" className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-900">$8.09</span>
                <div className="flex items-center text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Verified Seller
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">White Beans</h3>
                  <p className="text-xs text-gray-500 flex items-center truncate">
                    <svg className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate">London | United Kingdom</span>
                  </p>
                </div>
                <div className="hidden lg:flex items-center space-x-2 ml-2 flex-shrink-0">
                  <button 
                    onClick={() => handleLikeProduct('beans-1')}
                    className={`p-2 rounded-full transition-colors ${
                      likedProducts.has('beans-1') 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                    title={likedProducts.has('beans-1') ? 'Unlike product' : 'Like product'}
                  >
                    <svg className="w-3 h-3" fill={likedProducts.has('beans-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
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
                    className={`p-2 rounded-full transition-colors ${
                      wishlistProducts.has('beans-1') 
                        ? 'text-orange-500 bg-orange-50' 
                        : 'text-gray-400 hover:text-orange-500'
                    }`}
                    title={wishlistProducts.has('beans-1') ? 'Remove from saved' : 'Save product'}
                  >
                    <svg className="w-3 h-3" fill={wishlistProducts.has('beans-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product 4 - Cassava Flour */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-gray-100">
              <img src={cassavaFlourImage} alt="Cassava Flour" className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-900">$11.5</span>
                <div className="flex items-center text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Verified Seller
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">Cassava Flour</h3>
                  <p className="text-xs text-gray-500 flex items-center truncate">
                    <svg className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate">London | United Kingdom</span>
                  </p>
                </div>
                <div className="hidden lg:flex items-center space-x-2 ml-2 flex-shrink-0">
                  <button 
                    onClick={() => handleLikeProduct('cassava-1')}
                    className={`p-2 rounded-full transition-colors ${
                      likedProducts.has('cassava-1') 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                    title={likedProducts.has('cassava-1') ? 'Unlike product' : 'Like product'}
                  >
                    <svg className="w-3 h-3" fill={likedProducts.has('cassava-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
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
                    className={`p-2 rounded-full transition-colors ${
                      wishlistProducts.has('cassava-1') 
                        ? 'text-orange-500 bg-orange-50' 
                        : 'text-gray-400 hover:text-orange-500'
                    }`}
                    title={wishlistProducts.has('cassava-1') ? 'Remove from saved' : 'Save product'}
                  >
                    <svg className="w-3 h-3" fill={wishlistProducts.has('cassava-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add spacing before footer */}
      <div className="pb-32"></div>
    </div>
  );
};

export default ProductDetail;
