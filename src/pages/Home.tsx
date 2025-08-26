import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import product images
import whiteBeans from '../assets/images/logos/Frame 29.png';
import gingembre from '../assets/images/logos/Frame 29 (1).png';
import tomates from '../assets/images/logos/Frame 29 (2).png';
import spaghetti from '../assets/images/logos/Frame 29 (3).png';
import ndole from '../assets/images/logos/Frame 29 (4).png';
import poivreBlanc from '../assets/images/logos/Frame 29 (5).png';

// Import banner images
import cameroonianFashion from '../assets/images/logos/Fashion.png'; // Traditional Kente fabrics
import cameroonianDecor from '../assets/images/logos/decor.png'; // Wooden combs
import cameroonianCulture from '../assets/images/logos/culture.png'; // Traditional woven bag

// Import scan icon
import scanIcon from '../assets/images/logos/scanner (1).png';

// Fashion & Textiles images
import fashion1 from '../assets/images/logos/Frame 29 (6).png';
import fashion2 from '../assets/images/logos/Frame 29 (7).png';
import fashion3 from '../assets/images/logos/Frame 29 (8).png';
import fashion4 from '../assets/images/logos/Frame 29 (9).png';
import fashion5 from '../assets/images/logos/Frame 29 (10).png';
import fashion6 from '../assets/images/logos/Frame 29 (11).png';

