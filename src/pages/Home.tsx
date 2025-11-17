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
import boxIcon from '../assets/images/pre/box.svg';
import draftsIcon from '../assets/images/pre/drafts.svg';
import bagIcon from '../assets/images/pre/bag.svg';
import settingIcon from '../assets/images/pre/setting.svg';

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
  const [searchHistory, setSearchHistory] = useState<string[]>(['Epices Camerounais', 'Vêtements', 'Produits Nigerians', 'Masque culturel', 'Accessoires traditionnels']);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategoryText, setSelectedCategoryText] = useState('');
  const [showPlaceOfOriginDropdown, setShowPlaceOfOriginDropdown] = useState(false);
  const [selectedPlaceOfOriginText, setSelectedPlaceOfOriginText] = useState('');
  const [focusedSearchSection, setFocusedSearchSection] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestProductName, setRequestProductName] = useState('');
  const [requestProductOrigin, setRequestProductOrigin] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
  const [requestPriceRange, setRequestPriceRange] = useState('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

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

    // Apply country filter if a specific country is selected (using country filter buttons)
    if (selectedCountry) {
        products = products.filter(product => 
        getProductCountry(product.id).name === selectedCountry
        );
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
    
    // Apply country filter if selected (filter by country badge, not seller location)
    if (selectedCountry) {
        products = products.filter(product => 
        getProductCountry(product.id).name === selectedCountry
        );
    }
    
    return products;
  };

  // Check if we should show "no results" state
  const shouldShowNoResultsState = () => {
    const products = getProductsToDisplay();
    const hasNoProducts = products.length === 0;
    
    // Show no results if searching and no results
    if (isSearchActive && hasNoProducts) {
      return true;
    }
    
    // Show no results if a category is selected (not "All") and it has no products
    if (activeCategory !== 'All' && hasNoProducts) {
      return true;
    }
    
    // Show no results if a country filter is applied and no products match
    if (selectedCountry && hasNoProducts) {
      return true;
    }
    
    return false;
  };

  // Clear search and return to category view
  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCategoryText('');
    setLocation('');
    setPlaceOfOrigin('');
    setSelectedPlaceOfOriginText('');
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

  // Re-run search when country filter changes and search is active
  useEffect(() => {
    if (isSearchActive) {
      // Automatically apply country filter to current search results
      let products = Object.values(allProducts).flat();
      
      // Reapply all search filters
      if (searchQuery.trim()) {
        products = products.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (selectedCategoryText) {
        products = products.filter(product => {
          return Object.entries(allProducts).some(([category, categoryProducts]) => 
            category === selectedCategoryText && categoryProducts.some(p => p.id === product.id)
          );
        });
      }
      
      if (selectedPlaceOfOriginText) {
        products = products.filter(product => {
          const country = getProductCountry(product.id).name;
          return country === selectedPlaceOfOriginText;
        });
      }
      
      if (selectedCountry) {
        products = products.filter(product => 
          getProductCountry(product.id).name === selectedCountry
        );
      }
      
      if (location.trim()) {
        products = products.filter(product => 
          product.location.toLowerCase().includes(location.toLowerCase())
        );
      }
      
      setSearchResults(products);
    }
  }, [selectedCountry]);

  // Handle search functionality
  const handleSearch = () => {
    console.log('=== SEARCH TRIGGERED ===');
    console.log('Search Query (Product):', searchQuery);
    console.log('Selected Category:', selectedCategoryText);
    console.log('Place of Origin (Country Badge):', selectedPlaceOfOriginText);
    console.log('Seller Location:', location);
    console.log('Selected Country Filter:', selectedCountry);
    
    // Get all products
    let products = Object.values(allProducts).flat();
    console.log('Total products before filtering:', products.length);
    
    // Apply search query filter (Product input)
    if (searchQuery.trim()) {
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log('After product name/location filter:', products.length);
    }
    
    // Apply category filter (Categories dropdown)
    if (selectedCategoryText) {
      const beforeCount = products.length;
      products = products.filter(product => {
        return Object.entries(allProducts).some(([category, categoryProducts]) => 
          category === selectedCategoryText && categoryProducts.some(p => p.id === product.id)
        );
      });
      console.log(`After category filter (${selectedCategoryText}):`, products.length, '(was', beforeCount, ')');
    }
    
    // Apply place of origin filter (Place of Origin dropdown - filters by country badge at top)
    if (selectedPlaceOfOriginText) {
      const beforeCount = products.length;
      products = products.filter(product => {
        const country = getProductCountry(product.id).name;
        console.log(`Product ${product.id} country:`, country, 'matches', selectedPlaceOfOriginText, '?', country === selectedPlaceOfOriginText);
        return country === selectedPlaceOfOriginText;
      });
      console.log(`After place of origin filter (${selectedPlaceOfOriginText}):`, products.length, '(was', beforeCount, ')');
    }
    
    // Apply country filter from filter buttons (applies to both category view and search)
    if (selectedCountry) {
      const beforeCount = products.length;
      products = products.filter(product => 
        getProductCountry(product.id).name === selectedCountry
      );
      console.log(`After country filter (${selectedCountry}):`, products.length, '(was', beforeCount, ')');
    }
    
    // Apply seller location filter (Seller Location input - filters by location at bottom)
    if (location.trim()) {
      const beforeCount = products.length;
      products = products.filter(product => 
        product.location.toLowerCase().includes(location.toLowerCase())
      );
      console.log(`After seller location filter (${location}):`, products.length, '(was', beforeCount, ')');
    }
    
    console.log('Final filtered products:', products.length);
    console.log('======================');
    
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
       <div className="mt-4 sm:mt-6 mx-4 sm:mx-6" style={{maxWidth: '1200px', margin: '0 auto', marginTop: '20px'}}>
        {/* Desktop Unified Search Bar */}
        <div className="hidden md:block relative">
          <div 
            className="flex items-center mx-auto"
            style={{
              width: '900px',
              height: '58px',
              flexShrink: 0,
              borderRadius: '30px',
              border: '1px solid #E4E4E4',
              background: focusedSearchSection ? '#F4F4F4' : '#FFF',
              boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
              fontFamily: 'Poppins, sans-serif',
              transition: 'background 0.2s ease'
            }}
          >
            {/* Product Section */}
            <div 
              className="flex flex-col justify-center px-4 flex-1 relative" 
              style={{ 
                background: focusedSearchSection === 'product' ? '#FFF' : 'transparent',
                borderTopLeftRadius: '30px',
                borderBottomLeftRadius: '30px',
                borderTopRightRadius: focusedSearchSection === 'product' ? '30px' : '0',
                borderBottomRightRadius: focusedSearchSection === 'product' ? '30px' : '0',
                boxShadow: focusedSearchSection === 'product' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.2s ease',
                zIndex: focusedSearchSection === 'product' ? 10 : 1,
                height: '58px'
              }}
            >
              {/* Divider */}
              {!(focusedSearchSection === 'product' || focusedSearchSection === 'categories') && (
                <div 
                  style={{ 
                    position: 'absolute',
                    right: 0,
                    top: '12px',
                    bottom: '12px',
                    width: '1px',
                    backgroundColor: '#E4E4E4'
                  }}
                />
              )}
              <label style={{ fontSize: '12px', color: '#BABABA', marginBottom: '2px' }}>Product</label>
              <input
                type="text"
                placeholder="Search a product"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                onFocus={() => {
                  setFocusedSearchSection('product');
                  if (searchHistory.length > 0) {
                    setShowSearchHistory(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setFocusedSearchSection(null);
                    setShowSearchHistory(false);
                  }, 200);
                }}
                className="border-0 p-0 focus:outline-none focus:ring-0 product-search-input"
                style={{ fontSize: '11px', color: '#212121', background: 'transparent' }}
              />
              <style>
                {`
                  .product-search-input::placeholder {
                    color: #E9E9E9;
                  }
                  .product-search-input {
                    caret-color: #64B5F6;
                  }
                `}
              </style>
            </div>
            
          {/* Categories Section */}
          <div 
            className="flex flex-col justify-center px-4 flex-1 relative" 
            style={{ 
              background: focusedSearchSection === 'categories' ? '#FFF' : 'transparent',
              borderTopLeftRadius: focusedSearchSection === 'categories' ? '30px' : '0',
              borderBottomLeftRadius: focusedSearchSection === 'categories' ? '30px' : '0',
              borderTopRightRadius: focusedSearchSection === 'categories' ? '30px' : '0',
              borderBottomRightRadius: focusedSearchSection === 'categories' ? '30px' : '0',
              boxShadow: focusedSearchSection === 'categories' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
              transition: 'all 0.2s ease',
              zIndex: focusedSearchSection === 'categories' ? 10 : 1,
              height: '58px'
            }}
          >
              {/* Divider */}
              {!(focusedSearchSection === 'categories' || focusedSearchSection === 'placeOfOrigin') && (
                <div 
                  style={{ 
                    position: 'absolute',
                    right: 0,
                    top: '12px',
                    bottom: '12px',
                    width: '1px',
                    backgroundColor: '#E4E4E4'
                  }}
                />
              )}
            <label style={{ fontSize: '12px', color: '#BABABA', marginBottom: '2px' }}>Categories</label>
            <button
              onClick={() => {
                setFocusedSearchSection('categories');
                setShowCategoryDropdown(!showCategoryDropdown);
              }}
              onFocus={() => setFocusedSearchSection('categories')}
              onBlur={() => {
                setTimeout(() => {
                  setFocusedSearchSection(null);
                  setShowCategoryDropdown(false);
                }, 200);
              }}
              className="border-0 p-0 focus:outline-none text-left flex items-center justify-between w-full"
              style={{ fontSize: '11px', color: selectedCategoryText ? '#212121' : '#E9E9E9', background: 'transparent' }}
            >
              <span>{selectedCategoryText || 'Choose a category'}</span>
              <img 
                src={arrowDownIcon} 
                alt="Arrow" 
                className="w-3 h-3 ml-2 transition-transform"
                style={{ transform: showCategoryDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
          </div>

          {/* Place of Origin Section */}
          <div 
            className="flex flex-col justify-center px-4 flex-1 relative" 
            style={{ 
              background: focusedSearchSection === 'placeOfOrigin' ? '#FFF' : 'transparent',
              borderTopLeftRadius: focusedSearchSection === 'placeOfOrigin' ? '30px' : '0',
              borderBottomLeftRadius: focusedSearchSection === 'placeOfOrigin' ? '30px' : '0',
              borderTopRightRadius: focusedSearchSection === 'placeOfOrigin' ? '30px' : '0',
              borderBottomRightRadius: focusedSearchSection === 'placeOfOrigin' ? '30px' : '0',
              boxShadow: focusedSearchSection === 'placeOfOrigin' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
              transition: 'all 0.2s ease',
              zIndex: focusedSearchSection === 'placeOfOrigin' ? 10 : 1,
              height: '58px'
            }}
          >
              {/* Divider */}
              {!(focusedSearchSection === 'placeOfOrigin' || focusedSearchSection === 'sellerLocation') && (
                <div 
                  style={{ 
                    position: 'absolute',
                    right: 0,
                    top: '12px',
                    bottom: '12px',
                    width: '1px',
                    backgroundColor: '#E4E4E4'
                  }}
                />
              )}
            <label style={{ fontSize: '12px', color: '#BABABA', marginBottom: '2px' }}>Place of Origin</label>
            <button
              onClick={() => {
                setFocusedSearchSection('placeOfOrigin');
                setShowPlaceOfOriginDropdown(!showPlaceOfOriginDropdown);
              }}
              onFocus={() => setFocusedSearchSection('placeOfOrigin')}
              onBlur={() => {
                setTimeout(() => {
                  setFocusedSearchSection(null);
                  setShowPlaceOfOriginDropdown(false);
                }, 200);
              }}
              className="border-0 p-0 focus:outline-none text-left flex items-center justify-between w-full"
              style={{ fontSize: '11px', color: selectedPlaceOfOriginText ? '#212121' : '#E9E9E9', background: 'transparent' }}
            >
              <span>{selectedPlaceOfOriginText || 'Choose a location'}</span>
              <img 
                src={arrowDownIcon} 
                alt="Arrow" 
                className="w-3 h-3 ml-2 transition-transform"
                style={{ transform: showPlaceOfOriginDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
            </div>
            
          {/* Seller Location Section */}
          <div 
            className="flex flex-col justify-center px-4 flex-1" 
            style={{ 
              background: focusedSearchSection === 'sellerLocation' ? '#FFF' : 'transparent',
              borderTopLeftRadius: focusedSearchSection === 'sellerLocation' ? '30px' : '0',
              borderBottomLeftRadius: focusedSearchSection === 'sellerLocation' ? '30px' : '0',
              borderTopRightRadius: focusedSearchSection === 'sellerLocation' ? '30px' : '0',
              borderBottomRightRadius: focusedSearchSection === 'sellerLocation' ? '30px' : '0',
              boxShadow: focusedSearchSection === 'sellerLocation' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
              transition: 'all 0.2s ease',
              zIndex: focusedSearchSection === 'sellerLocation' ? 10 : 1,
              height: '58px'
            }}
          >
            <label style={{ fontSize: '12px', color: '#BABABA', marginBottom: '2px' }}>Seller Location</label>
              <input
                type="text"
              placeholder="Insert location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setFocusedSearchSection('sellerLocation')}
                onBlur={() => {
                  setTimeout(() => setFocusedSearchSection(null), 200);
                }}
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

        {/* Search History Dropdown */}
        {showSearchHistory && searchQuery.length > 0 && (
          <div 
            className="absolute bg-white z-50"
            style={{
              width: '160px',
              left: 'calc(50% - 450px + 16px)',
              top: '50px',
              borderTopLeftRadius: '30px',
              borderTopRightRadius: '30px',
              borderBottomLeftRadius: '28px',
              borderBottomRightRadius: '28px',
              background: '#FFF',
              boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 pb-1">
              <h3 className="font-medium" style={{ fontSize: '12px', color: '#212121' }}>
                Search history
              </h3>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="4" cy="10" r="1.5"/>
                  <circle cx="10" cy="10" r="1.5"/>
                  <circle cx="16" cy="10" r="1.5"/>
                </svg>
              </button>
            </div>

            {/* Search History Items */}
            <div className="py-1">
              {searchHistory.map((item, index) => (
              <button 
                  key={index}
                  onClick={() => {
                    setSearchQuery(item);
                    setShowSearchHistory(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-normal" style={{ fontSize: '12px', color: '#6A6A6A' }}>
                    {item.length > 16 ? item.substring(0, 16) + '...' : item}
                  </span>
                  <svg 
                    className="w-3 h-3 flex-shrink-0 ml-1" 
                    fill="#6A6A6A" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Dropdown */}
        {showCategoryDropdown && (
          <div 
            className="absolute bg-white z-50"
            style={{
              width: '180px',
              left: 'calc(50% - 450px + 200px)',
              top: '54px',
              borderRadius: '28px',
              background: '#FFF',
              boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            {/* Category Items */}
            <div className="py-2">
              <button
                onMouseDown={() => {
                  setSelectedCategoryText('');
                  setSelectedCategory('');
                  setShowCategoryDropdown(false);
                }}
                className="w-full text-left px-4 py-1.5 hover:bg-gray-50 transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  color: !selectedCategoryText ? '#64B5F6' : '#6A6A6A',
                  fontSize: '11px'
                }}
              >
                All Categories
              </button>
              {['Beauty & Wellness', 'Books & Media', 'Fashion & Textiles', 'Food & Spices', 'Home & Decor'].map((category) => (
                <button
                  key={category}
                  onMouseDown={() => {
                    setSelectedCategoryText(category);
                    setSelectedCategory(category);
                    setShowCategoryDropdown(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-gray-50 transition-colors"
                  style={{
                    backgroundColor: 'transparent',
                    color: selectedCategoryText === category ? '#64B5F6' : '#6A6A6A',
                    fontSize: '11px'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Place of Origin Dropdown */}
        {showPlaceOfOriginDropdown && (
          <div 
            className="absolute bg-white z-50 place-origin-dropdown"
            style={{
              width: '180px',
              left: 'calc(50% - 450px + 395px)',
              top: '54px',
              borderRadius: '28px',
              background: '#FFF',
              boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
              fontFamily: 'Poppins, sans-serif',
              maxHeight: '280px',
              overflowY: 'auto'
            }}
          >
            {/* Place of Origin Items */}
            <div className="py-2">
              <button
                onMouseDown={() => {
                  setSelectedPlaceOfOriginText('');
                  setPlaceOfOrigin('');
                  setShowPlaceOfOriginDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
                style={{
                  backgroundColor: !selectedPlaceOfOriginText || selectedPlaceOfOriginText === 'Africa' ? '#F0F8FE' : 'transparent',
                  color: !selectedPlaceOfOriginText || selectedPlaceOfOriginText === 'Africa' ? '#64B5F6' : '#6A6A6A',
                  fontSize: '11px'
                }}
              >
                <img 
                  src={globyIcon} 
                  alt="Globe" 
                  className="w-4 h-4" 
                  style={{
                    filter: (!selectedPlaceOfOriginText || selectedPlaceOfOriginText === 'Africa') 
                      ? 'none' 
                      : 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(92%)'
                  }}
                />
                <span>Africa</span>
              </button>
              {[
                { name: 'Algeria', flagCode: 'dz' },
                { name: 'Angola', flagCode: 'ao' },
                { name: 'Benin', flagCode: 'bj' },
                { name: 'Botswana', flagCode: 'bw' },
                { name: 'Burkina Faso', flagCode: 'bf' },
                { name: 'Burundi', flagCode: 'bi' },
                { name: 'Cameroon', flagCode: 'cm' },
                { name: 'Cape Verde', flagCode: 'cv' },
                { name: 'Central African Republic', flagCode: 'cf' },
                { name: 'Chad', flagCode: 'td' },
                { name: 'Comoros', flagCode: 'km' },
                { name: 'Congo', flagCode: 'cg' },
                { name: 'Democratic Republic of Congo', flagCode: 'cd' },
                { name: 'Djibouti', flagCode: 'dj' },
                { name: 'Egypt', flagCode: 'eg' },
                { name: 'Equatorial Guinea', flagCode: 'gq' },
                { name: 'Eritrea', flagCode: 'er' },
                { name: 'Eswatini', flagCode: 'sz' },
                { name: 'Ethiopia', flagCode: 'et' },
                { name: 'Gabon', flagCode: 'ga' },
                { name: 'Gambia', flagCode: 'gm' },
                { name: 'Ghana', flagCode: 'gh' },
                { name: 'Guinea', flagCode: 'gn' },
                { name: 'Guinea-Bissau', flagCode: 'gw' },
                { name: 'Ivory Coast', flagCode: 'ci' },
                { name: 'Kenya', flagCode: 'ke' },
                { name: 'Lesotho', flagCode: 'ls' },
                { name: 'Liberia', flagCode: 'lr' },
                { name: 'Libya', flagCode: 'ly' },
                { name: 'Madagascar', flagCode: 'mg' },
                { name: 'Malawi', flagCode: 'mw' },
                { name: 'Mali', flagCode: 'ml' },
                { name: 'Mauritania', flagCode: 'mr' },
                { name: 'Mauritius', flagCode: 'mu' },
                { name: 'Morocco', flagCode: 'ma' },
                { name: 'Mozambique', flagCode: 'mz' },
                { name: 'Namibia', flagCode: 'na' },
                { name: 'Niger', flagCode: 'ne' },
                { name: 'Nigeria', flagCode: 'ng' },
                { name: 'Rwanda', flagCode: 'rw' },
                { name: 'Sao Tome and Principe', flagCode: 'st' },
                { name: 'Senegal', flagCode: 'sn' },
                { name: 'Seychelles', flagCode: 'sc' },
                { name: 'Sierra Leone', flagCode: 'sl' },
                { name: 'Somalia', flagCode: 'so' },
                { name: 'South Africa', flagCode: 'za' },
                { name: 'South Sudan', flagCode: 'ss' },
                { name: 'Sudan', flagCode: 'sd' },
                { name: 'Tanzania', flagCode: 'tz' },
                { name: 'Togo', flagCode: 'tg' },
                { name: 'Tunisia', flagCode: 'tn' },
                { name: 'Uganda', flagCode: 'ug' },
                { name: 'Zambia', flagCode: 'zm' },
                { name: 'Zimbabwe', flagCode: 'zw' }
              ].sort((a, b) => a.name.localeCompare(b.name)).map((country) => (
                <button
                  key={country.name}
                  onMouseDown={() => {
                    setSelectedPlaceOfOriginText(country.name);
                    setPlaceOfOrigin(country.name);
                    setShowPlaceOfOriginDropdown(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  style={{
                    backgroundColor: 'transparent',
                    color: selectedPlaceOfOriginText === country.name ? '#64B5F6' : '#6A6A6A',
                    fontSize: '11px'
                  }}
                >
                  <img 
                    src={`https://flagcdn.com/w20/${country.flagCode}.png`} 
                    srcSet={`https://flagcdn.com/w40/${country.flagCode}.png 2x`}
                    alt={`${country.name} flag`}
                    style={{ width: '16px', height: '12px', objectFit: 'cover' }}
                  />
                  <span>{country.name}</span>
                </button>
              ))}
            </div>
            <style>
              {`
                /* Hide scrollbar completely while keeping scroll functionality */
                .place-origin-dropdown {
                  scrollbar-width: none; /* Firefox */
                  -ms-overflow-style: none; /* IE and Edge */
                }
                .place-origin-dropdown::-webkit-scrollbar {
                  display: none; /* Chrome, Safari, Opera */
                }
              `}
            </style>
          </div>
        )}
          </div>

          {/* Mobile Search */}
          <div className="md:hidden px-4">
            <div className="flex items-center gap-2">
              {/* Search Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="What are you looking for today ?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  onFocus={() => {
                    setFocusedSearchSection('mobile-search');
                    if (searchHistory.length > 0) {
                      setShowSearchHistory(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setFocusedSearchSection(null);
                      setShowSearchHistory(false);
                    }, 200);
                  }}
                  className="w-full px-4 py-3 pr-12 focus:outline-none text-sm"
                  style={{
                    borderRadius: '30px',
                    border: '1px solid #E9E9E9',
                    backgroundColor: '#FFF',
                    fontFamily: 'Poppins, sans-serif',
                    color: '#212121',
                    caretColor: '#64B5F6'
                  }}
                />
                <style>{`
                  .md\\:hidden input::placeholder {
                    color: #D9D9D9;
                    font-size: 12px;
                  }
                `}</style>
                {/* Scan Icon */}
                <button 
                  onClick={handleScan}
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                  title="Scan image to search"
                >
                  <img 
                    src={scanIcon} 
                    alt="Scan" 
                    className="w-5 h-5"
                    style={{ opacity: 0.6 }}
                  />
                </button>
              </div>
              
              {/* Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="flex items-center justify-center relative flex-shrink-0"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: '0.5px solid #E9E9E9',
                  backgroundColor: '#FFF'
                }}
                aria-label="Filter"
                    >
                {/* Filter Icon - Two horizontal lines with circles */}
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  fill="none"
                >
                  {/* Top line with circle */}
                  <line x1="3" y1="6" x2="17" y2="6" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="10" cy="6" r="2" fill="#FFF" stroke="#6A6A6A" strokeWidth="1.5"/>
                  
                  {/* Bottom line with circle */}
                  <line x1="3" y1="14" x2="17" y2="14" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="10" cy="14" r="2" fill="#FFF" stroke="#6A6A6A" strokeWidth="1.5"/>
                </svg>
                
                {/* Red notification dot */}
                <div 
                  className="absolute"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#FF0000',
                    bottom: '2px',
                    right: '2px'
                  }}
                />
              </button>
                  </div>
                  
            {/* Mobile Search History Dropdown */}
            {showSearchHistory && searchQuery.length > 0 && focusedSearchSection === 'mobile-search' && (
              <div 
                className="mt-2 bg-white rounded-lg shadow-lg border border-gray-100"
                style={{
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h3 className="font-medium text-sm" style={{ color: '#212121' }}>
                    Search history
                  </h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="4" cy="10" r="1.5"/>
                      <circle cx="10" cy="10" r="1.5"/>
                      <circle cx="16" cy="10" r="1.5"/>
                    </svg>
                  </button>
                  </div>
                  
                {/* Search History Items */}
                <div className="py-1">
                  {searchHistory.map((item, index) => (
                    <button 
                      key={index}
                      onClick={() => {
                        setSearchQuery(item);
                        setShowSearchHistory(false);
                        handleSearch();
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="font-normal text-sm" style={{ color: '#6A6A6A' }}>
                        {item.length > 25 ? item.substring(0, 25) + '...' : item}
                      </span>
                      <svg 
                        className="w-4 h-4 flex-shrink-0 ml-2" 
                        fill="#6A6A6A" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      {/* Hero Banner - Auto Sliding */}
      <section className="text-white relative overflow-hidden mt-4 sm:mt-6 mx-4 sm:mx-20 md:mx-24 lg:mx-40 rounded-2xl mb-6 sm:mb-0" style={{background: 'linear-gradient(to right, #F9A822, #E55325)', height: window.innerWidth < 640 ? '100px' : 'auto'}}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-1 md:py-1" style={{height: window.innerWidth < 640 ? '100%' : 'auto'}}>
          <div className="flex flex-row items-center justify-between gap-1 sm:gap-4 md:gap-0">
            <div className="flex-1 text-left px-1 sm:px-2 md:pl-2">
              <button 
                onClick={() => setActiveCategory(bannerSlides[currentSlide].category)}
                className="bg-white px-1.5 sm:px-3 md:px-4 py-0.5 sm:py-1 rounded text-[7px] sm:text-xs md:text-sm font-medium hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 touch-manipulation mb-1 sm:mb-2 md:mb-3"
                style={{ color: '#F9A822' }}
              >
                Explore {bannerSlides[currentSlide].category}
              </button>
              <div className="relative overflow-hidden min-h-[1.5rem] sm:min-h-[2rem] md:min-h-[2.5rem] lg:min-h-[3rem]">
                <h1 
                  key={`title-${currentSlide}`}
                  className="text-[11px] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold mb-1 sm:mb-2 animate-fade-in-up leading-tight"
                >
                  {bannerSlides[currentSlide].title}
                </h1>
              </div>
              <div className="relative overflow-hidden min-h-[1.5rem] sm:min-h-[1.5rem] md:min-h-[2rem]">
                <p 
                  key={`desc-${currentSlide}`}
                  className="text-orange-100 text-[8px] sm:text-xs md:text-sm lg:text-base mb-0 animate-fade-in-up animation-delay-100 leading-relaxed"
                >
                  {bannerSlides[currentSlide].description}
                </p>
              </div>
            </div>
            <div className="pr-1 sm:pr-2 relative flex-shrink-0">
              <div className="relative overflow-hidden rounded-lg">
                <img 
                  key={`img-${currentSlide}`}
                  src={bannerSlides[currentSlide].image}
                  alt={bannerSlides[currentSlide].title}
                  className="w-20 h-16 sm:w-48 sm:h-24 md:w-64 md:h-32 lg:w-80 lg:h-40 object-cover animate-slide-in-right"
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
      <section className="bg-white py-3 sm:py-4 md:py-6 mb-4 md:mb-0">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 relative">
            {/* Gray line background - full width at category bottom */}
            <div className="absolute bottom-0 left-[calc(-50vw+50%)] right-[calc(-50vw+50%)] bg-gray-200" style={{ height: window.innerWidth < 768 ? '0.5px' : '2px' }}></div>
            
            <div className="flex justify-start md:justify-center space-x-2 sm:space-x-4 md:space-x-8 overflow-x-auto scrollbar-hide relative">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setIsSearchActive(false);
                  setSearchQuery('');
                }}
                className={`whitespace-nowrap pb-2 sm:pb-3 md:pb-4 px-0.5 sm:px-1 transition-colors flex-shrink-0 relative`}
                style={{
                  fontSize: window.innerWidth < 640 ? '13px' : '16px',
                  fontWeight: window.innerWidth < 640 ? '300' : 'normal',
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

      {/* Mobile Filter Buttons - Horizontal Scroll */}
      <section className="bg-white md:hidden" style={{ marginTop: '-8px', marginBottom: '-8px' }}>
        <div className="px-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {/* More Options Button */}
            <button
              className="flex-shrink-0 flex items-center justify-center"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid #E9E9E9',
                backgroundColor: '#FFF'
              }}
              aria-label="More options"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="3.5" cy="7" r="1.25" fill="#6A6A6A"/>
                <circle cx="7" cy="7" r="1.25" fill="#6A6A6A"/>
                <circle cx="10.5" cy="7" r="1.25" fill="#6A6A6A"/>
              </svg>
            </button>

            {/* Africa Button */}
            <button
              onClick={() => setSelectedCountry('')}
              className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md"
              style={{
                backgroundColor: !selectedCountry ? '#F0F8FE' : '#FAFAFA',
                border: !selectedCountry ? '1px solid #CFE8FC' : 'none',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              <img 
                src={globyIcon} 
                alt="Globe"
                className="w-3.5 h-3.5"
                style={{
                  filter: selectedCountry ? 'grayscale(100%) brightness(0.7)' : 'none'
                }}
              />
              <span 
                className="text-xs font-normal whitespace-nowrap"
                style={{ 
                  color: !selectedCountry ? '#5BA5E0' : '#6A6A6A'
                }}
              >
                Africa
              </span>
            </button>

            {/* Country Buttons */}
            {africanCountries.slice(0, 10).map((country) => (
              <button
                key={country.name}
                onClick={() => setSelectedCountry(country.name)}
                className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md"
                style={{
                  backgroundColor: '#FAFAFA',
                  border: 'none',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                <img 
                  src={country.flag} 
                  alt={`${country.name} flag`}
                  className="w-3.5 h-2.5 object-cover rounded-sm"
                />
                <span 
                  className="text-xs font-normal whitespace-nowrap"
                  style={{ color: '#6A6A6A' }}
                >
                  {country.name}
                </span>
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
                     className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50 flex items-center rounded-xl px-4 py-3 shadow-lg animate-in slide-in-from-right duration-300"
                     style={{ 
                       backgroundColor: notification.type === 'success' ? '#F5FBFF' : '#FFFCF7',
                       border: notification.type === 'success' ? '1px solid #CFE8FC' : '1px solid #FCD79B',
                       width: '350px'
                     }}
                  >
                    {/* Product Image */}
                    <div className="relative mr-3">
                      <img
                        src={notification.product.image}
                        alt={notification.product.name}
                         className="w-10 h-10 object-cover rounded-lg"
                      />
                      {/* Bookmark Icon Badge */}
                      {notification.type === 'success' ? (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
                          <div className="w-3 h-3 rounded flex items-center justify-center" style={{ backgroundColor: '#64B5F6' }}>
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="#F9A825" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5v14l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">
                        {notification.type === 'success' ? (
                          <>
                            <span style={{ color: '#939393' }}>Added to </span>
                            <Link to="/bookmarks" className="underline hover:opacity-70" style={{ color: '#64B5F6' }}>Bookmarks</Link>
                          </>
                        ) : (
                          <>
                            <span style={{ color: '#939393' }}>Failed to add to </span>
                            <span style={{ color: '#F9A825' }}>Bookmarks</span>
                          </>
                        )}
                      </div>
                      <div className="text-xs truncate" style={{ color: '#939393' }}>
                        {notification.product.name} · ${notification.product.price}
                      </div>
                    </div>
                    
                    {/* Close Button */}
                  <button
                      onClick={() => removeNotification(notification.id)}
                      className="ml-2 hover:opacity-70 transition-opacity"
                      style={{ color: '#6A6A6A' }}
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
          {/* Conditional Layout: Category Sections for "All" or Regular Grid for Specific Category */}
          {activeCategory === 'All' && !isSearchActive ? (
            // Category Sections Layout
            (() => {
              // Check if any category has products after country filter
              const hasAnyProducts = categories.filter(cat => cat !== 'All').some((category) => {
                const categoryProducts = (allProducts[category as keyof typeof allProducts] || []);
                const filteredProducts = selectedCountry 
                  ? categoryProducts.filter(product => getProductCountry(product.id).name === selectedCountry)
                  : categoryProducts;
                return filteredProducts.length > 0;
              });

              // If no products found and country filter is active, show no results state
              if (!hasAnyProducts && selectedCountry) {
                return (
                  <div>
                    {/* No Results State */}
                    <div className="text-center" style={{ padding: window.innerWidth < 640 ? '32px 16px' : '48px 16px' }}>
                      {/* Shopping Bag with Magnifying Glass Icon */}
                      <img 
                        src={bagIcon} 
                        alt="No products found" 
                        className="mx-auto" 
                        style={{ 
                          width: window.innerWidth < 640 ? '40px' : '60px', 
                          height: window.innerWidth < 640 ? '40px' : '60px',
                          marginBottom: window.innerWidth < 640 ? '12px' : '16px'
                        }}
                      />
                      
                      {/* Message */}
                      <p style={{ 
                        fontSize: window.innerWidth < 640 ? '12px' : '18px', 
                        color: '#6A6A6A', 
                        fontFamily: 'Poppins, sans-serif', 
                        maxWidth: window.innerWidth < 640 ? '280px' : '500px', 
                        margin: window.innerWidth < 640 ? '0 auto 12px' : '0 auto 16px',
                        lineHeight: '1.5'
                      }}>
                        Can't find what you're looking for? don't worry, just ask for it and we will bring it for you.
                      </p>
                      
                      {/* Make a Request Button */}
                <button
                        onClick={() => setShowRequestModal(true)}
                        className="inline-flex items-center mx-auto"
                        style={{
                          display: 'flex',
                          padding: window.innerWidth < 640 ? '8px 16px' : '10px 20px',
                          alignItems: 'center',
                          gap: window.innerWidth < 640 ? '4px' : '6px',
                          borderRadius: '8px',
                          backgroundColor: '#F0F8FE',
                          color: '#64B5F6',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: window.innerWidth < 640 ? '11px' : '14px',
                          fontWeight: '500'
                        }}
                      >
                        <img src={draftsIcon} alt="Request" style={{ width: window.innerWidth < 640 ? '14px' : '20px', height: window.innerWidth < 640 ? '14px' : '20px' }} />
                        Make a request
                </button>
                    </div>

                    {/* Other Products Near You Section */}
                    <div style={{ marginTop: window.innerWidth < 640 ? '32px' : '48px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: window.innerWidth < 640 ? '16px' : '24px' }}>
                        <h3 className="font-semibold text-gray-900" style={{ 
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: window.innerWidth < 640 ? '14px' : '20px'
                        }}>
                          Other products near you
                        </h3>
                        <button className="font-medium hover:underline" style={{ 
                          color: '#64B5F6', 
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: window.innerWidth < 640 ? '10px' : '14px'
                        }}>
                          View more...
                        </button>
                      </div>
                      
                      {/* Product Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 md:gap-6">
                        {Object.values(allProducts).flat().slice(0, 6).map((product) => (
                          <Link key={product.id} to={`/product/${product.id}`} className="bg-white rounded-lg overflow-hidden transition-all duration-200 block group">
                            {/* Product Image - Top */}
                            <div className="aspect-square relative overflow-hidden mb-1 sm:mb-2" style={{ borderRadius: window.innerWidth < 640 ? '10px' : '12px' }}>
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                style={{ borderRadius: window.innerWidth < 640 ? '10px' : '12px' }}
                                loading="lazy"
                                width="200"
                                height="200"
                              />
                              
                              {/* Country Badge */}
                              <div className="absolute bg-white rounded-md shadow-sm" style={{ 
                                display: 'flex', 
                                padding: window.innerWidth < 640 ? '1px 4px' : '2px 6px', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                gap: window.innerWidth < 640 ? '2px' : '4px',
                                top: window.innerWidth < 640 ? '6px' : '8px',
                                left: window.innerWidth < 640 ? '6px' : '8px'
                              }}>
                                  <img 
                                    src={`https://flagcdn.com/w20/${getProductCountry(product.id).code}.png`}
                                    alt={getProductCountry(product.id).name}
                                    style={{ 
                                      width: window.innerWidth < 640 ? '10px' : '12px',
                                      height: window.innerWidth < 640 ? '7px' : '8px',
                                      objectFit: 'cover',
                                      borderRadius: '2px'
                                    }}
                                  />
                                  <span className="font-medium text-gray-800" style={{ fontSize: window.innerWidth < 640 ? '8px' : '12px' }}>
                                    {getProductCountry(product.id).abbreviation}
                                  </span>
                              </div>
                            </div>
                            
                            {/* Product Content */}
                            <div className="flex flex-col" style={{ padding: window.innerWidth < 640 ? '0 6px 6px 6px' : '0 12px 12px 12px' }}>
                              {/* Price and Verified Badge Row */}
                              <div className="flex items-center justify-between" style={{ marginBottom: window.innerWidth < 640 ? '4px' : '4px' }}>
                                <div className="font-bold text-gray-900" style={{ fontSize: window.innerWidth < 640 ? '12px' : '16px' }}>
                                  ${product.price}
                                </div>
                                {product.verified ? (
                                  <div className="flex items-center text-green-600 bg-green-50 rounded" style={{ 
                                    display: 'flex', 
                                    padding: window.innerWidth < 640 ? '1px 3px' : '1px 4px', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    gap: '1px', 
                                    fontSize: window.innerWidth < 640 ? '7px' : '9px' 
                                  }}>
                                    <img src={verifyIcon} alt="Verified" style={{ width: window.innerWidth < 640 ? '6px' : '8px', height: window.innerWidth < 640 ? '6px' : '8px' }} />
                                    <span>Verified seller</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center text-gray-600 bg-gray-100 rounded" style={{ 
                                    display: 'flex', 
                                    padding: window.innerWidth < 640 ? '1px 3px' : '1px 4px', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    gap: '1px', 
                                    fontSize: window.innerWidth < 640 ? '7px' : '9px' 
                                  }}>
                                    <img src={unverifyIcon} alt="Unverified" style={{ width: window.innerWidth < 640 ? '6px' : '8px', height: window.innerWidth < 640 ? '6px' : '8px' }} />
                                    <span>Unverified Seller</span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Product Name */}
                              <h3 className="line-clamp-2 font-medium" style={{ 
                                fontSize: window.innerWidth < 640 ? '10px' : '13px', 
                                color: '#212121',
                                marginBottom: window.innerWidth < 640 ? '4px' : '4px'
                              }}>
                                {product.name}
                              </h3>
                              
                              {/* Location and Bookmark Row */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-gray-500 flex-1">
                                  <img src={locationIcon} alt="Location" className="flex-shrink-0" style={{ 
                                    width: window.innerWidth < 640 ? '8px' : '10px',
                                    height: window.innerWidth < 640 ? '8px' : '10px',
                                    marginRight: window.innerWidth < 640 ? '3px' : '4px'
                                  }} />
                                  <span className="truncate font-normal" style={{ fontSize: window.innerWidth < 640 ? '8px' : '10px' }}>{product.location}</span>
                                </div>
                                {/* Bookmark Button */}
                  <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleSave(product.id);
                                  }}
                                  className="transition-colors touch-manipulation rounded"
                                  style={{ 
                                    width: window.innerWidth < 640 ? '16px' : '20px', 
                                    height: window.innerWidth < 640 ? '16px' : '20px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    marginLeft: window.innerWidth < 640 ? '4px' : '8px',
                                    backgroundColor: savedProducts.has(product.id) ? '#64B5F6' : 'transparent'
                                  }}
                  >
                    {savedProducts.has(product.id) ? (
                      <svg className="text-white" style={{ width: window.innerWidth < 640 ? '10px' : '12px', height: window.innerWidth < 640 ? '10px' : '12px' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                    <img 
                                    src={bookmarkIcon} 
                                    alt="Bookmark" 
                                    style={{
                                      width: window.innerWidth < 640 ? '16px' : '20px',
                                      height: window.innerWidth < 640 ? '16px' : '20px',
                                      filter: 'grayscale(100%) opacity(0.5)'
                                    }}
                    />
                    )}
                  </button>
                              </div>
                            </div>
                          </Link>
                ))}
              </div>
            </div>
          </div>
                );
              }

              // Otherwise, render category sections
              return (
                <div className="space-y-8">
                  {categories.filter(cat => cat !== 'All').map((category) => {
                    const categoryProducts = (allProducts[category as keyof typeof allProducts] || []);
                    // Filter products by selected country
                    const filteredProducts = selectedCountry 
                      ? categoryProducts.filter(product => getProductCountry(product.id).name === selectedCountry)
                      : categoryProducts;
                    if (filteredProducts.length === 0) return null;
                
                return (
                  <div key={category} className="mb-8">
                    {/* Category Header - Hidden on Mobile */}
          {window.innerWidth >= 640 && (
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
          )}
                    
                    {/* Category Products - Horizontal Scroll */}
                    <div className={filteredProducts.length <= 6 ? '' : 'overflow-x-auto scrollbar-hide'}>
                      <div className={filteredProducts.length <= 6 ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 md:gap-6' : 'flex gap-5 sm:gap-6'}>
                        {filteredProducts.slice(0, 12).map((product) => (
                          <Link key={product.id} to={`/product/${product.id}`} className={`bg-white rounded-lg overflow-hidden transition-all duration-200 block group ${filteredProducts.length > 6 ? 'flex-shrink-0' : ''}`} style={filteredProducts.length > 6 ? { width: '200px' } : {}}>
                            {/* Product Image - Top */}
                            <div className="aspect-square relative overflow-hidden mb-1 sm:mb-2" style={{ borderRadius: window.innerWidth < 640 ? '10px' : '12px' }}>
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                style={{ borderRadius: window.innerWidth < 640 ? '10px' : '12px' }}
                                loading="lazy"
                                width="200"
                                height="200"
                              />
                              
                              {/* Country Badge */}
                              <div className="absolute bg-white rounded-md shadow-sm" style={{ 
                                display: 'flex', 
                                padding: window.innerWidth < 640 ? '1px 4px' : '2px 6px', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                gap: window.innerWidth < 640 ? '2px' : '4px',
                                top: window.innerWidth < 640 ? '6px' : '8px',
                                left: window.innerWidth < 640 ? '6px' : '8px'
                              }}>
                                <img 
                                  src={getProductCountry(product.id).flag} 
                                  alt={getProductCountry(product.id).name}
                                  style={{ 
                                    width: window.innerWidth < 640 ? '10px' : '12px',
                                    height: window.innerWidth < 640 ? '7px' : '8px',
                                    objectFit: 'cover',
                                    borderRadius: '2px'
                                  }}
                                />
                                <span className="font-medium text-gray-800" style={{ fontSize: window.innerWidth < 640 ? '8px' : '12px' }}>
                                  {getProductCountry(product.id).abbreviation}
                                </span>
                              </div>
                            </div>
                            
                            {/* Product Content */}
                            <div className="flex flex-col" style={{ padding: window.innerWidth < 640 ? '0 6px 6px 6px' : '0 12px 12px 12px' }}>
                              {/* Price and Verified Badge Row */}
                              <div className="flex items-center justify-between" style={{ marginBottom: window.innerWidth < 640 ? '4px' : '4px' }}>
                                <div className="font-bold text-gray-900" style={{ fontSize: window.innerWidth < 640 ? '12px' : '16px' }}>
                                ${product.price}
                              </div>
                                {product.verified ? (
                                  <div className="flex items-center text-green-600 bg-green-50 rounded" style={{ 
                                    display: 'flex', 
                                    padding: window.innerWidth < 640 ? '1px 3px' : '1px 4px', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    gap: '1px', 
                                    fontSize: window.innerWidth < 640 ? '7px' : '9px' 
                                  }}>
                                    <img src={verifyIcon} alt="Verified" style={{ width: window.innerWidth < 640 ? '6px' : '8px', height: window.innerWidth < 640 ? '6px' : '8px' }} />
                                    <span>Verified seller</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center text-gray-600 bg-gray-100 rounded" style={{ 
                                    display: 'flex', 
                                    padding: window.innerWidth < 640 ? '1px 3px' : '1px 4px', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    gap: '1px', 
                                    fontSize: window.innerWidth < 640 ? '7px' : '9px' 
                                  }}>
                                    <img src={unverifyIcon} alt="Unverified" style={{ width: window.innerWidth < 640 ? '6px' : '8px', height: window.innerWidth < 640 ? '6px' : '8px' }} />
                                    <span>Unverified Seller</span>
                                  </div>
                                )}
            </div>
                              
                              {/* Product Name */}
                              <h3 className="line-clamp-2 font-medium" style={{ 
                                fontSize: window.innerWidth < 640 ? '10px' : '13px', 
                                color: '#212121',
                                marginBottom: window.innerWidth < 640 ? '4px' : '4px'
                              }}>{product.name}</h3>
                              
                              {/* Location and Bookmark Row - Below Product Name */}
                              <div className="flex items-center justify-between">
                                {/* Location */}
                                <div className="flex items-center text-gray-500 flex-1">
                                  <img src={locationIcon} alt="Location" className="flex-shrink-0" style={{ 
                                    width: window.innerWidth < 640 ? '8px' : '10px',
                                    height: window.innerWidth < 640 ? '8px' : '10px',
                                    marginRight: window.innerWidth < 640 ? '3px' : '4px'
                                  }} />
                                  <span className="truncate font-normal" style={{ fontSize: window.innerWidth < 640 ? '8px' : '10px' }}>{product.location}</span>
                              </div>
                                
                                {/* Bookmark Button */}
                                <div style={{ marginLeft: window.innerWidth < 640 ? '4px' : '8px' }}>
                                    <button 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleSave(product.id);
                                      }}
                                   className="transition-colors touch-manipulation"
                                      title={savedProducts.has(product.id) ? 'Remove from saved' : 'Save product'}
                                      style={{ 
                                        width: window.innerWidth < 640 ? '16px' : '20px', 
                                        height: window.innerWidth < 640 ? '16px' : '20px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center' 
                                      }}
                                    >
                                      <img src={bookmarkIcon} alt="Bookmark" style={{
                                        width: window.innerWidth < 640 ? '16px' : '20px',
                                        height: window.innerWidth < 640 ? '16px' : '20px',
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
              );
            })()
          ) : (
            // Regular Grid Layout for Specific Category or Search
            <>
          {/* Section Header - Hide when no search results */}
          {!shouldShowNoResultsState() && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <h2 className="text-[20px] font-semibold text-gray-900">
                  {activeCategory}
                </h2>
              <svg className="w-5 h-5 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
              {getProductsToDisplay().length > 0 && (
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
              )}
          </div>
          )}

          {/* Products Grid */}
          {shouldShowNoResultsState() ? (
            <div>
              {/* No Results State */}
            <div className="text-center" style={{ padding: window.innerWidth < 640 ? '32px 16px' : '48px 16px' }}>
                {/* Shopping Bag with Magnifying Glass Icon */}
                <img 
                  src={bagIcon} 
                  alt="No products found" 
                  className="mx-auto" 
                  style={{ 
                    width: window.innerWidth < 640 ? '40px' : '60px', 
                    height: window.innerWidth < 640 ? '40px' : '60px',
                    marginBottom: window.innerWidth < 640 ? '12px' : '16px'
                  }}
                />
                
                {/* Message */}
                <p style={{ 
                  fontSize: window.innerWidth < 640 ? '12px' : '18px', 
                  color: '#6A6A6A', 
                  fontFamily: 'Poppins, sans-serif', 
                  maxWidth: window.innerWidth < 640 ? '280px' : '500px', 
                  margin: window.innerWidth < 640 ? '0 auto 12px' : '0 auto 16px',
                  lineHeight: '1.5'
                }}>
                  Can't find what you're looking for? don't worry, just ask for it and we will bring it for you.
                </p>
                
                {/* Make a Request Button */}
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="inline-flex items-center mx-auto"
                  style={{
                    display: 'flex',
                    padding: window.innerWidth < 640 ? '8px 16px' : '10px 20px',
                    alignItems: 'center',
                    gap: window.innerWidth < 640 ? '4px' : '6px',
                    borderRadius: '8px',
                    backgroundColor: '#F0F8FE',
                    color: '#64B5F6',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: window.innerWidth < 640 ? '11px' : '14px',
                    fontWeight: '500'
                  }}
                >
                  <img src={draftsIcon} alt="Request" style={{ width: window.innerWidth < 640 ? '14px' : '20px', height: window.innerWidth < 640 ? '14px' : '20px' }} />
                  Make a request
                </button>
              </div>

              {/* Other Products Near You Section */}
              <div style={{ marginTop: window.innerWidth < 640 ? '32px' : '48px' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: window.innerWidth < 640 ? '16px' : '24px' }}>
                  <h3 className="font-semibold text-gray-900" style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: window.innerWidth < 640 ? '14px' : '20px'
                  }}>
                    Other products near you
                  </h3>
                  <button className="font-medium hover:underline" style={{ 
                    color: '#64B5F6', 
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: window.innerWidth < 640 ? '10px' : '14px'
                  }}>
                    View more...
                  </button>
            </div>
                
                {/* Product Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 md:gap-6">
                  {Object.values(allProducts).flat().slice(0, 6).map((product) => (
                    <Link key={product.id} to={`/product/${product.id}`} className="bg-white rounded-lg overflow-hidden transition-all duration-200 block group">
                      {/* Product Image - Top */}
                      <div className="aspect-square relative overflow-hidden mb-1 sm:mb-2" style={{ borderRadius: window.innerWidth < 640 ? '10px' : '12px' }}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          style={{ borderRadius: window.innerWidth < 640 ? '10px' : '12px' }}
                    loading="lazy"
                    width="200"
                    height="200"
                  />
                        
                        {/* Country Badge */}
                        <div className="absolute bg-white rounded-md shadow-sm" style={{ 
                          display: 'flex', 
                          padding: window.innerWidth < 640 ? '1px 4px' : '2px 6px', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: window.innerWidth < 640 ? '2px' : '4px',
                          top: window.innerWidth < 640 ? '6px' : '8px',
                          left: window.innerWidth < 640 ? '6px' : '8px'
                        }}>
                          <img 
                            src={getProductCountry(product.id).flag} 
                            alt={getProductCountry(product.id).name}
                            style={{ 
                              width: window.innerWidth < 640 ? '10px' : '12px',
                              height: window.innerWidth < 640 ? '7px' : '8px',
                              objectFit: 'cover',
                              borderRadius: '2px'
                            }}
                          />
                          <span className="font-medium text-gray-800" style={{ fontSize: window.innerWidth < 640 ? '8px' : '12px' }}>
                            {getProductCountry(product.id).abbreviation}
                          </span>
                </div>
                      </div>
                      
                      {/* Product Content */}
                      <div className="flex flex-col" style={{ padding: window.innerWidth < 640 ? '0 6px 6px 6px' : '0 12px 12px 12px' }}>
                        {/* Price and Verified Badge Row */}
                        <div className="flex items-center justify-between" style={{ marginBottom: window.innerWidth < 640 ? '4px' : '4px' }}>
                          <div className="font-bold text-gray-900" style={{ fontSize: window.innerWidth < 640 ? '12px' : '16px' }}>
                    ${product.price}
                  </div>
                          {product.verified ? (
                            <div className="flex items-center text-green-600 bg-green-50 rounded" style={{ 
                              display: 'flex', 
                              padding: window.innerWidth < 640 ? '1px 3px' : '1px 4px', 
                              justifyContent: 'center', 
                              alignItems: 'center', 
                              gap: '1px', 
                              fontSize: window.innerWidth < 640 ? '7px' : '9px' 
                            }}>
                              <img src={verifyIcon} alt="Verified" style={{ width: window.innerWidth < 640 ? '6px' : '8px', height: window.innerWidth < 640 ? '6px' : '8px' }} />
                              <span>Verified seller</span>
                  </div>
                          ) : (
                            <div className="flex items-center text-gray-600 bg-gray-100 rounded" style={{ 
                              display: 'flex', 
                              padding: window.innerWidth < 640 ? '1px 3px' : '1px 4px', 
                              justifyContent: 'center', 
                              alignItems: 'center', 
                              gap: '1px', 
                              fontSize: window.innerWidth < 640 ? '7px' : '9px' 
                            }}>
                              <img src={unverifyIcon} alt="Unverified" style={{ width: window.innerWidth < 640 ? '6px' : '8px', height: window.innerWidth < 640 ? '6px' : '8px' }} />
                              <span>Unverified Seller</span>
                      </div>
                          )}
                        </div>
                        
                        {/* Product Name */}
                        <h3 className="line-clamp-2 font-medium" style={{ 
                          fontSize: window.innerWidth < 640 ? '10px' : '13px', 
                          color: '#212121',
                          marginBottom: window.innerWidth < 640 ? '4px' : '4px'
                        }}>
                          {product.name}
                        </h3>
                        
                        {/* Location and Bookmark Row */}
                    <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-500 flex-1">
                            <img src={locationIcon} alt="Location" className="flex-shrink-0" style={{ 
                              width: window.innerWidth < 640 ? '8px' : '10px',
                              height: window.innerWidth < 640 ? '8px' : '10px',
                              marginRight: window.innerWidth < 640 ? '3px' : '4px'
                            }} />
                            <span className="truncate font-normal" style={{ fontSize: window.innerWidth < 640 ? '8px' : '10px' }}>{product.location}</span>
                      </div>
                          {/* Bookmark Button */}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            handleSave(product.id);
                          }}
                            className="transition-colors touch-manipulation"
                            style={{ 
                              width: window.innerWidth < 640 ? '16px' : '20px', 
                              height: window.innerWidth < 640 ? '16px' : '20px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              marginLeft: window.innerWidth < 640 ? '4px' : '8px'
                            }}
                        >
                            <img 
                              src={bookmarkIcon} 
                              alt="Bookmark" 
                              style={{
                                width: window.innerWidth < 640 ? '16px' : '20px',
                                height: window.innerWidth < 640 ? '16px' : '20px',
                                filter: savedProducts.has(product.id) ? 'none' : 'grayscale(100%) opacity(0.5)'
                              }}
                            />
                        </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
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

      {/* Pagination - Mobile Responsive - Hide when no search results */}
      {!shouldShowNoResultsState() && (
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Pagination */}
          <div className="md:hidden flex items-center justify-center relative px-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 font-normal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontSize: '14px', color: '#BABABA' }}
              >
                Previous
              </button>
              <div className="flex space-x-0.5">
                {(() => {
                  const pages = [];
                  const showPages = [];
                  
                  if (totalPages <= 5) {
                    for (let i = 1; i <= totalPages; i++) showPages.push(i);
                  } else {
                    if (currentPage <= 3) {
                      showPages.push(1, 2, 3, '...', totalPages);
                    } else if (currentPage >= totalPages - 2) {
                      showPages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
                    } else {
                      showPages.push(1, '...', currentPage, '...', totalPages);
                    }
                  }
                  
                  return (
                    <>
                      {showPages.map((page, index) => (
                        page === '...' ? (
                          <span key={`ellipsis-${index}`} className="px-2 py-1 font-normal" style={{ fontSize: '14px', color: '#BABABA' }}>
                            ...
                          </span>
                        ) : (
                  <button
                            key={page}
                            onClick={() => setCurrentPage(page as number)}
                            className="px-2 py-1 font-normal transition-colors relative"
                            style={{ fontSize: '14px', color: page === currentPage ? '#212121' : '#BABABA' }}
                  >
                    {page}
                            {page === currentPage && (
                              <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-4 h-0.5" style={{ backgroundColor: '#212121' }}></div>
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
                className="px-2 py-1 font-normal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontSize: '14px', color: '#212121' }}
              >
                Next
              </button>
              <div className="flex items-center ml-2">
                <span className="px-2 py-0.5 rounded font-normal border text-xs" style={{ color: '#212121', backgroundColor: '#F5F5F5', borderColor: '#E4E4E4' }}>
                  {currentPage}
                </span>
                <span className="mx-1 font-normal" style={{ fontSize: '14px', color: '#BABABA' }}>/</span>
                <span className="font-normal" style={{ fontSize: '14px', color: '#BABABA' }}>
                  {totalPages}
                </span>
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
      )}

      {/* Buy & Sell Instantly Section */}
      <section className="py-16 px-6 sm:px-8 lg:px-16" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-6 sm:mb-8">
            <div className="flex-1">
              <h2 className="mb-3 sm:mb-4" style={{ fontSize: window.innerWidth < 640 ? '20px' : '44px', fontWeight: '600', lineHeight: '1.2' }}>
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
              <p style={{ fontSize: window.innerWidth < 640 ? '9px' : '16px', color: '#9C9C9C', maxWidth: window.innerWidth < 640 ? '220px' : '600px', lineHeight: '1.6' }}>
                Turn unmet needs into instant deals, discover what people are looking for, grab it, and sell it right where demand begins
              </p>
            </div>
            <div className="text-right">
              <div style={{ 
                fontSize: window.innerWidth < 640 ? '20px' : '44px', 
                fontWeight: '600',
                background: 'linear-gradient(90deg, #E55325 0%, #F9A825 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Over 400
              </div>
              <div style={{ fontSize: window.innerWidth < 640 ? '10px' : '18px', color: '#9C9C9C', marginTop: '4px' }}>
                Request availables
              </div>
            </div>
          </div>

          {/* Filter Bar Section */}
          <div className={window.innerWidth < 640 ? "flex flex-col gap-5 mb-6 mt-8" : "flex items-center gap-4 mb-8 mt-20"}>
            {/* Buyer Location Search Bar - Top on Mobile */}
            <div style={{ width: window.innerWidth < 640 ? '100%' : '380px', marginLeft: window.innerWidth < 640 ? '0' : 'auto', order: window.innerWidth < 640 ? 1 : 3 }}>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Buyer location ?"
                  className="w-full border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E4E4E4',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: window.innerWidth < 640 ? '10px' : '14px',
                    color: '#6A6A6A',
                    padding: window.innerWidth < 640 ? '6px 50px 6px 10px' : '10px 112px 10px 16px'
                  }}
                />
                <div 
                  className="absolute right-2 flex items-center justify-center"
                  style={{ 
                    backgroundColor: '#F9A825',
                    height: window.innerWidth < 640 ? '20px' : '28px',
                    paddingLeft: window.innerWidth < 640 ? '10px' : '18px',
                    paddingRight: window.innerWidth < 640 ? '10px' : '18px',
                    borderRadius: '8px'
                  }}
                >
                  <img src={buyerIcon} alt="Search" style={{ width: window.innerWidth < 640 ? '12px' : '16px', height: window.innerWidth < 640 ? '12px' : '16px' }} />
                </div>
              </div>
            </div>

            {/* Filter and Price Buttons Row - Bottom on Mobile */}
            <div className={window.innerWidth < 640 ? "flex gap-2" : "contents"} style={{ order: window.innerWidth < 640 ? 2 : 1 }}>
              {/* Filter Button */}
              <button 
                className="flex items-center border transition-colors hover:bg-gray-50"
                style={{ 
                  backgroundColor: '#FAFAFA',
                  borderColor: '#E4E4E4',
                  padding: window.innerWidth < 640 ? '5px 7px' : '8px 10px',
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif',
                  gap: window.innerWidth < 640 ? '4px' : '6px',
                  flex: window.innerWidth < 640 ? '0 1 auto' : 'initial',
                  maxWidth: window.innerWidth < 640 ? '45%' : 'none'
                }}
              >
                <span style={{ color: '#BABABA', fontSize: window.innerWidth < 640 ? '10px' : '14px', fontWeight: 'normal' }}>Filter :</span>
                <img src={earthIcon} alt="Globe" style={{ width: window.innerWidth < 640 ? '16px' : '22px', height: window.innerWidth < 640 ? '16px' : '22px' }} />
                <span style={{ color: '#6A6A6A', fontSize: window.innerWidth < 640 ? '10px' : '14px' }}>Africa</span>
                <img src={arrowDownIcon} alt="Arrow" style={{ width: window.innerWidth < 640 ? '12px' : '16px', height: window.innerWidth < 640 ? '12px' : '16px' }} />
              </button>

              {/* Price Button */}
              <button 
                className="flex items-center border transition-colors hover:bg-gray-50"
                style={{ 
                  backgroundColor: '#FAFAFA',
                  borderColor: '#E4E4E4',
                  padding: window.innerWidth < 640 ? '5px 8px' : '8px 14px',
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif',
                  gap: window.innerWidth < 640 ? '4px' : '6px',
                  flex: window.innerWidth < 640 ? '0 1 auto' : 'initial',
                  maxWidth: window.innerWidth < 640 ? '35%' : 'none'
                }}
              >
                <span style={{ color: '#BABABA', fontSize: window.innerWidth < 640 ? '10px' : '14px', fontWeight: 'normal' }}>Price :</span>
                <span style={{ color: '#6A6A6A', fontSize: window.innerWidth < 640 ? '10px' : '14px' }}>All</span>
                <img src={arrowDownIcon} alt="Arrow" style={{ width: window.innerWidth < 640 ? '12px' : '16px', height: window.innerWidth < 640 ? '12px' : '16px' }} />
              </button>
            </div>
          </div>

          {/* Request Cards Section */}
          <div className="relative">
            {/* Fade effect on the right - Desktop only */}
            {window.innerWidth >= 640 && (
              <div 
                className="absolute top-0 right-0 bottom-0 w-32 pointer-events-none z-10"
                style={{
                  background: 'linear-gradient(to left, white 0%, rgba(255, 255, 255, 0.8) 30%, transparent 100%)',
                  height: 'calc(100% - 4rem)'
                }}
              />
            )}
            <div 
              className={window.innerWidth < 640 ? "flex gap-4 mb-6 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6"}
              style={window.innerWidth < 640 ? { 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              } : {}}
            >
              {[1, 2, 3].map((index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl hover:shadow-md transition-shadow"
                  style={{ 
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
                    height: 'auto',
                    width: window.innerWidth < 640 ? '260px' : 'auto',
                    flexShrink: window.innerWidth < 640 ? 0 : 'initial',
                    padding: window.innerWidth < 640 ? '10px' : '16px'
                  }}
                >
                  {/* Product Name Label and Button - Desktop only */}
                  {window.innerWidth >= 640 && (
                    <div className="flex items-center justify-between mb-0">
                      <span style={{ fontSize: '12px', color: '#9C9C9C' }}>Product name</span>
                      <button 
                        className="px-3 py-1 rounded-lg text-white"
                        style={{ backgroundColor: '#F9A825', fontWeight: 'normal', fontSize: '12px' }}
                      >
                        Manage request
                      </button>
                    </div>
                  )}

                  {/* Product Name Label Only - Mobile */}
                  {window.innerWidth < 640 && (
                    <div className="mb-1">
                      <span style={{ fontSize: '9px', color: '#9C9C9C' }}>Product name</span>
                    </div>
                  )}

                  {/* Product Title */}
                  <h3 className="mb-2 sm:mb-3" style={{ fontSize: window.innerWidth < 640 ? '11px' : '14px', fontWeight: '500', color: '#212121' }}>
                    Snails from South Africa
                  </h3>

                  {/* Description */}
                  <p className="mb-3 sm:mb-4" style={{ fontSize: window.innerWidth < 640 ? '7px' : '10px', color: '#6A6A6A', lineHeight: '1.5', fontWeight: 'normal' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>

                  {/* Tags and User Info Row - Desktop/Tablet */}
                  {window.innerWidth >= 640 && (
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
                            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#8B5E3C"/>
                            <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#8B5E3C"/>
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
                  )}

                  {/* Tags - Mobile Only */}
                  {window.innerWidth < 640 && (
                    <div className="flex flex-col gap-2 mb-3">
                      {/* First Row - Location */}
                      <div 
                        className="flex items-center gap-1 px-2 py-1"
                        style={{ backgroundColor: '#F0F8FE', borderRadius: '6px', width: 'fit-content' }}
                      >
                        <img 
                          src={locationIcon} 
                          alt="Location"
                          style={{ 
                            width: '9px',
                            height: '9px',
                            filter: 'brightness(0) saturate(100%) invert(64%) sepia(52%) saturate(555%) hue-rotate(176deg) brightness(97%) contrast(92%)'
                          }}
                        />
                        <span style={{ fontSize: '8px', color: '#64B5F6', fontWeight: '300' }}>London, United Kingdom</span>
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
                            style={{ 
                              width: '9px',
                              height: '9px',
                              filter: 'brightness(0) saturate(100%) invert(64%) sepia(52%) saturate(555%) hue-rotate(176deg) brightness(97%) contrast(92%)'
                            }}
                          />
                          <span style={{ fontSize: '8px', color: '#64B5F6', fontWeight: '300' }}>50 ~ 100 USD</span>
                        </div>

                        {/* Country Tag */}
                        <div 
                          className="flex items-center gap-1.5 px-3 py-1.5"
                          style={{ backgroundColor: '#F0F8FE', borderRadius: '6px' }}
                        >
                          <img 
                            src="https://flagcdn.com/w20/za.png" 
                            alt="South Africa"
                            style={{ 
                              width: '11px',
                              height: '8px',
                              objectFit: 'cover',
                              borderRadius: '2px'
                            }}
                          />
                          <span style={{ fontSize: '8px', color: '#64B5F6', fontWeight: '300' }}>South Africa</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User Profile Section - Mobile (New Layout) */}
                  {window.innerWidth < 640 && (
                    <>
                      {/* Gray Divider */}
                      <div style={{ width: '100%', height: '0.5px', backgroundColor: '#E4E4E4', marginBottom: '8px' }}></div>
                      
                      <div className="flex items-center justify-between">
                        {/* Left: Avatar and User Info */}
                        <div className="flex items-center gap-2">
                          <div 
                            className="rounded-full flex items-center justify-center overflow-hidden"
                            style={{ 
                              backgroundColor: '#F7C9B0',
                              width: '24px',
                              height: '24px'
                            }}
                          >
                            <svg 
                              style={{ width: '14px', height: '14px' }} 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#8B5E3C"/>
                              <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#8B5E3C"/>
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span style={{ fontSize: '7px', color: '#BABABA', fontWeight: 'normal' }}>User profile</span>
                            <span style={{ fontSize: '8px', color: '#212121', fontWeight: '500' }}>Seraphin DIKOUM</span>
                          </div>
                        </div>

                        {/* Right: Rating */}
                        <div className="flex items-center gap-0.5">
                          <svg 
                            className="text-yellow-500" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                            style={{ width: '8px', height: '8px' }}
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span style={{ fontSize: '8px', color: '#212121', fontWeight: '500' }}>4.3</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Respond to the request button - Mobile only */}
                  {window.innerWidth < 640 && (
                    <button 
                      className="w-full mt-3 text-white"
                      style={{ 
                        backgroundColor: '#F9A825', 
                        fontWeight: 'normal', 
                        fontSize: '9px',
                        padding: '6px 10px',
                        borderRadius: '6px'
                      }}
                    >
                      Respond to the request
                    </button>
                  )}
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

      {/* Request Modal Overlay */}
      {showRequestModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#0000001A',
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setShowRequestModal(false)}
        >
          {/* Request Modal */}
          <div 
            style={{
              width: window.innerWidth < 640 ? '90%' : '580px',
              maxWidth: window.innerWidth < 640 ? '360px' : '580px',
              height: 'auto',
              maxHeight: '90vh',
              flexShrink: 0,
              borderRadius: window.innerWidth < 640 ? '20px' : '30px',
              background: '#FFF',
              padding: window.innerWidth < 640 ? '16px 20px' : '24px 32px',
              position: 'relative',
              fontFamily: 'Poppins, sans-serif',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between" style={{ marginBottom: window.innerWidth < 640 ? '12px' : '16px' }}>
              <h2 style={{ fontSize: window.innerWidth < 640 ? '14px' : '18px', color: '#212121', fontWeight: '600' }}>
                Do a request
              </h2>
              <button 
                onClick={() => setShowRequestModal(false)}
                style={{
                  width: window.innerWidth < 640 ? '20px' : '24px',
                  height: window.innerWidth < 640 ? '20px' : '24px',
                  color: '#212121',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: window.innerWidth < 640 ? '18px' : '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            {/* Product Name Input */}
            <div style={{ marginBottom: window.innerWidth < 640 ? '10px' : '12px' }}>
              <label style={{ fontSize: window.innerWidth < 640 ? '10px' : '12px', color: '#6A6A6A', display: 'block', marginBottom: window.innerWidth < 640 ? '4px' : '6px' }}>
                Product name
              </label>
              <input 
                type="text"
                value={requestProductName}
                onChange={(e) => setRequestProductName(e.target.value)}
                placeholder="Enter product name"
                style={{
                  width: '100%',
                  padding: window.innerWidth < 640 ? '6px 10px' : '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E4E4E4',
                  fontSize: window.innerWidth < 640 ? '10px' : '12px',
                  fontFamily: 'Poppins, sans-serif',
                  outline: 'none'
                }}
              />
            </div>

            {/* Product Origin Input */}
            <div style={{ marginBottom: window.innerWidth < 640 ? '10px' : '12px' }}>
              <label style={{ fontSize: window.innerWidth < 640 ? '10px' : '12px', color: '#6A6A6A', display: 'block', marginBottom: window.innerWidth < 640 ? '4px' : '6px' }}>
                Product Origin
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text"
                  value={requestProductOrigin}
                  onChange={(e) => setRequestProductOrigin(e.target.value)}
                  placeholder="Choose a location"
                  style={{
                    width: '100%',
                    padding: window.innerWidth < 640 ? '6px 10px' : '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #E4E4E4',
                    fontSize: window.innerWidth < 640 ? '10px' : '12px',
                    fontFamily: 'Poppins, sans-serif',
                    outline: 'none',
                    color: requestProductOrigin ? '#212121' : '#D9D9D9'
                  }}
                />
                <svg 
                  style={{ position: 'absolute', right: window.innerWidth < 640 ? '10px' : '12px', top: '50%', transform: 'translateY(-50%)', width: window.innerWidth < 640 ? '12px' : '14px', height: window.innerWidth < 640 ? '12px' : '14px' }}
                  fill="none" 
                  stroke="#6A6A6A" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Description Input */}
            <div style={{ marginBottom: window.innerWidth < 640 ? '10px' : '12px' }}>
              <label style={{ fontSize: window.innerWidth < 640 ? '10px' : '12px', color: '#6A6A6A', display: 'block', marginBottom: window.innerWidth < 640 ? '4px' : '6px' }}>
                Description
              </label>
              <textarea 
                value={requestDescription}
                onChange={(e) => setRequestDescription(e.target.value)}
                placeholder="Add an description"
                rows={window.innerWidth < 640 ? 2 : 3}
                style={{
                  width: '100%',
                  padding: window.innerWidth < 640 ? '6px 10px' : '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E4E4E4',
                  fontSize: window.innerWidth < 640 ? '9px' : '11px',
                  fontFamily: 'Poppins, sans-serif',
                  outline: 'none',
                  resize: 'none',
                  color: requestDescription ? '#212121' : '#D9D9D9'
                }}
              />
            </div>

            {/* Location Section */}
            <div style={{ marginBottom: window.innerWidth < 640 ? '12px' : '16px' }}>
              <label style={{ fontSize: window.innerWidth < 640 ? '10px' : '12px', color: '#6A6A6A', display: 'block', marginBottom: window.innerWidth < 640 ? '-2px' : '-4px' }}>
                Your location
              </label>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: window.innerWidth < 640 ? '10px' : '12px', color: '#64B5F6' }}>
                  London, United Kingdom
                </span>
                <button 
                  style={{
                    padding: window.innerWidth < 640 ? '4px 8px' : '6px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#F0F8FE',
                    color: '#64B5F6',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: window.innerWidth < 640 ? '9px' : '12px',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  Change location
                </button>
              </div>
            </div>

            {/* Price Range Section */}
            <div style={{ marginBottom: window.innerWidth < 640 ? '12px' : '16px' }}>
              <h3 style={{ fontSize: window.innerWidth < 640 ? '11px' : '14px', color: '#212121', marginBottom: window.innerWidth < 640 ? '8px' : '10px', fontWeight: '500' }}>
                How much would you like to pay for the product?
              </h3>
              <div className="flex gap-2" style={{ marginBottom: window.innerWidth < 640 ? '6px' : '8px', flexWrap: 'wrap' }}>
                {['Less than 10 USD', '10 - 50 USD', '50 - 100 USD', '100 - 200 USD'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setRequestPriceRange(range)}
                    style={{
                      width: window.innerWidth < 640 ? 'calc(50% - 4px)' : '110px',
                      padding: window.innerWidth < 640 ? '6px 8px' : '8px 10px',
                      borderRadius: '8px',
                      border: `1px solid ${requestPriceRange === range ? '#64B5F6' : '#E4E4E4'}`,
                      backgroundColor: requestPriceRange === range ? '#F0F8FE' : '#FFF',
                      color: requestPriceRange === range ? '#64B5F6' : '#6A6A6A',
                      cursor: 'pointer',
                      fontSize: window.innerWidth < 640 ? '9px' : '12px',
                      fontFamily: 'Poppins, sans-serif',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setRequestPriceRange('More than 200 USD')}
                style={{
                  width: window.innerWidth < 640 ? '100%' : '228px',
                  padding: window.innerWidth < 640 ? '6px 8px' : '8px 10px',
                  borderRadius: '8px',
                  border: `1px solid ${requestPriceRange === 'More than 200 USD' ? '#64B5F6' : '#E4E4E4'}`,
                  backgroundColor: requestPriceRange === 'More than 200 USD' ? '#F0F8FE' : '#FFF',
                  color: requestPriceRange === 'More than 200 USD' ? '#64B5F6' : '#6A6A6A',
                  cursor: 'pointer',
                  fontSize: window.innerWidth < 640 ? '9px' : '12px',
                  fontFamily: 'Poppins, sans-serif',
                  textAlign: 'center'
                }}
              >
                More than 200 USD
              </button>
            </div>

            {/* Create Request Button */}
            <button
              style={{
                display: 'flex',
                width: window.innerWidth < 640 ? '100%' : '480px',
                height: window.innerWidth < 640 ? '36px' : '40px',
                padding: window.innerWidth < 640 ? '8px' : '10px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                flexShrink: 0,
                borderRadius: '8px',
                backgroundColor: '#F9A825',
                color: '#FFF',
                border: 'none',
                cursor: 'pointer',
                fontSize: window.innerWidth < 640 ? '11px' : '14px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '400',
                margin: '0 auto'
              }}
              onClick={async () => {
                // Validate form
                if (!requestProductName || !requestProductOrigin || !requestDescription || !requestPriceRange) {
                  alert('Please fill all fields');
                  return;
                }
                
                setIsSubmittingRequest(true);
                
                // Simulate API call with loading state
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                setIsSubmittingRequest(false);
                setShowRequestModal(false);
                setShowConfirmationModal(true);
                
                // Reset form
                setRequestProductName('');
                setRequestProductOrigin('');
                setRequestDescription('');
                setRequestPriceRange('');
              }}
              disabled={isSubmittingRequest}
            >
              {isSubmittingRequest ? 'Submitting...' : 'Create the request'}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#0000001A',
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setShowConfirmationModal(false)}
        >
          {/* Confirmation Modal Content */}
          <div 
            style={{
              width: window.innerWidth < 640 ? '90%' : '520px',
              maxWidth: window.innerWidth < 640 ? '340px' : '520px',
              height: 'auto',
              borderRadius: window.innerWidth < 640 ? '20px' : '30px',
              background: '#FFF',
              padding: window.innerWidth < 640 ? '24px 28px' : '32px 40px',
              position: 'relative',
              fontFamily: 'Poppins, sans-serif',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Verify Icon */}
            <div style={{ marginBottom: window.innerWidth < 640 ? '12px' : '16px', display: 'flex', justifyContent: 'center' }}>
              <img src={verifyIcon} alt="Success" style={{ width: window.innerWidth < 640 ? '50px' : '70px', height: window.innerWidth < 640 ? '50px' : '70px' }} />
            </div>

            {/* Success Message */}
            <h2 style={{ fontSize: window.innerWidth < 640 ? '14px' : '18px', color: '#212121', fontWeight: '500', marginBottom: window.innerWidth < 640 ? '8px' : '10px' }}>
              Your request has been registered
            </h2>

            {/* Description */}
            <p style={{ fontSize: window.innerWidth < 640 ? '10px' : '13px', color: '#6A6A6A', marginBottom: window.innerWidth < 640 ? '16px' : '24px', lineHeight: '1.6' }}>
              Lorem ipsum dolor sit amet consectetur. Molestie etiam mattis ornare adipiscing adipiscing
            </p>

            {/* Close Button */}
            <button
              onClick={() => setShowConfirmationModal(false)}
              style={{
                display: 'flex',
                width: '100%',
                height: window.innerWidth < 640 ? '36px' : '40px',
                padding: window.innerWidth < 640 ? '8px' : '10px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                flexShrink: 0,
                borderRadius: '8px',
                backgroundColor: '#F9A825',
                color: '#FFF',
                border: 'none',
                cursor: 'pointer',
                fontSize: window.innerWidth < 640 ? '11px' : '14px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '400',
                margin: '0 auto'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
