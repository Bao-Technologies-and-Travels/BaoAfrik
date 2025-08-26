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
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [wishlistProducts, setWishlistProducts] = useState<Set<string>>(new Set());
  const [currentOtherProductsIndex, setCurrentOtherProductsIndex] = useState(0);
  const [currentRecommendedIndex, setCurrentRecommendedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [location, setLocation] = useState('');

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
    description: 'White pepper is a spice produced from the dried seed of the pepper plant Piper nigrum. It is native to Kerala, an Indian state formerly known as the Malabar Coast. White pepper consists of the seed of the pepper fruit only, with the darker-colored skin of the pepper fruit removed. This is usually accomplished by a process known as retting, where fully ripe red pepper berries are soaked in water for about a week, during which the flesh of the pepper softens and decomposes.',
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
  };

  const handleContactSeller = () => {
    console.log('Contact seller clicked');
    // TODO: Implement messaging functionality
  };

  const handleLike = (productId: string) => {
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
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <section className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 sm:px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-sm sm:text-base"
            >
              <option value="">All Categories</option>
              <option value="Food & Spices">Food & Spices</option>
              <option value="Fashion & Textiles">Fashion & Textiles</option>
              <option value="Beauty & Wellness">Beauty & Wellness</option>
              <option value="Home & Decor">Home & Decor</option>
              <option value="Books & Media">Books & Media</option>
            </select>
            
            {/* Location Input */}
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-3 sm:px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
            />
            
            {/* Search Button */}
            <button 
              onClick={handleSearch}
              className="text-white px-4 sm:px-6 py-3 rounded-full transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
              style={{backgroundColor: '#F9A825'}}
              onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white py-8 mt-4">
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex gap-12">
          {/* Left Column - Vertical Thumbnails + Main Image */}
          <div className="flex gap-6">
            {/* Vertical Thumbnails */}
            <div className="flex flex-col space-y-4">
              {images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-24 h-24 rounded-lg border-2 overflow-hidden transition-colors ${
                    index === selectedImageIndex
                      ? 'border-yellow-500'
                      : 'border-gray-200 hover:border-gray-300'
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

            {/* Main Image */}
            <div className="relative">
              <div className="w-[500px] h-[500px] bg-white rounded-lg overflow-hidden">
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Image indicators dots */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {images.map((_: string, index: number) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === selectedImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="flex-1 space-y-6">
            {/* Price and Product Name */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">${product.price}</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">{product.name}</h2>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>{product.location}</span>
                </div>
              </div>
              
              {/* Top Right - Published Date, Category, and Action Buttons */}
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">{product.publishedDate}</div>
                <div className="text-sm mb-4" style={{color: '#F9A825'}}>Category: {product.category}</div>
                
                {/* Save and Share buttons */}
                <div className="flex items-center justify-end space-x-3">
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Share product"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleSave}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title={isSaved ? 'Remove from saved' : 'Save product'}
                  >
                    <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed mb-3">{product.description}</p>
              <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                Additional information
              </button>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
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

            {/* Contact Seller Button */}
            <button
              onClick={handleContactSeller}
              className="w-full text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
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
        </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Product 1 - African Textiles */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
            <div className="aspect-square bg-gray-100">
              <img src={africanTextileImage} alt="African Textiles" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-900">$13.9</span>
                <div className="flex items-center text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Verified Seller
                </div>
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900">African Textiles</h3>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleLike('african-textiles-1')}
                    className={`p-1 transition-colors ${likedProducts.has('african-textiles-1') ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <svg className="w-4 h-4" fill={likedProducts.has('african-textiles-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleWishlist('african-textiles-1')}
                    className={`p-1 transition-colors ${wishlistProducts.has('african-textiles-1') ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <svg className="w-4 h-4" fill={wishlistProducts.has('african-textiles-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3 flex items-center">
                <svg className="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                London | United Kingdom
              </p>
            </div>
          </div>

          {/* Product 2 - Fresh Tomatoes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
            <div className="aspect-square bg-gray-100">
              <img src={tomatoImage} alt="Fresh Tomatoes" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-900">$45</span>
                <div className="flex items-center text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Verified Seller
                </div>
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900">Fresh Tomatoes</h3>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleLike('fresh-tomatoes-1')}
                    className={`p-1 transition-colors ${likedProducts.has('fresh-tomatoes-1') ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <svg className="w-4 h-4" fill={likedProducts.has('fresh-tomatoes-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleWishlist('fresh-tomatoes-1')}
                    className={`p-1 transition-colors ${wishlistProducts.has('fresh-tomatoes-1') ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <svg className="w-4 h-4" fill={wishlistProducts.has('fresh-tomatoes-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3 flex items-center">
                <svg className="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                London | United Kingdom
              </p>
            </div>
          </div>

          {/* Product 3 - Dried Shrimp */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
            <div className="aspect-square bg-gray-100">
              <img src={driedShrimpImage} alt="Dried Shrimp" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-900">$8.09</span>
                <div className="flex items-center text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Verified Seller
                </div>
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900">Dried Shrimp</h3>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleLike('dried-shrimp-1')}
                    className={`p-1 transition-colors ${likedProducts.has('dried-shrimp-1') ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <svg className="w-4 h-4" fill={likedProducts.has('dried-shrimp-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleWishlist('dried-shrimp-1')}
                    className={`p-1 transition-colors ${wishlistProducts.has('dried-shrimp-1') ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <svg className="w-4 h-4" fill={wishlistProducts.has('dried-shrimp-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3 flex items-center">
                <svg className="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                London | United Kingdom
              </p>
            </div>
          </div>

          {/* Product 4 - Ndolè Leaves */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
            <div className="aspect-square bg-gray-100">
              <img src={ndoleImage} alt="Ndolè Leaves" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-900">$11.5</span>
                <div className="flex items-center text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Verified Seller
                </div>
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900">Ndolè Leaves</h3>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleLike('ndole-leaves-1')}
                    className={`p-1 transition-colors ${likedProducts.has('ndole-leaves-1') ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <svg className="w-4 h-4" fill={likedProducts.has('ndole-leaves-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleWishlist('ndole-leaves-1')}
                    className={`p-1 transition-colors ${wishlistProducts.has('ndole-leaves-1') ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <svg className="w-4 h-4" fill={wishlistProducts.has('ndole-leaves-1') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3 flex items-center">
                <svg className="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                London | United Kingdom
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Articles Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Articles that might interest you</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleRecommendedPrev}
              className="p-2 rounded-full border border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={handleRecommendedNext}
              className="p-2 rounded-full border border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Product 1 - Handwoven Basket */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
            <div className="aspect-square bg-gray-100">
              <img src={basketImage} alt="Handwoven Basket" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-900">$13.9</span>
                <div className="flex items-center text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Verified Seller
                </div>
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900">Handwoven Basket</h3>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleLike('handwoven-basket-2')}
                    className={`p-1 transition-colors ${likedProducts.has('handwoven-basket-2') ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <svg className="w-4 h-4" fill={likedProducts.has('handwoven-basket-2') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleWishlist('handwoven-basket-2')}
                    className={`p-1 transition-colors ${wishlistProducts.has('handwoven-basket-2') ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <svg className="w-4 h-4" fill={wishlistProducts.has('handwoven-basket-2') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3 flex items-center">
                <svg className="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                London | United Kingdom
              </p>
            </div>
          </div>

          {/* Product 2 - Wooden Combs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
            <div className="aspect-square bg-gray-100">
              <img src={woodenCombImage} alt="Wooden Combs" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-900">$45</span>
                <div className="flex items-center text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Verified Seller
                </div>
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900">Wooden Combs</h3>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleLike('wooden-combs-2')}
                    className={`p-1 transition-colors ${likedProducts.has('wooden-combs-2') ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <svg className="w-4 h-4" fill={likedProducts.has('wooden-combs-2') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleWishlist('wooden-combs-2')}
                    className={`p-1 transition-colors ${wishlistProducts.has('wooden-combs-2') ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <svg className="w-4 h-4" fill={wishlistProducts.has('wooden-combs-2') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3 flex items-center">
                <svg className="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                London | United Kingdom
              </p>
            </div>
          </div>

          {/* Product 3 - White Beans */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
            <div className="aspect-square bg-gray-100">
              <img src={whiteBeansImage} alt="White Beans" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-900">$8.09</span>
                <div className="flex items-center text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Verified Seller
                </div>
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900">White Beans</h3>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleLike('white-beans-2')}
                    className={`p-1 transition-colors ${likedProducts.has('white-beans-2') ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <svg className="w-4 h-4" fill={likedProducts.has('white-beans-2') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleWishlist('white-beans-2')}
                    className={`p-1 transition-colors ${wishlistProducts.has('white-beans-2') ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <svg className="w-4 h-4" fill={wishlistProducts.has('white-beans-2') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3 flex items-center">
                <svg className="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                London | United Kingdom
              </p>
            </div>
          </div>

          {/* Product 4 - Cassava Flour */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
            <div className="aspect-square bg-gray-100">
              <img src={cassavaFlourImage} alt="Cassava Flour" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-900">$11.5</span>
                <div className="flex items-center text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Verified Seller
                </div>
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900">Cassava Flour</h3>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleLike('cassava-flour-2')}
                    className={`p-1 transition-colors ${likedProducts.has('cassava-flour-2') ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <svg className="w-4 h-4" fill={likedProducts.has('cassava-flour-2') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleWishlist('cassava-flour-2')}
                    className={`p-1 transition-colors ${wishlistProducts.has('cassava-flour-2') ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <svg className="w-4 h-4" fill={wishlistProducts.has('cassava-flour-2') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3 flex items-center">
                <svg className="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                London | United Kingdom
              </p>
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
