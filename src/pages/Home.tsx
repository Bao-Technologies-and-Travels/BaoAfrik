import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import product images from pre folder
import pre1 from '../assets/images/pre/1.png';
import pre2 from '../assets/images/pre/2.png';
import pre3 from '../assets/images/pre/3.png';
import pre4 from '../assets/images/pre/4.png';
import pre5 from '../assets/images/pre/5.png';
import pre6 from '../assets/images/pre/6.png';
import pre7 from '../assets/images/pre/7.png';
import pre8 from '../assets/images/pre/8.png';
import pre9 from '../assets/images/pre/9.png';
import pre10 from '../assets/images/pre/10.png';
import pre11 from '../assets/images/pre/11.png';
import pre12 from '../assets/images/pre/12.png';
import pre13 from '../assets/images/pre/13.png';
import pre14 from '../assets/images/pre/14.png';
import pre15 from '../assets/images/pre/15.png';
import pre16 from '../assets/images/pre/16.png';
import pre17 from '../assets/images/pre/17.png';
import pre18 from '../assets/images/pre/18.png';

// Import banner images
import cameroonianFashion from '../assets/images/logos/Fashion.png'; // Traditional Kente fabrics
import cameroonianDecor from '../assets/images/logos/decor.png'; // Wooden combs
import cameroonianCulture from '../assets/images/logos/culture.png'; // Traditional woven bag

// Import scan icon
import scanIcon from '../assets/images/logos/scanner (1).png';


