import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";

// Import product images
import mainImage from "../assets/images/logos/0.png";
import africanTextileImage from "../assets/images/logos/Fashion.png";
import basketImage from "../assets/images/logos/culture.png";
import woodenCombImage from "../assets/images/logos/decor.png";
import thumbnailImage1 from "../assets/images/logos/1.png";
import thumbnailImage2 from "../assets/images/logos/2.png";
import thumbnailImage3 from "../assets/images/logos/3.png";
import sellerAvatar from "../assets/images/logos/avatar.png";

// Import new product images from pre folder
import pre1 from "../assets/images/pre/1.png";
import pre2 from "../assets/images/pre/2.png";
import pre3 from "../assets/images/pre/3.png";
import pre4 from "../assets/images/pre/4.png";
import pre5 from "../assets/images/pre/5.png";
import pre6 from "../assets/images/pre/6.png";

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
import locationIcon from '../assets/images/pre/PL.svg';
import pencilIcon from '../assets/images/pre/pencil.svg';

import { useToast } from "../contexts/ToastContext";

// Country mapping for products
const getProductCountry = (productId: number) => {
  const countryMap: {
    [key: number]: { name: string; code: string; flag: string; abbreviation: string; };
  } = {
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

interface Seller {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  rating?: number;
  reviewCount?: number;
  verified?: boolean;
  location?: string;
  joinDate?: string;
  description?: string;
  website?: string;
}

interface ProductImage {
  key: string;
  url: string;
  order: number;
  isPrimary: boolean;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  category: string;
  origin: string;
  location: string;
  saleType: string;
  deliveryAvailable: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[] | string;
  seller: Seller;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const routerLocation = useLocation();
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("");
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [isContactingSeller, setIsContactingSeller] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [isLoadingSellerProducts, setIsLoadingSellerProducts] = useState(false);

  // Reviews section state
  const [activeTab, setActiveTab] = useState<'reviews' | 'items'>('reviews');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('The most relevant');
  const [userRating, setUserRating] = useState(0);
  const [userReviewText, setUserReviewText] = useState('');
  const [reviewHelpfulness, setReviewHelpfulness] = useState<{ [key: string]: 'yes' | 'no' | null }>({});
  const [reviewHelpfulCounts, setReviewHelpfulCounts] = useState<{ [key: string]: { yes: number; no: number } }>({
    review1: { yes: 27, no: 2 },
    review2: { yes: 15, no: 3 },
    review3: { yes: 8, no: 12 }
  });
  const [expandedDiscussions, setExpandedDiscussions] = useState<{ [key: string]: boolean }>({});
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const [isReviewPosted, setIsReviewPosted] = useState(false);
  const [postedReview, setPostedReview] = useState<{ rating: number; text: string; date: string } | null>(null);
  const { addToast } = useToast();

  // Filter options
  const filterOptions = [
    { id: 'relevant', label: 'The most relevant', description: 'Show most engaging reviews first', icon: 'star' },
    { id: 'newest', label: 'Newest', description: 'Show newest reviews first', icon: 'clock' }
  ];

  // Function to handle filter selection
  const handleFilterSelect = (filterId: string) => {
    const filter = filterOptions.find(f => f.id === filterId);
    if (filter) {
      setSelectedFilter(filter.label);
    }
    setFilterDropdownOpen(false);
  };

  const handleDiscussionToggle = (reviewId: string) => {
    setExpandedDiscussions(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleHelpfulnessClick = (itemId: string, choice: 'yes' | 'no') => {
    setReviewHelpfulness(prevSelection => {
      const currentSelection = prevSelection[itemId];
      const nextSelection = currentSelection === choice ? null : choice;

      if (currentSelection !== choice) {
        setReviewHelpfulCounts(prevCounts => {
          const existing = prevCounts[itemId] || { yes: 0, no: 0 };
          return {
            ...prevCounts,
            [itemId]: {
              ...existing,
              [choice]: existing[choice] + 1
            }
          };
        });
      }

      return { ...prevSelection, [itemId]: nextSelection };
    });
  };

  const BookmarkIcon = ({ saved }: { saved: boolean }) => (
    <div className="w-4 h-4 relative flex items-center justify-center">
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        {!saved && (
          <>
            <path
              d="M12.0837 8.87549H7.91699"
              stroke="#BABABA"
              strokeWidth="1.25"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 6.8418V11.0085"
              stroke="#BABABA"
              strokeWidth="1.25"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
        <path
          d="M14.0166 1.6665H5.98327C4.20827 1.6665 2.7666 3.1165 2.7666 4.88317V16.6248C2.7666 18.1248 3.8416 18.7582 5.15827 18.0332L9.22493 15.7748C9.65827 15.5332 10.3583 15.5332 10.7833 15.7748L14.8499 18.0332C16.1666 18.7665 17.2416 18.1332 17.2416 16.6248V4.88317C17.2333 3.1165 15.7916 1.6665 14.0166 1.6665Z"
          stroke={saved ? '#64B5F6' : '#BABABA'}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={saved ? '#64B5F6' : 'none'}
        />
      </svg>
      {saved && (
        <svg className="w-2 h-2 absolute text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  );

  const renderHelpfulnessControls = (
    itemId: string,
    questionText = 'Was this review helpful to you?',
    alignment: 'left' | 'right' = 'left',
    fullWidth = false
  ) => {
    const selection = reviewHelpfulness[itemId];
    const counts = reviewHelpfulCounts[itemId] || { yes: 0, no: 0 };

    return (
      <div
        className={`flex items-center space-x-3 ${fullWidth ? 'w-full' : ''} ${alignment === 'right' ? 'justify-end' : 'justify-start'}`}
      >
        {!selection && (
          <span className="text-xs" style={{ color: '#212121' }}>
            {questionText}
          </span>
        )}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleHelpfulnessClick(itemId, 'yes')}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full transition-colors"
            style={{
              border: `1px solid ${selection === 'yes' ? '#F0F8FE' : '#E1E1E1'}`,
              backgroundColor: selection === 'yes' ? '#F0F8FE' : 'white'
            }}
          >
            <span className="text-xs" style={{ color: selection === 'yes' ? '#64B5F6' : '#6A6A6A' }}>
              {selection ? counts.yes : 'Yes'}
            </span>
            <img
              src={likeIcon}
              alt="Like"
              className="w-3.5 h-3.5"
              style={{
                filter: selection === 'yes'
                  ? 'brightness(0) saturate(100%) invert(60%) sepia(89%) saturate(1726%) hue-rotate(183deg) brightness(97%) contrast(92%)'
                  : 'none'
              }}
            />
          </button>
          <button
            onClick={() => handleHelpfulnessClick(itemId, 'no')}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full transition-colors"
            style={{
              border: `1px solid ${selection === 'no' ? '#F0F8FE' : '#E1E1E1'}`,
              backgroundColor: selection === 'no' ? '#F0F8FE' : 'white'
            }}
          >
            <span className="text-xs" style={{ color: selection === 'no' ? '#64B5F6' : '#6A6A6A' }}>
              {selection ? counts.no : 'No'}
            </span>
            <img
              src={dislikeIcon}
              alt="Dislike"
              className="w-3.5 h-3.5"
              style={{
                filter: selection === 'no'
                  ? 'brightness(0) saturate(100%) invert(60%) sepia(89%) saturate(1726%) hue-rotate(183deg) brightness(97%) contrast(92%)'
                  : 'none'
              }}
            />
          </button>
        </div>
      </div>
    );
  };

  // Get product images
  const getProductImages = (product: Product | null) => {
    const defaultImages = [mainImage, thumbnailImage1, thumbnailImage2, thumbnailImage3];

    if(!product?.images) return defaultImages;

    try {
      const imagesArray: ProductImage[] = typeof product.images === 'string'
      ? JSON.parse(product.images)
      : product.images;

      if(Array.isArray(imagesArray) && imagesArray.length > 0) {
        return imagesArray.map((img:ProductImage) => img.url);
      }
    } catch (error) {
      console.error('Error parsing product images:', error);
    }

    return defaultImages;
  }

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID is required");
        setIsLoading(false);
        return
      }

      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${id}`, {
          headers: token ? {
            'Authorization': `Bearer ${token}`
          } : {}
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Product not found");
          }
          throw new Error(`Failed to fetch product: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setProduct(result.data);
        } else {
          throw new Error("Invalid product data received");
        }
      } catch (error: any) {
        setError(error.message || "Failed to load product");
        addToast({
          type: 'error',
          title: 'Error',
          message: error.message || "Failed to load product details",
          duration: 2000
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, addToast]);

  // fetch seller's products
  useEffect(() => {
    const fetchSellerProducts = async () => {
      if (!product?.seller?.id) return;

      try {
        setIsLoadingSellerProducts(true);
        const token = localStorage.getItem("accessToken");

        // Use the user products endpoint from your routes
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/products/user/${product.seller.id}?limit=12&exclude=${product.id}`,
          {
            headers: token ? {
              'Authorization': `Bearer ${token}`
            } : {}
          }
        );

        if (response.ok) {
          const result = await response.json();

          if (result.success && result.data) {
            // Handle different possible response structures
            const products = result.data.products || result.data || [];
            setSellerProducts(products);
          } else {
            setSellerProducts([]);
          }
        } else {
          setSellerProducts([]);
        }
      } catch (error) {
        setSellerProducts([]);
      } finally {
        setIsLoadingSellerProducts(false);
      }
    };

    if (product?.seller?.id) {
      fetchSellerProducts();
    }
  }, [product?.seller?.id, product?.id]);

  const images = getProductImages(product);


  // format published data
  const getPublishedDate = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Published 1 day ago";
    if (diffDays <= 7) return `Published ${diffDays} days ago`;
    if (diffDays <= 30) return `Published ${Math.ceil(diffDays / 7)} weeks ago`;
    return `Published ${Math.ceil(diffDays / 30)} months ago`;
  };

  // Safe seller access functions
  const getSellerName = (seller: Seller | undefined): string => {
    if (!seller) return "Unknown Seller";
    return `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || seller?.email.split("@")[0] || "Unknown Seller";
  };

  const getSellerProfileImage = (seller: Seller | undefined): string => {
    return seller?.profileImage || sellerAvatar;
  };

  const getSellerRating = (seller: Seller | undefined): number => {
    return seller?.rating || 4.8;
  };

  const getSellerLocation = (seller: Seller | undefined): string => {
    return seller?.location || "Unknown location";
  };

  const isSellerVerified = (seller: Seller | undefined): boolean => {
    return seller?.verified || false;
  };

  // Share product handler
  const handleShareProduct = async (productId: string) => {
    const newSet = new Set(sharedProducts);
    if (newSet.has(productId)) {
      newSet.delete(productId);
    } else {
      newSet.add(productId);

      // Share functionality
      const shareData = {
        title: product ? `Check out ${product.title} on BaoAfrik` : 'Check out this product on BaoAfrik',
        text: product ? `${product.description}` : 'I found this amazing product on BaoAfrik marketplace',
        url: window.location.href,
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          // Fallback: copy to clipboard
          await navigator.clipboard.writeText(window.location.href);
          addToast({
            type: "success",
            title: "Link Copied",
            message: "Product link copied to clipboard",
            duration: 2000,
          });
        }
      } catch (error) {
        addToast({
          type: 'error',
          title: "Share failed",
          message: "Failed to share product",
          duration: 2000
        });
      }
    }
    setSharedProducts(newSet);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/products/${product?.id}/save`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setIsSaved(!isSaved);
        addToast({
          type: "success",
          title: isSaved ? "Removed from saved" : "Product saved",
          message: isSaved
            ? "Product removed from your saved items"
            : "Product added to your saved items",
          duration: 2000,
        });
      } else {
        throw new Error("Failed to save product");
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: "Save Failed",
        message: "Failed to save product. Please try again.",
        duration: 2000,
      });
    }
  };

  const handleShare = async () => {
    if (product) {
      await handleShareProduct(product.id);
      setIsShared(!isShared);
    }
  };

  const toggleAdditionalInfo = () => {
    setShowAdditionalInfo(!showAdditionalInfo);
  };

  const handleContactSeller = async () => {
    if (!product || !product.seller) {
      addToast({
        type: 'error',
        title: "Error",
        message: "Seller information not available",
        duration: 2000
      });
      return;
    }

    try {
      setIsContactingSeller(true);

      // check for existing conversation with this seller
      const existingConversation = conversations.find(conv =>
        conv.participant?.id === product.seller.id
      );

      const productDataToSend = {
        id: product.id,
        name: product.title,
        price: product.price,
        location: product.location,
        category: product.category,
        description: product.description,
        images: getProductImages(product),
        seller: {
          id: product.seller.id,
          name: getSellerName(product.seller),
          email: product.seller.email,
          avatar: getSellerProfileImage(product.seller),
          rating: getSellerRating(product.seller),
          location: getSellerLocation(product.seller),
        },
      };

      let targetConversationId: string;

      if (existingConversation) {
        targetConversationId = existingConversation.id;
      } else {
        const token = localStorage.getItem("accessToken");

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/chat/contact-seller`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              productId: product.id,
              sellerId: product.seller.id
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          const errorMessage =
            result?.error ||
            result?.message ||
            result?.data?.error ||
            'Failed to contact seller';
          throw new Error(errorMessage);
        }

        if (result.success) {
          targetConversationId = result.data.conversation.id;
        } else {
          const errorMessage =
            result?.error ||
            result?.message ||
            'Failed to contact seller';
          throw new Error(errorMessage);
        }
      }

      navigate("/messages", {
        state: {
          conversationId: targetConversationId,
          productData: productDataToSend,
          preFilledMessage: `Hi, I'm interested in your product "${product.title}". Is it still available?`,
          isProductInquiry: true,
          shouldOpenConversation: true
        },
        replace: false
      });

    } catch (error: any) {
      if (
        error.message.includes("Authentication failed") ||
        error.message.includes("Please log in again")
      ) {
        return;
      }

      let errorMessage = "Failed to contact seller. Please try again.";

      if (error.message.includes("User not found")) {
        errorMessage = "Seller not found. Please try again later.";
      } else if (error.message.includes("Cannot create conversation with yourself")) {
        errorMessage = "You cannot contact yourself.";
      } else if (error.message.includes("Invalid access token")) {
        errorMessage = "You need to login to chat with a seller."
      }

      addToast({
        type: 'error',
        title: "Cannot contact seller",
        message: errorMessage,
        duration: 2000,
      });
    } finally {
      setIsContactingSeller(false);
    }
  };

  const handleSellerProfileClick = () => {
    if (product?.seller) {
      const sellerSlug = `${product.seller.firstName} ${product.seller.lastName}`
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      sessionStorage.setItem(`seller_${sellerSlug}_data`, JSON.stringify(product.seller));
      sessionStorage.setItem(`seller_${sellerSlug}_id`, product.seller.id);

      navigate(`/seller/${sellerSlug}`);
    }
  };

  const reviewDiscussionData: { [key: string]: Array<{ id: string; author: string; role?: string; date: string; text: string; isOwner?: boolean; avatar?: string }> } = {
    review1: [
      {
        id: 'review1-comment1',
        author: `${product?.seller.firstName} ${product?.seller.lastName}`,
        role: 'Product Owner',
        date: '2 Jan 2025',
        text: 'I am glad the flavor worked well for your dishes, Samine. Each batch is sourced carefully so you can count on the same aroma every time.',
        isOwner: true,
        avatar: product?.seller.profileImage || sellerAvatar
      }
    ],
    review2: [
      {
        id: 'review2-comment1',
        author: 'Ibrahim Kalu',
        date: '13 Dec 2024',
        text: 'Thanks for the detailed feedback, Kael! I also noticed the aroma lingers nicely when simmered slowly.',
        avatar: sellerAvatar
      },
      {
        id: 'review2-comment2',
        author: `${product?.seller.firstName} ${product?.seller.lastName}`,
        role: 'Product Owner',
        date: '13 Dec 2024',
        text: 'Happy you enjoyed it, Kael. Feel free to reach out if you ever need larger quantities for your kitchen.',
        isOwner: true,
        avatar: product?.seller.profileImage || sellerAvatar
      },
      {
        id: 'review2-comment3',
        author: 'Ada Ifeoma',
        date: '14 Dec 2024',
        text: 'Totally agree—shipping was quick for me too. Perfect for soups!',
        avatar: sellerAvatar
      }
    ],
    review3: [
      {
        id: 'review3-comment1',
        author: `${product?.seller.firstName} ${product?.seller.lastName}`,
        role: 'Product Owner',
        date: '9 Nov 2024',
        text: 'Thanks for sharing, Alex. I can offer a bolder batch next time—send me a message and I will make it right.',
        isOwner: true,
        avatar: product?.seller.profileImage || sellerAvatar
      },
      {
        id: 'review3-comment2',
        author: 'Chinedu Bassey',
        date: '10 Nov 2024',
        text: 'I had a stronger flavor experience, maybe try it freshly ground. It made a difference for me.',
        avatar: sellerAvatar
      }
    ]
  };

  const handleWishlist = async (productId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const method = wishlistProducts.has(productId) ? "DELETE" : "POST";

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/wishlist/${productId}`,
        {
          method,
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setWishlistProducts((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(productId)) {
            newSet.delete(productId);
          } else {
            newSet.add(productId);
          }
          return newSet;
        });

        addToast({
          type: "success",
          title: wishlistProducts.has(productId) ? "Removed from wishlist" : "Added to wishlist",
          message: wishlistProducts.has(productId)
            ? "Product removed from your wishlist"
            : "Product added to your wishlist",
          duration: 2000,
        });
      } else {
        throw new Error("Failed to update wishlist");
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: "Wishlist Failed",
        message: "Failed to update wishlist. Please try again.",
        duration: 2000,
      });
    }
  };

  const handleOtherProductsNext = () => {
    setCurrentOtherProductsIndex((prev) => (prev + 1) % 4);
  };

  const handleOtherProductsPrev = () => {
    setCurrentOtherProductsIndex((prev) => (prev - 1 + 4) % 4);
  };

  const handleRecommendedNext = () => {
    setCurrentRecommendedIndex((prev) => (prev + 1) % 4);
  };

  const handleRecommendedPrev = () => {
    setCurrentRecommendedIndex((prev) => (prev - 1 + 4) % 4);
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (searchQuery) searchParams.set("q", searchQuery);
    if (selectedCategory) searchParams.set("category", selectedCategory);
    if (location) searchParams.set("location", location);

    navigate(`/?${searchParams.toString()}`);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="lg" color="orange" />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || "Product not found"}
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

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
                {product.title}
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
            alt={product.title}
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
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${isSaved ? 'bg-orange-500 text-white' : 'bg-white bg-opacity-90 text-gray-700'
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
                className={`w-2 h-2 rounded-full transition-all ${selectedImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
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
                  alt={product.title}
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
                    className={`relative w-[56px] h-[56px] rounded-lg overflow-hidden ${selectedImageIndex === index ? 'border-2' : ''
                      }`}
                    style={selectedImageIndex === index ? { borderColor: '#9E9E9E' } : {}}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
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
                  {product.title}
                </h1>
                <span className="font-light" style={{ fontSize: '11px', color: '#6A6A6A', marginLeft: '480px', whiteSpace: 'nowrap' }}>
                  {getPublishedDate(product.createdAt)}
                </span>
              </div>

              {/* Price */}
              <div className="mb-8" style={{ fontSize: '28px', color: '#212121', fontWeight: 600, fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                {product.currency} {product.price}
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
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl transition-colors hover:opacity-80 relative"
                  style={{
                    backgroundColor: isSaved ? '#F0F8FE' : '#F4F4F4',
                    color: isSaved ? '#64B5F6' : '#6A6A6A',
                    fontSize: '13px',
                    fontWeight: 500,
                    width: 'fit-content'
                  }}
                >
                  <BookmarkIcon saved={isSaved} />
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
                {product.description}
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
                      src={product?.seller.profileImage || sellerAvatar}
                      alt={`${product?.seller.firstName} ${product?.seller.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Seller Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm" style={{ color: '#212121' }}>
                        {`${product?.seller.firstName} ${product?.seller.lastName}`}
                      </span>
                      {isSellerVerified(product.seller) ? (
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
                          fill={i < Math.floor(product?.seller.rating ?? 4.3) ? '#F9A825' : '#E9E9E9'}
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
                  onClick={handleSellerProfileClick}
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
              <h1 className="text-lg font-bold text-gray-900 mb-0">{product.title}</h1>
            </div>

            {/* Right side - Date, Category */}
            <div className="flex flex-col items-end text-right">
              <div className="text-xs text-black mb-1">Published 2 days ago</div>
              <div className="text-xs font-medium mb-4" style={{ color: '#F9A825' }}>Category: Spices</div>
            </div>
          </div>

          {/* Location and Save Button Row */}
          <div className="flex items-center justify-between -mt-1 -ml-1">
            <div className="flex items-center text-gray-500 text-sm">
              <svg className="w-4 h-4 mr-1 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span className="whitespace-nowrap">{product.location}</span>
            </div>

            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-lg border transition-colors ${isSaved
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

        {/* See Seller Profile button*/}
        <div
          className="mb-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-3 -mx-3"
          onClick={handleSellerProfileClick}
        >
          <div className="flex items-center space-x-3 mb-2">
            <img
              src={product?.seller.profileImage || sellerAvatar}
              alt={`${product?.seller.firstName} ${product?.seller.lastName}`}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-medium text-gray-900">{`${product?.seller.firstName} ${product?.seller.lastName}`}</div>
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
          style={{ backgroundColor: '#F9A825' }}
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
      <div className="bg-white mt-8">
        {/* Tab Navigation */}
        {product.seller.verified ? (
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
        ) : (
          <div className="max-w-7xl mx-auto px-6 pb-4">
            <h2 className="text-3xl font-semibold" style={{ color: '#000000', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              Reviews and ratings
            </h2>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 py-4 mt-4">

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
                      <line x1="3" y1="6" x2="17" y2="6" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="10" cy="6" r="2" fill="#FFF" stroke="#6A6A6A" strokeWidth="1.5" />
                      <line x1="3" y1="14" x2="17" y2="14" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="10" cy="14" r="2" fill="#FFF" stroke="#6A6A6A" strokeWidth="1.5" />
                    </svg>
                    <span className="text-sm">{selectedFilter}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {filterDropdownOpen && (
                    <div className="absolute top-8 left-0 bg-white border border-gray-200 shadow-lg z-10 p-2" style={{ borderRadius: '12px', minWidth: '280px' }}>
                      {filterOptions.map((option, index) => {
                        const isSelected = selectedFilter === option.label;
                        return (
                          <button
                            key={option.id}
                            onClick={() => handleFilterSelect(option.id)}
                            className="w-full text-left px-3 py-3 transition-colors flex items-start space-x-3"
                            style={{
                              backgroundColor: isSelected ? '#F0F8FE' : 'transparent',
                              borderRadius: isSelected ? '10px' : '0',
                              marginBottom: index < filterOptions.length - 1 ? '4px' : '0'
                            }}
                          >
                            {/* Icon */}
                            <div className="flex-shrink-0 mt-0.5">
                              {option.icon === 'star' ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isSelected ? '#64B5F6' : '#212121'} strokeWidth="2">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                              ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isSelected ? '#64B5F6' : '#212121'} strokeWidth="2">
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M12 6v6l4 2" />
                                </svg>
                              )}
                            </div>

                            {/* Text */}
                            <div className="flex-1">
                              <div className="text-sm font-medium mb-0.5" style={{ color: isSelected ? '#64B5F6' : '#212121' }}>
                                {option.label}
                              </div>
                              <div className="text-xs" style={{ color: '#939393' }}>
                                {option.description}
                              </div>
                            </div>
                          </button>
                        );
                      })}
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
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg key={star} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      {renderHelpfulnessControls('review1')}
                      <button
                        className="text-xs hover:underline"
                        style={{ color: '#64B5F6' }}
                        onClick={() => handleDiscussionToggle('review1')}
                      >
                        {expandedDiscussions.review1 ? 'View less' : `View the discussion (${reviewDiscussionData.review1?.length || 0})`}
                      </button>
                    </div>
                    {expandedDiscussions.review1 && reviewDiscussionData.review1 && (
                      <div className="mt-4 space-y-4">
                        {reviewDiscussionData.review1.map((comment) => (
                          <div key={comment.id} className="flex space-x-3">
                            <div className="w-px self-stretch" style={{ backgroundColor: '#E1E1E1' }} />
                            <div className="flex-1 pl-4">
                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                  {comment.avatar ? (
                                    <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />
                                  ) : (
                                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-semibold text-gray-900">{comment.author}</span>
                                      {comment.isOwner && (
                                        <span className="text-[10px] font-medium px-2 py-0.5" style={{ backgroundColor: '#F0F8FE', color: '#64B5F6', borderRadius: '4px' }}>
                                          {comment.role || 'Product Owner'}
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-xs" style={{ color: '#939393' }}>{comment.date}</span>
                                  </div>
                                  <p className="text-sm leading-relaxed mt-1" style={{ color: '#939393' }}>{comment.text}</p>
                                </div>
                              </div>
                              <div className="mt-3 pl-12">
                                {renderHelpfulnessControls(comment.id, 'Was this review helpful to you?')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg key={star} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      {renderHelpfulnessControls('review2')}
                      <button
                        className="text-xs hover:underline"
                        style={{ color: '#64B5F6' }}
                        onClick={() => handleDiscussionToggle('review2')}
                      >
                        {expandedDiscussions.review2 ? 'View less' : `View the discussion (${reviewDiscussionData.review2?.length || 0})`}
                      </button>
                    </div>
                    {expandedDiscussions.review2 && reviewDiscussionData.review2 && (
                      <div className="mt-4 space-y-4">
                        {reviewDiscussionData.review2.map((comment) => (
                          <div key={comment.id} className="flex space-x-3">
                            <div className="w-px self-stretch" style={{ backgroundColor: '#E1E1E1' }} />
                            <div className="flex-1 pl-4">
                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                  {comment.avatar ? (
                                    <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />
                                  ) : (
                                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-semibold text-gray-900">{comment.author}</span>
                                      {comment.isOwner && (
                                        <span className="text-[10px] font-medium px-2 py-0.5" style={{ backgroundColor: '#F0F8FE', color: '#64B5F6', borderRadius: '4px' }}>
                                          {comment.role || 'Product Owner'}
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-xs" style={{ color: '#939393' }}>{comment.date}</span>
                                  </div>
                                  <p className="text-sm leading-relaxed mt-1" style={{ color: '#939393' }}>{comment.text}</p>
                                </div>
                              </div>
                              <div className="mt-3 pl-12">
                                {renderHelpfulnessControls(comment.id, 'Was this review helpful to you?')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                              {[1, 2].map((star) => (
                                <svg key={star} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                              ))}
                              {[1, 2, 3].map((star) => (
                                <svg key={`empty-${star}`} className="w-3.5 h-3.5 text-gray-300 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      {renderHelpfulnessControls('review3')}
                      <button
                        className="text-xs hover:underline"
                        style={{ color: '#64B5F6' }}
                        onClick={() => handleDiscussionToggle('review3')}
                      >
                        {expandedDiscussions.review3 ? 'View less' : `View the discussion (${reviewDiscussionData.review3?.length || 0})`}
                      </button>
                    </div>
                    {expandedDiscussions.review3 && reviewDiscussionData.review3 && (
                      <div className="mt-4 space-y-4">
                        {reviewDiscussionData.review3.map((comment) => (
                          <div key={comment.id} className="flex space-x-3">
                            <div className="w-px self-stretch" style={{ backgroundColor: '#E1E1E1' }} />
                            <div className="flex-1 pl-4">
                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                  {comment.avatar ? (
                                    <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />
                                  ) : (
                                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-semibold text-gray-900">{comment.author}</span>
                                      {comment.isOwner && (
                                        <span className="text-[10px] font-medium px-2 py-0.5" style={{ backgroundColor: '#F0F8FE', color: '#64B5F6', borderRadius: '4px' }}>
                                          {comment.role || 'Product Owner'}
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-xs" style={{ color: '#939393' }}>{comment.date}</span>
                                  </div>
                                  <p className="text-sm leading-relaxed mt-1" style={{ color: '#939393' }}>{comment.text}</p>
                                </div>
                              </div>
                              <div className="mt-3 pl-12">
                                {renderHelpfulnessControls(comment.id, 'Was this review helpful to you?')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div className="text-sm mb-8" style={{ color: '#6A6A6A' }}>Review & Rates (456)</div>

                  {/* Rating Bars */}
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-yellow-400 h-1 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-yellow-400 h-1 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-yellow-400 h-1 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-yellow-400 h-1 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-yellow-400 h-1 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Give Your Opinion Section */}
                <div className="pt-24 text-center">
                  {!isReviewPosted ? (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Give your opinion</h3>
                      <p className="text-xs mb-6" style={{ color: '#B0B0B0' }}>Share your opinion about this product and help others learn a bit more about it.</p>

                      {/* Star Rating Input */}
                      <div className="flex items-center justify-center space-x-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
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

                      {/* Give a note text/rating */}
                      <div className="text-center mb-6" style={{
                        color: userRating > 0 ? '#64B5F6' : (userReviewText.length > 0 ? '#64B5F6' : '#D9D9D9'),
                        fontSize: '10px'
                      }}>
                        {userRating > 0 ? `${userRating}.0` : 'give a note'}
                      </div>

                      {/* Review Text Input */}
                      <div className="flex items-center space-x-3 mb-4 pl-8">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 self-start mt-2">
                          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <style dangerouslySetInnerHTML={{
                          __html: `
                        .custom-placeholder::placeholder {
                          color: #D9D9D9;
                          opacity: 1;
                        }
                        .custom-placeholder::-webkit-scrollbar {
                          display: none;
                        }
                        .custom-placeholder {
                          -ms-overflow-style: none;
                          scrollbar-width: none;
                        }
                      `}} />
                        <textarea
                          value={userReviewText}
                          onChange={(e) => {
                            if (e.target.value.length <= 1000) {
                              setUserReviewText(e.target.value);
                            }
                          }}
                          placeholder="What do you think of this product?"
                          className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none custom-placeholder"
                          style={{
                            border: 'none',
                            minHeight: '80px',
                            color: '#939393',
                            backgroundColor: 'transparent'
                          }}
                          maxLength={1000}
                        />
                      </div>

                      {/* Post Review Button */}
                      <div className="pl-8 relative mt-4">
                        <button
                          onClick={() => {
                            if (userRating > 0 && userReviewText.trim()) {
                              const today = new Date();
                              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                              const dateStr = `${today.getDate()} ${months[today.getMonth()]}, ${today.getFullYear()}`;
                              setPostedReview({
                                rating: userRating,
                                text: userReviewText,
                                date: dateStr
                              });
                              setIsReviewPosted(true);
                            }
                          }}
                          className="w-full py-2.5 rounded-lg font-medium transition-all mt-12 relative"
                          style={{
                            backgroundColor: userRating > 0 ? '#FBBC05' : '#F4F4F4',
                            color: userRating > 0 ? 'white' : '#6A6A6A'
                          }}
                          disabled={userRating === 0}
                        >
                          Post the review
                          {/* Character Counter */}
                          {userReviewText.length > 0 && (
                            <div
                              className="absolute"
                              style={{
                                top: '-26px',
                                right: '0',
                                color: '#64B5F6',
                                fontSize: '12px'
                              }}
                            >
                              {userReviewText.length}/1000
                            </div>
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Thank You State */}
                      <div className="mb-6 text-center">
                        <h3 className="text-2xl font-semibold" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', color: '#939393' }}>
                          Thank you for your<br />feedback. 😊
                        </h3>
                      </div>

                      {/* Posted Review Card */}
                      <div className="border rounded-3xl text-left mx-auto" style={{ borderColor: '#E1E1E1', maxWidth: '500px' }}>
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start space-x-3">
                              {/* Avatar */}
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                              </div>

                              <div>
                                {/* Name */}
                                <h4 className="font-semibold mb-1" style={{ color: '#0E0E0E', fontSize: '14px' }}>You</h4>

                                {/* Star Rating */}
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <svg
                                        key={star}
                                        className="w-3 h-3 fill-current"
                                        style={{ color: star <= (postedReview?.rating || 0) ? '#FBBC05' : '#E9E9E9' }}
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                      </svg>
                                    ))}
                                  </div>
                                  <span className="text-xs" style={{ color: '#939393' }}>{postedReview?.rating}.0</span>
                                </div>
                              </div>
                            </div>

                            {/* Edit Button and Date */}
                            <div className="flex flex-col items-end space-y-1.5 flex-shrink-0">
                              <button
                                onClick={() => {
                                  setIsReviewPosted(false);
                                  // Keep the rating and text so user can edit
                                }}
                                className="flex items-center space-x-1.5 px-2.5 py-1 border rounded-lg transition-colors hover:bg-gray-50"
                                style={{ borderColor: '#D9D9D9' }}
                              >
                                <img src={pencilIcon} alt="Edit" className="w-3 h-3" />
                                <span className="text-xs" style={{ color: '#6A6A6A' }}>Edit</span>
                              </button>
                              <span className="text-[10px] whitespace-nowrap" style={{ color: '#B0B0B0' }}>{postedReview?.date}</span>
                            </div>
                          </div>

                          {/* Review Text - Spans full width below */}
                          <p className="text-sm leading-relaxed" style={{ color: '#939393', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                            {postedReview?.text}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* You May Also Like Section - Below Reviews */}
          {activeTab === 'reviews' && (
            <div className="mt-12">
              <h2 className="text-2xl font-medium text-gray-900 mb-6" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                You may also like
              </h2>

              {/* Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-5 md:gap-6">
                {/* Product cards 1-12 */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((productNum) => (
                  <Link key={productNum} to={`/product/${productNum}`} className="bg-white rounded-lg overflow-hidden transition-all duration-200 block group">
                    <div className="aspect-square relative overflow-hidden mb-1 sm:mb-2" style={{ borderRadius: '12px' }}>
                      <img
                        src={[pre1, pre2, pre3, pre4, pre5, pre6][productNum % 6]}
                        alt={`Product ${productNum}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        style={{ borderRadius: '12px' }}
                      />
                      <div className="absolute bg-white rounded-md shadow-sm" style={{
                        display: 'flex',
                        padding: '2px 6px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '4px',
                        top: '8px',
                        left: '8px'
                      }}>
                        <img
                          src={getProductCountry(productNum).flag}
                          alt={getProductCountry(productNum).name}
                          style={{
                            width: '14px',
                            height: '14px',
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                        />
                        <span className="font-medium text-gray-800" style={{ fontSize: '12px' }}>
                          {getProductCountry(productNum).abbreviation}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col" style={{ padding: '0 12px 12px 12px' }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                        <div className="font-semibold text-gray-900" style={{ fontSize: '16px' }}>
                          USD 31.7
                        </div>
                        <div className="flex items-center text-green-600 bg-green-50 rounded" style={{
                          display: 'flex',
                          padding: '1px 4px',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '1px',
                          fontSize: '9px'
                        }}>
                          <img src={verifyIcon} alt="Verified" style={{ width: '8px', height: '8px' }} />
                          <span>Verified seller</span>
                        </div>
                      </div>
                      <h3 className="line-clamp-2 font-medium" style={{
                        fontSize: '13px',
                        color: '#212121',
                        marginBottom: '4px'
                      }}>Product Name</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-500 flex-1">
                          <img src={locationIcon} alt="Location" className="flex-shrink-0" style={{
                            width: '10px',
                            height: '10px',
                            marginRight: '4px'
                          }} />
                          <span className="truncate font-normal" style={{ fontSize: '10px' }}>London, United Kingdom</span>
                        </div>
                        <div style={{ marginLeft: '8px' }}>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const newSet = new Set(wishlistProducts);
                              if (newSet.has(`reviews-product-${productNum}`)) {
                                newSet.delete(`reviews-product-${productNum}`);
                              } else {
                                newSet.add(`reviews-product-${productNum}`);
                              }
                              setWishlistProducts(newSet);
                            }}
                            className="transition-colors touch-manipulation"
                            style={{
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <img src={bookmarkIcon} alt="Bookmark" style={{
                              width: '20px',
                              height: '20px',
                              filter: wishlistProducts.has(`reviews-product-${productNum}`) ? 'none' : 'grayscale(100%) opacity(0.5)'
                            }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Seller Items Content */}
          {product.seller.verified && activeTab === 'items' && (
            <>
              {isLoadingSellerProducts ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="md" color="orange" />
                </div>
              ) : sellerProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-5 md:gap-6">
                  {sellerProducts.map((sellerProduct) => (
                    <Link
                      key={sellerProduct.id}
                      to={`/product/${sellerProduct.id}`}
                      className="bg-white rounded-lg overflow-hidden transition-all duration-200 block group"
                    >
                      <div className="aspect-square relative overflow-hidden mb-1 sm:mb-2" style={{ borderRadius: '12px' }}>
                        <img
                          src={getProductImages(sellerProduct)[0]}
                          alt={sellerProduct.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          style={{ borderRadius: '12px' }}
                          onError={(e) => {
                            e.currentTarget.src = pre1; // Fallback image
                          }}
                        />
                        <div className="absolute bg-white rounded-md shadow-sm" style={{
                          display: 'flex',
                          padding: '2px 6px',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '4px',
                          top: '8px',
                          left: '8px'
                        }}>
                          <img
                            src={getProductCountry(parseInt(sellerProduct.id) || 1).flag}
                            alt={getProductCountry(parseInt(sellerProduct.id) || 1).name}
                            style={{
                              width: '14px',
                              height: '14px',
                              objectFit: 'cover',
                              borderRadius: '50%'
                            }}
                          />
                          <span className="font-medium text-gray-800" style={{ fontSize: '12px' }}>
                            {getProductCountry(parseInt(sellerProduct.id) || 1).abbreviation}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col" style={{ padding: '0 12px 12px 12px' }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                          <div className="font-semibold text-gray-900" style={{ fontSize: '16px' }}>
                            {sellerProduct.currency} {sellerProduct.price}
                          </div>
                          {sellerProduct.seller?.verified && (
                            <div className="flex items-center text-green-600 bg-green-50 rounded" style={{
                              display: 'flex',
                              padding: '1px 4px',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: '1px',
                              fontSize: '9px'
                            }}>
                              <img src={verifyIcon} alt="Verified" style={{ width: '8px', height: '8px' }} />
                              <span>Verified</span>
                            </div>
                          )}
                        </div>
                        <h3 className="line-clamp-2 font-medium" style={{
                          fontSize: '13px',
                          color: '#212121',
                          marginBottom: '4px'
                        }}>{sellerProduct.title}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-500 flex-1">
                            <img src={locationIcon} alt="Location" className="flex-shrink-0" style={{
                              width: '10px',
                              height: '10px',
                              marginRight: '4px'
                            }} />
                            <span className="truncate font-normal" style={{ fontSize: '10px' }}>
                              {sellerProduct.location}
                            </span>
                          </div>
                          <div style={{ marginLeft: '8px' }}>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleWishlist(sellerProduct.id);
                              }}
                              className="transition-colors touch-manipulation"
                              style={{
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <img src={bookmarkIcon} alt="Bookmark" style={{
                                width: '20px',
                                height: '20px',
                                filter: wishlistProducts.has(sellerProduct.id) ? 'none' : 'grayscale(100%) opacity(0.5)'
                              }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No other products from this seller</p>
                </div>
              )}
            </>
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
              {/* Product Picture - Half Outside Modal */}
              <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '-40px' }}>
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center shadow-lg border-4 border-white overflow-hidden">
                  <img
                    src={images[selectedImageIndex]}
                    alt={product.title}
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