// Beauty & Wellness images
import beauty1 from '../assets/images/logos/Frame 29 (12).png';
import beauty2 from '../assets/images/logos/Frame 29 (13).png';
import beauty3 from '../assets/images/logos/Frame 29 (14).png';
import beauty4 from '../assets/images/logos/Frame 29 (15).png';
import beauty5 from '../assets/images/logos/Frame 29 (16).png';
import beauty6 from '../assets/images/logos/Frame 29 (1).png';

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [originLocation, setOriginLocation] = useState('');
  const [location, setLocation] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());
  const [savedProducts, setSavedProducts] = useState<Set<number>>(new Set());
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');

  // Banner slides data
  const bannerSlides = [
    {
      id: 1,
      title: "Cameroonian Spices & Sauces",
      description: "Discover our authentic spices from Cameroon",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
      category: "Food & Spices"
    },
    {
      id: 2,
      title: "Cameroonian Fashion",
      description: "Beautiful traditional Kente and African fabrics",
      image: cameroonianFashion, // Traditional fabrics image
      category: "Fashion & Textiles"
    },
    {
      id: 3,
      title: "Cameroonian Decor",
      description: "Handcrafted wooden combs and traditional accessories",
      image: cameroonianDecor, // Wooden combs image
      category: "Home & Decor"
    },
    {
      id: 4,
      title: "Cameroonian Culture",
      description: "Traditional woven bags and cultural crafts",
      image: cameroonianCulture, // Traditional woven bag image
      category: "Books & Media"
    }
  ];

  const categories = ['All', 'Food & Spices', 'Fashion & Textiles', 'Beauty & Wellness', 'Home & Decor', 'Books & Media'];

  const africanCountries = [
    { name: 'Cameroon', code: 'cm', flag: 'https://flagcdn.com/w20/cm.png' },
    { name: 'Nigeria', code: 'ng', flag: 'https://flagcdn.com/w20/ng.png' }, 
    { name: 'Ivory Coast', code: 'ci', flag: 'https://flagcdn.com/w20/ci.png' },
    { name: 'Gabon', code: 'ga', flag: 'https://flagcdn.com/w20/ga.png' },
    { name: 'Equatorial Guinea', code: 'gq', flag: 'https://flagcdn.com/w20/gq.png' },
    { name: 'Chad', code: 'td', flag: 'https://flagcdn.com/w20/td.png' },
    { name: 'Ghana', code: 'gh', flag: 'https://flagcdn.com/w20/gh.png' }
  ];

  // All products data organized by category
  const allProducts = {
    'Food & Spices': [
      {
        id: 1,
        name: "Poivre blanc",
        price: "31.7",
        image: whiteBeans,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 2,
        name: "Gingembre",
        price: "13.9",
        image: gingembre,
        location: "London | United Kingdom", 
        verified: true
      },
      {
        id: 3,
        name: "Tomates",
        price: "45",
        image: tomates,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 4,
        name: "Crevettes",
        price: "8.09",
        image: spaghetti,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 5,
        name: "Ndole",
        price: "11.5",
        image: ndole,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 6,
        name: "Poivre blanc",
        price: "15.3",
        image: poivreBlanc,
        location: "London | United Kingdom",
        verified: true
      }
    ],
    'Fashion & Textiles': [
      {
        id: 7,
        name: "Kente Fabric Roll",
        price: "232",
        image: fashion1,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 8,
        name: "Traditional Ankara",
        price: "34.7",
        image: fashion2,
        location: "London | United Kingdom", 
        verified: true
      },
      {
        id: 9,
        name: "Wax Print Fabric",
        price: "90.1",
        image: fashion3,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 10,
        name: "Bogolan Mud Cloth",
        price: "245",
        image: fashion4,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 11,
        name: "Dashiki Shirt",
        price: "110.9",
        image: fashion5,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 12,
        name: "African Print Dress",
        price: "68.7",
        image: fashion6,
        location: "London | United Kingdom",
        verified: true
      }
    ],
    'Beauty & Wellness': [
      {
        id: 13,
        name: "Shea Butter Cream",
        price: "31.7",
        image: beauty1,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 14,
        name: "African Black Soap",
        price: "31.7",
        image: beauty2,
        location: "London | United Kingdom", 
        verified: true
      },
      {
        id: 15,
        name: "Baobab Oil Serum",
        price: "31.7",
        image: beauty3,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 16,
        name: "Moringa Face Mask",
        price: "31.7",
        image: beauty4,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 17,
        name: "Argan Hair Oil",
        price: "31.7",
        image: beauty5,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 18,
        name: "Poivre blanc",
        price: "31.7",
        image: beauty6,
        location: "London | United Kingdom",
        verified: true
      }
    ]
  };

  // Get all products as flat array for searching
  const getAllProducts = () => {
    return Object.values(allProducts).flat();
  };

  // Search functionality
  const filteredProducts = () => {
    let products = [];
    
    if (selectedCategory && allProducts[selectedCategory as keyof typeof allProducts]) {
      products = allProducts[selectedCategory as keyof typeof allProducts];
    } else {
      // Get all products from all categories
      products = Object.values(allProducts).flat();
    }

    // Apply search filter if there's a search query
    if (searchQuery.trim()) {
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply country filter if a specific country is selected
    if (selectedCountry) {
      const countryName = africanCountries.find(country => country.code === selectedCountry)?.name;
      if (countryName) {
        products = products.filter(product => 
          product.location.toLowerCase().includes(countryName.toLowerCase())
        );
      }
    }

    return products;
  };

  // Get filtered products based on active category or search results
  const getFilteredProducts = () => {
    if (isSearchActive) {
      return searchResults;
    }
    
    if (activeCategory === 'All') {
      return Object.values(allProducts).flat();
    }
    return allProducts[activeCategory as keyof typeof allProducts] || [];
  };

  // Get products to display
  const getProductsToDisplay = () => {
    if (isSearchActive) {
      return searchResults;
    }
    
    // Use activeCategory for filtering
    let products = [];
    if (activeCategory === 'All') {
      products = Object.values(allProducts).flat();
    } else {
      products = allProducts[activeCategory as keyof typeof allProducts] || [];
    }
    
    // Apply country filter if selected
    if (selectedCountry) {
      const countryName = africanCountries.find(country => country.code === selectedCountry)?.name;
      if (countryName) {
        products = products.filter(product => 
          product.location.toLowerCase().includes(countryName.toLowerCase())
        );
      }
    }
    
    return products;
  };

  // Clear search and return to category view
  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setOriginLocation('');
    setLocation('');
    setSearchResults([]);
    setIsSearchActive(false);
  };

  // Auto-slide functionality
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === bannerSlides.length - 1 ? 0 : prevSlide + 1
      );
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(slideInterval);
  }, [bannerSlides.length]);

  // Handle search functionality
  const handleSearch = () => {
    console.log('Search triggered');
  };

  // Handle Enter key press in search input
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle scan functionality
  const handleScan = () => {
    console.log('Scan functionality triggered');
    // Here you would typically open camera or barcode scanner
    alert('Scan functionality would open camera/barcode scanner');
  };

  // Handle like functionality
  const handleLike = (productId: number) => {
    setLikedProducts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(productId)) {
        newLiked.delete(productId);
        console.log(`Unliked product ${productId}`);
      } else {
        newLiked.add(productId);
        console.log(`Liked product ${productId}`);
      }
      return newLiked;
    });
  };

  // Handle save functionality
  const handleSave = (productId: number) => {
    setSavedProducts(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(productId)) {
        newSaved.delete(productId);
        console.log(`Unsaved product ${productId}`);
      } else {
        newSaved.add(productId);
        console.log(`Saved product ${productId}`);
      }
      return newSaved;
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isFilterDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest('.filter-dropdown')) {
          setIsFilterDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterDropdownOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <section className="bg-white shadow-sm border-b border-gray-200 mt-4 sm:mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Desktop Search */}
          <div className="hidden md:flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-4">
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
            
            {/* Mobile: Two columns for dropdowns and inputs */}
            <div className="grid grid-cols-2 gap-3 lg:contents">
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
                placeholder="Place of origin"
                value={originLocation}
                onChange={(e) => setOriginLocation(e.target.value)}
                className="px-3 sm:px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            {/* Mobile: Second row for location and buttons */}
            <div className="flex gap-3 lg:contents">
              {/* Location Input */}
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 lg:flex-none px-3 sm:px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
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
              
              {/* Scan Button */}
              <button 
                onClick={handleScan}
                className="p-3 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full transition-colors flex-shrink-0 hover:border-orange-500 hover:text-orange-500"
                title="Scan QR code"
              >
                <img 
                  src={scanIcon} 
                  alt="Scan QR code" 
                  className="w-4 h-4 sm:w-5 sm:h-5 opacity-60 hover:opacity-100 transition-opacity"
                />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden">
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
                <button 
                  onClick={handleScan}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 hover:opacity-70 transition-opacity"
                  title="Scan image to search"
                >
                  <img 
                    src={scanIcon} 
                    alt="Scan" 
                    className="w-4 h-4 opacity-60 hover:opacity-100 transition-opacity"
                  />
                </button>
              </div>
              
              {/* Filter Button */}
              <button 
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="p-3 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full transition-colors flex-shrink-0 hover:border-orange-500 hover:text-orange-500 relative"
                title="Filter options"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            </div>
            
            
            {/* Mobile Filter Dropdown */}
            {isMobileFilterOpen && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-3">
                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-sm"
                    >
                      <option value="">All Categories</option>
                      <option value="Food & Spices">Food & Spices</option>
                      <option value="Fashion & Textiles">Fashion & Textiles</option>
                      <option value="Beauty & Wellness">Beauty & Wellness</option>
                      <option value="Home & Decor">Home & Decor</option>
                      <option value="Books & Media">Books & Media</option>
                    </select>
                  </div>
                  
                  {/* Place of Origin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Place of Origin</label>
                    <input
                      type="text"
                      placeholder="Place of origin"
                      value={originLocation}
                      onChange={(e) => setOriginLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>
                  
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => {
                        handleSearch();
                        setIsMobileFilterOpen(false);
                      }}
                      className="flex-1 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors"
                      style={{backgroundColor: '#F9A825'}}
                      onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'}
                      onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}
                    >
                      Search
                    </button>
                    <button 
                      onClick={handleScan}
                      className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg transition-colors hover:border-orange-500 hover:text-orange-500"
                      title="Scan QR code"
                    >
                      <img 
                        src={scanIcon} 
                        alt="Scan QR code" 
                        className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Hero Banner - Auto Sliding */}
      <section className="text-white relative overflow-hidden mt-4 sm:mt-6" style={{background: 'linear-gradient(to right, #F9A822, #E55325)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-0">
            <div className="flex-1 text-center md:text-left px-2 md:pl-2 w-full md:w-auto">
              <div className="bg-white bg-opacity-20 rounded-lg px-2 sm:px-3 py-1 inline-block mb-2 sm:mb-3">
                <span className="text-xs font-medium">Featured</span>
              </div>
              <div className="relative overflow-hidden min-h-[2rem] sm:min-h-[2.5rem] md:min-h-[3rem]">
                <h1 
                  key={`title-${currentSlide}`}
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 animate-fade-in-up leading-tight"
                >
                  {bannerSlides[currentSlide].title}
                </h1>
              </div>
              <div className="relative overflow-hidden min-h-[1.5rem] sm:min-h-[2rem]">
                <p 
                  key={`desc-${currentSlide}`}
                  className="text-orange-100 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 animate-fade-in-up animation-delay-100 leading-relaxed"
                >
                  {bannerSlides[currentSlide].description}
                </p>
              </div>
              <button 
                onClick={() => setActiveCategory(bannerSlides[currentSlide].category)}
                className="bg-white text-orange-600 px-3 sm:px-4 md:px-5 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 touch-manipulation"
              >
                Explore {bannerSlides[currentSlide].category}
              </button>
            </div>
            <div className="block md:hidden w-full px-2 sm:px-4">
              <div className="relative overflow-hidden rounded-lg aspect-[16/9] sm:aspect-[2/1]">
                <img 
                  key={`img-mobile-${currentSlide}`}
                  src={bannerSlides[currentSlide].image}
                  alt={bannerSlides[currentSlide].title}
                  className="w-full h-full object-cover shadow-lg animate-slide-in-right"
                  loading="eager"
                  width="400"
                  height="200"
                />
              </div>
            </div>
            <div className="hidden md:block pr-2 relative flex-shrink-0">
              <div className="relative overflow-hidden rounded-lg">
                <img 
                  key={`img-${currentSlide}`}
                  src={bannerSlides[currentSlide].image}
                  alt={bannerSlides[currentSlide].title}
                  className="w-64 lg:w-80 h-40 lg:h-48 object-cover shadow-lg animate-slide-in-right"
                  loading="eager"
                  width="320"
                  height="192"
                />
              </div>
            </div>
          </div>
          
          {/* Slide Indicators */}
          <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white w-4 sm:w-6' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="bg-white border-b border-gray-200 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setIsSearchActive(false);
                  setSearchQuery('');
                }}
                className={`whitespace-nowrap pb-3 sm:pb-4 px-1 border-b-2 font-medium text-sm sm:text-lg transition-colors flex-shrink-0 ${
                  activeCategory === category
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Filter Button - Desktop Only */}
          <div className="mt-4 relative filter-dropdown hidden md:block">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="text-sm font-medium">Filter : {selectedCountry || 'Africa'}</span>
              <svg className={`w-4 h-4 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {isFilterDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setSelectedCountry('');
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      !selectedCountry ? 'text-orange-600 bg-orange-50' : 'text-gray-700'
                    }`}
                  >
                    <span>All Africa</span>
                  </button>
                  {africanCountries.map((country) => (
                    <button
                      key={country.name}
                      onClick={() => {
                        setSelectedCountry(country.name);
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        selectedCountry === country.name ? 'text-orange-600 bg-orange-50' : 'text-gray-700'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <img 
                          src={country.flag} 
                          alt={`${country.name} flag`}
                          className="w-5 h-4 object-cover rounded-sm"
                        />
                        <span>{country.name}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filtered Products Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Country Filter Buttons - Above Products */}
          <div className="md:hidden mb-4 sm:mb-6">
            <div className="overflow-x-auto">
              <div className="flex gap-2 pb-2 min-w-max px-1">
                {/* All Africa Button */}
                <button
                  onClick={() => setSelectedCountry('')}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-full whitespace-nowrap text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
                    selectedCountry === '' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Afrique</span>
                </button>
                
                {/* Country Buttons */}
                {africanCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => setSelectedCountry(country.code)}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-full whitespace-nowrap text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
                      selectedCountry === country.code 
                        ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <img 
                      src={country.flag} 
                      alt={`${country.name} flag`} 
                      className="w-3 h-2 sm:w-4 sm:h-3 object-cover rounded-sm flex-shrink-0"
                      loading="lazy"
                      width="16"
                      height="12"
                    />
                    <span>{country.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {isSearchActive 
                  ? `Search Results (${filteredProducts().length} found)` 
                  : activeCategory === 'All' ? 'All Products' : activeCategory
                }
              </h2>
              {isSearchActive && (
                <button
                  onClick={clearSearch}
                  className="ml-3 text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Clear Search
                </button>
              )}
              <svg className="w-5 h-5 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts().length === 0 && isSearchActive ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or browse our categories.</p>
              <div className="mt-6">
                <button
                  onClick={clearSearch}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                >
                  Browse All Products
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {getProductsToDisplay().map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 block group">
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                    width="200"
                    height="200"
                  />
                </div>
                <div className="p-2 sm:p-3">
                  <div className="text-sm sm:text-lg font-bold text-gray-900 mb-1">
                    ${product.price}
                  </div>
                  <h3 className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{product.location}</span>
                  </div>
                  {product.verified && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-green-600 bg-green-50 px-1 sm:px-2 py-1 rounded">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        <span className="hidden sm:inline">Verified seller</span>
                        <span className="sm:hidden">Verified</span>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        {/* Save Button */}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSave(product.id);
                          }}
                          className={`p-1 transition-colors touch-manipulation ${
                            savedProducts.has(product.id) 
                              ? 'text-orange-500 hover:text-orange-600' 
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title={savedProducts.has(product.id) ? 'Remove from saved' : 'Save product'}
                        >
                          <svg className="w-4 h-4" fill={savedProducts.has(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                        
                        {/* Like Button */}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleLike(product.id);
                          }}
                          className={`p-1 transition-colors touch-manipulation ${
                            likedProducts.has(product.id) 
                              ? 'text-red-500 hover:text-red-600' 
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title={likedProducts.has(product.id) ? 'Unlike product' : 'Like product'}
                        >
                          <svg className="w-4 h-4" fill={likedProducts.has(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pagination - Mobile Responsive */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Pagination */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-4">
              <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <span className="text-sm text-gray-600 font-medium">Page 1 of 48</span>
              <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Next
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="flex justify-center">
              <div className="flex space-x-1 overflow-x-auto pb-2">
                {[1, 2, 3, '...', 48].map((page, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                      page === 1
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Desktop Pagination */}
          <div className="hidden md:flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-base text-black hover:text-gray-700 font-medium transition-colors">
                Previous
              </button>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, '...', 48].map((page, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 text-base rounded-lg font-medium transition-colors ${
                      page === 1
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button className="px-4 py-2 text-base text-black hover:text-gray-700 font-medium transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