const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [location, setLocation] = useState('');
  const [placeOfOrigin, setPlaceOfOrigin] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sharedProducts, setSharedProducts] = useState<Set<number>>(new Set());
  const [savedProducts, setSavedProducts] = useState<Set<number>>(new Set());
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    product: {
      id: number;
      name: string;
      price: number;
      image: string;
    };
    timestamp: number;
    type: 'success' | 'error';
  }>>([]);

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
        image: pre1,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 2,
        name: "Gingembre",
        price: "13.9",
        image: pre2,
        location: "London | United Kingdom", 
        verified: false
      },
      {
        id: 3,
        name: "Tomates",
        price: "45",
        image: pre3,
        location: "London | United Kingdom",
        verified: false
      },
      {
        id: 4,
        name: "Crevettes",
        price: "8.09",
        image: pre4,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 5,
        name: "Ndole",
        price: "11.5",
        image: pre5,
        location: "London | United Kingdom",
        verified: false
      },
      {
        id: 6,
        name: "Poivre blanc",
        price: "15.3",
        image: pre6,
        location: "London | United Kingdom",
        verified: true
      }
    ],
    'Fashion & Textiles': [
      {
        id: 7,
        name: "Kente Fabric Roll",
        price: "232",
        image: pre7,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 8,
        name: "Traditional Ankara",
        price: "34.7",
        image: pre8,
        location: "London | United Kingdom", 
        verified: true
      },
      {
        id: 9,
        name: "Wax Print Fabric",
        price: "90.1",
        image: pre9,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 10,
        name: "Bogolan Mud Cloth",
        price: "245",
        image: pre10,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 11,
        name: "Dashiki Shirt",
        price: "110.9",
        image: pre11,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 12,
        name: "African Print Dress",
        price: "68.7",
        image: pre12,
        location: "London | United Kingdom",
        verified: true
      }
    ],
    'Beauty & Wellness': [
      {
        id: 13,
        name: "Shea Butter Cream",
        price: "31.7",
        image: pre13,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 14,
        name: "African Black Soap",
        price: "31.7",
        image: pre14,
        location: "London | United Kingdom", 
        verified: true
      },
      {
        id: 15,
        name: "Baobab Oil Serum",
        price: "31.7",
        image: pre15,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 16,
        name: "Moringa Face Mask",
        price: "31.7",
        image: pre16,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 17,
        name: "Argan Hair Oil",
        price: "31.7",
        image: pre17,
        location: "London | United Kingdom",
        verified: true
      },
      {
        id: 18,
        name: "Poivre blanc",
        price: "31.7",
        image: pre18,
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

    // Apply place of origin filter
    if (placeOfOrigin) {
      products = products.filter(product => 
        product.location.toLowerCase().includes(placeOfOrigin.toLowerCase())
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
    console.log('Search triggered with:', { searchQuery, selectedCategory, placeOfOrigin, location });
    
    // Get all products
    let products = Object.values(allProducts).flat();
    
    // Apply search query filter
    if (searchQuery.trim()) {
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      // Filter by category by checking which category array the product belongs to
      products = products.filter(product => {
        return Object.entries(allProducts).some(([category, categoryProducts]) => 
          category === selectedCategory && categoryProducts.some(p => p.id === product.id)
        );
      });
    }
    
    // Apply place of origin filter
    if (placeOfOrigin) {
      products = products.filter(product => 
        product.location.toLowerCase().includes(placeOfOrigin.toLowerCase())
      );
    }
    
    // Apply location filter
    if (location.trim()) {
      products = products.filter(product => 
        product.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    setSearchResults(products);
    setIsSearchActive(true);
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

  // Handle share functionality
  const handleShare = async (productId: number) => {
    setSharedProducts(prev => {
      const newShared = new Set(prev);
      if (newShared.has(productId)) {
        newShared.delete(productId);
        return newShared;
      } else {
        newShared.add(productId);
        
        // Share functionality - moved outside setState to prevent multiple calls
        setTimeout(async () => {
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
        }, 100);
        
        return newShared;
      }
    });
  };

  // Handle save functionality
  const handleSave = (productId: number) => {
    setSavedProducts(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(productId)) {
        newSaved.delete(productId);
        // Remove notification if product is unbookmarked
        setNotifications(prev => prev.filter(notif => notif.product.id !== productId));
        console.log(`Unsaved product ${productId}`);
      } else {
        // Simulate bookmarking attempt with potential failure
        const product = getProductsToDisplay().find(p => p.id === productId);
        if (product) {
          // Simulate random failure (20% chance of failure for demo purposes)
          const shouldFail = Math.random() < 0.2;
          
          if (shouldFail) {
            // Show error notification
            setNotifications(prev => {
              const existingNotification = prev.find(notif => notif.product.id === productId);
              if (existingNotification) {
                return prev;
              }
              
              const notificationId = `${productId}-error-${Date.now()}`;
              const errorNotification = {
                id: notificationId,
                product: {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image
                },
                timestamp: Date.now(),
                type: 'error' as const
              };
              
              setTimeout(() => {
                setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
              }, 5000);
              
              return [...prev, errorNotification];
            });
            console.log(`Failed to save product ${productId}`);
          } else {
            // Success - add to bookmarks
        newSaved.add(productId);
            setNotifications(prev => {
              const existingNotification = prev.find(notif => notif.product.id === productId);
              if (existingNotification) {
                return prev;
              }
              
              const notificationId = `${productId}-${Date.now()}`;
              const newNotification = {
                id: notificationId,
                product: {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image
                },
                timestamp: Date.now(),
                type: 'success' as const
              };
              
              setTimeout(() => {
                setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
              }, 5000);
              
              return [...prev, newNotification];
            });
        console.log(`Saved product ${productId}`);
          }
        }
      }
      return newSaved;
    });
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
       <div className="mt-4 sm:mt-6 mx-4 sm:mx-6" style={{maxWidth: '1200px', margin: '0 auto', marginTop: '20px'}}>
        <section className="bg-transparent sm:bg-white sm:shadow-sm sm:border sm:border-gray-200 rounded-full">
          <div className="px-4 sm:px-6 lg:px-8 py-3">
          {/* Desktop Search */}
          <div className="hidden md:flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-4">
            {/* Search Input */}
            <div className="flex-1 relative min-w-0">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Desktop: Grid for dropdowns and inputs */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:contents">
              {/* Category Dropdown */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 sm:px-4 pr-8 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-sm sm:text-base min-w-[140px]"
              >
                <option value="">All Categories</option>
                <option value="Food & Spices">Food & Spices</option>
                <option value="Fashion & Textiles">Fashion & Textiles</option>
                <option value="Beauty & Wellness">Beauty & Wellness</option>
                <option value="Home & Decor">Home & Decor</option>
                <option value="Books & Media">Books & Media</option>
              </select>
              
              {/* Place of Origin Dropdown - Web Only */}
              <div className="hidden lg:block relative min-w-[160px]">
                <select
                  value={placeOfOrigin}
                  onChange={(e) => setPlaceOfOrigin(e.target.value)}
                  className="w-full px-3 sm:px-4 pr-8 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-sm sm:text-base appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="">Place of Origin</option>
                  <option value="Nigeria" style={{backgroundImage: 'url("https://flagcdn.com/w20/ng.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', paddingLeft: '32px'}}>Nigeria</option>
                  <option value="Ghana" style={{backgroundImage: 'url("https://flagcdn.com/w20/gh.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', paddingLeft: '32px'}}>Ghana</option>
                  <option value="Kenya" style={{backgroundImage: 'url("https://flagcdn.com/w20/ke.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', paddingLeft: '32px'}}>Kenya</option>
                  <option value="South Africa" style={{backgroundImage: 'url("https://flagcdn.com/w20/za.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', paddingLeft: '32px'}}>South Africa</option>
                  <option value="Egypt" style={{backgroundImage: 'url("https://flagcdn.com/w20/eg.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', paddingLeft: '32px'}}>Egypt</option>
                  <option value="Morocco" style={{backgroundImage: 'url("https://flagcdn.com/w20/ma.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', paddingLeft: '32px'}}>Morocco</option>
                  <option value="Ethiopia" style={{backgroundImage: 'url("https://flagcdn.com/w20/et.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', paddingLeft: '32px'}}>Ethiopia</option>
                  <option value="Tanzania" style={{backgroundImage: 'url("https://flagcdn.com/w20/tz.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', paddingLeft: '32px'}}>Tanzania</option>
                  <option value="Uganda" style={{backgroundImage: 'url("https://flagcdn.com/w20/ug.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', paddingLeft: '32px'}}>Uganda</option>
                  <option value="Cameroon" style={{backgroundImage: 'url("https://flagcdn.com/w20/cm.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', paddingLeft: '32px'}}>Cameroon</option>
                  <option value="Senegal" style={{backgroundImage: 'url("https://flagcdn.com/w20/sn.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', paddingLeft: '32px'}}>Senegal</option>
                  <option value="Ivory Coast" style={{backgroundImage: 'url("https://flagcdn.com/w20/ci.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', paddingLeft: '32px'}}>Ivory Coast</option>
                  <option value="Mali" style={{backgroundImage: 'url("https://flagcdn.com/w20/ml.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', paddingLeft: '32px'}}>Mali</option>
                  <option value="Burkina Faso" style={{backgroundImage: 'url("https://flagcdn.com/w20/bf.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', paddingLeft: '32px'}}>Burkina Faso</option>
                  <option value="Niger" style={{backgroundImage: 'url("https://flagcdn.com/w20/ne.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', paddingLeft: '32px'}}>Niger</option>
                  <option value="Chad" style={{backgroundImage: 'url("https://flagcdn.com/w20/td.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', paddingLeft: '32px'}}>Chad</option>
                  <option value="Sudan" style={{backgroundImage: 'url("https://flagcdn.com/w20/sd.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', paddingLeft: '32px'}}>Sudan</option>
                  <option value="Algeria" style={{backgroundImage: 'url("https://flagcdn.com/w20/dz.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', paddingLeft: '32px'}}>Algeria</option>
                  <option value="Tunisia" style={{backgroundImage: 'url("https://flagcdn.com/w20/tn.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', paddingLeft: '32px'}}>Tunisia</option>
                  <option value="Libya" style={{backgroundImage: 'url("https://flagcdn.com/w20/ly.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', paddingLeft: '32px'}}>Libya</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            
              {/* Location Input */}
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base min-w-[120px]"
              />
            </div>
            
            {/* Mobile: Second row for buttons */}
            <div className="flex gap-3 lg:contents">
              {/* Scan Button */}
              <button 
                onClick={handleScan}
                className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full transition-colors flex-shrink-0 hover:border-orange-500 hover:text-orange-500"
                title="Scan QR code"
              >
                <img 
                  src={scanIcon} 
                  alt="Scan QR code" 
                  className="w-4 h-4 sm:w-5 sm:h-5 opacity-60 hover:opacity-100 transition-opacity"
                />
              </button>
              
              {/* Search Button */}
              <button 
                onClick={handleSearch}
                className="text-white px-4 sm:px-6 py-2 rounded-full transition-colors font-medium text-sm sm:text-base whitespace-nowrap flex items-center justify-center"
                style={{backgroundColor: '#F9A825'}}
                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden">
            <div className="flex items-center gap-2">
              {/* Search Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
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
                    <button 
                      onClick={() => {
                        handleSearch();
                        setIsMobileFilterOpen(false);
                      }}
                      className="flex-1 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center"
                      style={{backgroundColor: '#F9A825'}}
                      onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'}
                      onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      </div>

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
      <section className="bg-white py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide relative">
            {/* Gray line background - extends beyond container */}
            <div className="absolute bottom-0 left-[-1rem] right-[-1rem] h-0.5 bg-gray-200"></div>
            
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setIsSearchActive(false);
                  setSearchQuery('');
                }}
                className={`whitespace-nowrap pb-3 sm:pb-4 px-1 font-medium text-sm sm:text-lg transition-colors flex-shrink-0 relative ${
                  activeCategory === category
                    ? 'text-orange-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {category}
                {/* Orange line for active category */}
                {activeCategory === category && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>
          
          {/* Filter Button - Desktop Only */}
      <section className="bg-white py-2 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Notifications - Centered */}
            <div className="flex-1 flex justify-center relative">
              {notifications.map((notification) => (
                  <div
                    key={notification.id}
                     className={`absolute top-0 left-1/2 transform -translate-x-1/2 z-50 flex items-center rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 shadow-sm animate-in slide-in-from-right duration-300 w-80 sm:w-96 ${
                      notification.type === 'success' 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'bg-orange-50 border border-orange-200'
                    }`}
                  >
                    {/* Product Image */}
                    <div className="relative mr-3">
                      <img
                        src={notification.product.image}
                        alt={notification.product.name}
                         className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg"
                      />
                      {/* Bookmark Icon Overlay */}
                      <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex items-center justify-center ${
                        notification.type === 'success' 
                          ? 'bg-blue-500' 
                          : 'bg-white border border-orange-300'
                      }`}>
                        {notification.type === 'success' ? (
                           <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5l14 14M5 19L19 5" />
                          </svg>
                        )}
                      </div>
                    </div>
                    
                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-800">
                        {notification.type === 'success' ? (
                          <>Added to <Link to="/bookmarks" className="text-blue-600 hover:text-blue-700 underline">Bookmarks</Link></>
                        ) : (
                          <>Failed to add to <span className="text-orange-600">Bookmarks</span></>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {notification.product.name} - ${notification.product.price}
                      </div>
                    </div>
                    
                    {/* Close Button */}
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
              ))}
            </div>
            
            {/* Empty div to balance the layout */}
            <div className="w-0"></div>
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
                {/* Three-dot Menu Button - Mobile Only */}
                <button className="md:hidden flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors touch-manipulation">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="6" cy="12" r="2"/>
                    <circle cx="12" cy="12" r="2"/>
                    <circle cx="18" cy="12" r="2"/>
                  </svg>
                </button>
                
                {/* All Africa Button */}
                <button
                  onClick={() => setSelectedCountry('')}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md sm:rounded-full whitespace-nowrap text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
                    selectedCountry === '' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="hidden sm:inline">Afrique</span>
                  <span className="sm:hidden">Africa</span>
                </button>
                
                {/* Country Buttons */}
                {africanCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => setSelectedCountry(country.code)}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md sm:rounded-full whitespace-nowrap text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
                      selectedCountry === country.code 
                        ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                        : 'bg-gray-100 sm:bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {getProductsToDisplay().map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 block group">
                {/* Product Image - Top */}
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
                
                {/* Product Content */}
                <div className="p-2 sm:p-3 flex flex-col">
                  {/* Price and Verified Badge Row */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm sm:text-lg font-bold text-gray-900">
                    ${product.price}
                  </div>
                    {product.verified ? (
                      <div className="flex items-center text-xs text-green-600 bg-green-50 px-1 py-0.5 rounded text-xs">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                        <span className="text-xs">Verified seller</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-xs sm:text-xs text-gray-600 bg-gray-100 px-0.5 sm:px-1 py-0.5 rounded text-xs">
                        <svg className="w-1.5 h-1.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l2.5 5.5L20 8l-4.5 4.5L17 18l-5-2.5L7 18l1.5-5.5L4 8l5.5-.5L12 2z" stroke="currentColor" strokeWidth="1" fill="none"/>
                          <text x="12" y="16" textAnchor="middle" fontSize="4" fill="currentColor" fontWeight="bold">!</text>
                        </svg>
                        <span className="text-xs sm:text-xs">Unverified Seller</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Name */}
                  <h3 className="text-xs sm:text-sm text-gray-600 mb-1 line-clamp-2 font-medium">{product.name}</h3>
                  
                  {/* Location and Bookmark Row - Below Product Name */}
                  <div className="flex items-center justify-between">
                    {/* Location */}
                    <div className="flex items-center text-gray-500 flex-1">
                      <svg className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 mr-0.5 sm:mr-1 flex-shrink-0 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                      <span className="truncate text-xs sm:text-xs font-normal max-w-[60px] sm:max-w-none">{product.location}</span>
                  </div>
                    
                    {/* Bookmark Button */}
                    <div className="ml-2 sm:ml-4">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSave(product.id);
                          }}
                       className={`p-2 sm:p-2 transition-colors touch-manipulation ${
                            savedProducts.has(product.id) 
                          ? 'text-blue-500 hover:text-blue-600' 
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title={savedProducts.has(product.id) ? 'Remove from saved' : 'Save product'}
                        >
                      <div className="relative">
                         <svg className="w-5 h-5 sm:w-6 sm:h-6" fill={savedProducts.has(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        {savedProducts.has(product.id) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                      </div>
                        )}
                        {!savedProducts.has(product.id) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold">+</span>
                    </div>
                  )}
                      </div>
                    </button>
                    </div>
                  </div>
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
