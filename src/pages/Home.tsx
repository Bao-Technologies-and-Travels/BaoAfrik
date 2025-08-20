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
        name: "Poivre blanc",
        price: "232",
        image: fashion1,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 8,
        name: "Poivre blanc",
        price: "34.7",
        image: fashion2,
        location: "London | United Kingdom", 
        verified: true
      },
      {
        id: 9,
        name: "Poivre blanc",
        price: "90.1",
        image: fashion3,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 10,
        name: "Poivre blanc",
        price: "245",
        image: fashion4,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 11,
        name: "Poivre blanc",
        price: "110.9",
        image: fashion5,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 12,
        name: "Poivre blanc",
        price: "68.7",
        image: fashion6,
        location: "London | United Kingdom",
        verified: true
      }
    ],
    'Beauty & Wellness': [
      {
        id: 13,
        name: "Poivre blanc",
        price: "31.7",
        image: beauty1,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 14,
        name: "Poivre blanc",
        price: "31.7",
        image: beauty2,
        location: "London | United Kingdom", 
        verified: true
      },
      {
        id: 15,
        name: "Poivre blanc",
        price: "31.7",
        image: beauty3,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 16,
        name: "Poivre blanc",
        price: "31.7",
        image: beauty4,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 17,
        name: "Poivre blanc",
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

  // Get filtered products based on active category
  const getFilteredProducts = () => {
    if (activeCategory === 'All') {
      return Object.values(allProducts).flat();
    }
    return allProducts[activeCategory as keyof typeof allProducts] || [];
  };

  const filteredProducts = getFilteredProducts();

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
    console.log('Search triggered with:', {
      searchQuery,
      selectedCategory,
      originLocation,
      location
    });
    // Here you would typically make an API call or filter products
  };

  // Handle scan functionality
  const handleScan = () => {
    console.log('Scan functionality triggered');
    // Here you would typically open camera or barcode scanner
    alert('Scan functionality would open camera/barcode scanner');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <section className="bg-white shadow-sm border-b border-gray-200 mt-4 sm:mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                className="bg-orange-500 text-white px-4 sm:px-6 py-3 rounded-full hover:bg-orange-600 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
              >
                Search
              </button>
              
              {/* Scan Button */}
              <button 
                onClick={handleScan}
                className="p-3 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full transition-colors flex-shrink-0"
                title="Scan QR code"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zM3 15h6v6H3v-6zm2 2v2h2v-2H5zM15 3h6v6h-6V3zm2 2v2h2V5h-2zM3 11h2v2H3v-2zM7 11h2v2H7v-2zM11 3h2v6h-2V3zM11 11h2v2h-2v-2zM15 11h6v2h-6v-2zM11 15h2v2h-2v-2zM13 17h2v2h-2v-2zM15 15h2v6h-2v-6zM19 15h2v2h-2v-2zM19 19h2v2h-2v-2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Banner - Auto Sliding */}
      <section className="bg-gradient-to-r from-orange-400 to-orange-600 text-white relative overflow-hidden mt-4 sm:mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
            <div className="flex-1 text-center md:text-left px-2 md:pl-2">
              <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1 inline-block mb-3">
                <span className="text-xs font-medium">Featured</span>
              </div>
              <div className="relative overflow-hidden">
                <h1 
                  key={`title-${currentSlide}`}
                  className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 animate-fade-in-up"
                >
                  {bannerSlides[currentSlide].title}
                </h1>
              </div>
              <div className="relative overflow-hidden">
                <p 
                  key={`desc-${currentSlide}`}
                  className="text-orange-100 text-sm sm:text-base mb-4 animate-fade-in-up animation-delay-100"
                >
                  {bannerSlides[currentSlide].description}
                </p>
              </div>
              <button 
                onClick={() => setActiveCategory(bannerSlides[currentSlide].category)}
                className="bg-white text-orange-600 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-orange-50 transition-all duration-300 transform hover:scale-105"
              >
                Explore {bannerSlides[currentSlide].category}
              </button>
            </div>
            <div className="block md:hidden w-full px-4">
              <div className="relative overflow-hidden rounded-lg">
                <img 
                  key={`img-mobile-${currentSlide}`}
                  src={bannerSlides[currentSlide].image}
                  alt={bannerSlides[currentSlide].title}
                  className="w-full h-40 sm:h-48 object-cover shadow-lg animate-slide-in-right"
                />
              </div>
            </div>
            <div className="hidden md:block pr-2 relative">
              <div className="relative overflow-hidden rounded-lg">
                <img 
                  key={`img-${currentSlide}`}
                  src={bannerSlides[currentSlide].image}
                  alt={bannerSlides[currentSlide].title}
                  className="w-64 lg:w-80 h-40 lg:h-48 object-cover shadow-lg animate-slide-in-right"
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
                onClick={() => setActiveCategory(category)}
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
        </div>
      </section>

      {/* Filtered Products Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeCategory === 'All' ? 'All Products' : activeCategory}
              </h2>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    ${product.price}
                  </div>
                  <h3 className="text-sm text-gray-600 mb-2">{product.name}</h3>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{product.location}</span>
                  </div>
                  {product.verified && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        Verified seller
                      </div>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pagination */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-base text-black hover:text-gray-700 font-medium">
                Previous
              </button>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, '...', 48].map((page, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 text-base rounded-lg font-medium ${
                      page === 1
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button className="px-4 py-2 text-base text-black hover:text-gray-700 font-medium">
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
