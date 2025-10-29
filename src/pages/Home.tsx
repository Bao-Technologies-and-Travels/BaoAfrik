import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
import earthIcon from '../assets/images/pre/earth.svg';
import arrowDownIcon from '../assets/images/pre/arrow-down.svg';
import grayArrowIcon from '../assets/images/pre/gray.svg';
import blackArrowIcon from '../assets/images/pre/black.svg';
import locationIcon from '../assets/images/pre/PL.svg';
import bookmarkIcon from '../assets/images/pre/bm.svg';
import verifyIcon from '../assets/images/pre/verify.svg';
import unverifyIcon from '../assets/images/pre/unverify.svg';
import globyIcon from '../assets/images/pre/globy.svg';
import buyerIcon from '../assets/images/pre/buyer.svg';
import moneyIcon from '../assets/images/pre/money.svg';

// Import banner images
import cameroonianFashion from '../assets/images/logos/Fashion.png'; // Traditional Kente fabrics
import cameroonianDecor from '../assets/images/logos/decor.png'; // Wooden combs
import cameroonianCulture from '../assets/images/logos/culture.png'; // Traditional woven bag

// Import scan icon
import scanIcon from '../assets/images/logos/scanner (1).png';

const Home: React.FC = () => {
  const { user, isVisitor } = useAuth();
  const navigationLocation = useLocation();
  const productGridRef = React.useRef<HTMLDivElement>(null);
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
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageFormData, setImageFormData] = useState<FormData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = 48;

  // Banner slides data
  const bannerSlides = [
    {
      id: 1,
      title: "Cameroonian Spices & Sauces",
      description: "Discover our authentic spices and traditional blends from Cameroon",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
      category: "Food & Spices"
    },
    {
      id: 2,
      title: "Cameroonian Fashion",
      description: "Beautiful traditional Kente and handwoven African fabrics",
      image: cameroonianFashion, // Traditional fabrics image
      category: "Fashion & Textiles"
    },
    {
      id: 3,
      title: "Cameroonian Decor",
      description: "Handcrafted wooden combs and authentic traditional accessories",
      image: cameroonianDecor, // Wooden combs image
      category: "Home & Decor"
    },
    {
      id: 4,
      title: "Cameroonian Culture",
      description: "Traditional woven bags and unique handmade cultural crafts",
      image: cameroonianCulture, // Traditional woven bag image
      category: "Books & Media"
    }
  ];

  const categories = ['All', 'Food & Spices', 'Fashion & Textiles', 'Beauty & Wellness', 'Home & Decor', 'Books & Media'];

  const africanCountries = [
    { name: 'Algeria', code: 'dz', flag: 'https://flagcdn.com/w20/dz.png' },
    { name: 'Angola', code: 'ao', flag: 'https://flagcdn.com/w20/ao.png' },
    { name: 'Benin', code: 'bj', flag: 'https://flagcdn.com/w20/bj.png' },
    { name: 'Burkina Faso', code: 'bf', flag: 'https://flagcdn.com/w20/bf.png' },
    { name: 'Cameroon', code: 'cm', flag: 'https://flagcdn.com/w20/cm.png' },
    { name: 'Chad', code: 'td', flag: 'https://flagcdn.com/w20/td.png' },
    { name: 'Congo', code: 'cg', flag: 'https://flagcdn.com/w20/cg.png' },
    { name: 'Egypt', code: 'eg', flag: 'https://flagcdn.com/w20/eg.png' },
    { name: 'Equatorial Guinea', code: 'gq', flag: 'https://flagcdn.com/w20/gq.png' },
    { name: 'Ethiopia', code: 'et', flag: 'https://flagcdn.com/w20/et.png' },
    { name: 'Gabon', code: 'ga', flag: 'https://flagcdn.com/w20/ga.png' },
    { name: 'Ghana', code: 'gh', flag: 'https://flagcdn.com/w20/gh.png' },
    { name: 'Ivory Coast', code: 'ci', flag: 'https://flagcdn.com/w20/ci.png' },
    { name: 'Kenya', code: 'ke', flag: 'https://flagcdn.com/w20/ke.png' },
    { name: 'Mali', code: 'ml', flag: 'https://flagcdn.com/w20/ml.png' },
    { name: 'Morocco', code: 'ma', flag: 'https://flagcdn.com/w20/ma.png' },
    { name: 'Niger', code: 'ne', flag: 'https://flagcdn.com/w20/ne.png' },
    { name: 'Nigeria', code: 'ng', flag: 'https://flagcdn.com/w20/ng.png' },
    { name: 'Senegal', code: 'sn', flag: 'https://flagcdn.com/w20/sn.png' },
    { name: 'South Africa', code: 'za', flag: 'https://flagcdn.com/w20/za.png' },
    { name: 'Sudan', code: 'sd', flag: 'https://flagcdn.com/w20/sd.png' },
    { name: 'Tanzania', code: 'tz', flag: 'https://flagcdn.com/w20/tz.png' },
    { name: 'Togo', code: 'tg', flag: 'https://flagcdn.com/w20/tg.png' },
    { name: 'Tunisia', code: 'tn', flag: 'https://flagcdn.com/w20/tn.png' },
    { name: 'Uganda', code: 'ug', flag: 'https://flagcdn.com/w20/ug.png' }
  ].sort((a, b) => a.name.localeCompare(b.name));

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

  // Product grid scroll functions
  const scrollProductsLeft = () => {
    if (productGridRef.current) {
      productGridRef.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      });
    }
  };

  const scrollProductsRight = () => {
    if (productGridRef.current) {
      productGridRef.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      });
    }
  };

  // Handle scan functionality - trigger file input
  const handleScan = () => {
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  // Handle image file selection
  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('Image size must be less than 10MB');
        return;
      }

      // Set selected image
      setSelectedImage(file);

      // Create FormData for future API call
      const formData = new FormData();
      formData.append('image', file);
      formData.append('timestamp', new Date().toISOString());

      setImageFormData(formData);

      console.log('Image selected:', {
        name: file.name,
        size: file.size,
        type: file.type,
        formDataReady: true
      });
    }
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
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hidden file input for image selection */}
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageSelection}
        style={{ display: 'none' }}
      />

      {/* Search Section */}
      <div className="mt-4 sm:mt-6 mx-4 sm:mx-6" style={{ maxWidth: '1200px', margin: '0 auto', marginTop: '20px' }}>
        {/* Desktop Unified Search Bar */}
        <div
          className="hidden md:flex items-center mx-auto"
          style={{
            width: '900px',
            height: '58px',
            flexShrink: 0,
            borderRadius: '30px',
            border: '1px solid #E4E4E4',
            background: '#FFF',
            boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          {/* Product Section */}
          <div className="flex flex-col justify-center px-4 flex-1" style={{ borderRight: '1px solid #E4E4E4' }}>
            <label style={{ fontSize: '12px', color: '#BABABA', marginBottom: '2px' }}>Product</label>
            <input
              type="text"
              placeholder="Search a product"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="border-0 p-0 focus:outline-none focus:ring-0"
              style={{ fontSize: '11px', color: '#212121', background: 'transparent' }}
            />
            <style>
              {`
                input::placeholder {
                  color: #E9E9E9;
                }
              `}
            </style>
          </div>

          {/* Categories Section */}
          <div className="flex flex-col justify-center px-4 flex-1" style={{ borderRight: '1px solid #E4E4E4' }}>
            <label style={{ fontSize: '12px', color: '#BABABA', marginBottom: '2px' }}>Categories</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border-0 p-0 focus:outline-none focus:ring-0 appearance-none cursor-pointer"
              style={{ fontSize: '11px', color: selectedCategory ? '#212121' : '#E9E9E9', background: 'transparent' }}
            >
              <option value="" style={{ color: '#E9E9E9' }}>Search a category</option>
              <option value="Food & Spices">Food & Spices</option>
              <option value="Fashion & Textiles">Fashion & Textiles</option>
              <option value="Beauty & Wellness">Beauty & Wellness</option>
              <option value="Home & Decor">Home & Decor</option>
              <option value="Books & Media">Books & Media</option>
            </select>
          </div>

          {/* Place of Origin Section */}
          <div className="flex flex-col justify-center px-4 flex-1 relative" style={{ borderRight: '1px solid #E4E4E4' }}>
            <label style={{ fontSize: '12px', color: '#BABABA', marginBottom: '2px' }}>Place of Origin</label>
            <select
              value={placeOfOrigin}
              onChange={(e) => setPlaceOfOrigin(e.target.value)}
              className="border-0 p-0 pr-4 focus:outline-none focus:ring-0 appearance-none cursor-pointer"
              style={{ fontSize: '11px', color: placeOfOrigin ? '#212121' : '#E9E9E9', background: 'transparent' }}
            >
              <option value="" style={{ color: '#E9E9E9' }}>Choose a location</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Ghana">Ghana</option>
              <option value="Kenya">Kenya</option>
              <option value="South Africa">South Africa</option>
              <option value="Egypt">Egypt</option>
              <option value="Morocco">Morocco</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Uganda">Uganda</option>
              <option value="Cameroon">Cameroon</option>
              <option value="Senegal">Senegal</option>
              <option value="Ivory Coast">Ivory Coast</option>
              <option value="Mali">Mali</option>
              <option value="Burkina Faso">Burkina Faso</option>
              <option value="Niger">Niger</option>
              <option value="Chad">Chad</option>
              <option value="Sudan">Sudan</option>
              <option value="Algeria">Algeria</option>
              <option value="Tunisia">Tunisia</option>
              <option value="Libya">Libya</option>
              <option value="Other">Other</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <img src={arrowDownIcon} alt="Arrow" className="w-3 h-3" />
            </div>
          </div>

          {/* Seller Location Section */}
          <div className="flex flex-col justify-center px-4 flex-1">
            <label style={{ fontSize: '12px', color: '#BABABA', marginBottom: '2px' }}>Seller Location</label>
            <input
              type="text"
              placeholder="Insert location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-0 p-0 focus:outline-none focus:ring-0"
              style={{ fontSize: '11px', color: '#212121', background: 'transparent' }}
            />
          </div>

          {/* Scan Icon */}
          <button
            onClick={handleScan}
            className="flex items-center justify-center px-3 hover:opacity-70 transition-opacity"
            title="Scan QR code"
          >
            <img
              src={scanIcon}
              alt="Scan QR code"
              style={{ width: '20px', height: '20px' }}
            />
          </button>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="flex items-center justify-center rounded-full mr-2 transition-colors"
            style={{
              width: '90px',
              height: '42px',
              backgroundColor: '#F9A825'
            }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#E6941F'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#F9A825'}
          >
            <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
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
                    style={{ backgroundColor: '#F9A825' }}
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

      {/* Hero Banner - Auto Sliding */}
      <section className="text-white relative overflow-hidden mt-4 sm:mt-6 mx-12 sm:mx-16 lg:mx-24 rounded-2xl" style={{ background: 'linear-gradient(to right, #F9A822, #E55325)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-1 md:py-1">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-0">
            <div className="flex-1 text-center md:text-left px-2 md:pl-2 w-full md:w-auto">
              <button
                onClick={() => setActiveCategory(bannerSlides[currentSlide].category)}
                className="bg-white px-3 sm:px-4 py-1 rounded text-xs sm:text-sm font-medium hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 touch-manipulation mb-2 sm:mb-3"
                style={{ color: '#F9A822' }}
              >
                Explore {bannerSlides[currentSlide].category}
              </button>
              <div className="relative overflow-hidden min-h-[2rem] sm:min-h-[2.5rem] md:min-h-[3rem]">
                <h1
                  key={`title-${currentSlide}`}
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-2 animate-fade-in-up leading-tight"
                >
                  {bannerSlides[currentSlide].title}
                </h1>
              </div>
              <div className="relative overflow-hidden min-h-[1.5rem] sm:min-h-[2rem]">
                <p
                  key={`desc-${currentSlide}`}
                  className="text-orange-100 text-xs sm:text-sm md:text-base mb-0 animate-fade-in-up animation-delay-100 leading-relaxed"
                >
                  {bannerSlides[currentSlide].description}
                </p>
              </div>
            </div>
            <div className="block md:hidden w-full px-2 sm:px-4">
              <div className="relative overflow-hidden rounded-lg aspect-[16/9] sm:aspect-[2/1]">
                <img
                  key={`img-mobile-${currentSlide}`}
                  src={bannerSlides[currentSlide].image}
                  alt={bannerSlides[currentSlide].title}
                  className="w-full h-full object-cover animate-slide-in-right"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                    maskComposite: 'intersect',
                    WebkitMaskComposite: 'source-in'
                  }}
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
                  className="w-64 lg:w-80 h-32 lg:h-40 object-cover animate-slide-in-right"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                    maskComposite: 'intersect',
                    WebkitMaskComposite: 'source-in'
                  }}
                  loading="eager"
                  width="320"
                  height="192"
                />
              </div>
            </div>
          </div>

          {/* Slide Indicators - Hidden but functionality remains */}
          <div className="hidden">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Gray line background - full width at category bottom */}
          <div className="absolute bottom-0 left-[calc(-50vw+50%)] right-[calc(-50vw+50%)] h-0.5 bg-gray-200"></div>

          <div className="flex justify-center space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide relative">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setIsSearchActive(false);
                  setSearchQuery('');
                }}
                className={`whitespace-nowrap pb-3 sm:pb-4 px-1 font-normal transition-colors flex-shrink-0 relative`}
                style={{
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  color: activeCategory === category ? '#64B5F6' : '#BABABA'
                }}
              >
                {category}
                {activeCategory === category && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#64B5F6' }}></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Button - Desktop Only */}
      <section className="bg-white pt-0 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="relative filter-dropdown hidden md:block">
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="flex items-center space-x-2 border rounded-lg transition-colors"
                style={{
                  padding: '8px 10px',
                  backgroundColor: '#FAFAFA',
                  borderColor: '#E4E4E4',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                <span className="text-base font-normal" style={{ color: '#BABABA' }}>Filter :</span>
                <img src={earthIcon} alt="Earth" style={{ width: '22px', height: '22px' }} />
                <span className="text-base font-medium" style={{ color: '#6A6A6A' }}>{selectedCountry || 'Africa'}</span>
                <img
                  src={arrowDownIcon}
                  alt="Arrow"
                  className={`w-4 h-4 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isFilterDropdownOpen && (
                <div
                  className="absolute left-0 bg-white border border-gray-200 z-10"
                  style={{
                    width: '200px',
                    flexShrink: 0,
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    top: '0'
                  }}
                >
                  <style>
                    {`
                    .filter-dropdown-scroll::-webkit-scrollbar {
                      width: 2px;
                    }
                    .filter-dropdown-scroll::-webkit-scrollbar-track {
                      background: transparent;
                    }
                    .filter-dropdown-scroll::-webkit-scrollbar-thumb {
                      background-color: #E4E4E4;
                      border-radius: 10px;
                    }
                  `}
                  </style>

                  {/* Search Input at Top */}
                  <div className="px-3 pt-3 pb-2 border-b border-gray-200">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Filter :"
                        className="w-full px-3 py-2 text-sm rounded-lg focus:outline-none"
                        style={{
                          backgroundColor: '#FFFFFF',
                          color: '#6A6A6A',
                          border: 'none'
                        }}
                      />
                      <button
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setIsFilterDropdownOpen(false)}
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Country List */}
                  <div
                    className="py-2 overflow-y-auto filter-dropdown-scroll"
                    style={{
                      maxHeight: 'calc(6 * 44px)',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#E4E4E4 transparent'
                    }}
                  >
                    <button
                      onClick={() => {
                        setSelectedCountry('');
                        setIsFilterDropdownOpen(false);
                      }}
                      style={{
                        backgroundColor: !selectedCountry ? '#F0F8FE' : 'transparent',
                        color: !selectedCountry ? '#64B5F6' : '#BABABA'
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <img
                          src={globyIcon}
                          alt="Globe"
                          className="w-4 h-4 mr-2"
                          style={{
                            filter: selectedCountry ? 'grayscale(100%) brightness(0.7)' : 'none'
                          }}
                        />
                        <span>Africa</span>
                      </div>
                    </button>
                    {africanCountries.map((country) => (
                      <button
                        key={country.name}
                        onClick={() => {
                          setSelectedCountry(country.name);
                          setIsFilterDropdownOpen(false);
                        }}
                        style={{
                          backgroundColor: selectedCountry === country.name ? '#F0F8FE' : 'transparent',
                          color: selectedCountry === country.name ? '#64B5F6' : '#BABABA'
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
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

            {/* Notifications - Centered */}
            <div className="flex-1 flex justify-center relative">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`absolute top-0 left-1/2 transform -translate-x-1/2 z-50 flex items-center rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 shadow-sm animate-in slide-in-from-right duration-300 w-80 sm:w-96 ${notification.type === 'success'
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
                    <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex items-center justify-center ${notification.type === 'success'
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
                    <circle cx="6" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="18" cy="12" r="2" />
                  </svg>
                </button>

                {/* All Africa Button */}
                <button
                  onClick={() => setSelectedCountry('')}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md sm:rounded-full whitespace-nowrap text-xs sm:text-sm font-medium transition-colors touch-manipulation ${selectedCountry === ''
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
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md sm:rounded-full whitespace-nowrap text-xs sm:text-sm font-medium transition-colors touch-manipulation ${selectedCountry === country.code
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

          {/* Conditional Layout: Category Sections for "All" or Regular Grid for Specific Category */}
          {activeCategory === 'All' && !isSearchActive ? (
            // Category Sections Layout
            <div className="space-y-8">
              {categories.filter(cat => cat !== 'All').map((category) => {
                const categoryProducts = (allProducts[category as keyof typeof allProducts] || []);
                if (categoryProducts.length === 0) return null;

                return (
                  <div key={category} className="mb-8">
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <h2 className="text-[20px] font-semibold text-gray-900">{category}</h2>
                        <svg className="w-5 h-5 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                          aria-label="Scroll left"
                        >
                          <img src={grayArrowIcon} alt="Previous" className="w-full h-full" />
                        </button>
                        <button
                          className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                          aria-label="Scroll right"
                        >
                          <img src={blackArrowIcon} alt="Next" className="w-full h-full" />
                        </button>
                      </div>
                    </div>

                    {/* Category Products - Horizontal Scroll */}
                    <div className="overflow-x-auto scrollbar-hide">
                      <div className="flex gap-5 sm:gap-6">
                        {categoryProducts.slice(0, 12).map((product) => (
                          <Link key={product.id} to={`/product/${product.id}`} className="bg-white rounded-lg overflow-hidden transition-all duration-200 block group flex-shrink-0" style={{ width: '200px' }}>
                            {/* Product Image - Top */}
                            <div className="aspect-square relative overflow-hidden rounded-xl mb-2">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 rounded-xl"
                                loading="lazy"
                                width="200"
                                height="200"
                              />

                              {/* Country Badge */}
                              <div className="absolute top-2 left-2 bg-white rounded-md shadow-sm" style={{ display: 'flex', padding: '2px 6px', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                                <img
                                  src={getProductCountry(product.id).flag}
                                  alt={getProductCountry(product.id).name}
                                  className="w-3 h-2 object-cover rounded-sm"
                                />
                                <span className="text-xs font-medium text-gray-800">
                                  {getProductCountry(product.id).abbreviation}
                                </span>
                              </div>
                            </div>

                            {/* Product Content */}
                            <div className="px-2 pb-2 sm:px-3 sm:pb-3 flex flex-col">
                              {/* Price and Verified Badge Row */}
                              <div className="flex items-center justify-between mb-1">
                                <div className="font-bold text-gray-900" style={{ fontSize: '16px' }}>
                                  ${product.price}
                                </div>
                                {product.verified ? (
                                  <div className="flex items-center text-green-600 bg-green-50 rounded" style={{ display: 'flex', padding: '1px 4px', justifyContent: 'center', alignItems: 'center', gap: '1px', fontSize: '9px' }}>
                                    <img src={verifyIcon} alt="Verified" className="w-2 h-2" />
                                    <span>Verified seller</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center text-gray-600 bg-gray-100 rounded" style={{ display: 'flex', padding: '1px 4px', justifyContent: 'center', alignItems: 'center', gap: '1px', fontSize: '9px' }}>
                                    <img src={unverifyIcon} alt="Unverified" className="w-2 h-2" />
                                    <span>Unverified Seller</span>
                                  </div>
                                )}
                              </div>

                              {/* Product Name */}
                              <h3 className="mb-1 line-clamp-2 font-medium" style={{ fontSize: '13px', color: '#212121' }}>{product.name}</h3>

                              {/* Location and Bookmark Row - Below Product Name */}
                              <div className="flex items-center justify-between">
                                {/* Location */}
                                <div className="flex items-center text-gray-500 flex-1">
                                  <img src={locationIcon} alt="Location" className="w-2.5 h-2.5 mr-1 flex-shrink-0" />
                                  <span className="truncate font-normal" style={{ fontSize: '10px' }}>{product.location}</span>
                                </div>

                                {/* Bookmark Button */}
                                <div className="ml-2">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleSave(product.id);
                                    }}
                                    className="transition-colors touch-manipulation"
                                    title={savedProducts.has(product.id) ? 'Remove from saved' : 'Save product'}
                                    style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                  >
                                    <img src={bookmarkIcon} alt="Bookmark" className="w-5 h-5" style={{
                                      filter: savedProducts.has(product.id) ? 'none' : 'grayscale(100%) opacity(0.5)'
                                    }} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Regular Grid Layout for Specific Category or Search
            <>
              {/* Section Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <h2 className="text-[20px] font-semibold text-gray-900">
                    {isSearchActive
                      ? `Search Results (${filteredProducts().length} found)`
                      : activeCategory
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
                <div className="flex items-center space-x-3">
                  <button
                    onClick={scrollProductsLeft}
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                    aria-label="Scroll products left"
                  >
                    <img src={grayArrowIcon} alt="Previous" className="w-full h-full" />
                  </button>
                  <button
                    onClick={scrollProductsRight}
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                    aria-label="Scroll products right"
                  >
                    <img src={blackArrowIcon} alt="Next" className="w-full h-full" />
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
                <div
                  ref={productGridRef}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6 overflow-x-auto scrollbar-hide"
                >
                  {getProductsToDisplay().map((product) => (
                    <Link key={product.id} to={`/product/${product.id}`} className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 block group">
                      {/* Product Image - Top */}
                      <div className="aspect-square relative overflow-hidden rounded-xl mb-2">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 rounded-xl"
                          loading="lazy"
                          width="200"
                          height="200"
                        />

                        {/* Country Badge */}
                        <div className="absolute top-2 left-2 bg-white rounded-md shadow-sm" style={{ display: 'flex', padding: '2px 6px', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                          <img
                            src={getProductCountry(product.id).flag}
                            alt={getProductCountry(product.id).name}
                            className="w-3 h-2 object-cover rounded-sm"
                          />
                          <span className="text-xs font-medium text-gray-800">
                            {getProductCountry(product.id).abbreviation}
                          </span>
                        </div>
                      </div>

                      {/* Product Content */}
                      <div className="px-2 pb-2 sm:px-3 sm:pb-3 flex flex-col">
                        {/* Price and Verified Badge Row */}
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-gray-900" style={{ fontSize: '16px' }}>
                            ${product.price}
                          </div>
                          {product.verified ? (
                            <div className="flex items-center text-green-600 bg-green-50 rounded" style={{ display: 'flex', padding: '1px 4px', justifyContent: 'center', alignItems: 'center', gap: '1px', fontSize: '9px' }}>
                              <img src={verifyIcon} alt="Verified" className="w-2 h-2" />
                              <span>Verified seller</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-gray-600 bg-gray-100 rounded" style={{ display: 'flex', padding: '1px 4px', justifyContent: 'center', alignItems: 'center', gap: '1px', fontSize: '9px' }}>
                              <img src={unverifyIcon} alt="Unverified" className="w-2 h-2" />
                              <span>Unverified Seller</span>
                            </div>
                          )}
                        </div>

                        {/* Product Name */}
                        <h3 className="mb-1 line-clamp-2 font-medium" style={{ fontSize: '13px', color: '#212121' }}>{product.name}</h3>

                        {/* Location and Bookmark Row - Below Product Name */}
                        <div className="flex items-center justify-between">
                          {/* Location */}
                          <div className="flex items-center text-gray-500 flex-1">
                            <img src={locationIcon} alt="Location" className="w-2.5 h-2.5 mr-1 flex-shrink-0" />
                            <span className="truncate font-normal" style={{ fontSize: '10px' }}>{product.location}</span>
                          </div>

                          {/* Bookmark Button */}
                          <div className="ml-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSave(product.id);
                              }}
                              className="transition-colors touch-manipulation"
                              title={savedProducts.has(product.id) ? 'Remove from saved' : 'Save product'}
                              style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <img src={bookmarkIcon} alt="Bookmark" className="w-5 h-5" style={{
                                filter: savedProducts.has(product.id) ? 'none' : 'grayscale(100%) opacity(0.5)'
                              }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
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
                    className={`flex-shrink-0 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${page === 1
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
          <div className="hidden md:flex items-center justify-center relative">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 font-normal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontSize: '18px', color: '#BABABA' }}
              >
                Previous
              </button>
              <div className="flex space-x-1">
                {(() => {
                  const pages = [];
                  const showPages = [];

                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) showPages.push(i);
                  } else {
                    if (currentPage <= 4) {
                      showPages.push(1, 2, 3, 4, 5, '...', totalPages);
                    } else if (currentPage >= totalPages - 3) {
                      showPages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                    } else {
                      showPages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
                    }
                  }

                  return (
                    <>
                      {showPages.map((page, index) => (
                        page === '...' ? (
                          <span key={`ellipsis-${index}`} className="px-4 py-2 font-normal" style={{ fontSize: '18px', color: '#BABABA' }}>
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page as number)}
                            className="px-4 py-2 font-normal transition-colors relative"
                            style={{ fontSize: '18px', color: page === currentPage ? '#212121' : '#BABABA' }}
                          >
                            {page}
                            {page === currentPage && (
                              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5" style={{ backgroundColor: '#212121' }}></div>
                            )}
                          </button>
                        )
                      ))}
                    </>
                  );
                })()}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 font-normal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontSize: '18px', color: '#212121' }}
              >
                Next
              </button>
              <div className="flex items-center absolute right-0">
                <span className="px-4 py-0.5 rounded-lg font-normal border" style={{ fontSize: '18px', color: '#212121', backgroundColor: '#F5F5F5', borderColor: '#E4E4E4' }}>
                  {currentPage}
                </span>
                <span className="mx-2 font-normal" style={{ fontSize: '18px', color: '#BABABA' }}>
                  /
                </span>
                <span className="font-normal" style={{ fontSize: '18px', color: '#BABABA' }}>
                  {totalPages}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buy & Sell Instantly Section */}
      <section className="py-16 px-6 sm:px-8 lg:px-16" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <h2 className="mb-4" style={{ fontSize: '44px', fontWeight: '600', lineHeight: '1.2' }}>
                <span style={{ color: '#212121' }}>Buy & Sell </span>
                <span style={{
                  background: 'linear-gradient(90deg, #E55325 0%, #F9A825 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Instantly
                </span>
              </h2>
              <p style={{ fontSize: '16px', color: '#9C9C9C', maxWidth: '600px', lineHeight: '1.6' }}>
                Turn unmet needs into instant deals, discover what people are looking for, grab it, and sell it right where demand begins
              </p>
            </div>
            <div className="text-right">
              <div style={{
                fontSize: '44px',
                fontWeight: '600',
                background: 'linear-gradient(90deg, #E55325 0%, #F9A825 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Over 400
              </div>
              <div style={{ fontSize: '18px', color: '#9C9C9C', marginTop: '4px' }}>
                Request availables
              </div>
            </div>
          </div>

          {/* Filter Bar Section */}
          <div className="flex items-center gap-4 mb-8 mt-20">
            {/* Filter Button */}
            <button
              className="flex items-center border transition-colors hover:bg-gray-50"
              style={{
                backgroundColor: '#FAFAFA',
                borderColor: '#E4E4E4',
                padding: '8px 10px',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                gap: '6px'
              }}
            >
              <span style={{ color: '#BABABA', fontSize: '14px', fontWeight: 'normal' }}>Filter :</span>
              <img src={earthIcon} alt="Globe" style={{ width: '22px', height: '22px' }} />
              <span style={{ color: '#6A6A6A', fontSize: '14px' }}>Africa</span>
              <img src={arrowDownIcon} alt="Arrow" style={{ width: '16px', height: '16px' }} />
            </button>

            {/* Price Button */}
            <button
              className="flex items-center border transition-colors hover:bg-gray-50"
              style={{
                backgroundColor: '#FAFAFA',
                borderColor: '#E4E4E4',
                padding: '8px 14px',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                gap: '6px'
              }}
            >
              <span style={{ color: '#BABABA', fontSize: '14px', fontWeight: 'normal' }}>Price :</span>
              <span style={{ color: '#6A6A6A', fontSize: '14px' }}>All</span>
              <img src={arrowDownIcon} alt="Arrow" style={{ width: '16px', height: '16px' }} />
            </button>

            {/* Buyer Location Search Bar */}
            <div className="ml-auto" style={{ width: '380px' }}>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Buyer location ?"
                  className="w-full px-4 py-2.5 pr-28 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E4E4E4',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    color: '#6A6A6A'
                  }}
                />
                <div
                  className="absolute right-2 flex items-center"
                  style={{
                    backgroundColor: '#F9A825',
                    height: '28px',
                    paddingLeft: '18px',
                    paddingRight: '18px',
                    borderRadius: '8px'
                  }}
                >
                  <img src={buyerIcon} alt="Search" className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Request Cards Section */}
          <div className="relative">
            {/* Fade effect on the right */}
            <div
              className="absolute top-0 right-0 bottom-0 w-32 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(to left, white 0%, rgba(255, 255, 255, 0.8) 30%, transparent 100%)',
                height: 'calc(100% - 4rem)' // Exclude the navigation arrows height
              }}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow"
                  style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', height: 'auto' }}
                >
                  {/* Product Name Label and Button */}
                  <div className="flex items-center justify-between mb-0">
                    <span style={{ fontSize: '12px', color: '#9C9C9C' }}>Product name</span>
                    <button
                      className="px-3 py-1 rounded-lg text-white"
                      style={{ backgroundColor: '#F9A825', fontWeight: 'normal', fontSize: '12px' }}
                    >
                      Manage request
                    </button>
                  </div>

                  {/* Product Title */}
                  <h3 className="mb-3" style={{ fontSize: '14px', fontWeight: '500', color: '#212121' }}>
                    Snails from South Africa
                  </h3>

                  {/* Description */}
                  <p className="mb-4" style={{ fontSize: '10px', color: '#6A6A6A', lineHeight: '1.5', fontWeight: 'normal' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>

                  {/* Tags and User Info Row */}
                  <div className="flex items-end justify-between">
                    {/* Tags - Stacked Layout */}
                    <div className="flex flex-col gap-2">
                      {/* First Row - Location */}
                      <div
                        className="flex items-center gap-1 px-2 py-1"
                        style={{ backgroundColor: '#F0F8FE', borderRadius: '6px', width: 'fit-content' }}
                      >
                        <img
                          src={locationIcon}
                          alt="Location"
                          className="w-3 h-3"
                          style={{ filter: 'brightness(0) saturate(100%) invert(64%) sepia(52%) saturate(555%) hue-rotate(176deg) brightness(97%) contrast(92%)' }}
                        />
                        <span style={{ fontSize: '12px', color: '#64B5F6' }}>London, United Kingdom</span>
                      </div>

                      {/* Second Row - Price and Country */}
                      <div className="flex gap-2">
                        {/* Price Tag */}
                        <div
                          className="flex items-center gap-1.5 px-3 py-1.5"
                          style={{ backgroundColor: '#F0F8FE', borderRadius: '6px' }}
                        >
                          <img
                            src={moneyIcon}
                            alt="Money"
                            className="w-3 h-3"
                            style={{ filter: 'brightness(0) saturate(100%) invert(64%) sepia(52%) saturate(555%) hue-rotate(176deg) brightness(97%) contrast(92%)' }}
                          />
                          <span style={{ fontSize: '12px', color: '#64B5F6' }}>50 - 100 USD</span>
                        </div>

                        {/* Country Tag */}
                        <div
                          className="flex items-center gap-1.5 px-3 py-1.5"
                          style={{ backgroundColor: '#F0F8FE', borderRadius: '6px' }}
                        >
                          <img
                            src="https://flagcdn.com/w20/za.png"
                            alt="South Africa"
                            className="w-4 h-3 object-cover rounded-sm"
                          />
                          <span style={{ fontSize: '12px', color: '#64B5F6' }}>South Africa</span>
                        </div>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex flex-col items-center mt-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: '#F7C9B0' }}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#8B5E3C" />
                          <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#8B5E3C" />
                        </svg>
                      </div>
                      <div
                        className="flex items-center justify-center gap-0.5 px-1.5 py-0.5 border -mt-2"
                        style={{ borderColor: '#F4F4F4', backgroundColor: '#FFFFFF', borderRadius: '12px' }}
                      >
                        <svg className="w-2.5 h-2.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span style={{ fontSize: '10px', color: '#212121', fontWeight: '500' }}>4.3</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                aria-label="Previous"
              >
                <img src={grayArrowIcon} alt="Previous" className="w-full h-full" />
              </button>
              <button
                className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                aria-label="Next"
              >
                <img src={blackArrowIcon} alt="Next" className="w-full h-full" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
